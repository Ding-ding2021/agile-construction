# 常见错误与修复记录

> 记录已解决过的问题，避免重复犯错

## CSS 类名错误

### ❌ 错误

```tsx
<div className="project-detail-header">
```

### ✅ 正确

```tsx
<div className="rounded-2xl bg-white/[0.04] border border-white/8">
```

### 教训

- 禁止硬编码 CSS 类名
- 必须使用 design system tokens
- 每次修改 CSS 后运行 `npm run lint`

## 路由问题

### ❌ 错误

```tsx
href = '#/procurement' // 无法匹配子路径
```

### ✅ 正确

```tsx
// 路由配置
{
  path: '#/procurement*',  // 匹配所有子路径
  component: ProcurementPage
}
```

### 教训

- 父路由必须带 `*` 通配符
- 检查 `readRouteFromHash` 的匹配逻辑

## localStorage 使用

### ❌ 错误

```tsx
// 在组件中直接调用
localStorage.setItem('key', value)
```

### ✅ 正确

```tsx
// 通过 store
const { updateProject } = useProjectStore()
```

### 教训

- 禁止在子组件中直接操作 localStorage
- 统一通过 Zustand store
- Repository 层封装所有存储操作

## TypeScript 类型

### ❌ 错误

```tsx
const data: any = fetchData()
```

### ✅ 正确

```tsx
const data: ProjectData = fetchData()
```

### 教训

- 禁止使用 `any` 类型
- 修改类型定义必须同步更新所有消费方
