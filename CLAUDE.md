# CLAUDE.md

此文件为 Claude Code 提供项目特定的指导。

## 项目概述

这是我的个人 Claude Code 配置库，包含精选的 agents、commands 和 skills。

## 配置结构

### Agents
- `requirement-analyst` - 需求工程专家
- `planner` - 实现规划专家
- `tdd-guide` - 测试驱动开发专家

### Commands
- `/req` - 需求澄清，生成 PRD
- `/plan` - 实现规划
- `/tdd` - TDD 开发

### Skills
- `requirement-workflow` - 需求工程模式
- `planning-workflow` - 规划模式
- `tdd-workflow` - TDD 模式

## 使用指南

### 开始新功能

```
/req 你的需求描述
→ 生成 PRD

/plan （基于 PRD）
→ 创建实施计划

/tdd （按计划实施）
→ 测试驱动开发
```

### Agent 调用规则

- 需求模糊 → 自动调用 `requirement-analyst`
- 复杂功能 → 自动调用 `planner`
- 编写代码 → 自动调用 `tdd-guide`

### Task 工具使用

Agents 使用 Claude 的 Task 工具追踪进度：

- 研究阶段 → 创建研究任务
- PRD 编写 → 分章节追踪
- 实施计划 → 按阶段追踪
- TDD 循环 → 红-绿-重构任务

## 编码标准

### 通用原则

1. **不可变性** - 创建新对象，不修改现有对象
2. **小文件** - 200-400 行，最大 800 行
3. **全面错误处理** - 每个层级显式处理错误
4. **边界验证** - 系统边界验证所有输入

### 测试要求

- **最低 80% 覆盖率**
- **测试优先** - 先写测试，后实现
- **三类型测试**：单元、集成、E2E
- **边界情况**：null、空值、无效类型、最大值

### 代码质量检查清单

- [ ] 代码可读，命名清晰
- [ ] 函数小（<50 行）
- [ ] 文件聚焦（<800 行）
- [ ] 无深层嵌套（>4 层）
- [ ] 正确处理错误
- [ ] 无硬编码值
- [ ] 使用不可变模式

## 开发笔记

- Agent 格式：带 YAML frontmatter 的 Markdown
- Skill 格式：带 frontmatter 的 Markdown，包含使用场景
- Command 格式：带 description frontmatter 的 Markdown
