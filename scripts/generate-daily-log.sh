#!/bin/bash
# ============================================================
# 每日项目日志生成脚本
# 工作区: /Users/dylan/CodeBuddy/agile-construction
# 输出目录: memory/（已从 .codebuddy/daily-logs/ 迁移）
# ============================================================

set -e

WORKSPACE="/Users/dylan/CodeBuddy/agile-construction"
LOG_DIR="$WORKSPACE/memory"
MEMORY_DIR="$WORKSPACE/memory"
DATE=$(date +%Y-%m-%d)
YESTERDAY=$(date -v-1d +%Y-%m-%d 2>/dev/null || date -d "yesterday" +%Y-%m-%d)
LOG_FILE="$LOG_DIR/$DATE.md"

echo "📋 生成项目日志: $DATE"

# 创建日志目录
mkdir -p "$LOG_DIR"

# 收集 git 数据
cd "$WORKSPACE"

# 昨日提交记录
YESTERDAY_COMMITS=$(git log --since="$YESTERDAY 00:00" --until="$DATE 00:00" --pretty=format:"- \`%h\` %s (%an)" 2>/dev/null || echo "无提交记录")
if [ -z "$YESTERDAY_COMMITS" ]; then
    YESTERDAY_COMMITS="无提交记录"
fi

# 代码变更统计
CHANGE_STATS=$(git diff --shortstat HEAD~1 HEAD 2>/dev/null || echo "无法获取变更统计")

# 工作区状态
WORKSPACE_STATUS=$(git status --short 2>/dev/null || echo "非 git 仓库")
if [ -z "$WORKSPACE_STATUS" ]; then
    WORKSPACE_STATUS="工作区干净，无未提交更改"
fi

# 源文件统计
SRC_FILES=$(find src -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l | tr -d ' ')
CSS_FILES=$(find src -name "*.css" 2>/dev/null | wc -l | tr -d ' ')

# 读取今日工作记忆
TODAY_MEMORY=""
if [ -f "$MEMORY_DIR/$DATE.md" ]; then
    TODAY_MEMORY=$(cat "$MEMORY_DIR/$DATE.md")
else
    TODAY_MEMORY="今日暂无工作记录。"
fi

# 生成日志内容
cat > "$LOG_FILE" << EOF
# 项目日志 $DATE

> 自动生成于 $(date '+%Y-%m-%d %H:%M:%S')

---

## 代码活动

### 昨日提交 ($YESTERDAY)
$YESTERDAY_COMMITS

### 变更统计
$CHANGE_STATS

---

## 工作区状态

\`\`\`
$WORKSPACE_STATUS
\`\`\`

---

## 项目指标

| 指标 | 数值 |
|------|------|
| TypeScript/TSX 源文件 | $SRC_FILES 个 |
| CSS 文件 | $CSS_FILES 个 |
| 当前分支 | $(git branch --show-current 2>/dev/null || echo "N/A") |
| 最近提交 | $(git log -1 --pretty=format:"%h %s" 2>/dev/null || echo "N/A") |

---

## 今日工作要点

$TODAY_MEMORY

---

## 明日建议

$(if [ -n "$(git status --short 2>/dev/null)" ]; then echo "⚠️ 工作区存在未提交更改，建议优先处理。"; else echo "✅ 工作区干净，可继续推进下一任务。"; fi)

EOF

echo "✅ 日志已生成: $LOG_FILE"
