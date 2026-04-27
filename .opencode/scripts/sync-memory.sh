#!/bin/bash
# OpenCode ↔ Workbuddy 双向记忆同步脚本
# 用法: ./.opencode/scripts/sync-memory.sh [both|to-opencode|to-workbuddy]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

WORKBUDDY_MEMORY="${PROJECT_ROOT}/.workbuddy/memory"
OPENCODE_MEMORY="${PROJECT_ROOT}/.opencode/memory"
SYNC_LOG="${PROJECT_ROOT}/.opencode/memory/.sync-log"
DIRECTION="${1:-both}"

echo "🔄 OpenCode ↔ Workbuddy 记忆同步"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

mkdir -p "${WORKBUDDY_MEMORY}"
mkdir -p "${OPENCODE_MEMORY}"

log_sync() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "${SYNC_LOG}"
}

# 同步 MEMORY.md（双向）
sync_memory_md() {
    local wb_file="${WORKBUDDY_MEMORY}/MEMORY.md"
    local oc_file="${OPENCODE_MEMORY}/MEMORY.md"
    
    if [[ ! -f "$wb_file" && ! -f "$oc_file" ]]; then
        echo "⚠️  MEMORY.md 不存在，跳过"
        return
    fi
    
    # 复制缺失的文件
    if [[ ! -f "$wb_file" && -f "$oc_file" ]]; then
        cp "$oc_file" "$wb_file"
        echo "📥 Workbuddy MEMORY.md ← OpenCode"
        log_sync "CREATE: Workbuddy MEMORY.md from OpenCode"
        return
    fi
    
    if [[ ! -f "$oc_file" && -f "$wb_file" ]]; then
        cp "$wb_file" "$oc_file"
        echo "📥 OpenCode MEMORY.md ← Workbuddy"
        log_sync "CREATE: OpenCode MEMORY.md from Workbuddy"
        return
    fi
    
    # 比较修改时间
    local wb_mtime=$(stat -f %m "$wb_file" 2>/dev/null || stat -c %Y "$wb_file" 2>/dev/null)
    local oc_mtime=$(stat -f %m "$oc_file" 2>/dev/null || stat -c %Y "$oc_file" 2>/dev/null)
    
    if [[ $wb_mtime -gt $oc_mtime ]]; then
        cp "$wb_file" "$oc_file"
        echo "📥 OpenCode MEMORY.md ← Workbuddy"
        log_sync "UPDATE: OpenCode MEMORY.md from Workbuddy"
    elif [[ $oc_mtime -gt $wb_mtime ]]; then
        cp "$oc_file" "$wb_file"
        echo "📤 Workbuddy MEMORY.md ← OpenCode"
        log_sync "UPDATE: Workbuddy MEMORY.md from OpenCode"
    else
        echo "✅ MEMORY.md 已同步"
    fi
}

# 同步每日日志（单向: Workbuddy → OpenCode）
sync_daily_logs() {
    local count=0
    for wb_file in "${WORKBUDDY_MEMORY}"/2026-*.md; do
        [[ -f "$wb_file" ]] || continue
        local filename=$(basename "$wb_file")
        local oc_file="${OPENCODE_MEMORY}/${filename}"
        
        if [[ ! -f "$oc_file" ]]; then
            cp "$wb_file" "$oc_file"
            echo "📥 OpenCode ${filename} ← Workbuddy"
            log_sync "CREATE: OpenCode ${filename} from Workbuddy"
            ((count++))
        fi
    done
    
    if [[ $count -eq 0 ]]; then
        echo "✅ 每日日志已同步"
    else
        echo "✅ 已同步 ${count} 个日志文件"
    fi
}

# 执行同步
case $DIRECTION in
    "to-opencode")
        sync_memory_md
        sync_daily_logs
        ;;
    "to-workbuddy")
        if [[ -f "${OPENCODE_MEMORY}/MEMORY.md" ]]; then
            cp "${OPENCODE_MEMORY}/MEMORY.md" "${WORKBUDDY_MEMORY}/MEMORY.md"
            echo "📤 Workbuddy MEMORY.md ← OpenCode"
        fi
        ;;
    *)
        sync_memory_md
        sync_daily_logs
        ;;
esac

echo ""
echo "✨ 同步完成"
