---
name: ui-layout-rules
description: 2px 跳跃间距、禁止纯黑纯白、表格灰色边框、优先复用 shadcn 组件、布局规范
---

# UI Layout Rules

## 概述

本 skill 定义了 UI 开发中最容易被忽略的细节规范。所有 UI 评估员、开发交付者、UI 验收员在涉及前端样式时**必须**参照本规范。

---

## 1. 间距规范（2px 跳跃）

所有间距（margin / padding / gap）必须是 **2px 的整数倍**。

| 跳跃 | 实际值 | Tailwind class    | 推荐场景                 |
| ---- | ------ | ----------------- | ------------------------ |
| 1×   | 2px    | `gap-0.5` `p-0.5` | 极小间距，图标内部留白   |
| 2×   | 4px    | `gap-1` `p-1`     | 图标与文字间隙           |
| 4×   | 8px    | `gap-2` `p-2`     | Badge 组、内联元素间距   |
| 6×   | 12px   | `gap-3` `p-3`     | 表单字段间间距           |
| 8×   | 16px   | `gap-4` `p-4`     | 卡片内容区、页面边距     |
| 10×  | 20px   | —                 | 仅在外层容器用 `p-5`     |
| 12×  | 24px   | `gap-6` `p-6`     | 区块之间、卡片内 padding |
| 16×  | 32px   | `gap-8` `p-8`     | 大区块间距、大页面边距   |
| 20×  | 40px   | `gap-10`          | 页面内大标题与内容区     |

### 执行规则

- ✅ 优先使用 Tailwind spacing scale 预设值（`p-*` `gap-*` `m-*` _ `space-x/y-_`）
- ❌ 禁止使用 `px-3.5` `m-2.5` 等 0.5 步长（不是 2px 整数倍）
- ❌ 禁止硬编码自定义间距（`style={{ marginTop: 13 }}`）
- ✅ 可接受：shadcn 组件自带的内部间距（它们遵循 shadcn 自身规范）

---

## 2. 色彩规范（慎用纯黑纯白）

| 规则     | 禁止                                    | 推荐替代                                              |
| -------- | --------------------------------------- | ----------------------------------------------------- |
| 纯黑背景 | `#000000` `bg-black` `rgb(0,0,0)`       | 最深用 `bg-neutral-950` ≈ `oklch(0.145 0 0)` ≈ 85% 黑 |
| 纯白背景 | `#FFFFFF` `bg-white` `rgb(255,255,255)` | 最浅用 `bg-neutral-50` ≈ `oklch(0.985 0 0)`           |
| 纯黑文字 | `#000` `text-black`                     | 最深用 `text-neutral-900` 或 `text-foreground`        |
| 纯白文字 | `#FFF` `text-white`                     | 最浅用 `text-neutral-50` 或 `text-primary-foreground` |

### 灰色过渡

- ❌ 不用 `opacity` 做颜色过渡（如 `bg-black/10`）
- ✅ 用 Tailwind gray scale 做分层（`bg-neutral-50 → bg-neutral-100 → bg-neutral-200`）
- ✅ 静默态用 `bg-muted` / `text-muted-foreground`

### 表格边框

- ✅ 表格边框统一用 `border-border`（≈ `neutral-200`，亮色）
- ✅ 暗色模式用 `dark:border-border`（≈ `neutral-700`）
- ✅ 行分割线用 `border-b border-border`
- ❌ 不用 `ring` 替代表格边框

---

## 3. 组件复用优先

### 优先级（从高到低）

1. **项目内的 shadcn 组件** — `src-next/components/ui/` 下已有组件直接使用
2. **安装新 shadcn 组件** — 调用 `shadcn-management` skill 搜索并安装
3. **组合 shadcn 组件** — 用现有 shadcn 组件搭建业务组件（如用 Table + Badge + Button 组合）
4. **手写** — 仅在没有 shadcn 组件且组合无法满足时，且必须符合本规范

### 具体规则

- ✅ 按钮 → `src-next/components/ui/button.tsx`
- ✅ 表格 → `src-next/components/ui/table.tsx`
- ✅ 表单 → react-hook-form + shadcn Form 组件
- ✅ 对话框 → `src-next/components/ui/dialog.tsx`
- ❌ 禁止手写基础 UI 组件（Button / Input / Select / Checkbox 等）
- ❌ 禁止引入 shadcn 外的 UI 库（MUI、Ant Design 等）
- ✅ 动画用 `transition-all duration-200`，shadcn 组件隐式包含

---

## 4. 布局规范

### 页面骨架

所有新页面遵循：

```
┌─────────────────────────────────────────┐
│ main (@container/main)                   │
│ flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8│
│ ┌─────────────────────────────────────┐ │
│ │ PageHeader (title + actions + tabs) │ │
│ ├─────────────────────────────────────┤ │
│ │ 内容区                               │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

- ✅ 页面外层用 `@container/main` + `flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8`
- ✅ 页头用 `PageHeader` 组件（如已有），内含标题 + 操作区
- ✅ 内容区内部响应式：移动端 1 列，桌面端按需 2/3/4 列
- ❌ 不用固定宽度、不用 `min-height` 定高

---

## 5. 验收检查项

UI 评估员 / UI 验收员用以下 checklist 逐条核对：

### 间距

- [ ] 所有间距是否 2px 整数倍？
- [ ] 是否有 `p-2.5` `m-1.5` 等 0.5 步长？
- [ ] 是否有 `style={{ margin: ... }}` 硬编码？

### 色彩

- [ ] 是否有 `bg-black` / `bg-white` 纯色？
- [ ] 是否有 `text-black` / `text-white` 纯色文字？
- [ ] 是否有 `bg-black/10` 等 opacity 过渡色？
- [ ] 是否有硬编码 HEX 色值？

### 组件

- [ ] 是否优先使用了 `src-next/components/ui/` 下的组件？
- [ ] 是否手写了 shadcn 已有组件？
- [ ] 是否需要安装新 shadcn 组件（`shadcn-management`）？

### 布局

- [ ] 页面外层是否用 `@container/main` + 标准骨架？
- [ ] 响应式是否覆盖移动端和桌面端？
- [ ] 表格边框是否用 `border-border`？

---

## 6. 参考

- 完整设计规范：`docs/01-product/design-spec-v2-shadcn.md`
- shadcn 组件管理：调用 `shadcn-management` skill
- 编码规范：`docs/00-governance/coding-standards.md`
