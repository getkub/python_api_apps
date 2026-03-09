/**
 * designers/corporate-light.js
 *
 * Theme: Corporate Light
 * Feel: Professional consulting / enterprise — clean white backgrounds,
 *       navy primary, gold accent, Georgia headings.
 * Palette: "Midnight Executive" from SKILL.md
 */

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:       'FFFFFF',
  altBg:    'F4F6FA',   // very light blue-grey for card backgrounds
  navy:     '1E2761',   // dominant: 60-70% visual weight
  navyDark: '141A47',
  gold:     'C9A84C',   // accent
  steel:    '4A6FA5',   // supporting blue
  text:     '1A1A2E',
  muted:    '6B7280',
  white:    'FFFFFF',
  border:   'D1D9E6',
};

const FOOTER_LABEL = 'Confidential — Internal Use Only';
const BRAND_NAME   = '◆ Corporate';
const FONT_HEAD    = 'Georgia';
const FONT_BODY    = 'Calibri';

const ACCENT_CYCLE  = [C.navy, C.steel, C.gold, C.navy, C.steel, C.gold];
const STEP_COLORS   = [C.navy, C.steel, C.gold, C.navyDark, C.steel];

// PptxGenJS mutates option objects — always return a fresh copy
const mkShadow = () => ({ type: 'outer', blur: 8, offset: 2, color: '1E2761', opacity: 0.12, angle: 135 });

// ─── Shared helpers ───────────────────────────────────────────────────────────

function addFooter(slide, pres, label) {
  // Thin navy bottom bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.28, w: 10, h: 0.345, fill: { color: C.navy }, line: { type: 'none' } });
  slide.addText(label || FOOTER_LABEL, {
    x: 0.5, y: 5.28, w: 9, h: 0.345, margin: 0,
    fontSize: 10, color: 'AABBD6', align: 'center', valign: 'middle', fontFace: FONT_BODY,
  });
}

function addTopBar(slide, pres, color) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.12,
    fill: { color: color || C.navy }, line: { type: 'none' },
  });
}

function addSectionLabel(slide, label, color) {
  // Small ALL-CAPS category label above title — replaces accent underline
  slide.addText(label.toUpperCase(), {
    x: 0.5, y: 0.2, w: 9, h: 0.3, margin: 0,
    fontSize: 10, color: color || C.gold, bold: true,
    fontFace: FONT_BODY, charSpacing: 3,
  });
}

// ─── Content type detection (shared logic, theme-agnostic) ───────────────────

const { detectContentType } = require('../_base');
const L = require('../_layouts');

function detectContentType(content) {
  const codePatterns = /^(git |npm |pip |cd |ls |curl |node |python|uvicorn|http)/i;
  if (content.filter(c => codePatterns.test(c.trim())).length >= 2) return 'code';
  if (content.filter(c => /^step\s*\d|^\d+[.)]/i.test(c.trim())).length >= 2) return 'steps';
  if (content.length >= 4 && content.every(c => c.length < 60)) return 'cards';
  return 'bullets';
}

// ─── Layout functions ─────────────────────────────────────────────────────────

/** Title slide: navy left panel + white right, large serif title */
function titleSlide(slide, pres, config) {
  slide.background = { color: C.bg };

  // Navy left panel (40% of width)
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 4.0, h: 5.625, fill: { color: C.navy }, line: { type: 'none' } });

  // Gold accent bar on left panel
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.18, h: 5.625, fill: { color: C.gold }, line: { type: 'none' } });

  // Decorative circle on left panel
  slide.addShape(pres.shapes.OVAL, { x: 1.5, y: 3.8, w: 3.5, h: 3.5, fill: { color: C.navyDark }, line: { type: 'none' } });

  // Brand label on left
  slide.addText(BRAND_NAME, {
    x: 0.3, y: 0.3, w: 3.5, h: 0.5, margin: 0,
    fontSize: 13, color: C.gold, bold: true, fontFace: FONT_BODY,
  });

  // Category label on left
  slide.addText('PRESENTATION', {
    x: 0.3, y: 4.7, w: 3.4, h: 0.3, margin: 0,
    fontSize: 9, color: 'AABBD6', bold: true, fontFace: FONT_BODY, charSpacing: 3,
  });

  // Title on right (white area)
  const words = config.title.split(' ');
  const half  = Math.ceil(words.length / 2);
  const line1 = words.slice(0, half).join(' ');
  const line2 = words.slice(half).join(' ');

  slide.addText(line1, { x: 4.3, y: 1.2, w: 5.4, h: 0.9, margin: 0, fontSize: 40, color: C.navy, bold: true, fontFace: FONT_HEAD });
  if (line2) {
    slide.addText(line2, { x: 4.3, y: 2.05, w: 5.4, h: 0.9, margin: 0, fontSize: 40, color: C.steel, bold: true, fontFace: FONT_HEAD });
  }

  // Gold divider line (short, left-aligned under title — design element, not accent-under-title)
  slide.addShape(pres.shapes.RECTANGLE, { x: 4.3, y: 3.05, w: 1.2, h: 0.06, fill: { color: C.gold }, line: { type: 'none' } });

  // Subtitle / tagline
  const tag = config.subtitle || '';
  slide.addText(tag, { x: 4.3, y: 3.25, w: 5.3, h: 0.5, fontSize: 14, color: C.muted, italic: true, fontFace: FONT_BODY });
}

