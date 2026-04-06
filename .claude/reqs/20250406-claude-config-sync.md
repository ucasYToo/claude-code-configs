# PRD: Claude Code 配置同步命令 (`/sync-claude-config`)

## 1. 背景与目标

### 1.1 背景
当前项目库 `claude-code-configs` 管理了经过精选的 Claude Code 配置项（agents、commands、skills、rules、hooks）。然而全局目录 `~/.claude/` 中存在大量历史遗留、未经验证的配置（如旧 agents、commands、skills）。这些多余的配置会干扰 Claude Code 的行为，导致非预期的工具调用和角色激活。

### 1.2 目标
- **严格同步**：将项目库中的配置项原样同步到全局 `~/.claude/` 对应目录。
- **精确清理**：删除全局目录中不在项目库里的 agents、commands、skills，保持全局配置与项目库完全一致。
- **安全白名单**：保护核心系统配置和数据目录，避免误删。
- **可预览执行**：支持 `dry-run` 模式，先查看变更再执行。

## 2. 范围定义

### 2.1 同步范围（项目库 → 全局目录）

| 项目库路径 | 全局目标路径 | 同步深度 |
|---|---|---|
| `claude-code-configs/agents/` | `~/.claude/agents/` | 整个目录内容 |
| `claude-code-configs/commands/` | `~/.claude/commands/` | 整个目录内容 |
| `claude-code-configs/skills/` | `~/.claude/skills/` | 整个目录内容 |
| `claude-code-configs/rules/` | `~/.claude/rules/` | 整个目录内容 |
| `claude-code-configs/hooks/` | `~/.claude/hooks/` | 整个目录内容 |

### 2.2 清理范围
清理范围为以下五个全局目录中不在项目库里的条目：
- `~/.claude/agents/`
- `~/.claude/commands/`
- `~/.claude/skills/`
- `~/.claude/rules/`
- `~/.claude/hooks/`

**不清理**以下任何内容：
- `~/.claude/` 根目录下的任何文件
- 所有系统/数据子目录（见第 6 节白名单）

## 3. 命令设计：`/sync-claude-config`

### 3.1 命令位置
- 项目级 command 文件：`claude-code-configs/commands/sync-claude-config.md`

### 3.2 执行流程

```
1. 解析用户参数
   ├── 若包含 --dry-run → 进入预览模式，只输出计划不执行
   └── 默认 → 实际执行模式

2. 同步阶段（覆盖复制）
   ├── 复制 agents/   → ~/.claude/agents/
   ├── 复制 commands/ → ~/.claude/commands/
   ├── 复制 skills/   → ~/.claude/skills/
   ├── 复制 rules/    → ~/.claude/rules/
   └── 复制 hooks/    → ~/.claude/hooks/

3. 清理阶段（agents/commands/skills/rules/hooks）
   ├── 扫描 ~/.claude/agents/   中的文件
   │   └── 若文件名不在项目库 agents/ 中 → 删除
   ├── 扫描 ~/.claude/commands/ 中的文件
   │   └── 若文件名不在项目库 commands/ 中 → 删除
   ├── 扫描 ~/.claude/skills/   中的文件/目录
   │   └── 若条目名不在项目库 skills/ 中 → 删除
   ├── 扫描 ~/.claude/rules/    中的文件/目录
   │   └── 若条目名不在项目库 rules/ 中 → 删除
   └── 扫描 ~/.claude/hooks/    中的文件
       └── 若文件名不在项目库 hooks/ 中 → 删除

4. 输出结果摘要
   ├── 列出新增/覆盖的文件
   ├── 列出删除的文件
   └── 若 dry-run，标注 "[预览] 未实际执行"
```

### 3.3 参数设计

| 参数 | 说明 |
|---|---|
| `--dry-run` | 仅打印同步和清理计划，不执行任何文件操作 |
| （无参数） | 实际执行同步和清理 |

## 4. 文件映射表

### 4.1 同步映射（项目库 → 全局）

