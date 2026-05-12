---
id: DOC-GOVERNANCE-GIT
number: GOV-027
domain: governance
category: process-guide
title: Git 治理规范
owner: 林墨（产品经理 Agent）
status: active
last_updated: 2026-05-13
source_of_truth: true
related_code: [.husky/commit-msg, .husky/pre-commit, .husky/pre-push]
related_docs: [project-charter.md, document-governance.md]
---

# Git 治理规范

## 一、分支命名规则

| 类型     | 格式              | 示例                       | 用途         |
| -------- | ----------------- | -------------------------- | ------------ |
| 功能开发 | `feat/<描述>`     | `feat/task-batch-assign`   | 新功能       |
| Bug 修复 | `fix/<描述>`      | `fix/login-redirect`       | 修 Bug       |
| 文档变更 | `docs/<描述>`     | `docs/git-governance`      | 文档         |
| 代码重构 | `refactor/<描述>` | `refactor/gantt-component` | 重构不改行为 |
| 测试     | `test/<描述>`     | `test/e2e-checkout`        | 测试相关     |
| 工程配置 | `chore/<描述>`    | `chore/update-deps`        | 依赖/配置    |
| 紧急修复 | `hotfix/<描述>`   | `hotfix/payment-crash`     | 生产紧急     |

**强制规则**：

- 描述部分使用英文小写 + 连字符，禁止中文、空格、下划线混用
- 禁止使用自动生成的无意义名称（如 `claude/quizzical-nash-05ae59`）

---

## 二、提交信息格式

采用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>
```

| 字段    | 必填 | 说明                                            | 示例                |
| ------- | :--: | ----------------------------------------------- | ------------------- |
| type    |  是  | feat/fix/docs/refactor/test/chore/ci/build/perf | `feat`              |
| scope   |  否  | 影响模块，用括号包裹                            | `(林墨)`、`(苏染)`  |
| subject |  是  | 一句话描述，中文，不加句号                      | `新增 Git 治理规范` |

**强制规则**：

- `subject` 使用中文描述（项目语言为中文）
- 一次提交只做一件事
- 禁止 `WIP`、`tmp`、`fix bug` 等无意义信息
- 自动化工具已拦截不合规提交（`.husky/commit-msg`）

---

## 三、分支生命周期

```
创建分支 ──▶ 开发 + 提交 ──▶ 推送 + 创建 PR ──▶ Review ──▶ 合并到 main ──▶ 删除分支
```

| 阶段 | 操作                        | 责任人   |
| ---- | --------------------------- | -------- |
| 创建 | 从 main 最新节点切出        | 林墨     |
| 开发 | 小步提交，每提交跑本地检查  | 对应角色 |
| 推送 | push 前自动跑 pre-push 门禁 | 自动化   |
| PR   | 林墨创建 PR，指定 Reviewer  | 林墨     |
| 合并 | Review 通过后 squash merge  | 林墨     |
| 删除 | 合并后立即删除远程分支      | 林墨     |

**强制规则**：

- 禁止直接在 main 分支提交（保护 main 只接受 PR 合并）
- 分支合并后 24 小时内必须删除
- 超过 7 天未活跃的分支标记为 stale，提醒处理

---

## 四、禁止事项

| #   | 禁止行为                      | 后果                         |
| --- | ----------------------------- | ---------------------------- |
| 1   | 使用中文分支名                | pre-commit 阻断              |
| 2   | 分支名不符合 `type/描述` 格式 | pre-commit 阻断              |
| 3   | 直接 push 到 main             | 需 GitHub 分支保护（待配置） |
| 4   | 提交信息不含 type 前缀        | commit-msg hook 阻断         |
| 5   | 合并未经 review 的代码        | 人工把关                     |
| 6   | 保留已合并的僵尸分支          | 林墨定期清理                 |

---

## 五、检查清单（每次提交前）

林墨负责在每次提交前逐项确认：

- [ ] 当前分支名符合 `type/描述` 格式
- [ ] 本次提交只做了一件事
- [ ] 提交信息包含 type 前缀 + 中文描述
- [ ] 关联的功能分支代码已全部合并
- [ ] 无残留的未合并分支

---

## 六、工具执行

| 规则         | 执行方式                   | 配置文件            |
| ------------ | -------------------------- | ------------------- |
| 提交信息格式 | commit-msg hook 自动拦截   | `.husky/commit-msg` |
| 分支名格式   | pre-commit hook 自动拦截   | `.husky/pre-commit` |
| 推送前质量   | pre-push hook 自动拦截     | `.husky/pre-push`   |
| 分支清理     | 林墨手动执行 + 日志记录    | —                   |
| main 保护    | 待 GitHub 分支保护规则配置 | —                   |
