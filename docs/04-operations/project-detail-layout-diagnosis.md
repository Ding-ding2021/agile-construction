---
id: DOC-04-OPS-PROJECT-DETAIL-DIAGNOSIS
title: 项目详情页布局混乱问题诊断与修复方案
date: 2026-04-25
status: draft
source_of_truth: true
---

# 项目详情页布局混乱问题诊断与修复方案

> **问题描述**：用户反馈项目详情页出现布局混乱  
> **诊断方法**：代码结构对比（ProjectManagementPage vs ProjectDetailPage）+ CSS 层级分析  
> **核心发现**：3 个布局架构不一致问题

---

## 一、问题诊断

### 问题 1：布局结构与其他页面不一致（根本原因）

**ProjectManagementPage（参考基准）的结构**：

```
.pm-app
├── .pm-glow-left / .pm-glow-right
├── AppSidebar
├── .pm-workspace          ← 关键：workspace 包裹 main
│   └── .pm-main           ← 关键：main 在 workspace 内
│       ├── PageHeader
│       └── .pm-body       ← 关键：body 在 main 内
```

**ProjectDetailPage（问题页面）的结构**：

```
.pm-app.project-detail-app
├── .pm-glow-left / .pm-glow-right
├── AppSidebar
└── .project-detail-main   ← ❌ 没有 .pm-workspace
    ├── PageHeader         ← ❌ 不在 .pm-main 内
    └── main.project-detail-body  ← ❌ 类名不一致
        ├── ProjectBreadcrumb
        ├── ProjectTabs
        └── renderActiveTab()
```

**差异分析**：

| 元素        | 参考页（ProjectManagementPage） | 问题页（ProjectDetailPage）     | 影响                |
| ----------- | ------------------------------- | ------------------------------- | ------------------- |
| 工作区容器  | `.pm-workspace`                 | **无**                          | Flex 布局上下文缺失 |
| 主内容区    | `.pm-main`                      | `.project-detail-body`          | 样式继承断裂        |
| Header 位置 | `.pm-main` 内部                 | `.project-detail-main` 内部     | 高度计算不一致      |
| 侧边栏关系  | `workspace` 与 `sidebar` 同级   | `detail-main` 与 `sidebar` 同级 | 可能产生布局竞争    |

### 问题 2：CSS 类名自定义而非复用全局类

**project-detail.css 中的自定义类**：

```css
.project-detail-main {
  /* 替代 .pm-workspace + .pm-main */
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  position: relative;
}

.project-detail-body {
  /* 替代 .pm-body */
  flex: 1;
  overflow: auto;
  padding: 24px;
  width: 100%;
  max-width: 1863px;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
```

**与 index.css 中全局类的对比**：

| 属性        | `.pm-workspace + .pm-main + .pm-body` | `.project-detail-main + .project-detail-body` | 差异             |
| ----------- | ------------------------------------- | --------------------------------------------- | ---------------- |
| `height`    | `100vh` (pm-main)                     | 未设置                                        | 可能导致高度塌陷 |
| `overflow`  | `auto` (pm-body)                      | `auto` (detail-body)                          | ✅ 一致          |
| `max-width` | `1863px` (pm-body)                    | `1863px` (detail-body)                        | ✅ 一致          |
| `margin`    | `0 auto` (pm-body)                    | `0 auto` (detail-body)                        | ✅ 一致          |
| `padding`   | `24px` (pm-body)                      | `24px` (detail-body)                          | ✅ 一致          |

**关键缺失**：`.project-detail-main` 没有设置 `height: 100vh`，而 `.pm-main` 有。这导致在内容较少时，页面底部可能出现空白或背景色断裂。

### 问题 3：响应式断点不一致

**index.css 中的全局响应式**（影响 `.pm-workspace`, `.pm-main`, `.pm-body`）：

```css
@media (max-width: 768px) {
  .pm-workspace {
    flex-direction: column;
  }
  .pm-main {
    height: auto;
  }
  .pm-body {
    height: auto;
  }
}
```