```
claude-code-configs/agents/build-error-resolver.md     → ~/.claude/agents/build-error-resolver.md
claude-code-configs/agents/code-reviewer.md            → ~/.claude/agents/code-reviewer.md
claude-code-configs/agents/e2e-runner.md               → ~/.claude/agents/e2e-runner.md
claude-code-configs/agents/planner.md                  → ~/.claude/agents/planner.md
claude-code-configs/agents/refactor-cleaner.md         → ~/.claude/agents/refactor-cleaner.md
claude-code-configs/agents/requirement-analyst.md      → ~/.claude/agents/requirement-analyst.md
claude-code-configs/agents/security-reviewer.md        → ~/.claude/agents/security-reviewer.md
claude-code-configs/agents/tdd-guide.md                → ~/.claude/agents/tdd-guide.md

claude-code-configs/commands/instinct-export.md        → ~/.claude/commands/instinct-export.md
claude-code-configs/commands/instinct-import.md        → ~/.claude/commands/instinct-import.md
claude-code-configs/commands/instinct-status.md        → ~/.claude/commands/instinct-status.md
claude-code-configs/commands/learn-eval.md             → ~/.claude/commands/learn-eval.md
claude-code-configs/commands/learn.md                  → ~/.claude/commands/learn.md
claude-code-configs/commands/novel-install.md          → ~/.claude/commands/novel-install.md
claude-code-configs/commands/plan.md                   → ~/.claude/commands/plan.md
claude-code-configs/commands/req.md                    → ~/.claude/commands/req.md
claude-code-configs/commands/skill-create.md           → ~/.claude/commands/skill-create.md
claude-code-configs/commands/tdd.md                    → ~/.claude/commands/tdd.md

claude-code-configs/skills/novel-setup/                → ~/.claude/skills/novel-setup/
claude-code-configs/skills/planning-workflow/          → ~/.claude/skills/planning-workflow/
claude-code-configs/skills/requirement-workflow/       → ~/.claude/skills/requirement-workflow/
claude-code-configs/skills/tdd-workflow/               → ~/.claude/skills/tdd-workflow/

claude-code-configs/rules/common/                      → ~/.claude/rules/common/
claude-code-configs/rules/README.md                    → ~/.claude/rules/README.md

claude-code-configs/hooks/hooks.json                   → ~/.claude/hooks/hooks.json
claude-code-configs/hooks/README.md                    → ~/.claude/hooks/README.md
```

### 4.2 清理映射（全局多余项将被删除）

#### agents（3 个将被删除）
- `~/.claude/agents/architect.md`
- `~/.claude/agents/doc-updater.md`
- `~/.claude/agents/loop-operator.md`

#### commands（26 个将被删除）
- `~/.claude/commands/aside.md`
- `~/.claude/commands/build-fix.md`
- `~/.claude/commands/checkpoint.md`
- `~/.claude/commands/claw.md`
- `~/.claude/commands/code-review.md`
- `~/.claude/commands/e2e.md`
- `~/.claude/commands/eval.md`
- `~/.claude/commands/evolve.md`
- `~/.claude/commands/loop-start.md`
- `~/.claude/commands/loop-status.md`
- `~/.claude/commands/model-route.md`
- `~/.claude/commands/multi-execute.md`
- `~/.claude/commands/multi-frontend.md`
- `~/.claude/commands/multi-plan.md`
- `~/.claude/commands/multi-workflow.md`
- `~/.claude/commands/orchestrate.md`
- `~/.claude/commands/projects.md`
- `~/.claude/commands/promote.md`
- `~/.claude/commands/prompt-optimize.md`
- `~/.claude/commands/quality-gate.md`
- `~/.claude/commands/refactor-clean.md`
- `~/.claude/commands/resume-session.md`
- `~/.claude/commands/save-session.md`
- `~/.claude/commands/sessions.md`
- `~/.claude/commands/test-coverage.md`
- `~/.claude/commands/update-codemaps.md`
- `~/.claude/commands/update-docs.md`
- `~/.claude/commands/verify.md`

