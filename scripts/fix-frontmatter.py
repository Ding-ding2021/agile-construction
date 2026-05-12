#!/usr/bin/env python3
"""
批量统一 docs/ 下所有 Markdown 文件的 Frontmatter 字段。
按 document-governance.md §5 四套模板执行。

安全特性：
- 仅添加缺失字段，不改动已有字段
- 幂等：重复运行不产生额外变更
- 有 dry-run 模式预览变更
"""

import os
import re
import sys
from datetime import date, datetime

DOCS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs")
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TODAY = date.today().isoformat()

# ── 特殊路径覆盖（无法从目录结构推导 domain/category 的文件） ──
PATH_OVERRIDES = {
    "README.md": {"domain": "governance", "category": "doc-governance", "title": "文档索引"},
    "PLAN.md": {"domain": "project", "category": "plan", "title": "项目计划"},
    "ai/README.md": {"domain": "governance", "category": "harness", "title": "AI 上下文索引"},
    "ai/context/state.md": {"domain": "governance", "category": "harness", "status": "active", "title": "AI 上下文状态"},
    "ai/knowledge/patterns.md": {"domain": "governance", "category": "harness", "status": "active", "title": "AI 知识模式库"},
    "ai/knowledge/rules.md": {"domain": "governance", "category": "harness", "status": "active", "title": "AI 规则库"},
    "ai/knowledge/decisions.md": {"domain": "governance", "category": "harness", "status": "active", "title": "AI 决策记录"},
    "00-governance/memory-dual-track-strategy.md": {"domain": "governance", "category": "doc-governance", "title": "记忆双轨策略"},
    "00-governance/cloudflare-setup-guide.md": {"domain": "governance", "category": "guide", "title": "Cloudflare 设置指南"},
}

# 基于文件名的覆盖（适用于 docs/ 外部的文件）
FILENAME_OVERRIDES = {
    "2026-05-12-adaptive-governance-design.md": {"domain": "design", "category": "technical-design", "title": "自适应治理设计"},
}

# 超级权限目录（确保 superpowers/ 下的文件能被扫描）
SUPERPOWERS_DIR = os.path.join(PROJECT_DIR, "superpowers")

# ── 模板定义 ──────────────────────────────────────────

TEMPLATE_A = {
    "fields": {
        "owner": "docs-maintainer",
        "source_of_truth": True,
        "related_code": [],
        "related_docs": [],
    },
    "description": "标准文档（00-governance ~ 05-project）",
}

TEMPLATE_B = {
    "fields": {
        "archived_at": TODAY,
        "archived_reason": "历史归档",
    },
    "description": "归档文档（99-archive）",
}

TEMPLATE_C = {
    "fields": {},
    "description": "AI 合约（docs/ai/contracts/）",
}

TEMPLATE_D = {
    "fields": {
        "generated_at": TODAY,
    },
    "description": "报告（05-project/reports）",
}

# ── 核心逻辑 ──────────────────────────────────────────

def extract_title_from_md(content):
    """从 Markdown 正文提取第一个 # 标题"""
    # 先清除 frontmatter
    body = re.sub(r'^---\n.*?\n---\n', '', content, count=1, flags=re.DOTALL)
    m = re.search(r'^#\s+(.+)', body, re.MULTILINE)
    if m:
        return m.group(1).strip()
    return None


def parse_frontmatter(content):
    """解析 YAML frontmatter 返回 dict，以及前导---的结束位置"""
    m = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not m:
        return {}, 0, content
    yaml_text = m.group(1)
    # 简单 YAML 解析（不使用 yaml 库以避免依赖）
    data = {}
    current_key = None
    current_list = None
    for line in yaml_text.split('\n'):
        # 多行列表项
        list_match = re.match(r'^\s+-\s+(.+)$', line)
        if list_match and current_key:
            if current_list is not None:
                current_list.append(list_match.group(1).strip())
            else:
                current_list = [list_match.group(1).strip()]
                data[current_key] = current_list
            continue
        # 普通键值对
        kv_match = re.match(r'^(\w[\w_]*)\s*:\s*(.*)$', line)
        if kv_match:
            current_key = kv_match.group(1)
            current_list = None
            val = kv_match.group(2).strip()
            if val == '' or val == '[]':
                data[current_key] = [] if val == '[]' else ''
            elif val.lower() == 'true':
                data[current_key] = True
            elif val.lower() == 'false':
                data[current_key] = False
            elif val.startswith('"') and val.endswith('"'):
                data[current_key] = val[1:-1]
            else:
                data[current_key] = val
    return data, m.end(), m.group(0)


