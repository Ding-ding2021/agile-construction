---
id: DOC-04-OPS-VISUAL-AUDIT-2026-04-25
number: ARC-058
domain: archive
category: archived
title: 视觉一致性审计报告与改进计划
status: archived
last_updated: 2026-05-12
archived_at: 2026-05-06
archived_reason: MUI 旧栈视觉审计，UI 已切换为 shadcn，不再适用
date: 2026-04-25
source_of_truth: true
---

# 视觉一致性审计报告与改进计划

> **审计范围**：全项目 18 个 CSS 文件 + 共享组件层 + 典型业务页面  
> **审计方法**：代码扫描 + 架构分析 + 设计规范对照  
> **核心发现**：5 大类视觉一致性问题，其中 2 类为高优先级

---

## 一、审计摘要

| 维度            | 现状                                      | 健康度 |
| --------------- | ----------------------------------------- | ------ |
| CSS 变量体系    | `index.css` 已建立 200+ token，但命名混乱 | 🟡 中  |
| 组件复用率      | 共享组件存在，但页面仍大量自定义布局      | 🟡 中  |
| 暗色主题一致性  | 全局暗色，但局部页面有自定义背景          | 🔴 差  |
| 间距/圆角一致性 | 有 token，但页面硬编码值仍多              | 🟡 中  |
| 响应式布局      | 仅项目详情页有三断点，其他页面无          | 🔴 差  |

---

## 二、问题详细分析

### 🔴 问题 1：页面布局结构重复（最高优先级）

**现象**：每个页面都重复相同的「壳」结构

```tsx
// PersonnelPage.tsx
div className="pm-app"
  div.pm-glow.pm-glow-left
  div.pm-glow.pm-glow-right
  AppSidebar
  div.pm-workspace
    main.pm-main
      PageHeader
      div.pm-body
        // 页面内容

// DigitalEmployeePage.tsx — 完全相同的结构
// ProcurementManagementPage.tsx — 完全相同的结构
// ... 15+ 个页面
```

**影响**：

- 修改全局布局（如 sidebar 宽度）需改 15+ 个文件
- 新增页面需复制粘贴壳代码
- `AppShell` 组件已存在但**无人使用**

**数据**：

- `AppShell.tsx` 代码量：44 行，0 处引用
- 页面中重复壳代码平均：15 行/页面 × 15 页面 = **225 行重复**

---

### 🔴 问题 2：CSS Token 命名混乱（高优先级）

**现象**：`index.css` 中 token 命名缺乏统一规范

| 命名模式     | 示例                                | 问题             |
| ------------ | ----------------------------------- | ---------------- |
| 语义化命名   | `--pm-bg`, `--pm-primary`           | ✅ 好            |
| 透明度后缀   | `--pm-text-70`, `--pm-blue-25`      | 🟡 可接受        |
| 混乱组合     | `--pm-blue-3-35`, `--pm-blue-10-45` | 🔴 难维护        |
| 无意义编号   | `--pm-blue-2-10`, `--pm-blue-8-20`  | 🔴 完全不可读    |
| 颜色值硬编码 | `--pm-blue-3: #60a5fa`              | 🟡 应统一为 rgba |

**统计**：

- `--pm-blue-*` 系列：50+ 个 token
- `--pm-dark-*` 系列：20+ 个 token
- 实际使用到的独特色值：约 15 个

**根因**：token 是「按需添加」而非「系统设计」，导致同一颜色不同透明度被命名为完全不同的 token。

---

### 🟡 问题 3：统计卡片实现不一致

**现象**：共享 `StatCard` 组件已存在，但部分页面仍使用自定义实现

| 页面                      | 实现方式                      | 问题              |
| ------------------------- | ----------------------------- | ----------------- |
| ProjectManagementPage     | `StatsCards`（共享组件）      | ✅                |
| PersonnelPage             | `StatsCards`（共享组件）      | ✅                |
| DigitalEmployeePage       | **内嵌自定义 statCards 数组** | 🔴 未使用共享组件 |
| ProcurementManagementPage | `StatsCards`（共享组件）      | ✅                |
| TaskManagementPage        | `TaskStatsCards`（自定义）    | 🟡 历史遗留       |

**DigitalEmployeePage 自定义代码**：

```tsx
const statCards: StatCard[] = [
  { icon: '1.svg', value: '5', label: '活跃 Agent', subLabel: '共 6 个', tone: 'blue' },
  // ... 完全自定义的数据结构和渲染
]
```

---

### 🟡 问题 4：响应式覆盖不足

**现象**：仅 `project-detail.css` 有 `@media` 查询，其他页面无响应式处理

```css
/* project-detail.css — 唯一有响应式的文件 */
@media (max-width: 1024px) { ... }
@media (max-width: 768px) { ... }
```

**影响页面**：

- `ProjectManagementPage`：表格在窄屏下横向溢出
- `TaskManagementPage`：看板视图在平板下无法使用
- `PersonnelPage`：用户表格在移动端无适配

---

### 🟡 问题 5：CSS 文件体积不均

