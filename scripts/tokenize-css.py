#!/usr/bin/env python3
"""
P1.5-T2 CSS Token 治理脚本
- 扩展 :root Token 体系
- 批量替换 index.css 中的高频硬编码颜色为变量引用
- 跳过 :root 块内的定义（避免自引用）
"""

import re
from pathlib import Path

CSS_PATH = Path("/Users/dylan/CodeBuddy/agile-construction/src/index.css")

# ========== 新增变量定义 ==========
# 按语义分组，保持命名一致性
NEW_TOKENS = """
  --pm-primary-light: #1a5ae8;
  --pm-primary-dark: #1248c5;

  --pm-text-92: rgba(255, 255, 255, 0.92);
  --pm-text-85: rgba(255, 255, 255, 0.85);
  --pm-text-62: rgba(255, 255, 255, 0.62);
  --pm-text-55: rgba(255, 255, 255, 0.55);
  --pm-text-45: rgba(255, 255, 255, 0.45);
  --pm-text-15: rgba(255, 255, 255, 0.15);
  --pm-text-14: rgba(255, 255, 255, 0.14);
  --pm-text-12: rgba(255, 255, 255, 0.12);
  --pm-text-10: rgba(255, 255, 255, 0.1);
  --pm-text-8: rgba(255, 255, 255, 0.08);
  --pm-text-2: rgba(255, 255, 255, 0.02);
  --pm-border-medium: rgba(255, 255, 255, 0.2);

  --pm-blue-35: rgba(43, 127, 255, 0.35);
  --pm-blue-30: rgba(43, 127, 255, 0.3);
  --pm-blue-25: rgba(43, 127, 255, 0.25);
  --pm-blue-20: rgba(43, 127, 255, 0.2);
  --pm-blue-15: rgba(43, 127, 255, 0.15);
  --pm-blue-12: rgba(43, 127, 255, 0.12);
  --pm-blue-10: rgba(43, 127, 255, 0.1);
  --pm-blue-8: rgba(43, 127, 255, 0.08);
  --pm-blue-5: rgba(43, 127, 255, 0.05);

  --pm-green-25: rgba(0, 188, 125, 0.25);
  --pm-green-20: rgba(0, 188, 125, 0.2);
  --pm-green-15: rgba(0, 188, 125, 0.15);
  --pm-green-12: rgba(0, 188, 125, 0.12);
  --pm-green-5: rgba(0, 188, 125, 0.05);

  --pm-orange-25: rgba(254, 154, 0, 0.25);
  --pm-orange-20: rgba(254, 154, 0, 0.2);
  --pm-orange-15: rgba(254, 154, 0, 0.15);
  --pm-gold-15: rgba(255, 185, 0, 0.15);

  --pm-red: #ff6467;
  --pm-red-30: rgba(251, 44, 54, 0.3);
  --pm-red-25: rgba(251, 44, 54, 0.25);
  --pm-red-20: rgba(251, 44, 54, 0.2);
  --pm-red-15: rgba(251, 44, 54, 0.15);

  --pm-shadow-color: rgba(0, 0, 0, 0.1);
  --pm-primary-shadow-50: rgba(28, 57, 142, 0.5);
  --pm-primary-shadow-30: rgba(28, 57, 142, 0.3);
  --pm-sidebar-bg-solid: rgba(10, 35, 99, 0.98);
  --pm-bg-alpha-95: rgba(5, 19, 56, 0.95);
""".strip()

