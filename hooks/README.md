# Hooks

Hooks 是在 Claude Code 工具执行之前或之后触发的事件驱动自动化。它们强制执行代码质量、尽早捕获错误并自动化重复检查。

## Hooks 如何工作

```
用户请求 → Claude 选择工具 → PreToolUse hook 运行 → 工具执行 → PostToolUse hook 运行
```

- **PreToolUse** hooks 在工具执行前运行。它们可以**阻塞**（退出代码 2）或**警告**（stderr 而不阻塞）。
- **PostToolUse** hooks 在工具完成后运行。它们可以分析输出但不能阻塞。
- **Stop** hooks 在每次 Claude 响应后运行。
- **SessionStart/SessionEnd** hooks 在会话生命周期边界运行。
- **PreCompact** hooks 在上下文压缩前运行，用于保存状态。

## 此插件中的 Hooks

### PreToolUse Hooks

| Hook | 匹配器 | 行为 | 退出代码 |
|------|---------|----------|-----------|
| **开发服务器阻塞器** | `Bash` | 在 tmux 外部阻塞 `npm run dev` 等 — 确保日志访问 | 2 (阻塞) |
| **Tmux 提醒** | `Bash` | 建议对长时间运行的命令使用 tmux（npm test、cargo build、docker） | 0 (警告) |
| **Git push 提醒** | `Bash` | 在 `git push` 前提醒审查更改 | 0 (警告) |
| **文档文件警告** | `Write` | 对非标准 `.md`/`.txt` 文件警告（允许 README、CLAUDE、CONTRIBUTING、CHANGELOG、LICENSE、SKILL、docs/、skills/）；跨平台路径处理 | 0 (警告) |
| **策略性压缩** | `Edit\|Write` | 在逻辑间隔建议手动 `/compact`（每约 50 次工具调用） | 0 (警告) |
| **InsAIts 安全监控（可选）** | `Bash\|Write\|Edit\|MultiEdit` | 对高信号工具输入的可选安全扫描。除非设置了 `ECC_ENABLE_INSAITS=1` 否则禁用。关键发现时阻塞，非关键时警告，并写入审计日志到 `.insaits_audit_session.jsonl`。需要 `pip install insa-its`。[详情](../scripts/hooks/insaits-security-monitor.py) | 2 (阻塞关键) / 0 (警告) |

### PostToolUse Hooks

| Hook | 匹配器 | 功能 |
|------|---------|-------------|
| **PR 记录器** | `Bash` | 在 `gh pr create` 后记录 PR URL 和审查命令 |
| **构建分析** | `Bash` | 构建命令后的后台分析（异步、非阻塞） |
| **质量门** | `Edit\|Write\|MultiEdit` | 编辑后运行快速质量检查 |
| **Prettier 格式化** | `Edit` | 编辑后使用 Prettier 自动格式化 JS/TS 文件 |
| **TypeScript 检查** | `Edit` | 编辑 `.ts`/`.tsx` 文件后运行 `tsc --noEmit` |
| **console.log 警告** | `Edit` | 对编辑文件中的 `console.log` 语句警告 |

### 生命周期 Hooks

| Hook | 事件 | 功能 |
|------|-------|-------------|
| **会话开始** | `SessionStart` | 加载先前上下文并检测包管理器 |
| **预压缩** | `PreCompact` | 在上下文压缩前保存状态 |
| **Console.log 审计** | `Stop` | 每次响应后检查所有修改的文件中的 `console.log` |
| **会话摘要** | `Stop` | 当转录路径可用时持久化会话状态 |
| **模式提取** | `Stop` | 评估会话以获取可提取的模式（持续学习） |
| **成本跟踪器** | `Stop` | 发出轻量级运行成本遥测标记 |
| **Skill 执行回顾** | `Stop` | 检测 skill 调用并提示执行质量回顾 |
| **会话结束标记** | `SessionEnd` | 生命周期标记和清理日志 |

## 自定义 Hooks

### 禁用 Hook

在 `hooks.json` 中删除或注释掉 hook 条目。如果作为插件安装，在您的 `~/.claude/settings.json` 中覆盖：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [],
        "description": "Override: allow all .md file creation"
      }
    ]
  }
}
```

### 运行时 Hook 控制（推荐）

使用环境变量控制 hook 行为而无需编辑 `hooks.json`：

```bash
# minimal | standard | strict (default: standard)
export ECC_HOOK_PROFILE=standard

