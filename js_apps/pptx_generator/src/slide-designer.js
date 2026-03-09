/**
 * slide-designer.js  —  Theme router
 *
 * This file is the only public interface between pptx-generator.js and
 * the individual theme designers. Add a new theme by:
 *   1. Creating  src/designers/my-theme.js  (copy any existing one)
 *   2. Adding an entry to the THEMES map below
 *   3. Pass  --theme my-theme  on the CLI
 *
 * Every designer must export:
 *   assignLayouts(slides)                               → string[]
 *   renderTitleSlide(slide, pres, config)               → void
 *   renderContentSlide(slide, pres, data, layout, idx)  → void
 */

const path = require('path');

// ─── Theme registry ───────────────────────────────────────────────────────────
// key: CLI --theme value   value: relative path to designer file
const THEMES = {
  'github-dark':     './designers/github-dark',
  'corporate-light': './designers/corporate-light',
  'startup-bold':    './designers/startup-bold',
};

const DEFAULT_THEME = 'github-dark';

// ─── Router ───────────────────────────────────────────────────────────────────

/**
 * Load and return a designer module by theme name.
 * Throws a helpful error if the theme doesn't exist.
 *
 * @param {string} themeName
 * @returns {{ assignLayouts, renderTitleSlide, renderContentSlide }}
 */
function loadTheme(themeName) {
  const key = (themeName || DEFAULT_THEME).toLowerCase().trim();

  if (!THEMES[key]) {
    const available = Object.keys(THEMES).join(', ');
    throw new Error(
      `Unknown theme "${key}". Available themes: ${available}\n` +
      `Usage: node src/index.js -i input.yml -o output.pptx --theme corporate-light`
    );
  }

  try {
    return require(THEMES[key]);
  } catch (err) {
    throw new Error(`Failed to load theme "${key}": ${err.message}`);
  }
}

// ─── Forwarding exports ───────────────────────────────────────────────────────
// pptx-generator.js calls these three functions directly.
// We resolve the theme at call time from the global state set by setTheme().

let _activeTheme = null;

/**
 * Set the active theme. Call this once before generating slides.
 * @param {string} themeName
 */
function setTheme(themeName) {
  _activeTheme = loadTheme(themeName || DEFAULT_THEME);
  return _activeTheme;
}

/**
 * List all available theme names.
 * @returns {string[]}
 */
function listThemes() {
  return Object.keys(THEMES);
}

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
