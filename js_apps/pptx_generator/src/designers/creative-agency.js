/**
 * designers/creative-agency.js
 * Theme: Creative Agency  —  Design studios / marketing / brand decks
 * Palette: Berry & Cream from SKILL.md. Asymmetric, expressive, Georgia + Impact.
 */
const { detectLayout, mkShadow } = require('../_base');
const L = require('../_layouts');

const THEME = {
  bg: 'ECE2D0', cardBg: 'FFFFFF', titleColor: '6D2E46', text: '2A1520',
  muted: 'A26769', onAccent: 'FFFFFF', accent: '6D2E46', secondary: 'A26769', tertiary: 'C17D6F',
  footerBg: '6D2E46', footerText: 'ECE2D0', footerLabel: 'Creative Studio — Private',
  fontHead: 'Georgia', fontBody: 'Calibri',
  codeBg: '2A1520', codeHeader: '1A0D14', codeBorder: '6D2E46',
  codeMuted: 'A26769', codeComment: 'A26769', codeGreen: 'C17D6F', codeBlue: 'E8C4B0', codeDefault: 'ECE2D0',
  accentCycle: ['6D2E46', 'A26769', 'C17D6F', '8B4455', '6D2E46', 'A26769'],
};

const SUPPORTED = ['flow','cards','steps','code','two-column','stat-callout','quote','three-panel','agenda','image-text','bullets'];

function renderTitleSlide(slide, pres, config) {
  slide.background = { color: THEME.bg };

  // Asymmetric corner block top-right
  slide.addShape(pres.shapes.RECTANGLE, { x: 6.5, y: 0, w: 3.5, h: 3.5, fill: { color: THEME.accent }, line: { type: 'none' } });
  // Smaller offset block
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.2, w: 2.5, h: 1.425, fill: { color: 'A26769' }, line: { type: 'none' } });

  // Brand
  slide.addText('✦ Studio', { x: 0.5, y: 0.3, w: 5.5, h: 0.45, margin: 0, fontSize: 13, color: THEME.accent, bold: true, fontFace: THEME.fontBody });

  // Title — large, left-anchored
  slide.addText(config.title, {
    x: 0.5, y: 0.9, w: 5.8, h: 2.8, margin: 0,
    fontSize: 48, color: THEME.accent, bold: true, fontFace: THEME.fontHead,
  });

  // Cream subtitle on berry block
  slide.addText(config.subtitle || '', {
    x: 6.6, y: 0.3, w: 3.2, h: 3.0, margin: 8,
    fontSize: 14, color: 'ECE2D0', italic: true,
    fontFace: THEME.fontBody, valign: 'middle',
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
