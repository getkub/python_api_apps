#!/usr/bin/env node

// Inline CLI parser — no external dependencies needed
const program = (() => {
  const args = process.argv.slice(2);
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-i': case '--input':       opts.input      = args[++i]; break;
      case '-o': case '--output':      opts.output     = args[++i]; break;
      case '-t': case '--template':    opts.template   = args[++i]; break;
      case '-d': case '--input-dir':   opts.inputDir   = args[++i]; break;
      case '-D': case '--output-dir':  opts.outputDir  = args[++i]; break;
      case '-l': case '--layout':      opts.layout     = parseInt(args[++i]); break;
      case '-v': case '--verbose':     opts.verbose    = true; break;
      case '--version':                console.log('1.0.0'); process.exit(0); break;
      case '--help': case '-h':
        console.log(`
pptx-generator — Convert YAML to styled PowerPoint presentations

Usage:
  node src/index.js [options]

Options:
  -i, --input <file>       Input YAML file
  -o, --output <file>      Output .pptx file
  -t, --template <file>    PPTX template (optional)
  -d, --input-dir <dir>    Batch: input directory
  -D, --output-dir <dir>   Batch: output directory
  -l, --layout <n>         Layout number (unused in designer mode)
  -v, --verbose            Verbose output
  --version                Show version
  --help                   Show this help

Examples:
  node src/index.js -i inputs/github_wow.yml -o outputs/github_wow.pptx -v
  node src/index.js -d inputs/ -D outputs/ -v
        `);
        process.exit(0);
    }
  }
  return { opts: () => opts };
})();
const fs = require('fs');
const path = require('path');

// Import modules
const { parseConfig } = require('./config-parser');
const { PPTXGenerator } = require('./pptx-generator');

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