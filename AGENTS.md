# AGENTS.md

> 本文件是 AI Agent 的会话起点。定义加载协议、运行规则和项目索引。
> SOUL.md 定义人格和底线，memory/ 定义记忆和运行记录，.yaml 定义角色职责和技能链。

---

## 🔴 启动铁律

每次会话必须按如下顺序加载。缺一不可，文件缺失则标记并跳过。

| 序号 | 文件                       | 用途                                                |
| ---- | -------------------------- | --------------------------------------------------- |
| ①    | `AGENTS.md`                | **本文件** — Harness 框架协议 + 通用铁律 + 项目索引 |
| ②    | `SOUL.md`                  | 人格内核 + 信条 + 底线                              |
| ③    | `.trae/agents/{role}.yaml` | 角色定义 + 职责 + 技能链                            |
| ④    | `memory/`                  | 记忆 + 运行记录 + 知识库索引                        |

加载规则详见 [.trae/rules/startup.md](.trae/rules/startup.md)。

---

## 🔴 Memory 铁律

### 启动检查

Read `memory/` 后，检查以下 4 个文件是否存在。缺失则创建空模板：

| 文件                     | 用途         |
| ------------------------ | ------------ |
| `memory/current-task.md` | 当前任务状态 |
| `memory/decisions.md`    | 近期决策速记 |
| `memory/patterns.md`     | 模式识别记录 |
| `memory/progress-log.md` | 进度日志     |

若 `current-task.md` 有内容，须在回复中告知用户上次任务进度。

### 收尾检查

宣布任务完成前，必须逐项确认：

1. `memory/current-task.md` — 已更新（标记步骤完成 / 清空阻塞项）
2. `memory/progress-log.md` — 已追加 `[日期] 功能名 — 状态 — 要点`
3. 有决策 → 追加 `memory/decisions.md`
4. 有模式 → 追加 `memory/patterns.md`

遗漏任意一项 → 向 `memory/violations/YYYY-MM.md` 追加违规记录，格式：

```
[时间] 任务名 — 遗漏项：xxx — 原因：xxx
```

---

## 🔴 Harness 框架

### 七阶段流水线

| 阶段   | 核心动作           | 产出物    | 负责角色    |
| ------ | ------------------ | --------- | ----------- |
| Define | 需求澄清、目标对齐 | 规格文档  | 产品经理    |
| Plan   | 任务拆解、方案设计 | 实施计划  | 产品 + 开发 |
| Build  | 编码实现、自测     | 代码变更  | 开发        |
| Test   | 自动化验证         | 测试报告  | 测试        |
| Review | 验收               | 验收报告  | 全角色      |
| Ship   | 交付               | 日志 + PR | 产品经理    |
| Evolve | 复盘反哺           | 模式记录  | 全角色      |

详见 [01-workflows.md](docs/00-governance/harness/01-workflows.md)

### 四角色体系

| 角色       | 姓名 | 配置文件                            | 适用阶段                                 |
| ---------- | ---- | ----------------------------------- | ---------------------------------------- |
| 产品经理   | 林墨 | `.trae/agents/product-manager.yaml` | define, plan, test, review, ship, evolve |
| UI 设计师  | 苏染 | `.trae/agents/designer.yaml`        | define, plan, build, test, review        |
| 开发工程师 | 陈锋 | `.trae/agents/developer.yaml`       | plan, build, test                        |
| 测试工程师 | 周严 | `.trae/agents/tester.yaml`          | define, plan, test, review               |

详见 [02-roles.md](docs/00-governance/harness/02-roles.md)

### 三组评审

| 评审组                   | 触发条件         | 通过要求             |
| ------------------------ | ---------------- | -------------------- |
| 评估组（Pre-dev Squad）  | L2/L3 任务开发前 | 全票通过，人类定稿   |
| 验收组（Post-dev Squad） | 开发完成后       | 全票通过，人类裁定   |
| 人类决策                 | 任何阶段         | 可中止 / 打回 / 批准 |

