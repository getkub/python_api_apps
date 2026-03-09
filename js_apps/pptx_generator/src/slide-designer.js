/**
 * slide-designer.js  —  Theme router
 *
 * Add a new theme:
 *   1. Create src/designers/my-theme.js
 *   2. Add one line to THEMES below
 *   3. Pass --theme my-theme on the CLI
 */

const THEMES = {
  'github-dark':     './designers/github-dark',
  'corporate-light': './designers/corporate-light',
  'startup-bold':    './designers/startup-bold',
  'minimal-mono':    './designers/minimal-mono',
  'healthcare':      './designers/healthcare',
  'financial':       './designers/financial',
  'creative-agency': './designers/creative-agency',
  'education':       './designers/education',
};

const DEFAULT_THEME = 'github-dark';
let _activeTheme = null;

function loadTheme(name) {
  const key = (name || DEFAULT_THEME).toLowerCase().trim();
  if (!THEMES[key]) {
    throw new Error(
      `Unknown theme "${key}".\nAvailable: ${Object.keys(THEMES).join(', ')}`
    );
  }
  try {
    return require(THEMES[key]);
  } catch (err) {
    throw new Error(`Failed to load theme "${key}": ${err.message}`);
  }
}

function setTheme(name)  { _activeTheme = loadTheme(name); return _activeTheme; }
function listThemes()    { return Object.keys(THEMES); }

function assignLayouts(slides) {
  if (!_activeTheme) setTheme(DEFAULT_THEME);
  return _activeTheme.assignLayouts(slides);
}
function renderTitleSlide(slide, pres, config) {
  if (!_activeTheme) setTheme(DEFAULT_THEME);
  return _activeTheme.renderTitleSlide(slide, pres, config);
}
function renderContentSlide(slide, pres, slideData, layoutKey, slideIndex) {
  if (!_activeTheme) setTheme(DEFAULT_THEME);
  return _activeTheme.renderContentSlide(slide, pres, slideData, layoutKey, slideIndex);
}

module.exports = { setTheme, listThemes, assignLayouts, renderTitleSlide, renderContentSlide };
