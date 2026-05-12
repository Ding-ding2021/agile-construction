---
id: ARC-008
number: ARC-008
domain: archive
category: archived
title: Gradient Token Migration Plan
status: archived
last_updated: 2026-05-05
archived_at: 2026-05-12
archived_reason: 历史归档
---

# 渐变色 Token 化迁移方案

## 现状分析

通过全代码库扫描，共发现 **73+ 处** `linear-gradient` 硬编码，分散在：

| 文件                                                   | 数量   | 说明                                            |
| ------------------------------------------------------ | ------ | ----------------------------------------------- |
| `src/index.css`                                        | ~50 处 | 主聚集地，含统计卡片、KPI、按钮、进度条、头像等 |
| `src/components/customer/customer-management-page.css` | 8 处   | 统计卡片，与 index.css 重复模式                 |
| `src/components/orders/order-management-page.css`      | 8 处   | 统计卡片，与 index.css 重复模式                 |
| `src/components/personnel/UserTable.tsx`               | 1 处   | 内联 style，头像背景渐变                        |

**核心问题：**

1. **重复模式遍地开花** — 同一种"蓝→浅蓝 135° 20%→5%"的统计卡片渐变，在 3 个 CSS 文件里各自硬编码
2. **命名无语义** — `.pm-stat-blue`、`.tm-stat-blue`、`.om-stat-blue` 其实是同一个东西，按页面前缀命名
3. **内联 style 逃逸** — `UserTable.tsx` 里直接写字符串，无法被设计系统管控
4. **颜色值散落** — `#2b7fff`、`#51a2ff`、`#155dfc`、`#2060e0`、`#2b6be8` 都是近似蓝色，没有统一

---

## 提取出的渐变模式（共 6 大类）

### 第 1 类：统计卡片背景（使用最频繁）

```css
/* 出现次数：~20 处，遍布 3 个 CSS 文件 */
background: linear-gradient(135deg, rgba(43, 127, 255, 0.2) 0%, rgba(43, 127, 255, 0.05) 100%);
background: linear-gradient(135deg, rgba(0, 188, 125, 0.2) 0%, rgba(0, 188, 125, 0.05) 100%);
background: linear-gradient(135deg, rgba(142, 81, 255, 0.2) 0%, rgba(142, 81, 255, 0.05) 100%);
background: linear-gradient(135deg, rgba(254, 154, 0, 0.2) 0%, rgba(254, 154, 0, 0.05) 100%);
```

### 第 2 类：品牌主渐变（头像、装饰）

```css
/* 出现次数：~6 处 */
background: linear-gradient(135deg, rgba(43, 127, 255, 0.3) 0%, rgba(142, 81, 255, 0.3) 100%);
background: linear-gradient(135deg, rgba(43, 127, 255, 0.4), rgba(142, 81, 255, 0.4));
```

### 第 3 类：主按钮/强调按钮

```css
/* 出现次数：~4 处 */
background: linear-gradient(135deg, var(--pm-primary) 0%, #2b6be8 100%);
background: linear-gradient(135deg, rgba(43, 127, 255, 0.18) 0%, rgba(43, 127, 255, 0.08) 100%);
background: linear-gradient(135deg, rgba(43, 127, 255, 0.28) 0%, rgba(43, 127, 255, 0.14) 100%);
```

### 第 4 类：进度条/指示条

```css
/* 出现次数：~8 处（4 色 × 2 种方向） */
background: linear-gradient(90deg, #2b7fff 0%, #51a2ff 100%); /* 蓝色 */
background: linear-gradient(90deg, #00bc7d, #00d492); /* 绿色 */
background: linear-gradient(90deg, #8e51ff, #a684ff); /* 紫色 */
background: linear-gradient(90deg, #fe9a00, #ffb900); /* 橙色 */
```

### 第 5 类：KPI 卡片背景（半透明）

```css
/* 出现次数：~8 处（4 色 × 背景 + 顶部条） */
background: linear-gradient(150deg, rgba(43, 127, 255, 0.16) 0%, rgba(43, 127, 255, 0.03) 100%);
/* ::after 条 */
background: linear-gradient(90deg, #2b7fff, #51a2ff);
```

### 第 6 类：模态框/表面背景

```css
/* 出现次数：~3 处 */
background: linear-gradient(160deg, rgba(9, 30, 87, 0.94), rgba(5, 19, 56, 0.96));
background: linear-gradient(180deg, rgba(20, 30, 56, 0.72) 0%, rgba(15, 23, 42, 0.56) 100%);
background: linear-gradient(180deg, rgba(8, 25, 71, 0.97) 0%, rgba(4, 15, 46, 0.99) 100%);
```

---

## 迁移方案：Design Token 设计

