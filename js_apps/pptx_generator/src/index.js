#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');

// Import modules
const { parseConfig } = require('./config-parser');
const { PPTXGenerator } = require('./pptx-generator');

// CLI setup
program
  .name('pptx-generator')
  .description('Generate PowerPoint presentations from YAML configuration using PptxGenJS')
  .version('1.0.0')
  .option('-i, --input <file>', 'Input YAML configuration file')
  .option('-o, --output <file>', 'Output PPTX file')
  .option('-t, --template <file>', 'PPTX template file')
  .option('-d, --input-dir <dir>', 'Input directory for batch processing')
  .option('-D, --output-dir <dir>', 'Output directory for batch processing')
  .option('-l, --layout <number>', 'Slide layout number (1-11)', parseInt)
  .option('-v, --verbose', 'Enable verbose output')
  .addHelpText('after', `
Examples:
  # Single file conversion with template
  node src/index.js -i inputs/presentation.yml -o outputs/presentation.pptx -t templates/simple1.pptx

  # Batch processing with template
  node src/index.js -d inputs/ -D outputs/ -t templates/simple1.pptx

  # Custom layout with template
  node src/index.js -i inputs/presentation.yml -o outputs/presentation.pptx -t templates/simple1.pptx -l 2

  # Verbose output
  node src/index.js -i inputs/presentation.yml -o outputs/presentation.pptx -t templates/simple1.pptx -v
`);

// Main execution
async function main() {
  const options = program.opts();
  
  try {
    const generator = new PPTXGenerator(options.verbose);
    
    if (options.input) {
      // Single file processing
      await processSingleFile(generator, options);
    } else if (options.inputDir) {
      // Batch processing
      await processBatch(generator, options);
    } else {
      // Default behavior - process inputs/ directory
      await processBatch(generator, {
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

async function processSingleFile(generator, options) {
  const config = parseConfig(options.input);
  
  // Determine output file path
  let outputPath = options.output;
  if (!outputPath) {
    const configTitle = config.output || path.basename(options.input, path.extname(options.input));
    outputPath = `outputs/${configTitle}.pptx`;
  }
  
  // Generate presentation
  const result = await generator.generatePresentation(
    config, 
    outputPath, 
    options.template, 
    options.layout
  );
  
  console.log(`Successfully generated: ${result}`);
}

async function processBatch(generator, options) {
  const results = await generator.generateBatch(
    options.inputDir, 
    options.outputDir, 
    options.template, 
    options.layout
  );
  
  if (results.length > 0) {
    console.log(`Successfully generated ${results.length} presentations:`);
    for (const result of results) {
      console.log(`  - ${result}`);
    }
  } else {
    console.log('No presentations were generated.');
    process.exit(1);
  }
}

// Execute main function
if (require.main === module) {
  main();
}

module.exports = { main };