---
id: DOC-05-DESIGN-VI-STANDARDS
number: DES-004
domain: design
category: vi-standards
title: 基础 VI 规范 — 字体与色彩体系
owner: designer
status: active
last_updated: 2026-05-13
source_of_truth: false
visual_version: vi-standards.html
ai_contract: docs/ai/contracts/vi-standards.md
related_code:
  - src-next/themes.css
  - src-next/index.css
  - src-next/components/ui/
related_docs:
  - design-spec-v2-shadcn.md (DES-001)
  - design-checklist.md (DES-002)
---

# 基础 VI 规范 — 字体与色彩体系

**文档角色**: Source of Truth（唯一执行规范）
**状态**: Active
**版本**: v1.0.0
**更新日期**: 2026-05-13

---

## 一、设计哲学

继承 DES-001 的设计哲学——**黑白极简，零品牌干扰，内容优先**。

本规范在 DES-001 的基础上，将字体和色彩两个维度细化到可执行粒度。每条规则配 ✅ 正确用法 / ❌ 禁止用法。

---

## 二、字体规范

### 2.1 字体栈

项目通过 `themes.css` 的 html 类名切换 4 种字体风格。默认使用无衬线字体。

| 风格               | html 类名           | 字体栈                                         | 适用场景        |
| ------------------ | ------------------- | ---------------------------------------------- | --------------- |
| **无衬线（默认）** | `html.font-sans`    | `Inter, Noto Sans SC, system-ui, sans-serif`   | 所有标准界面    |
| 衬线               | `html.font-serif`   | `Noto Serif SC, Georgia, serif`                | 长文阅读、文档  |
| 等宽               | `html.font-mono`    | `JetBrains Mono, SF Mono, Consolas, monospace` | 代码、数字表格  |
| 圆体               | `html.font-rounded` | `Nunito, Noto Sans SC, sans-serif`             | 儿童/非正式界面 |

**设计原则**：使用系统字体栈避免加载额外字体文件，保证加载性能。项目不引入自定义 @font-face。

### 2.2 文字层级

项目定义 5 级文字层级。所有文字必须从下表选取，禁止使用表中未定义的层级。

| 层级   | 名称                | Tailwind 类名                           | 字号 | 字重 | 行高 | 颜色                    |
| ------ | ------------------- | --------------------------------------- | ---- | ---- | ---- | ----------------------- |
| **L1** | 页面标题            | `text-2xl font-semibold tracking-tight` | 24px | 600  | 1.25 | `text-foreground`       |
| **L2** | 卡片标题 / 分组标题 | `text-base font-medium leading-snug`    | 16px | 500  | 1.3  | `text-foreground`       |
| **L3** | 正文 / 表单标签     | `text-sm`                               | 14px | 400  | 1.5  | `text-foreground`       |
| **L4** | 辅助文字 / 描述     | `text-sm text-muted-foreground`         | 14px | 400  | 1.5  | `text-muted-foreground` |
| **L5** | 极小文字 / 元信息   | `text-xs text-muted-foreground`         | 12px | 400  | 1.5  | `text-muted-foreground` |

#### 使用场景对照表

| 场景               | 层级 | 示例                        |
| ------------------ | ---- | --------------------------- |
| 页面一级标题（h1） | L1   | 仪表盘标题、项目详情标题    |
| 页面二级标题（h2） | L2   | 章节小标题、卡片标题        |
| 表单字段标签       | L3   | Input label、Select label   |
| 表格单元格内容     | L3   | 名称、日期、金额            |
| 字段说明文字       | L4   | "选填"、"密码至少 8 位"     |
| 卡片描述文字       | L4   | Card 组件的 CardDescription |
| 时间戳             | L5   | "3 分钟前"                  |
| 统计小数字         | L5   | 卡片右下角计数              |

✅ **正确写法**

```tsx
<h1 className="text-2xl font-semibold tracking-tight">项目仪表盘</h1>
<CardTitle className="text-base font-medium leading-snug">进行中任务</CardTitle>
<p className="text-sm">任务名称：基础施工</p>
<p className="text-sm text-muted-foreground">创建于 2026-05-13</p>
<span className="text-xs text-muted-foreground">3 分钟前</span>
```

❌ **禁止写法**

```tsx
<h1 className="text-lg">项目仪表盘</h1>       {/* 标题不够大 */}
<p className="text-base">辅助说明文字</p>     {/* 辅助文字不应比正文大 */}
<span className="text-[13px]">自定义字号</span>  {/* 硬编码字号 */}
<h2 className="text-2xl">卡片标题</h2>         {/* 卡片标题用 L2 而非 L1 */}
```

### 2.3 字重规范

| 字重 | Tailwind        | 用途                         | 说明     |
| ---- | --------------- | ---------------------------- | -------- |
| 400  | `font-normal`   | 正文、辅助文字               | 默认字重 |
| 500  | `font-medium`   | 卡片标题、列表项主文字       | 中等强调 |
| 600  | `font-semibold` | 页面标题、统计数字、按钮文字 | 最强强调 |

✅ **正确用法**

