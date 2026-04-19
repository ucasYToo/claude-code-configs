---
name: project-config
description: 为项目初始化 Claude Code 项目级配置（.claude/ 目录 + CLAUDE.md），使 Claude 从通用助手转变为项目感知、团队对齐的开发工具。在新项目启动、团队 onboarding、或现有项目缺少 AI 辅助配置时使用。
---

# 项目级 Claude Code 配置

为项目搭建完整的 `.claude/` 配置体系，包含 `CLAUDE.md`、settings、rules、agents、skills、docs 等，让 Claude 深度理解项目上下文。

## 何时激活

- 新项目启动，需要配置 Claude Code 项目级支持
- 现有项目缺少 `.claude/` 配置，希望提升 AI 辅助开发体验
- 团队成员 onboarding，需要统一 AI 辅助开发规范
- 项目技术栈/架构变更，需要更新 Claude Code 配置
- 用户说"初始化项目配置"、"配置 claude"、"设置 .claude"、"新项目"

## 依赖工具

- **Bash** — 创建目录结构、检查文件状态
- **Read** — 读取现有配置文件
- **Write** — 创建新配置文件
- **Edit** — 修改现有文件

## 配置体系概览

Claude Code 采用**两级配置**：

| 层级 | 位置 | 用途 | 是否提交 Git |
|------|------|------|-------------|
| **全局** | `~/.claude/` | 个人偏好、个人技能/Agent | 否 |
| **项目级** | `your-repo/.claude/` + `./CLAUDE.md` | 团队共享规则、项目上下文 | 是（除 `settings.local.json`） |

**继承链**（按顺序读取，每层扩充前一层）：
```
~/.claude/CLAUDE.md
       ↓（扩充）
./CLAUDE.md
       ↓（扩充）
./subdirectory/CLAUDE.md
```

## 工作流

### 步骤 1：诊断现有配置

检查项目是否已有配置：

```bash
# 检查现有配置
ls -la .claude/ 2>/dev/null || echo "无 .claude/ 目录"
cat CLAUDE.md 2>/dev/null || echo "无 CLAUDE.md"
cat .claude/settings.json 2>/dev/null || echo "无 settings.json"
```

### 步骤 2：创建目录结构

```bash
mkdir -p .claude/{commands,rules,skills,agents,docs,worktrees}
touch .claude/.gitignore
```

`.claude/.gitignore` 内容：
```gitignore
# 个人覆盖，切勿提交
settings.local.json

# 工作目录
worktrees/

# 临时文件
*.tmp
```

### 步骤 3：编写 CLAUDE.md（核心）

`CLAUDE.md` 位于**项目根目录**（不在 `.claude/` 内），是 Claude Code 最重要的配置文件。

**原则**：
- 精简聚焦，推荐 80-100 行，最大 500 行
- 正面表述：说"使用 X"而非"不要用 Y"
- 提供具体示例
- 关键行为放在顶部

**推荐结构模板**：

```markdown
# [项目名称]

## 架构概览
- 前端：[框架 + 语言]
- 后端：[框架 + 语言]
- 数据库：[类型]
- 部署：[平台/方式]

## 开发指南
- [编码规范]
- [测试要求]
- [Git 工作流]
- [提交消息格式]

## 关键文件和目录
- `[path/]` — [说明]
- `[path/]` — [说明]

## 工具选择
| 操作 | 工具 | 原因 |
|------|------|------|
| 读取文件 | `Read()` | 处理编码和大文件 |
| 搜索代码 | `Grep()` | 返回结构化匹配 |
| 运行命令 | `Bash()` | 统一执行环境 |

## 当前优先级
- [正在进行的重点]
```

### 步骤 4：配置 settings.json

`.claude/settings.json` 控制权限与自动化。

**基础模板**：

```json
{
  "permissions": {
    "allow": ["Read", "Edit", "Bash", "Glob", "Grep"],
    "deny": [],
    "requireApproval": ["Bash", "Write"]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "npx prettier --write \"$FILEPATH\" 2>/dev/null || true",
        "description": "编辑后自动格式化"
      }
    ]
  }
}
```

**关键字段说明**：

| 字段 | 说明 |
|------|------|
| `permissions.allow` | 允许自动调用的工具 |
| `permissions.deny` | 禁止使用的工具 |
| `permissions.requireApproval` | 必须人工确认的工具 |
| `hooks.SessionStart` | 会话开始时执行 |
| `hooks.PreToolUse` | 工具执行前执行（可阻止） |
| `hooks.PostToolUse` | 工具成功后执行 |

**支持的 Hooks 事件**（常用）：

