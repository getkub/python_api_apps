const fs = require('fs');

// Use bundled js-yaml from mermaid-cli when local node_modules unavailable
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

/**
 * Parse YAML configuration file and validate structure
 * @param {string} filePath - Path to YAML configuration file
 * @returns {Object} Parsed and validated configuration object
 * @throws {Error} If file doesn't exist, is empty, or has invalid structure
 */
function parseConfig(filePath) {
  try {
    // Validate file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Configuration file not found: ${filePath}`);
    }
    
    // Read and parse YAML
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const config = yaml.load(fileContent);
    
    // Validate required fields
    if (!config) {
      throw new Error(`Empty configuration file: ${filePath}`);
    }
    
    if (!config.title) {
      throw new Error(`Missing required field 'title' in ${filePath}`);
    }
    
    if (!config.slides) {
      throw new Error(`Missing required field 'slides' in ${filePath}`);
    }
    
    if (!Array.isArray(config.slides)) {
      throw new Error(`'slides' must be an array in ${filePath}`);
    }
    
    // Validate slides
    config.slides.forEach((slide, index) => {
      if (!slide.title) {
        throw new Error(`Slide ${index + 1} missing 'title' in ${filePath}`);
      }
      
      if (!slide.content) {
        throw new Error(`Slide ${index + 1} missing 'content' in ${filePath}`);
      }
      
      if (!Array.isArray(slide.content)) {
        throw new Error(`Slide ${index + 1} 'content' must be an array in ${filePath}`);
      }
    });
    
    return config;
  } catch (error) {
    if (error.name === 'YAMLException') {
      throw new Error(`Invalid YAML syntax in ${filePath}: ${error.message}`);
    }
    throw error;
  }
}

module.exports = { parseConfig };