---
id: DOC-02-ARCH-DATA-LAYER-DR
number: DEV-001
domain: development
category: architecture
title: 数据层架构决策记录（Data Layer Decision Record）
owner: docs-maintainer
status: accepted
last_updated: 2026-05-12
source_of_truth: true
related_code: []
related_docs: []
date: 2026-04-25
---

# 数据层架构决策记录

> **决策编号**：ADR-001  
> **决策日期**：2026-04-25  
> **决策人**：Dylan（PM）+ Buddy（AI 助手）  
> **状态**：已采纳（Accepted）  
> **适用范围**：连锁门店营建管理系统 V1.0 MVP

---

## 1. 背景与问题

当前项目的数据持久化存在两条写入路径：

1. **Zustand `persist` 中间件**：自动将 `projects` / `logs` 写入 `localStorage`
2. **`projectRepository.saveState()`**：在 `App.tsx` 的 `useEffect` 中手动调用，同样写入 `localStorage`，并尝试同步到远程

这引发了两个问题：

- **是否重复写入？** 同一数据被两个机制写入 localStorage，虽然 key 相同（`pm-projects-state-v1`），但时机不同
- **职责边界模糊**：Zustand 和 Repository 各自应该管什么？

---

## 2. 考虑的方案

| 方案  | 核心思路            | 写入路径                                          | 远程同步 |
| ----- | ------------------- | ------------------------------------------------- | -------- |
| **A** | Zustand 全权负责    | 1 条（Zustand → local + 后台批量 remote）         | 后台批量 |
| **B** | Repository 统一负责 | 1 条（Zustand 禁用 persist，全走 Repository）     | 每次变更 |
| **C** | 分层写入，各管一摊  | 2 条（Zustand 管常规状态，Repository 管关键业务） | 关键操作 |

详细方案对比见：`docs/02-architecture/routing-state-migration-plan.md` §5

---

## 3. 决策：采用方案 C（分层写入，各管一摊）

### 3.1 决策理由

| 因素           | 评估                                                      |
| -------------- | --------------------------------------------------------- |
| **项目阶段**   | MVP 演示阶段，localStorage 为主，remote 为可选降级        |
| **团队模式**   | 单人 + AI 编码，改动风险需最小化                          |
| **现状兼容性** | 方案 C 基本不动现有代码，只需删除冗余 useEffect 和加注释  |
| **未来扩展**   | 保留 Repository 的 remote 能力，未来多用户场景可直接复用  |
| **工期**       | 0.2 天（加注释 + 删冗余代码），远低于方案 A/B 的 0.5-1 天 |

### 3.2 架构定义

```
┌─────────────────────────────────────────────────────────────┐
│  用户操作层（UI Components）                                   │
│  如：点击「状态流转」按钮、编辑项目信息、创建新项目             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Zustand Store（内存状态层）                                   │
│  ├─ projects: ProjectItem[]                                  │
│  ├─ logs: Record<string, LogEntry[]>                         │
│  └─ Actions: updateProjectStatus / addProject / appendLog    │
│                                                              │
│  职责：管理内存中的状态，提供类型安全的 action 接口            │
└─────────────────────────────────────────────────────────────┘
                              ↓
              ┌───────────────┴───────────────┐
              ↓                               ↓
┌─────────────────────────────┐   ┌─────────────────────────────┐
│  路径 1：常规状态自动持久化    │   │  路径 2：关键业务手动持久化   │
│                              │   │                              │
│  Zustand persist 中间件      │   │  projectRepository           │
│  ├─ 自动监听 state 变化       │   │  ├─ 先写 localStorage        │
│  ├─ 同步写入 localStorage     │   │  ├─ 再写 serverAdapter       │
│  └─ key: pm-projects-state-v1│   │  └─ 错误降级到本地           │
│                              │   │                              │
│  覆盖范围：所有状态变更        │   │  触发点：关键 action 中手动调用│
│  时机：每次 state 变化后      │   │  时机：业务操作完成后         │
│  性能：同步、无延迟           │   │  性能：local 同步 + remote 异步│
└─────────────────────────────┘   └─────────────────────────────┘
```

### 3.3 职责边界表

| 职责           | 归属                  | 说明                                         |
| -------------- | --------------------- | -------------------------------------------- |
| 内存状态管理   | **Zustand Store**     | 所有 UI 状态变更的入口                       |
| 常规本地持久化 | **Zustand persist**   | 自动、全量、同步写入 localStorage            |
| 关键业务持久化 | **projectRepository** | 项目创建、状态流转、里程碑同步等             |
| 远程同步       | **projectRepository** | 通过 `serverAdapter` 异步写入，失败降级      |
| 审计日志       | **auditRepository**   | 独立服务，记录操作痕迹，不依赖 Zustand       |
| 初始数据加载   | **projectRepository** | 启动时先读本地缓存，再尝试远程，远程失败降级 |

### 3.4 关键操作清单（需手动调用 Repository）

