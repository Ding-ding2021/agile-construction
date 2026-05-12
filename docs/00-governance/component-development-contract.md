---
id: DOC-00-GOVERNANCE-COMPONENT-CONTRACT
number: GOV-010
domain: governance
category: component-contract
title: 组件开发契约模板（Component Development Contract）
date: 2026-04-25
status: active
source_of_truth: true
---

# 组件开发契约模板

> **目的**：在「设计 → 代码」的转化过程中，建立标准化交接文档，消除「看着像但代码里全是硬编码」的问题。  
> **适用范围**：所有 `src/components/shared/` 下的共享组件，以及业务页面中的可复用子组件。  
> **执行方式**：开发前由 PM 或设计师填写契约，开发完成后由开发者自检并勾选验收项。

---

## 一、契约模板

````markdown
# 组件契约：[组件英文名]

## 1. 基础信息

| 字段       | 内容                                           |
| ---------- | ---------------------------------------------- |
| 组件名     | `ComponentName`                                |
| 所属域     | `shared` / `project` / `task` / ...            |
| 设计稿来源 | Figma 链接 / Pixso 画板 ID                     |
| 优先级     | P0（阻塞其他任务）/ P1（本周内）/ P2（可排期） |
| 负责人     | AI Agent / 开发者                              |

---

## 2. Props 接口契约

| Prop      | 类型                     | 必填 | 默认值      | 说明           |
| --------- | ------------------------ | ---- | ----------- | -------------- |
| `propA`   | `string`                 | ✅   | —           | 主标题文本     |
| `propB`   | `number`                 | ❌   | `0`         | 数值，用于展示 |
| `propC`   | `() => void`             | ❌   | `undefined` | 点击回调       |
| `variant` | `'default' \| 'compact'` | ❌   | `'default'` | 布局变体       |

**约束规则**：

- [ ] 所有 Props 必须为 `readonly`（TypeScript `Readonly<T>`）
- [ ] 禁止透传 `...rest` 到 DOM（防止注入未知属性）
- [ ] 回调函数命名统一为 `onXxx` 格式

---

## 3. Design Token 映射

> 所有视觉值必须从设计系统 token 取值，禁止硬编码。

| 视觉属性 | 设计 Token        | CSS 变量 / Tailwind 类                        | 当前值                       |
| -------- | ----------------- | --------------------------------------------- | ---------------------------- |
| 背景色   | `surface-primary` | `bg-slate-900` / `var(--pm-surface)`          | `#0f172a`                    |
| 圆角     | `radius-lg`       | `rounded-xl` / `var(--pm-radius-lg)`          | `12px`                       |
| 内边距   | `space-4`         | `p-4` / `var(--pm-space-4)`                   | `16px`                       |
| 主文字色 | `text-primary`    | `text-slate-100` / `var(--pm-text-primary)`   | `#f1f5f9`                    |
| 次文字色 | `text-secondary`  | `text-slate-400` / `var(--pm-text-secondary)` | `#94a3b8`                    |
| 阴影     | `shadow-card`     | `shadow-lg` / `var(--pm-shadow-card)`         | `0 4px 24px rgba(0,0,0,0.4)` |

**自检命令**：

```bash
# 确保组件文件中不存在硬编码色值
grep -n "rgba\|#" src/components/shared/data-display/StatCard.tsx
# 预期：仅返回 import 路径或注释中的匹配，无样式值
```
````

---

## 4. 状态与交互契约

| 交互场景 | 触发条件         | 状态变化                    | 副作用                       |
| -------- | ---------------- | --------------------------- | ---------------------------- |
| 鼠标悬停 | `onMouseEnter`   | `isHovered = true`          | 背景色过渡至 `surface-hover` |
| 点击     | `onClick`        | `isActive = true`（若支持） | 调用 `onXxx` 回调            |
| 数据加载 | `loading = true` | 显示骨架屏                  | 不触发任何回调               |

**状态管理规则**：

- [ ] 组件内部状态使用 `useState`，命名前缀为内部状态（如 `isExpanded`）
- [ ] 需要跨组件共享的状态，必须提升到 Zustand Store，禁止通过 props drilling 传递超过 2 层
- [ ] 动画状态使用 CSS transition，禁止用 `useEffect` + `setTimeout` 模拟动画

---

## 5. 依赖与组合契约

| 依赖项     | 来源                           | 用途     | 是否可替代                 |
| ---------- | ------------------------------ | -------- | -------------------------- |
| `Icon`     | `src/components/shared/icons`  | 图标渲染 | 否，必须使用统一 Icon 组件 |
| `AppShell` | `src/components/shared/layout` | 外层布局 | 否                         |

**组合规则**：

- [ ] 组件内部不直接引用业务数据类型（如 `ProjectItem`），如需使用，通过 Props 传入或定义内部 `Item` 类型
- [ ] 共享组件禁止依赖 `src/domain/` 或 `src/data/` 层（防止循环依赖）
- [ ] 组件高度超过 300 行时，必须拆分为子组件或 Hooks

---

## 6. 测试与验收标准

### 6.1 视觉验收

- [ ] 与设计稿像素级对齐（允许 ±2px 偏差）
- [ ] 暗色模式（当前唯一主题）下无对比度问题
- [ ] 悬停、点击、禁用态均有明确视觉反馈

### 6.2 功能验收

- [ ] 所有 Props 组合均可正常渲染（使用 Storybook 或临时测试页）
- [ ] 回调函数在正确时机触发，参数符合类型定义
- [ ] 边界条件处理：`loading` / `empty` / `error` 三种状态均有 UI 表现

### 6.3 代码质量验收