/** Flow layout: numbered step boxes in a horizontal row */
function flowLayout(slide, pres, slideData, accentColor) {
  slide.background = { color: C.bg };
  addTopBar(slide, pres, accentColor);
  addSectionLabel(slide, 'Overview', accentColor);

  slide.addText(slideData.title, { x: 0.5, y: 0.45, w: 9, h: 0.7, margin: 0, fontSize: 28, color: C.navy, bold: true, fontFace: FONT_HEAD });

  const steps = slideData.content.slice(1);
  const colors = [C.navy, C.steel, C.gold, C.navyDark];
  const colW = Math.min(2.1, 9.0 / steps.length);

  steps.forEach((step, i) => {
    const x = 0.5 + i * (colW + 0.12);
    // Card
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.5, w: colW, h: 2.0, fill: { color: C.altBg }, line: { color: colors[i % colors.length], pt: 2 }, shadow: mkShadow() });
    // Top colour band
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.5, w: colW, h: 0.08, fill: { color: colors[i % colors.length] }, line: { type: 'none' } });
    // Number circle
    slide.addShape(pres.shapes.OVAL, { x: x + colW / 2 - 0.25, y: 1.65, w: 0.5, h: 0.5, fill: { color: colors[i % colors.length] }, line: { type: 'none' } });
    slide.addText(`${i + 1}`, { x: x + colW / 2 - 0.25, y: 1.65, w: 0.5, h: 0.5, margin: 0, fontSize: 14, color: C.white, bold: true, align: 'center', valign: 'middle', fontFace: FONT_BODY });
    // Step text
    slide.addText(step, { x, y: 2.3, w: colW, h: 1.1, margin: 6, fontSize: 12, color: C.text, bold: true, align: 'center', valign: 'middle', fontFace: FONT_BODY });
    // Arrow connector
    if (i < steps.length - 1) {
      slide.addShape(pres.shapes.RECTANGLE, { x: x + colW, y: 2.45, w: 0.12, h: 0.05, fill: { color: C.muted }, line: { type: 'none' } });
    }
  });

  // Key point
  if (slideData.keyPoint) {
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.75, w: 9.0, h: 0.95, fill: { color: C.altBg }, line: { color: C.gold, pt: 1 }, shadow: mkShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.75, w: 0.06, h: 0.95, fill: { color: C.gold }, line: { type: 'none' } });
    slide.addText(slideData.keyPoint, { x: 0.7, y: 3.75, w: 8.7, h: 0.95, margin: 0, fontSize: 12, color: C.text, valign: 'middle', fontFace: FONT_BODY });
  }

  addFooter(slide, pres);
}

/** Cards layout: white cards with navy left strip */
function cardsLayout(slide, pres, slideData, accentColor) {
  slide.background = { color: C.bg };
  addTopBar(slide, pres, accentColor);
  addSectionLabel(slide, 'Key Points', accentColor);

  slide.addText(slideData.title, { x: 0.5, y: 0.45, w: 9, h: 0.7, margin: 0, fontSize: 28, color: C.navy, bold: true, fontFace: FONT_HEAD });

  const items = slideData.content;
  const availH = 4.0;
  const gapH   = 0.1;
  const cardH  = Math.min(1.05, (availH - gapH * (items.length - 1)) / items.length);
  const colors = [C.navy, C.steel, C.gold, C.navyDark, C.steel, C.navy];

  items.forEach((item, i) => {
    const y     = 1.15 + i * (cardH + gapH);
    const color = colors[i % colors.length];

    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 9.0, h: cardH, fill: { color: C.altBg }, line: { type: 'none' }, shadow: mkShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 0.07, h: cardH, fill: { color: color }, line: { type: 'none' } });

    const colonIdx = item.indexOf(':');
    if (colonIdx > 0 && colonIdx < 40) {
      slide.addText([
        { text: item.slice(0, colonIdx + 1) + ' ', options: { bold: true, color: color } },
        { text: item.slice(colonIdx + 1).trim(),    options: { color: C.text } },
      ], { x: 0.72, y, w: 8.6, h: cardH, fontSize: 13, valign: 'middle', fontFace: FONT_BODY });
    } else {
      slide.addText(item, { x: 0.72, y, w: 8.6, h: cardH, margin: 0, fontSize: 13, color: C.text, valign: 'middle', fontFace: FONT_BODY });
    }
  });

  addFooter(slide, pres);
}

