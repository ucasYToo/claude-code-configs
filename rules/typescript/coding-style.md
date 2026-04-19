# 编码风格

> 此文件扩展 [common/coding-style.md](../common/coding-style.md) 添加 TypeScript / React 前端特定内容。

## 语言优先

**优先使用 TypeScript** 而非 JavaScript：
- 所有新文件使用 `.ts` / `.tsx` 扩展名
- 启用严格模式 (`strict: true`)
- 避免使用 `any`，优先使用 `unknown` 并配合类型守卫
- 为函数参数和返回值显式声明类型

## 组件文件组织

每个组件应有**独立的文件夹**，按功能/领域组织：

```
components/
├── Button/
│   ├── Button.tsx
│   └── Button.module.css
├── UserCard/
│   ├── UserCard.tsx
│   └── UserCard.module.css
└── Header/
    ├── Header.tsx
    ├── Header.module.css
    └── index.ts          # 可选：统一导出
```

- 组件文件夹使用 PascalCase
- 文件夹内包含同名 `.tsx` 组件文件和 `.module.css` 样式文件
- 按功能/领域组织，不按类型（禁止 `components/`、`styles/`、`containers/` 扁平化分离）

## 样式规范

**使用 CSS Modules**（`.module.css`）：
- 每个组件对应一个 `.module.css` 文件
- 样式类名使用 camelCase
- 通过 `styles.className` 方式引用，避免全局命名冲突
- 禁止直接使用全局 CSS 或内联 `style` 属性（动态值除外）

```tsx
// 推荐
import styles from './Button.module.css';

function Button() {
  return <button className={styles.primary}>Click</button>;
}
```

## 类型命名

- 接口使用 PascalCase，前缀不加 `I`
- 类型别名使用 PascalCase
- 枚举使用 PascalCase，成员使用 UPPER_SNAKE_CASE

## 代码质量检查清单（前端扩展）

在标记工作完成之前：
- [ ] 使用 TypeScript 严格模式，无隐式 `any`
- [ ] 组件放在独立文件夹中（tsx + module.css）
- [ ] 样式使用 CSS Modules，无全局样式污染
- [ ]  Props 类型显式定义
