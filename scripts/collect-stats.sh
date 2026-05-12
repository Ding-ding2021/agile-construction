#!/bin/bash
# Harness 每任务指标采集脚本
# 被 .opencode/hooks/post-commit 调用
# 产出: memory/stats/$(date +%Y-%m-%d).json

set -eo pipefail

TODAY=$(date +%Y-%m-%d)
STATS_DIR="memory/stats"
STATS_FILE="$STATS_DIR/$TODAY.json"

mkdir -p "$STATS_DIR"

# 采集提交信息
LAST_COMMIT=$(git log -1 --format='%H %s' 2>/dev/null || echo "unknown")

# 采集 git 统计
FILES_CHANGED=$(git diff --name-only HEAD~1 HEAD 2>/dev/null | wc -l | tr -d ' ' || echo 0)
INSERTIONS=$(git diff --stat HEAD~1 HEAD 2>/dev/null | tail -1 | awk '{print $4}' || echo 0)
DELETIONS=$(git diff --stat HEAD~1 HEAD 2>/dev/null | tail -1 | awk '{print $6}' || echo 0)

# 写入 JSON
cat > "$STATS_FILE" << EOF
{
  "date": "$TODAY",
  "timestamp": "$(date '+%Y-%m-%dT%H:%M:%S%z')",
  "commit": "$LAST_COMMIT",
  "files_changed": $FILES_CHANGED,
  "insertions": $INSERTIONS,
  "deletions": $DELETIONS
}
EOF

echo "✅ stats 已采集: $STATS_FILE"
