# PRD: Novel Setup Skill（项目级小说创作工具安装器）

> 模板来源：`requirement-workflow/templates/prd-full.md`
> 研究方法：`requirement-workflow/SKILL.md#研究阶段`

---

## 1. 背景与目标

### 1.1 为什么不做全局同步，改用项目级安装器模式

- **Claude Code 的加载规则**：项目级 `.claude/commands/` 会覆盖全局 `~/.claude/commands/`。如果直接把小说命令全局安装，用户无法在不同项目里独立启用/禁用这套工具。
- **避免污染全局命名空间**：小说创作工具集包含 4 个命令，可能与其他全局命令冲突。项目级分发让用户只在需要的小说项目里加载它们。
- **支持模板自定义**：项目级安装后，用户可以在项目内修改 `.claude/templates/` 或 `CLAUDE.md`，而不影响全局配置。
- **更灵活的更新机制**：用户不需要维护一个全局仓库与一个项目仓库，只需在当前配置库更新 skill，然后重新运行安装命令，即可把最新文件同步到任意项目。

### 1.2 核心目标

提供一个**全局 skill**（名称待定），用户运行一次命令后，它会将小说创作所需的 agents、commands、skills、templates 复制到**当前项目**的 `.claude/` 目录下，实现“即装即用”。

---

## 2. 范围定义

### 2.1 属于安装器 skill 本身的内容

这些内容将存放在当前配置库 `claude-code-configs` 中，并最终进入用户全局 `~/.claude/skills/`：

- skill 自己的 `SKILL.md`（主文件）
- skill 附属的模板文件（用于分发到项目 `.claude/`）
- skill 的元数据（frontmatter、描述）

### 2.2 属于被分发的模板内容

这些内容由安装器 skill 持有，但安装后会被复制到项目 `.claude/`：

- **7 个 agents**：`novel-editor.md`、`novel-writer.md`、`novel-proofreader.md`、`novel-reader-proxy.md`、`novel-character-growth-tracker.md`、`novel-lorekeeper.md`、`novel-research-collector.md`
- **4 个 commands**：`novel-write.md`、`novel-meeting.md`、`novel-draft.md`、`novel-init.md`
- **1 个 skill**：`novel-query/SKILL.md`
- **4 个 templates**：`文字风格模板.md`、`反AI检测文风指南.md`、`项目CLAUDE.md模板.md`、`项目README模板.md`

### 2.3 明确排除在安装器之外的内容

- 不安装 `install.sh`、`uninstall.sh`、`README.md`、`CLAUDE.md`、`docs/`、`ai优化会议报告.md`、`.claude/settings.local.json`
- 不修改项目的非 `.claude/` 目录内容（如小说正文目录结构）

---

## 3. 命名方案

### 3.1 推荐命名

| 项目 | 推荐命名 | 说明 |
|------|---------|------|
| **全局 skill 名** | `novel-setup` | 表明其职责是“安装/设置小说工具” |
| **全局 command 名（触发安装）** | `/novel-install` | 与项目级 `/novel-init` 区分；避免同名覆盖 |
| **分发后的 command 名** | `/novel-init`、`/novel-write`、`/novel-meeting`、`/novel-draft` | 保持用户原有使用习惯 |
| **分发后的 skill 名** | `novel-query` | 保持原有查询 skill 名称 |

### 3.2 冲突分析

- `novel-init.md`（创建新书项目）被分发到项目级 `.claude/commands/`；安装器本身不叫 `novel-init`，因此**不会互相覆盖**。
- 如果用户已经在全局安装了旧版 `novel-init` command，项目级安装后会按照 Claude Code 的优先级规则，**项目级覆盖全局**，这与用户预期一致。

### 3.3 备选方案

- 若用户仍坚持想把安装器命令叫 `/novel-init`，则安装器 skill 自身需要改名（如 `novel-toolkit`），但这样会造成混淆，**不推荐**。

---

## 4. 分发清单

安装器运行时，将以下文件从源目录复制到当前项目 `.claude/` 下：