def serialize_frontmatter(data, template_type):
    """将 dict 序列化为 YAML frontmatter 格式（保持可读性）"""
    lines = []
    # 定义字段顺序
    if template_type == 'A':
        order = ['id', 'number', 'domain', 'category', 'title', 'owner', 'status', 'last_updated', 'source_of_truth', 'ai_contract', 'related_code', 'related_docs']
    elif template_type == 'B':
        order = ['id', 'number', 'domain', 'category', 'title', 'status', 'last_updated', 'archived_at', 'archived_reason']
    elif template_type == 'C':
        order = ['id', 'human_source', 'status', 'last_synced']
    elif template_type == 'D':
        order = ['title', 'domain', 'category', 'status', 'last_updated', 'generated_at']
    else:
        order = list(data.keys())

    seen = set()
    for key in order:
        if key in data and key not in seen:
            seen.add(key)
            val = data[key]
            if val == '' or val is None:
                continue
            if isinstance(val, bool):
                lines.append(f"{key}: {'true' if val else 'false'}")
            elif isinstance(val, list):
                if val:
                    lines.append(f"{key}:")
                    for item in val:
                        lines.append(f"  - {item}")
                else:
                    lines.append(f"{key}: []")
            else:
                lines.append(f"{key}: {val}")

    # 添加未在 order 中的剩余字段
    for key, val in data.items():
        if key not in seen:
            if val == '' or val is None:
                continue
            if isinstance(val, bool):
                lines.append(f"{key}: {'true' if val else 'false'}")
            elif isinstance(val, list):
                if val:
                    lines.append(f"{key}:")
                    for item in val:
                        lines.append(f"  - {item}")
                else:
                    lines.append(f"{key}: []")
            else:
                lines.append(f"{key}: {val}")

    return '---\n' + '\n'.join(lines) + '\n---'


def determine_template(filepath, existing_data):
    """根据文件路径和已有数据判断使用哪个模板"""
    rel = filepath.replace(DOCS_DIR, '').replace(SUPERPOWERS_DIR, 'superpowers').replace('\\', '/')

    # AI 合约
    if 'ai/contracts' in rel:
        return 'C'
    # 归档
    if '99-archive' in rel:
        return 'B'
    # 报告
    if rel.replace('\\', '/').startswith('05-project') and '/report' in rel.replace('\\', '/').lower():
        return 'D'
    # 默认标准文档
    return 'A'


def slugify(text):
    """将中文/英文标题转为 ID 友好的大写短横格式"""
    s = text.upper()
    s = re.sub(r'[^A-Z0-9\u4e00-\u9fff]+', '-', s)
    s = re.sub(r'[^\x00-\x7f]', '', s)  # 移除中文字符
    s = s.strip('-')
    return s


def get_rel_path(filepath):
    """获取相对于 docs/ 或 project root 的路径"""
    try:
        return os.path.relpath(filepath, DOCS_DIR)
    except ValueError:
        try:
            return os.path.relpath(filepath, PROJECT_DIR)
        except ValueError:
            return os.path.basename(filepath)


def apply_path_overrides(data, filepath):
    """应用特殊路径覆盖"""
    rel = get_rel_path(filepath)
    # 精确匹配
    if rel in PATH_OVERRIDES:
        for k, v in PATH_OVERRIDES[rel].items():
            if k not in data or data[k] == '':
                data[k] = v
        return True
    # 文件名匹配（用于 docs/ 外部的文件）
    basename = os.path.basename(filepath)
    if basename in FILENAME_OVERRIDES:
        for k, v in FILENAME_OVERRIDES[basename].items():
            if k not in data or data[k] == '':
                data[k] = v
        return True
    return False


def infer_missing_fields(data, template_type, filepath, content):
    """推断缺失字段的默认值"""
    changed = False

    # ── 特殊路径覆盖（优先于通用逻辑）──
    if apply_path_overrides(data, filepath):
        changed = True

    # ── status 自动推断 ──
    if 'status' not in data:
        data['status'] = 'active'
        changed = True

    # ── title 从 # 标题提取 ──
    if 'title' not in data:
        title = extract_title_from_md(content)
        if title:
            data['title'] = title
            changed = True

    # ── last_updated ──
    if 'last_updated' not in data:
        data['last_updated'] = TODAY
        changed = True

    if template_type == 'A':
        defaults = TEMPLATE_A["fields"]
        for k, v in defaults.items():
            if k not in data:
                data[k] = v
                changed = True

        # id 自动生成
        if 'id' not in data and 'domain' in data and 'category' in data:
            dom = data['domain'].upper()
            cat = slugify(str(data['category']))
            title_slug = slugify(str(data.get('title', '')))
            data['id'] = f"DOC-{dom}-{cat}-{title_slug}"
            changed = True

        # number 自动生成（占位符）
        if 'number' not in data and 'domain' in data:
            dom_code = {'governance': 'GOV', 'product': 'PRD', 'design': 'DES',
                         'development': 'DEV', 'testing': 'TST', 'project': 'PRJ',
                         'archive': 'ARC'}.get(data['domain'], 'TBD')
            data['number'] = f'{dom_code}-000'
            changed = True

    elif template_type == 'B':
        defaults = TEMPLATE_B["fields"]
        if 'domain' not in data:
            data['domain'] = 'archive'
            changed = True
        if 'category' not in data:
            data['category'] = 'archived'
            changed = True
        if 'status' not in data:
            data['status'] = 'archived'
            changed = True
        for k, v in defaults.items():
            if k not in data:
                data[k] = v
                changed = True
        if 'id' not in data and 'number' in data:
            data['id'] = str(data['number'])
            changed = True

    elif template_type == 'C':
        defaults = TEMPLATE_C["fields"]
        for k, v in defaults.items():
            if k not in data:
                data[k] = v
                changed = True
        if 'status' not in data:
            data['status'] = 'active'
            changed = True
        if 'last_synced' not in data:
            data['last_synced'] = TODAY
            changed = True

    elif template_type == 'D':
        defaults = TEMPLATE_D["fields"]
        for k, v in defaults.items():
            if k not in data:
                data[k] = v
                changed = True
        if 'status' not in data:
            data['status'] = 'active'
            changed = True

    return changed


