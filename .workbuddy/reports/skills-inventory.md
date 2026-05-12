# 技能完整清单 — Skills Inventory

> 生成日期: 2026-05-12
> 用途: Harness P1 技能治理基础数据

---

## 1. 完整技能总表（按来源）

### 1.1 项目技能 — `.agents/skills/`

#### 顶层技能（14）

| #   | 技能名                     | 类型       | 注册表归属    | 标记                                                 |
| --- | -------------------------- | ---------- | ------------- | ---------------------------------------------------- |
| 1   | `chinese-language`         | 流程控制   | —             | ❗ 全局重复（也存在于 `~/.config/opencode/skills/`） |
| 2   | `clone-website`            | 前端工程   | 设计/开发共享 |                                                      |
| 3   | `document-sync`            | 流程控制   | 产品专有      |                                                      |
| 4   | `frontend-design`          | 设计工程   | 设计专有      |                                                      |
| 5   | `frontend-ui-animator`     | 设计工程   | 设计专有      |                                                      |
| 6   | `frontend-ui-integration`  | 前端工程   | 开发专有      |                                                      |
| 7   | `karpathy-guidelines`      | 编码准则   | 开发专有      |                                                      |
| 8   | `rsc-data-optimizer`       | 优化       | 开发专有      |                                                      |
| 9   | `shadcn-management`        | shadcn管理 | 设计/开发共享 |                                                      |
| 10  | `shadcn-ui`                | shadcn组件 | 设计/开发共享 |                                                      |
| 11  | `squad-post-dev-review`    | Squad协作  | 全专业共享    |                                                      |
| 12  | `squad-pre-dev-evaluation` | Squad协作  | 全专业共享    |                                                      |
| 13  | `ui-layout-rules`          | 布局规范   | 设计专有      |                                                      |
| 14  | `web-artifacts-builder`    | 原型工具   | 设计专有      |                                                      |

#### GitNexus 子技能（6）

| #   | 技能名                     | 注册表归属 |
| --- | -------------------------- | ---------- |
| 15  | `gitnexus-cli`             | 开发专有   |
| 16  | `gitnexus-debugging`       | 开发专有   |
| 17  | `gitnexus-exploring`       | 开发专有   |
| 18  | `gitnexus-guide`           | 开发专有   |
| 19  | `gitnexus-impact-analysis` | 开发专有   |
| 20  | `gitnexus-refactoring`     | 开发专有   |

#### Superpowers 子技能（14）

| #   | 技能名                           | 注册表归属    |
| --- | -------------------------------- | ------------- |
| 21  | `brainstorming`                  | 产品专有      |
| 22  | `dispatching-parallel-agents`    | 测试专有      |
| 23  | `executing-plans`                | 产品专有      |
| 24  | `finishing-a-development-branch` | 产品专有      |
| 25  | `receiving-code-review`          | 产品专有      |
| 26  | `requesting-code-review`         | 产品专有      |
| 27  | `subagent-driven-development`    | 开发专有      |
| 28  | `systematic-debugging`           | 测试专有      |
| 29  | `test-driven-development`        | 开发/测试共享 |
| 30  | `using-git-worktrees`            | 开发专有      |
| 31  | `using-superpowers`              | 产品专有      |
| 32  | `verification-before-completion` | 产品/测试共享 |
| 33  | `writing-plans`                  | 产品专有      |
| 34  | `writing-skills`                 | 产品专有      |

### 1.2 全局技能 — `~/.config/opencode/skills/`（24）

| #   | 技能名               | 类型     | 注册表归属    | 标记                                          |
| --- | -------------------- | -------- | ------------- | --------------------------------------------- |
| 35  | `chinese-language`   | 流程控制 | —             | ❗ 项目重复（也存在于 `.agents/skills/`）     |
| 36  | `skill-creator`      | 技能开发 | 产品专有      | ❗ Claude重复（也存在于 `~/.claude/skills/`） |
| 37  | `find-skills-x`      | 技能发现 | 产品专有      |                                               |
| 38  | `website-audit`      | 分析     | 产品专有      |                                               |
| 39  | `web-typography`     | 设计基础 | 设计专有      |                                               |
| 40  | `webdesign-review`   | 审查     | 设计专有      |                                               |
| 41  | `visual-direction`   | 设计基础 | 设计专有      |                                               |
| 42  | `ux-design`          | 设计基础 | 设计专有      |                                               |
| 43  | `ui-patterns`        | 设计基础 | 设计专有      |                                               |
| 44  | `usability`          | 品牌质量 | 设计/测试共享 |                                               |
| 45  | `ui-design`          | 设计基础 | 设计专有      |                                               |
| 46  | `navigation-design`  | 设计基础 | 设计专有      |                                               |
| 47  | `images-media`       | 品牌质量 | 设计专有      |                                               |
| 48  | `landing-pages`      | 审查     | 设计专有      |                                               |
| 49  | `responsive-design`  | 设计基础 | 设计专有      |                                               |
| 50  | `design-trends`      | 设计基础 | 设计专有      |                                               |
| 51  | `design-process`     | 设计基础 | 设计专有      |                                               |
| 52  | `color-theory`       | 设计基础 | 设计专有      |                                               |
| 53  | `customer-journey`   | 品牌质量 | 产品/设计共享 |                                               |
| 54  | `component-patterns` | 设计基础 | 设计专有      |                                               |
| 55  | `branding-identity`  | 品牌质量 | 设计专有      |                                               |
| 56  | `agent-ui-design`    | 审查     | 设计专有      |                                               |
| 57  | `accessibility`      | 品牌质量 | 设计专有      |                                               |
| 58  | `ai-design-workflow` | 设计基础 | 设计专有      |                                               |

