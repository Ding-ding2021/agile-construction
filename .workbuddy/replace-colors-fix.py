#!/usr/bin/env python3
"""Fix: replace colors with whitespace tolerance."""
import re, glob

PROJECT_CSS_DIR = 'src/components/project'
INDEX_CSS = 'src/index.css'

# Read the new variables from index.css
with open(INDEX_CSS) as f:
    index_css = f.read()

var_pat = re.compile(r'--([a-zA-Z0-9_-]+):\s*([^;]+);')
existing = {}
for name, val in var_pat.findall(index_css):
    v = re.sub(r'\s+', '', val.strip().lower())
    existing[v] = f'var(--{name})'

files = glob.glob(f'{PROJECT_CSS_DIR}/*.css')
total_replaced = 0

for filepath in files:
    with open(filepath) as f:
        text = f.read()
    original = text
    
    # Find all hardcoded colors in this file
    colors_found = set(re.findall(r'#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)', text))
    
    for color in colors_found:
        norm = re.sub(r'\s+', '', color.strip().lower())
        if norm not in existing:
            continue
        # Build regex that tolerates whitespace variations
        if color.startswith('#'):
            pattern = re.escape(color)
        else:
            # rgba/rgb: allow arbitrary whitespace around numbers and commas
            parts = re.split(r'([(),])', color)
            regex_parts = []
            for part in parts:
                if part in '(,)':
                    regex_parts.append(re.escape(part))
                else:
                    regex_parts.append(re.escape(part.strip()))
            pattern = r'\s*'.join(regex_parts)
        
        text, n = re.subn(pattern, existing[norm], text)
        total_replaced += n
    
    if text != original:
        with open(filepath, 'w') as f:
            f.write(text)

print(f'Replaced {total_replaced} additional color occurrences')
