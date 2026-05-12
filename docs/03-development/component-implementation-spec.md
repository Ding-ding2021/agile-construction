---
id: DOC-00-GOVERNANCE-COMPONENT-IMPLEMENTATION-SPEC
number: DEV-016
domain: development
category: architecture
title: 组件实现规范（开发执行标准）
owner: docs-maintainer
status: active
last_updated: 2026-05-03
source_of_truth: true
parent_doc: docs/00-governance/design-specification.md
related_code:
  - src/index.css
  - src/components/ui/
  - src/components/shared/PmButton.tsx
  - src/components/shared/PmInput.tsx
  - src/components/shared/PmCard.tsx
  - src/components/shared/PmCardHeader.tsx
  - src/components/shared/PmSelect.tsx
  - src/components/shared/PmDatePicker.tsx
---

# 组件实现规范（开发执行标准）

**文档角色**: 开发执行标准 — 连接设计规范与代码实现  
**状态**: Active  
**版本**: v1.0.0  
**更新日期**: 2026-05-03

---

## 一、总则

本规范将设计规范中的抽象规则转化为具体的组件实现标准。所有业务模块的 UI 组件必须遵循本规范。

### 1.1 优先级

1. **本规范** > 设计规范 > 个人偏好
2. 设计规范定义了"应该是什么"，本规范定义了"代码怎么写"
3. 遇到本规范未覆盖的情况，参考设计规范的对应章节

### 1.2 实现策略

- **基座**: shadcn/ui 组件（`src/components/ui/`）
- **样式注入**: 使用 CSS 变量 + `style` prop（Tailwind v4 对 `var()` 类名兼容性差）
- **封装**: `src/components/shared/Pm*.tsx` 为设计系统封装组件
- **禁止**: `bg-white/5`、`bg-white/X` 等任意透明度白色值 → 必须用 CSS 变量

---

## 二、颜色令牌（可直接引用）

### 2.1 背景色

| 变量                 | 值                       | 场景          |
| -------------------- | ------------------------ | ------------- |
| `--pm-bg`            | `#051338`                | 页面主背景    |
| `--pm-card`          | `rgba(255,255,255,0.04)` | 卡片背景      |
| `--pm-element`       | `rgba(255,255,255,0.03)` | 元素/区域背景 |
| `--pm-element-hover` | `rgba(255,255,255,0.06)` | hover 态      |
| `--pm-input-bg`      | `rgba(255,255,255,0.05)` | 输入框背景    |
| `--pm-sidebar-bg`    | `rgba(10,35,99,0.90)`    | 侧边栏        |

### 2.2 文字色

| 变量              | 透明度 | 场景        |
| ----------------- | ------ | ----------- |
| `--pm-text-white` | 100%   | 标题、正文  |
| `--pm-text-92`    | 92%    | 强调文字    |
| `--pm-text-70`    | 70%    | 次要文字    |
| `--pm-text-60`    | 60%    | 表单标签    |
| `--pm-text-50`    | 50%    | 辅助文字    |
| `--pm-text-40`    | 40%    | 提示/图标色 |
| `--pm-text-30`    | 30%    | placeholder |
| `--pm-text-25`    | 25%    | 淡化        |

### 2.3 品牌功能色

| 变量                 | 值                      | 场景                   |
| -------------------- | ----------------------- | ---------------------- |
| `--pm-primary`       | `#154DD9`               | 主按钮、选中态、聚焦环 |
| `--pm-primary-light` | `#1a5ae8`               | 主按钮 hover           |
| `--pm-primary-dark`  | `#1248c5`               | 主按钮 active          |
| `--pm-primary-15`    | `rgba(21,77,217,0.15)`  | 选中背景               |
| `--pm-blue`          | `#168BD9`               | 信息色、链接           |
| `--pm-blue-15`       | `rgba(22,139,217,0.15)` | 次要按钮背景           |
| `--pm-blue-25`       | `rgba(22,139,217,0.25)` | 次要按钮边框           |
| `--pm-green`         | `#16D924`               | 成功色                 |
| `--pm-green-15`      | `rgba(22,217,36,0.15)`  | 成功标签背景           |
| `--pm-orange`        | `#FE9A00`               | 警告色                 |
| `--pm-orange-15`     | `rgba(254,154,0,0.15)`  | 警告标签背景           |
| `--pm-red`           | `#D9165E`               | 错误/危险              |
| `--pm-red-15`        | `rgba(217,22,94,0.15)`  | 错误标签背景           |
| `--pm-purple`        | `#5C16D9`               | 特殊标记               |
| `--pm-purple-15`     | `rgba(92,22,217,0.15)`  | 特殊标签背景           |

