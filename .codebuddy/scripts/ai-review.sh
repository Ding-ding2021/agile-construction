#!/bin/bash
# AI 代码审查脚本 - 提交前自动分析 diff 并输出审查报告
# 用法: ./.codebuddy/scripts/ai-review.sh [commit-range]
# 示例: ./.codebuddy/scripts/ai-review.sh        # 审查暂存区改动
#       ./.codebuddy/scripts/ai-review.sh HEAD~1  # 审查上次提交

set -e

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
REVIEW_LOG="$REPO_ROOT/.codebuddy/review-log.md"
REVIEW_DIR="$REPO_ROOT/.codebuddy/reviews"
TIMESTAMP=$(date '+%Y-%m-%d_%H%M%S')
REVIEW_FILE="$REVIEW_DIR/review_$TIMESTAMP.md"

# 确保目录存在
mkdir -p "$REVIEW_DIR"

# 确定审查范围
if [ -n "$1" ]; then
    DIFF_RANGE="$1"
    echo "🔍 AI 代码审查 — 范围: $DIFF_RANGE"
    git diff "$DIFF_RANGE" > /tmp/ai-review-diff.txt 2>/dev/null || true
else
    echo "🔍 AI 代码审查 — 暂存区改动"
    git diff --cached > /tmp/ai-review-diff.txt 2>/dev/null || true
fi

# 检查是否有改动
if [ ! -s /tmp/ai-review-diff.txt ]; then
    echo "✅ 无改动，跳过审查"
    exit 0
fi

# 统计改动信息
FILES_CHANGED=$(git diff --cached --name-only 2>/dev/null | wc -l | tr -d ' ')
LINES_ADDED=$(git diff --cached --stat 2>/dev/null | tail -1 | grep -o '[0-9]* insertions' | grep -o '[0-9]*' || echo "0")
LINES_DELETED=$(git diff --cached --stat 2>/dev/null | tail -1 | grep -o '[0-9]* deletions' | grep -o '[0-9]*' || echo "0")

echo "📊 改动统计: $FILES_CHANGED 个文件, +$LINES_ADDED -$LINES_DELETED 行"

# 生成审查报告头
cat > "$REVIEW_FILE" << EOF
# AI 代码审查报告

- **时间**: $(date '+%Y-%m-%d %H:%M:%S')
- **提交范围**: ${DIFF_RANGE:-暂存区}
- **文件数**: $FILES_CHANGED
- **新增行**: $LINES_ADDED
- **删除行**: $LINES_DELETED

---

## 改动文件列表

EOF

# 列出改动文件
git diff --cached --name-only 2>/dev/null | while read -r file; do
    echo "- \`$file\`" >> "$REVIEW_FILE"
done

# 分析 diff 内容，生成审查要点
cat >> "$REVIEW_FILE" << EOF

---

## 自动检查项

EOF