| 文件                           | 体积   | 说明                      |
| ------------------------------ | ------ | ------------------------- |
| `index.css`                    | 164 KB | 全局 token + 所有组件样式 |
| `project-detail.css`           | 44 KB  | 项目详情页                |
| `digital-employee-page.css`    | 17 KB  | 数字员工页                |
| `order-management-page.css`    | 13 KB  | 订单页                    |
| `contract-settlement-page.css` | 13 KB  | 合同页                    |

**问题**：

- `index.css` 过大（164KB），包含所有组件样式，首屏加载阻塞
- 页面级 CSS 与全局 token 耦合，无法按需加载

---

## 三、改进计划

### Phase A：统一页面壳层（1 天）

**目标**：让所有页面使用 `AppShell`，消除重复布局代码

**执行步骤**：

1. 增强 `AppShell` 组件，支持 glow 效果、sidebar、header 的默认配置
2. 修改 3 个典型页面（PersonnelPage、DigitalEmployeePage、ProcurementManagementPage）使用 `AppShell`
3. 验证后推广到所有页面

**预期收益**：

- 删除 225 行重复代码
- 修改 sidebar 宽度只需改 1 处

---

### Phase B：CSS Token 治理（2 天）

**目标**：建立清晰的 token 命名规范，清理冗余

**新命名规范**：

```css
/* 基础色（不透明） */
--pm-color-blue: #2b7fff;
--pm-color-green: #00bc7d;
--pm-color-purple: #8e51ff;
--pm-color-orange: #fe9a00;

/* 透明度变体（统一用法） */
--pm-color-blue-50: rgba(43, 127, 255, 0.5);
--pm-color-blue-25: rgba(43, 127, 255, 0.25);
--pm-color-blue-10: rgba(43, 127, 255, 0.1);

/* 语义化 token（组件使用这些，不直接使用颜色） */
--pm-surface-bg: var(--pm-bg);
--pm-surface-card: var(--pm-card);
--pm-surface-hover: var(--pm-element-hover);
--pm-text-primary: var(--pm-text-white);
--pm-text-secondary: var(--pm-text-70);
--pm-text-tertiary: var(--pm-text-50);
--pm-border-default: var(--pm-border);
--pm-border-light: var(--pm-border-light);
```

**执行步骤**：

1. 定义新 token 规范文档
2. 在 `index.css` 中新增规范 token（保留旧 token 做兼容）
3. 逐个页面迁移：旧 token → 新 token
4. 全部迁移后删除旧 token

---

### Phase C：统计卡片统一（0.5 天）

**目标**：所有页面使用共享 `StatsCards` + `StatCard`

**执行步骤**：

1. 修改 `DigitalEmployeePage`，用 `StatsCards` 替换自定义 statCards
2. 评估 `TaskStatsCards` 是否可以合并到共享组件

---

### Phase D：响应式基线（2 天）

**目标**：为所有列表/表格页面建立响应式基线

**断点策略**：

```css
/* 桌面优先 */
@media (max-width: 1024px) {
  /* 平板 */
}
@media (max-width: 768px) {
  /* 手机横屏 */
}
@media (max-width: 480px) {
  /* 手机竖屏 */
}
```

**优先级页面**：

1. `ProjectManagementPage`（项目列表）
2. `TaskManagementPage`（任务中心）
3. `PersonnelPage`（人员管理）

---

### Phase E：CSS 按需加载（可选，1 天）

**目标**：拆分 `index.css`，实现按需加载

**拆分方案**：

```
index.css          → 仅保留 CSS 变量定义
tokens/
  colors.css       → 颜色 token
  spacing.css      → 间距 token
  typography.css   → 字体 token
components/
  sidebar.css      → AppSidebar 样式
  header.css       → PageHeader 样式
  stat-card.css    → StatCard 样式
  table.css        → 表格通用样式
```

---

## 四、优先级排序

```
Week 1
├── Day 1-2: Phase A（统一壳层）— 影响最大，改动最安全
├── Day 3-4: Phase C（统计卡片统一）— 快速见效
└── Day 5: Phase B 启动（Token 治理）

Week 2
├── Day 1-3: Phase B 继续（Token 治理）
├── Day 4-5: Phase D（响应式基线）— 优先级最高的用户体验改进
```

---

## 五、验收标准

| 检查项                | 验收方式                                                     |
| --------------------- | ------------------------------------------------------------ |
| 所有页面使用 AppShell | `grep -r "pm-app" src/components/` 返回 0 结果               |
| Token 命名规范        | 新代码中无 `--pm-blue-3-35` 类混乱命名                       |
| 统计卡片统一          | `grep -r "statCards" src/components/` 仅在 StatsCards 中出现 |
| 响应式基线            | 3 个优先级页面在 768px 下无横向溢出                          |
| 构建通过              | `npm run build` 零报错                                       |

---

## 六、与 Phase 2 功能开发的衔接

**建议**：在 Phase 2 开发新功能前，先完成 **Phase A（统一壳层）**。因为：

- 新页面可以直接使用 `AppShell`，避免新增技术债务
- Phase A 改动安全（纯结构重构，无业务逻辑）
- 1 天投入，长期收益

---

**审计人**：Buddy  
**审计日期**：2026-04-25
