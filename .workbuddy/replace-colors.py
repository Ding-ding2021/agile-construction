#!/usr/bin/env python3
"""Bulk replace hardcoded colors in project/ CSS with CSS variables."""
import re, glob, os, collections

PROJECT_CSS_DIR = 'src/components/project'
INDEX_CSS = 'src/index.css'

# ── 1. Read existing variables from index.css ──
with open(INDEX_CSS) as f:
    index_css = f.read()

# Extract existing var definitions: --name: value;
var_pat = re.compile(r'--([a-zA-Z0-9_-]+):\s*([^;]+);')
existing = {}   # normalized value -> var(--name)
for name, val in var_pat.findall(index_css):
    v = re.sub(r'\s+', '', val.strip().lower())
    existing[v] = f'var(--{name})'

# ── 2. Scan project CSS files ──
files = glob.glob(f'{PROJECT_CSS_DIR}/*.css')
all_colors = collections.Counter()
file_contents = {}
for f in files:
    with open(f) as fh:
        text = fh.read()
    file_contents[f] = text
    colors = re.findall(r'#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)', text)
    for c in colors:
        all_colors[re.sub(r'\s+', '', c.strip().lower())] += 1

# ── 3. Variable name generator ──
KNOWN_HEX = {
    'eaf0ff': '--pm-ice',
    '7db0ff': '--pm-sky-light',
    '4f8fff': '--pm-sky-soft',
    '51a2ff': '--pm-blue-light',
    '9dccff': '--pm-sky-mist',
    '9fbcff': '--pm-sky-pale',
    'ff4d5f': '--pm-red',
    'ff6467': '--pm-red-soft',
    'f59e0b': '--pm-orange',
    '00bc7d': '--pm-green',
    '00d492': '--pm-green-light',
    'ffb900': '--pm-orange-gold',
    '8ff3bf': '--pm-green-pale',
    '10b981': '--pm-green-2',
    '22c55e': '--pm-green-3',
    'ef4444': '--pm-red-2',
    '60a5fa': '--pm-blue-3',
    '58a6ff': '--pm-blue-4',
    '1c6fff': '--pm-blue-5',
    '2ef2b2': '--pm-green-4',
    '6f87b8': '--pm-slate-light',
    '38517f': '--pm-slate-dark',
    '9fb0d9': '--pm-slate-pale',
    '111625': '--pm-dark-solid',
    '7deab0': '--pm-green-5',
    '9fb0ff': '--pm-indigo-pale',
    'ffc08f': '--pm-orange-pale',
    'ff9a9a': '--pm-red-pale',
    'c9e2ff': '--pm-sky-very-light',
    '8ebdff': '--pm-sky-lighter',
    '80ddff': '--pm-cyan-light',
    'd7e4ff': '--pm-indigo-very-light',
    '154dd9': '--pm-primary',
    '1a5ae8': '--pm-primary-light',
    '1248c5': '--pm-primary-dark',
    '2b7fff': '--pm-blue',
    '8e51ff': '--pm-purple',
    'a684ff': '--pm-purple-light',
    'fe9a00': '--pm-orange',
}

RGB_MAP = {
    (255,255,255): 'white',
    (0,0,0): 'black',
    (234,240,255): 'ice',
    (159,176,217): 'slate',
    (123,164,255): 'sky',
    (120,167,255): 'azure',
    (122,162,255): 'azure-2',
    (43,127,255): 'blue',
    (59,130,246): 'blue-2',
    (81,162,255): 'blue-3',
    (43,90,186): 'indigo',
    (21,77,217): 'primary',
    (0,212,146): 'green-light',
    (0,188,125): 'green',
    (254,154,0): 'orange',
    (245,158,11): 'orange-2',
    (255,77,95): 'red',
    (251,44,54): 'red-2',
    (255,100,103): 'red-3',
    (28,57,142): 'primary-shadow',
    (13,35,93): 'deep',
    (8,25,69): 'deeper',
    (11,31,82): 'midnight',
    (10,29,77): 'midnight-2',
    (11,34,88): 'midnight-3',
    (8,26,71): 'midnight-4',
    (18,33,65): 'navy',
    (15,23,42): 'dark',
    (5,19,56): 'bg-alpha',
    (219,234,254): 'nav',
    (10,17,34): 'dark-2',
    (8,14,28): 'dark-3',
    (91,140,255): 'blue-4',
    (19,29,51): 'navy-2',
    (62,196,120): 'green-2',
    (107,114,128): 'gray',
    (67,125,255): 'blue-5',
    (114,132,255): 'indigo-2',
    (83,110,255): 'indigo-3',
    (255,188,111): 'orange-3',
    (53,167,105): 'green-3',
    (42,160,99): 'green-4',
    (96,165,250): 'blue-6',
    (255,185,0): 'gold',
    (156,113,25): 'gold-2',
    (138,173,255): 'blue-7',
    (20,30,56): 'navy-3',
    (124,156,255): 'blue-8',
    (14,23,42): 'dark-4',
    (135,168,255): 'blue-9',
    (98,149,255): 'blue-10',
    (20,31,54): 'navy-4',
    (122,156,255): 'blue-11',
    (12,20,36): 'dark-5',
    (134,162,255): 'blue-12',
    (8,16,29): 'dark-6',
    (74,130,255): 'blue-13',
    (40,102,235): 'blue-14',
    (28,72,178): 'indigo-4',
    (46,149,98): 'green-5',
    (69,130,255): 'blue-15',
    (55,116,247): 'blue-16',
    (50,177,109): 'green-6',
    (2,9,24): 'dark-7',
    (16,185,129): 'green-7',
    (239,68,68): 'red-4',
    (34,197,94): 'green-8',
    (79,143,255): 'blue-17',
    (90,119,166): 'slate-2',
    (125,176,255): 'blue-18',
}

