# Analysis Template

Use this template to present analysis in Phase 2. Fill all sections before asking user to confirm.

---

## 🔍 Website Analysis Report

**Source URL**: [url]
**Scrape Status**: ✅ Success / ⚠️ Partial / ❌ Failed (with fallback)

---

### Page Structure

**Sections Detected**:

1. [ ] Header/Navigation
2. [ ] Hero
3. [ ] Features/Benefits
4. [ ] Social Proof/Testimonials
5. [ ] Pricing
6. [ ] FAQ
7. [ ] CTA
8. [ ] Footer

**Layout Pattern**: [single-column / two-column / grid / bento / asymmetric]
**Navigation Type**: [sticky / fixed / relative] + [hamburger mobile / full mobile nav]

---

### Design Tokens Extracted

**Colors**:

```css
--color-primary: #______;
--color-secondary: #______;
--color-accent: #______;
--color-background: #______;
--color-foreground: #______;
--color-muted: #______;
--color-border: #______;
```

**Typography**:

- Headings: [Font Family], weights: [400/500/600/700]
- Body: [Font Family], weights: [400/500]
- Scale: [h1: px, h2: px, h3: px, body: px, small: px]

**Spacing**:

- Base unit: [4px / 8px]
- Section gap: [px]
- Component gap: [px]
- Container max-width: [px]

**Border Radius**:

- Small: [px]
- Medium: [px]
- Large: [px]

---

### Component Breakdown

| #   | Component      | Description   | Complexity   |
| --- | -------------- | ------------- | ------------ |
| 1   | `Header.tsx`   | [description] | Low/Med/High |
| 2   | `Hero.tsx`     | [description] | Low/Med/High |
| 3   | `Features.tsx` | [description] | Low/Med/High |
| ... | ...            | ...           | ...          |

---

### Images Inventory

| #   | Source URL | Target Path                    | Status                  |
| --- | ---------- | ------------------------------ | ----------------------- |
| 1   | [url]      | `/public/images/hero-bg.jpg`   | ✅ Will download        |
| 2   | [url]      | `/public/images/feature-1.png` | ⚠️ Fallback to Unsplash |
| 3   | N/A        | `/public/images/avatar-1.jpg`  | 🔄 Using Unsplash       |

---

### Proposed File Structure

```
app/
├── layout.tsx          # Root layout + metadata
├── page.tsx            # Main page composition
└── globals.css         # Design tokens + custom styles

components/
└── landing/
    ├── Header.tsx
    ├── Hero.tsx
    ├── Features.tsx
    ├── [Other].tsx
    └── Footer.tsx

public/
└── images/
    ├── hero-bg.jpg
    └── [other images]
```

---

### Notes & Considerations

- [Any special patterns observed]
- [Animations or interactions to implement]
- [Missing content that needs placeholders]
- [Accessibility considerations]

---

**Ready to proceed with code generation? (y/n)**

If modifications needed, specify:

- Sections to skip
- Components to combine/split
- Design token adjustments
- Image handling preferences
