# 代码模式学习记录

> OpenCode 自动学习的代码模式
> 来源: 历史任务成功实践

## React 组件模式

### 标准组件结构

```tsx
// 推荐结构
export function ComponentName({ prop1, prop2 }: Props) {
  // 1. Hooks
  const [state, setState] = useState()

  // 2. 计算属性
  const computed = useMemo(() => {}, [])

  // 3. 副作用
  useEffect(() => {}, [])

  // 4. 事件处理
  const handleEvent = useCallback(() => {}, [])

  // 5. 渲染
  return <div>...</div>
}
```

## CSS 模式

### 玻璃态卡片

```css
.glass-card {
  background: var(--pm-card);
  border: 1px solid var(--pm-border);
  border-radius: var(--pm-radius-xl);
  padding: var(--pm-spacing-lg);
}
```

## 文件组织模式

### 新组件创建清单

- [ ] 组件文件: `src/components/{domain}/ComponentName.tsx`
- [ ] Props 接口定义
- [ ] 导出组件
- [ ] 中文注释（每行）
- [ ] 遵循 design-specification.md
