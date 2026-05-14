# AGENTS.md

## 通用铁律（所有 Agent 必须遵守）

1. **问清楚需求再动手**
   - 任何模糊、不完整的需求，必须先调用澄清类技能
   - 不得在需求未对齐的情况下直接实施

2. **有 1% 可能也要调用 Skills**
   - 宁可过度调用，不可遗漏使用
   - 调用前先阅读 skill 描述确认匹配度

3. **文档铁律**
   - `docs/` 下任何文档变更后必须调用 `document-sync`
   - 确认对应 AI 合约已更新到 `docs/ai/contracts/`
   - 合约自检通关：≤200 行、零叙事段落、frontmatter 完整、双向链接有效

## 项目信息

数字营建项目 — React+TS+Tailwind（shadcn/main）+ Express+SQLite（local-api）。
规则详见 `docs/00-governance/harness/` | 配置 `.harness/registry.yaml`。

<!-- ADJUSTMENTS-START -->
<!-- ADJUSTMENTS-END -->
