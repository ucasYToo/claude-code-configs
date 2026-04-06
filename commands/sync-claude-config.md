---
name: sync-claude-config
description: 将项目库中的 Claude Code 配置同步到全局 ~/.claude/，并清理全局中不在项目库里的配置。支持 --dry-run 预览模式。
---

# /sync-claude-config 命令

## 作用

将 `claude-code-configs` 项目库中的精选配置（agents、commands、skills、rules、hooks）同步到全局 `~/.claude/` 对应目录，同时**清理**全局目录中不在项目库里的多余配置。

## 核心原则

- **只保留项目库中的配置**：其他内容全部清理。
- **dry-run 优先**：默认不执行，先预览；用户确认后才实际执行。
- **绝不触碰白名单**：核心配置和数据目录永远安全。

## 执行流程

当用户输入 `/sync-claude-config` 或 `/sync-claude-config --dry-run` 时，请严格按以下步骤执行：

### Step 1: 识别模式

- 若用户附带 `--dry-run` 参数 → **仅输出计划，不执行任何文件操作**。
- 若无 `--dry-run` → **需要用户确认后再执行**。先输出完整的变更计划，询问用户是否确认执行（输出 "请回复 '确认' 以继续执行"），等待用户明确回复后再操作。

### Step 2: 定义路径

**项目库路径**（当前工作目录假设为此仓库根目录）：
```
PROJECT_DIR = /Users/niannian/claude-code-configs
SOURCE_AGENTS   = PROJECT_DIR/agents/
SOURCE_COMMANDS = PROJECT_DIR/commands/
SOURCE_SKILLS   = PROJECT_DIR/skills/
SOURCE_RULES    = PROJECT_DIR/rules/
SOURCE_HOOKS    = PROJECT_DIR/hooks/
```

**全局目标路径**：
```
TARGET_AGENTS   = ~/.claude/agents/
TARGET_COMMANDS = ~/.claude/commands/
TARGET_SKILLS   = ~/.claude/skills/
TARGET_RULES    = ~/.claude/rules/
TARGET_HOOKS    = ~/.claude/hooks/
```

### Step 3: 扫描并计算变更计划

对每个目录对（SOURCE → TARGET），执行以下逻辑：

#### 3.1 计算同步列表（覆盖/新增）
遍历 SOURCE 中的每个条目（文件或目录）：
- 若 TARGET 中不存在同名条目 → 标记为 **新增**
- 若 TARGET 中存在同名条目但内容不同 → 标记为 **覆盖**
- 若 TARGET 中存在同名条目且内容相同 → 标记为 **无变化**

#### 3.2 计算清理列表（删除）
遍历 TARGET 中的每个条目：
- 若条目名称**不在** SOURCE 中 → 标记为 **删除**
- 若条目名称在 SOURCE 中 → 保留

### Step 4: 输出变更计划

以清晰的分类向用户输出变更计划摘要：

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Claude Code 配置同步计划
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[agents]   新增: X, 覆盖: Y, 删除: Z, 无变化: W
[commands] 新增: X, 覆盖: Y, 删除: Z, 无变化: W
[skills]   新增: X, 覆盖: Y, 删除: Z, 无变化: W
[rules]    新增: X, 覆盖: Y, 删除: Z, 无变化: W
[hooks]    新增: X, 覆盖: Y, 删除: Z, 无变化: W

--- 将被删除的文件/目录 ---
agents:   [列出]
commands: [列出]
skills:   [列出]
rules:    [列出]
hooks:    [列出]

--- 将被新增/覆盖的文件/目录 ---
...（列出有变化的条目）
```

### Step 5: 用户确认（仅非 dry-run 模式）

如果用户没有带 `--dry-run`：
1. 输出上述计划后，明确提示：
   > ⚠️ 以上变更将直接删除未在清单中的配置，**不备份**。请回复 **"确认执行"** 以继续，或回复 **"取消"** 中止。
2. **等待用户输入**。只有在用户明确回复类似 "确认" / "确认执行" / "是" 时，才继续到 Step 6。
3. 若用户回复 "取消" 或任何非确认内容，则中止并输出 "操作已取消"。

### Step 6: 执行同步与清理

使用 Bash 工具执行具体操作。請遵循以下顺序：

#### 6.1 同步（复制/覆盖）
对每个 SOURCE → TARGET 执行递归复制：

```bash
# 示例：同步 agents
rsync -av --delete "SOURCE_AGENTS/" "TARGET_AGENTS/"
```

或使用 `cp -r` 配合删除再复制：
```bash
cp -r "SOURCE_AGENTS"* "TARGET_AGENTS/"
```

**推荐方式**（确保完全一致）：
```bash
# agents
rsync -av --delete /Users/niannian/claude-code-configs/agents/ ~/.claude/agents/

