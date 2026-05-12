#!/bin/bash

# ============================================================
# MCP Memory Service 安装脚本
# ============================================================
# 执行方法：
#   chmod +x scripts/install-mcp-memory.sh
#   scripts/install-mcp-memory.sh
# ============================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PYTHON_PATH="/opt/homebrew/bin/python3.11"

echo "🧠 开始安装 MCP Memory Service..."
echo "📁 项目目录：${PROJECT_ROOT}"
echo "🐍 Python 路径：${PYTHON_PATH}"
echo ""

# 检查 Python 是否存在
if [ ! -f "${PYTHON_PATH}" ]; then
  echo "❌ 错误：未找到 Python 3.11"
  echo "请先运行：brew install python@3.11"
  exit 1
fi

echo "1️⃣  确保 pip 已安装..."
"${PYTHON_PATH}" -m ensurepip --upgrade

echo ""
echo "2️⃣  安装 mcp-memory-service..."
"${PYTHON_PATH}" -m pip install mcp-memory-service

echo ""
echo "✅ MCP Memory Service 安装完成！"
echo ""
echo "📝 下一步："
echo "  1. 编辑 ${PROJECT_ROOT}/.mcp.json"
echo "  2. 将 'memory' 服务的 'disabled' 改为 false"
echo "  3. 重启你的 AI IDE（Trae/OpenCode）"
