/**
 * slide-designer.js
 *
 * Intelligent layout engine following the SKILL.md design principles:
 *  - Every slide needs a visual element (shape, icon, card, code block)
 *  - Vary layouts across slides — never repeat the same template
 *  - Pick a bold, topic-matched color palette
 *  - Titles 36-44pt, body 14-16pt, minimum 0.5" margins
 *  - NEVER use accent lines under titles
 *  - NEVER reuse option objects across addShape calls (PptxGenJS mutates them)
 */

// ─── Palette ─────────────────────────────────────────────────────────────────
// "Midnight Executive" adapted for a tech/developer feel (GitHub-inspired dark)
const C = {
  darkBg:   '0D1117',
  navyBg:   '161B22',
  cardBg:   '21262D',
  border:   '30363D',
  accent:   '238636',   // GitHub green
  blue:     '1F6FEB',   // GitHub blue
  purple:   '9E6ADE',
  white:    'FFFFFF',
  offWhite: 'E6EDF3',
  muted:    '8B949E',
};

// Fresh shadow object every call (PptxGenJS mutates options in-place)
const mkShadow = () => ({ type: 'outer', blur: 10, offset: 3, color: '000000', opacity: 0.3, angle: 135 });

// Step badge colors cycle
const STEP_COLORS = [C.accent, C.blue, C.purple, 'F0A500', 'E05D5D'];

// ─── Layout helpers ───────────────────────────────────────────────────────────

/** Shared footer bar */
function addFooter(slide, pres, label) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.3, w: 10, h: 0.325,
    fill: { color: C.navyBg }, line: { type: 'none' },
  });
  slide.addText(label, {
    x: 0, y: 5.3, w: 10, h: 0.325, margin: 0,
    fontSize: 11, color: C.muted, align: 'center', valign: 'middle',
  });
}

/** Thin top accent bar */
function addTopBar(slide, pres, color) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: color || C.accent }, line: { type: 'none' },
  });
}

// ─── Detect content type ──────────────────────────────────────────────────────

/**
 * Classify content items to pick the best layout.
 * Returns: 'code' | 'steps' | 'cards' | 'flow' | 'bullets'
 */
function detectContentType(content) {
  const codePatterns = /^(git |npm |pip |cd |ls |curl |node |python|uvicorn|http)/i;
  const codeCount = content.filter(c => codePatterns.test(c.trim())).length;
  if (codeCount >= 2) return 'code';

  const stepPatterns = /^step\s*\d|^\d+[.)]/i;
  const stepCount = content.filter(c => stepPatterns.test(c.trim())).length;
  if (stepCount >= 2) return 'steps';

  if (content.length >= 4 && content.every(c => c.length < 60)) return 'cards';
  if (content.length <= 3 && content.some(c => c.length > 60)) return 'bullets';

  return 'bullets';
}

// ─── Slide layouts ────────────────────────────────────────────────────────────

/** Layout 0: Title slide */
function titleSlide(slide, pres, config) {
  slide.background = { color: C.darkBg };
  addTopBar(slide, pres, C.accent);

  // Decorative circles top-right
  slide.addShape(pres.shapes.OVAL, { x: 7.8, y: -0.3, w: 3.0, h: 3.0, fill: { color: C.navyBg }, line: { type: 'none' } });
  slide.addShape(pres.shapes.OVAL, { x: 8.5, y: 2.8,  w: 2.0, h: 2.0, fill: { color: C.navyBg }, line: { type: 'none' } });

  // Brand tag
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.6, w: 1.8, h: 0.55, fill: { color: C.cardBg }, line: { color: C.accent, pt: 1 }, shadow: mkShadow() });
  slide.addText('⬛ GitHub', { x: 0.5, y: 0.6, w: 1.8, h: 0.55, margin: 6, fontSize: 12, color: C.white, bold: true, align: 'center', valign: 'middle' });

  // Split title: first word in white, rest in accent
  const words = config.title.split(' ');
  const first = words[0];
  const rest = words.slice(1).join(' ');

  slide.addText(first, { x: 0.5, y: 1.4, w: 9, h: 0.9, margin: 0, fontSize: 54, color: C.white, bold: true, fontFace: 'Calibri' });
  slide.addText(rest || '', { x: 0.5, y: 2.2, w: 7, h: 0.9, margin: 0, fontSize: 54, color: C.accent, bold: true, fontFace: 'Calibri' });

  // Tagline from first content item or subtitle
  const tag = config.subtitle || (config.slides[0] && config.slides[0].content[0]) || '';
  slide.addText(tag, { x: 0.5, y: 3.2, w: 7, h: 0.5, fontSize: 16, color: C.muted, italic: true });

  addFooter(slide, pres, 'Training Guide');
}

