#!/bin/bash
# 安装 OpenCode 记忆系统

set -e

echo "🔧 安装 OpenCode 记忆系统"
echo "================================================"
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# 1. 确保目录结构
echo "📁 创建目录结构..."
mkdir -p memory/patterns

# 2. 设置权限
echo "🔐 设置执行权限..."
chmod +x .opencode/hooks/pre-commit 2>/dev/null || true
chmod +x .opencode/hooks/post-commit 2>/dev/null || true

# 3. 安装 git hooks（如果 .git 存在）
if [ -d ".git" ]; then
    echo "🔗 安装 Git hooks..."

    # 备份原有 hooks
    if [ -f ".git/hooks/pre-commit" ]; then
        cp .git/hooks/pre-commit .git/hooks/pre-commit.backup.$(date +%s)
    fi

    # 创建复合 hook
    cat > .git/hooks/pre-commit << 'GITHOOK'
#!/bin/bash
# 复合 pre-commit hook

# 运行原有的 pre-commit（如果存在）
if [ -f ".git/hooks/pre-commit.backup" ]; then
    .git/hooks/pre-commit.backup || exit 1
fi
GITHOOK

    chmod +x .git/hooks/pre-commit
    echo "   ✓ pre-commit hook 已安装"
fi

# 4. 验证安装
echo ""
echo "✅ 安装完成!"
echo ""
echo "📂 目录结构:"
tree -L 3 .opencode/ 2>/dev/null || find .opencode -type f | head -20

echo ""
echo "📝 使用方法:"
echo "  查看配置: cat .opencode/config.yaml"
echo "  查看记忆: cat memory/MEMORY.md"
