/**
 * designers/startup-bold.js
 *
 * Theme: Startup Bold
 * Feel: Modern startup / product pitch — vibrant coral + teal, bold typography,
 *       rounded shapes, high energy. Trebuchet MS headings.
 * Palette: "Coral Energy" from SKILL.md
 */

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:       'FAFAFA',
  darkBg:   '1A1A2E',   // for title slide
  coral:    'F96167',   // primary
  teal:     '028090',   // secondary
  gold:     'F9E795',   // accent (light, used sparingly)
  navy:     '2F3C7E',   // dark anchor
  white:    'FFFFFF',
  offWhite: 'F5F5F5',
  text:     '1A1A2E',
  muted:    '7A869A',
  cardBg:   'FFFFFF',
  border:   'E8ECF0',
};

const FOOTER_LABEL  = 'Startup Bold — Confidential';
const BRAND_NAME    = '▶ Startup';
const FONT_HEAD     = 'Trebuchet MS';
const FONT_BODY     = 'Calibri';

const ACCENT_CYCLE  = [C.coral, C.teal, C.navy, C.coral, C.teal, C.navy];
const STEP_COLORS   = [C.coral, C.teal, C.navy, C.coral, C.teal];

const mkShadow = () => ({ type: 'outer', blur: 12, offset: 3, color: '000000', opacity: 0.1, angle: 135 });

// ─── Shared helpers ───────────────────────────────────────────────────────────

function addFooter(slide, pres, label) {
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.28, w: 10, h: 0.345, fill: { color: C.darkBg }, line: { type: 'none' } });
  slide.addText(label || FOOTER_LABEL, {
    x: 0.5, y: 5.28, w: 9, h: 0.345, margin: 0,
    fontSize: 10, color: C.muted, align: 'center', valign: 'middle', fontFace: FONT_BODY,
  });
}

function addTopBar(slide, pres, color) {
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.15, fill: { color: color || C.coral }, line: { type: 'none' } });
}

// ─── Content type detection ───────────────────────────────────────────────────

function detectContentType(content) {
  const codePatterns = /^(git |npm |pip |cd |ls |curl |node |python|uvicorn|http)/i;
  if (content.filter(c => codePatterns.test(c.trim())).length >= 2) return 'code';
  if (content.filter(c => /^step\s*\d|^\d+[.)]/i.test(c.trim())).length >= 2) return 'steps';
  if (content.length >= 4 && content.every(c => c.length < 60)) return 'cards';
  return 'bullets';
}

// ─── Layout functions ─────────────────────────────────────────────────────────

/** Title slide: dark bg, giant coral title, teal tagline */
function titleSlide(slide, pres, config) {
  slide.background = { color: C.darkBg };

  // Coral top stripe
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.5, fill: { color: C.coral }, line: { type: 'none' } });

  // Decorative teal circle bottom-right
  slide.addShape(pres.shapes.OVAL, { x: 6.5, y: 3.2, w: 4.5, h: 4.5, fill: { color: '0D2B30' }, line: { type: 'none' } });
  slide.addShape(pres.shapes.OVAL, { x: 7.5, y: 0.8, w: 2.5, h: 2.5, fill: { color: '0D2B30' }, line: { type: 'none' } });

  // Brand pill
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.7, w: 2.0, h: 0.5, fill: { color: C.teal }, line: { type: 'none' } });
  slide.addText(BRAND_NAME, { x: 0.5, y: 0.7, w: 2.0, h: 0.5, margin: 0, fontSize: 12, color: C.white, bold: true, align: 'center', valign: 'middle', fontFace: FONT_BODY });

  // Main title — bold and large
  slide.addText(config.title, {
    x: 0.5, y: 1.4, w: 6.5, h: 2.2, margin: 0,
    fontSize: 52, color: C.white, bold: true, fontFace: FONT_HEAD,
  });

  // Coral underline accent (design motif, not under title text — it's a separate horizontal rule)
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.65, w: 2.0, h: 0.1, fill: { color: C.coral }, line: { type: 'none' } });

  const tag = config.subtitle || '';
  slide.addText(tag, { x: 0.5, y: 3.85, w: 6, h: 0.5, fontSize: 16, color: C.muted, italic: true, fontFace: FONT_BODY });

  addFooter(slide, pres);
}