- 页面标题 → `font-semibold`（唯一使用 600 的场景）
- 卡片标题 → `font-medium`
- 按钮 → `font-medium`（部分变体使用 `font-semibold`，遵循 shadcn 默认）
- 正文、表格、表单 → `font-normal`

❌ **禁止用法**

- `font-bold`（700）— 项目无此场景，会破坏视觉层级平衡
- `font-light`（300）— 在正文中可读性差
- `font-extrabold` / `font-black`（800/900）— 未定义

### 2.4 行高规范

| 场景                   | 行高     | Tailwind                         |
| ---------------------- | -------- | -------------------------------- |
| 单行文字（标题、标签） | 1.25-1.3 | `leading-tight` / `leading-snug` |
| 多行文字（正文、描述） | 1.5      | `leading-normal`                 |
| 密集信息（表格、列表） | 1.4      | `leading-relaxed`                |

---

## 三、色彩规范

### 3.1 灰色梯度体系

项目使用 Tailwind neutral 色板（shadcn `baseColor: "neutral"`）作为中性色。所有灰色值必须从下表选取。

| 色阶    | Tailwind 类名    | oklch 等效         | 亮度 | 使用场景                                |
| ------- | ---------------- | ------------------ | ---- | --------------------------------------- |
| **50**  | `bg-neutral-50`  | `oklch(0.985 0 0)` | 最浅 | 页面背景（替代 `bg-white`）             |
| **100** | `bg-neutral-100` | `oklch(0.97 0 0)`  | 很浅 | 次要背景、hover 态、muted 表面          |
| **200** | `bg-neutral-200` | `oklch(0.922 0 0)` | 浅   | 边框、分割线、输入框背景                |
| **300** | `bg-neutral-300` | `oklch(0.87 0 0)`  | 中浅 | 禁用态背景、占位符底色                  |
| **400** | `bg-neutral-400` | `oklch(0.708 0 0)` | 中间 | 禁用文字、次要 icon                     |
| **500** | `bg-neutral-500` | `oklch(0.556 0 0)` | 中深 | muted-foreground、辅助文字              |
| **600** | `bg-neutral-600` | `oklch(0.439 0 0)` | 较深 | 暗色模式下的 muted 表面                 |
| **700** | `bg-neutral-700` | `oklch(0.371 0 0)` | 深   | 暗色模式边框                            |
| **800** | `bg-neutral-800` | `oklch(0.269 0 0)` | 很深 | 暗色模式次要文字                        |
| **900** | `bg-neutral-900` | `oklch(0.205 0 0)` | 最深 | foreground、主文字（替代 `text-black`） |
| **950** | `bg-neutral-950` | `oklch(0.145 0 0)` | 极限 | 最深背景（暗色模式 替代 `bg-black`）    |

#### 映射关系（CSS 变量 → 灰色梯度）

| CSS 变量             | 对应灰色阶梯                         | Tailwind 替代           |
| -------------------- | ------------------------------------ | ----------------------- |
| `--background`       | neutral-50（亮）/ neutral-950（暗）  | `bg-background`         |
| `--foreground`       | neutral-900（亮）/ neutral-50（暗）  | `text-foreground`       |
| `--muted`            | neutral-100                          | `bg-muted`              |
| `--muted-foreground` | neutral-500                          | `text-muted-foreground` |
| `--border`           | neutral-200（亮）/ neutral-700（暗） | `border-border`         |
| `--input`            | neutral-200                          | `border-input`          |
| `--ring`             | neutral-400                          | `ring-ring`             |

### 3.2 中性色使用规则

#### 底色使用

| 元素         | 正确                             | 禁止                               |
| ------------ | -------------------------------- | ---------------------------------- |
| 页面背景     | `bg-background`                  | `bg-white`、`#FFFFFF`              |
| 卡片背景     | `bg-card`                        | `bg-white`、`bg-neutral-50`        |
| 次要表面     | `bg-muted` 或 `bg-neutral-100`   | `bg-neutral-50`（那是 background） |
| 暗色页面背景 | `.dark bg-background`            | `bg-black`、`#000000`              |
| 暗色卡片背景 | `.dark bg-card`（≈ neutral-900） | `bg-black`                         |

#### 文字颜色使用

| 文字类型   | 正确                                    | 禁止                                        |
| ---------- | --------------------------------------- | ------------------------------------------- |
| 主文字     | `text-foreground`                       | `text-black`、`#000000`、`text-neutral-900` |
| 辅助文字   | `text-muted-foreground`                 | `text-gray-500`、`text-neutral-500`         |
| 禁用文字   | `text-muted-foreground/50`              | `text-gray-300`                             |
| 暗色主文字 | `.dark text-foreground`（≈ neutral-50） | `text-white`、`#FFFFFF`                     |

#### 灰色过渡规则

当需要表达"从浅到深"的层级时，使用 Tailwind neutral 色阶递增，**禁止**用 opacity 模拟灰色。

✅ **正确：用色阶分层**

```tsx
<div className="bg-neutral-50">    {/* 最外层 */}
<div className="bg-neutral-100">   {/* 次外层 */}
<div className="bg-neutral-200">   {/* 内层 */}
```

❌ **禁止：用 opacity 模拟灰色**

