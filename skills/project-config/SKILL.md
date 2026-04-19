---
name: project-config
description: 指导在项目级 .claude/ 目录下正确创建和配置 skill、agent、command、rule 等内容。提供 frontmatter 参考、目录结构规范、命名约定和常见错误预防。在需要为项目新增 AI 辅助配置时使用。
---

# 项目级配置开发指南

指导你在项目 `.claude/` 目录下正确创建 skill、agent、command、rule 等配置项，确保它们能被 Claude Code 正确识别和使用。

## 何时激活

- 想为当前项目新增一个 skill
- 想为当前项目新增一个 agent
- 想为当前项目新增一个 command（斜杠命令）
- 想为当前项目新增规则文件（rules）
- 不确定该用 skill 还是 command 还是 agent
- 不确定 frontmatter 怎么写
- 用户说"新增 skill"、"创建 agent"、"加个命令"、"写个 rule"

## 依赖工具

- **Bash** — 检查目录结构、文件状态
- **Read** — 读取现有配置
- **Write** — 创建新文件
- **Edit** — 修改现有文件

## 配置类型速查

| 类型 | 文件位置 | 用途 | 触发方式 |
|------|----------|------|----------|
| **Skill** | `.claude/skills/<name>/SKILL.md` | 复杂可复用工作流 | `/skill-name` 或 `match_globs` 自动触发 |
| **Agent** | `.claude/agents/<name>.md` | 专用子 Agent | `Agent` 工具调用时通过 name 匹配 |
| **Command** | `.claude/commands/<name>.md` | 简单斜杠命令 | `/<command-name>` |
| **Rule** | `.claude/rules/<name>.md` | 模块化指令片段 | 会话启动时自动加载 |

**选择建议**：
- 多步骤工作流、需要自动触发 → **Skill**
- 专用角色（如安全审查、代码审查）→ **Agent**
- 简单一句话模板 → **Command**
- 补充开发规范（编码风格、测试要求）→ **Rule**

## 工作流

### 步骤 1：诊断现有结构

先检查项目当前的 `.claude/` 配置状态：

```bash
ls -la .claude/ 2>/dev/null || echo "项目尚无 .claude/ 配置"
ls -la .claude/skills/ 2>/dev/null || echo "无 skills"
ls -la .claude/agents/ 2>/dev/null || echo "无 agents"
ls -la .claude/commands/ 2>/dev/null || echo "无 commands"
ls -la .claude/rules/ 2>/dev/null || echo "无 rules"
```

### 步骤 2：确定配置类型

根据需求选择正确的类型：

**Skill 适合的场景**：
- 多步骤、有条件分支的工作流
- 需要自动触发（通过文件匹配）
- 需要支持文件和子技能
- 描述常驻上下文，内容按需加载

**Agent 适合的场景**：
- 需要隔离上下文执行
- 需要限制可用工具
- 需要特定模型或系统提示
- 有明确的角色定位（如"安全审查员"）

**Command 适合的场景**：
- 简单的一句话模板
- 向后兼容已有项目
- 不需要自动触发

**Rule 适合的场景**：
- 补充开发规范到系统提示
- 按领域拆分 CLAUDE.md
- 需要 `paths` 范围限定

### 步骤 3：创建文件（按类型）

#### Skill 创建规范

**目录结构**：
```
.claude/skills/<skill-name>/
└── SKILL.md
```

**命名规则**：
- 使用小写字母和连字符：`deep-research`、`code-review`
- 避免空格、下划线、驼峰
- 语义化命名，一眼能看出用途

**SKILL.md 格式**：

```markdown
---
name: skill-name
description: 一句话描述技能用途，在技能选择器中显示
# 可选字段：
# plugin_namespace: "group-name"    # 逻辑分组，避免冲突
# match_globs: ["src/**/*.ts"]       # 自动触发文件模式
# tools: ["Read", "Edit", "Bash"]    # 技能可用工具
# model: sonnet                      # 特定模型
# context: fork | inline             # 执行上下文
# disable-model-invocation: true     # 禁止自动触发
---

# Skill 标题

## 何时激活
- 触发条件 1
- 触发条件 2

## 工作流

### 步骤 1：...
### 步骤 2：...

## 质量规则
1. ...
2. ...

## 示例
```
"示例用户输入"
```
```

