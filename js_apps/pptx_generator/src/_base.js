/**
 * _base.js — Shared utilities for all designer themes
 *
 * Import in any designer:
 *   const { detectContentType, detectLayout, mkShadow, hexLighten } = require('./_base');
 *
 * Every designer must export:
 *   THEME        — palette + font config object
 *   assignLayouts(slides)                               → string[]
 *   renderTitleSlide(slide, pres, config)               → void
 *   renderContentSlide(slide, pres, data, layout, idx)  → void
 */

// ─── Content type detection ───────────────────────────────────────────────────

const CODE_PATTERN  = /^(git |npm |pip |cd |ls |curl |node |python|uvicorn|http|docker|kubectl|brew |yarn |make |bash |sh |#\s)/i;
const STEP_PATTERN  = /^step\s*\d|^\d+[.)]\s/i;
const STAT_PATTERN  = /^\d[\d,.%x]+\s*[:\-–]/;   // "99.9%: uptime", "10x - faster"
const QUOTE_PATTERN = /^["'"']/;                   // starts with a quote mark

/**
 * Detect the semantic type of a slide's content array.
 * @param {string[]} content
 * @returns {'code'|'steps'|'stats'|'quote'|'cards'|'bullets'}
 */
function detectContentType(content) {
  if (!content || content.length === 0) return 'bullets';
  const codeCount  = content.filter(c => CODE_PATTERN.test(c.trim())).length;
  const stepCount  = content.filter(c => STEP_PATTERN.test(c.trim())).length;
  const statCount  = content.filter(c => STAT_PATTERN.test(c.trim())).length;
  const quoteCount = content.filter(c => QUOTE_PATTERN.test(c.trim())).length;

  if (codeCount  >= 2) return 'code';
  if (stepCount  >= 2) return 'steps';
  if (statCount  >= 2) return 'stats';
  if (quoteCount >= 1 && content.length <= 3) return 'quote';
  if (content.length >= 4 && content.every(c => c.length < 80)) return 'cards';
  return 'bullets';
}

/**
 * Determine the best layout key for a slide, respecting:
 *   1. Explicit `layout:` field in YAML (author intent — highest priority)
 *   2. Structured content shape (left/right, stats, quote)
 *   3. Inferred content type
 *   4. Position in deck (first slide → flow overview)
 *   5. Anti-repeat rule (don't use same layout twice in a row)
 *
 * @param {Object}   slideData   - parsed slide object
 * @param {number}   index       - 0-based position in content slides array
 * @param {string}   lastLayout  - layout used on previous slide
 * @param {string[]} supported   - layouts this theme supports
 * @returns {string} layout key
 */
function detectLayout(slideData, index, lastLayout, supported) {
  // 1. Author override
  if (slideData.layout && supported.includes(slideData.layout)) {
    return slideData.layout;
  }

  // 2. Structured content shapes
  if (slideData.content && typeof slideData.content === 'object' && !Array.isArray(slideData.content)) {
    if (slideData.content.left && slideData.content.right) return 'two-column';
  }

  const items = Array.isArray(slideData.content) ? slideData.content : [];
  const type  = detectContentType(items);
  const title = (slideData.title || '').toLowerCase();

  // 3. Semantic type mapping
  let layout;
  if      (type === 'code')  layout = 'code';
  else if (type === 'stats') layout = supported.includes('stat-callout') ? 'stat-callout' : 'cards';
  else if (type === 'quote') layout = supported.includes('quote')        ? 'quote'        : 'cards';
  else if (type === 'steps') layout = 'steps';
  else if (index === 0 && items.length >= 3 && items.length <= 6) layout = 'flow';
  else if (title.includes('agenda') || title.includes('overview')) layout = 'flow';
  else if (title.match(/step\s*\d/i))  layout = 'code';
  else if (title.includes('vs') || title.includes('comparison') || title.includes('before')) layout = supported.includes('two-column') ? 'two-column' : 'cards';
  else if (items.length >= 5) layout = 'cards';
  else layout = lastLayout === 'cards' ? 'steps' : 'cards';

  // 4. Anti-repeat (except code which legitimately repeats)
  if (layout === lastLayout && layout !== 'code' && layout !== 'quote') {
    layout = layout === 'cards' ? 'steps' : 'cards';
  }

  // 5. Fallback: if theme doesn't support derived layout, use cards
  if (!supported.includes(layout)) layout = 'cards';

  return layout;
}

// ─── Shadow factory (NEVER reuse — PptxGenJS mutates option objects) ──────────

/**
 * @param {Object} opts - override any shadow property
 */
function mkShadow(opts = {}) {
  return Object.assign({ type: 'outer', blur: 8, offset: 2, color: '000000', opacity: 0.12, angle: 135 }, opts);
}

// ─── Color utilities ──────────────────────────────────────────────────────────

/**
 * Parse "Label: rest of text" into { label, body } or null.
 */
function parseColonLabel(text) {
  const idx = text.indexOf(':');
  if (idx > 0 && idx < 45) {
    return { label: text.slice(0, idx + 1), body: text.slice(idx + 1).trim() };
  }
  return null;
}

/**
 * Flatten slide content — handles both array and {left, right} shapes.
 * @returns {string[]}
 */
function flattenContent(content) {
  if (!content) return [];
  if (Array.isArray(content)) return content;
  // structured {left, right, stats, ...}
  return [
    ...(content.left  || []),
    ...(content.right || []),
    ...(content.stats || []),
  ];
}

/**
 * Split content array into prose lines and code lines.
 */
function splitCodeProse(content) {
  const items = flattenContent(content);
  return {
    prose: items.filter(c => !CODE_PATTERN.test(c.trim())),
    code:  items.filter(c =>  CODE_PATTERN.test(c.trim())),
  };
}

/**
 * Colour-code a terminal line based on its content.
 * Returns a hex colour string.
 */
function codeLineColor(line, palette) {
  const t = line.trim();
  if (t.startsWith('#'))                           return palette.codeComment;
  if (/^git /.test(t))                             return palette.codeGreen;
  if (/^(npm |yarn |node |pip |uvicorn)/.test(t))  return palette.codeBlue;
  if (/^(docker|kubectl)/.test(t))                 return palette.codeBlue;
  return palette.codeDefault;
}

// ─── Shared layout primitives ─────────────────────────────────────────────────

/**
 * Render a standard card row with left accent strip.
 */
function renderCardRow(slide, pres, item, x, y, w, h, color, theme) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: theme.cardBg }, line: { type: 'none' },
    shadow: mkShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.07, h,
    fill: { color }, line: { type: 'none' },
  });
  const parsed = parseColonLabel(item);
  if (parsed) {
    slide.addText([
      { text: parsed.label + ' ', options: { bold: true,  color } },
      { text: parsed.body,        options: { color: theme.text } },
    ], { x: x + 0.2, y, w: w - 0.25, h, fontSize: 13, valign: 'middle', fontFace: theme.fontBody });
  } else {
    slide.addText(item, {
      x: x + 0.2, y, w: w - 0.25, h, margin: 0,
      fontSize: 13, color: theme.text, valign: 'middle', fontFace: theme.fontBody,
    });
  }
}

