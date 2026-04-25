#!/bin/bash
# 自动提交脚本 — 带核心模块保护

set -e

REPO="/Users/dylan/CodeBuddy/agile-construction"
LOG="$REPO/.codebuddy/auto-commit-log.md"

cd "$REPO" || exit 1

# 检查是否有未提交改动
if [ -z "$(git status --porcelain)" ]; then
    echo "$(date '+%H:%M') 无改动，跳过"
    exit 0
fi

# 获取改动文件列表
CHANGED_FILES=$(git status --porcelain | awk '{print $2}')
FILE_COUNT=$(echo "$CHANGED_FILES" | wc -l | tr -d ' ')

# 核心模块保护：domain/ data/ 层改动需人工确认
CORE_FILES=$(echo "$CHANGED_FILES" | grep -E "^src/(domain|data)/" || true)

if [ -n "$CORE_FILES" ]; then
    echo "⚠️  $(date '+%H:%M') 检测到核心模块改动，跳过自动提交"
    echo "    涉及文件:"
    echo "$CORE_FILES" | sed 's/^/      - /'

    echo "- [$(date '+%Y-%m-%d %H:%M')] ⏸️ 跳过：核心模块改动" >> "$LOG"
    echo "  文件:" >> "$LOG"
    echo "$CORE_FILES" | sed 's/^/  - /' >> "$LOG"
    exit 0
fi

# 根据文件类型推断提交类型
TYPE="chore"
if echo "$CHANGED_FILES" | grep -qE "\.(ts|tsx)$"; then
    TYPE="feat"
fi
if echo "$CHANGED_FILES" | grep -qE "\.(css|scss)$"; then
    TYPE="style"
fi
if echo "$CHANGED_FILES" | grep -qE "\.md$"; then
    TYPE="docs"
fi

# 生成提交信息
TIME=$(date '+%Y-%m-%d %H:%M')
MSG="$TYPE: auto-save at $TIME ($FILE_COUNT files)"

# 执行提交
git add .
git commit -m "$MSG"
git push origin main 2>/dev/null || echo "推送失败，可能无远程仓库"

# 记录日志
echo "- [$TIME] ✅ $MSG" >> "$LOG"
echo "  文件: $(echo "$CHANGED_FILES" | tr '\n' ' ')" >> "$LOG"

echo "✅  $(date '+%H:%M') 已提交: $MSG"
