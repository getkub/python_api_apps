/**
 * config-parser.js
 * Parses YAML slide configs. Supports both simple and structured content shapes.
 *
 * Simple content (array):
 *   content:
 *     - "Bullet one"
 *     - "git checkout -b feature/x"
 *
 * Structured content (object):
 *   content:
 *     leftLabel: Before
 *     left:  ["Manual", "Slow"]
 *     rightLabel: After
 *     right: ["Automated", "Fast"]
 *
 * Optional per-slide fields:
 *   layout:   force a layout key (flow, cards, steps, code, two-column,
 *             stat-callout, quote, three-panel, agenda, image-text, bullets)
 *   keyPoint: callout box text
 *   hero:     large character/emoji for image-text layout
 *   icons:    [emoji, emoji, emoji] for three-panel layout
 */

const fs = require('fs');

function requireYaml() {
  const candidates = [
    'js-yaml',
    '/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/js-yaml/index.js',
  ];
  for (const p of candidates) {
    try { return require(p); } catch (_) {}
  }
  throw new Error('js-yaml not found. Run: npm install');
}

const yaml = requireYaml();

const VALID_LAYOUTS = new Set([
  'flow','cards','steps','code','two-column',
  'stat-callout','quote','three-panel','agenda','image-text','bullets',
]);

function validateSlide(slide, index, filePath) {
  if (!slide.title) throw new Error(`Slide ${index + 1} missing 'title' in ${filePath}`);
  if (!slide.content) throw new Error(`Slide ${index + 1} missing 'content' in ${filePath}`);

  // content can be array OR {left,right} object OR {stats:[]} etc.
  const isArray  = Array.isArray(slide.content);
  const isObject = typeof slide.content === 'object' && !isArray;
  if (!isArray && !isObject) {
    throw new Error(`Slide ${index + 1} 'content' must be an array or object in ${filePath}`);
  }

  // Warn but don't throw on unrecognised layout — _base.js will fallback
  if (slide.layout && !VALID_LAYOUTS.has(slide.layout)) {
    console.warn(`[WARN] Slide ${index + 1}: unknown layout "${slide.layout}" — will use auto-detect`);
    delete slide.layout;
  }
}

function parseConfig(filePath) {
  try {
    if (!fs.existsSync(filePath)) throw new Error(`Configuration file not found: ${filePath}`);

    const config = yaml.load(fs.readFileSync(filePath, 'utf8'));
    if (!config)         throw new Error(`Empty configuration file: ${filePath}`);
    if (!config.title)   throw new Error(`Missing required field 'title' in ${filePath}`);
    if (!config.slides)  throw new Error(`Missing required field 'slides' in ${filePath}`);
    if (!Array.isArray(config.slides)) throw new Error(`'slides' must be an array in ${filePath}`);

    config.slides.forEach((slide, i) => validateSlide(slide, i, filePath));
    return config;
  } catch (err) {
    if (err.name === 'YAMLException') throw new Error(`Invalid YAML syntax in ${filePath}: ${err.message}`);
    throw err;
  }
}

module.exports = { parseConfig };
