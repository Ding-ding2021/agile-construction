#!/bin/bash
# 安装 OpenCode 记忆系统

set -e

echo "🔧 安装 OpenCode ↔ Workbuddy 双向记忆同步系统"
echo "================================================"
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# 1. 确保目录结构
echo "📁 创建目录结构..."
mkdir -p .opencode/memory/patterns
mkdir -p .opencode/scripts
mkdir -p .opencode/hooks

# 2. 设置权限
echo "🔐 设置执行权限..."
chmod +x .opencode/scripts/sync-memory.sh
chmod +x .opencode/hooks/pre-commit 2>/dev/null || true
chmod +x .opencode/hooks/post-commit 2>/dev/null || true

# 3. 安装 git hooks（如果 .git 存在）
if [ -d ".git" ]; then
    echo "🔗 安装 Git hooks..."
    
    # 备份原有 hooks
    if [ -f ".git/hooks/pre-commit" ]; then
        cp .git/hooks/pre-commit .git/hooks/pre-commit.backup.$(date +%s)
    fi
    
    # 创建复合 hook（保留原有功能 + 添加同步）
    cat > .git/hooks/pre-commit << 'GITHOOK'
#!/bin/bash
# 复合 pre-commit hook

# 1. 运行原有的 pre-commit（如果存在）
if [ -f ".git/hooks/pre-commit.backup" ]; then
    .git/hooks/pre-commit.backup || exit 1
fi

# 2. 运行记忆同步
if [ -f ".opencode/scripts/sync-memory.sh" ]; then
    echo "🔄 同步记忆系统..."
    .opencode/scripts/sync-memory.sh both
fi
GITHOOK
    
    chmod +x .git/hooks/pre-commit
    echo "   ✓ pre-commit hook 已安装"
fi

# 4. 首次同步
echo "🔄 执行首次同步..."
if [ -f ".opencode/scripts/sync-memory.sh" ]; then
    .opencode/scripts/sync-memory.sh both
fi

# 5. 验证安装
echo ""
echo "✅ 安装完成!"
echo ""
echo "📂 目录结构:"
tree -L 3 .opencode/ 2>/dev/null || find .opencode -type f | head -20

echo ""
echo "📝 使用方法:"
echo "  手动同步: ./.opencode/scripts/sync-memory.sh"
echo "  查看配置: cat .opencode/config.yaml"
echo "  查看记忆: cat .opencode/memory/MEMORY.md"