以下 action 在执行 Zustand state 更新后，**必须**调用 `projectRepository.saveState()` 和/或 `auditRepository.append()`：

| Action        | Zustand Action             | Repository 调用                | Audit 调用                                   |
| ------------- | -------------------------- | ------------------------------ | -------------------------------------------- |
| 创建项目      | `addProject()`             | ✅ `saveState()`               | ✅ `append('project', '创建项目', code)`     |
| 状态流转      | `updateProjectStatus()`    | ✅ `saveState()`               | ✅ `append('project', '状态流转', code)`     |
| 更新基础信息  | `updateProjectBasicInfo()` | ✅ `saveState()`               | ✅ `append('project', '更新基础信息', code)` |
| 同步里程碑    | `syncProjectMilestone()`   | ✅ `saveState()`               | ❌（由里程碑系统自行记录）                   |
| 追加活动日志  | `appendLog()`              | ❌（Zustand persist 自动覆盖） | ❌（日志本身即审计）                         |
| 页面筛选/排序 | ❌（纯 UI 状态）           | ❌                             | ❌                                           |

### 3.5 代码调整清单

#### 3.5.1 删除冗余代码

**文件**：`src/App.tsx`  
**删除范围**：第 221-230 行（`saveState` useEffect）

```typescript
// ❌ 删除以下代码块
useEffect(() => {
  if (!hydratedRef.current) {
    return
  }

  void projectRepository.saveState({
    projects: projectsState,
    logs: projectStatusLogs,
  })
}, [projectsState, projectStatusLogs])
```

**理由**：Zustand persist 已自动监听 state 变化并写入 localStorage，此 useEffect 是重复写入。

#### 3.5.2 添加架构注释

**文件**：`src/store/projectStore.ts`  
**在 `persist` 配置处添加**：

```typescript
{
  name: 'pm-projects-state-v1',
  partialize: (state) => ({
    projects: state.projects,
    logs: state.logs,
  }),
  // NOTE(ADR-001): 本 persist 负责常规状态的自动本地持久化。
  // 关键业务操作（创建项目、状态流转等）需额外调用 projectRepository.saveState()
  // 以触发远程同步和审计日志。详见 docs/02-architecture/data-layer-decision-record.md
}
```

**文件**：`src/services/repositories/projectRepository.ts`  
**在文件顶部添加**：

```typescript
/**
 * Project Repository - 数据持久化层
 *
 * 职责（ADR-001）：
 * 1. 关键业务操作的本地持久化 + 远程同步
 * 2. 启动时的数据加载（本地缓存 → 远程 → 降级）
 * 3. 错误处理和降级策略
 *
 * 注意：常规状态变更由 Zustand persist 自动处理，本 Repository
 * 仅在关键 action 中被显式调用。
 */
```

#### 3.5.3 保留的关键调用（无需修改）

以下代码**保留不变**，它们是业务逻辑的一部分：

- `App.tsx` 第 201-219 行：`bootstrapState` useEffect（初始加载）
- `App.tsx` 第 307 行：`auditRepository.append`（状态流转审计）
- `App.tsx` 第 329 行：`auditRepository.append`（创建项目审计）
- `App.tsx` 第 358 行：`auditRepository.append`（更新基础信息审计）

---

## 4. 风险与缓解

| 风险                                         | 可能性 | 影响 | 缓解措施                                                                                                                         |
| -------------------------------------------- | ------ | ---- | -------------------------------------------------------------------------------------------------------------------------------- |
| Zustand persist 和 Repository 同时写同一 key | 中     | 低   | 两者写入的 key 相同（`pm-projects-state-v1`），但 Zustand 在每次 state 变化后写入，Repository 在关键 action 后写入，最终数据一致 |
| 忘记在关键 action 中调用 Repository          | 中     | 高   | 在 `projectActions.ts`（如未来抽取）中封装 action，确保 Repository 调用内聚                                                      |
| 远程同步失败导致数据丢失                     | 低     | 中   | Repository 已实现降级策略（remote 失败则保留 local），且 Zustand persist 持续写入 local                                          |
| 未来多人协作时数据冲突                       | 低     | 高   | 方案 C 保留了 Repository 的 remote 能力，未来只需在 Zustand action 中增加「先拉后写」的乐观锁机制                                |

---

## 5. 相关文档

- `docs/02-architecture/routing-state-migration-plan.md` — 路由与状态管理优化方案
- `docs/03-engineering/phase1.5/phase1.5-tech-debt-plan.md` — Phase 1.5 清偿计划
- `src/store/projectStore.ts` — Zustand Store 实现
- `src/services/repositories/projectRepository.ts` — Repository 实现

---

## 6. 变更记录

| 日期       | 版本 | 变更人        | 变更内容             |
| ---------- | ---- | ------------- | -------------------- |
| 2026-04-25 | v1.0 | Dylan + Buddy | 初始创建，采纳方案 C |
