# PPTX Generator

Convert simple YAML text files into polished PowerPoint presentations — no PowerPoint required.

---

## What It Does

You write a plain text file describing your slides. The generator turns it into a styled `.pptx` file, ready to open in PowerPoint or Google Slides. You choose the visual theme to match your audience.

---

## Quick Start

### 1. Install

```bash
cd pptx_generator
npm install
```

### 2. Write Your Content

Create a `.yml` file in the `inputs/` folder:

```yaml
title: "My Presentation"
subtitle: "Optional tagline here"

slides:
  - title: "Introduction"
    content:
      - "First point"
      - "Second point"
      - "Third point"

  - title: "Next Steps"
    content:
      - "Action item one"
      - "Action item two"
```

### 3. Generate

```bash
inFile="github_wow"
node src/index.js -i inputs/${inFile}.yml -o outputs/${inFile}.pptx --theme github-dark
```

Open the `.pptx` file from the `outputs/` folder.

---

## Choosing a Theme

Three visual themes are available. Pass `--theme` with any of these names:

| Theme | Best For | Style |
|-------|----------|-------|
| `github-dark` | Technical / developer audiences | Dark background, green & blue accents |
| `corporate-light` | Enterprise / executive audiences | White background, navy & gold, serif fonts |
| `startup-bold` | Product pitches / creative audiences | Light background, coral & teal, bold type |

If you don't specify a theme, `github-dark` is used by default.

---

## Processing Multiple Files at Once

Place all your `.yml` files in the `inputs/` folder, then run:

```bash
node src/index.js -d inputs/ -D outputs/ --theme startup-bold
```

All files are processed in one go, each generating its own `.pptx` in `outputs/`.

---

## All Options

| Flag | What it does |
|------|--------------|
| `-i <file>` | Input YAML file |
| `-o <file>` | Output PPTX file |
| `-d <folder>` | Input folder (batch mode) |
| `-D <folder>` | Output folder (batch mode) |
| `--theme <name>` | Visual theme (`github-dark`, `corporate-light`, `startup-bold`) |
| `-v` | Show progress while generating |

---

## YAML Tips

**Code blocks** — any line starting with `git`, `npm`, `pip`, `cd`, `python`, etc. is automatically rendered in a terminal-style code block:

```yaml
  - title: "Step 1 - Install"
    content:
      - "Open your terminal"
      - "Navigate to the project folder"
      - "cd my-project"
      - "npm install"
```

**Bold labels** — use `Label: description` format to get the label bolded in colour:

```yaml
      - "Performance: Processes 10,000 records per second"
      - "Reliability: 99.9% uptime SLA"
```

**Key point callout** — add a `keyPoint` field to any slide for a highlighted summary box at the bottom:

```yaml
  - title: "Our Approach"
    content:
      - "Step A"
      - "Step B"
    keyPoint: "All changes are reviewed before going live."
```

---

## Folder Structure

```
pptx_generator/
├── inputs/        ← Put your .yml files here
├── outputs/       ← Generated .pptx files appear here
└── src/
    └── designers/ ← Visual themes (one file per theme)
```

---

## Troubleshooting

**"Configuration file not found"** — check the path after `-i`. The file must exist and end in `.yml` or `.yaml`.

**"Unknown theme"** — use exactly `github-dark`, `corporate-light`, or `startup-bold`.

**Slides look empty** — make sure each slide has both `title:` and `content:` fields, and that `content:` is a list (each item starts with `-`).

**Output folder missing** — the generator creates `outputs/` automatically. If it fails, check you have write permission in the project folder.