/** Layout A: Flow diagram (4-step horizontal flow) */
function flowLayout(slide, pres, slideData, accentColor) {
  slide.background = { color: C.darkBg };
  addTopBar(slide, pres, accentColor);

  slide.addText(slideData.title, { x: 0.4, y: 0.2, w: 9, h: 0.7, margin: 0, fontSize: 30, color: C.white, bold: true, fontFace: 'Calibri' });
  const sub = slideData.content[0] || '';
  slide.addText(sub, { x: 0.4, y: 0.85, w: 9, h: 0.4, margin: 0, fontSize: 14, color: C.muted, italic: true });

  const steps = slideData.content.slice(1);
  const colors = [C.accent, C.blue, C.purple, 'F0A500'];
  const colW = steps.length > 0 ? Math.min(2.2, 9.0 / steps.length) : 2.2;

  steps.forEach((step, i) => {
    const x = 0.4 + i * (colW + 0.1);
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.5, w: colW, h: 1.7, fill: { color: C.cardBg }, line: { color: colors[i % colors.length], pt: 2 }, shadow: mkShadow() });
    slide.addText(`${i + 1}`, { x, y: 1.5, w: colW, h: 0.5, margin: 0, fontSize: 20, color: colors[i % colors.length], bold: true, align: 'center' });
    slide.addText(step, { x, y: 1.95, w: colW, h: 1.1, margin: 4, fontSize: 13, color: C.white, bold: true, align: 'center', valign: 'middle' });
    if (i < steps.length - 1) {
      slide.addShape(pres.shapes.RECTANGLE, { x: x + colW, y: 2.3, w: 0.1, h: 0.05, fill: { color: C.muted }, line: { type: 'none' } });
    }
  });

  // Key point box using remaining content if any
  const keyPoint = slideData.keyPoint;
  if (keyPoint) {
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 3.45, w: 9.2, h: 1.0, fill: { color: C.navyBg }, line: { color: accentColor, pt: 1 }, shadow: mkShadow() });
    slide.addText(keyPoint, { x: 0.6, y: 3.45, w: 8.8, h: 1.0, fontSize: 13, color: C.offWhite, valign: 'middle' });
  }

  addFooter(slide, pres, 'GitHub Ways of Working');
}

/** Layout B: Cards (icon + header + body rows) */
function cardsLayout(slide, pres, slideData, accentColor) {
  slide.background = { color: C.darkBg };
  addTopBar(slide, pres, accentColor);

  slide.addText(slideData.title, { x: 0.4, y: 0.2, w: 9, h: 0.7, margin: 0, fontSize: 30, color: C.white, bold: true, fontFace: 'Calibri' });

  const items = slideData.content;
  const availH = 4.0; // space between title and footer
  const gapH = 0.08;
  const cardH = Math.min(1.1, (availH - gapH * (items.length - 1)) / items.length);
  const colors = [C.accent, C.blue, C.purple, 'F0A500', 'E05D5D', C.accent];

  items.forEach((item, i) => {
    const y = 1.1 + i * (cardH + 0.08);
    const color = colors[i % colors.length];

    slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 9.2, h: cardH, fill: { color: C.cardBg }, line: { color: color, pt: 0 }, shadow: mkShadow() });
    // Left accent strip
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 0.06, h: cardH, fill: { color: color }, line: { type: 'none' } });

    // Split "Title: body" or show as-is
    const colonIdx = item.indexOf(':');
    if (colonIdx > 0 && colonIdx < 40) {
      const label = item.slice(0, colonIdx + 1);
      const body  = item.slice(colonIdx + 1).trim();
      slide.addText([
        { text: label + ' ', options: { bold: true, color: color } },
        { text: body,         options: { color: C.offWhite } },
      ], { x: 0.6, y, w: 8.9, h: cardH, fontSize: 13, valign: 'middle' });
    } else {
      slide.addText(item, { x: 0.6, y, w: 8.9, h: cardH, margin: 0, fontSize: 13, color: C.offWhite, valign: 'middle' });
    }
  });

  addFooter(slide, pres, 'GitHub Ways of Working');
}