> **`skill-create.md` 将被覆盖同步**，因为项目库中存在同名文件。

#### rules（7 个语言目录将被删除）
- `~/.claude/rules/golang/`
- `~/.claude/rules/kotlin/`
- `~/.claude/rules/perl/`
- `~/.claude/rules/php/`
- `~/.claude/rules/python/`
- `~/.claude/rules/swift/`
- `~/.claude/rules/typescript/`

> **`common/` 和 `README.md` 保留并同步覆盖**。

#### hooks
- 无额外删除项（项目库与全局目录内容一致），仅覆盖同步 `hooks.json` 和 `README.md`。

#### skills（24 个将被删除）
- `~/.claude/skills/api-design/`
- `~/.claude/skills/article-writing/`
- `~/.claude/skills/backend-patterns/`
- `~/.claude/skills/claude-api/`
- `~/.claude/skills/coding-standards/`
- `~/.claude/skills/content-engine/`
- `~/.claude/skills/continuous-learning-v2/`
- `~/.claude/skills/crosspost/`
- `~/.claude/skills/deep-research/`
- `~/.claude/skills/e2e-testing/`
- `~/.claude/skills/exa-search/`
- `~/.claude/skills/fal-ai-media/`
- `~/.claude/skills/frontend-patterns/`
- `~/.claude/skills/frontend-slides/`
- `~/.claude/skills/gmaps-cli/`
- `~/.claude/skills/investor-materials/`
- `~/.claude/skills/investor-outreach/`
- `~/.claude/skills/market-research/`
- `~/.claude/skills/novel-chapter/`
- `~/.claude/skills/novel-consistency/`
- `~/.claude/skills/novel-outline/`
- `~/.claude/skills/novel-project/`
- `~/.claude/skills/novel-style/`
- `~/.claude/skills/security-review/`
- `~/.claude/skills/security-scan/`
- `~/.claude/skills/seoul-metro/`
- `~/.claude/skills/verification-loop/`
- `~/.claude/skills/video-editing/`
- `~/.claude/skills/videodb/`
- `~/.claude/skills/x-api/`

## 5. 清理清单

### 5.1 清理规则
对于 `agents/`、`commands/`、`skills/`、`rules/`、`hooks/` 五个全局目录：
- 扫描目录下的**每个条目**（文件或子目录）。
- 若条目名称**不在**项目库对应目录中，则标记为待删除。
- `dry-run` 模式下仅打印，实际模式下直接删除（不提示、不备份）。

### 5.2 清理规则与 hooks
- `~/.claude/rules/`：同步项目库内容，并**删除**全局目录中不在项目库里的子目录/文件。
- `~/.claude/hooks/`：同步项目库内容，并**删除**全局目录中不在项目库里的文件。

## 6. 白名单与保留项

以下文件和目录**在任何情况下都不被触碰**：

### 6.1 根目录核心配置
- `~/.claude/settings.json`
- `~/.claude/settings.local.json`
- `~/.claude/CLAUDE.md`
- `~/.claude/README.md`

### 6.2 系统/数据目录（全部保留）
- `~/.claude/backups/`
- `~/.claude/cache/`
- `~/.claude/sessions/`
- `~/.claude/projects/`
- `~/.claude/logs/`
- `~/.claude/plugins/`
- `~/.claude/codemaps/`
- `~/.claude/.claude/`（嵌套配置目录，如有）

