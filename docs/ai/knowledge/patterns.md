---
title: 可复用代码模式
status: active
last_updated: 2026-05-11
---

# 可复用代码模式

> 从每次交付中提取的成功模式。每个模式记录：触发场景、做法、验证方式。
> 由提炼任务自动追加，不要手动编辑。

## 模式索引

| 模式 | 来源 | 出现次数 |
| ---- | ---- | -------- |

---

## 模式 1：shadcn 组件开发工作流

**触发**：需要新建或修改 shadcn 组件

**做法**：

1. 调研 — shadcn MCP 工具搜索官方 registry
2. 原型 — web-artifacts-builder（可选）
3. 添加 — `npx shadcn@latest add -c src-next` + 修复自引用

**约束**：

- 使用 `cn()` 合并 Tailwind 类
- 颜色用 oklch 色值，禁止 HEX
- 禁止 `--pm-*` 旧品牌色
- 组件 variant 使用 shadcn 默认
- 图标通过 `Icon` 适配层引用，统一 16px

**来源**：`memory/patterns/shadcn-workflow.md` | 人类文档：`docs/01-product/design-spec-v2-shadcn.md`

---

## 模式 2：Squad 三组评估模式

**触发**：新需求进入开发

**做法**：

1. 评估风险等级（L1/L2/L3）
2. L1 → 产品单人评估后直接开发
3. L2 → 组长 + 1 名评估员
4. L3 → 全量 4 人并行评估
5. 全票通过才可进入开发

**验证**：`squad-pre-dev-evaluation` → `squad-post-dev-review` 两段关卡

**来源**：`memory/MEMORY.md` 2026-05-06 更新

---

## 模式 3：三层文档写入模式

**触发**：docs/ 下任何文档变更

**做法**：

1. 人类写完文档 → 加载 `document-sync` 技能
2. 提取结构化合约 → 写入 `docs/ai/contracts/`
3. 建双向链接 → 更新索引 → 合约自检

**约束**：合约 ≤ 200 行、零叙事段落、纯表格/清单

**来源**：`memory/MEMORY.md` 2026-05-11 更新