```tsx
<div className="bg-background">
<div className="bg-black/5">        {/* 禁止 */}
<div className="bg-foreground/10">  {/* 禁止 */}
```

### 3.3 色彩使用总则

#### 使用原则

| 原则              | 说明                                                               |
| ----------------- | ------------------------------------------------------------------ |
| **语义驱动**      | 颜色只用于表达语义状态（成功/错误/警告/信息），不做装饰            |
| **CSS 变量优先**  | 始终使用 `bg-*`/`text-*`/`border-*` 的语义别名，不直接使用色阶类名 |
| **oklch 唯一**    | 所有色值统一使用 oklch 色彩空间，禁止 HEX / RGB / HSL              |
| **chart-\* 专用** | `--chart-1`~`--chart-5` 仅用于图表场景，不用于 UI 元素             |

✅ **正确**

```tsx
<Button variant="destructive">删除</Button>   {/* 语义色 */}
<Badge variant="outline">进行中</Badge>       {/* 语义标签 */}
<div className="text-destructive">错误提示</div>
```

❌ **禁止**

```tsx
<Button className="bg-red-500">删除</Button>  {/* 直接使用红色色阶 */}
<span className="text-orange-600">进行中</span>  {/* 不使用语义变量 */}
<div style={{ color: '#ef4444' }}>错误</div>    {/* HEX 硬编码 */}
```

#### 语义色变量

| 变量            | 语义      | 使用场景                     |
| --------------- | --------- | ---------------------------- |
| `--destructive` | 删除/错误 | Button variant="destructive" |
| `--warning`     | 警告      | 告警状态                     |
| `--success`     | 成功      | 已完成状态                   |
| `--info`        | 信息      | 提示消息                     |

（具体色值由 themes.css 定义，本规范只约束使用规则。）

### 3.4 色板使用规范

项目支持 5 套可选色板 + 1 套默认色板，通过 html 类名切换。

| 色板            | html 类名           | 色相特征     | 使用场景        |
| --------------- | ------------------- | ------------ | --------------- |
| neutral（默认） | 无额外类名          | 纯黑白       | 所有标准页面    |
| blue            | `html.theme-blue`   | 冷色 primary | 技术/管理后台   |
| green           | `html.theme-green`  | 暖绿 primary | 项目/环境主题   |
| orange          | `html.theme-orange` | 暖橙 primary | 紧急任务/高危   |
| purple          | `html.theme-purple` | 紫 primary   | 特权/Admin 主题 |
| stone           | `html.theme-stone`  | 暖灰 primary | 阅读/文档模式   |

**色板使用规则**：

- 色板切换只影响 `--primary`、`--chart-*`、`--ring`、`--sidebar-*` 等强调色
- 中性色（background/foreground/border/muted）不受色板影响
- 同一页面不应混用多个色板
- 色板通过用户设置切换，不通过代码硬编码

### 3.5 暗色模式规则

| 规则           | 说明                                                  |
| -------------- | ----------------------------------------------------- |
| 默认使用亮色   | 项目默认亮色主题，暗色由用户偏好决定                  |
| 全局反转       | 颜色通过 CSS 变量自动适配 `.dark`                     |
| 不额外写 dark: | 所有颜色使用语义变量（`bg-background`），暗色自动适配 |
| 例外           | 仅当亮暗使用不同色阶时才需要 `dark:` 前缀             |
| 色板叠加       | `.dark` 和 `.theme-*` 可正交组合                      |

---

## 四、验收检查项

### 4.1 字体检查

- [ ] 是否使用表中定义的 5 级文字层级？
- [ ] 是否有硬编码字号（`text-[13px]`）？
- [ ] 是否有表中未定义的层级？
- [ ] 字重是否在 400/500/600 范围内？
- [ ] 是否使用了 `font-bold` 或 `font-light`？
- [ ] 层级与场景是否匹配（页面标题=L1，卡片标题=L2）？

### 4.2 色彩检查

- [ ] 是否有 `bg-black` / `text-black`？
- [ ] 是否有 `bg-white` / `text-white`？
- [ ] 是否有 `bg-black/10` 等 opacity 灰色？
- [ ] 是否有 HEX / RGB 硬编码色值？
- [ ] 是否使用语义变量（`bg-background` 而非 `bg-neutral-50`）？
- [ ] 图表色是否仅用于图表？
- [ ] 暗色模式是否通过 CSS 变量自动适配？

### 4.3 色板检查

- [ ] 同一页面是否混用多个色板？
- [ ] 色板切换后所有组件颜色是否正确？
- [ ] 是否在代码中硬编码了色板相关类名？

---

## 五、相关文档

| 文档                                                         | 关系                             |
| ------------------------------------------------------------ | -------------------------------- |
| [DES-001 design-spec-v2-shadcn.md](design-spec-v2-shadcn.md) | 视觉规范总纲，本规范的上级文档   |
| [DES-002 design-checklist.md](design-checklist.md)           | 开发检查清单，引用本规范的验收项 |
| `src-next/themes.css`                                        | 色板和字体风格的代码实现         |
| `src-next/index.css`                                         | CSS 变量定义                     |