# commands
rsync -av --delete /Users/niannian/claude-code-configs/commands/ ~/.claude/commands/

# skills
rsync -av --delete /Users/niannian/claude-code-configs/skills/ ~/.claude/skills/

# rules
rsync -av --delete /Users/niannian/claude-code-configs/rules/ ~/.claude/rules/

# hooks
rsync -av --delete /Users/niannian/claude-code-configs/hooks/ ~/.claude/hooks/
```

> `--delete` 参数会删除 TARGET 中 SOURCE 没有的条目，**一次性完成同步+清理**。

#### 6.2 白名单保护验证（执行后检查）
执行完毕后，验证以下白名单文件/目录是否存在且未被修改：
- `~/.claude/settings.json`
- `~/.claude/settings.local.json`
- `~/.claude/backups/`
- `~/.claude/cache/`
- `~/.claude/sessions/`

### Step 7: 输出执行结果

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 同步完成！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

已同步目录:
  • agents/
  • commands/
  • skills/
  • rules/
  • hooks/

如需验证，可运行以下命令查看差异:
  diff -rq /Users/niannian/claude-code-configs/agents ~/.claude/agents
```

## 白名单（绝不触碰）

以下文件和目录**在任何情况下都不能被同步命令操作**：

### 根目录核心配置
- `~/.claude/settings.json`
- `~/.claude/settings.local.json`
- `~/.claude/CLAUDE.md`
- `~/.claude/README.md`
- `~/.claude/AGENTS.md`
- `~/.claude/COMMANDS.md`
- `~/.claude/marketplace.json`
- `~/.claude/plugin.json`
- `~/.claude/PLUGIN_SCHEMA_NOTES.md`
- `~/.claude/the-security-guide.md`

### 系统/数据目录（全部保留）
- `~/.claude/backups/`
- `~/.claude/cache/`
- `~/.claude/sessions/`
- `~/.claude/projects/`
- `~/.claude/logs/`
- `~/.claude/plugins/`
- `~/.claude/codemaps/`
- `~/.claude/.claude/`
- `~/.claude/reqs/`（如有）

## 安全约束

- **rsync 路径必须以 `/` 结尾**：确保同步的是目录内容，而非目录本身。例如 `agents/` 而不是 `agents`。
- **rsync 的目标范围必须严格限定**：只操作 `agents/`、`commands/`、`skills/`、`rules/`、`hooks/` 这五个目录。
- **绝不能使用通配符触及根目录**：避免 `rsync ~/.claude/` 这类操作。

## 常见错误预防

| 错误 | 预防 |
|------|------|
| 误删 `settings.json` | 白名单检查 + rsync 只操作子目录 |
| 遗漏删除目标中的旧文件 | 使用 `rsync --delete` 确保内容完全一致 |
| 目录嵌套（agents/agents） | 源路径和目标路径都必须以 `/` 结尾 |

## 当前同步范围（项目库 → 全局）

### agents（8 个）
- build-error-resolver.md
- code-reviewer.md
- e2e-runner.md
- planner.md
- refactor-cleaner.md
- requirement-analyst.md
- security-reviewer.md
- tdd-guide.md

### commands（10 个）
- instinct-export.md
- instinct-import.md
- instinct-status.md
- learn-eval.md
- learn.md
- novel-install.md
- plan.md
- req.md
- skill-create.md
- tdd.md
- sync-claude-config.md

### skills（4 个）
- novel-setup/
- planning-workflow/
- requirement-workflow/
- tdd-workflow/

### rules
- common/
- README.md

### hooks
- hooks.json
- README.md