**关键要求**：
- `name`：必需，全局唯一（不与其他 skill 冲突）
- `description`：必需，Claude 用此判断是否加载该 skill
- `match_globs`：可选，匹配时自动触发，不依赖手动调用
- 正文结构清晰：何时激活 → 工作流 → 质量规则 → 示例

#### Agent 创建规范

**文件位置**：
```
.claude/agents/<agent-name>.md
```

**命名规则**：
- 小写字母和连字符：`security-reviewer`、`code-reviewer`
- 与全局 `~/.claude/agents/` 中的 agent 不冲突

**Agent 文件格式**：

```markdown
---
name: agent-name
description: 一句话描述 Agent 用途和触发场景
tools:
  - Read
  - Grep
  - Glob
# 可选字段：
# disallowedTools:
#   - Edit
#   - Write
# model: sonnet | haiku | opus
# permissionMode: default | plan
# maxTurns: 20
# skills:
#   - skill-name
# memory: true
# isolation: worktree
# color: blue
---

You are a [角色描述].

Your responsibilities:
1. ...
2. ...

Constraints:
- ...
- ...
```

**关键要求**：
- `name`：必需，唯一标识符
- `description`：必需，Claude 用此决定何时调用
- `tools`：指定允许的工具列表
- `disallowedTools`：显式禁止的工具（如只读 agent 禁止 Edit/Write）
- **不要**在 tools 中包含 `Agent` 或 `Task` — 子 Agent 不能再派生子 Agent
- 如果省略 `tools`，子 Agent 继承主线程所有工具（包括 MCP）

#### Command 创建规范

**文件位置**：
```
.claude/commands/<command-name>.md
```

**Command 文件格式**：

```markdown
---
description: 命令的描述，在 / 菜单中显示
---

# 提示模板内容

当用户输入 /command-name 时，执行以下操作：
1. ...
2. ...
```

**变量支持**：
- `$ARGUMENTS` — 用户输入的所有参数
- `$1`, `$2`... — 位置参数

**示例**（带参数的 PR 审查命令）：
```markdown
---
description: "审查指定 PR"
---

Review PR #$1 with priority $2
```
用法：`/review-pr 456 high`

**关键要求**：
- 基础格式只需 description frontmatter + Markdown 正文
- 不支持 `allowed-tools`、`context: fork` 等新特性
- 新功能仅限 Skill 使用，Command 仅向后兼容
- 建议新项目直接使用 Skill

#### Rule 创建规范

**文件位置**：
```
.claude/rules/<rule-name>.md
```

**Rule 文件格式**：

```markdown
---
paths: src/frontend/**/*.tsx   # 可选：限定作用范围
---

## 规则标题

- 规则内容 1
- 规则内容 2
```

**关键要求**：
- 所有 `.claude/rules/*.md` 会话启动时自动按字母顺序加载
- 内容追加到 `CLAUDE.md` 之后
- 使用 `paths` 限定范围，避免无关规则污染上下文
- 每个文件聚焦一个主题，100-200 行最佳

### 步骤 4：验证配置

创建后执行验证：

```bash
# 检查文件路径和命名
ls -la .claude/skills/    # skill 目录是否存在
ls -la .claude/agents/    # agent 文件是否存在
ls -la .claude/commands/  # command 文件是否存在
ls -la .claude/rules/     # rule 文件是否存在

# 检查 frontmatter 格式
cat .claude/skills/<name>/SKILL.md | head -20
```

**验证清单**：
- [ ] 文件路径和命名符合规范
- [ ] frontmatter 包含 `name` 和 `description`（skill/agent/command 必需）
- [ ] YAML frontmatter 格式正确（`---` 包裹、无缩进错误）
- [ ] 没有将项目级配置放到全局 `~/.claude/`
- [ ] `settings.local.json` 未被提交

### 步骤 5：测试配置