```
源目录: /Users/niannian/claude-novel-commond/
目标根: {CWD}/.claude/

agents/
├── novel-editor.md
├── novel-writer.md
├── novel-proofreader.md
├── novel-reader-proxy.md
├── novel-character-growth-tracker.md
├── novel-lorekeeper.md
└── novel-research-collector.md

commands/
├── novel-init.md
├── novel-write.md
├── novel-meeting.md
└── novel-draft.md

skills/
└── novel-query/SKILL.md

templates/
├── 文字风格模板.md
├── 反AI检测文风指南.md
├── 项目CLAUDE.md模板.md
└── 项目README模板.md
```

**覆盖规则**：如果目标位置已存在同名文件，**直接覆盖**（用户已确认）。

---

## 5. 安装流程

### 5.1 全局安装 skill

1. 将 `novel-setup` skill 文件夹复制到 `~/.claude/skills/novel-setup/`（先放在 `claude-code-configs`，后续可手动或脚本同步到 `~/.claude`）。

### 5.2 在项目里运行

1. 用户打开一个目标项目目录（例如某本小说的仓库）。
2. 用户输入 `/novel-install`（或等价命令）。
3. Claude 读取 `novel-setup` skill 中的分发清单。
4. 将 agents、commands、skills、templates 复制到 `{CWD}/.claude/` 下对应子目录。
5. 向用户汇报成功复制的文件列表，并给出下一步建议（如 `/novel-init`）。

---

## 6. 更新流程

### 6.1 源文件更新

1. 用户在 `claude-novel-commond/` 中修改小说工具集文件。
2. 修改完成后，运行 `/novel-install` 进入各个小说项目目录重新执行。

### 6.2 更新行为

- 重新执行 `/novel-install` 时，按照分发清单再次复制全部文件，**覆盖旧版本**。
- 不保留旧版本备份（由用户自行通过 Git 管理项目级 `.claude/` 目录变更）。
- 不需要单独的 `novel-update` 命令（用户已确认）。

---

## 7. 命令冲突处理

### 7.1 项目级 vs 全局级同名行为预期

根据 Claude Code 的加载规则（项目级优先），当用户在某项目根目录下运行时：

- **若全局已有 `novel-init` command**：项目级安装后，用户在该项目内运行 `/novel-init` 将使用项目级版本；离开项目后仍使用全局版本。
- **若全局没有 `novel-init` command**：项目级安装后，仅在该项目内可用；不影响其他项目。

### 7.2 冲突解决策略

- **安装前不检查全局冲突**：安装器直接执行复制，无需扫描全局 `~/.claude/`。
- **安装后不修改全局配置**：安装器是纯项目级操作，不触碰 `~/.claude/` 下已有的命令。
- 如果用户希望某项目不使用小说工具集，只需删除该项目 `.claude/` 下的对应文件即可。

---

## 8. 目录结构设计

在当前配置库 `claude-code-configs` 中，按如下结构组织：

```
claude-code-configs/
├── .claude/
│   ├── commands/
│   │   ├── req.md
│   │   ├── plan.md
│   │   └── tdd.md
│   └── reqs/
│       └── 20250406-novel-setup-skill.md   ← 本 PRD
├── agents/
│   └── (现有 agents，不变)
├── commands/
│   └── (现有 commands，不变)
├── skills/
│   ├── requirement-workflow/
│   ├── planning-workflow/
│   ├── tdd-workflow/
│   └── novel-setup/                        ← 新增 skill
│       ├── SKILL.md                        ← skill 主文件（描述安装流程、使用方式）
│       └── _dist/                          ← 被分发文件的副本
│           ├── agents/
│           ├── commands/
│           ├── skills/
│           └── templates/
├── README.md
└── CLAUDE.md
```

### 8.1 为什么使用 `_dist` 子目录

