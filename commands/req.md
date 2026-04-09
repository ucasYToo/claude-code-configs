---
name: req
description: 生成产品需求文档（PRD）。根据复杂度自动选择快速或完整模式。
---

# /req 命令

> **指令**：当用户运行 `/req` 时，你必须**立即使用 `Agent` 工具调用 `requirement-analyst` agent**，将用户的完整需求传递给它。不要自己生成 PRD 或执行任何操作。

快速生成 PRD。自动调用 `requirement-analyst` agent。

## 使用方式

```
/req [需求描述]
```

**示例：**
```
/req 添加用户认证功能
/req 暗黑模式切换
/req 一个 AI 助手，帮助用户分析数据
```

## 输出

- 生成 `.claude/reqs/YYYYMMDD-feature-name.md`
- 自动选择合适的 PRD 模板（快速 / 标准 / AI 产品）
- 与用户讨论后输出结构化需求文档

## 相关资源

- **Agent**: `requirement-analyst` — 执行需求分析与 PRD 生成
- **Skill**: `requirement-workflow` — 需求工程方法论与模板
