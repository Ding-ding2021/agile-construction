#!/usr/bin/env python3
"""Harness 飞书通知脚本
用法: ./notify-feishu.sh <标题> [消息内容]
    或: echo "消息" | ./notify-feishu.sh <标题>
环境变量: FEISHU_WEBHOOK_URL (必填)
"""

import json
import os
import sys
import urllib.request
from datetime import datetime

webhook_url = os.environ.get("FEISHU_WEBHOOK_URL", "")

if not webhook_url:
    print("❌ FEISHU_WEBHOOK_URL 未设置")
    print("   配置: 飞书群 → 设置 → 群机器人 → 添加自定义机器人 → 复制 webhook URL")
    print("   GitHub: Settings → Secrets → 添加 FEISHU_WEBHOOK_URL")
    sys.exit(0)

title = sys.argv[1] if len(sys.argv) > 1 else "Harness 通知"

if len(sys.argv) > 2:
    body = sys.argv[2]
else:
    body = sys.stdin.read().strip() if not sys.stdin.isatty() else ""

timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

payload = {
    "msg_type": "interactive",
    "card": {
        "config": {"wide_screen_mode": True},
        "header": {
            "title": {"tag": "plain_text", "content": f"\U0001f4cb {title}"},
            "template": "blue",
        },
        "elements": [
            {"tag": "markdown", "content": body},
            {
                "tag": "note",
                "elements": [
                    {
                        "tag": "plain_text",
                        "content": f"\U0001f550 {timestamp} · Harness 工程框架 · 产品经理：林墨",
                    }
                ],
            },
        ],
    },
}

data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
req = urllib.request.Request(
    webhook_url, data=data, headers={"Content-Type": "application/json; charset=utf-8"}
)

try:
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode("utf-8"))
        if result.get("code") == 0:
            print(f"✅ 飞书通知已发送: {title}")
        else:
            print(f"⚠️ 飞书通知发送异常: {result.get('msg', 'unknown')}")
except Exception as e:
    print(f"⚠️ 飞书通知发送失败: {e}")