- [ ] `npm run lint` 零报错
- [ ] 无 `any` 类型（除与外部库交互的必要场景）
- [ ] 无未使用变量 / 导入
- [ ] CSS 中无硬编码色值 / 间距 / 圆角（全部使用 token）

---

## 7. 交付物清单

| 交付物           | 路径                                               | 状态 |
| ---------------- | -------------------------------------------------- | ---- |
| 组件源码         | `src/components/shared/xxx/ComponentName.tsx`      | ⬜   |
| 样式文件（如需） | `src/components/shared/xxx/ComponentName.css`      | ⬜   |
| 单元测试（如有） | `src/components/shared/xxx/ComponentName.test.tsx` | ⬜   |
| 使用示例         | 本契约「8. 使用示例」节                            | ⬜   |
| 设计稿截图       | 附在契约末尾                                       | ⬜   |

---

## 8. 使用示例

```tsx
// 典型用法
<ComponentName
  propA="示例标题"
  propB={42}
  onClick={() => console.log('clicked')}
  variant="compact"
/>

// 边界条件：空数据
<ComponentName propA="" propB={0} />

// 边界条件：加载中
<ComponentName propA="加载中..." loading />
```

---

## 9. 变更记录

| 日期       | 变更人 | 变更内容 | 版本 |
| ---------- | ------ | -------- | ---- |
| 2026-04-25 | PM     | 初始创建 | v1.0 |

```

---

## 二、使用流程

```

设计稿定稿 → PM 填写契约（1-2-3-4-5 节）→ AI / 开发
↓
开发中随时对照契约自检
↓
开发完成 → 开发者勾选 6-7-8 节
↓
PM 验收（看契约 + 看页面 + 跑命令）
↓
合并 / 打回

````

---

## 三、示例：以 `StatCard` 为例的已填写契约

### 3.1 基础信息

| 字段 | 内容 |
|------|------|
| 组件名 | `StatCard` |
| 所属域 | `shared/data-display` |
| 设计稿来源 | Figma: 营建管理系统 / 组件库 / Data Display |
| 优先级 | P0 |
| 负责人 | AI Agent |

### 3.2 Props 接口

| Prop | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `label` | `string` | ✅ | — | 指标名称，如「进行中项目」 |
| `value` | `string \| number` | ✅ | — | 指标值，如 `12` |
| `delta` | `number` | ❌ | `undefined` | 环比变化百分比，如 `+15` |
| `trend` | `'up' \| 'down' \| 'neutral'` | ❌ | `'neutral'` | 趋势方向，决定颜色 |
| `onClick` | `() => void` | ❌ | `undefined` | 点击后触发筛选 |
| `active` | `boolean` | ❌ | `false` | 是否为当前激活的筛选条件 |

### 3.3 Design Token 映射

| 视觉属性 | 设计 Token | Tailwind 类 | 当前值 |
|----------|-----------|-------------|--------|
| 卡片背景 | `surface-card` | `bg-slate-800/60` | `rgba(30, 41, 59, 0.6)` |
| 边框 | `border-subtle` | `border-slate-700/50` | `rgba(51, 65, 85, 0.5)` |
| 圆角 | `radius-lg` | `rounded-xl` | `12px` |
| 主数值色 | `text-primary` | `text-slate-100` | `#f1f5f9` |
| 上涨色 | `semantic-success` | `text-emerald-400` | `#34d399` |
| 下跌色 | `semantic-danger` | `text-rose-400` | `#fb7185` |

### 3.4 状态与交互

| 交互场景 | 触发条件 | 状态变化 | 副作用 |
|----------|---------|---------|--------|
| 悬停 | `onMouseEnter` | 背景色过渡至 `surface-hover` | 无 |
| 点击 | `onClick` | `active` 由外部控制 | 调用 `onClick`，外部切换筛选 |
| 激活态 | `active = true` | 边框高亮为 `border-primary` | 无 |

### 3.5 依赖

| 依赖项 | 来源 | 用途 | 可替代 |
|--------|------|------|--------|
| `Icon` | `shared/icons` | 趋势箭头图标 | 否 |

### 3.6 验收（开发完成后勾选）

- [x] 与设计稿像素级对齐
- [x] 三种趋势色正确显示
- [x] `onClick` + `active` 组合工作正常
- [x] `npm run lint` 通过
- [x] 无 CSS 硬编码

### 3.7 使用示例

```tsx
<StatCard
  label="进行中项目"
  value={12}
  delta={15}
  trend="up"
  active={filter === 'active'}
  onClick={() => setFilter('active')}
/>
````

---

## 四、契约与代码质量红线的关系

本契约是对 `mvp-code-quality-plan-v2.md` 中「AI 编码流程控制」层的具体落地：

| 质量红线                               | 契约对应节           | 检查方式                             |
| -------------------------------------- | -------------------- | ------------------------------------ |
| `domain/` / `data/` 层禁止 AI 直接修改 | 5. 依赖与组合契约    | 契约中明确禁止共享组件依赖底层       |
| 核心模块输出测试 + 流程图              | 6. 测试与验收        | 契约强制要求单元测试和边界条件       |
| 修改前先 `npm run lint`                | 6.3 代码质量验收     | 契约将 lint 作为合并门禁             |
| 无 CSS 魔法值                          | 3. Design Token 映射 | 契约要求全部使用 token，并附自检命令 |

---

## 五、如何推广

1. **存量组件**：选择 3-5 个最常用的共享组件（`StatCard`、`AppSidebar`、`PageHeader`、`TabNav`）补填契约，作为范例。
2. **增量组件**：从下一个新组件开始，强制要求「无契约不开发」。
3. **契约审查**：每轮迭代中，PM 花 5 分钟检查契约是否与实际代码一致。
