/**
 * _layouts.js — Reusable layout renderers
 *
 * Each function renders a complete slide content area.
 * Themes call these with their own palette (theme object),
 * overriding colours and fonts but sharing structural logic.
 *
 * Usage in a designer:
 *   const L = require('./_layouts');
 *   L.flowLayout(slide, pres, slideData, accentColor, theme);
 */

const {
  mkShadow, parseColonLabel, flattenContent, splitCodeProse,
  renderCardRow, renderCodeBlock, renderSlideHeader, renderFooter, renderStepBadge,
} = require('./_base');

// ─── Accent colour cycles (themes can override) ───────────────────────────────

function cycleColor(palette, index) {
  const cycle = palette.accentCycle || [palette.accent, palette.secondary, palette.tertiary || palette.accent];
  return cycle[index % cycle.length];
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT: flow
// Horizontal numbered step cards — best for overview / process slides
// ─────────────────────────────────────────────────────────────────────────────
function flowLayout(slide, pres, slideData, accentColor, theme) {
  slide.background = { color: theme.bg };
  renderSlideHeader(slide, pres, slideData, accentColor, theme, { sectionLabel: 'Overview' });

  const items  = flattenContent(slideData.content).slice(1); // first item used as subtitle
  const sub    = flattenContent(slideData.content)[0] || '';
  const colors = theme.accentCycle || [accentColor];
  const colW   = Math.min(2.15, 9.0 / Math.max(items.length, 1));
  const startX = (10 - (colW * items.length + 0.1 * (items.length - 1))) / 2;

  if (sub) {
    slide.addText(sub, {
      x: 0.5, y: 1.05, w: 9, h: 0.35, margin: 0,
      fontSize: 13, color: theme.muted, italic: true, fontFace: theme.fontBody,
    });
  }

  items.forEach((step, i) => {
    const x     = startX + i * (colW + 0.1);
    const color = cycleColor(theme, i);

    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.55, w: colW, h: 2.0,
      fill: { color: theme.cardBg }, line: { color, pt: 2 },
      shadow: mkShadow(),
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.55, w: colW, h: 0.1,
      fill: { color }, line: { type: 'none' },
    });
    // Number circle
    slide.addShape(pres.shapes.OVAL, {
      x: x + colW / 2 - 0.27, y: 1.72,
      w: 0.54, h: 0.54,
      fill: { color }, line: { type: 'none' },
    });
    slide.addText(`${i + 1}`, {
      x: x + colW / 2 - 0.27, y: 1.72, w: 0.54, h: 0.54, margin: 0,
      fontSize: 15, color: theme.onAccent || 'FFFFFF',
      bold: true, align: 'center', valign: 'middle',
    });
    slide.addText(step, {
      x, y: 2.35, w: colW, h: 1.1, margin: 5,
      fontSize: 12, color: theme.text,
      bold: true, align: 'center', valign: 'middle', fontFace: theme.fontBody,
    });
    // Arrow connector
    if (i < items.length - 1) {
      slide.addShape(pres.shapes.RECTANGLE, {
        x: x + colW + 0.01, y: 2.48, w: 0.08, h: 0.05,
        fill: { color: theme.muted }, line: { type: 'none' },
      });
    }
  });

  if (slideData.keyPoint) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 3.78, w: 9.0, h: 0.9,
      fill: { color: theme.cardBg }, line: { color: accentColor, pt: 1 },
      shadow: mkShadow(),
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 3.78, w: 0.07, h: 0.9,
      fill: { color: accentColor }, line: { type: 'none' },
    });
    slide.addText(slideData.keyPoint, {
      x: 0.72, y: 3.78, w: 8.65, h: 0.9, margin: 0,
      fontSize: 12, color: theme.text, valign: 'middle', fontFace: theme.fontBody,
    });
  }

  renderFooter(slide, pres, theme.footerLabel, theme);
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT: cards
// Full-width card rows with left accent strip
// ─────────────────────────────────────────────────────────────────────────────
function cardsLayout(slide, pres, slideData, accentColor, theme) {
  slide.background = { color: theme.bg };
  renderSlideHeader(slide, pres, slideData, accentColor, theme, { sectionLabel: 'Key Points' });

  const items  = flattenContent(slideData.content);
  const availH = 4.0;
  const gapH   = 0.1;
  const cardH  = Math.min(1.05, (availH - gapH * (items.length - 1)) / items.length);

  items.forEach((item, i) => {
    const y     = 1.15 + i * (cardH + gapH);
    const color = cycleColor(theme, i);
    renderCardRow(slide, pres, item, 0.5, y, 9.0, cardH, color, theme);
  });

  renderFooter(slide, pres, theme.footerLabel, theme);
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT: steps
// Numbered rows with oval counters
// ─────────────────────────────────────────────────────────────────────────────
function stepsLayout(slide, pres, slideData, accentColor, theme) {
  slide.background = { color: theme.bg };
  renderSlideHeader(slide, pres, slideData, accentColor, theme, { sectionLabel: 'Steps' });

  const items = flattenContent(slideData.content);
  const rowH  = Math.min(0.95, 4.2 / items.length);

  items.forEach((item, i) => {
    const y     = 1.15 + i * (rowH + 0.1);
    const color = cycleColor(theme, i);
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 9.0, h: rowH,
      fill: { color: theme.cardBg }, line: { type: 'none' },
      shadow: mkShadow(),
    });
    slide.addShape(pres.shapes.OVAL, {
      x: 0.62, y: y + (rowH - 0.38) / 2, w: 0.38, h: 0.38,
      fill: { color }, line: { type: 'none' },
    });
    slide.addText(`${i + 1}`, {
      x: 0.62, y: y + (rowH - 0.38) / 2, w: 0.38, h: 0.38, margin: 0,
      fontSize: 13, color: theme.onAccent || 'FFFFFF',
      bold: true, align: 'center', valign: 'middle',
    });
    slide.addText(item, {
      x: 1.15, y, w: 8.2, h: rowH, margin: 0,
      fontSize: 13, color: theme.text, valign: 'middle', fontFace: theme.fontBody,
    });
  });

  renderFooter(slide, pres, theme.footerLabel, theme);
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT: code
// Two-column: bullet prose left + terminal code block right
// ─────────────────────────────────────────────────────────────────────────────
function codeLayout(slide, pres, slideData, accentColor, theme) {
  slide.background = { color: theme.bg };

  const stepMatch = (slideData.title || '').match(/step\s*(\d+)/i);
  const stepNum   = stepMatch ? parseInt(stepMatch[1]) : null;

  if (stepNum != null) {
    renderStepBadge(slide, pres, `STEP ${stepNum}`, 0.5, 0.18, 1.1, 0.6, accentColor, theme.onAccent || 'FFFFFF');
    slide.addText(slideData.title, {
      x: 1.75, y: 0.18, w: 8, h: 0.6, margin: 0,
      fontSize: 26, color: theme.titleColor, bold: true, fontFace: theme.fontHead,
    });
  } else {
    renderSlideHeader(slide, pres, slideData, accentColor, theme);
  }

  const { prose, code } = splitCodeProse(slideData.content);

  if (prose.length) {
    const bulletItems = prose.map((b, i) => ({
      text: b,
      options: { bullet: true, breakLine: i < prose.length - 1, color: theme.text },
    }));
    slide.addText(bulletItems, {
      x: 0.5, y: 1.1, w: 4.4, h: 3.8,
      fontSize: 13, fontFace: theme.fontBody,
    });
  }

  renderCodeBlock(slide, pres, code, 5.1, 0.9, 4.5, 3.8, theme);
  renderFooter(slide, pres, theme.footerLabel, theme);
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT: two-column
// Left column / right column — comparison, before/after, pros/cons
// Content can be {left:[], right:[]} or auto-split array at midpoint
// ─────────────────────────────────────────────────────────────────────────────
function twoColumnLayout(slide, pres, slideData, accentColor, theme) {
  slide.background = { color: theme.bg };
  renderSlideHeader(slide, pres, slideData, accentColor, theme);

  let leftItems, rightItems, leftLabel, rightLabel;

  if (slideData.content && !Array.isArray(slideData.content)) {
    leftItems  = slideData.content.left  || [];
    rightItems = slideData.content.right || [];
    leftLabel  = slideData.content.leftLabel  || '';
    rightLabel = slideData.content.rightLabel || '';
  } else {
    const items = flattenContent(slideData.content);
    const mid   = Math.ceil(items.length / 2);
    leftItems   = items.slice(0, mid);
    rightItems  = items.slice(mid);
    leftLabel   = '';
    rightLabel  = '';
  }

  const colY  = 1.3;
  const colH  = 3.7;
  const colW  = 4.35;
  const colors = [theme.accent || accentColor, theme.secondary || accentColor];

  [
    { items: leftItems,  label: leftLabel,  x: 0.4,  color: colors[0] },
    { items: rightItems, label: rightLabel, x: 5.25, color: colors[1] },
  ].forEach(col => {
    // Column header band
    slide.addShape(pres.shapes.RECTANGLE, {
      x: col.x, y: colY, w: colW, h: 0.38,
      fill: { color: col.color }, line: { type: 'none' },
    });
    if (col.label) {
      slide.addText(col.label, {
        x: col.x, y: colY, w: colW, h: 0.38, margin: 0,
        fontSize: 12, color: theme.onAccent || 'FFFFFF',
        bold: true, align: 'center', valign: 'middle', fontFace: theme.fontBody,
      });
    }
    // Column body
    slide.addShape(pres.shapes.RECTANGLE, {
      x: col.x, y: colY + 0.38, w: colW, h: colH - 0.38,
      fill: { color: theme.cardBg }, line: { type: 'none' },
      shadow: mkShadow(),
    });
    const bulletItems = col.items.map((b, i) => ({
      text: b,
      options: { bullet: true, breakLine: i < col.items.length - 1, color: theme.text },
    }));
    if (bulletItems.length) {
      slide.addText(bulletItems, {
        x: col.x + 0.15, y: colY + 0.48, w: colW - 0.2, h: colH - 0.58,
        fontSize: 13, fontFace: theme.fontBody,
      });
    }
  });

  renderFooter(slide, pres, theme.footerLabel, theme);
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT: stat-callout
// Large number + label pairs in a grid — metrics, KPIs, results
// Content format: "99.9%: Uptime SLA" or "10x: Faster processing"
// ─────────────────────────────────────────────────────────────────────────────
function statCalloutLayout(slide, pres, slideData, accentColor, theme) {
  slide.background = { color: theme.bg };
  renderSlideHeader(slide, pres, slideData, accentColor, theme, { sectionLabel: 'By the Numbers' });

  const items  = flattenContent(slideData.content);
  const count  = items.length;
  const perRow = count <= 3 ? count : Math.ceil(count / 2);
  const rows   = Math.ceil(count / perRow);
  const cellW  = 9.0 / perRow;
  const cellH  = rows === 1 ? 2.8 : 1.6;
  const startY = rows === 1 ? 1.8 : 1.4;

  items.forEach((item, i) => {
    const col   = i % perRow;
    const row   = Math.floor(i / perRow);
    const x     = 0.5 + col * cellW;
    const y     = startY + row * (cellH + 0.3);
    const color = cycleColor(theme, i);
    const parsed = parseColonLabel(item);
    const stat   = parsed ? parsed.label.replace(':', '') : item;
    const label  = parsed ? parsed.body : '';

    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cellW - 0.1, h: cellH,
      fill: { color: theme.cardBg }, line: { color, pt: 2 },
      shadow: mkShadow(),
    });
    // Big stat number
    slide.addText(stat, {
      x, y: y + 0.2, w: cellW - 0.1, h: cellH * 0.55, margin: 0,
      fontSize: rows === 1 ? 52 : 38, color,
      bold: true, align: 'center', valign: 'middle', fontFace: theme.fontHead,
    });
    // Label below
    if (label) {
      slide.addText(label, {
        x, y: y + cellH * 0.6, w: cellW - 0.1, h: cellH * 0.38, margin: 4,
        fontSize: 13, color: theme.muted,
        align: 'center', valign: 'top', fontFace: theme.fontBody,
      });
    }
  });

  if (slideData.keyPoint) {
    const kpY = startY + rows * (cellH + 0.3) + 0.1;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: kpY, w: 9.0, h: 0.75,
      fill: { color: theme.cardBg }, line: { color: accentColor, pt: 1 },
      shadow: mkShadow(),
    });
    slide.addText(slideData.keyPoint, {
      x: 0.7, y: kpY, w: 8.6, h: 0.75, margin: 0,
      fontSize: 12, color: theme.muted, valign: 'middle', italic: true, fontFace: theme.fontBody,
    });
  }

  renderFooter(slide, pres, theme.footerLabel, theme);
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT: quote
// Large pull-quote with attribution — testimonials, key statements
// content[0] = quote text, content[1] = attribution
// ─────────────────────────────────────────────────────────────────────────────
function quoteLayout(slide, pres, slideData, accentColor, theme) {
  slide.background = { color: theme.bg };

  const items       = flattenContent(slideData.content);
  const quoteText   = items[0] || '';
  const attribution = items[1] || '';
  const context     = items[2] || '';

  // Large decorative quote mark
  slide.addText('\u201C', {
    x: 0.3, y: 0.5, w: 2, h: 2, margin: 0,
    fontSize: 160, color: accentColor,
    fontFace: theme.fontHead, transparency: 80,
  });

  // Accent bar left edge
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.2, w: 0.1, h: 3.2,
    fill: { color: accentColor }, line: { type: 'none' },
  });

  slide.addText(quoteText.replace(/^["'"']+|["'"']+$/g, ''), {
    x: 0.85, y: 1.1, w: 8.5, h: 2.8, margin: 0,
    fontSize: 24, color: theme.titleColor,
    italic: true, fontFace: theme.fontHead,
    valign: 'middle',
  });

  if (attribution) {
    slide.addText(`— ${attribution.replace(/^[-–—]\s*/, '')}`, {
      x: 0.85, y: 4.0, w: 8.5, h: 0.45, margin: 0,
      fontSize: 14, color: accentColor,
      bold: true, fontFace: theme.fontBody,
    });
  }
  if (context) {
    slide.addText(context, {
      x: 0.85, y: 4.4, w: 8.5, h: 0.35, margin: 0,
      fontSize: 12, color: theme.muted, fontFace: theme.fontBody,
    });
  }

  renderFooter(slide, pres, theme.footerLabel, theme);
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT: three-panel
// Three equal feature panels — process steps, options, pillars
// ─────────────────────────────────────────────────────────────────────────────
function threePanelLayout(slide, pres, slideData, accentColor, theme) {
  slide.background = { color: theme.bg };
  renderSlideHeader(slide, pres, slideData, accentColor, theme);

  const items    = flattenContent(slideData.content).slice(0, 3);
  const extra    = flattenContent(slideData.content)[3] || slideData.keyPoint || '';
  const icons    = slideData.icons || ['📌', '⚡', '✅'];
  const panelW   = 2.85;
  const colors   = theme.accentCycle || [accentColor, accentColor, accentColor];

  items.forEach((item, i) => {
    const x     = 0.5 + i * (panelW + 0.18);
    const color = cycleColor(theme, i);

    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.25, w: panelW, h: 2.7,
      fill: { color: theme.cardBg }, line: { color, pt: 2 },
      shadow: mkShadow(),
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.25, w: panelW, h: 0.1,
      fill: { color }, line: { type: 'none' },
    });
    slide.addText(icons[i] || '◆', {
      x, y: 1.4, w: panelW, h: 0.7, margin: 0,
      fontSize: 28, align: 'center',
    });
    slide.addText(item, {
      x, y: 2.1, w: panelW, h: 1.75, margin: 6,
      fontSize: 13, color: theme.text,
      bold: true, align: 'center', valign: 'middle', fontFace: theme.fontBody,
    });
    if (i < items.length - 1) {
      slide.addShape(pres.shapes.RECTANGLE, {
        x: x + panelW + 0.01, y: 2.55, w: 0.16, h: 0.05,
        fill: { color: theme.muted }, line: { type: 'none' },
      });
    }
  });

  if (extra) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 4.15, w: 9.0, h: 0.85,
      fill: { color: theme.cardBg }, line: { color: accentColor, pt: 1 },
      shadow: mkShadow(),
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 4.15, w: 0.07, h: 0.85,
      fill: { color: accentColor }, line: { type: 'none' },
    });
    slide.addText(extra, {
      x: 0.72, y: 4.15, w: 8.65, h: 0.85, margin: 0,
      fontSize: 12, color: theme.text,
      valign: 'middle', italic: true, fontFace: theme.fontBody,
    });
  }

  renderFooter(slide, pres, theme.footerLabel, theme);
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT: agenda
// Numbered agenda items — clean meeting/workshop opener
// ─────────────────────────────────────────────────────────────────────────────
function agendaLayout(slide, pres, slideData, accentColor, theme) {
  slide.background = { color: theme.bg };
  renderSlideHeader(slide, pres, slideData, accentColor, theme, { sectionLabel: 'Agenda' });

  const items = flattenContent(slideData.content);
  const rowH  = Math.min(0.85, 3.9 / items.length);

  items.forEach((item, i) => {
    const y     = 1.2 + i * (rowH + 0.12);
    const color = cycleColor(theme, i);

    // Number pill
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 0.6, h: rowH,
      fill: { color }, line: { type: 'none' },
      shadow: mkShadow(),
    });
    slide.addText(`${i + 1}`, {
      x: 0.5, y, w: 0.6, h: rowH, margin: 0,
      fontSize: 16, color: theme.onAccent || 'FFFFFF',
      bold: true, align: 'center', valign: 'middle', fontFace: theme.fontBody,
    });
    // Item text
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 1.2, y, w: 8.3, h: rowH,
      fill: { color: theme.cardBg }, line: { type: 'none' },
      shadow: mkShadow(),
    });
    const parsed = parseColonLabel(item);
    if (parsed) {
      slide.addText([
        { text: parsed.label + ' ', options: { bold: true, color } },
        { text: parsed.body,         options: { color: theme.text } },
      ], { x: 1.4, y, w: 8.1, h: rowH, fontSize: 14, valign: 'middle', fontFace: theme.fontBody });
    } else {
      slide.addText(item, {
        x: 1.4, y, w: 8.1, h: rowH, margin: 0,
        fontSize: 14, color: theme.text, valign: 'middle', fontFace: theme.fontBody,
      });
    }
  });

  renderFooter(slide, pres, theme.footerLabel, theme);
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT: image-text  (text-only version — no actual images needed)
// Large visual area left + text right — hero moments, key messages
// ─────────────────────────────────────────────────────────────────────────────
function imageTextLayout(slide, pres, slideData, accentColor, theme) {
  slide.background = { color: theme.bg };

  // Left colour panel (simulates image bleed)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 4.2, h: 5.625,
    fill: { color: accentColor }, line: { type: 'none' },
  });
  // Large icon / number in panel
  const hero = slideData.hero || slideData.content?.[0]?.[0] || '★';
  slide.addText(hero, {
    x: 0, y: 1.2, w: 4.2, h: 3.0, margin: 0,
    fontSize: 100, color: theme.onAccent || 'FFFFFF',
    align: 'center', valign: 'middle',
  });

  // Right: title + bullets
  slide.addText(slideData.title, {
    x: 4.5, y: 0.8, w: 5.2, h: 0.9, margin: 0,
    fontSize: 26, color: theme.titleColor,
    bold: true, fontFace: theme.fontHead,
  });

  const items = flattenContent(slideData.content);
  const bulletItems = items.map((b, i) => ({
    text: b,
    options: { bullet: true, breakLine: i < items.length - 1, color: theme.text },
  }));
  slide.addText(bulletItems, {
    x: 4.5, y: 1.85, w: 5.1, h: 3.1,
    fontSize: 13, fontFace: theme.fontBody,
  });

  renderFooter(slide, pres, theme.footerLabel, theme);
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT: bullets
// Simple title + bullet list — fallback for long-form content
// ─────────────────────────────────────────────────────────────────────────────
function bulletsLayout(slide, pres, slideData, accentColor, theme) {
  slide.background = { color: theme.bg };
  renderSlideHeader(slide, pres, slideData, accentColor, theme);

  const items = flattenContent(slideData.content);
  const bulletItems = items.map((b, i) => ({
    text: b,
    options: { bullet: true, breakLine: i < items.length - 1, color: theme.text },
  }));
  slide.addText(bulletItems, {
    x: 0.5, y: 1.2, w: 9.0, h: 3.8,
    fontSize: 15, fontFace: theme.fontBody,
  });

  renderFooter(slide, pres, theme.footerLabel, theme);
}

// ─────────────────────────────────────────────────────────────────────────────
// Dispatch table
// ─────────────────────────────────────────────────────────────────────────────
const ALL_LAYOUTS = {
  'flow':         flowLayout,
  'cards':        cardsLayout,
  'steps':        stepsLayout,
  'code':         codeLayout,
  'two-column':   twoColumnLayout,
  'stat-callout': statCalloutLayout,
  'quote':        quoteLayout,
  'three-panel':  threePanelLayout,
  'agenda':       agendaLayout,
  'image-text':   imageTextLayout,
  'bullets':      bulletsLayout,
};

/**
 * Render any layout by key.
 * @param {string} layoutKey
 */
function render(layoutKey, slide, pres, slideData, accentColor, theme) {
  const fn = ALL_LAYOUTS[layoutKey] || cardsLayout;
  fn(slide, pres, slideData, accentColor, theme);
}

module.exports = {
  render,
  ALL_LAYOUTS,
  flowLayout, cardsLayout, stepsLayout, codeLayout,
  twoColumnLayout, statCalloutLayout, quoteLayout,
  threePanelLayout, agendaLayout, imageTextLayout, bulletsLayout,
};