| 事件 | 触发时机 | 能否阻止 | 典型用途 |
|------|----------|---------|----------|
| `SessionStart` | 新会话开始 | 否 | 加载项目上下文 |
| `PreToolUse` | 工具执行前 | **是** | 安全门禁、验证输入 |
| `PostToolUse` | 工具成功后 | 否 | 自动格式化、测试 |
| `Stop` | Claude 完成响应 | 否 | 质量检查 |

### 步骤 5：创建模块化 Rules

`.claude/rules/` 存放按领域拆分的指令文件，Claude 启动时自动加载。

**推荐拆分**：

```
.claude/rules/
├── coding-style.md     # 编码风格
├── testing.md          # 测试策略
├── api-design.md       # API 设计规范
├── security.md         # 安全规范
└── git-workflow.md     # Git 工作流
```

**带作用范围的规则**（限定到特定路径）：

```markdown
---
paths: src/frontend/**/*.tsx
---

## 前端组件规范
- 使用函数组件 + Hooks
- Props 类型使用 `interface`
```

### 步骤 6：配置 Agents（可选）

`.claude/agents/*.md` 定义专用子 Agent。

**示例**：

```markdown
---
name: code-reviewer
description: 审查代码质量和潜在问题
model: sonnet
tools:
  - Read
  - Grep
  - Glob
disallowedTools:
  - Edit
  - Write
---

You are a code reviewer. Focus on:
- Code quality and readability
- Potential bugs
- Security issues
- Performance concerns

Do NOT fix issues — only report them.
```

### 步骤 7：配置 Skills（可选）

`.claude/skills/<name>/SKILL.md` 定义可复用工作流。

**示例结构**：

```
.claude/skills/
├── deploy/
│   └── SKILL.md
└── code-review/
    └── SKILL.md
```

**SKILL.md 格式**：

```markdown
---
name: deploy
description: 执行项目部署流程
---

## 部署步骤

1. 运行测试：`npm test`
2. 构建项目：`npm run build`
3. 部署到 [平台]
4. 验证部署状态
```

### 步骤 8：配置 Docs（可选）

`.claude/docs/` 存放详细参考文档，Claude 按需读取（不常驻上下文）。

```
.claude/docs/
├── architecture.md
├── api-reference.md
└── deployment-guide.md
```

**与 CLAUDE.md 的区别**：

| 特性 | `CLAUDE.md` | `.claude/docs/*.md` |
|------|-------------|---------------------|
| 加载时机 | 会话启动自动加载 | 按需读取 |
| 上下文消耗 | 始终占用 Token | 仅读取时占用 |
| 内容长度 | 精简（<500 行） | 可以很长 |
| 用途 | 行为指令 | 参考信息 |

### 步骤 9：提交到版本控制

```bash
# 确保 settings.local.json 被忽略
git add CLAUDE.md .claude/
git status

# 提交
git commit -m "chore: 初始化 Claude Code 项目配置

- 添加 CLAUDE.md 项目指令
- 配置 .claude/settings.json 权限与自动化
- 添加 rules/ 模块化开发规范
- 添加 agents/ 专用子 Agent（如有）
- 添加 skills/ 可复用工作流（如有）

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

**务必排除**：
- `.claude/settings.local.json`（个人覆盖）
- `.claude/worktrees/`（临时工作目录）

## 安全清单

- [ ] `settings.local.json` 已加入 `.gitignore`
- [ ] 未在 `CLAUDE.md` 中硬编码密钥
- [ ] `permissions.deny` 包含敏感工具（如需要）
- [ ] `requireApproval` 包含破坏性操作（Bash、Write）
- [ ] Hooks 命令经过审查，无恶意脚本
- [ ] 未使用 `--dangerously-skip-permissions`

## 更新与维护

- 项目架构变更时同步更新 `CLAUDE.md`
- 新增技术规范时添加 `rules/` 文件
- 团队约定变更时更新 `settings.json`
- 将配置变更纳入 PR 审查流程
- 新成员 onboarding 时审查 `CLAUDE.md`

## 常见问题

**Q: `CLAUDE.md` 放在哪里？**
A: 项目根目录 `./CLAUDE.md`，**不是** `.claude/CLAUDE.md`。

**Q: `settings.local.json` 是什么？**
A: 个人覆盖配置，优先级高于 `settings.json`，**切勿提交到 Git**。

**Q: Commands 和 Skills 有什么区别？**
A: Commands 是单文件斜杠命令（向后兼容），Skills 是多文件工作流（推荐）。同名时 Skills 优先。

**Q: Rules 和 CLAUDE.md 有什么区别？**
A: `CLAUDE.md` 是主指令文件，始终加载。`rules/` 是模块化拆分，按领域组织，支持 `paths` 范围限定。

## 示例

```
"帮我初始化这个 React 项目的 Claude Code 配置"
"新项目需要配置 .claude 目录"
"给这个项目添加 Claude Code 支持"
"更新现有项目的 CLAUDE.md"
```
