/**
 * designers/healthcare.js
 * Theme: Healthcare  —  Medical / pharma / clinical / NHS-style
 * Palette: Teal Trust from SKILL.md. Clean white, trustworthy teal, calm sage.
 */
const { detectLayout, mkShadow } = require('../_base');
const L = require('../_layouts');

const THEME = {
  bg: 'FFFFFF', cardBg: 'F0F7F7', titleColor: '025959', text: '1A2E2E',
  muted: '6B8F8F', onAccent: 'FFFFFF', accent: '028090', secondary: '00A896', tertiary: '02C39A',
  footerBg: '025959', footerText: '9ECECE', footerLabel: 'Healthcare Confidential',
  fontHead: 'Calibri', fontBody: 'Calibri',
  codeBg: '025959', codeHeader: '013333', codeBorder: '028090',
  codeMuted: '6B8F8F', codeComment: '6B8F8F', codeGreen: '02C39A', codeBlue: '7EC8E3', codeDefault: 'E8F5F5',
  accentCycle: ['028090', '00A896', '02C39A', '025959', '028090', '00A896'],
};

const SUPPORTED = ['flow','cards','steps','code','two-column','stat-callout','quote','three-panel','agenda','image-text','bullets'];

function renderTitleSlide(slide, pres, config) {
  slide.background = { color: THEME.bg };
  // Teal header band
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.8, fill: { color: THEME.accent }, line: { type: 'none' } });
  // Lighter teal wave effect (rectangle)
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 1.5, w: 10, h: 0.5, fill: { color: '00A896' }, line: { type: 'none' } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 1.8, w: 10, h: 0.3, fill: { color: '02C39A' }, line: { type: 'none' } });

  // Brand label
  slide.addText('✚ Healthcare', { x: 0.5, y: 0.25, w: 9, h: 0.5, margin: 0, fontSize: 14, color: 'FFFFFF', bold: true, fontFace: THEME.fontBody });

  // Title on white area
  slide.addText(config.title, {
    x: 0.5, y: 2.3, w: 9, h: 1.5, margin: 0,
    fontSize: 42, color: THEME.accent, bold: true, fontFace: THEME.fontHead,
  });
  slide.addText(config.subtitle || '', {
    x: 0.5, y: 3.85, w: 9, h: 0.5, fontSize: 15, color: THEME.muted, italic: true, fontFace: THEME.fontBody,
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