### 1.3 Claude 技能 — `~/.claude/skills/`（26）

| #   | 技能名                          | 类型          | 注册表归属 | 标记                                                 |
| --- | ------------------------------- | ------------- | ---------- | ---------------------------------------------------- |
| 59  | `code-comprehension`            | 代码理解      | 产品专有   | ✅ 03-skills.md 已记录                               |
| 60  | `skill-creator`                 | 技能开发      | 产品专有   | ❗ 全局重复（也存在于 `~/.config/opencode/skills/`） |
| 61  | `lark-approval`                 | 飞书审批      | —          | ⚠️ 未在 03-skills.md 注册                            |
| 62  | `lark-attendance`               | 飞书考勤      | —          | ⚠️ 未注册                                            |
| 63  | `lark-base`                     | 飞书多维表格  | —          | ⚠️ 未注册                                            |
| 64  | `lark-calendar`                 | 飞书日历      | —          | ⚠️ 未注册                                            |
| 65  | `lark-contact`                  | 飞书通讯录    | —          | ⚠️ 未注册                                            |
| 66  | `lark-doc`                      | 飞书文档      | —          | ⚠️ 未注册                                            |
| 67  | `lark-drive`                    | 飞书云空间    | —          | ⚠️ 未注册                                            |
| 68  | `lark-event`                    | 飞书事件订阅  | —          | ⚠️ 未注册                                            |
| 69  | `lark-im`                       | 飞书即时通讯  | —          | ⚠️ 未注册                                            |
| 70  | `lark-mail`                     | 飞书邮箱      | —          | ⚠️ 未注册                                            |
| 71  | `lark-markdown`                 | 飞书Markdown  | —          | ⚠️ 未注册                                            |
| 72  | `lark-minutes`                  | 飞书妙记      | —          | ⚠️ 未注册                                            |
| 73  | `lark-okr`                      | 飞书OKR       | —          | ⚠️ 未注册                                            |
| 74  | `lark-openapi-explorer`         | 飞书OpenAPI   | —          | ⚠️ 未注册                                            |
| 75  | `lark-shared`                   | 飞书CLI基础   | —          | ⚠️ 未注册                                            |
| 76  | `lark-sheets`                   | 飞书电子表格  | —          | ⚠️ 未注册                                            |
| 77  | `lark-skill-maker`              | 飞书Skill制作 | —          | ⚠️ 未注册                                            |
| 78  | `lark-slides`                   | 飞书幻灯片    | —          | ⚠️ 未注册                                            |
| 79  | `lark-task`                     | 飞书任务      | —          | ⚠️ 未注册                                            |
| 80  | `lark-vc`                       | 飞书视频会议  | —          | ⚠️ 未注册                                            |
| 81  | `lark-vc-agent`                 | 飞书会议Agent | —          | ⚠️ 未注册                                            |
| 82  | `lark-whiteboard`               | 飞书画板      | —          | ⚠️ 未注册                                            |
| 83  | `lark-wiki`                     | 飞书知识库    | —          | ⚠️ 未注册                                            |
| 84  | `lark-workflow-meeting-summary` | 飞书会议纪要  | —          | ⚠️ 未注册                                            |
| 85  | `lark-workflow-standup-report`  | 飞书日程待办  | —          | ⚠️ 未注册                                            |

### 1.4 内置技能 — Skill Tool（25+，仅供查阅，非本地文件）

这些技能由 Trae IDE 内置提供，无需本地 SKILL.md。