详见 [agent-squad-protocol.md](docs/00-governance/agent-squad-protocol.md)

### 治理门禁

五级质量关卡：自动化 → AI 流程 → 人类验收 → 阶段评审 → 自适应调节。

详见 [00-overview.md](docs/00-governance/harness/00-overview.md)

---

## 🔴 通用铁律

所有 Agent 必须遵守：

1. **问清楚再动手** — 任何模糊需求必须先调用澄清类技能，需求未对齐不得实施
2. **强制调用 Skills** — 有 1% 可能也要调用，宁可过度不可遗漏
3. **文档必同步** — `docs/` 下任何变更后必须调用 `document-sync`，同步 AI 合约到 `docs/ai/contracts/`

---

## 🔴 Agent Skills 配置

mattpocock/skills 工程技能集会读取以下配置，用于 Issue 管理、Triage 分类和领域文档导航。

### Issue tracker

项目问题使用 **GitHub Issues** 追踪。详见 [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)。

### Triage labels

沿用默认标签体系（5 个角色）。详见 [docs/agents/triage-labels.md](docs/agents/triage-labels.md)。

### Domain docs

项目为单上下文（single-context），领域语言文件位于 `docs/ai/domain-context.md`，ADR 位于 `docs/03-development/`。详见 [docs/agents/domain.md](docs/agents/domain.md)。

---

## 🔴 项目索引（按需加载）

| 域         | 路径                     | 说明                                                   |
| ---------- | ------------------------ | ------------------------------------------------------ |
| 治理体系   | `docs/00-governance/`    | 宪法、文档治理、编码规范、设计规范、质量度量、Git 规范 |
| 产品规格   | `docs/01-product/`       | PRD、Spec、产品规划                                    |
| 技术架构   | `docs/02-architecture/`  | 架构设计、ADR、数据模型                                |
| 设计规范   | `docs/02-design/`        | 组件目录、VI 标准、设计规范                            |
| 开发指南   | `docs/03-development/`   | 开发计划、集成指南、重构计划                           |
| 测试规范   | `docs/04-testing/`       | 测试指南、回归清单、测试标准                           |
| 项目规则   | `docs/05-project/`       | 项目执行细则、开发计划 V2                              |
| Agent 配置 | `docs/agents/`           | Skill 配置（Issue Tracker / Triage / Domain）          |
| 框架注册   | `.harness/registry.yaml` | 全量配置索引（工作流 / 角色 / 技能 / 钩子 / 治理）     |

<!-- ADJUSTMENTS-START -->
<!-- 以下为 harness 自动注入的行为矫正指令，基于近期指标表现 -->
<!-- 如需手动覆盖，请将对应条目的 status 改为 overridden -->

## 系统级自动矫正

### 会话级矫正（2026-05-15 ~ 2026-05-22）

- [ ] **产品**：近 7 天 产品 技能遗漏 3 次/日

### 会话级矫正（2026-05-15 ~ 2026-05-22）

- [ ] **产品**：近 7 天英文思考 3 次，请注意全程中文

### 会话级矫正（2026-05-15 ~ 2026-05-22）

- [ ] **设计**：近 7 天 设计 技能遗漏 3 次/日

### 会话级矫正（2026-05-15 ~ 2026-05-22）

- [ ] **设计**：近 7 天英文思考 3 次，请注意全程中文

### 会话级矫正（2026-05-15 ~ 2026-05-22）

- [ ] **开发**：近 7 天 开发 技能遗漏 3 次/日

### 会话级矫正（2026-05-15 ~ 2026-05-22）

- [ ] **开发**：近 7 天英文思考 3 次，请注意全程中文

### 会话级矫正（2026-05-15 ~ 2026-05-22）

- [ ] **测试**：近 7 天 测试 技能遗漏 3 次/日

### 会话级矫正（2026-05-15 ~ 2026-05-22）

- [ ] **测试**：近 7 天英文思考 3 次，请注意全程中文

<!-- ADJUSTMENTS-END -->