### 步骤 1：新增渐变 Token（`index.css` `:root` 区域）

```css
:root {
  /* ---------- 角度标准化 ---------- */
  --gradient-angle-diagonal: 135deg;
  --gradient-angle-diagonal-alt: 150deg;
  --gradient-angle-vertical: 180deg;
  --gradient-angle-horizontal: 90deg;

  /* ---------- 第 1 类：统计卡片背景 ---------- */
  --gradient-stat-blue: linear-gradient(
    var(--gradient-angle-diagonal),
    rgba(43, 127, 255, 0.2) 0%,
    rgba(43, 127, 255, 0.05) 100%
  );
  --gradient-stat-green: linear-gradient(
    var(--gradient-angle-diagonal),
    rgba(0, 188, 125, 0.2) 0%,
    rgba(0, 188, 125, 0.05) 100%
  );
  --gradient-stat-purple: linear-gradient(
    var(--gradient-angle-diagonal),
    rgba(142, 81, 255, 0.2) 0%,
    rgba(142, 81, 255, 0.05) 100%
  );
  --gradient-stat-orange: linear-gradient(
    var(--gradient-angle-diagonal),
    rgba(254, 154, 0, 0.2) 0%,
    rgba(254, 154, 0, 0.05) 100%
  );
  --gradient-stat-red: linear-gradient(
    var(--gradient-angle-diagonal),
    rgba(251, 44, 54, 0.2) 0%,
    rgba(251, 44, 54, 0.05) 100%
  );

  /* ---------- 第 2 类：品牌装饰渐变 ---------- */
  --gradient-brand-avatar: linear-gradient(
    var(--gradient-angle-diagonal),
    rgba(43, 127, 255, 0.3) 0%,
    rgba(142, 81, 255, 0.3) 100%
  );
  --gradient-brand-avatar-lg: linear-gradient(
    var(--gradient-angle-diagonal),
    rgba(43, 127, 255, 0.4),
    rgba(142, 81, 255, 0.4)
  );
  --gradient-brand-icon: linear-gradient(var(--gradient-angle-diagonal), #155dfc 0%, #51a2ff 100%);

  /* ---------- 第 3 类：按钮渐变 ---------- */
  --gradient-btn-primary: linear-gradient(
    var(--gradient-angle-diagonal),
    var(--pm-primary) 0%,
    #2b6be8 100%
  );
  --gradient-btn-accent: linear-gradient(
    var(--gradient-angle-diagonal),
    rgba(43, 127, 255, 0.18) 0%,
    rgba(43, 127, 255, 0.08) 100%
  );
  --gradient-btn-accent-hover: linear-gradient(
    var(--gradient-angle-diagonal),
    rgba(43, 127, 255, 0.28) 0%,
    rgba(43, 127, 255, 0.14) 100%
  );

  /* ---------- 第 4 类：进度条/指示条 ---------- */
  --gradient-bar-blue: linear-gradient(var(--gradient-angle-horizontal), #2b7fff 0%, #51a2ff 100%);
  --gradient-bar-green: linear-gradient(var(--gradient-angle-horizontal), #00bc7d, #00d492);
  --gradient-bar-purple: linear-gradient(var(--gradient-angle-horizontal), #8e51ff, #a684ff);
  --gradient-bar-orange: linear-gradient(var(--gradient-angle-horizontal), #fe9a00, #ffb900);

  /* ---------- 第 5 类：KPI 半透明背景 ---------- */
  --gradient-kpi-blue: linear-gradient(
    var(--gradient-angle-diagonal-alt),
    rgba(43, 127, 255, 0.16) 0%,
    rgba(43, 127, 255, 0.03) 100%
  );
  --gradient-kpi-green: linear-gradient(
    var(--gradient-angle-diagonal-alt),
    rgba(0, 188, 125, 0.16) 0%,
    rgba(0, 188, 125, 0.03) 100%
  );
  --gradient-kpi-purple: linear-gradient(
    var(--gradient-angle-diagonal-alt),
    rgba(142, 81, 255, 0.16) 0%,
    rgba(142, 81, 255, 0.03) 100%
  );
  --gradient-kpi-orange: linear-gradient(
    var(--gradient-angle-diagonal-alt),
    rgba(254, 154, 0, 0.16) 0%,
    rgba(254, 154, 0, 0.03) 100%
  );

  /* ---------- 第 6 类：模态框/表面背景 ---------- */
  --gradient-surface-modal: linear-gradient(160deg, rgba(9, 30, 87, 0.94), rgba(5, 19, 56, 0.96));
  --gradient-surface-panel: linear-gradient(
    var(--gradient-angle-vertical),
    rgba(20, 30, 56, 0.72) 0%,
    rgba(15, 23, 42, 0.56) 100%
  );
  --gradient-surface-deep: linear-gradient(
    var(--gradient-angle-vertical),
    rgba(8, 25, 71, 0.97) 0%,
    rgba(4, 15, 46, 0.99) 100%
  );
  --gradient-surface-risk: linear-gradient(
    var(--gradient-angle-vertical),
    rgba(251, 44, 54, 0.08),
    var(--pm-card)
  );

  /* ---------- 卡片强调条（竖条） ---------- */
  --gradient-accent-blue: linear-gradient(var(--gradient-angle-vertical), #2b7fff, #51a2ff);
  --gradient-accent-green: linear-gradient(var(--gradient-angle-vertical), #00bc7d, #00d492);
  --gradient-accent-purple: linear-gradient(var(--gradient-angle-vertical), #8e51ff, #a684ff);
  --gradient-accent-orange: linear-gradient(var(--gradient-angle-vertical), #fe9a00, #ffb900);
}
```