def gen_var_name(color):
    c = color.lower().strip()
    # Hex
    if c.startswith('#'):
        h = c.lstrip('#')
        if len(h) == 3:
            h = ''.join([x*2 for x in h])
        base = h[:6]
        a = 1.0
        if len(h) == 8:
            a = int(h[6:8], 16) / 255.0
        if base in KNOWN_HEX:
            if a < 1.0:
                return f'{KNOWN_HEX[base]}-{int(round(a*100))}'
            return KNOWN_HEX[base]
        return f'--pm-color-{base}'
    # rgba/rgb
    m = re.match(r'rgba?\((\d+),(\d+),(\d+)(?:,([\d.]+))?\)', c)
    if not m:
        return '--pm-unknown'
    r, g, b = int(m.group(1)), int(m.group(2)), int(m.group(3))
    a = float(m.group(4)) if m.group(4) else 1.0
    pct = int(round(a * 100))
    key = (r, g, b)
    if key in RGB_MAP:
        return f'--pm-{RGB_MAP[key]}-{pct}'
    # Check grayscale
    if abs(r-g) < 10 and abs(g-b) < 10:
        return f'--pm-gray-{r:02d}-{pct}'
    return f'--pm-rgb-{r:03d}-{g:03d}-{b:03d}-{pct}'

# ── 4. Build replacement map ──
replacements = {}
new_vars = {}   # var_name -> color value (for insertion into index.css)

for color, count in all_colors.most_common():
    norm = re.sub(r'\s+', '', color.strip().lower())
    if norm in existing:
        replacements[color] = existing[norm]
        continue
    var_name = gen_var_name(norm)
    replacements[color] = f'var({var_name})'
    new_vars[var_name] = color.strip()

# ── 5. Fix --pm-text-white bug in index.css ──
index_css = index_css.replace(
    '--pm-text-white: var(--pm-text-white)fff;',
    '--pm-text-white: #fff;'
)

# ── 6. Insert new vars into index.css :root ──
new_var_lines = [f'  {k}: {v};' for k, v in sorted(new_vars.items())]
if new_var_lines:
    # Find closing brace of :root
    root_end = index_css.find('}\n\n* { box-sizing')
    if root_end == -1:
        root_end = index_css.find('}\n\nbody {')
    if root_end == -1:
        root_end = index_css.find('}\n* {')
    insert_text = '\n  /* ===== Project module tokens (auto-generated) ===== */\n' + '\n'.join(new_var_lines)
    index_css = index_css[:root_end] + insert_text + '\n' + index_css[root_end:]

with open(INDEX_CSS, 'w') as f:
    f.write(index_css)

# ── 7. Replace colors in project CSS files ──
total_replaced = 0
for filepath, text in file_contents.items():
    original = text
    for old_color, new_var in replacements.items():
        # Escape regex special chars in old_color
        pattern = re.escape(old_color)
        # Replace only exact matches (not inside var() definitions)
        # Use word boundary or non-word char before/after
        text, n = re.subn(r'(?<![\w-])' + pattern + r'(?![\w-])', new_var, text)
        total_replaced += n
    if text != original:
        with open(filepath, 'w') as f:
            f.write(text)

print(f'Inserted {len(new_vars)} new CSS variables into {INDEX_CSS}')
print(f'Replaced {total_replaced} color occurrences across {len(files)} files')
print(f'Unique colors mapped: {len(all_colors)}')
