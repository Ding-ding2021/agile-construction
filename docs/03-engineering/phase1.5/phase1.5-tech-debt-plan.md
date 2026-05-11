---
id: DOC-03-ENGINEERING-PHASE1-5-TECH-DEBT
title: Phase 1.5 技术债务清偿计划
date: 2026-04-25
status: deprecated
source_of_truth: true
---

# Phase 1.5 技术债务清偿计划

> **编制依据**：2026-04-25 代码基线扫描 + `development-plan-v1.2.md` 债务清单  
> **执行模式**：单人 + AI 编码  
> **预计周期**：3-4 天（纯工程重构，无业务功能新增）  
> **核心原则**：已清债务做归档确认，剩余债务按「影响面从大到小」顺序处理

---

## 一、当前债务现状（基于代码扫描）

### 1.1 已清偿债务 ✅

| 债务项           | 原始影响         | 当前状态   | 验证方式                                                                      |
| ---------------- | ---------------- | ---------- | ----------------------------------------------------------------------------- |
| 5 套独立侧边栏   | 新增路由改 5 处  | **已清除** | `find src -name "*Sidebar.tsx"` 返回 0 结果；所有页面统一使用 `AppSidebar`    |
| 7+ 套统计卡片    | 无法复用交互能力 | **已清除** | 全局搜索 `className="*stat-card"` 返回 0 结果；统一使用 `StatsCards`          |
| 200+ CSS 魔法值  | 视觉不一致       | **已清除** | 全局搜索 `rgba(` / `#` 在 `.css` 文件中返回 0 结果（变量定义区除外）          |
| Zustand 状态迁移 | 状态挤在 App.tsx | **已完成** | `src/store/projectStore.ts` 已使用 `persist` 中间件，支持 localStorage 持久化 |
| 路由配置中心化   | 路由散落各处     | **已完成** | `src/config/routes.ts` 已建立懒加载 + 注册表 + Discriminated Union            |

### 1.2 剩余债务 ⚠️

| 债务项                                | 严重度 | 影响描述                                                                                                 | 根因                                              |
| ------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **App.tsx 路由渲染硬编码**            | 🔴 高  | 17 个 `if (route.page === 'xxx')` 瀑布式判断，新增页面需改 2 处（routes.ts + App.tsx）                   | `pageComponentRegistry` 已存在但未被 App.tsx 消费 |
| **App.tsx 双重持久化**                | 🟡 中  | Zustand `persist` 中间件已自动持久化，但 App.tsx 仍手动调用 `projectRepository.saveState`                | 迁移不彻底，存在冗余 `useEffect`                  |
| **App.tsx 职责过重**                  | 🟡 中  | 650+ 行，同时承担路由渲染、状态编排、业务 action、守卫计算                                               | 缺少「路由渲染器」和「业务 action 层」的抽象      |
| **projectRepository 与 Zustand 并存** | 🟡 中  | `services/repositories/projectRepository` 和 `auditRepository` 仍独立维护，与 Zustand store 职责边界模糊 | 数据层抽象未完全统一到 Store 体系                 |

---

## 二、清偿任务分解

### 任务 1：App.tsx 路由渲染解耦（🔴 最高优先级）

**目标**：消除 17 个 if/else，让 `App.tsx` 通过 `pageComponentRegistry` 渲染页面。

**执行步骤**：

1. 新建 `src/components/router/AppRouter.tsx`
   - 接收 `route: AppRoute` 和 `commonProps`（如项目数据、回调函数）
   - 内部使用 `getPageComponent(route.page)` 获取对应组件
   - 通过 props mapping 表将 `commonProps` 注入不同页面
2. 修改 `pageComponentRegistry`：
   - 为需要额外 props 的页面（如 `detail`、`procurement`）定义 `propsMapper`
   - 注册表中新增 `propsMapper?: (route: AppRoute, commonProps: CommonProps) => object`
3. 修改 `App.tsx`：
   - 删除所有 `if (route.page === ...)` 渲染逻辑
   - 改为 `<AppRouter route={route} commonProps={...} />`
   - 保留 `detail` / `new-detail` 的特殊逻辑（如果过于复杂，可暂留为特例）

**验收标准**：

- [ ] 新增页面只需修改 `routes.ts` 一处（注册表 + path 常量）
- [ ] `npm run build` 零报错
- [ ] 所有现有页面路由跳转正常
- [ ] App.tsx 行数降低至 400 行以内

**参考**：`src/config/routes.ts` 第 84-103 行 `pageComponentRegistry`

