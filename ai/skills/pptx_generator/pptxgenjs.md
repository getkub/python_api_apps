# PptxGenJS Implementation Details

## Overview

This document provides detailed implementation guidance for using PptxGenJS to create a template-based PowerPoint generator.

## Project Structure

```
src/
├── index.js              # Main entry point and CLI
├── config-parser.js      # YAML parsing and validation
├── pptx-generator.js     # Core PPTX generation logic
└── utils/
    ├── file-utils.js     # File system operations
    └── error-handler.js  # Error handling utilities
```

## Core Implementation

### 1. Main Entry Point (index.js)

```javascript
const { program } = require('commander');
const fs = require('fs');
const path = require('path');

// Import modules
const { parseConfig } = require('./config-parser');
const { generatePresentation } = require('./pptx-generator');

// CLI setup
program
  .name('pptx-generator')
  .description('Generate PowerPoint presentations from YAML configuration')
  .version('1.0.0')
  .option('-i, --input <file>', 'Input YAML configuration file')
  .option('-o, --output <file>', 'Output PPTX file')
  .option('-t, --template <file>', 'PPTX template file')
  .option('-d, --input-dir <dir>', 'Input directory for batch processing')
  .option('-D, --output-dir <dir>', 'Output directory for batch processing')
  .option('-l, --layout <number>', 'Slide layout number (1-11)', parseInt)
  .option('-v, --verbose', 'Enable verbose output')
  .parse();

// Main execution
async function main() {
  const options = program.opts();
  
  try {
    if (options.input) {
      await processSingleFile(options);
    } else if (options.inputDir) {
      await processBatch(options);
    } else {
      // Default behavior - process inputs/ directory
      await processBatch({
        ...options,
        inputDir: 'inputs',
        outputDir: 'outputs'
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
```

### 2. Configuration Parser (config-parser.js)

```javascript
const yaml = require('js-yaml');
const fs = require('fs');

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
```

### 3. PPTX Generator (pptx-generator.js)

```javascript
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

class PPTXGenerator {
  constructor(verbose = false) {
    this.verbose = verbose;
    this.log = (message) => {
      if (this.verbose) {
        console.log(`[INFO] ${message}`);
      }
    };
  }
  
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
  
  getYamlFiles(directory) {
    const files = fs.readdirSync(directory);
    return files
      .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'))
      .map(file => path.join(directory, file));
  }
}

module.exports = { PPTXGenerator };
```

## Key Implementation Details

### Template Loading

PptxGenJS template loading is straightforward:

```javascript
const pptx = new PptxGenJS();
await pptx.loadTemplate('path/to/template.pptx');
```

**Important:** PptxGenJS automatically extracts layouts and styles from the template without including existing slide content, which solves the original problem!

### Slide Layout Management

```javascript
// Use template layouts
const slide = pptx.addSlide({ masterName: 'Title Slide' });

// Or use default layouts
const slide = pptx.addSlide();
```

### Text Formatting

```javascript
slide.addText('Title Text', {
  x: 0.5,
  y: 0.5,
  w: '90%',
  h: 1,
  fontSize: 28,
  bold: true,
  color: '363636'
});
```

### Bullet Points

```javascript
slide.addText(contentText, {
  x: 0.5,
  y: 1.5,
  w: '90%',
  h: '80%',
  fontSize: 18,
  bullet: { type: 'bullet' },
  color: '363636'
});
```

## Error Handling Strategy

1. **File Validation**: Check file existence and permissions
2. **YAML Validation**: Validate syntax and required fields
3. **Template Validation**: Verify template compatibility
4. **Output Validation**: Ensure output directory is writable
5. **Graceful Degradation**: Continue processing other files on error

## Performance Considerations

1. **Template Caching**: Load template once for batch processing
2. **Async Operations**: Use async/await for file operations
3. **Memory Management**: Process files sequentially to avoid memory issues
4. **Progress Reporting**: Provide feedback for long operations

## Usage Examples

### Single File Generation

```bash
node src/index.js -i inputs/presentation.yml -o outputs/presentation.pptx -t templates/simple1.pptx -v
```

### Batch Processing

```bash
node src/index.js -d inputs/ -D outputs/ -t templates/simple1.pptx -v
```

### Default Behavior

```bash
node src/index.js -v
```

## Testing Strategy

1. **Unit Tests**: Test individual modules in isolation
2. **Integration Tests**: Test complete workflow
3. **Template Tests**: Verify different template formats
4. **Error Tests**: Test error handling scenarios
5. **Performance Tests**: Test with large files and batch processing

## Future Enhancements

1. **Custom Styling**: Allow overriding template styles
2. **Image Support**: Add image embedding capabilities
3. **Charts and Graphs**: Support for data visualization
4. **Web Interface**: Create web-based configuration editor
5. **API Endpoint**: Expose as REST API
6. **Multiple Output Formats**: Support PDF, HTML exports