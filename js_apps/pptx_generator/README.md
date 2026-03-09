# PPTX Generator

Convert simple YAML text files into polished PowerPoint presentations — no PowerPoint required.

---

## What It Does

You write a plain text file describing your slides. The generator turns it into a styled `.pptx` file, ready to open in PowerPoint or Google Slides. Choose a visual theme to match your audience and use layout hints to control exactly how each slide looks.

---

## Quick Start

### 1. Install

```bash
cd pptx_generator
npm install
```

### 2. Write your content

Create a `.yml` file in the `inputs/` folder:

```yaml
title: "My Presentation"
subtitle: "Optional tagline here"

slides:
  - title: "Introduction"
    content:
      - "First point"
      - "Second point"
```

### 3. Generate

```bash
node src/index.js -i inputs/my-presentation.yml -o outputs/my-presentation.pptx
```

---

## Themes

Pass `--theme` with any name below:

| Theme | Best For | Style |
|-------|----------|-------|
| `github-dark` | Technical / developer audiences | Dark background, green & blue accents |
| `corporate-light` | Enterprise / executive audiences | White, navy & gold, serif fonts |
| `startup-bold` | Product pitches / creative | Light background, coral & teal |
| `minimal-mono` | Design agencies / editorial | Near-white, charcoal only, Impact type |
| `healthcare` | Medical / clinical / NHS | White, teal trust palette |
| `financial` | Boardroom / banking / fintech | Dark navy, gold stripe, Cambria serif |
| `creative-agency` | Brand / marketing / studios | Cream & berry, asymmetric layout |
| `education` | Training / eLearning / workshops | Warm terracotta, friendly & clear |

```bash
node src/index.js -i inputs/deck.yml -o outputs/deck.pptx --theme financial
```

Default theme if unspecified: `github-dark`.

---

## Layouts

The generator picks the best layout automatically — or you can specify it per slide with `layout:`.

| Layout | Best For | Auto-detected When |
|--------|----------|--------------------|
| `flow` | Process overviews, sequences | 3–6 items on the first slide |
| `cards` | Feature lists, key points | 4+ short items |
| `steps` | Numbered procedures | Items starting with "1.", "Step 1" etc. |
| `code` | Technical steps with commands | Lines starting with `git`, `npm`, `pip`, `cd` etc. |
| `two-column` | Comparisons, before/after | Title contains "vs", "before", "comparison" |
| `stat-callout` | KPIs, metrics, results | Items in format `99.9%: Description` |
| `quote` | Testimonials, key statements | Item starts with a quotation mark |
| `three-panel` | Three pillars, options, features | Exactly 3 items |
| `agenda` | Session contents, meeting plans | Title contains "agenda" or "overview" |
| `image-text` | Hero moments, key messages | Use with `hero:` field |
| `bullets` | Long-form explanations | Fallback for anything else |

Force a layout on any slide:

```yaml
  - title: "Q3 Results"
    layout: stat-callout
    content:
      - "$142M: Revenue"
      - "34%: Gross Margin"
```

---

## YAML Reference

### Standard slide
```yaml
  - title: "Slide Title"
    content:
      - "Bullet or prose line"
      - "git checkout -b feature/x"
    keyPoint: "Optional callout box text at the bottom"
```

### Two-column comparison
```yaml
  - title: "Before vs After"
    layout: two-column
    content:
      leftLabel: "Before"
      left:  ["Manual process", "Error prone"]
      rightLabel: "After"
      right: ["Automated", "Reliable"]
```

### Stats / metrics
```yaml
  - title: "By the Numbers"
    layout: stat-callout
    content:
      - "$142M: Revenue"
      - "34%: Gross Margin"
      - "2.4x: ARR Multiple"
```

### Quote / testimonial
```yaml
  - title: "What Clients Say"
    layout: quote
    content:
      - "This transformed how our team works."
      - "Jane Smith, CFO — ACME Corp"
      - "Optional third line of context"
```

### Three-panel with custom icons
```yaml
  - title: "Our Pillars"
    layout: three-panel
    icons: ["🛡️", "⚡", "❤️"]
    content:
      - "Safety: First pillar description"
      - "Speed: Second pillar description"
      - "Care: Third pillar description"
```

### Image-text (hero panel)
```yaml
  - title: "The Big Idea"
    layout: image-text
    hero: "◆"
    content:
      - "First supporting point"
      - "Second supporting point"
```

**Tip — bold labels:** write `Label: description` and the label is automatically bolded and coloured.

---

## Batch Processing

```bash
node src/index.js -d inputs/ -D outputs/ --theme education
```

---

## All CLI Options

| Flag | What it does |
|------|--------------|
| `-i <file>` | Input YAML file |
| `-o <file>` | Output PPTX file |
| `-d <folder>` | Input folder (batch mode) |
| `-D <folder>` | Output folder (batch mode) |
| `--theme <n>` | Visual theme (see table above) |
| `-v` | Show progress while generating |

---

## Project Structure

```
pptx_generator/
├── inputs/                          ← Your .yml files go here
│   ├── github_wow.yml               ← Example: GitHub developer workflow
│   ├── q3_business_review.yml       ← Example: Financial boardroom deck
│   ├── patient_onboarding.yml       ← Example: Healthcare training
│   ├── product_launch_flowly.yml    ← Example: Startup pitch
│   ├── design_thinking_workshop.yml ← Example: Creative workshop
│   ├── python_for_analysts.yml      ← Example: Education / eLearning
│   └── brand_identity.yml           ← Example: Minimal editorial
│
├── outputs/                         ← Generated .pptx files appear here
│
└── src/
    ├── index.js                     ← CLI entry point
    ├── config-parser.js             ← YAML parser
    ├── pptx-generator.js            ← Orchestrator
    ├── slide-designer.js            ← Theme router  ← register new themes here
    └── designers/
        ├── _base.js                 ← Shared utilities (layout detection, helpers)
        ├── _layouts.js              ← 11 reusable layout renderers
        ├── github-dark.js
        ├── corporate-light.js
        ├── startup-bold.js
        ├── minimal-mono.js
        ├── healthcare.js
        ├── financial.js
        ├── creative-agency.js
        └── education.js
```

---

## Adding a New Theme

1. Copy any existing designer: `cp src/designers/healthcare.js src/designers/my-brand.js`
2. Edit the `THEME` palette at the top — colours, fonts, footer label
3. Customise `renderTitleSlide()` for your title page
4. Add one line to `src/slide-designer.js`:

```javascript
'my-brand': './designers/my-brand',
```

5. Use it: `--theme my-brand`

All 11 layouts are inherited automatically — no layout code needed.

---

## Troubleshooting

**"Unknown theme"** — use an exact name from the theme table.

**Layout looks wrong** — add `layout: <name>` explicitly to override auto-detection.

**Two-column not splitting** — use the `{left: [...], right: [...]}` object format, not a flat array.

**Slides look empty** — check that `title:` and `content:` are both present, and list items start with `- `.