/** Flow layout: pill-shaped step cards */
function flowLayout(slide, pres, slideData, accentColor) {
  slide.background = { color: C.bg };
  addTopBar(slide, pres, accentColor);

  slide.addText(slideData.title, { x: 0.5, y: 0.28, w: 9, h: 0.7, margin: 0, fontSize: 30, color: C.text, bold: true, fontFace: FONT_HEAD });

  const sub = slideData.content[0] || '';
  slide.addText(sub, { x: 0.5, y: 0.92, w: 9, h: 0.38, margin: 0, fontSize: 14, color: C.muted, italic: true, fontFace: FONT_BODY });

  const steps  = slideData.content.slice(1);
  const colors = [C.coral, C.teal, C.navy, 'F0A500'];
  const colW   = Math.min(2.1, 9.0 / steps.length);

  steps.forEach((step, i) => {
    const x = 0.5 + i * (colW + 0.12);
    // Rounded-ish card (RECTANGLE for clean alignment)
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.55, w: colW, h: 1.8, fill: { color: C.cardBg }, line: { color: colors[i % colors.length], pt: 2 }, shadow: mkShadow() });
    // Coloured top
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.55, w: colW, h: 0.35, fill: { color: colors[i % colors.length] }, line: { type: 'none' } });
    slide.addText(`${i + 1}`, { x, y: 1.55, w: colW, h: 0.35, margin: 0, fontSize: 14, color: C.white, bold: true, align: 'center', valign: 'middle', fontFace: FONT_BODY });
    slide.addText(step, { x, y: 1.92, w: colW, h: 1.35, margin: 5, fontSize: 12, color: C.text, bold: true, align: 'center', valign: 'middle', fontFace: FONT_BODY });
    if (i < steps.length - 1) {
      slide.addShape(pres.shapes.RECTANGLE, { x: x + colW, y: 2.38, w: 0.12, h: 0.05, fill: { color: C.muted }, line: { type: 'none' } });
    }
  });

  if (slideData.keyPoint) {
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.6, w: 9.0, h: 0.9, fill: { color: C.cardBg }, line: { color: C.coral, pt: 1.5 }, shadow: mkShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.6, w: 0.07, h: 0.9, fill: { color: C.coral }, line: { type: 'none' } });
    slide.addText(slideData.keyPoint, { x: 0.72, y: 3.6, w: 8.65, h: 0.9, margin: 0, fontSize: 12, color: C.text, valign: 'middle', fontFace: FONT_BODY });
  }

  addFooter(slide, pres);
}

/** Cards layout: white cards with thick top bar */
function cardsLayout(slide, pres, slideData, accentColor) {
  slide.background = { color: C.bg };
  addTopBar(slide, pres, accentColor);

  slide.addText(slideData.title, { x: 0.5, y: 0.28, w: 9, h: 0.7, margin: 0, fontSize: 30, color: C.text, bold: true, fontFace: FONT_HEAD });

  const items  = slideData.content;
  const availH = 4.0;
  const gapH   = 0.1;
  const cardH  = Math.min(1.05, (availH - gapH * (items.length - 1)) / items.length);
  const colors = [C.coral, C.teal, C.navy, 'F0A500', C.coral, C.teal];

  items.forEach((item, i) => {
    const y     = 1.15 + i * (cardH + gapH);
    const color = colors[i % colors.length];

    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 9.0, h: cardH, fill: { color: C.cardBg }, line: { type: 'none' }, shadow: mkShadow() });
    // Thick left strip
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 0.1, h: cardH, fill: { color: color }, line: { type: 'none' } });

    const colonIdx = item.indexOf(':');
    if (colonIdx > 0 && colonIdx < 40) {
      slide.addText([
        { text: item.slice(0, colonIdx + 1) + ' ', options: { bold: true, color: color } },
        { text: item.slice(colonIdx + 1).trim(),    options: { color: C.text } },
      ], { x: 0.75, y, w: 8.6, h: cardH, fontSize: 13, valign: 'middle', fontFace: FONT_BODY });
    } else {
      slide.addText(item, { x: 0.75, y, w: 8.6, h: cardH, margin: 0, fontSize: 13, color: C.text, valign: 'middle', fontFace: FONT_BODY });
    }
  });

  addFooter(slide, pres);
}

/** Code layout: two-column with dark code panel */
function codeLayout(slide, pres, slideData, accentColor, stepIndex) {
  slide.background = { color: C.bg };
  addTopBar(slide, pres, accentColor);

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.22, w: 1.1, h: 0.6, fill: { color: accentColor }, line: { type: 'none' } });
  const badge = stepIndex != null ? `STEP ${stepIndex}` : 'CODE';
  slide.addText(badge, { x: 0.5, y: 0.22, w: 1.1, h: 0.6, margin: 0, fontSize: 11, color: C.white, bold: true, align: 'center', valign: 'middle', fontFace: FONT_BODY });
  slide.addText(slideData.title, { x: 1.75, y: 0.22, w: 8, h: 0.6, margin: 0, fontSize: 26, color: C.text, bold: true, fontFace: FONT_HEAD });

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

  // Dark terminal panel
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 0.9, w: 4.5, h: 3.8, fill: { color: C.darkBg }, line: { color: C.coral, pt: 1.5 }, shadow: mkShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 0.9, w: 4.5, h: 0.38, fill: { color: '111122' }, line: { type: 'none' } });
  // macOS dots
  ['F96167', 'F9E795', '028090'].forEach((dot, di) => {
    slide.addShape(pres.shapes.OVAL, { x: 5.22 + di * 0.22, y: 1.01, w: 0.14, h: 0.14, fill: { color: dot }, line: { type: 'none' } });
  });
  slide.addText('Terminal', { x: 5.1, y: 0.9, w: 4.5, h: 0.38, margin: 0, fontSize: 11, color: C.muted, align: 'center', valign: 'middle', fontFace: FONT_BODY });

  code.forEach((line, i) => {
    const isComment = line.trim().startsWith('#');
    const isCoral   = /^git /.test(line.trim());
    const isTeal    = /^(npm |node |pip |uvicorn)/.test(line.trim());
    const color = isComment ? '5A7FA0' : isCoral ? C.coral : isTeal ? '7FD6DF' : 'E6EDF3';
    slide.addText(line, { x: 5.22, y: 1.38 + i * 0.35, w: 4.25, h: 0.33, margin: 0, fontSize: 11, color, fontFace: 'Consolas' });
  });

  addFooter(slide, pres);
}

