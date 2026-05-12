# 项目规则

## 宪法原则

项目治理基于六项基本原则，详见 `docs/00-governance/project-charter.md`：

1. **规范驱动** — 任何交付必须先输出规范
2. **测试驱动** — 先测试后实现
3. **角色驱动** — 按角色职责行事
4. **技能驱动** — 有匹配 skill 必须调用
5. **需求澄清** — 问清楚再动手
6. **自我进化** — 持续优化技能体系

## Harness 工程框架

项目遵守 Harness 7 阶段流程，详见 `docs/00-governance/harness/`：

- Align → Plan → Build → Test → Review → Deploy → Evolve

## 技术架构

- 前端：React + TypeScript + Tailwind CSS（shadcn/ui）
- 后端：Express + SQLite（local-api）
- 状态管理：React Context / Zustand
- 测试：Vitest + Playwright

## 必读文档索引

| 文档           | 路径                                         |
| -------------- | -------------------------------------------- |
| 治理宪法       | `docs/00-governance/project-charter.md`      |
| 文档治理规范   | `docs/00-governance/document-governance.md`  |
| 执行细则       | `docs/05-project/project-rules.md`           |
| Harness 角色   | `docs/00-governance/harness/roles/产品.md`   |
| Harness 技能   | `docs/00-governance/harness/03-skills.md`    |
| Harness 工作流 | `docs/00-governance/harness/01-workflows.md` |