### 2.4 边框色

| 变量                | 透明度                   | 场景     |
| ------------------- | ------------------------ | -------- |
| `--pm-border`       | `rgba(255,255,255,0.08)` | 标准边框 |
| `--pm-border-light` | `rgba(255,255,255,0.05)` | 浅边框   |

---

## 三、尺寸系统

### 3.1 内边距（padding）

| 变量              | 值     | 场景                   |
| ----------------- | ------ | ---------------------- |
| `--pm-spacing-xs` | `8px`  | Badge 内边距、紧凑区域 |
| `--pm-spacing-sm` | `12px` | 按钮水平内边距         |
| `--pm-spacing-md` | `16px` | 卡片内边距             |
| `--pm-spacing-lg` | `21px` | 卡片 container 内边距  |
| `--pm-spacing-xl` | `24px` | 区域间距               |

### 3.2 外边距（margin）

| 变量             | 值     | 场景   |
| ---------------- | ------ | ------ |
| `--pm-margin-xs` | `8px`  | 紧凑   |
| `--pm-margin-sm` | `12px` | 小间距 |
| `--pm-margin-md` | `16px` | 中等   |
| `--pm-margin-lg` | `24px` | 大间距 |
| `--pm-margin-xl` | `32px` | 超大   |

### 3.3 间隙（gap）

| 变量          | 值     | 场景       |
| ------------- | ------ | ---------- |
| `--pm-gap-xs` | `4px`  | 图标与文字 |
| `--pm-gap-sm` | `8px`  | 标签组     |
| `--pm-gap-md` | `12px` | 卡片标题区 |
| `--pm-gap-lg` | `16px` | 表单字段组 |
| `--pm-gap-xl` | `24px` | 区块之间   |

---

## 四、圆角系统

| 变量               | 值      | 场景                                     |
| ------------------ | ------- | ---------------------------------------- |
| `--pm-radius-sm`   | `8px`   | 输入框（Input）                          |
| `--pm-radius-md`   | `10px`  | 标签（Badge/StatusChip）、按钮（Button） |
| `--pm-radius-lg`   | `14px`  | 导航项、次要按钮                         |
| `--pm-radius-xl`   | `16px`  | 卡片（Card）、弹窗（Dialog/Sheet）       |
| `--pm-radius-full` | `999px` | 全圆角                                   |

---

## 五、阴影系统

| 变量                  | 场景                             |
| --------------------- | -------------------------------- |
| `--pm-shadow-sm`      | 轻微阴影                         |
| `--pm-shadow-md`      | 卡片阴影                         |
| `--pm-shadow-lg`      | 弹窗阴影                         |
| `--pm-shadow-primary` | 主按钮阴影 `rgba(28,57,142,0.5)` |

---

## 六、组件实现标准

### 6.1 PmButton — 按钮

对齐 shadcn Button 尺寸体系 `<xs → sm → md → lg>`。

| 属性       | xs           | sm               | md (默认)        | lg               |
| ---------- | ------------ | ---------------- | ---------------- | ---------------- |
| 高度       | `h-6` (24px) | `h-7` (28px)     | `h-8` (32px)     | `h-9` (36px)     |
| 水平内边距 | `8px` (px-2) | `10px` (px-2.5)  | `12px` (px-3)    | `16px` (px-4)    |
| 字体大小   | `11px`       | `12px` (text-xs) | `14px` (text-sm) | `14px` (text-sm) |
| 字重       | `500`        | `500`            | `500`            | `500`            |
| 圆角       | `10px`       | `10px`           | `10px`           | `10px`           |
| 典型场景   | 行内操作     | 工具栏           | 标准按钮         | 主要CTA          |

**变体样式**：

| 变体        | 背景           | 文字色         | 边框                     | 阴影                  |
| ----------- | -------------- | -------------- | ------------------------ | --------------------- |
| `primary`   | `--pm-primary` | `#fff`         | 无                       | `--pm-shadow-primary` |
| `secondary` | `--pm-blue-15` | `#fff`         | `1px solid --pm-blue-25` | 无                    |
| `ghost`     | 透明           | `--pm-text-70` | 无                       | 无                    |
| `danger`    | `--pm-red`     | `#fff`         | 无                       | 无                    |
| `icon`      | 透明           | `--pm-text-70` | 无                       | 无                    |

**hover 态**：primary→`--pm-primary-light`，secondary→`--pm-blue-25`，ghost→`--pm-element-hover`

