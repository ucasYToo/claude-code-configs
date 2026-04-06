---
name: novel-query
description: 查询网络小说项目数据。包括人物状态、能力数值、时间线、伏笔状态、写作统计等。
---

# Novel Query - 项目数据查询

快速查询小说项目的各类数据，不涉及Agent协作。

## 查询类型

### 人物数据

```
/novel query 主角当前能力
/novel query 主角能力变化
/novel query 主角关系网络
/novel query 主角弧光进度
/novel query 女主状态
```

**数据来源**: `05-数据/characters.json`

### 时间线

```
/novel query 时间线
/novel query 第11章日期
/novel query 时间跳跃
```

**数据来源**: `05-数据/timeline.json`

### 伏笔状态

```
/novel query 伏笔列表
/novel query 未回收伏笔
/novel query 伏笔001状态
```

**数据来源**: `05-数据/foreshadowings.json`

### 写作统计

```
/novel query 写作统计
/novel query 第1篇进度
/novel query 总字数
```

**计算来源**: `04-正文/` 目录文件

## 输出格式

根据查询类型返回结构化数据：

```markdown
# 查询结果: 主角当前能力

| 能力 | 数值 | 成长曲线 |
|------|------|----------|
| 弹跳 | 90 | ████████░░ 80% |
| 中投 | 40 | ███░░░░░░░ 30% |
| 三分 | 25 | ██░░░░░░░░ 20% |

最近10章变化:
- 第1章 → 第11章: 中投 35→40 (+5)
- 第5章 → 第11章: 弹跳 85→90 (+5)
```

## 使用场景

- 写作前快速查看人物状态
- 检查伏笔回收情况
- 了解时间线进展
- 统计写作进度