# 禁用特定 hook ID（逗号分隔）
export ECC_DISABLED_HOOKS="pre:bash:tmux-reminder,post:edit:typecheck"
```

配置文件：
- `minimal` — 仅保留基本生命周期和安全 hooks。
- `standard` — 默认；平衡质量 + 安全检查。
- `strict` — 启用额外的提醒和更严格的防护。

### 编写您自己的 Hook

Hooks 是接收工具输入作为 stdin 上的 JSON 并必须在 stdout 上输出 JSON 的 shell 命令。

**基本结构：**

```javascript
// my-hook.js
let data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  const input = JSON.parse(data);

  // 访问工具信息
  const toolName = input.tool_name;        // "Edit", "Bash", "Write", 等
  const toolInput = input.tool_input;      // 工具特定参数
  const toolOutput = input.tool_output;    // 仅在 PostToolUse 中可用

  // 警告（非阻塞）：写入 stderr
  console.error('[Hook] Warning message shown to Claude');

  // 阻塞（仅限 PreToolUse）：以代码 2 退出
  // process.exit(2);

  // 始终将原始数据输出到 stdout
  console.log(data);
});
```

**退出代码：**
- `0` — 成功（继续执行）
- `2` — 阻塞工具调用（仅限 PreToolUse）
- 其他非零 — 错误（记录但不阻塞）

### Hook 输入模式

```typescript
interface HookInput {
  tool_name: string;          // "Bash", "Edit", "Write", "Read", 等
  tool_input: {
    command?: string;         // Bash: 正在运行的命令
    file_path?: string;       // Edit/Write/Read: 目标文件
    old_string?: string;      // Edit: 正在替换的文本
    new_string?: string;      // Edit: 替换文本
    content?: string;         // Write: 文件内容
  };
  tool_output?: {             // 仅限 PostToolUse
    output?: string;          // 命令/工具输出
  };
}
```

### 异步 Hooks

对于不应阻塞主流程的 hooks（例如，后台分析）：

```json
{
  "type": "command",
  "command": "node my-slow-hook.js",
  "async": true,
  "timeout": 30
}
```

异步 hooks 在后台运行。它们不能阻塞工具执行。

## 常见 Hook 配方

### 警告 TODO 注释

```json
{
  "matcher": "Edit",
  "hooks": [{
    "type": "command",
    "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const ns=i.tool_input?.new_string||'';if(/TODO|FIXME|HACK/.test(ns)){console.error('[Hook] New TODO/FIXME added - consider creating an issue')}console.log(d)})\""
  }],
  "description": "Warn when adding TODO/FIXME comments"
}
```

### 阻塞大文件创建

```json
{
  "matcher": "Write",
  "hooks": [{
    "type": "command",
    "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const c=i.tool_input?.content||'';const lines=c.split('\\n').length;if(lines>800){console.error('[Hook] BLOCKED: File exceeds 800 lines ('+lines+' lines)');console.error('[Hook] Split into smaller, focused modules');process.exit(2)}console.log(d)})\""
  }],
  "description": "Block creation of files larger than 800 lines"
}
```

### 使用 ruff 自动格式化 Python 文件

```json
{
  "matcher": "Edit",
  "hooks": [{
    "type": "command",
    "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path||'';if(/\\.py$/.test(p)){const{execFileSync}=require('child_process');try{execFileSync('ruff',['format',p],{stdio:'pipe'})}catch(e){}}console.log(d)})\""
  }],
  "description": "Auto-format Python files with ruff after edits"
}
```

### 要求新源文件附带测试文件

```json
{
  "matcher": "Write",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path||'';if(/src\\/.*\\.(ts|js)$/.test(p)&&!/\\.test\\.|\\.spec\\./.test(p)){const testPath=p.replace(/\\.(ts|js)$/,'.test.$1');if(!fs.existsSync(testPath)){console.error('[Hook] No test file found for: '+p);console.error('[Hook] Expected: '+testPath);console.error('[Hook] Consider writing tests first (/tdd)')}}console.log(d)})\""
  }],
  "description": "Remind to create tests when adding new source files"
}
```

## 跨平台说明

Hook 逻辑使用 Node.js 脚本实现，以在 Windows、macOS 和 Linux 上实现跨平台行为。保留了一小部分 shell 包装器用于持续学习观察者 hooks；这些包装器具有配置文件门控和 Windows 安全回退行为。

## 相关

- [rules/common/hooks.md](../rules/common/hooks.md) — Hook 架构指南
- [skills/strategic-compact/](../skills/strategic-compact/) — 策略性压缩技能
- [scripts/hooks/](../scripts/hooks/) — Hook 脚本实现
