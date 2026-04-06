---
name: novel-setup
description: 网络小说创作工具集安装器。通过 /novel-install 命令将小说领域的 agents、commands、skills、templates 安装到当前项目的 .claude/ 目录下。
---

# Novel Setup - 小说创作工具集安装器

## 功能概述

`novel-setup` 是一个纯安装/分发工具 skill，不负责小说创作的实际功能。

它的唯一职责是：将小说创作所需的完整工具链（7 个 agent、4 个命令、1 个 skill、4 个模板）从全局 skill 的分发包中复制到**当前项目**的 `.claude/` 目录下，实现按需启用、项目隔离。

## 为什么使用项目级安装

- **避免全局污染**：小说工具集包含多个命令和 agent，全局安装会占用命名空间并可能导致冲突。
- **按需启用**：只有小说项目才需要这些工具，普通项目不受影响。
- **项目级优先**：Claude Code 中项目级 `.claude/` 配置天然优先于全局 `~/.claude/` 配置。
- **独立更新**：每个小说项目可以独立更新到最新版本，不影响其他项目。

## 使用方式

### 1. 全局注册 skill

将本 skill 文件夹放入全局 skills 目录（通常通过 `claude-code-configs` 仓库管理并同步到 `~/.claude/skills/novel-setup/`）。

### 2. 在项目里运行安装命令

```
/novel-install
```

运行后，以下文件将被复制到当前工作目录的 `.claude/` 下：

| 来源 | 目标 | 内容 |
|------|------|------|
| `_dist/agents/` | `.claude/agents/` | 7 个小说创作专用 agent |
| `_dist/commands/` | `.claude/commands/` | 4 个小说创作专用命令 |
| `_dist/skills/` | `.claude/skills/` | `novel-query` 查询 skill |
| `_dist/templates/` | `.claude/templates/` | 4 个小说项目模板 |

### 3. 开始使用小说工具

安装完成后，在当前项目中即可使用：

```
/novel init "书名" 类型      # 初始化新书项目（在项目内创建小说目录结构）
/novel write 章节号          # 七人协作写指定章节
/novel meeting "议题"        # 多 Agent 会议讨论
/novel draft                 # 分镜模式写作
```

## 更新机制

当 `claude-novel-commond/` 源文件有更新时：

1. 更新 `novel-setup` skill 的 `_dist/` 目录内容
2. 在需要同步的小说项目根目录重新运行 `/novel-install`
3. 安装器会**直接覆盖**同名文件，无需额外命令

> **注意**：更新不保留旧版本备份，请通过 Git 管理项目级 `.claude/` 的变更。

## 分发清单

### Agents（7 个）
- `novel-editor` — 解析大纲，制定创作规范，综合决策
- `novel-writer` — 骨架扩写 → 3000+ 字正文
- `novel-proofreader` — 唯一质量门禁（≥6 分通过）
- `novel-reader-proxy` — 读者体验报告顾问
- `novel-character-growth-tracker` — 主角成长轨迹分析顾问
- `novel-lorekeeper` — 更新人物/时间线/伏笔数据库
- `novel-research-collector` — 搜集题材背景资料

### Commands（4 个）
- `/novel init` — 初始化新书项目
- `/novel write` — 七人协作写指定章节
- `/novel meeting` — 多 Agent 会议讨论
- `/novel draft` — 分镜模式写作

### Skills（1 个）
- `novel-query` — 查询人物/时间线/伏笔数据

### Templates（4 个）
- `文字风格模板.md`
- `反AI检测文风指南.md`
- `项目CLAUDE.md模板.md`
- `项目README模板.md`

## 命令冲突说明

- **安装器命令 `/novel-install`**：仅存在于全局 skill 中，永远不会被复制到项目级 `.claude/commands/`。
- **项目级 `novel-*` 命令**：在项目根目录运行时优先于全局同名命令（如有）。离开项目后不影响其他环境。

## 约束与假设

- 运行 `/novel-install` 时，当前工作目录 `{CWD}` 即为目标项目根目录。
- 如果目标 `.claude/` 下已存在同名文件，将直接覆盖，不提示、不备份。
- 安装器只修改当前项目目录，绝不触碰全局 `~/.claude/` 下的任何文件。

## 相关资源

- 源仓库：`/Users/niannian/claude-novel-commond/`
- 本 skill 路径：`~/.claude/skills/novel-setup/`
- PRD：`.claude/reqs/20250406-novel-setup-skill.md`