/** Layout C: Two-column — bullets left, code block right */
function codeLayout(slide, pres, slideData, accentColor, stepIndex) {
  slide.background = { color: C.darkBg };
  addTopBar(slide, pres, accentColor);

  // Step badge
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 0.18, w: 1.1, h: 0.6, fill: { color: accentColor }, line: { type: 'none' } });
  const badgeLabel = stepIndex != null ? `STEP ${stepIndex}` : slideData.title.split(' ')[0].toUpperCase();
  slide.addText(badgeLabel, { x: 0.4, y: 0.18, w: 1.1, h: 0.6, margin: 0, fontSize: 11, color: C.white, bold: true, align: 'center', valign: 'middle' });

  slide.addText(slideData.title, { x: 1.65, y: 0.18, w: 8, h: 0.6, margin: 0, fontSize: 28, color: C.white, bold: true, fontFace: 'Calibri' });

  // Separate prose lines from code lines
  const codePatterns = /^(git |npm |pip |cd |ls |curl |node |python|uvicorn|http|#\s)/i;
  const prose = slideData.content.filter(c => !codePatterns.test(c.trim()));
  const code  = slideData.content.filter(c =>  codePatterns.test(c.trim()));

  // Left: bullet points for prose
  const bulletItems = prose.map((b, i) => ({
    text: b,
    options: { bullet: true, breakLine: i < prose.length - 1, color: C.offWhite },
  }));
  if (bulletItems.length) {
    slide.addText(bulletItems, { x: 0.4, y: 1.1, w: 4.5, h: 3.8, fontSize: 13, fontFace: 'Calibri' });
  }

  // Right: terminal code block
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 0.9, w: 4.4, h: 3.5, fill: { color: C.navyBg }, line: { color: C.border, pt: 1 }, shadow: mkShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 0.9, w: 4.4, h: 0.38, fill: { color: C.border }, line: { type: 'none' } });
  slide.addText('Terminal', { x: 5.2, y: 0.9, w: 4.4, h: 0.38, margin: 0, fontSize: 11, color: C.muted, align: 'center', valign: 'middle' });

  code.forEach((line, i) => {
    const isComment = line.trim().startsWith('#');
    const isGreen   = /^git /.test(line.trim());
    const isBlue    = /^(npm |node |pip |uvicorn)/.test(line.trim());
    const color = isComment ? C.muted : isGreen ? C.accent : isBlue ? C.blue : C.white;
    slide.addText(line, { x: 5.35, y: 1.38 + i * 0.35, w: 4.1, h: 0.33, margin: 0, fontSize: 11, color, fontFace: 'Consolas' });
  });

  addFooter(slide, pres, 'GitHub Ways of Working');
}

/** Layout D: Three-panel flow (Open → Review → Merge) */
function threePanelLayout(slide, pres, slideData, accentColor, stepIndex) {
  slide.background = { color: C.darkBg };
  addTopBar(slide, pres, accentColor);

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 0.18, w: 1.1, h: 0.6, fill: { color: accentColor }, line: { type: 'none' } });
  const badge = stepIndex != null ? `STEP ${stepIndex}` : 'FLOW';
  slide.addText(badge, { x: 0.4, y: 0.18, w: 1.1, h: 0.6, margin: 0, fontSize: 11, color: C.white, bold: true, align: 'center', valign: 'middle' });
  slide.addText(slideData.title, { x: 1.65, y: 0.18, w: 8, h: 0.6, margin: 0, fontSize: 28, color: C.white, bold: true, fontFace: 'Calibri' });

  const items = slideData.content.slice(0, 3);
  const panelColors = [C.blue, C.purple, C.accent];
  const icons = ['📂', '👁️', '✅'];
  const panelW = 2.9;

  items.forEach((item, i) => {
    const x = 0.4 + i * (panelW + 0.15);
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.1, w: panelW, h: 2.5, fill: { color: C.cardBg }, line: { color: panelColors[i], pt: 2 }, shadow: mkShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.1, w: panelW, h: 0.07, fill: { color: panelColors[i] }, line: { type: 'none' } });
    slide.addText(icons[i], { x, y: 1.25, w: panelW, h: 0.7, margin: 0, fontSize: 28, align: 'center' });
    slide.addText(item, { x, y: 1.95, w: panelW, h: 1.5, margin: 6, fontSize: 14, color: C.white, bold: true, align: 'center', valign: 'middle' });
    if (i < items.length - 1) {
      slide.addShape(pres.shapes.RECTANGLE, { x: x + panelW, y: 2.3, w: 0.15, h: 0.05, fill: { color: C.muted }, line: { type: 'none' } });
    }
  });

  // Info box
  const extra = slideData.content[3] || '';
  if (extra) {
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 3.85, w: 9.2, h: 0.95, fill: { color: C.navyBg }, line: { color: accentColor, pt: 1 }, shadow: mkShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 3.85, w: 0.06, h: 0.95, fill: { color: accentColor }, line: { type: 'none' } });
    slide.addText(extra, { x: 0.6, y: 3.85, w: 8.8, h: 0.95, margin: 0, fontSize: 13, color: C.offWhite, valign: 'middle', italic: true });
  }

  addFooter(slide, pres, 'GitHub Ways of Working');
}

