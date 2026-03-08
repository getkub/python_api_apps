const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

/**
 * PPTX Generator class for creating PowerPoint presentations from YAML configuration
 */
class PPTXGenerator {
  /**
   * Create a new PPTXGenerator instance
   * @param {boolean} verbose - Enable verbose logging
   */
  constructor(verbose = false) {
    this.verbose = verbose;
    this.log = (message) => {
      if (this.verbose) {
        console.log(`[INFO] ${message}`);
      }
    };
  }
  
  /**
   * Generate a single PowerPoint presentation
   * @param {Object} config - Parsed YAML configuration
   * @param {string} outputPath - Output file path
   * @param {string|null} templatePath - Path to PPTX template file
   * @param {number} layout - Slide layout number
   * @returns {Promise<string>} Path to generated presentation
   */
  async generatePresentation(config, outputPath, templatePath = null, layout = 1) {
    this.log(`Processing: ${path.basename(config.title || 'presentation')}`);
    
    // Create presentation
    const pptx = new PptxGenJS();
    
    // Load template if provided
    if (templatePath && fs.existsSync(templatePath)) {
      this.log(`Loading template: ${templatePath}`);
      await pptx.loadTemplate(templatePath);
    }
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate slides
    for (const slideData of config.slides) {
      const slide = pptx.addSlide();
      
      // Set title
      if (slideData.title) {
        slide.addText(slideData.title, {
          x: 0.5,
          y: 0.5,
          w: '90%',
          h: 1,
          fontSize: 28,
          bold: true,
          color: '363636'
        });
      }
      
      // Set content
      if (slideData.content && slideData.content.length > 0) {
        const contentText = slideData.content.join('\n');
        slide.addText(contentText, {
          x: 0.5,
          y: 1.5,
          w: '90%',
          h: '80%',
          fontSize: 18,
          bullet: { type: 'bullet' },
          color: '363636'
        });
      }
    }
    
    // Save presentation
    await pptx.writeFile(outputPath);
    this.log(`Generated: ${outputPath}`);
    
    return outputPath;
  }
  
  /**
   * Generate PowerPoint presentations from all YAML files in a directory
   * @param {string} inputDir - Input directory path
   * @param {string} outputDir - Output directory path
   * @param {string|null} templatePath - Path to PPTX template file
   * @param {number} layout - Slide layout number
   * @returns {Promise<string[]>} Array of generated presentation paths
   */
  async generateBatch(inputDir, outputDir, templatePath = null, layout = 1) {
    const inputPath = path.resolve(inputDir);
    const outputPath = path.resolve(outputDir);
    
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input directory not found: ${inputDir}`);
    }
    
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }
    
    const yamlFiles = this.getYamlFiles(inputPath);
    
    if (yamlFiles.length === 0) {
      this.log(`No YAML files found in ${inputDir}`);
      return [];
    }
    
    const results = [];
    
    for (const yamlFile of yamlFiles) {
      try {
        const config = require('./config-parser').parseConfig(yamlFile);
        const outputFile = path.join(outputPath, `${path.basename(yamlFile, '.yml')}.pptx`);
        const result = await this.generatePresentation(config, outputFile, templatePath, layout);
        results.push(result);
      } catch (error) {
        this.log(`Error processing ${yamlFile}: ${error.message}`);
        continue;
      }
    }
    
    this.log(`Batch processing complete. Generated ${results.length} files.`);
    return results;
  }
  
  /**
   * Get all YAML files from a directory
   * @param {string} directory - Directory path
   * @returns {string[]} Array of YAML file paths
   */
  getYamlFiles(directory) {
    const files = fs.readdirSync(directory);
    return files
      .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'))
      .map(file => path.join(directory, file));
  }
}

module.exports = { PPTXGenerator };