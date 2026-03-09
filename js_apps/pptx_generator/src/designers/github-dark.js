/**
 * designers/github-dark.js
 * Theme: GitHub Dark  —  Developer-focused, dark theme with GitHub colors
 * Palette: GitHub dark theme colors - dark backgrounds, green accents
 */
const { detectLayout, mkShadow } = require('../_base');
const L = require('../_layouts');

const THEME = {
  bg: '0D1117', cardBg: '161B22', titleColor: 'FFFFFF', text: 'E6EDF3',
  muted: '8B949E', onAccent: 'FFFFFF', accent: '238636', secondary: '1F6FEB', tertiary: '9E6ADE',
  footerBg: '161B22', footerText: '8B949E', footerLabel: 'GitHub Training',
  fontHead: 'Calibri', fontBody: 'Calibri',
  codeBg: '0D1117', codeHeader: '161B22', codeBorder: '30363D',
  codeMuted: '8B949E', codeComment: '8B949E', codeGreen: '238636', codeBlue: '1F6FEB', codeDefault: 'E6EDF3',
  accentCycle: ['238636', '1F6FEB', '9E6ADE', 'F0A500', 'E05D5D', '238636'],
};

const SUPPORTED = ['flow','cards','steps','code','two-column','stat-callout','quote','three-panel','agenda','image-text','bullets'];

function renderTitleSlide(slide, pres, config) {
  slide.background = { color: THEME.bg };
  
  // GitHub green accent bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.12, fill: { color: THEME.accent }, line: { type: 'none' } });
  
  // Brand
  slide.addText('⬛ GitHub', { x: 0.5, y: 0.25, w: 9, h: 0.5, margin: 0, fontSize: 14, color: 'FFFFFF', bold: true, fontFace: THEME.fontBody });

  // Title
  slide.addText(config.title, {
    x: 0.5, y: 0.9, w: 9, h: 1.5, margin: 0,
    fontSize: 42, color: THEME.titleColor, bold: true, fontFace: THEME.fontHead,
  });

  // Subtitle
  slide.addText(config.subtitle || '', {
    x: 0.5, y: 2.5, w: 9, h: 0.5, margin: 0,
    fontSize: 16, color: THEME.muted, italic: true, fontFace: THEME.fontBody,
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.28, w: 10, h: 0.345, fill: { color: THEME.footerBg }, line: { type: 'none' } });
  slide.addText(THEME.footerLabel, { x: 0, y: 5.28, w: 10, h: 0.345, margin: 0, fontSize: 10, color: THEME.footerText, align: 'center', valign: 'middle' });
}

function assignLayouts(slides) {
  let last = null;
  return slides.map((s, i) => { const l = detectLayout(s, i, last, SUPPORTED); last = l; return l; });
}

function renderContentSlide(slide, pres, slideData, layoutKey, slideIndex) {
  L.render(layoutKey, slide, pres, slideData, THEME.accentCycle[slideIndex % THEME.accentCycle.length], THEME);
}

module.exports = { assignLayouts, renderTitleSlide, renderContentSlide, SUPPORTED_LAYOUTS: SUPPORTED };