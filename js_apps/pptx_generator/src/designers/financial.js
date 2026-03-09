/**
 * designers/financial.js
 * Theme: Financial  —  Banking / investment / fintech / boardroom
 * Palette: Deep navy + gold. Data-dense. Cambria serif. Authoritative.
 */
const { detectLayout, mkShadow } = require('../_base');
const L = require('../_layouts');

const THEME = {
  bg: 'F7F8FA', cardBg: 'FFFFFF', titleColor: '0A1628', text: '0A1628',
  muted: '6C7A8D', onAccent: 'FFFFFF', accent: '0A1628', secondary: '1B4F8A', tertiary: 'B8962E',
  footerBg: '0A1628', footerText: '6C7A8D', footerLabel: 'For Authorised Recipients Only',
  fontHead: 'Cambria', fontBody: 'Calibri',
  codeBg: '0A1628', codeHeader: '060E1A', codeBorder: '1B4F8A',
  codeMuted: '4A5E78', codeComment: '4A5E78', codeGreen: 'B8962E', codeBlue: '7EB8E8', codeDefault: 'D4E4F7',
  accentCycle: ['0A1628', '1B4F8A', 'B8962E', '2E6DB4', '0A1628', '1B4F8A'],
};

const SUPPORTED = ['flow','cards','steps','code','two-column','stat-callout','quote','three-panel','agenda','image-text','bullets'];

function renderTitleSlide(slide, pres, config) {
  slide.background = { color: THEME.bg };

  // Full dark left panel
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: THEME.accent }, line: { type: 'none' } });
  // Gold accent stripe at bottom
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.0, w: 10, h: 0.625, fill: { color: 'B8962E' }, line: { type: 'none' } });
  // Subtle grid lines (decorative)
  for (let i = 0; i < 5; i++) {
    slide.addShape(pres.shapes.RECTANGLE, { x: i * 2, y: 0, w: 0.005, h: 5.0, fill: { color: '1B4F8A' }, line: { type: 'none' } });
  }

  slide.addText('FINANCIAL ADVISORY', {
    x: 0.6, y: 0.4, w: 9, h: 0.35, margin: 0,
    fontSize: 10, color: 'B8962E', bold: true, fontFace: THEME.fontBody, charSpacing: 4,
  });
  slide.addText(config.title, {
    x: 0.6, y: 1.0, w: 8.5, h: 2.5, margin: 0,
    fontSize: 46, color: 'FFFFFF', bold: true, fontFace: THEME.fontHead,
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 3.6, w: 8.5, h: 0.04, fill: { color: '1B4F8A' }, line: { type: 'none' } });
  slide.addText(config.subtitle || '', {
    x: 0.6, y: 3.75, w: 8.5, h: 0.5, margin: 0,
    fontSize: 15, color: '6C7A8D', italic: true, fontFace: THEME.fontBody,
  });
  slide.addText(THEME.footerLabel, { x: 0, y: 5.0, w: 10, h: 0.625, margin: 0, fontSize: 10, color: '0A1628', align: 'center', valign: 'middle', fontFace: THEME.fontBody });
}

function assignLayouts(slides) {
  let last = null;
  return slides.map((s, i) => { const l = detectLayout(s, i, last, SUPPORTED); last = l; return l; });
}

function renderContentSlide(slide, pres, slideData, layoutKey, slideIndex) {
  L.render(layoutKey, slide, pres, slideData, THEME.accentCycle[slideIndex % THEME.accentCycle.length], THEME);
}

module.exports = { assignLayouts, renderTitleSlide, renderContentSlide, SUPPORTED_LAYOUTS: SUPPORTED };
