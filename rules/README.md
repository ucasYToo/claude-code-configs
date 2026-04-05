# 规则

## 结构

规则组织为 **通用** 层加 **语言特定** 目录：

```
rules/
├── common/          # 语言无关原则（始终安装）
│   ├── coding-style.md
│   ├── git-workflow.md
│   ├── testing.md
│   ├── performance.md
│   ├── patterns.md
│   ├── hooks.md
│   ├── agents.md
│   └── security.md
├── typescript/      # TypeScript/JavaScript 特定
├── python/          # Python 特定
├── golang/          # Go 特定
├── swift/           # Swift 特定
└── php/             # PHP 特定
```

- **common/** 包含通用原则 — 没有语言特定的代码示例。
- **语言目录** 用框架特定模式、工具和代码示例扩展通用规则。每个文件引用其通用对应文件。

## 安装

### 方式 1：安装脚本（推荐）

```bash
# 安装通用 + 一个或多个语言特定规则集
./install.sh typescript
./install.sh python
./install.sh golang
./install.sh swift
./install.sh php

# 一次安装多个语言
./install.sh typescript python
```

### 方式 2：手动安装

> **重要：** 复制整个目录 — 不要用 `/*` 扁平化。
> 通用和语言特定目录包含同名文件。
> 将它们扁平化到一个目录会导致语言特定文件覆盖
> 通用规则，并破坏语言特定文件使用的相对 `../common/` 引用。

```bash
# 安装通用规则（所有项目必需）
cp -r rules/common ~/.claude/rules/common

# 根据项目技术栈安装语言特定规则
cp -r rules/typescript ~/.claude/rules/typescript
cp -r rules/python ~/.claude/rules/python
cp -r rules/golang ~/.claude/rules/golang
cp -r rules/swift ~/.claude/rules/swift
cp -r rules/php ~/.claude/rules/php

# 注意！！！根据实际项目需求配置；此处配置仅供参考。
```

## 规则 vs 技能

- **规则** 定义广泛适用的标准、约定和检查清单（例如，"80% 测试覆盖率"、"没有硬编码密钥"）。
- **技能**（`skills/` 目录）为特定任务提供深入的、可操作的参考资料（例如，`python-patterns`、`golang-testing`）。

语言特定规则文件在适当的地方引用相关技能。规则告诉您*做什么*；技能告诉您*如何做*。

## 添加新语言

要添加对新语言的支持（例如 `rust/`）：

1. 创建 `rules/rust/` 目录
2. 添加扩展通用规则的文件：
   - `coding-style.md` — 格式化工具、习惯用语、错误处理模式
   - `testing.md` — 测试框架、覆盖率工具、测试组织
   - `patterns.md` — 语言特定设计模式
   - `hooks.md` — 格式化工具、linter、类型检查器的 PostToolUse hooks
   - `security.md` — 密钥管理、安全扫描工具
3. 每个文件应以以下内容开头：
   ```
   > 此文件扩展 [common/xxx.md](../common/xxx.md) 添加 <语言> 特定内容。
   ```
4. 引用现有技能（如果可用），或在 `skills/` 下创建新技能。

## 规则优先级

当语言特定规则和通用规则冲突时，**语言特定规则优先**（具体覆盖通用）。这遵循标准的分层配置模式（类似于 CSS 特异性或 `.gitignore` 优先级）。

- `rules/common/` 定义适用于所有项目的通用默认值。
- `rules/golang/`、`rules/python/`、`rules/swift/`、`rules/php/`、`rules/typescript/` 等在用语言习惯用语不同的那些地方覆盖这些默认值。

### 示例

`common/coding-style.md` 推荐不可变性作为默认原则。语言特定的 `golang/coding-style.md` 可以覆盖它：

> 习惯用法的 Go 使用指针接收器进行结构体修改 — 参见 [common/coding-style.md](../common/coding-style.md) 了解通用原则，但这里优先使用符合 Go 习惯的可变。

### 带覆盖注释的通用规则

`rules/common/` 中可能被语言特定文件覆盖的规则标记为：

> **语言注意**：此规则可能被语言特定规则覆盖，其中此模式在该语言中不是习惯用法。
