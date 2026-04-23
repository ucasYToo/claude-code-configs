# Everything Claude Code 同步概览

本文档记录了从 `everything-claude-code` 项目同步的内容及其用途。

## 同步内容清单

### 1. Commands (命令)

| 命令 | 文件 | 用途 |
|------|------|------|
| `/learn` | [commands/learn.md](commands/learn.md) | 从当前会话提取可重用模式，保存为 skill |
| `/learn-eval` | [commands/learn-eval.md](commands/learn-eval.md) | 评估 session 并自动提取可重用模式 |
| `/instinct-status` | [commands/instinct-status.md](commands/instinct-status.md) | 显示已学习的本能（项目+全局） |
| `/instinct-export` | [commands/instinct-export.md](commands/instinct-export.md) | 导出本想到文件，便于分享和迁移 |
| `/instinct-import` | [commands/instinct-import.md](commands/instinct-import.md) | 从文件/URL导入本能 |
| `/skill-create` | [commands/skill-create.md](commands/skill-create.md) | 分析 git 历史生成 SKILL.md |

**原有命令：**
- `/req`, `/plan`, `/tdd` (及其相关 agents)

### 2. Agents (代理)

新增同步的 agents：

| Agent | 文件 | 用途 |
|-------|------|------|
| `code-reviewer` | [agents/code-reviewer.md](agents/code-reviewer.md) | 代码审查专家 |
| `security-reviewer` | [agents/security-reviewer.md](agents/security-reviewer.md) | 安全漏洞检测 |
| `tdd-guide` | [agents/tdd-guide.md](agents/tdd-guide.md) | TDD 开发指导 |
| `planner` | [agents/planner.md](agents/planner.md) | 实现规划专家 |
| `build-error-resolver` | [agents/build-error-resolver.md](agents/build-error-resolver.md) | 构建错误修复 |
| `refactor-cleaner` | [agents/refactor-cleaner.md](agents/refactor-cleaner.md) | 死代码清理 |
| `e2e-runner` | [agents/e2e-runner.md](agents/e2e-runner.md) | E2E 测试执行 |
| `skill-retrospective` | [agents/skill-retrospective.md](agents/skill-retrospective.md) | Skill 执行质量回顾 |

### 3. Rules (规则)

Rules 是 Claude Code 的全局指导原则，存储在 `~/.claude/rules/` 目录下。

#### 什么是 Rules？

- **Rules** 定义标准、约定和检查清单，适用于所有项目
- 与 **Skills** 的区别：Rules 告诉你*做什么*，Skills 告诉你*怎么做*

#### 目录结构

```
rules/
├── common/          # 通用规则（必装）
│   ├── coding-style.md    # 编码风格（不可变性、文件组织等）
│   ├── git-workflow.md    # Git 工作流
│   ├── testing.md         # 测试要求（80%覆盖率、TDD）
│   ├── security.md        # 安全指南
│   ├── performance.md     # 性能优化
│   ├── patterns.md        # 常见模式
│   ├── hooks.md           # Hooks 系统
│   └── agents.md          # Agent 编排
└── README.md        # 安装说明
```

#### 核心规则摘要

**编码风格 (coding-style.md)**
- 始终使用不可变数据（创建新对象，不修改现有对象）
- 文件应该小而聚焦（200-400行典型，最多800行）
- 函数小于50行
- 正确处理错误

**测试要求 (testing.md)**
- 最低80%测试覆盖率
- TDD 强制流程：写测试（RED）→ 实现（GREEN）→ 重构（IMPROVE）
- 三种测试类型：单元测试、集成测试、E2E测试

**Git 工作流 (git-workflow.md)**
- Commit 格式：`type: description`
- Types: feat, fix, refactor, docs, test, chore, perf, ci

### 4. Hooks (钩子)

Hooks 是基于事件的自动化，在 Claude Code 工具执行前/后触发。

#### 什么是 Hooks？

```
用户请求 → Claude 选择工具 → PreToolUse hook 运行 → 工具执行 → PostToolUse hook 运行
```

- **PreToolUse**: 工具执行前运行（可以阻止执行，exit code 2）
- **PostToolUse**: 工具执行后运行（分析输出，不能阻止）
- **Stop**: 每次 Claude 响应后运行
- **SessionStart/SessionEnd**: 会话生命周期边界
- **PreCompact**: 上下文压缩前运行（用于保存状态）

#### 主要 Hooks

**PreToolUse Hooks:**
1. **Dev server blocker** (`Bash`) - 阻止在 tmux 外运行 `npm run dev` 等
2. **Tmux reminder** (`Bash`) - 建议长运行命令使用 tmux
3. **Git push reminder** (`Bash`) - 推送前提醒审查
4. **Doc file warning** (`Write`) - 警告非标准文档文件
5. **Strategic compact** (`Edit|Write`) - 建议手动 `/compact`

**PostToolUse Hooks:**
1. **PR logger** (`Bash`) - `gh pr create` 后记录 PR URL
2. **Quality gate** (`Edit|Write|MultiEdit`) - 编辑后运行质量检查
3. **Prettier format** (`Edit`) - 自动格式化 JS/TS
4. **TypeScript check** (`Edit`) - 编辑 `.ts/.tsx` 后运行类型检查
5. **console.log warning** (`Edit`) - 警告 console.log 语句

**Lifecycle Hooks:**
- **Session start** - 加载上下文、检测包管理器
- **Stop hooks** - 检查 console.log、持久化会话、评估模式、跟踪成本
- **Session end** - 生命周期标记

#### 运行时控制

```bash
# 设置 hook 配置文件 (minimal | standard | strict)
export ECC_HOOK_PROFILE=standard

# 禁用特定 hook
export ECC_DISABLED_HOOKS="pre:bash:tmux-reminder,post:edit:typecheck"
```

配置文件：
- `minimal` - 仅基本生命周期和安全 hooks
- `standard` - 默认；平衡质量+安全检查
- `strict` - 启用额外提醒和更严格 guardrails

## 安装方法

### 方式1：自动安装（如果支持）

某些命令可能需要 Everything Claude Code 插件作为依赖，特别是涉及到 `${CLAUDE_PLUGIN_ROOT}` 环境变量的命令。

### 方式2：手动配置

1. **Commands & Agents**: 已经同步到对应目录，Claude Code 会自动识别

2. **Rules**: 已经同步到 `rules/common/`，需要确保 `~/.claude/rules/common/` 存在

3. **Hooks**: 需要配置到 `~/.claude/settings.json`:
   ```json
   {
     "hooks": {
       // 从 hooks/hooks.json 复制内容
     }
   }
   ```

## 注意事项

1. **依赖关系**：某些命令（如 `instinct-*` 和 `skill-create`）依赖于 `continuous-learning-v2` skill，需要确保该 skill 已安装

2. **环境变量**：部分 hooks 使用 `${CLAUDE_PLUGIN_ROOT}`，需要手动替换为实际路径或安装完整插件

3. **选择性使用**：如果不需要全部功能，可以从 `hooks.json` 中选择性地启用需要的 hooks

## 参考链接

- Everything Claude Code 原项目: https://github.com/affaan-m/everything-claude-code
- Claude Code 文档: https://claude.ai/code