**project-detail.css 中的响应式**：

```css
@media (max-width: 768px) {
  .project-detail-body {
    padding: 16px;
  } /* 仅修改 padding */
  /* 没有处理 .project-detail-main 的 flex-direction/height */
}
```

**问题**：在移动端，全局响应式会修改 `.pm-main` 的 `height`，但 ProjectDetailPage 不使用 `.pm-main`，所以这些规则不生效。同时 `.project-detail-main` 没有自己的移动端适配规则。

---

## 二、修复方案

### 方案 A：对齐全局布局（推荐，改动最小）

**目标**：让 ProjectDetailPage 使用与其他页面相同的布局结构

**修改步骤**：

1. **修改 ProjectDetailPage.tsx JSX 结构**：

```tsx
// 修改前
<div className="pm-app project-detail-app">
  <div className="pm-glow pm-glow-left" />
  <div className="pm-glow pm-glow-right" />
  <AppSidebar currentHash={currentHash} />

  <div className="project-detail-main">
    <PageHeader ... />
    <main className="project-detail-body">
      ...
    </main>
  </div>
</div>

// 修改后
<div className="pm-app project-detail-app">
  <div className="pm-glow pm-glow-left" />
  <div className="pm-glow pm-glow-right" />
  <AppSidebar currentHash={currentHash} />

  <div className="pm-workspace">
    <main className="pm-main">
      <PageHeader ... />
      <div className="pm-body project-detail-body">
        ...
      </div>
    </main>
  </div>
</div>
```

2. **修改 project-detail.css**：

```css
/* 删除这些自定义类（改用全局类） */
/* .project-detail-main { ... } */
/* .project-detail-body { ... } */

/* 保留项目详情特有的样式，但基于全局类 */
.project-detail-app .pm-body {
  /* 项目详情页特有的 body 样式 */
  gap: 24px;
}

/* 确保项目详情页的 tab 内容区域正确 */
.project-detail-primary {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
```

**优点**：

- 与其他页面完全一致
- 自动继承全局响应式
- 未来修改全局布局时，项目详情页同步生效

**风险**：

- 需要验证所有 tab 内容在 `.pm-body` 下的表现
- 可能需要微调部分组件的 margin/padding

---

### 方案 B：增强自定义类的完整性

**目标**：保持 `.project-detail-main` / `.project-detail-body` 的自定义结构，但补全缺失的样式

**修改步骤**：

1. **补全 `.project-detail-main` 的样式**：

```css
.project-detail-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100vh; /* ← 新增：与 .pm-main 一致 */
}
```

2. **添加响应式规则**：

```css
@media (max-width: 768px) {
  .project-detail-main {
    height: auto; /* ← 新增：与 .pm-main 的响应式一致 */
  }
}
```

**优点**：

- 改动最小，仅补全缺失属性
- 不影响其他页面

**缺点**：

- 继续维护两套布局结构
- 未来全局布局变更时，需要手动同步

---

## 三、建议

**推荐方案 A**，理由：

1. 项目底座重构的目标之一就是「统一壳层」，ProjectDetailPage 不应成为特例
2. 方案 A 让 ProjectDetailPage 自动继承所有全局响应式规则
3. 与 AppShell 组件化方向一致（未来可用 AppShell 包裹 ProjectDetailPage）

---

## 四、验证清单

修复后需要验证：

- [ ] 项目详情页在桌面端（1920px）正常显示
- [ ] 项目详情页在平板端（1024px）正常显示
- [ ] 项目详情页在手机端（768px 以下）正常显示
- [ ] 所有 8 个 tab（overview/scope/schedule/cost/quality/resources/risk/settings）内容正常
- [ ] 编辑弹窗正常弹出和关闭
- [ ] 与其他页面（ProjectManagementPage、PersonnelPage）的视觉一致性

---

**诊断人**：Buddy  
**诊断日期**：2026-04-25