/** Steps layout */
function stepsLayout(slide, pres, slideData, accentColor) {
  slide.background = { color: C.bg };
  addTopBar(slide, pres, accentColor);

  slide.addText(slideData.title, { x: 0.5, y: 0.28, w: 9, h: 0.7, margin: 0, fontSize: 30, color: C.text, bold: true, fontFace: FONT_HEAD });

  const items = slideData.content;
  const rowH  = Math.min(0.95, 4.2 / items.length);

  items.forEach((item, i) => {
    const y     = 1.15 + i * (rowH + 0.1);
    const color = STEP_COLORS[i % STEP_COLORS.length];
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 9.0, h: rowH, fill: { color: C.cardBg }, line: { type: 'none' }, shadow: mkShadow() });
    // Numbered pill
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 0.55, h: rowH, fill: { color: color }, line: { type: 'none' } });
    slide.addText(`${i + 1}`, { x: 0.5, y, w: 0.55, h: rowH, margin: 0, fontSize: 14, color: C.white, bold: true, align: 'center', valign: 'middle', fontFace: FONT_BODY });
    slide.addText(item, { x: 1.18, y, w: 8.1, h: rowH, margin: 0, fontSize: 13, color: C.text, valign: 'middle', fontFace: FONT_BODY });
  });

  addFooter(slide, pres);
}

/** Three-panel layout */
function threePanelLayout(slide, pres, slideData, accentColor, stepIndex) {
  slide.background = { color: C.bg };
  addTopBar(slide, pres, accentColor);

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.22, w: 1.1, h: 0.6, fill: { color: accentColor }, line: { type: 'none' } });
  slide.addText(stepIndex != null ? `STEP ${stepIndex}` : 'FLOW', { x: 0.5, y: 0.22, w: 1.1, h: 0.6, margin: 0, fontSize: 11, color: C.white, bold: true, align: 'center', valign: 'middle', fontFace: FONT_BODY });
  slide.addText(slideData.title, { x: 1.75, y: 0.22, w: 8, h: 0.6, margin: 0, fontSize: 26, color: C.text, bold: true, fontFace: FONT_HEAD });

  const items  = slideData.content.slice(0, 3);
  const colors = [C.coral, C.teal, C.navy];
  const icons  = ['📂', '👁️', '✅'];
  const panelW = 2.85;

  items.forEach((item, i) => {
    const x = 0.5 + i * (panelW + 0.17);
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.1, w: panelW, h: 2.6, fill: { color: C.cardBg }, line: { color: colors[i], pt: 2 }, shadow: mkShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.1, w: panelW, h: 0.35, fill: { color: colors[i] }, line: { type: 'none' } });
    slide.addText(icons[i], { x, y: 1.5,  w: panelW, h: 0.7, margin: 0, fontSize: 28, align: 'center' });
    slide.addText(item,     { x, y: 2.2,  w: panelW, h: 1.4, margin: 6, fontSize: 13, color: C.text, bold: true, align: 'center', valign: 'middle', fontFace: FONT_BODY });
    if (i < items.length - 1) {
      slide.addShape(pres.shapes.RECTANGLE, { x: x + panelW, y: 2.35, w: 0.17, h: 0.05, fill: { color: C.muted }, line: { type: 'none' } });
    }
  });

  const extra = slideData.content[3] || '';
  if (extra) {
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.95, w: 9.0, h: 0.9, fill: { color: C.cardBg }, line: { color: C.coral, pt: 1 }, shadow: mkShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.95, w: 0.1,  h: 0.9, fill: { color: C.coral }, line: { type: 'none' } });
    slide.addText(extra, { x: 0.75, y: 3.95, w: 8.6, h: 0.9, margin: 0, fontSize: 12, color: C.text, valign: 'middle', italic: true, fontFace: FONT_BODY });
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
  const accent    = ACCENT_CYCLE[slideIndex % ACCENT_CYCLE.length];
  const stepMatch = slideData.title.match(/step\s*(\d+)/i);
  const stepNum   = stepMatch ? parseInt(stepMatch[1]) : null;

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