### 6.3 清理范围内的保留项
在 `agents/`、`commands/`、`skills/` 中，与项目库同名的文件/目录会保留（作为同步目标被覆盖）：
- `~/.claude/agents/build-error-resolver.md`
- `~/.claude/agents/code-reviewer.md`
- `~/.claude/agents/e2e-runner.md`
- `~/.claude/agents/planner.md`
- `~/.claude/agents/refactor-cleaner.md`
- `~/.claude/agents/requirement-analyst.md`
- `~/.claude/agents/security-reviewer.md`
- `~/.claude/agents/tdd-guide.md`
- `~/.claude/commands/instinct-export.md`
- `~/.claude/commands/instinct-import.md`
- `~/.claude/commands/instinct-status.md`
- `~/.claude/commands/learn-eval.md`
- `~/.claude/commands/learn.md`
- `~/.claude/commands/novel-install.md`
- `~/.claude/commands/plan.md`
- `~/.claude/commands/req.md`
- `~/.claude/commands/skill-create.md`
- `~/.claude/commands/tdd.md`
- `~/.claude/skills/novel-setup/`
- `~/.claude/skills/planning-workflow/`
- `~/.claude/skills/requirement-workflow/`
- `~/.claude/skills/tdd-workflow/`

## 7. 风险管理

### 7.1 直接删除策略
- 命令执行时**不创建备份**、**不放回收站**。
- 删除操作是**不可逆的**。
- 运行前请确保已使用 `--dry-run` 预览将要删除的内容。

### 7.2 误操作预防
- 命令实现前必须检查 `--dry-run` 参数。
- 删除范围必须严格限定于 `agents/`、`commands/`、`skills/` 三个目录。
- 白名单目录通过路径前缀检查进行屏蔽，防止意外进入。

### 7.3 环境假设
- 假设 `~/.claude/` 是 Claude Code 的标准全局配置目录。
- 假设项目库 `claude-code-configs` 的路径在执行命令时可以通过当前工作目录或固定相对路径确定。

## 8. 验收标准

### 8.1 用户故事与验收标准

#### 用户故事 1：运行同步命令
> 作为用户，我希望运行 `/sync-claude-config` 后，全局 `~/.claude/` 的 agents、commands、skills、rules、hooks 与项目库完全一致，并且多余的历史配置被清理。

**验收标准**：
- [ ] 运行命令后，`~/.claude/agents/`、`commands/`、`skills/`、`rules/`、`hooks/` 的内容与项目库对应目录一致。
- [ ] `~/.claude/agents/` 中项目库没有的 3 个文件被删除。
- [ ] `~/.claude/commands/` 中项目库没有的 25 个文件被删除，`skill-create.md` 保留。
- [ ] `~/.claude/skills/` 中项目库没有的 24 个目录被删除。
- [ ] 命令结束后输出变更摘要（新增、覆盖、删除的数量）。

#### 用户故事 2：预览模式
> 作为用户，我希望先用 dry-run 模式预览变更，避免误删重要文件。

**验收标准**：
- [ ] 运行 `/sync-claude-config --dry-run` 不修改任何文件。
- [ ] 输出完整预览结果，包括将要同步的文件列表和将要删除的文件列表。
- [ ] 预览结果中明确标注 `[预览]` 或 `dry-run` 状态。

#### 用户故事 3：保护白名单
> 作为用户，我希望 `~/.claude/` 的核心配置和数据目录永远不会被同步命令触碰。

**验收标准**：
- [ ] `settings.json`、`settings.local.json` 在运行命令前后内容不变。
- [ ] `backups/`、`cache/`、`sessions/` 等系统目录在运行命令前后内容不变。
- [ ] `~/.claude/rules/` 中项目库没有的 7 个语言目录被删除，`common/` 和 `README.md` 保留。
- [ ] `~/.claude/hooks/` 中项目库没有的额外文件被删除。

## 9. 红旗检查清单

> 引自 `requirement-workflow/SKILL.md#红旗检查清单`

| 检查项 | 状态 |
|---|---|
| 需求边界清晰（同步/清理范围明确） | 已确认 |
| 有不可逆操作风险（直接删除无备份） | 已识别，已要求 `--dry-run` |
| 白名单保护关键配置 | 已确认 |
| 验收标准可测试 | 已确认 |
| 无技术方案细节混入需求 | 已确认（未指定实现语言/框架） |

---

**模板来源**：`requirement-workflow/templates/prd-full.md`  
**研究方法**：直接基于用户提供的边界回答和现有目录差异生成  
**参考规范**：`requirement-workflow/SKILL.md#验收标准模式`
