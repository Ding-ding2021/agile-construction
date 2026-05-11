# 项目治理报告 — 2026-05-11

> 产品经理：林墨 | 状态：🟢 治理进行中

---

## 一、Git 仓库卫生

| 指标           | 修复前                     | 修复后              | 状态 |
| -------------- | -------------------------- | ------------------- | ---- |
| 分支偏离       | ahead 121 / behind 118     | ahead 5             | 🟢   |
| 僵尸分支       | 7 条（5 local + 2 remote） | 0                   | 🟢   |
| 僵尸 worktree  | 5 个                       | 0                   | 🟢   |
| 数据库文件污染 | `*.db` 未排除              | `.gitignore` 已添加 | 🟢   |
| Git 合并冲突   | 3 文件 / 5 处              | 0                   | 🟢   |
| 推送状态       | —                          | ⬜ 网络不通，待推送 | 🟡   |

---

## 二、文档健康

| 指标          | 数值                        | 状态 |
| ------------- | --------------------------- | ---- |
| 全部文档      | 71+                         | —    |
| 🟢 active     | ~45                         | 🟢   |
| 🟡 draft      | 8                           | 🟢   |
| ⚪ superseded | 18（17 在 knowledge-base/） | 🟡   |
| 🔴 合并冲突   | 0（已修复）                 | 🟢   |

### Draft 文档清单

| 文件                                                      | 主题             |
| --------------------------------------------------------- | ---------------- |
| `docs/00-governance/component-development-contract.md`    | 组件开发契约     |
| `docs/00-governance/code-review-checklist.md`             | 代码审查清单     |
| `docs/01-product/gantt-benchmark-research.md`             | 甘特图基准调研   |
| `docs/01-product/task-center-erd.md`                      | 任务中心 ERD     |
| `docs/02-architecture/wbs-framework-design.md`            | WBS 框架设计     |
| `docs/02-architecture/routing-state-migration-plan.md`    | 路由状态迁移计划 |
| `docs/03-engineering/phase1.5/phase1.5-tech-debt-plan.md` | Phase 1.5 债务   |
| `docs/03-engineering/component-refactoring-plan.md`       | 组件重构计划     |

**建议**：8 个 draft 均为灰度文档，如果不再推进，应标记 deprecated；如果持续推进，应升级为 active。

---

## 三、Skills 库存

| 指标                                   | 数值                          | 状态 |
| -------------------------------------- | ----------------------------- | ---- |
| 项目技能（.agents/skills/）            | 54（34 根 + 20 子）           | 🟢   |
| 全局技能（~/.config/opencode/skills/） | 23                            | 🟢   |
| Claude 技能（~/.claude/skills/）       | 1（code-comprehension）       | 🟢   |
| 跨源重复                               | 0                             | 🟢   |
| 去重总计                               | ~72                           | 🟢   |
| 命名空间目录无 SKILL.md                | 2（gitnexus/ + superpowers/） | 🟢   |

**结论**：Skills 无重复，分布合理。项目技能和全局技能完全互补、不相交。

---

## 四、Harness 框架

| 指标       | 数值                      | 状态 |
| ---------- | ------------------------- | ---- |
| 框架文档   | 14 文件（10 主 + 4 角色） | 🟢   |
| 配置文件   | 2 文件                    | 🟢   |
| Squad 验收 | 三席全票 APPROVED         | 🟢   |
| 指标总数   | 51（29 角色 + 22 通用）   | 🟢   |

---

## 五、待办

| #   | 优先级 | 事项                                         | 状态 |
| --- | ------ | -------------------------------------------- | ---- |
| 1   | 🔴     | Git 推送（网络恢复后）                       | ⬜   |
| 2   | 🟡     | 18 份 superseded 文档归档（knowledge-base/） | ⬜   |
| 3   | 🟡     | 8 份 draft 文档决定去留                      | ⬜   |
| 4   | 🟡     | 打通飞书 Webhook                             | ⬜   |

---

## 六、今日提交记录

| Commit    | 内容                                                     |
| --------- | -------------------------------------------------------- |
| `1242b71` | feat(harness): 创建 opencode 驱动开发工程框架（17 文件） |
| `95278f0` | fix(docs): 解决 3 个文件的 git 合并冲突并更新 gitignore  |
