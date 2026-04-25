# Git 工作流自动化计划

## 目标

合并「自动代码提交」和「提交前审查」两个需求，建立完整的 Git 工作流。

---

## 已完成 ✅

| 事项             | 文件                | 说明                                  |
| ---------------- | ------------------- | ------------------------------------- |
| Husky 初始化     | `.husky/`           | 已创建 pre-commit 和 commit-msg 钩子  |
| 代码格式化配置   | `.prettierrc`       | 2空格、单引号、无分号、printWidth 100 |
| 提交信息规范检查 | `.husky/commit-msg` | 强制 Conventional Commits 格式        |
| lint-staged 配置 | `package.json`      | TS/TSX 文件跑 ESLint + Prettier       |
| 项目首次提交     | Git 仓库            | 987 个文件已入库                      |
| CSS 语法错误修复 | `project-gantt.css` | 第662行 `grid-template-c` 已修复      |

---

## 未完成 ❌

### Phase 1：提交前审查完善

| #   | 事项                     | 优先级 | 说明                                                |
| --- | ------------------------ | ------ | --------------------------------------------------- |
| 1   | 恢复 TypeScript 类型检查 | P0     | pre-commit 中 `npx tsc --noEmit` 被临时移除，需加回 |
| 2   | AI 代码审查脚本          | P1     | 提交前自动分析 diff，输出审查报告                   |
| 3   | 自定义 ESLint 规则       | P1     | 禁止硬编码渐变、禁止重复样式类名等                  |
| 4   | 审查报告日志             | P2     | 每次审查结果记录到 `.codebuddy/review-log.md`       |

### Phase 2：自动化提交

| #   | 事项                 | 优先级 | 说明                                                  |
| --- | -------------------- | ------ | ----------------------------------------------------- |
| 5   | WorkBuddy 自动化任务 | P1     | 每3小时检查一次未提交改动，自动 commit + push         |
| 6   | AI 生成提交信息      | P1     | 根据改动内容自动生成 Conventional Commits 格式信息    |
| 7   | 自动提交日志         | P2     | 记录每次自动提交的时间、文件、提交信息                |
| 8   | 安全兜底机制         | P2     | 核心模块（domain/ data/）改动时不自动提交，需人工确认 |

---

## 执行顺序建议

```
Phase 1: 提交前审查
  → 1. 恢复 tsc --noEmit
  → 2. 添加自定义 ESLint 规则
  → 3. 编写 AI 审查脚本
  → 4. 配置审查日志

Phase 2: 自动化提交
  → 5. 创建自动提交脚本
  → 6. 接入 AI 生成提交信息
  → 7. 配置 WorkBuddy 定时任务
  → 8. 添加核心模块保护机制
```

---

## 当前 pre-commit 状态

```bash
# .husky/pre-commit（当前简化版）
#!/bin/bash
echo "🔍 提交前检查..."
npx lint-staged || exit 1
echo "✅ 检查通过"
```

**目标版：**

```bash
#!/bin/bash
echo "🔍 提交前检查..."

# 1. lint-staged：ESLint + Prettier
npx lint-staged || exit 1

# 2. TypeScript 类型检查
echo "📝 检查 TypeScript 类型..."
npx tsc --noEmit || exit 1

# 3. AI 审查（可选）
echo "🤖 AI 审查..."
# node .codebuddy/scripts/ai-review.js || exit 1

echo "✅ 检查通过"
```

---

_计划创建时间：2026-04-25_
