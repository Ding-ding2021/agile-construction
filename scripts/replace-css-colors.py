#!/usr/bin/env python3
"""
P1-T2 CSS 硬编码色值批量替换脚本
用法: python3 scripts/replace-css-colors.py
"""

import re
from pathlib import Path

# 项目根目录
ROOT = Path(__file__).parent.parent
SRC = ROOT / "src"
INDEX_CSS = SRC / "index.css"

# 颜色 → CSS 变量映射（按匹配优先级排序，长的先匹配）
COLOR_MAP = {
    # 文本色阶
    "rgba(255, 255, 255, 0.92)": "var(--pm-text-92)",
    "rgba(255, 255, 255, 0.85)": "var(--pm-text-85)",
    "rgba(255, 255, 255, 0.70)": "var(--pm-text-70)",
    "rgba(255, 255, 255, 0.62)": "var(--pm-text-62)",
    "rgba(255, 255, 255, 0.60)": "var(--pm-text-60)",
    "rgba(255, 255, 255, 0.55)": "var(--pm-text-55)",
    "rgba(255, 255, 255, 0.50)": "var(--pm-text-50)",
    "rgba(255, 255, 255, 0.45)": "var(--pm-text-45)",
    "rgba(255, 255, 255, 0.40)": "var(--pm-text-40)",
    "rgba(255, 255, 255, 0.30)": "var(--pm-text-30)",
    "rgba(255, 255, 255, 0.25)": "var(--pm-text-25)",
    "rgba(255, 255, 255, 0.15)": "var(--pm-text-15)",
    "rgba(255, 255, 255, 0.14)": "var(--pm-text-14)",
    "rgba(255, 255, 255, 0.12)": "var(--pm-text-12)",
    "rgba(255, 255, 255, 0.08)": "var(--pm-border)",
    "rgba(255, 255, 255, 0.06)": "var(--pm-element-hover)",
    "rgba(255, 255, 255, 0.05)": "var(--pm-border-light)",
    "rgba(255, 255, 255, 0.04)": "var(--pm-card)",
    "rgba(255, 255, 255, 0.03)": "var(--pm-element)",

    # 品牌/功能色
    "rgba(43, 127, 255, 0.35)": "var(--pm-blue-35)",
    "rgba(43, 127, 255, 0.25)": "var(--pm-blue-25)",
    "rgba(43, 127, 255, 0.2)": "var(--pm-blue-20)",
    "rgba(43, 127, 255, 0.18)": "var(--pm-blue-18)",
    "rgba(43, 127, 255, 0.16)": "var(--pm-blue-16)",
    "rgba(43, 127, 255, 0.15)": "var(--pm-blue-15)",
    "rgba(43, 127, 255, 0.12)": "var(--pm-blue-12)",
    "rgba(43, 127, 255, 0.1)": "var(--pm-blue-10)",
    "rgba(43, 127, 255, 0.08)": "var(--pm-blue-8)",
    "rgba(43, 127, 255, 0.05)": "var(--pm-blue-5)",

    "rgba(0, 188, 125, 0.25)": "var(--pm-green-25)",
    "rgba(0, 188, 125, 0.2)": "var(--pm-green-20)",
    "rgba(0, 188, 125, 0.15)": "var(--pm-green-15)",
    "rgba(0, 188, 125, 0.12)": "var(--pm-green-12)",
    "rgba(0, 188, 125, 0.05)": "var(--pm-green-5)",

    "rgba(254, 154, 0, 0.25)": "var(--pm-orange-25)",
    "rgba(254, 154, 0, 0.2)": "var(--pm-orange-20)",
    "rgba(254, 154, 0, 0.15)": "var(--pm-orange-15)",
    "rgba(254, 154, 0, 0.14)": "var(--pm-orange-14)",
    "rgba(254, 154, 0, 0.1)": "var(--pm-orange-10)",

    "rgba(142, 81, 255, 0.25)": "var(--pm-purple-25)",
    "rgba(142, 81, 255, 0.2)": "var(--pm-purple-20)",
    "rgba(142, 81, 255, 0.15)": "var(--pm-purple-15)",
    "rgba(142, 81, 255, 0.05)": "var(--pm-purple-5)",

    "rgba(251, 44, 54, 0.2)": "var(--pm-red-20)",
    "rgba(251, 44, 54, 0.15)": "var(--pm-red-15)",
    "rgba(251, 44, 54, 0.12)": "var(--pm-red-12)",
    "rgba(251, 44, 54, 0.1)": "var(--pm-red-10)",

    "rgba(21, 77, 217, 0.15)": "var(--pm-primary-15)",
    "rgba(70, 137, 234, 0.08)": "var(--pm-primary-light-8)",
    "rgba(81, 162, 255, 0.5)": "var(--pm-blue-light-50)",
    "rgba(81, 162, 255, 0.45)": "var(--pm-blue-light-45)",
    "rgba(0, 184, 219, 0.25)": "var(--pm-cyan-25)",
    "rgba(219, 234, 254, 0.6)": "var(--pm-nav-color)",

    # 阴影
    "rgba(0, 0, 0, 0.1)": "var(--pm-shadow-10)",
    "rgba(28, 57, 142, 0.3)": "var(--pm-primary-shadow-30)",
    "rgba(28, 57, 142, 0.5)": "var(--pm-primary-shadow-50)",
    "rgba(21, 77, 217, 0.35)": "var(--pm-primary-shadow-35)",

    # 十六进制
    "#00d492": "var(--pm-green-light)",
    "#00bc7d": "var(--pm-green)",
    "#2b7fff": "var(--pm-blue)",
    "#51a2ff": "var(--pm-blue-light)",
    "#8e51ff": "var(--pm-purple)",
    "#a684ff": "var(--pm-purple-light)",
    "#fe9a00": "var(--pm-orange)",
    "#ffb900": "var(--pm-orange-gold)",
    "#154dd9": "var(--pm-primary)",
    "#ff6467": "var(--pm-red-light)",
    "#dceaff": "var(--pm-blue-very-light)",
    "#00d3f3": "var(--pm-cyan)",
    "#051338": "var(--pm-bg)",
}

