# Claude Code Configs

个人 Claude Code 配置库，包含精选的 agents、commands 和 skills。

## 项目结构

```
claude-code-configs/
├── agents/                    # 专业 Agent 定义
│   ├── requirement-analyst.md # 需求分析专家
│   ├── planner.md            # 实现规划专家
│   └── tdd-guide.md          # TDD 专家
├── commands/                  # Slash 命令
│   ├── req.md                # 需求澄清命令
│   ├── plan.md               # 实现规划命令
│   └── tdd.md                # TDD 工作流命令
├── skills/                    # 可复用技能
│   ├── requirement-workflow/  # 需求工程工作流
│   ├── planning-workflow/     # 规划工作流
│   └── tdd-workflow/          # TDD 工作流
├── hooks/                     # 自动化钩子
├── rules/                     # 编码规则
└── .claude/                   # Claude 配置
```

## 快速开始

### 安装

1. 克隆此仓库到本地：
```bash
git clone <your-repo-url> ~/.claude-code-configs
```

2. 链接到 Claude Code 配置目录：
```bash
# 备份原有配置（如有）
mv ~/.claude ~/.claude.backup

# 创建符号链接
ln -s ~/.claude-code-configs ~/.claude
```

3. 重启 Claude Code 以加载新配置

### 使用方法

#### /req - 需求澄清
将模糊的想法转化为结构化的产品需求文档（PRD）。

```
/req 我想添加用户认证功能
```

#### /plan - 实现规划
创建详细的实施计划，包括阶段划分、风险评估等。

```
/plan 添加 Stripe 订阅支付功能
```

#### /tdd - 测试驱动开发
严格执行测试优先的开发流程，确保 80%+ 覆盖率。

```
/tdd 实现订单计算函数
```

## 工作流

**重要：每个阶段都是独立的，需要手动执行。**

```
需求澄清 (/req) → 实现规划 (/plan) → TDD 开发 (/tdd)
     ↓                    ↓                  ↓
  生成 PRD           创建实施计划         编写代码
  自动停止           自动停止            自动停止
```

### 1. /req - 需求澄清（生成 PRD）
```
/req 我想添加用户认证功能
→ Agent 询问问题 → 生成 PRD → **STOP**
→ 提示："请运行 /plan 继续"
```

**⚠️ `/req` 只生成文档，不执行任何操作。**

### 2. /plan - 实现规划（创建计划）
```
/plan 添加 Stripe 订阅支付功能
→ Agent 分析 PRD → 创建实施计划 → **STOP**
→ 提示："请确认计划或运行 /tdd"
```

**⚠️ `/plan` 只创建计划，不编写代码。**

### 3. /tdd - 测试驱动开发（编写代码）
```
/tdd 实现订单计算函数
→ Agent 写测试 → 写实现 → 重构 → **STOP**
→ 代码已完成
```

### 为什么手动执行？

- **审查机会** - 每个阶段结束后可以审查输出
- **灵活调整** - 可以随时修改需求或计划
- **防止意外** - 不会自动执行未经验证的计划

## 特性

- **Task 工具集成** - 使用 Claude 的 Task 工具追踪多步骤任务
- **标准化 PRD 格式** - Google Docs 风格的结构化需求文档
- **分阶段规划** - 可独立交付的实施阶段
- **TDD 强制执行** - 红-绿-重构循环
- **覆盖率要求** - 最低 80% 测试覆盖率

## 自定义

### 添加新 Agent

在 `agents/` 目录创建 Markdown 文件：

```markdown
---
name: my-agent
description: 简短描述
model: sonnet
tools: ["Read", "Write", "Edit"]
---

# Agent 指令内容
...
```

### 添加新命令

在 `commands/` 目录创建 Markdown 文件：

```markdown
---
description: 命令描述
---

# 命令文档
...
```

### 添加新 Skill

在 `skills/my-skill/` 目录创建 `SKILL.md`：

```markdown
---
name: my-skill
description: 技能描述
---

# 技能内容
...
```

## 更新

从 upstream 更新：

```bash
cd ~/.claude-code-configs
git pull origin main
```

## 许可

MIT
