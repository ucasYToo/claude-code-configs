# 安装指南

## 快速安装

### 1. 克隆仓库

```bash
# 克隆到本地
git clone <your-repo-url> ~/claude-code-configs
```

### 2. 配置 Claude Code

Claude Code 使用 `~/.claude/` 目录存放配置。有几种安装方式：

#### 方式 A：符号链接（推荐，便于更新）

```bash
# 备份原有配置（如有）
mv ~/.claude ~/.claude.backup.$(date +%Y%m%d)

# 创建符号链接
ln -s ~/claude-code-configs ~/.claude
```

#### 方式 B：复制文件

```bash
# 复制配置到 Claude 目录
cp -r ~/claude-code-configs/agents ~/.claude/
cp -r ~/claude-code-configs/commands ~/.claude/
cp -r ~/claude-code-configs/skills ~/.claude/
cp ~/claude-code-configs/CLAUDE.md ~/.claude/
```

### 3. 验证安装

重启 Claude Code，然后测试命令：

```
/req 测试需求澄清功能
```

## 目录结构说明

安装后，Claude Code 将识别以下目录：

```
~/.claude/
├── agents/              # Agent 定义
│   ├── requirement-analyst.md
│   ├── planner.md
│   └── tdd-guide.md
├── commands/            # Slash 命令
│   ├── req.md
│   ├── plan.md
│   └── tdd.md
├── skills/              # 可复用技能
│   ├── requirement-workflow/
│   ├── planning-workflow/
│   └── tdd-workflow/
└── CLAUDE.md           # 项目指导
```

## 更新配置

### 符号链接方式

```bash
cd ~/claude-code-configs
git pull origin main
# 自动生效，无需额外操作
```

### 复制方式

```bash
cd ~/claude-code-configs
git pull origin main

# 重新复制
rm -rf ~/.claude/agents ~/.claude/commands ~/.claude/skills
cp -r agents commands skills ~/.claude/
```

## 自定义配置

### 添加自己的 Agent

```bash
# 创建新 agent 文件
cat > ~/.claude/agents/my-agent.md << 'EOF'
---
name: my-agent
description: 我的自定义 agent
model: sonnet
tools: ["Read", "Write", "Edit"]
---

# Agent 指令
...
EOF
```

### 添加自己的命令

```bash
# 创建新命令文件
cat > ~/.claude/commands/my-cmd.md << 'EOF'
---
description: 我的自定义命令
---

# 命令文档
...
EOF
```

## 故障排除

### 命令未识别

检查文件位置是否正确：

```bash
ls -la ~/.claude/commands/
```

### Agent 未加载

检查 frontmatter 格式：

```bash
head -10 ~/.claude/agents/planner.md
```

### 恢复备份

```bash
# 如果配置了符号链接，先删除
rm ~/.claude

# 恢复备份
mv ~/.claude.backup.20240101 ~/.claude
```

## 卸载

```bash
# 删除符号链接或目录
rm ~/.claude

# 恢复原始配置（如有备份）
mv ~/.claude.backup.20240101 ~/.claude
```