**Skill 测试**：
1. 在 Claude Code 中输入 `/<skill-name>` 调用
2. 检查是否正确加载 skill 内容
3. 验证工作流步骤是否正确执行

**Agent 测试**：
1. 通过 `Agent` 工具调用，指定 `subagent_type: <agent-name>`
2. 验证是否正确加载系统提示
3. 检查工具限制是否生效

**Command 测试**：
1. 在 Claude Code 中输入 `/<command-name>`
2. 验证模板内容是否正确触发

**Rule 测试**：
1. 启动新会话
2. 检查规则内容是否出现在系统提示中
3. 验证 `paths` 限定是否正确生效

### 步骤 6：提交到版本控制

```bash
git add .claude/
git commit -m "chore: 新增 [skill/agent/command/rule] [name]

- 添加 [类型] [name]
- 用途：[描述]

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

**务必排除**：
- `.claude/settings.local.json`
- `.claude/worktrees/`

## 常见错误与预防

| 错误 | 原因 | 解决 |
|------|------|------|
| Skill 未被识别 | 目录名与 frontmatter `name` 不一致 | 确保目录名和 `name` 一致 |
| Agent 无法调用 | `description` 不够清晰 | 写清楚触发场景和用途 |
| Command 不生效 | 文件不在 `.claude/commands/` | 检查路径 |
| Rule 未加载 | 文件不在 `.claude/rules/` | 检查路径 |
| frontmatter 解析失败 | YAML 格式错误 | 检查缩进、引号、冒号后空格 |
| 子 Agent 无限递归 | tools 中包含 `Agent` | 移除 `Agent` 和 `Task` 工具 |
| 配置未生效 | 放在全局而非项目级 | 确认是 `.claude/` 而非 `~/.claude/` |

## frontmatter 字段速查表

### Skill frontmatter

| 字段 | 必需 | 说明 |
|------|------|------|
| `name` | 是 | 唯一标识符 |
| `description` | 是 | 技能选择器中显示 |
| `plugin_namespace` | 否 | 逻辑分组 |
| `match_globs` | 否 | 自动触发文件模式 |
| `tools` | 否 | 可用工具列表 |
| `model` | 否 | 特定模型 |
| `context` | 否 | `fork` 或 `inline` |
| `disable-model-invocation` | 否 | 禁止自动触发 |

### Agent frontmatter

| 字段 | 必需 | 说明 |
|------|------|------|
| `name` | 是 | 唯一标识符 |
| `description` | 是 | 调用决策依据 |
| `tools` | 否 | 允许的工具 |
| `disallowedTools` | 否 | 禁止的工具 |
| `model` | 否 | 模型偏好 |
| `maxTurns` | 否 | 最大轮数 |
| `skills` | 否 | 自动加载的技能 |
| `isolation` | 否 | `worktree` 等隔离模式 |
| `color` | 否 | UI 颜色 |

### Command frontmatter

| 字段 | 必需 | 说明 |
|------|------|------|
| `name` | 否 | 描述性名称 |
| `description` | 是 | / 菜单中显示 |

### Rule frontmatter

| 字段 | 必需 | 说明 |
|------|------|------|
| `paths` | 否 | 限定作用范围的 glob 模式 |

## 优先级与继承

**配置加载优先级**（从高到低）：
1. `settings.local.json`（个人覆盖）
2. `.claude/settings.json`（项目级）
3. `~/.claude/settings.json`（全局默认）

**CLAUDE.md 继承链**：
```
~/.claude/CLAUDE.md
       ↓（扩充）
./CLAUDE.md
       ↓（扩充）
./subdirectory/CLAUDE.md
```

**配置合并策略**：
- `settings.json`：合并而非替换，项目级覆盖同名键
- `CLAUDE.md`：继承追加，子目录追加到父目录之后
- Rules：按字母顺序加载，追加到 `CLAUDE.md` 之后

## 示例

```
"帮我给这个项目新增一个代码审查 skill"
"创建一个 deploy agent"
"我想加个 /test 命令"
"给前端代码加一条 rule"
"Skill 和 Command 我该用哪个？"
```
