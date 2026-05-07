## 2026-05-06 更新

- shadcn 设为主栈 (dev/build 默认入口), MUI 退为 dev:legacy/build:legacy
- src-next/ 原有 shadcn 组件代码存在部分 lint 问题（5 errors），已通过 eslint override 豁免，待后续清理

## 2026-05-06 更新

- MUI 旧栈的 3 份 draft 文档在 UI 切换为 shadcn 后已无实际价值，标记为 archived 后移至 99-archive。未来类似情况应主动归档而非保留为 draft。

## 2026-05-06 更新

- WBSNode 独立模型（不耦合 ProjectTask/WorkPackage），状态枚举用英文（pending/in_progress/completed/blocked），项目编码前缀动态传递

## 2026-05-06 更新

- 采用三组模式：Pre-dev Squad(评估组) → 开发交付者 → Post-dev Squad(验收组)。评估/验收均需全票通过。按 L1/L2/L3 三级风险分级调度角色。v4-pro 分配给推理型角色，v4-flash 分配给检查型角色。