/**
 * Render a terminal code block (dark panel + syntax coloured lines).
 */
function renderCodeBlock(slide, pres, codeLines, x, y, w, h, theme) {
  const headerH = 0.38;
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: theme.codeBg }, line: { color: theme.codeBorder, pt: 1 },
    shadow: mkShadow({ opacity: 0.25 }),
  });
  // Header bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h: headerH,
    fill: { color: theme.codeHeader }, line: { type: 'none' },
  });
  // macOS-style traffic dots
  ['E05D5D', 'F0A500', '238636'].forEach((dot, i) => {
    slide.addShape(pres.shapes.OVAL, {
      x: x + 0.12 + i * 0.22, y: y + 0.12,
      w: 0.14, h: 0.14,
      fill: { color: dot }, line: { type: 'none' },
    });
  });
  slide.addText('Terminal', {
    x, y, w, h: headerH, margin: 0,
    fontSize: 11, color: theme.codeMuted, align: 'center', valign: 'middle', fontFace: theme.fontBody,
  });
  // Code lines
  codeLines.forEach((line, i) => {
    slide.addText(line, {
      x: x + 0.15, y: y + headerH + 0.08 + i * 0.35,
      w: w - 0.2, h: 0.33, margin: 0,
      fontSize: 11, color: codeLineColor(line, theme), fontFace: 'Consolas',
    });
  });
}

/**
 * Standard content slide header (top bar + title).
 */
function renderSlideHeader(slide, pres, slideData, accentColor, theme, opts = {}) {
  const { topBarH = 0.1, titleY = 0.22, titleSize = 30, sectionLabel = null } = opts;

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: topBarH,
    fill: { color: accentColor }, line: { type: 'none' },
  });

  if (sectionLabel) {
    slide.addText(sectionLabel.toUpperCase(), {
      x: 0.5, y: topBarH + 0.05, w: 9, h: 0.28, margin: 0,
      fontSize: 9, color: accentColor, bold: true,
      fontFace: theme.fontBody, charSpacing: 3,
    });
  }

  slide.addText(slideData.title, {
    x: 0.5, y: sectionLabel ? topBarH + 0.28 : titleY,
    w: 9, h: 0.75, margin: 0,
    fontSize: titleSize, color: theme.titleColor,
    bold: true, fontFace: theme.fontHead,
  });
}

/**
 * Standard footer bar.
 */
function renderFooter(slide, pres, label, theme) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.28, w: 10, h: 0.345,
    fill: { color: theme.footerBg }, line: { type: 'none' },
  });
  slide.addText(label || '', {
    x: 0.5, y: 5.28, w: 9, h: 0.345, margin: 0,
    fontSize: 10, color: theme.footerText,
    align: 'center', valign: 'middle', fontFace: theme.fontBody,
  });
}

/**
 * Step badge (coloured rectangle + label, e.g. "STEP 1").
 */
function renderStepBadge(slide, pres, label, x, y, w, h, color, textColor) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, fill: { color }, line: { type: 'none' },
  });
  slide.addText(label, {
    x, y, w, h, margin: 0,
    fontSize: 11, color: textColor || 'FFFFFF',
    bold: true, align: 'center', valign: 'middle',
  });
}

module.exports = {
  detectContentType,
  detectLayout,
  mkShadow,
  parseColonLabel,
  flattenContent,
  splitCodeProse,
  codeLineColor,
  renderCardRow,
  renderCodeBlock,
  renderSlideHeader,
  renderFooter,
  renderStepBadge,
  CODE_PATTERN,
};