# ========== 替换映射表 ==========
# 键: 正则模式（匹配各种空格格式）
# 值: 替换后的 var(--token)
# 注意：按从长到短/从具体到一般的顺序排列，避免误替换
REPLACEMENTS = [
    # 白色透明度阶梯（长格式优先）
    (r'rgba\(255,\s*255,\s*255,\s*0\.92\)', 'var(--pm-text-92)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.85\)', 'var(--pm-text-85)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.7\)', 'var(--pm-text-70)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.62\)', 'var(--pm-text-62)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.6\)', 'var(--pm-text-60)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.55\)', 'var(--pm-text-55)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.5\)', 'var(--pm-text-50)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.45\)', 'var(--pm-text-45)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.4\)', 'var(--pm-text-40)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.3\)', 'var(--pm-text-30)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.25\)', 'var(--pm-text-25)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.15\)', 'var(--pm-text-15)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.14\)', 'var(--pm-text-14)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.12\)', 'var(--pm-text-12)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.1\)', 'var(--pm-text-10)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.08\)', 'var(--pm-border)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.06\)', 'var(--pm-element-hover)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.05\)', 'var(--pm-border-light)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.04\)', 'var(--pm-card)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.03\)', 'var(--pm-element)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.02\)', 'var(--pm-bg-overlay)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.2\)', 'var(--pm-border-medium)'),

    # 蓝色阶梯
    (r'rgba\(43,\s*127,\s*255,\s*0\.35\)', 'var(--pm-blue-35)'),
    (r'rgba\(43,\s*127,\s*255,\s*0\.3\)', 'var(--pm-blue-30)'),
    (r'rgba\(43,\s*127,\s*255,\s*0\.25\)', 'var(--pm-blue-25)'),
    (r'rgba\(43,\s*127,\s*255,\s*0\.2\)', 'var(--pm-blue-20)'),
    (r'rgba\(43,\s*127,\s*255,\s*0\.15\)', 'var(--pm-blue-15)'),
    (r'rgba\(43,\s*127,\s*255,\s*0\.12\)', 'var(--pm-blue-12)'),
    (r'rgba\(43,\s*127,\s*255,\s*0\.1\)', 'var(--pm-blue-10)'),
    (r'rgba\(43,\s*127,\s*255,\s*0\.08\)', 'var(--pm-blue-8)'),
    (r'rgba\(43,\s*127,\s*255,\s*0\.05\)', 'var(--pm-blue-5)'),

    # 绿色阶梯
    (r'rgba\(0,\s*188,\s*125,\s*0\.25\)', 'var(--pm-green-25)'),
    (r'rgba\(0,\s*188,\s*125,\s*0\.2\)', 'var(--pm-green-20)'),
    (r'rgba\(0,\s*188,\s*125,\s*0\.15\)', 'var(--pm-green-15)'),
    (r'rgba\(0,\s*188,\s*125,\s*0\.12\)', 'var(--pm-green-12)'),
    (r'rgba\(0,\s*188,\s*125,\s*0\.05\)', 'var(--pm-green-5)'),

    # 橙色/金色阶梯
    (r'rgba\(254,\s*154,\s*0,\s*0\.25\)', 'var(--pm-orange-25)'),
    (r'rgba\(254,\s*154,\s*0,\s*0\.2\)', 'var(--pm-orange-20)'),
    (r'rgba\(254,\s*154,\s*0,\s*0\.15\)', 'var(--pm-orange-15)'),
    (r'rgba\(255,\s*185,\s*0,\s*0\.15\)', 'var(--pm-gold-15)'),

    # 红色阶梯
    (r'rgba\(251,\s*44,\s*54,\s*0\.3\)', 'var(--pm-red-30)'),
    (r'rgba\(251,\s*44,\s*54,\s*0\.25\)', 'var(--pm-red-25)'),
    (r'rgba\(251,\s*44,\s*54,\s*0\.2\)', 'var(--pm-red-20)'),
    (r'rgba\(251,\s*44,\s*54,\s*0\.15\)', 'var(--pm-red-15)'),

    # 阴影/主色
    (r'rgba\(0,\s*0,\s*0,\s*0\.1\)', 'var(--pm-shadow-color)'),
    (r'rgba\(28,\s*57,\s*142,\s*0\.5\)', 'var(--pm-primary-shadow-50)'),
    (r'rgba\(28,\s*57,\s*142,\s*0\.3\)', 'var(--pm-primary-shadow-30)'),
    (r'rgba\(10,\s*35,\s*99,\s*0\.98\)', 'var(--pm-sidebar-bg-solid)'),
    (r'rgba\(5,\s*19,\s*56,\s*0\.95\)', 'var(--pm-bg-alpha-95)'),

    # Hex 品牌色（大小写不敏感）
    (r'#ff6467', 'var(--pm-red)'),
    (r'#ffb900', 'var(--pm-orange-gold)'),
    (r'#00d492', 'var(--pm-green-light)'),
    (r'#51a2ff', 'var(--pm-blue-light)'),
    (r'#154dd9', 'var(--pm-primary)'),
    (r'#1a5ae8', 'var(--pm-primary-light)'),
    (r'#1248c5', 'var(--pm-primary-dark)'),
    (r'#2b7fff', 'var(--pm-blue)'),
    (r'#fe9a00', 'var(--pm-orange)'),
    (r'#8e51ff', 'var(--pm-purple)'),
    (r'#a684ff', 'var(--pm-purple-light)'),
    (r'#00bc7d', 'var(--pm-green)'),
    (r'#ffffff', 'var(--pm-text-white)'),
    (r'#fff\b', 'var(--pm-text-white)'),
    # 避免替换 white-space 属性名和已包裹在 var() 中的 white
    (r'(?<!var\(--pm-text-)\bwhite\b(?!-space)', 'var(--pm-text-white)'),

    # 恢复 input-bg 为变量引用
    (r'--pm-input-bg:\s*rgba\(255,\s*255,\s*255,\s*0\.05\)', '--pm-input-bg: var(--pm-border-light)'),
]