# 1. 检查 TypeScript 类型定义
if git diff --cached --name-only 2>/dev/null | grep -qE '\.(ts|tsx)$'; then
    echo "📝 检查 TypeScript 类型..."
    TS_ERRORS=$(cd "$REPO_ROOT" && npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0")
    if [ "$TS_ERRORS" -gt 0 ]; then
        echo "- ❌ **TypeScript 类型错误**: 发现 $TS_ERRORS 处类型错误" >> "$REVIEW_FILE"
        echo "  \`\`\`" >> "$REVIEW_FILE"
        cd "$REPO_ROOT" && npx tsc --noEmit 2>&1 | head -20 >> "$REVIEW_FILE"
        echo "  \`\`\`" >> "$REVIEW_FILE"
    else
        echo "- ✅ **TypeScript 类型检查**: 通过" >> "$REVIEW_FILE"
    fi
else
    echo "- ⏭️ **TypeScript 类型检查**: 无 TS/TSX 文件改动，跳过" >> "$REVIEW_FILE"
fi

# 2. 检查 ESLint 问题
if git diff --cached --name-only 2>/dev/null | grep -qE '\.(ts|tsx|js|jsx)$'; then
    echo "🔍 检查 ESLint..."
    ESLINT_ERRORS=$(cd "$REPO_ROOT" && npx eslint --quiet $(git diff --cached --name-only | grep -E '\.(ts|tsx|js|jsx)$' | tr '\n' ' ') 2>&1 | grep -c "error" || echo "0")
    if [ "$ESLINT_ERRORS" -gt 0 ]; then
        echo "- ❌ **ESLint**: 发现 $ESLINT_ERRORS 处问题" >> "$REVIEW_FILE"
    else
        echo "- ✅ **ESLint**: 通过" >> "$REVIEW_FILE"
    fi
else
    echo "- ⏭️ **ESLint**: 无代码文件改动，跳过" >> "$REVIEW_FILE"
fi

# 3. 检查硬编码渐变（技术债务）
echo "🎨 检查硬编码渐变..."
GRADIENT_COUNT=$(grep -c "linear-gradient\|radial-gradient" /tmp/ai-review-diff.txt || echo "0")
if [ "$GRADIENT_COUNT" -gt 0 ]; then
    echo "- ⚠️ **硬编码渐变**: 发现 $GRADIENT_COUNT 处新增渐变，建议使用主题变量" >> "$REVIEW_FILE"
    grep -n "linear-gradient\|radial-gradient" /tmp/ai-review-diff.txt | head -5 | sed 's/^/  /' >> "$REVIEW_FILE"
else
    echo "- ✅ **硬编码渐变**: 无新增" >> "$REVIEW_FILE"
fi

# 4. 检查重复样式类名
echo "🏷️ 检查样式类名..."
# 简单检查：是否有新的 .pm-stat-* 或 .tm-stat-* 类名
DUPE_CLASSES=$(grep -oE '\.(pm|tm)-stat-[a-z]+' /tmp/ai-review-diff.txt | sort | uniq -d | wc -l | tr -d ' ')
if [ "$DUPE_CLASSES" -gt 0 ]; then
    echo "- ⚠️ **重复样式类名**: 发现可能重复的类名" >> "$REVIEW_FILE"
    grep -oE '\.(pm|tm)-stat-[a-z]+' /tmp/ai-review-diff.txt | sort | uniq -d | sed 's/^/  - /' >> "$REVIEW_FILE"
else
    echo "- ✅ **重复样式类名**: 未发现明显重复" >> "$REVIEW_FILE"
fi

# 5. 检查 console.log / debugger
echo "🐛 检查调试代码..."
DEBUG_COUNT=$(grep -c "console\.log\|debugger;" /tmp/ai-review-diff.txt || echo "0")
if [ "$DEBUG_COUNT" -gt 0 ]; then
    echo "- ⚠️ **调试代码**: 发现 $DEBUG_COUNT 处 console.log 或 debugger" >> "$REVIEW_FILE"
    grep -n "console\.log\|debugger;" /tmp/ai-review-diff.txt | head -5 | sed 's/^/  /' >> "$REVIEW_FILE"
else
    echo "- ✅ **调试代码**: 无残留" >> "$REVIEW_FILE"
fi

# 6. 检查大文件改动
echo "📦 检查文件大小..."
LARGE_FILES=$(git diff --cached --stat 2>/dev/null | awk '$1 > 200 {print $NF}' | head -5)
if [ -n "$LARGE_FILES" ]; then
    echo "- ⚠️ **大文件改动**: 以下文件改动超过200行，建议拆分提交" >> "$REVIEW_FILE"
    echo "$LARGE_FILES" | sed 's/^/  - /' >> "$REVIEW_FILE"
else
    echo "- ✅ **文件大小**: 无超大改动" >> "$REVIEW_FILE"
fi

# 7. 检查敏感信息泄露
echo "🔒 检查敏感信息..."
if grep -qE '(password|secret|token|api_key|private_key)\s*[:=]\s*["\'][^"\']+["\']' /tmp/ai-review-diff.txt; then
    echo "- 🚨 **敏感信息**: 可能包含密码/密钥等敏感信息，请人工确认" >> "$REVIEW_FILE"
    grep -nE '(password|secret|token|api_key|private_key)\s*[:=]\s*["\'][^"\']+["\']' /tmp/ai-review-diff.txt | head -3 | sed 's/^/  /' >> "$REVIEW_FILE"
else
    echo "- ✅ **敏感信息**: 未发现明显泄露" >> "$REVIEW_FILE"
fi

# 8. 检查核心模块改动
echo "🛡️ 检查核心模块..."
CORE_FILES=$(git diff --cached --name-only 2>/dev/null | grep -E '^src/(domain|data)/' || true)
if [ -n "$CORE_FILES" ]; then
    echo "- 🚨 **核心模块改动**: 涉及 domain/data 层，建议人工 Review" >> "$REVIEW_FILE"
    echo "$CORE_FILES" | sed 's/^/  - /' >> "$REVIEW_FILE"
else
    echo "- ✅ **核心模块**: 未涉及 domain/data 层" >> "$REVIEW_FILE"
fi

# 总结
cat >> "$REVIEW_FILE" << EOF

---

## 审查结论

EOF

# 统计问题数
WARNINGS=$(grep -c "⚠️\|🚨" "$REVIEW_FILE" || echo "0")
ERRORS=$(grep -c "❌" "$REVIEW_FILE" || echo "0")

# 写入总日志
LOG_STATUS="✅ 通过"
LOG_EMOJI="✅"
if [ "$ERRORS" -gt 0 ]; then
    LOG_STATUS="❌ 失败 ($ERRORS 错误, $WARNINGS 警告)"
    LOG_EMOJI="❌"
elif [ "$WARNINGS" -gt 0 ]; then
    LOG_STATUS="⚠️ 警告 ($WARNINGS 个)"
    LOG_EMOJI="⚠️"
fi

# 追加到总日志
echo "- [$(date '+%Y-%m-%d %H:%M')] $LOG_EMOJI 审查 $LOG_STATUS | [$TIMESTAMP](reviews/review_$TIMESTAMP.md) | ${DIFF_RANGE:-暂存区} | $FILES_CHANGED 文件 +$LINES_ADDED -$LINES_DELETED" >> "$REVIEW_LOG"

if [ "$ERRORS" -gt 0 ]; then
    echo "❌ **发现 $ERRORS 个错误，$WARNINGS 个警告，建议修复后再提交**" >> "$REVIEW_FILE"
    echo ""
    echo "❌ 审查完成: 发现 $ERRORS 个错误，$WARNINGS 个警告"
    echo "📄 完整报告: $REVIEW_FILE"
    exit 1
elif [ "$WARNINGS" -gt 0 ]; then
    echo "⚠️ **发现 $WARNINGS 个警告，建议确认后再提交**" >> "$REVIEW_FILE"
    echo ""
    echo "⚠️ 审查完成: 发现 $WARNINGS 个警告"
    echo "📄 完整报告: $REVIEW_FILE"
    exit 0
else
    echo "✅ **全部通过，可以提交**" >> "$REVIEW_FILE"
    echo ""
    echo "✅ 审查完成: 全部通过"
    echo "📄 完整报告: $REVIEW_FILE"
    exit 0
fi
