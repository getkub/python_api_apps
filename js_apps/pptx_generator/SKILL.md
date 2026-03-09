# PPTX Generator with PptxGenJS

## Overview

This skill teaches how to create a PowerPoint presentation generator using PptxGenJS that converts YAML configuration files into styled PowerPoint presentations using templates.

## Learning Objectives

By the end of this skill, you will be able to:

1. **Set up a Node.js project** with PptxGenJS and related dependencies
2. **Parse YAML configuration files** to extract presentation data
3. **Load and use PPTX templates** without including existing slide content
4. **Generate PowerPoint presentations** programmatically with consistent styling
5. **Create a command-line interface** for the generator
6. **Handle errors and edge cases** gracefully

## Prerequisites

- Basic knowledge of JavaScript/Node.js
- Understanding of YAML format
- Familiarity with command-line interfaces
- Basic understanding of PowerPoint structure

## Skill Components

### 1. Project Setup and Dependencies

**What you'll learn:**
- Initialize a Node.js project with package.json
- Install PptxGenJS and supporting libraries
- Set up proper directory structure
- Configure .gitignore for npm projects

**Key concepts:**
- npm package management
- PptxGenJS library capabilities
- Project organization best practices

### 2. YAML Configuration Parsing

**What you'll learn:**
- Parse YAML files using js-yaml library
- Validate configuration structure
- Extract presentation metadata and slide content
- Handle configuration errors gracefully

**Key concepts:**
- YAML syntax and structure
- Data validation patterns
- Error handling strategies

### 3. Template-Based Generation

**What you'll learn:**
- Load PPTX templates using PptxGenJS
- Extract template layouts and styles
- Generate slides using template masters
- Avoid including existing template content

**Key concepts:**
- PPTX template structure
- Slide master vs. slide content
- Template inheritance patterns

### 4. Presentation Generation

**What you'll learn:**
- Create slides programmatically
- Apply consistent styling from templates
- Handle different slide layouts
- Manage slide content formatting

**Key concepts:**
- PptxGenJS API usage
- Slide layout management
- Content formatting options

### 5. Command-Line Interface

**What you'll learn:**
- Create CLI using commander.js
- Handle command-line arguments and options
- Support single file and batch processing
- Provide helpful usage information

**Key concepts:**
- CLI design patterns
- Argument parsing
- User experience considerations

### 6. Error Handling and Validation

**What you'll learn:**
- Validate input files and directories
- Handle missing or invalid configurations
- Provide meaningful error messages
- Graceful degradation strategies

**Key concepts:**
- Input validation patterns
- Error message design
- User feedback mechanisms

## Implementation Steps

### Step 1: Project Initialization
1. Create project directory structure
2. Initialize npm project with package.json
3. Install required dependencies
4. Set up .gitignore file

### Step 2: Core Module Development
1. Create YAML parser module
2. Implement PPTX generator module
3. Build CLI interface module
4. Add error handling utilities

### Step 3: Integration and Testing
1. Integrate all modules
2. Test with sample YAML configurations
3. Validate template loading
4. Test CLI functionality

### Step 4: Documentation and Polish
1. Create usage documentation
2. Add examples and templates
3. Implement comprehensive error handling
4. Optimize performance

## Common Patterns

### YAML Configuration Structure
```yaml
title: "Presentation Title"
slides:
  - title: "Slide Title"
    content:
      - "Bullet point 1"
      - "Bullet point 2"
```

### PptxGenJS Template Usage
```javascript
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_16x9';
pptx.defineLayout({ name: 'custom', width: 10, height: 7.5 });
```

### CLI Command Structure
```bash
node src/index.js --input config.yml --output presentation.pptx --template template.pptx
```

## Best Practices

1. **Separation of Concerns**: Keep parsing, generation, and CLI logic separate
2. **Error Handling**: Always validate inputs and provide clear error messages
3. **Template Safety**: Never modify original template files
4. **Performance**: Cache template loading when processing multiple files
5. **User Experience**: Provide progress feedback for long operations

## Troubleshooting

### Common Issues

1. **Template Loading Failures**
   - Check template file path and permissions
   - Verify template format compatibility
   - Ensure PptxGenJS version supports template features

2. **YAML Parsing Errors**
   - Validate YAML syntax
   - Check for required fields
   - Handle empty or malformed files

3. **Output Generation Issues**
   - Verify output directory permissions
   - Check available disk space
   - Ensure PptxGenJS can write files

## Next Steps

After mastering this skill, you can:
- Add support for more complex slide layouts
- Implement custom styling options
- Add support for images and media
- Create web-based interfaces
- Integrate with other document formats

## Resources

- [PptxGenJS Documentation](https://gitbrent.github.io/PptxGenJS/)
- [js-yaml Documentation](https://github.com/nodeca/js-yaml)
- [Commander.js Documentation](https://github.com/tj/commander.js)
- [YAML Specification](https://yaml.org/spec/1.2/spec.html)