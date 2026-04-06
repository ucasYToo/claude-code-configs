# Hooks 系统

## Hook 类型

- **PreToolUse**: 工具执行前 (验证、参数修改)
- **PostToolUse**: 工具执行后 (自动格式化、检查)
- **Stop**: 会话结束时 (最终验证)

## 自动接受权限

谨慎使用:
- 为可信的、明确定义的计划启用
- 为探索性工作禁用
- 永远不要使用 dangerously-skip-permissions 标志
- 而是在 `~/.claude.json` 中配置 `allowedTools`

## Task* 最佳实践

**强制规则：严禁使用 `todowrite` / `TodoWrite` 等已废弃工具；必须改用 `TaskCreate` / `TaskUpdate` / `TaskList` / `TaskGet`。**

使用 TaskCreate/TaskUpdate/TaskList/TaskGet 工具来:
- 跟踪多步骤任务的进度
- 验证对指令的理解
- 启用实时引导
- 显示细粒度的实施步骤
- **创建任务（TaskCreate）后再开始多步骤工作**
- **完成后立即更新任务状态为 `completed`（TaskUpdate）**

任务列表揭示:
- 顺序错误的步骤
- 缺失的项目
- 额外的不必要项目
- 错误的粒度
- 误解的需求