| 技能名                          | 注册表归属    |
| ------------------------------- | ------------- |
| `api-and-interface-design`      | 开发专有      |
| `browser-testing-with-devtools` | 设计/测试共享 |
| `cache-components`              | —             |
| `ci-cd-and-automation`          | 产品专有      |
| `code-review-and-quality`       | 产品/测试共享 |
| `code-reviewer（代码审查）`     | —             |
| `code-simplification`           | 开发专有      |
| `context-engineering`           | 产品/开发共享 |
| `debugging-and-error-recovery`  | 测试专有      |
| `deprecation-and-migration`     | 开发专有      |
| `documentation-and-adrs`        | 产品/开发共享 |
| `doubt-driven-development`      | 开发专有      |
| `frontend-developer`            | —             |
| `frontend-ui-engineering`       | 设计/开发共享 |
| `git-workflow-and-versioning`   | 产品专有      |
| `idea-refine`                   | 产品专有      |
| `incremental-implementation`    | 开发专有      |
| `performance-optimization`      | 开发专有      |
| `planning-and-task-breakdown`   | 产品专有      |
| `security-and-hardening`        | 开发专有      |
| `shipping-and-launch`           | 产品专有      |
| `source-driven-development`     | 开发专有      |
| `spec-driven-development`       | 产品专有      |
| `using-agent-skills`            | 产品专有      |
| `web-dev`                       | —             |

---

## 2. 汇总统计

| 来源                                  | 原始数量 | 去重后                                    | 在03-skills.md已注册 | 未注册    |
| ------------------------------------- | -------- | ----------------------------------------- | -------------------- | --------- |
| 项目技能 `.agents/skills/`            | 34       | 34                                        | 34 ✅                | 0         |
| 全局技能 `~/.config/opencode/skills/` | 24       | 22 _(去重chinese-language+skill-creator)_ | 23 _(注1)_           | 0         |
| Claude技能 `~/.claude/skills/`        | 26       | 25 _(去重skill-creator)_                  | 1                    | **24 ⚠️** |
| 内置 Skill Tool                       | ~25      | ~25                                       | — _(注2)_            | —         |
| **总计（唯一）**                      | **109**  | **106**                                   | **58**               | **24 ⚠️** |

> 注1: 03-skills.md 统计"全局设计技能 23"去掉了 chinese-language（算在项目技能中）
> 注2: 内置技能通过 Skill tool 加载，不占本地文件计数

---

## 3. 去重分析

### 3.1 重复文件（需要处理）

#### 重复 1: `chinese-language`

- **路径A**: `.agents/skills/chinese-language/SKILL.md`
- **路径B**: `~/.config/opencode/skills/chinese-language/SKILL.md`
- **建议**: 保留项目级副本（A），全局副本为内置安装残留。**不动项目级文件**，因为它们 serving different purposes（项目级为工作流强制加载，全局级为 IDE 默认安装）。

#### 重复 2: `skill-creator`

- **路径A**: `~/.config/opencode/skills/skill-creator/SKILL.md`
- **路径B**: `~/.claude/skills/skill-creator/SKILL.md`
- **建议**: 保留 `~/.config/opencode/skills/` 下的版本（A），删除 `~/.claude/skills/` 下的重复。

### 3.2 命名不一致

| 问题           | 涉及技能           | 说明                         |
| -------------- | ------------------ | ---------------------------- |
| 项目/全局同名  | `chinese-language` | 两副本内容是否一致？需验证   |
| 无命名规范问题 | —                  | 现有命名统一为 kebab-case ✅ |

### 3.3 未在文档注册的技能（24个飞书技能）

所有 `lark-*` 技能均存在于 `~/.claude/skills/` 但完全未出现在 03-skills.md、registry.yaml、manifest.yaml 中。这些是 Claude Code 的飞书集成技能，在当前项目中未被分配职业归属。

---

## 4. 注册表一致性检查

### 4.1 manifest.yaml 问题

- `skills_total: 106` — 含内置 Skill Tool 计数，与 03-skills.md 的 72 不一致
- 文档中的 72 仅计本地文件，manifest 的 106 似乎总计了所有可用的

### 4.2 registry.yaml 问题

- registry.yaml 中 `skills.产品` 引用了一些本地不存在的技能（如 `spec-driven-development`, `idea-refine`, `planning-and-task-breakdown`）——这些是内置 Skill Tool 技能，合理
- 24个飞书技能完全未出现在 registry.yaml 中
- `skills.设计` 中 `shadcn-ui`, `shadcn-management`, `clone-website`, `frontend-ui-engineering` 同时出现在 exclusive 和 shared 中（技术上的重复标记，非功能问题）

### 4.3 03-skills.md 问题

- 技能总数 "72" 与 manifest.yaml "106" 不一致
- 产品经理技能数：03-skills.md 说 27（含共享），manifest.yaml 说 26（不含共享）
- `# 技能分布` 表里的数字 34+6+14+23+1=78，但写成 72（差6个）
- 飞书 24 技能缺失