/** Layout E: Numbered step list (left circles + card rows) */
function stepsLayout(slide, pres, slideData, accentColor) {
  slide.background = { color: C.darkBg };
  addTopBar(slide, pres, accentColor);

  slide.addText(slideData.title, { x: 0.4, y: 0.2, w: 9, h: 0.7, margin: 0, fontSize: 30, color: C.white, bold: true, fontFace: 'Calibri' });

  const items = slideData.content;
  const rowH = Math.min(1.0, 4.2 / items.length);

  items.forEach((item, i) => {
    const y = 1.1 + i * (rowH + 0.1);
    const color = STEP_COLORS[i % STEP_COLORS.length];
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 9.2, h: rowH, fill: { color: C.cardBg }, line: { color: color, pt: 1 }, shadow: mkShadow() });
    slide.addShape(pres.shapes.OVAL, { x: 0.5, y: y + (rowH - 0.38) / 2, w: 0.38, h: 0.38, fill: { color: color }, line: { type: 'none' } });
    slide.addText(`${i + 1}`, { x: 0.5, y: y + (rowH - 0.38) / 2, w: 0.38, h: 0.38, margin: 0, fontSize: 13, color: C.darkBg, bold: true, align: 'center', valign: 'middle' });
    slide.addText(item, { x: 1.05, y, w: 8.4, h: rowH, margin: 0, fontSize: 13, color: C.offWhite, valign: 'middle' });
  });

  addFooter(slide, pres, 'GitHub Ways of Working');
}

// ─── Layout rotator ───────────────────────────────────────────────────────────

const ACCENT_CYCLE = [C.accent, C.blue, C.purple, 'F0A500', C.accent, C.blue];

/**
 * Assign the best layout to each content slide.
 * Cycles through distinct layouts to avoid repetition.
 *
 * @param {Object[]} slides - Array of slide config objects
 * @returns {string[]} Array of layout keys
 */
function assignLayouts(slides) {
  const layouts = [];
  let stepCounter = 1;
  let lastLayout = null;

  slides.forEach((slide, i) => {
    const type = detectContentType(slide.content);
    const title = slide.title.toLowerCase();

    let layout;

    if (type === 'code') {
      layout = 'code';
    } else if (type === 'steps' || /step\s*\d/i.test(title)) {
      layout = 'code'; // code layout doubles as step+code
    } else if (i === 0 && slide.content.length >= 3 && slide.content.length <= 5) {
      layout = 'flow'; // First content slide → flow overview
    } else if (slide.content.length === 3 && title.includes('request') || title.includes('pr') || title.includes('merge')) {
      layout = 'threepanel';
    } else if (slide.content.length >= 5) {
      layout = 'cards';
    } else {
      // Alternate between cards and steps to avoid repetition
      layout = lastLayout === 'cards' ? 'steps' : 'cards';
    }

    // Avoid same layout twice in a row (except code)
    if (layout === lastLayout && layout !== 'code') {
      layout = layout === 'cards' ? 'steps' : 'cards';
    }

    layouts.push(layout);
    lastLayout = layout;
  });

  return layouts;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Render a title slide.
 */
function renderTitleSlide(slide, pres, config) {
  titleSlide(slide, pres, config);
}

/**
 * Render a content slide using the best layout for its content.
 *
 * @param {Object} slide         - PptxGenJS slide object
 * @param {Object} pres          - PptxGenJS presentation object
 * @param {Object} slideData     - { title, content, keyPoint? }
 * @param {string} layoutKey     - 'flow' | 'cards' | 'code' | 'threepanel' | 'steps'
 * @param {number} slideIndex    - 0-based index among content slides
 */
function renderContentSlide(slide, pres, slideData, layoutKey, slideIndex) {
  const accent = ACCENT_CYCLE[slideIndex % ACCENT_CYCLE.length];

  // Detect step number from title like "Step 1 - ..." or "Step 1:"
  const stepMatch = slideData.title.match(/step\s*(\d+)/i);
  const stepNum = stepMatch ? parseInt(stepMatch[1]) : null;

  switch (layoutKey) {
    case 'flow':
      flowLayout(slide, pres, slideData, accent);
      break;
    case 'threepanel':
      threePanelLayout(slide, pres, slideData, accent, stepNum);
      break;
    case 'code':
      codeLayout(slide, pres, slideData, accent, stepNum);
      break;
    case 'steps':
      stepsLayout(slide, pres, slideData, accent);
      break;
    case 'cards':
    default:
      cardsLayout(slide, pres, slideData, accent);
      break;
  }
}

module.exports = { assignLayouts, renderTitleSlide, renderContentSlide };
