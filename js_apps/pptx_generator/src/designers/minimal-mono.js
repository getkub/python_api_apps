/**
 * designers/minimal-mono.js
 * Theme: Minimal Mono  —  Ultra-clean / editorial / design agencies
 * Palette: Charcoal + off-white. Near-zero decoration. Impact typography.
 */
const { detectLayout } = require('../_base');
const L = require('../_layouts');

const THEME = {
  bg: 'F8F8F6', cardBg: 'FFFFFF', titleColor: '1A1A1A', text: '2C2C2C',
  muted: '9A9A9A', onAccent: 'FFFFFF', accent: '1A1A1A', secondary: '555555', tertiary: '9A9A9A',
  footerBg: '1A1A1A', footerText: '9A9A9A', footerLabel: '',
  fontHead: 'Arial Black', fontBody: 'Calibri',
  codeBg: '1A1A1A', codeHeader: '111111', codeBorder: '333333',
  codeMuted: '666666', codeComment: '666666', codeGreen: '9A9A9A', codeBlue: 'CCCCCC', codeDefault: 'F8F8F6',
  accentCycle: ['1A1A1A', '555555', '9A9A9A', '1A1A1A', '555555', '9A9A9A'],
};

const SUPPORTED = ['flow','cards','steps','code','two-column','stat-callout','quote','three-panel','agenda','bullets'];

function renderTitleSlide(slide, pres, config) {
  slide.background = { color: THEME.bg };
  // Thick left bar — the only decoration
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.35, h: 5.625, fill: { color: THEME.accent }, line: { type: 'none' } });
  // Bold oversized title
  slide.addText(config.title, {
    x: 0.65, y: 0.8, w: 9, h: 3.0, margin: 0,
    fontSize: 64, color: THEME.accent, bold: true, fontFace: THEME.fontHead,
  });
  // Thin rule
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.65, y: 3.85, w: 9, h: 0.03, fill: { color: THEME.muted }, line: { type: 'none' } });
  slide.addText(config.subtitle || '', {
    x: 0.65, y: 4.0, w: 9, h: 0.5, margin: 0,
    fontSize: 14, color: THEME.muted, fontFace: THEME.fontBody,
  });
  // Footer
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.28, w: 10, h: 0.345, fill: { color: THEME.footerBg }, line: { type: 'none' } });
  slide.addText(config.title.toUpperCase(), { x: 0, y: 5.28, w: 10, h: 0.345, margin: 0, fontSize: 9, color: THEME.footerText, align: 'center', valign: 'middle', charSpacing: 4 });
}

function assignLayouts(slides) {
  let last = null;
  return slides.map((s, i) => { const l = detectLayout(s, i, last, SUPPORTED); last = l; return l; });
}

function renderContentSlide(slide, pres, slideData, layoutKey, slideIndex) {
  L.render(layoutKey, slide, pres, slideData, THEME.accentCycle[slideIndex % THEME.accentCycle.length], THEME);
}

module.exports = { assignLayouts, renderTitleSlide, renderContentSlide, SUPPORTED_LAYOUTS: SUPPORTED };