/** Code layout: two-column, bullets left + code block right */
function codeLayout(slide, pres, slideData, accentColor, stepIndex) {
  slide.background = { color: C.bg };
  addTopBar(slide, pres, accentColor);

  // Step badge
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.18, w: 1.1, h: 0.6, fill: { color: accentColor }, line: { type: 'none' } });
  const badge = stepIndex != null ? `STEP ${stepIndex}` : 'CODE';
  slide.addText(badge, { x: 0.5, y: 0.18, w: 1.1, h: 0.6, margin: 0, fontSize: 11, color: C.white, bold: true, align: 'center', valign: 'middle', fontFace: FONT_BODY });
  slide.addText(slideData.title, { x: 1.75, y: 0.18, w: 8, h: 0.6, margin: 0, fontSize: 26, color: C.navy, bold: true, fontFace: FONT_HEAD });

  const codePatterns = /^(git |npm |pip |cd |ls |curl |node |python|uvicorn|http|#\s)/i;
  const prose = slideData.content.filter(c => !codePatterns.test(c.trim()));
  const code  = slideData.content.filter(c =>  codePatterns.test(c.trim()));

  if (prose.length) {
    const bulletItems = prose.map((b, i) => ({
      text: b,
      options: { bullet: true, breakLine: i < prose.length - 1, color: C.text },
    }));
    slide.addText(bulletItems, { x: 0.5, y: 1.1, w: 4.4, h: 3.8, fontSize: 13, fontFace: FONT_BODY });
  }

  // Code block — light terminal style (light grey bg, dark text)
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 0.9, w: 4.5, h: 3.8, fill: { color: '1A1A2E' }, line: { color: C.navy, pt: 1 }, shadow: mkShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 0.9, w: 4.5, h: 0.38, fill: { color: C.navyDark }, line: { type: 'none' } });
  // Three macOS-style dots
  ['E05D5D', 'F0A500', '238636'].forEach((dot, di) => {
    slide.addShape(pres.shapes.OVAL, { x: 5.22 + di * 0.22, y: 1.01, w: 0.14, h: 0.14, fill: { color: dot }, line: { type: 'none' } });
  });
  slide.addText('Terminal', { x: 5.1, y: 0.9, w: 4.5, h: 0.38, margin: 0, fontSize: 11, color: 'AABBD6', align: 'center', valign: 'middle', fontFace: FONT_BODY });

  code.forEach((line, i) => {
    const isComment = line.trim().startsWith('#');
    const isGold    = /^git /.test(line.trim());
    const isBlue    = /^(npm |node |pip |uvicorn)/.test(line.trim());
    const color = isComment ? '5A7FA0' : isGold ? C.gold : isBlue ? '7EC8E3' : 'E6EDF3';
    slide.addText(line, { x: 5.22, y: 1.38 + i * 0.35, w: 4.25, h: 0.33, margin: 0, fontSize: 11, color, fontFace: 'Consolas' });
  });

  addFooter(slide, pres);
}

/** Steps layout: numbered rows with oval counters */
function stepsLayout(slide, pres, slideData, accentColor) {
  slide.background = { color: C.bg };
  addTopBar(slide, pres, accentColor);
  addSectionLabel(slide, 'Steps', accentColor);

  slide.addText(slideData.title, { x: 0.5, y: 0.45, w: 9, h: 0.7, margin: 0, fontSize: 28, color: C.navy, bold: true, fontFace: FONT_HEAD });

  const items = slideData.content;
  const rowH  = Math.min(0.95, 4.2 / items.length);

  items.forEach((item, i) => {
    const y     = 1.15 + i * (rowH + 0.1);
    const color = STEP_COLORS[i % STEP_COLORS.length];
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 9.0, h: rowH, fill: { color: C.altBg }, line: { type: 'none' }, shadow: mkShadow() });
    slide.addShape(pres.shapes.OVAL, { x: 0.6, y: y + (rowH - 0.38) / 2, w: 0.38, h: 0.38, fill: { color: color }, line: { type: 'none' } });
    slide.addText(`${i + 1}`, { x: 0.6, y: y + (rowH - 0.38) / 2, w: 0.38, h: 0.38, margin: 0, fontSize: 13, color: C.white, bold: true, align: 'center', valign: 'middle', fontFace: FONT_BODY });
    slide.addText(item, { x: 1.15, y, w: 8.2, h: rowH, margin: 0, fontSize: 13, color: C.text, valign: 'middle', fontFace: FONT_BODY });
  });

  addFooter(slide, pres);
}