### 步骤 2：统一工具类（替换现有分散类名）

用一套**语义化工具类**替换 `.pm-stat-blue` / `.tm-stat-blue` / `.om-stat-blue` 等页面级前缀类名：

```css
/* src/index.css — 统一工具类区域 */

/* 统计卡片背景 */
.stat-card-bg-blue {
  background: var(--gradient-stat-blue);
}
.stat-card-bg-green {
  background: var(--gradient-stat-green);
}
.stat-card-bg-purple {
  background: var(--gradient-stat-purple);
}
.stat-card-bg-orange {
  background: var(--gradient-stat-orange);
}
.stat-card-bg-red {
  background: var(--gradient-stat-red);
}

/* KPI 背景 */
.kpi-bg-blue {
  background: var(--gradient-kpi-blue);
}
.kpi-bg-green {
  background: var(--gradient-kpi-green);
}
.kpi-bg-purple {
  background: var(--gradient-kpi-purple);
}
.kpi-bg-orange {
  background: var(--gradient-kpi-orange);
}

/* 进度条/指示条 */
.bar-blue {
  background: var(--gradient-bar-blue);
}
.bar-green {
  background: var(--gradient-bar-green);
}
.bar-purple {
  background: var(--gradient-bar-purple);
}
.bar-orange {
  background: var(--gradient-bar-orange);
}

/* 卡片强调条 */
.accent-bar-blue {
  background: var(--gradient-accent-blue);
}
.accent-bar-green {
  background: var(--gradient-accent-green);
}
.accent-bar-purple {
  background: var(--gradient-accent-purple);
}
.accent-bar-orange {
  background: var(--gradient-accent-orange);
}

/* 按钮 */
.btn-primary-bg {
  background: var(--gradient-btn-primary);
}
.btn-accent-bg {
  background: var(--gradient-btn-accent);
}
.btn-accent-bg-hover:hover {
  background: var(--gradient-btn-accent-hover);
}

/* 头像 */
.avatar-brand-bg {
  background: var(--gradient-brand-avatar);
}
.avatar-brand-lg-bg {
  background: var(--gradient-brand-avatar-lg);
}

/* 模态框/表面 */
.surface-modal-bg {
  background: var(--gradient-surface-modal);
}
.surface-panel-bg {
  background: var(--gradient-surface-panel);
}
.surface-deep-bg {
  background: var(--gradient-surface-deep);
}
.surface-risk-bg {
  background: var(--gradient-surface-risk);
}
```

### 步骤 3：替换映射表（具体修改清单）

