---
name: novel-install
description: 在当前项目的 .claude/ 目录下安装网络小说创作工具集（agents、commands、skills、templates）。
---

# /novel-install 命令

## 作用

将 `novel-setup` skill 中打包的小说创作工具集完整复制到**当前项目**的 `.claude/` 目录下。

这是**项目级安装器命令**，本身不会被复制到项目级。安装完成后，当前项目即可使用 `/novel init`、`/novel write`、`/novel meeting`、`/novel draft` 等小说创作命令。

## 执行流程

当用户输入 `/novel-install` 时，请严格按以下步骤执行：

### Step 1: 确认分发源

源目录为全局 skill 的分发包路径：
- agents: `/Users/niannian/.claude/skills/novel-setup/_dist/agents/`
- commands: `/Users/niannian/.claude/skills/novel-setup/_dist/commands/`
- skills: `/Users/niannian/.claude/skills/novel-setup/_dist/skills/`
- templates: `/Users/niannian/.claude/skills/novel-setup/_dist/templates/`

> 如果全局路径不存在（例如在开发环境直接使用 `claude-code-configs` 仓库），则回退到开发路径：
> `/Users/niannian/claude-code-configs/skills/novel-setup/_dist/`

### Step 2: 准备目标目录

在当前工作目录 `{CWD}` 下创建以下目录（如不存在）：
- `{CWD}/.claude/agents/`
- `{CWD}/.claude/commands/`
- `{CWD}/.claude/skills/`
- `{CWD}/.claude/templates/`

### Step 3: 复制文件

使用 `cp` 命令将源目录下的所有文件递归复制到目标目录：

```bash
cp -r <source>/* <target>/
```

具体复制清单：
1. `_dist/agents/*.md` → `.claude/agents/`
2. `_dist/commands/*.md` → `.claude/commands/`
3. `_dist/skills/novel-query/` → `.claude/skills/novel-query/`
4. `_dist/templates/*.md` → `.claude/templates/`

**覆盖规则**：如果目标位置已存在同名文件，直接覆盖，不提示、不备份。

### Step 4: 汇报结果

向用户显示安装摘要：
- 成功复制的文件列表（按类别分组）
- 覆盖的文件列表（如有）
- 目标项目路径
- 下一步建议

示例输出格式：
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 小说工具集安装完成！

📁 目标项目: {CWD}

已安装的 Agents (7):
  • novel-editor
  • novel-writer
  • novel-proofreader
  • novel-reader-proxy
  • novel-character-growth-tracker
  • novel-lorekeeper
  • novel-research-collector

已安装的 Commands (4):
  • /novel init
  • /novel write
  • /novel meeting
  • /novel draft

已安装的 Skills (1):
  • novel-query

已安装的 Templates (4):
  • 文字风格模板.md
  • 反AI检测文风指南.md
  • 项目CLAUDE.md模板.md
  • 项目README模板.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

下一步建议：
→ /novel init "书名" 类型     # 初始化新书项目
→ /novel write 1              # 直接开始写第1章
```

## 更新说明

当小说工具集有更新时，直接在项目根目录重新运行 `/novel-install` 即可。安装器会再次全量复制并覆盖同名文件。

## 纪律要求

- **绝不修改全局配置**：安装器只操作当前项目目录下的 `.claude/`，不触碰 `~/.claude/`。
- **绝不备份旧文件**：直接覆盖，由用户自行通过 Git 管理变更。
- **绝不删除不存在于分发包中的文件**：只覆盖清单中的文件，不清理目标目录中的其他自定义配置。
