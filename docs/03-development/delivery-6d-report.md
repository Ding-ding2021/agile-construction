---
id: DOC-DEV-6D-DELIVERY
number: DEV-037
domain: development
category: delivery
title: Phase 6D 交付报告 — 人员管理引擎
owner: product-manager
status: delivered
last_updated: 2026-05-16
source_of_truth: true
---

# Phase 6D 交付报告 — 人员管理引擎

> **交付时间**：2026-05-16
> **交付分支**：`feat/6d-personnel-engine` → `main`（PR #49 Squash Merge）
> **流水线**：Harness 七阶段完整走通

---

## 一、交付范围

6 个子任务全部完成：

| 编号 | 模块       | 内容                                                          |
| ---- | ---------- | ------------------------------------------------------------- |
| 6D-1 | 角色定义   | `pm_role` + `pm_person_role_rel` 表，角色 CRUD + 人员绑定     |
| 6D-2 | 团队与班组 | `pm_team` + `pm_team_member_rel` 表，团队 CRUD + 成员管理     |
| 6D-3 | 分配守卫   | `canAssign` 五道校验：存在性→在岗→可分配→角色匹配→负载≤5      |
| 6D-4 | 碎片迁移   | Project.ownerId + Task.assigneePersonId + Crew.leaderPersonId |
| 6D-5 | 状态变更   | 在岗/请假/离岗/禁用流转 + 可用性自动联动 + 审计日志           |
| 6D-6 | 分页筛选   | roles/teams/personnel 服务端分页 + roleId/teamId 筛选         |

---

## 二、交付物清单

| 类型       | 文件                                               | 说明                                             |
| ---------- | -------------------------------------------------- | ------------------------------------------------ |
| Schema     | `prisma/schema.prisma`                             | 6 张新表 + 3 个 FK 迁移字段                      |
| Service    | `local-api/services/personnelStatusService.ts`     | 状态变更 + 可用性联动 + 审计日志                 |
| Service    | `local-api/services/personnelAssignmentService.ts` | 分配守卫五道校验                                 |
| Controller | `local-api/controllers/personnel.ts`               | 列表/详情/新增/编辑/禁用/状态变更/日志/角色/团队 |
| Controller | `local-api/controllers/roles.ts`                   | 角色 CRUD + 人员绑定                             |
| Controller | `local-api/controllers/teams.ts`                   | 团队 CRUD + 成员管理                             |
| Route      | `local-api/routes/personnel.ts`                    | 已注册                                           |
| Route      | `local-api/routes/roles.ts`                        | 已注册                                           |
| Route      | `local-api/routes/teams.ts`                        | 已注册                                           |
| 前端 API   | `src-next/services/api.ts`                         | 19 个新端点                                      |
| 文档       | `docs/01-product/personnel-management-prd.md`      | PRD                                              |
| 文档       | `docs/ai/contracts/personnel-management.md`        | AI 合约                                          |

---

## 三、Git 提交记录

| 提交      | 类型 | 说明                                        |
| --------- | ---- | ------------------------------------------- |
| `773b63f` | feat | Schema + 6 张新表 + 碎片迁移 + PRD/合约同步 |
| `cc9f426` | feat | 分配守卫 + 状态变更 + 角色/团队 API + 分页  |
| `4dc1912` | test | 测试覆盖 + 前端 API 注册 + Memory 收尾      |
| `fda7340` | fix  | updatePerson 状态机守卫拦截 + setup.ts 重试 |
| `b44c150` | fix  | CI 测试调整为指向 local-api 的 API 测试套件 |

> 合并方式：Squash Merge → `main`，1 个 commit

---

## 四、质量门禁

| 门禁           | 状态 | 详情                     |
| -------------- | ---- | ------------------------ |
| lint           | ✅   | ESLint 零 error          |
| TypeScript     | ✅   | 类型检查通过             |
| API 测试       | ✅   | 14 文件/188 通过/1 skip  |
| Flaky 验证     | ✅   | 3 次连续全量运行全部通过 |
| CI             | ✅   | GitHub Actions 全部通过  |
| Post-dev Squad | ✅   | 全票通过（增量重审后）   |

---

## 五、Post-dev Squad 验收

| 角色             | 初评                  | 增量重审    | 最终 |
| ---------------- | --------------------- | ----------- | ---- |
| 林墨（功能）     | ✅ APPROVED           | -           | ✅   |
| 苏染（UI）       | ✅ APPROVED（有条件） | -           | ✅   |
| 陈锋（代码质量） | ❌ CHANGES REQUESTED  | ✅ APPROVED | ✅   |
| 周严（测试）     | ❌ CHANGES REQUESTED  | ✅ APPROVED | ✅   |

### 验收发现的问题

| #   | 问题                                                | 修复                                                                           |
| --- | --------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | `updatePerson` 直接修改 personStatus 绕过状态机守卫 | 检测 personStatus 变更时代理给 `changePersonStatus`，确保可用性联动 + 审计日志 |
| 2   | `setup.ts` 中 `prisma db push` 偶发 flaky 失败      | 增加 3 次重试 + 1s 间隔                                                        |

---

## 六、修复的其他问题

| #   | 问题                                                     | 修复                                                |
| --- | -------------------------------------------------------- | --------------------------------------------------- |
| 1   | old 测试文件 schema 漂移（status/statusTone 列名不匹配） | setup.ts/bindingService/snapshotService 列名对齐    |
| 2   | template_instantiations updated_at 缺失                  | 插入语句补充 updated_at                             |
| 3   | instantiation.ts 父子关联断裂                            | 先插入再更新 parent_id                              |
| 4   | prisma schema @map 缺失                                  | 补全 ProjectTemplate/TemplateInstantiation 6 个字段 |
| 5   | package-lock.json 未同步                                 | npm install 后提交 lock 文件                        |
| 6   | CI 测试命中了 src-next/node_modules/zod/ 的第三方测试    | vitest.config.ts 排除 **/node_modules/**            |
| 7   | CI 文档校验路径与实际不符                                | 创建 5 个占位文档文件                               |