/** Three-panel layout: three equal feature panels */
function threePanelLayout(slide, pres, slideData, accentColor, stepIndex) {
  slide.background = { color: C.bg };
  addTopBar(slide, pres, accentColor);

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.18, w: 1.1, h: 0.6, fill: { color: accentColor }, line: { type: 'none' } });
  slide.addText(stepIndex != null ? `STEP ${stepIndex}` : 'FLOW', { x: 0.5, y: 0.18, w: 1.1, h: 0.6, margin: 0, fontSize: 11, color: C.white, bold: true, align: 'center', valign: 'middle', fontFace: FONT_BODY });
  slide.addText(slideData.title, { x: 1.75, y: 0.18, w: 8, h: 0.6, margin: 0, fontSize: 26, color: C.navy, bold: true, fontFace: FONT_HEAD });

  const items  = slideData.content.slice(0, 3);
  const colors = [C.navy, C.steel, C.gold];
  const icons  = ['📂', '👁️', '✅'];
  const panelW = 2.85;

  items.forEach((item, i) => {
    const x = 0.5 + i * (panelW + 0.17);
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.1, w: panelW, h: 2.6, fill: { color: C.altBg }, line: { color: colors[i], pt: 2 }, shadow: mkShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.1, w: panelW, h: 0.08, fill: { color: colors[i] }, line: { type: 'none' } });
    slide.addText(icons[i], { x, y: 1.25, w: panelW, h: 0.7, margin: 0, fontSize: 28, align: 'center' });
    slide.addText(item, { x, y: 1.95, w: panelW, h: 1.6, margin: 6, fontSize: 13, color: C.text, bold: true, align: 'center', valign: 'middle', fontFace: FONT_BODY });
    if (i < items.length - 1) {
      slide.addShape(pres.shapes.RECTANGLE, { x: x + panelW, y: 2.35, w: 0.17, h: 0.05, fill: { color: C.muted }, line: { type: 'none' } });
    }
  });

  const extra = slideData.content[3] || '';
  if (extra) {
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.95, w: 9.0, h: 0.9, fill: { color: C.altBg }, line: { color: C.gold, pt: 1 }, shadow: mkShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.95, w: 0.07, h: 0.9, fill: { color: C.gold }, line: { type: 'none' } });
    slide.addText(extra, { x: 0.72, y: 3.95, w: 8.65, h: 0.9, margin: 0, fontSize: 12, color: C.text, valign: 'middle', italic: true, fontFace: FONT_BODY });
  }

  addFooter(slide, pres);
}

// ─── Layout assignment ────────────────────────────────────────────────────────

function assignLayouts(slides) {
  let lastLayout = null;
  return slides.map((slide, i) => {
    const type  = detectContentType(slide.content);
    const title = slide.title.toLowerCase();
    let layout;

    if (type === 'code') layout = 'code';
    else if (i === 0 && slide.content.length >= 3) layout = 'flow';
    else if (slide.content.length === 3 && (title.includes('request') || title.includes('merge'))) layout = 'threepanel';
    else if (slide.content.length >= 5) layout = 'cards';
    else layout = lastLayout === 'cards' ? 'steps' : 'cards';

    if (layout === lastLayout && layout !== 'code') layout = layout === 'cards' ? 'steps' : 'cards';
    lastLayout = layout;
    return layout;
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

function renderTitleSlide(slide, pres, config) { titleSlide(slide, pres, config); }

function renderContentSlide(slide, pres, slideData, layoutKey, slideIndex) {
  const accent   = ACCENT_CYCLE[slideIndex % ACCENT_CYCLE.length];
  const stepMatch = slideData.title.match(/step\s*(\d+)/i);
  const stepNum  = stepMatch ? parseInt(stepMatch[1]) : null;

  switch (layoutKey) {
    case 'flow':       flowLayout(slide, pres, slideData, accent); break;
    case 'threepanel': threePanelLayout(slide, pres, slideData, accent, stepNum); break;
    case 'code':       codeLayout(slide, pres, slideData, accent, stepNum); break;
    case 'steps':      stepsLayout(slide, pres, slideData, accent); break;
    case 'cards':
    default:           cardsLayout(slide, pres, slideData, accent); break;
  }
}

module.exports = { assignLayouts, renderTitleSlide, renderContentSlide };
