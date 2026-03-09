/**
 * pptx-generator.js
 *
 * Core PPTX generation engine.
 * Delegates visual design to slide-designer.js, which follows the SKILL.md
 * principles: varied layouts, topic-matched palette, no text-only slides.
 */

const PptxGenJS = require('pptxgenjs');
const fs        = require('fs');
const path      = require('path');
const { setTheme, assignLayouts, renderTitleSlide, renderContentSlide } = require('./slide-designer');

class PPTXGenerator {
  /**
   * @param {boolean} verbose - Enable verbose logging
   */
  constructor(verbose = false) {
    this.verbose = verbose;
  }

  log(msg) {
    if (this.verbose) console.log(`[INFO] ${msg}`);
  }

  /**
   * Generate a single styled presentation from a parsed YAML config.
   *
   * @param {Object}      config       - Parsed YAML config (title, slides[])
   * @param {string}      outputPath   - Destination .pptx path
   * @param {string|null} templatePath - Optional .pptx template (for colour themes only)
   * @returns {Promise<string>}        - Resolved output path
   */
  async generatePresentation(config, outputPath, theme) {
    this.log(`Generating: ${config.title} [theme: ${theme || "github-dark"}]`);
    setTheme(theme);

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title  = config.title;

    // ── Title slide ──────────────────────────────────────────────────────────
    const titleSlide = pptx.addSlide();
    renderTitleSlide(titleSlide, pptx, config);
    this.log('  Rendered: title slide');

    // ── Content slides ───────────────────────────────────────────────────────
    const layouts = assignLayouts(config.slides);
    this.log(`  Layout assignments: ${layouts.join(', ')}`);

    config.slides.forEach((slideData, i) => {
      const slide = pptx.addSlide();
      renderContentSlide(slide, pptx, slideData, layouts[i], i);
      this.log(`  Rendered slide ${i + 1}: "${slideData.title}" → ${layouts[i]}`);
    });

    // ── Write file ───────────────────────────────────────────────────────────
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    await pptx.writeFile({ fileName: outputPath });
    this.log(`  Saved: ${outputPath}`);
    return outputPath;
  }

  /**
   * Batch-generate presentations from all YAML files in a directory.
   *
   * @param {string}      inputDir     - Directory containing .yml/.yaml files
   * @param {string}      outputDir    - Directory for generated .pptx files
   * @param {string|null} templatePath - Passed through (unused in designer mode)
   * @returns {Promise<string[]>}      - Paths of generated files
   */
  async generateBatch(inputDir, outputDir, templatePath = null, theme) {
    const inputPath  = path.resolve(inputDir);
    const outputPath = path.resolve(outputDir);

    if (!fs.existsSync(inputPath)) throw new Error(`Input directory not found: ${inputDir}`);
    if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

    const yamlFiles = this.getYamlFiles(inputPath);
    if (yamlFiles.length === 0) {
      this.log(`No YAML files found in ${inputDir}`);
      return [];
    }

    const results = [];
    for (const yamlFile of yamlFiles) {
      try {
        const config     = require('./config-parser').parseConfig(yamlFile);
        const outputFile = path.join(outputPath, `${path.basename(yamlFile, path.extname(yamlFile))}.pptx`);
        const result     = await this.generatePresentation(config, outputFile, theme);
        results.push(result);
      } catch (err) {
        this.log(`Error processing ${yamlFile}: ${err.message}`);
      }
    }

    this.log(`Batch complete. Generated ${results.length} file(s).`);
    return results;
  }

  /** Return all .yml / .yaml files in a directory. */
  getYamlFiles(directory) {
    return fs.readdirSync(directory)
      .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
      .map(f => path.join(directory, f));
  }
}

module.exports = { PPTXGenerator };