---
name: instinct-status
description: 显示已学习的本能（项目 + 全局）及其置信度
command: true
---

# Instinct Status 命令

显示当前项目的已学习本能以及全局本能，按领域分组。

## 实现

使用插件根路径运行 instinct CLI：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" status
```

如果 `CLAUDE_PLUGIN_ROOT` 未设置（手动安装），使用：

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py status
```

## 用法

```
/instinct-status
```

## 操作步骤

1. 检测当前项目上下文（git remote/路径 hash）
2. 从 `~/.claude/homunculus/projects/<project-id>/instincts/` 读取项目本能
3. 从 `~/.claude/homunculus/instincts/` 读取全局本能
4. 按优先级规则合并（ID 冲突时项目覆盖全局）
5. 按领域分组显示，带置信度条和观察统计

## 输出格式

```
============================================================
  INSTINCT STATUS - 总计 12 个
============================================================

  项目: my-app (a1b2c3d4e5f6)
  项目本能: 8
  全局本能:  4

## 项目范围 (my-app)
  ### 工作流 (3)
    ███████░░░  70%  grep-before-edit [project]
              触发条件: 修改代码时

## 全局（应用于所有项目）
  ### 安全 (2)
    █████████░  85%  validate-user-input [global]
              触发条件: 处理用户输入时
```