---

### 任务 2：清理双重持久化与 App.tsx 瘦身（🟡 中优先级）

**目标**：移除 Zustand `persist` 与 `projectRepository` 的重复持久化逻辑，将 App.tsx 中的业务 action 抽取到独立层。

**执行步骤**：

1. **验证 Zustand persist 的可靠性**
   - 确认 `projectStore.ts` 中 `persist` 的 `name: 'pm-projects-store-v1'` 已生效
   - 在浏览器 DevTools → Application → Local Storage 中验证数据写入
2. **移除冗余持久化**
   - 删除 `App.tsx` 中手动调用 `projectRepository.saveState` 的 `useEffect`
   - 保留 `projectRepository.loadState` 的 bootstrap 逻辑（作为迁移兼容层）
   - 在 `ProjectStore` 的 `onRehydrateStorage` 中处理初始数据加载
3. **抽取业务 Action Creator**
   - 新建 `src/store/projectActions.ts`
   - 将 `transitionProjectStatus`、`createProject`、`handleUpdateProjectBasicInfo`、`handleSyncProjectMilestoneProgress` 等纯业务逻辑迁移至此
   - `App.tsx` 仅保留状态订阅和透传回调的「胶水层」

**验收标准**：

- [ ] LocalStorage 中只有 Zustand persist 的一条 key（无重复写入）
- [ ] 刷新页面后项目数据和日志完整恢复
- [ ] App.tsx 行数降低至 300 行以内
- [ ] `npm run lint` 零报错

**风险**：

- `auditRepository` 仍独立运行，需确认其是否与 Zustand 有数据竞争。建议将 audit log 也纳入 Zustand store 或明确其为「只写外部服务」。

---

### 任务 3：projectRepository / auditRepository 职责重新定义（🟡 中优先级）

**目标**：明确 `services/repositories/` 层的定位——是「服务端适配器」还是「本地持久化层」？

**执行步骤**：

1. **现状梳理**
   - 阅读 `projectRepository.ts` 和 `auditRepository.ts` 的完整实现
   - 确认它们目前仅操作 localStorage 还是已有 API 调用能力
2. **职责重新定义**
   - 方案 A（推荐）：`services/repositories/` 作为「服务端 API 适配器」，本地状态由 Zustand 全权管理。Repository 仅负责 HTTP 请求和错误兜底。
   - 方案 B：`services/repositories/` 作为「本地持久化抽象层」，Zustand 的 `persist` 中间件通过自定义 storage 调用 Repository。
3. **输出《数据层架构决策记录》**
   - 明确选择方案 A 或 B
   - 绘制数据流图：UI → Zustand Action → Repository (API) → Server → Zustand State → UI

**验收标准**：

- [ ] 输出 `docs/02-architecture/data-layer-decision-record.md`
- [ ] 代码中不存在「Zustand 和 Repository 同时写 localStorage」的情况

---

## 三、清偿路线图

```
Day 1: 任务 1 — App.tsx 路由渲染解耦
        └─ 输出 AppRouter.tsx，消除 17 个 if/else

Day 2: 任务 2 — 清理双重持久化 + 抽取 Action Creator
        └─ 移除冗余 useEffect，输出 projectActions.ts

Day 3: 任务 3 — Repository 职责重新定义
        └─ 阅读 Repository 代码，输出决策记录，清理重复逻辑

Day 4: 回归验证
        └─ 全页面路由跳转测试 + 状态持久化测试 + lint/build 检查
```

---

## 四、质量门禁（每任务完成后必做）

| 检查项              | 命令               | 通过标准             |
| ------------------- | ------------------ | -------------------- |
| TypeScript 类型检查 | `npx tsc --noEmit` | 零报错               |
| ESLint 代码检查     | `npm run lint`     | 零报错               |
| 生产构建            | `npm run build`    | 零报错               |
| 路由回归            | 人工点击所有主导航 | 页面正常渲染，无白屏 |
| 状态持久化          | 刷新页面           | 数据不丢失           |

---

## 五、与 Phase 2 的衔接

Phase 1.5 完成后，项目将达到以下基线：

- `App.tsx` 仅作为「应用壳」，职责：订阅状态 + 挂载路由 + 全局事件监听
- 新增页面开发成本：修改 1 个文件（`routes.ts`）
- 状态管理全链路：Zustand Store → persist → localStorage（无重复）
- 数据层边界清晰：Repository 负责 API，Store 负责状态

**Phase 2 可立即启动，无需再处理任何底座级债务。**
