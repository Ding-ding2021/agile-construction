#!/bin/bash
# Harness 飞书通知脚本
# 用法: ./notify-feishu.sh <标题> <消息内容>
# 环境变量: FEISHU_WEBHOOK_URL (必填，从 GitHub Secrets 或本地环境读取)

set -euo pipefail

TITLE="${1:-Harness 通知}"
BODY="${2:-}"

if [ -z "${FEISHU_WEBHOOK_URL:-}" ]; then
  echo "❌ FEISHU_WEBHOOK_URL 未设置。请在飞书群中添加自定义机器人并配置此环境变量。"
  echo "   配置步骤：飞书群 → 设置 → 群机器人 → 添加自定义机器人 → 复制 webhook URL"
  echo "   GitHub: Settings → Secrets → 添加 FEISHU_WEBHOOK_URL"
  exit 0
fi

# 读取 stdin 作为消息体（如果未通过参数传入）
if [ -z "$BODY" ]; then
  BODY=$(cat)
fi

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# 构建飞书卡片消息 JSON
MESSAGE_JSON=$(cat <<EOF
{
  "msg_type": "interactive",
  "card": {
    "config": { "wide_screen_mode": true },
    "header": {
      "title": { "tag": "plain_text", "content": "📋 $TITLE" },
      "template": "blue"
    },
    "elements": [
      {
        "tag": "markdown",
        "content": "$(echo "$BODY" | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')"
      },
      {
        "tag": "note",
        "elements": [
          { "tag": "plain_text", "content": "🕐 $TIMESTAMP · Harness 工程框架 · 产品经理：林墨" }
        ]
      }
    ]
  }
}
EOF
)

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$FEISHU_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$MESSAGE_JSON")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY_RESP=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ 飞书通知已发送: $TITLE"
else
  echo "⚠️ 飞书通知发送失败 (HTTP $HTTP_CODE): $BODY_RESP"
fi