# 需要新增到 index.css 的变量定义
NEW_VARIABLES = """
  /* ===== 新增文本色阶 ===== */
  --pm-text-92: rgba(255, 255, 255, 0.92);
  --pm-text-85: rgba(255, 255, 255, 0.85);
  --pm-text-62: rgba(255, 255, 255, 0.62);
  --pm-text-55: rgba(255, 255, 255, 0.55);
  --pm-text-45: rgba(255, 255, 255, 0.45);
  --pm-text-15: rgba(255, 255, 255, 0.15);
  --pm-text-14: rgba(255, 255, 255, 0.14);
  --pm-text-12: rgba(255, 255, 255, 0.12);

  /* ===== 新增品牌/功能色透明度 ===== */
  --pm-blue-35: rgba(43, 127, 255, 0.35);
  --pm-blue-25: rgba(43, 127, 255, 0.25);
  --pm-blue-20: rgba(43, 127, 255, 0.20);
  --pm-blue-18: rgba(43, 127, 255, 0.18);
  --pm-blue-16: rgba(43, 127, 255, 0.16);
  --pm-blue-15: rgba(43, 127, 255, 0.15);
  --pm-blue-12: rgba(43, 127, 255, 0.12);
  --pm-blue-10: rgba(43, 127, 255, 0.10);
  --pm-blue-8: rgba(43, 127, 255, 0.08);
  --pm-blue-5: rgba(43, 127, 255, 0.05);
  --pm-blue-very-light: #dceaff;

  --pm-green-25: rgba(0, 188, 125, 0.25);
  --pm-green-20: rgba(0, 188, 125, 0.20);
  --pm-green-15: rgba(0, 188, 125, 0.15);
  --pm-green-12: rgba(0, 188, 125, 0.12);
  --pm-green-5: rgba(0, 188, 125, 0.05);

  --pm-orange-25: rgba(254, 154, 0, 0.25);
  --pm-orange-20: rgba(254, 154, 0, 0.20);
  --pm-orange-15: rgba(254, 154, 0, 0.15);
  --pm-orange-14: rgba(254, 154, 0, 0.14);
  --pm-orange-10: rgba(254, 154, 0, 0.10);

  --pm-purple-25: rgba(142, 81, 255, 0.25);
  --pm-purple-20: rgba(142, 81, 255, 0.20);
  --pm-purple-15: rgba(142, 81, 255, 0.15);
  --pm-purple-5: rgba(142, 81, 255, 0.05);

  --pm-red-20: rgba(251, 44, 54, 0.20);
  --pm-red-15: rgba(251, 44, 54, 0.15);
  --pm-red-12: rgba(251, 44, 54, 0.12);
  --pm-red-10: rgba(251, 44, 54, 0.10);
  --pm-red-light: #ff6467;

  --pm-primary-15: rgba(21, 77, 217, 0.15);
  --pm-primary-light-8: rgba(70, 137, 234, 0.08);
  --pm-blue-light-50: rgba(81, 162, 255, 0.50);
  --pm-blue-light-45: rgba(81, 162, 255, 0.45);
  --pm-cyan-25: rgba(0, 184, 219, 0.25);
  --pm-cyan: #00d3f3;

  /* ===== 阴影变量 ===== */
  --pm-shadow-10: rgba(0, 0, 0, 0.10);
  --pm-primary-shadow-30: rgba(28, 57, 142, 0.30);
  --pm-primary-shadow-50: rgba(28, 57, 142, 0.50);
  --pm-primary-shadow-35: rgba(21, 77, 217, 0.35);
"""


