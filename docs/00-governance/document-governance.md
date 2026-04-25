---
id: DOC-00-GOVERNANCE-DOCUMENT-GOVERNANCE
title: 文档治理规范
owner: docs-maintainer
status: active
last_updated: 2026-04-16
source_of_truth: true
related_code: []
related_docs:
  - docs/README.md
---

# 文档治理规范

## 1. 目标

- 建立 `docs/` 作为唯一文档域。
- 建立 `docs/README.md` 作为唯一导航入口。
- 建立单一事实源（SSOT）与状态治理，避免重复执行口径。

## 2. 目录与职责

- `00-governance`：规则与标准（长期有效）
- `01-product`：产品与需求
- `02-architecture`：架构与设计
- `03-engineering`：开发交付与发布
- `04-operations`：运营指标与治理记录
- `99-archive`：历史归档（不可作为执行依据）

## 3. 状态模型

- `draft`：草稿，禁止作为执行依据
- `active`：执行版本（唯一事实源）
- `deprecated`：废弃，保留追溯
- `archived`：归档，仅历史查询

## 4. Frontmatter 最低要求

每篇 active 文档必须包含：

- `id`
- `title`
- `owner`
- `status`
- `last_updated`
- `source_of_truth`
- `related_code`
- `related_docs`

## 5. 引用规则

- 文档引用统一使用 `docs/...` 路径。
- 根目录仅允许入口级说明文档，禁止新增业务规范文档。
- 同主题仅允许一个 active 文档，其余必须标记 `deprecated` 或进入 `99-archive`。

## 6. 变更流程

1. 修改文档内容
2. 更新 Frontmatter（尤其 `last_updated`）
3. 更新 `docs/README.md` 索引
4. 通过 `docs/00-governance/pr-doc-checklist.md` 检查
5. 合并后记录至审计文档