- 将“安装器自身”与“被安装的内容”在物理上隔离。
- `SKILL.md` 可以明确引用 `_dist/` 中的文件路径，逻辑清晰。
- 方便后续用脚本（如 `cp -r`）把 `_dist` 整体复制到目标项目。

### 8.2 文件来源声明

`_dist/` 中的所有文件均从 `/Users/niannian/claude-novel-commond/` 复制而来，保持原文件名和目录结构不变。

---

## 9. 用户故事与验收标准

> 验收标准模式：`requirement-workflow/SKILL.md#验收标准模式`

### 用户故事 1：作为小说作者，我希望在项目中安装小说工具集，以便使用项目级的小说创作命令

**验收标准：**
- [ ] 在任意项目根目录运行 `/novel-install` 后，`.claude/agents/` 下出现 7 个 novel-* agent 文件。
- [ ] `.claude/commands/` 下出现 4 个 novel-* command 文件（含 `novel-init`、`novel-write` 等）。
- [ ] `.claude/skills/novel-query/SKILL.md` 存在且内容正确。
- [ ] `.claude/templates/` 下出现 4 个模板文件。
- [ ] 如果目标位置已存在同名文件，新文件直接覆盖旧文件。

### 用户故事 2：作为小说作者，我希望更新项目中的小说工具集，而无需额外的更新命令

**验收标准：**
- [ ] 当 `claude-novel-commond/` 中的源文件更新后，重新运行 `/novel-install` 能将最新版本复制到项目 `.claude/` 下。
- [ ] 更新过程中不需要执行 `novel-update` 或其他额外命令。
- [ ] 安装器在更新完成后向用户显示“已覆盖文件列表”摘要。

### 用户故事 3：作为小说作者，我希望安装器不会与全局命令产生不可预期的覆盖或删除行为

**验收标准：**
- [ ] `/novel-install` 命令本身不会出现在项目级 `.claude/commands/` 中（它只在全局 skill 中）。
- [ ] 安装器运行时只修改当前工作目录下的 `.claude/` 目录，不会删除或修改全局 `~/.claude/` 下的任何文件。
- [ ] 安装完成后，用户在项目内运行 `/novel-init` 使用的是项目级版本；离开项目范围后仍使用全局版本（如有）。

---

## 10. 约束与假设

### 10.1 约束

- 安装器必须以**只读源目录、写入当前项目**的方式运行，不允许反向修改 `/Users/niannian/claude-novel-commond/`。
- 不支持增量更新（即不能只更新一个 agent），每次安装都是全量覆盖分发清单中的文件。
- 安装器 skill 不处理 Git 提交，用户需自行决定是否将 `.claude/` 下新增文件纳入版本控制。

### 10.2 假设

- 用户运行 `/novel-install` 时，当前工作目录 `{CWD}` 就是目标小说项目根目录。
- 用户已了解 Claude Code 项目级配置优先于全局配置。
- `claude-novel-commond/` 中的小说工具集会持续维护，安装器 skill 的 `_dist/` 目录会随其同步更新。

---

## 11. 红旗检查清单

> 引用：`requirement-workflow/SKILL.md#红旗检查清单`

- [x] 需求不是一次性的，后续会有更新：已设计为重复运行 `/novel-install` 即可更新。
- [x] 命名冲突风险已被识别：安装器命令命名为 `/novel-install`，与被分发的 `/novel-init` 等命令区分。
- [x] 文件覆盖行为已明确：同名文件直接覆盖，无备份。
- [x] 优先级规则已澄清：项目级优先于全局，符合 Claude Code 默认行为。
- [x] 范围边界已划定：不安装 `install.sh`、`uninstall.sh` 等非运行时文件。

---

## 12. 参考资料

- 源目录结构：`/Users/niannian/claude-novel-commond/`
- 目标配置库：`/Users/niannian/claude-code-configs/`
- 原 `novel-init.md` 功能：在 `~/Desktop/{书名}/` 下初始化新书项目结构（见源文件第 38-66 行）。
- Claude Code 配置优先级：项目级 `.claude/` 覆盖全局 `~/.claude/`。
