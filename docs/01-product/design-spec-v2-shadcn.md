---
id: DOC-01-PRODUCT-DESIGN-SPEC-V2-SHADCN
title: 前端设计规范 V2 — shadcn Neutral Light
owner: docs-maintainer
status: active
last_updated: 2026-05-05
source_of_truth: true
template: dashboard-01 + sidebar-07
related_code:
  - src-next/index.css
  - src-next/components.json
  - src-next/components/ui/
  - src-next/components/app-sidebar.tsx
  - src-next/components/site-header.tsx
  - src-next/components/section-cards.tsx
  - src-next/components/chart-area-interactive.tsx
  - src-next/components/data-table.tsx
---

# 前端设计规范 V2 — shadcn Neutral Light

**文档角色**: Source of Truth（唯一执行规范）
**状态**: Active
**模板参考**: [dashboard-01](http://localhost:5175/dashboard) + sidebar-07
**版本**: v2.1.0
**更新日期**: 2026-05-03

---

## 一、设计哲学

黑白极简，零品牌干扰，内容优先。

| 原则                 | 说明                                                |
| -------------------- | --------------------------------------------------- |
| **最少颜色**         | 主色 = 白/黑色，仅通过语义色（红/绿/蓝/橙）表达状态 |
| **最少装饰**         | 无渐变、无品牌图案、无玻璃态特效                    |
| **组件原生**         | 直接使用 shadcn/ui 默认 variant，零封装层           |
| **语义通过间距表达** | 不用颜色区分层级，用间距和字重                      |
| **以模板为参照**     | 所有新页面须与 dashboard-01 / sidebar-07 视觉一致   |

---

## 二、颜色系统

采用 shadcn `baseColor: "neutral"`, `style: "base-nova"` 亮色主题。实际 CSS 变量值见 `src-next/index.css`。

### 2.1 核心色板

| Token                  | oklch              | Tailwind 别名             | 用途                   |
| ---------------------- | ------------------ | ------------------------- | ---------------------- |
| `--background`         | `oklch(1 0 0)`     | `bg-background`           | 页面背景（纯白）       |
| `--foreground`         | `oklch(0.145 0 0)` | `text-foreground`         | 默认文字               |
| `--card`               | `oklch(1 0 0)`     | `bg-card`                 | 卡片背景               |
| `--primary`            | `oklch(0.205 0 0)` | `bg-primary`              | 主按钮、强调态         |
| `--primary-foreground` | `oklch(0.985 0 0)` | `text-primary-foreground` | 主按钮文字             |
| `--secondary`          | `oklch(0.97 0 0)`  | `bg-secondary`            | 次要按钮、标签         |
| `--muted`              | `oklch(0.97 0 0)`  | `bg-muted`                | 静默表面               |
| `--muted-foreground`   | `oklch(0.556 0 0)` | `text-muted-foreground`   | 辅助文字（灰）         |
| `--border`             | `oklch(0.922 0 0)` | `border-border`           | **边框线** ≈ `#e4e4e7` |
| `--input`              | `oklch(0.922 0 0)` | `border-input`            | 输入框背景             |
| `--ring`               | `oklch(0.708 0 0)` | `ring-ring`               | 聚焦环颜色             |
| `--radius`             | `0.625rem`         | `rounded-lg`              | 圆角基准               |

### 2.2 功能色（chart-\*）

| Token       | 色值                        | 语义          |
| ----------- | --------------------------- | ------------- |
| `--chart-1` | `oklch(0.646 0.222 41.116)` | 进行中 / 蓝色 |
| `--chart-2` | `oklch(0.6 0.118 184.704)`  | 已完成 / 绿色 |
| `--chart-3` | `oklch(0.398 0.07 227.392)` | 待处理 / 深蓝 |
| `--chart-4` | `oklch(0.828 0.189 84.429)` | 告警 / 黄色   |
| `--chart-5` | `oklch(0.769 0.188 70.08)`  | 高风险 / 橙   |

### 2.3 暗色主题

`.dark` 选择器下所有 Token 反转，由用户偏好切换。当前默认使用亮色。

### 2.4 多色主题色板

支持多套色板，通过 `data-theme` 属性与亮/暗模式正交组合。

```html
<html class="dark" data-theme="blue">
  <!-- 暗色 + 蓝色主题 -->
</html>
```

| 色板             | 描述       | 主要变化                       |
| ---------------- | ---------- | ------------------------------ |
| `neutral` (默认) | 纯黑白极简 | —                              |
| `blue`           | 蓝色强调   | `--primary` / `--chart-1` 偏蓝 |
| `green`          | 绿色强调   | `--primary` / `--chart-1` 偏绿 |
| `slate`          | 灰蓝底色   | 背景色偏冷，对比柔和           |

实际色值定义在 `src-next/index.css` 中。新增色板步骤：

1. 在 `src-next/index.css` 中添加 `:root[data-theme="xxx"]` 和 `.dark[data-theme="xxx"]` 块
2. 在 `src-next/data/themes.ts` 中注册色板元数据（名称、预览色）
3. 系统设置页自动读取色板列表

### 2.5 禁止使用的颜色（覆盖 2.4 旧版）

- ❌ `--pm-*` 系列变量（旧品牌体系）
- ❌ `var(--pm-blue)`、`var(--pm-green)` 等旧品牌色
- ❌ `bg-white/5` 等任意透明度色值
- ❌ MUI 遗留的 `sx`、`style` prop
- ❌ HEX 色值（统一使用 oklch）

### 2.6 纯黑纯白限制

| 规则       | 禁止                                    | 推荐替代                                            |
| ---------- | --------------------------------------- | --------------------------------------------------- |
| 纯黑背景   | `#000000` `bg-black` `rgb(0,0,0)`       | 最深 `bg-neutral-950` ≈ `oklch(0.145 0 0)`          |
| 纯白背景   | `#FFFFFF` `bg-white` `rgb(255,255,255)` | 最浅 `bg-neutral-50` ≈ `oklch(0.985 0 0)`           |
| 纯黑文字   | `#000` `text-black`                     | 最深 `text-neutral-900` 或 `text-foreground`        |
| 纯白文字   | `#FFF` `text-white`                     | 最浅 `text-neutral-50` 或 `text-primary-foreground` |
| opacity 色 | `bg-black/10` 等透明度色值              | 用 Tailwind gray scale 分层（`neutral-50/100/200`） |

### 2.7 边框规范

| 元素       | 类名                                            |
| ---------- | ----------------------------------------------- |
| 卡片外框   | `border border-border`                          |
| 表格外框   | `border border-border`                          |
| 表格列分割 | `border-r border-border`（最后一列不加）        |
| 行下分割线 | `border-b border-border`                        |
| 禁用硬边框 | 不使用 `border-r/t/l/b` 不加 `border-border`    |
| 禁用       | `ring-1 ring-foreground/10`（用 `border` 替代） |

暗色模式表格边框自动适配 `border-border`（≈ `neutral-700`），无需额外 dark: 前缀。

---

## 三、字体系统

使用 Tailwind v4 默认系统字体栈。

| 层级     | 字号 | Tailwind                              | 字重 |
| -------- | ---- | ------------------------------------- | ---- |
| 统计数字 | 24px | `text-2xl font-semibold tabular-nums` | 600  |
| 卡片标题 | 16px | `text-base leading-snug font-medium`  | 500  |
| 正文     | 14px | `text-sm`                             | 400  |
| 辅助文字 | 13px | `text-sm text-muted-foreground`       | 400  |
| 极小     | 12px | `text-xs`                             | 400  |

---

## 四、间距系统

使用 Tailwind spacing scale，不定义自定义间距变量。

### 4.1 2px 跳跃原则

所有间距（margin / padding / gap）必须是 **2px 的整数倍**。禁止使用 `p-2.5` `m-1.5` 等 0.5 步长，禁止 `style={{ marginTop: 13 }}` 等硬编码。

| Tailwind | 值   | 跳跃倍数 | 场景                         |
| -------- | ---- | -------- | ---------------------------- |
| `gap-1`  | 4px  | 2×       | 图标与文字                   |
| `gap-2`  | 8px  | 4×       | Badge 组、内联元素           |
| `gap-3`  | 12px | 6×       | 表单字段间                   |
| `gap-4`  | 16px | 8×       | 卡片内容区、页面内容 padding |
| `gap-6`  | 24px | 12×      | 区块之间、卡片内 padding     |
| `p-4`    | 16px | 8×       | 页面边距                     |
| `p-8`    | 32px | 16×      | large 页面边距               |

shadcn 组件自带的内部间距不受此限制（它们遵循 shadcn 自身规范）。

---

## 五、布局规范

### 5.1 页面骨架

```
┌─────────────────────────────────────────┐
│ SidebarProvider (flex min-h-svh w-full)  │
│ ┌──────────┬──────────────────────────┐ │
│ │          │ SiteHeader (h-14)         │ │
│ │ Sidebar  ├──────────────────────────┤ │
│ │ icon/exp │ main (@container/main)    │ │
│ │ has-rail │ flex-1 flex-col          │ │
│ └──────────┴──────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 5.2 PageLayout 组件

所有标准页面必须使用 `<PageLayout>` 包裹作为内容容器。

```tsx
import { PageLayout } from '@/components/page-layout'

;<PageLayout>{页面内容}</PageLayout>
```

**行为：**

- 统一 padding：`p-4 md:p-8`
- 统一直间距：`space-y-4 md:space-y-8`
- 处理滚动溢出（`overflow-auto`）

**特殊页面**：沉浸式全高页面（如甘特图）不使用 PageLayout，直接在 `<main>` 中自由布局。

### 5.3 Sidebar（模板：sidebar-07）

| 属性             | 值         | 说明                   |
| ---------------- | ---------- | ---------------------- |
| `collapsible`    | `"icon"`   | 展开 256px / 折叠 48px |
| `SidebarRail`    | 窄条把手   | 拖拽切换宽/窄模式      |
| `SidebarTrigger` | 工具栏按钮 | 响应式切换             |

**内容结构**（从上到下）:

```
SidebarHeader
  └─ TeamSwitcher
SidebarContent
  ├─ NavMain (platform nav, 可折叠子菜单)
  ├─ NavProjects (项目列表)
  └─ NavSecondary (底部辅助导航)
SidebarFooter
  └─ NavUser (用户信息)
```

### 5.4 路由

使用 React Router v7（BrowserRouter），路径结构：

```
/dashboard          → DashboardPage（数据驱动）
/tasks              → 任务中心
/projects           → 项目中心
/personnel          → 人员管理
/settings           → 系统设置
```

### 5.5 页面布局模板

```
<SidebarProvider>
  <AppSidebar />
  <div className="flex flex-1 flex-col">
    <SiteHeader />
    <main className="flex flex-1 flex-col">
      <PageLayout>
        {children}
      </PageLayout>
    </main>
  </div>
</SidebarProvider>
```

---

## 六、组件规范

所有组件使用 shadcn/ui + @base-ui/react（base-nova style）组件库。添加新组件必须使用：

```bash
npx shadcn@latest add <component> -c src-next
# 然后检查自引用 bug：grep "from \"@/components/ui/<name>\"" src-next/components/ui/<name>.tsx
# 若自引用，修正为 from "@base-ui/react/<name>"
```

### 6.1 Button

```tsx
import { Button } from '@/components/ui/button'

<Button variant="default">   // 白底黑字 → 主要操作
<Button variant="secondary">  // 灰底 → 次要操作
<Button variant="outline">    // 透明 + 边框 → 轮廓
<Button variant="ghost">      // 透明 → 图标按钮
<Button variant="destructive">// 红底 → 删除
<Button size="sm">            // 28px → 工具栏/紧凑场景
<Button size="default">       // 32px → 标准
<Button size="icon">          // 32px → 图标按钮
```

### 6.2 Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@/components/ui/card'

<Card>                          // border border-border shadow-sm
  <CardHeader>                  // grid: [title desc] [action]
    <CardTitle />
    <CardDescription />
    <CardAction>                // 右上角操作区（badge等）
  </CardHeader>
  <CardContent />               // px-4
  <CardFooter>                  // bg-muted/50（无border-t）
</Card>
```

使用 `shadow-sm` 而非旧的 `ring-1`。

### 6.3 Badge

```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="default">       // 白底 → 主标签
<Badge variant="secondary">     // 灰底 → 次要标签
<Badge variant="outline">       // 边框 → 状态标签
<Badge variant="destructive">   // 红底 → 错误标签
```

### 6.4 Input / Textarea / Select

```tsx
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

<Input placeholder="默认..." />
<Textarea rows={3} />
<Select>
  <SelectTrigger><SelectValue placeholder="选择" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="a">选项 A</SelectItem>
  </SelectContent>
</Select>
```

### 6.5 Table + DataTable

```tsx
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
```

表格外框 `border border-border`，行分割线 `border-b border-border`。数据表格可包含：

- 排序（getSortedRowModel）
- 筛选（getFilteredRowModel）
- 分页（getPaginationRowModel）
- 拖拽行（@dnd-kit/sortable）
- 行选择（checkbox）
- 侧拉窗详情（Sheet + Drawer 自适应）

### 6.6 Chart

```tsx
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
```

### 6.7 Dialog / Sheet

```tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
```

Sheet 宽度 `sm:max-w-sm`（384px），无边框（`border-0`）。

### 6.8 Sidebar

```tsx
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  SidebarTrigger,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
```

**使用模式**:

- 页面级: `SidebarProvider > AppSidebar + content`
- `collapsible="icon"` 模式
- 含 `SidebarRail` 方便切换

### 6.9 Collapsible（折叠面板）

```tsx
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
```

用于 NavMain 子菜单。

### 6.10 DropdownMenu

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
```

### 6.11 ToggleGroup

```tsx
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
```

用于视图切换（如 chart 的时间范围）。

### 6.12 Sonner（Toast）

```tsx
import { Toaster, toast } from '@/components/ui/sonner'
;<Toaster />
toast.success('成功')
toast.error('失败')
toast.promise(promise, { loading, success, error })
```

### 6.13 Tab

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
```

---

## 七、图标

使用 Lucide React，统一 16px。建议通过图标适配层引用，便于后续全局替换图标库。

### 7.1 直接引用（快捷方式）

```tsx
import { Search, Plus, MoreHorizontal } from 'lucide-react'

<Search className="size-4" />
<Tag className="size-4 text-muted-foreground" />
```

### 7.2 图标适配层（推荐）

通过 `src-next/components/ui/icon.tsx` 统一管理，确保图标尺寸一致。

```tsx
import { Icon } from '@/components/ui/icon'
import { Search, Plus } from 'lucide-react'

<Icon icon={Search} />
<Icon icon={Plus} size={20} className="text-muted-foreground" />
```

**`Icon` 组件行为**：

- 默认 `size=16`（16px），通过 `size` prop 调整
- 透传 `className` 到内部 SVG
- 始终 `shrink-0` 防止布局压缩
- 替换图标库时只需修改 `Icon` 组件内部实现，无需逐个修改调用处

---

## 八、组件开发工作流

`src-next/` 的所有新组件开发遵循三阶段流程。

### 8.1 调研阶段 — shadcn MCP 工具

优先使用已集成的 MCP 工具搜索官方 registry，避免重复造轮子。

| MCP 工具                            | 用途              | 使用时机         |
| ----------------------------------- | ----------------- | ---------------- |
| `search_items_in_registries`        | 搜索组件          | 不确定是否存在时 |
| `view_items_in_registries`          | 查看组件源码      | 评估是否满足需求 |
| `get_item_examples_from_registries` | 查看使用示例      | 了解组件用法     |
| `get_add_command_for_items`         | 生成 CLI 添加命令 | 确定要添加后     |
| `get_audit_checklist`               | 添加后检查清单    | 组件添加完成后   |

**工作方式**：在 Claude Code 会话中直接调用对应 MCP 工具搜索和参考官方组件，无需离开编辑器。

### 8.2 原型验证阶段 — web-artifacts-builder（可选）

对于复杂组件或多个组件的组合布局，可先用 web-artifacts-builder 快速搭建原型进行视觉和交互验证。

**web-artifacts-builder 简介**：Anthropic 官方开源技能，用于在 claude.ai 中构建多组件 HTML 交互原型。技术栈与 `src-next/` 一致：

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui（40+ 预装组件）
- Parcel 打包为单 HTML

**适用场景**：

- 新组件的视觉设计验证
- 多个 shadcn 组件组合布局测试
- 交互流程和状态变化验证
- 方案评审前的快速 Demo

**操作步骤**：

```bash
# 1. 在 claude.ai 中初始化原型项目
bash scripts/init-artifact.sh <prototype-name>

# 2. 编辑源码开发原型
#    - 使用 shadcn 组件组合布局
#    - 验证视觉一致性
#    - 确认交互逻辑

# 3. 打包分享（可选）
bash scripts/bundle-artifact.sh
# 输出 bundle.html，可直接作为 artifact 展示
```

> ⚠ **重要限制**：原型仅在 artifact 环境中运行，**不能替代**生产代码。确认设计后，仍需通过 shadcn CLI 将组件正式添加到 `src-next/` 中。

### 8.3 添加到项目 — shadcn CLI

```bash
# 使用 shadcn CLI 添加组件
npx shadcn@latest add <component> -c src-next --yes
```

### 8.4 修复自引用 bug

shadcn CLI（base-nova style）生成的组件文件存在自引用导入 bug。每次添加后必须检查：

```bash
# 检查自引用
grep "from \"@/components/ui/<filename>\"" src-next/components/ui/<filename>.tsx
```

如果找到自引用（文件导入了自身），修正为：

```tsx
// 错误（自引用循环）
import { X as XPrimitive } from '@/components/ui/x'

// 正确（引用 @base-ui/react 基座）
import { X as XPrimitive } from '@base-ui/react/x'
```

### 8.5 权限守卫（Phase 4+）

#### 路由级守卫

```tsx
import { PermissionGuard } from '@/components/permission-guard'
;<Route
  path="/settings"
  element={
    <PermissionGuard perm="settings:read">
      <SettingsPage />
    </PermissionGuard>
  }
/>
```

#### 组件级控制

```tsx
import { Acl } from '@/components/acl'
;<Acl perm="task:delete">
  <Button variant="destructive">删除任务</Button>
</Acl>

{
  /* 无权限时显示 fallback */
}
;<Acl perm="task:create" fallback={<span>无权限</span>}>
  <Button>新建任务</Button>
</Acl>
```

#### Hook 级别

```tsx
const canDelete = usePermission('task:delete')
if (canDelete) {
  /* ... */
}
```

### 8.6 验证

检查 Vite 编译无 `ReferenceError` 错误，并验证权限守卫行为：

```bash
# 编译验证
npx vite build --config src-next/vite.config.ts

# 权限验证（手动）
# 1. 路由级：无权限用户访问 /settings → 被重定向或显示无权限
# 2. 组件级：无权限用户看不到"删除"等敏感按钮
```

---

## 九、验证标准

- [ ] 组件来源为 shadcn 官方 registry（非自定义）
- [ ] 页面无任何 `--pm-*` 变量引用
- [ ] 页面无任何 `bg-white/X` 写法
- [ ] 所有 Button 使用 shadcn variant
- [ ] 所有 Card 使用 shadcn Card + border border-border
- [ ] 无 `CardSection`、`SectionTitle`、`DataTable`（旧）、`Field`、`FieldRow`
- [ ] 无内联 `style` prop（动画性能优化场景除外）
- [ ] Tailwind 类名在 `@theme` 映射范围内
- [ ] 侧边栏使用 sidebar-07 模式（`collapsible="icon"`）
- [ ] 表格边框使用 `border-border`（浅灰 `oklch(0.922 0 0)`）
- [ ] 图标通过 `Icon` 适配层引用，统一 16px
- [ ] 权限敏感操作使用 `<Acl>` 或 `usePermission()` 控制可见性
- [ ] 主题色板切换后所有组件颜色正确转换
- [ ] 间距均为 2px 整数倍（无 `p-2.5` `m-1.5` 等 0.5 步长）
- [ ] 无纯黑 `bg-black` / `text-black`，无纯白 `bg-white` / `text-white`
- [ ] 无 `opacity` 做颜色过渡（如 `bg-black/10`）
- [ ] 组件复用遵循优先级：ui/ 已有 > 安装新组件 > 组合 shadcn > 手写

---

## 十、组件复用规范

### 7.1 复用优先级

| 优先级    | 做法                                                    | 条件                             |
| --------- | ------------------------------------------------------- | -------------------------------- |
| 1（最高） | 直接使用 `src-next/components/ui/` 下已有组件           | 项目已有该 shadcn 组件           |
| 2         | 调用 `shadcn-management` skill 搜索并安装新组件         | 官方 registry 存在               |
| 3         | 用现有 shadcn 组件组合搭建（如 Table + Badge + Button） | 官方未提供直接组件               |
| 4（最低） | 手写自定义组件                                          | 以上均无法满足，且必须符合本规范 |

### 7.2 禁止行为

- ❌ 手写 shadcn 已提供的 UI 基础组件（Button / Input / Select / Checkbox 等）
- ❌ 引入 shadcn 外的第三方 UI 库（MUI、Ant Design、Chakra 等）
- ❌ 在 `src-next/` 中使用 MUI 旧栈组件
- ❌ 硬编码 `style` prop（性能动画场景除外）

### 7.3 组件安装流程

当需要新组件时：

1. 调用 `shadcn-management` skill 搜索组件
2. 确认组件来源为 shadcn 官方 registry
3. 使用 `npx shadcn@latest add <component>` 安装
4. 组件自动添加到 `src-next/components/ui/`
5. 验收时确认无自定义修改

---

## 十一、版本历史

| 版本   | 日期       | 更新内容                                                                                                     | 作者     |
| ------ | ---------- | ------------------------------------------------------------------------------------------------------------ | -------- |
| v2.3.0 | 2026-05-05 | 新增多色主题色板体系（neutral/blue/green/slate）；新增图标适配层 `Icon` 组件规范；新增 RBAC 权限守卫使用规范 | AI Agent |
| v2.2.0 | 2026-05-05 | 扩充组件开发工作流：新增 shadcn MCP 调研、web-artifacts-builder 原型验证、构建验证步骤                       | AI Agent |
| v2.1.0 | 2026-05-03 | 以 dashboard-01 + sidebar-07 为模板重写；亮色默认；新增工作流章节                                            | AI Agent |
| v2.0.0 | 2026-05-03 | 基于 shadcn default dark 初稿                                                                                | AI Agent |