| 原代码                                                                                                                | 替换为                        | 位置                                                                       | 工作量             |
| --------------------------------------------------------------------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------- | ------------------ |
| `.pm-stat-blue { background: linear-gradient(135deg, rgba(43, 127, 255, 0.20) 0%, rgba(43, 127, 255, 0.05) 100%); }`  | `.stat-card-bg-blue`          | `index.css` + `customer-management-page.css` + `order-management-page.css` | 批量替换           |
| `.tm-stat-blue` / `.tm-stat-orange` / `.tm-stat-green` / `.tm-stat-red`                                               | `.stat-card-bg-*`             | `index.css`                                                                | 批量替换           |
| `.pm-avatar { background: linear-gradient(135deg, rgba(43, 127, 255, 0.30) 0%, rgba(142, 81, 255, 0.30) 100%); }`     | `.avatar-brand-bg`            | `index.css` + `UserTable.tsx`                                              | 批量替换           |
| `.member-avatar { background: ... }`                                                                                  | `.avatar-brand-bg`            | `index.css`                                                                | 1 处               |
| `.pud-avatar { background: ... }`                                                                                     | `.avatar-brand-lg-bg`         | `index.css`                                                                | 1 处               |
| `.pm-insights-hero-icon-bg { background: linear-gradient(135deg, #155dfc 0%, #51a2ff 100%); }`                        | `.icon-brand-bg`（新增）      | `index.css`                                                                | 1 处               |
| `.pm-create-modal { background: linear-gradient(160deg, rgba(9, 30, 87, 0.94), rgba(5, 19, 56, 0.96)); }`             | `.surface-modal-bg`           | `index.css`                                                                | 1 处               |
| `.tm-detail-action.primary { background: linear-gradient(135deg, var(--pm-primary) 0%, #2b6be8 100%); }`              | `.btn-primary-bg`             | `index.css`                                                                | 1 处               |
| `.tm-btn-accent { background: linear-gradient(135deg, rgba(43, 127, 255, 0.18) 0%, rgba(43, 127, 255, 0.08) 100%); }` | `.btn-accent-bg`              | `index.css`                                                                | 1 处               |
| `.tm-btn-accent:hover`                                                                                                | `.btn-accent-bg-hover`        | `index.css`                                                                | 1 处               |
| `.tm-detail-kpi-item.is-progress` / `is-risk` / `is-sla` / `is-remind`                                                | `.kpi-bg-*`                   | `index.css`                                                                | 8 处（含 ::after） |
| `.tm-detail-kpi-progress > div`                                                                                       | `.bar-blue`                   | `index.css`                                                                | 1 处               |
| `.tm-checklist-progress-mini > div`                                                                                   | `.bar-green`                  | `index.css`                                                                | 1 处               |
| `.tm-card-accent.blue` / `green` / `purple` / `orange`                                                                | `.accent-bar-*`               | `index.css`                                                                | 4 处               |
| `.pud-risk-panel { background: linear-gradient(180deg, rgba(251, 44, 54, 0.08), var(--pm-card)); }`                   | `.surface-risk-bg`            | `index.css`                                                                | 1 处               |
| `UserTable.tsx` 内联 `style={{ background: 'linear-gradient(...)' }}`                                                 | `className="avatar-brand-bg"` | `UserTable.tsx`                                                            | 1 处               |

---

## 实施顺序建议

### 阶段 1：新增 Token + 统一工具类（0.5 天）

1. 在 `index.css` `:root` 末尾追加渐变 Token（约 40 行）
2. 在 `index.css` 统一工具类区域追加语义化工具类（约 50 行）
3. **不删除任何旧代码**，只做加法

### 阶段 2：批量替换 `index.css` 内部引用（0.5 天）

1. 使用全局替换，把 `index.css` 中所有硬编码渐变替换为 Token
2. 把 `.pm-stat-*`、`.tm-stat-*`、`.tm-card-accent.*` 等旧类名替换为新工具类
3. **验证 UI 无变化**（像素级一致）

### 阶段 3：清理外部 CSS 文件 + TSX 内联（0.5 天）

1. 删除 `customer-management-page.css` 中 8 处重复统计卡片渐变，改用统一工具类
2. 删除 `order-management-page.css` 中 8 处重复统计卡片渐变
3. 修改 `UserTable.tsx` 内联 style 为 `className="avatar-brand-bg"`

### 阶段 4：删除废弃旧类名 + 代码检查（0.5 天）

1. 确认没有组件再用 `.pm-stat-*` / `.tm-stat-*` / `.om-stat-*` 后删除旧定义
2. 增加 Stylelint 规则：**禁止在组件 CSS 中直接使用 `linear-gradient`**

---

## 长期约束规则（防止回退）

1. **新增渐变必须走 Token**：任何新的 `linear-gradient` 必须先注册到 `:root`，再生成工具类，不允许在组件 CSS 或 inline style 里直接使用
2. **只允许 6 大类渐变**：统计卡片、品牌装饰、按钮、进度条、KPI、表面背景。超出这 6 类需要设计评审
3. **角度锁死**：只允许 `--gradient-angle-*` 四个方向，特殊角度（如 160deg）需要备注理由
4. **颜色来源限制**：渐变中的色值只能从现有 `--pm-*` 变量中选取，不允许引入新的十六进制色值

---

## 预期收益

| 指标                 | 迁移前            | 迁移后             |
| -------------------- | ----------------- | ------------------ |
| 硬编码渐变数量       | 73+               | 0（全部 Token 化） |
| 统计卡片渐变重复实现 | 3 个文件各自维护  | 1 套工具类         |
| 新增统计卡片工作量   | 复制 CSS + 改颜色 | 加一个 className   |
| 品牌色更换影响范围   | 73 处逐一修改     | 改 Token 定义即可  |
| 设计系统一致性       | ❌ 碎片化         | ✅ 可控            |

---

需要我现在直接执行阶段 1（新增 Token + 工具类）吗？或者先针对某一个小模块做试点替换？