**文件**：`src/components/shared/PmButton.tsx`

---

### 6.2 PmInput — 输入框

| 属性        | 值                      |
| ----------- | ----------------------- |
| 高度        | `h-9` (36px)            |
| 背景        | `--pm-input-bg`         |
| 边框        | `1px solid --pm-border` |
| 文字色      | `--pm-text-white`       |
| 字体大小    | `14px`                  |
| 圆角        | `--pm-radius-sm` (8px)  |
| placeholder | `--pm-text-30`          |
| focus 边框  | `--pm-primary`          |

**文件**：`src/components/shared/PmInput.tsx`

---

### 6.3 PmCard — 卡片

| 属性   | 值                       |
| ------ | ------------------------ |
| 背景   | `--pm-card`              |
| 边框   | `--pm-border`            |
| 圆角   | `--pm-radius-xl` (16px)  |
| 内边距 | `--pm-spacing-md` (16px) |
| 阴影   | `--pm-shadow-md`         |

**文件**：`src/components/shared/PmCard.tsx`

---

### 6.4 PmCardHeader — 卡片标题

| 属性     | 值                                                |
| -------- | ------------------------------------------------- |
| 布局     | `flex`, `items-center`, `gap: --pm-gap-md` (12px) |
| 下边距   | `12px` (`mb-3`)                                   |
| 图标尺寸 | `20px × 20px`                                     |
| 字体大小 | `--pm-font-md` (14px)                             |
| 字重     | `600`                                             |

**文件**：`src/components/shared/PmCardHeader.tsx`

---

### 6.5 PmSelect — 下拉选择

| 属性         | 值                     |
| ------------ | ---------------------- |
| 高度         | `h-9` (36px)           |
| 背景         | `--pm-input-bg`        |
| 边框         | `--pm-border`          |
| 文字色       | `--pm-text-white`      |
| 字体大小     | `14px`                 |
| 圆角         | `--pm-radius-sm` (8px) |
| 下拉面板背景 | `#0F1F4A`              |
| 选项 hover   | `--pm-element-hover`   |
| 选项选中     | `--pm-primary-15`      |

**文件**：`src/components/shared/PmSelect.tsx`

---

### 6.6 PmDatePicker — 日期选择

基于 PmInput，type="date"，继承 PmInput 全部样式。

**文件**：`src/components/shared/PmDatePicker.tsx`

---

### 6.7 StatusChip — 状态标签

| 属性     | xs                | sm (默认)    | md               |
| -------- | ----------------- | ------------ | ---------------- |
| 高度     | `18px` (h-[18px]) | `20px` (h-5) | `24px` (h-6)     |
| 字体大小 | `10px`            | `11px`       | `12px` (text-xs) |
| 字重     | `600`             | `600`        | `600`            |
| 圆角     | `10px`            | `10px`       | `10px`           |
| 典型场景 | 表格单元格        | 列表/工具栏  | 详情页标题区     |

**文件**：`src/components/ui/StatusChip.tsx`

---

## 七、布局规范

### 7.1 侧拉窗（Sheet / Drawer）

| 属性 | 值                         |
| ---- | -------------------------- |
| 宽度 | `860px`                    |
| 背景 | `--pm-bg`                  |
| 边框 | 左 `1px solid --pm-border` |

### 7.2 内容区间距

| 属性         | 值             |
| ------------ | -------------- |
| 内容内边距   | `20px` (p-5)   |
| 卡片间距     | `16px` (gap-4) |
| 内容最大宽度 | `720px`        |

---

## 八、实现检查清单

开发新组件或修改现有组件时，对照检查：

- [ ] 颜色值是否使用 CSS 变量（非 `bg-white/X`、`#xxx`）
- [ ] 间距是否对齐规范值（8/12/16/24px）
- [ ] 圆角是否对齐规范值（8/10/14/16px）
- [ ] 字体大小/字重是否对齐规范
- [ ] Button 是否使用 `PmButton`
- [ ] 输入框是否使用 `PmInput`
- [ ] 卡片是否使用 `PmCard` + `PmCardHeader`
- [ ] 下拉是否使用 `PmSelect`
- [ ] 内联样式仅用于注入 CSS 变量，不用于布局
- [ ] `npm run lint` 零新增 error
- [ ] `tsc --noEmit` 零新增 error

---

## 九、版本历史

| 版本   | 日期       | 更新内容                             | 作者     |
| ------ | ---------- | ------------------------------------ | -------- |
| v1.0.0 | 2026-05-03 | 初始版本，从设计规范提取组件实现标准 | AI Agent |