def has_all_required_fields(data, template_type):
    """检查必填字段是否齐全"""
    if template_type == 'A':
        required = ['id', 'number', 'domain', 'category', 'title', 'owner', 'status', 'last_updated', 'source_of_truth', 'related_code', 'related_docs']
    elif template_type == 'B':
        required = ['id', 'number', 'domain', 'category', 'title', 'status', 'last_updated', 'archived_at', 'archived_reason']
    elif template_type == 'C':
        required = ['id', 'human_source', 'status', 'last_synced']
    elif template_type == 'D':
        required = ['title', 'domain', 'category', 'status', 'last_updated', 'generated_at']
    else:
        return True

    return all(k in data and data[k] != '' for k in required)


def fix_file(filepath, dry_run=True):
    """修复单个文件的 frontmatter"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 解析现有 frontmatter
    data, fm_end, fm_raw = parse_frontmatter(content)
    has_fm = fm_end > 0

    template_type = determine_template(filepath, data)

    changes = []

    # Step 1: 推断缺失字段
    if infer_missing_fields(data, template_type, filepath, content):
        changes.append("添加了缺失字段的默认值")

    # Step 2: 检查是否全部必填字段齐全
    if not has_all_required_fields(data, template_type):
        missing = []
        required_keys = {
            'A': ['id', 'number', 'domain', 'category', 'title', 'owner', 'status', 'last_updated', 'source_of_truth', 'related_code', 'related_docs'],
            'B': ['id', 'number', 'domain', 'category', 'title', 'status', 'last_updated', 'archived_at', 'archived_reason'],
            'C': ['id', 'human_source', 'status', 'last_synced'],
            'D': ['title', 'domain', 'category', 'status', 'last_updated', 'generated_at'],
        }.get(template_type, [])
        for k in required_keys:
            if k not in data or data[k] == '':
                missing.append(k)
        changes.append(f"⚠️ 仍缺字段: {', '.join(missing)} — 需手动处理")

    if not changes:
        return None  # 无变更

    # 生成新 frontmatter
    new_fm = serialize_frontmatter(data, template_type)

    # 替换内容
    if has_fm:
        body = content[fm_end:]
        new_content = new_fm + body
    else:
        new_content = new_fm + '\n' + content

    if dry_run:
        return changes
    else:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return changes


def main():
    dry_run = '--dry-run' in sys.argv
    mode = "DRY RUN（预览）" if dry_run else "实际执行"

    print(f"{'='*60}")
    print(f"  Frontmatter 批量修复 — {mode}")
    print(f"  日期: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'='*60}\n")

    stats = {
        'scanned': 0,
        'fixed': 0,
        'already_ok': 0,
        'still_missing': 0,
        'errors': 0,
    }

    def scan_dir(directory, prefix=""):
        for root, dirs, files in os.walk(directory):
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            for fname in files:
                if not fname.endswith('.md'):
                    continue
                fpath = os.path.join(root, fname)
                stats['scanned'] += 1
                try:
                    result = fix_file(fpath, dry_run=dry_run)
                    if result is None:
                        stats['already_ok'] += 1
                    else:
                        stats['fixed'] += 1
                        has_warning = any('⚠️' in r for r in result)
                        if has_warning:
                            stats['still_missing'] += 1
                        rel = os.path.relpath(fpath, DOCS_DIR)
                        if prefix:
                            rel = f"{prefix}/{rel}"
                        print(f"  [{'+' if not has_warning else '!'}] {rel}")
                        for line in result:
                            print(f"      {line}")
                except Exception as e:
                    stats['errors'] += 1
                    print(f"  [E] {os.path.relpath(fpath, DOCS_DIR) if not prefix else fpath}: {e}")

    scan_dir(DOCS_DIR)

    # 扫描 superpowers/
    if os.path.isdir(SUPERPOWERS_DIR):
        scan_dir(SUPERPOWERS_DIR, prefix="..")

    print(f"\n{'─'*40}")
    print(f"  扫描: {stats['scanned']} 个文件")
    print(f"  已达标: {stats['already_ok']} 个（无需变更）")
    print(f"  已修复: {stats['fixed']} 个")
    print(f"  仍有缺失: {stats['still_missing']} 个（需人工处理）")
    print(f"  错误: {stats['errors']} 个")
    print(f"{'─'*40}")

    if dry_run and stats['fixed'] > 0:
        print(f"\n  这是预览模式。加 --apply 参数执行实际写入。")

    return 0 if stats['errors'] == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