def process_css(content: str) -> str:
    lines = content.splitlines(keepends=True)

    # 找到 :root 块的范围
    root_start = None
    root_end = None
    brace_depth = 0
    for i, line in enumerate(lines):
        if ':root {' in line or ':root{' in line:
            root_start = i
            brace_depth = 1
            continue
        if root_start is not None and root_end is None:
            brace_depth += line.count('{') - line.count('}')
            if brace_depth == 0:
                root_end = i
                break

    if root_start is None or root_end is None:
        raise ValueError("Could not find :root block")

    # 在 :root 块内插入新变量（在末尾 } 之前）
    root_body = lines[root_start:root_end + 1]
    # 找到 root 块中最后一行非空变量定义的位置
    insert_pos = root_end
    for i in range(root_end - 1, root_start, -1):
        stripped = lines[i].strip()
        if stripped and not stripped.startswith('}'):
            insert_pos = i + 1
            break

    new_lines = lines[:insert_pos] + ['\n  /* ===== 扩展 Token（P1.5-T2） ===== */\n'] + [NEW_TOKENS + '\n'] + lines[insert_pos:]

    # 重新计算 root_end 偏移
    offset = 2  # 插入了两行
    root_end += offset

    # 对整个文件（除了 :root 块）执行替换
    result_lines = []
    for i, line in enumerate(new_lines):
        if root_start <= i <= root_end:
            result_lines.append(line)
            continue

        new_line = line
        for pattern, replacement in REPLACEMENTS:
            # 使用 re.IGNORECASE 对 hex 颜色
            flags = re.IGNORECASE if pattern.startswith('#') else 0
            new_line = re.sub(pattern, replacement, new_line, flags=flags)
        result_lines.append(new_line)

    return ''.join(result_lines)


def main():
    content = CSS_PATH.read_text(encoding='utf-8')
    new_content = process_css(content)
    CSS_PATH.write_text(new_content, encoding='utf-8')

    # 统计替换效果
    old_colors = len(re.findall(r'rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|\bwhite\b', content))
    new_colors = len(re.findall(r'rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|\bwhite\b', new_content))
    print(f"硬编码颜色值: {old_colors} → {new_colors} (减少 {old_colors - new_colors})")


if __name__ == '__main__':
    main()
