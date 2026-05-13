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

连锁门店建设管理系统 — React+TS+Tailwind（shadcn/main）+ Express+SQLite（local-api）。
规则详见 `docs/00-governance/harness/` | 配置 `.harness/registry.yaml`。

<!-- gitnexus:start -->

# GitNexus — Code Intelligence

This project is indexed by GitNexus as **agile-construction** (14227 symbols, 21820 relationships, 300 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource                                            | Use for                                  |
| --------------------------------------------------- | ---------------------------------------- |
| `gitnexus://repo/agile-construction/context`        | Codebase overview, check index freshness |
| `gitnexus://repo/agile-construction/clusters`       | All functional areas                     |
| `gitnexus://repo/agile-construction/processes`      | All execution flows                      |
| `gitnexus://repo/agile-construction/process/{name}` | Step-by-step execution trace             |

## CLI

| Task                                         | Read this skill file                               |
| -------------------------------------------- | -------------------------------------------------- |
| Understand architecture / "How does X work?" | `.agents/skills/gitnexus-exploring/SKILL.md`       |
| Blast radius / "What breaks if I change X?"  | `.agents/skills/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?"             | `.agents/skills/gitnexus-debugging/SKILL.md`       |
| Rename / extract / split / refactor          | `.agents/skills/gitnexus-refactoring/SKILL.md`     |
| Tools, resources, schema reference           | `.agents/skills/gitnexus-guide/SKILL.md`           |
| Index, status, clean, wiki CLI commands      | `.agents/skills/gitnexus-cli/SKILL.md`             |

<!-- gitnexus:end -->