def add_variables_to_index_css():
    """将新变量追加到 index.css 的 :root 中"""
    content = INDEX_CSS.read_text(encoding="utf-8")
    if "--pm-text-92" in content:
        print("[SKIP] index.css 已包含新增变量")
        return

    # 在 --pm-nav-color 后面插入新变量
    marker = "  /* Sidebar text */\n  --pm-nav-color: rgba(219, 234, 254, 0.60);"
    if marker in content:
        content = content.replace(marker, marker + NEW_VARIABLES)
        INDEX_CSS.write_text(content, encoding="utf-8")
        print("[DONE] 已追加新 CSS 变量到 index.css")
    else:
        print("[WARN] 未找到插入点，请手动追加变量")


def replace_in_file(filepath: Path):
    """替换单个 CSS 文件中的硬编码色值"""
    content = filepath.read_text(encoding="utf-8")
    original = content
    replaced_count = 0

    # 按长度降序排序，避免短模式提前替换导致长模式无法匹配
    for color, var_expr in sorted(COLOR_MAP.items(), key=lambda x: -len(x[0])):
        # 大小写不敏感替换，但保留原始格式用于计数
        pattern = re.compile(re.escape(color), re.IGNORECASE)
        matches = pattern.findall(content)
        if matches:
            content = pattern.sub(var_expr, content)
            replaced_count += len(matches)

    if content != original:
        filepath.write_text(content, encoding="utf-8")
        print(f"[DONE] {filepath.relative_to(ROOT)} — 替换了 {replaced_count} 处")
    else:
        print(f"[SKIP] {filepath.relative_to(ROOT)} — 无匹配")


def main():
    print("=" * 60)
    print("P1-T2 CSS 硬编码色值批量替换")
    print("=" * 60)

    # 1. 先更新 index.css
    add_variables_to_index_css()

    # 2. 遍历所有模块 CSS
    css_files = sorted(SRC.rglob("*.css"))
    target_files = [f for f in css_files if f.name != "index.css" and f.name != "App.css"]

    print(f"\n扫描到 {len(target_files)} 个目标文件:\n")
    total_replaced = 0
    for filepath in target_files:
        replace_in_file(filepath)

    print("\n" + "=" * 60)
    print("替换完成，请运行 `npm run build` 验证")
    print("=" * 60)


if __name__ == "__main__":
    main()
