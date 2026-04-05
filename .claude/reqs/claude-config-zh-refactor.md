# PRD: Claude Code 配置项目中文化与工具完善

## 1. 概述

将 Claude Code 配置项目全面中文化，优化 req 指令使其专注于 PRD 生成（不包含执行），并实现 PRD 自动保存到 `.claude/reqs` 目录。同时审视并完善所有 Agent 的 tools 配置，确保每个 Agent 都有完成任务所需的完整工具集。

## 2. 目标与成功标准

### 2.1 目标
- 项目文档、配置、注释全面中文化
- req 指令仅生成 PRD，不执行后续操作
- PRD 自动保存到 `.claude/reqs/` 目录
- 所有 Agent tools 配置完整可用

### 2.2 成功标准
- [ ] 所有 Markdown 文件主要内容使用中文
- [ ] req 命令/agent 只生成 PRD，不调用其他 agent
- [ ] PRD 自动写入 `.claude/reqs/YYYYMMDD-feature-name.md`
- [ ] 每个 agent 的 tools 包含完成任务所需的全部工具

## 3. 用户故事

### 故事 1：中文使用者
作为一名中文使用者，我希望所有配置文档使用中文，这样我可以更容易理解和使用这些配置。

**验收标准：**
- [ ] README.md 使用中文编写
- [ ] 所有命令文档使用中文
- [ ] 所有 agent 文档使用中文
- [ ] CLAUDE.md 使用中文

### 故事 2：需求分析使用者
作为使用者，我希望 req 指令只生成 PRD 而不自动执行，这样我可以先审阅需求再决定下一步。

**验收标准：**
- [ ] req agent 只生成 PRD 文档
- [ ] PRD 生成后停止，不自动调用 /plan 或 /tdd
- [ ] 明确提示用户手动执行下一步命令

### 故事 3：PRD 管理使用者
作为使用者，我希望 PRD 自动保存到指定目录，这样可以方便地管理和查阅历史需求。

**验收标准：**
- [ ] PRD 自动保存到 `.claude/reqs/` 目录
- [ ] 文件名格式：`YYYYMMDD-feature-name.md`
- [ ] 目录不存在时自动创建

### 故事 4：Agent 工具完善
作为配置维护者，我希望每个 agent 都有完整的 tools，这样它们可以独立完成各自的任务。

**验收标准：**
- [ ] 审查每个 agent 当前的 tools 配置
- [ ] 补充缺失的必要工具
- [ ] 验证 tools 与 agent 职责匹配

## 4. 功能需求

### 4.1 中文化改造

| 文件路径 | 改造内容 |
|---------|---------|
| `README.md` | 项目介绍、使用说明中文化 |
| `CLAUDE.md` | 项目特定指导中文化 |
| `commands/*.md` | 所有命令文档中文化 |
| `agents/*.md` | 所有 agent 文档中文化 |
| `rules/**/*.md` | 规则文档保持双语或中文化 |

### 4.2 req 指令优化

**当前问题：**
- req 文档和 agent 已经说明不执行，但需要确保行为一致
- 需要添加 PRD 自动保存功能

**改造要求：**
1. requirement-analyst agent 生成 PRD 后自动保存
2. 保存路径：`.claude/reqs/YYYYMMDD-feature-name.md`
3. 保存后明确提示用户手动执行 `/plan`

### 4.3 Agent Tools 完善

基于对各个 agent 职责的分析，以下是 tools 配置建议：

| Agent | 当前 Tools | 建议 Tools | 说明 |
|-------|-----------|-----------|------|
| requirement-analyst | Read, Grep, Glob, Bash, WebSearch, WebFetch, AskUserQuestion | **增加 Write, Edit, TaskCreate, TaskUpdate, TaskList, TaskGet** | 需要写入 PRD 文件，追踪任务 |
| planner | Read, Grep, Glob | **增加 Write, Edit, TaskCreate, TaskUpdate, TaskList, TaskGet, Bash** | 需要创建计划文档，追踪任务 |
| tdd-guide | Read, Write, Edit, Bash, Grep | **增加 TaskCreate, TaskUpdate, TaskList, TaskGet** | 需要追踪 TDD 任务 |
| code-reviewer | Read, Grep, Glob, Bash | 保持现状 | 主要是读取和检查 |
| security-reviewer | Read, Write, Edit, Bash, Grep, Glob | 保持现状 | 已比较完整 |
| build-error-resolver | Read, Write, Edit, Bash, Grep, Glob | 保持现状 | 已比较完整 |
| e2e-runner | Read, Write, Edit, Bash, Grep, Glob | 保持现状 | 已比较完整 |
| refactor-cleaner | Read, Write, Edit, Bash, Grep, Glob | 保持现状 | 已比较完整 |

**Claude Code Task 管理工具（2026年1月更新）：**

| 工具 | 用途 | 状态 |
|------|------|------|
| `TaskCreate` | 创建新任务 | ✅ v2.1.16+ 新增 |
| `TaskUpdate` | 更新任务状态/属性 | ✅ v2.1.16+ 新增 |
| `TaskList` | 列出所有任务 | ✅ v2.1.16+ 新增 |
| `TaskGet` | 获取特定任务详情 | ✅ v2.1.16+ 新增 |
| `TodoWrite` | 旧版任务列表（已弃用） | ❌ v2.1.16 起交互式会话已移除 |
| `Task` | 生成子代理处理复杂任务 | ✅ 可用 |

**重要变更：**
- **v2.1.16 (2026年1月22日)**：`TodoWrite` 被 **TaskCreate/TaskUpdate/TaskList/TaskGet** 替代
- 新 Task 系统支持**跨会话持久化**（存储在 `~/.claude/tasks/`）
- 支持**依赖关系追踪**（blockedBy/blocks）
- `TodoWrite` 仅保留在非交互模式和 Agent SDK 中

**需要添加 Task* 工具的 Agent：**
- requirement-analyst: TaskCreate/TaskUpdate/TaskList/TaskGet - 追踪研究阶段、PRD 编写阶段
- planner: TaskCreate/TaskUpdate/TaskList/TaskGet - 追踪规划阶段、实施步骤
- tdd-guide: TaskCreate/TaskUpdate/TaskList/TaskGet - 追踪红-绿-重构循环

## 5. 非功能需求

- **可维护性**：文档结构清晰，易于后续更新
- **一致性**：术语翻译统一，风格一致
- **向后兼容**：改造不影响现有功能

## 6. 约束与假设

### 6.1 约束
- 保持现有 agent 行为逻辑不变
- 不改变命令调用方式

### 6.2 假设
- 用户主要使用中文
- `.claude/reqs` 目录可用于存储 PRD

## 7. 待解决问题

1. **PRD 文件名生成策略**：基于什么规则生成文件名？
   - 建议：使用日期前缀 + 功能名称的 slug
   - 示例：`20250406-user-auth-system.md`

2. **重复 PRD 处理**：同名 PRD 是否覆盖？
   - 建议：添加序号或时间戳后缀

3. **术语统一**：常见术语的中文翻译
   - PRD → 产品需求文档/PRD
   - Agent → Agent（保持英文）
   - Skill → 技能
   - Command → 命令

## 8. 实施建议

### 8.1 实施顺序
1. 先完善 agent tools 配置（添加缺失的 Write, Edit, TodoWrite）
2. 修改 requirement-analyst agent 添加 PRD 保存逻辑
3. 逐步中文化各文档

### 8.2 风险控制
- 每次修改后验证 agent 可正常工作
- 保留英文备份或注释便于对照

## 9. 下一步

运行 `/plan` 创建详细实施计划