/**
 * designers/education.js
 * Theme: Education  —  Training / eLearning / workshop / university
 * Palette: Warm Terracotta from SKILL.md. Friendly, clear, accessible.
 */
const { detectLayout, mkShadow } = require('../_base');
const L = require('../_layouts');

const THEME = {
  bg: 'FDFAF7', cardBg: 'FFFFFF', titleColor: '7A2E1A', text: '2A1A10',
  muted: '9A7060', onAccent: 'FFFFFF', accent: 'B85042', secondary: 'A7BEAE', tertiary: 'E7E8D1',
  footerBg: '7A2E1A', footerText: 'E7C4B8', footerLabel: 'Learning & Development',
  fontHead: 'Trebuchet MS', fontBody: 'Calibri',
  codeBg: '2A1A10', codeHeader: '1A0D08', codeBorder: 'B85042',
  codeMuted: '9A7060', codeComment: '9A7060', codeGreen: 'A7BEAE', codeBlue: 'C4D8CC', codeDefault: 'FDFAF7',
  accentCycle: ['B85042', 'A7BEAE', '9A7060', 'C07060', 'B85042', 'A7BEAE'],
};

const SUPPORTED = ['flow','cards','steps','code','two-column','stat-callout','quote','three-panel','agenda','image-text','bullets'];

function renderTitleSlide(slide, pres, config) {
  slide.background = { color: THEME.bg };

  // Warm terracotta top band
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 2.2, fill: { color: THEME.accent }, line: { type: 'none' } });
  // Sage accent strip
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 2.2, w: 10, h: 0.18, fill: { color: 'A7BEAE' }, line: { type: 'none' } });

  // Brand
  slide.addText('📚 Learning', { x: 0.5, y: 0.2, w: 9, h: 0.5, margin: 0, fontSize: 14, color: 'FFFFFF', bold: true, fontFace: THEME.fontBody });

  // Title in white over band
  slide.addText(config.title, {
    x: 0.5, y: 0.7, w: 9, h: 1.3, margin: 0,
    fontSize: 42, color: 'FFFFFF', bold: true, fontFace: THEME.fontHead,
  });

  // Subtitle on cream area
  slide.addText(config.subtitle || '', {
    x: 0.5, y: 2.55, w: 9, h: 0.6, margin: 0,
    fontSize: 16, color: THEME.accent, italic: true, fontFace: THEME.fontBody,
  });

  // Decorative circles (learning-friendly motif)
  slide.addShape(pres.shapes.OVAL, { x: 7.5, y: 3.0, w: 2.8, h: 2.8, fill: { color: 'F0E8D8' }, line: { type: 'none' } });
  slide.addShape(pres.shapes.OVAL, { x: 8.2, y: 3.5, w: 1.5, h: 1.5, fill: { color: 'E7E8D1' }, line: { type: 'none' } });

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
