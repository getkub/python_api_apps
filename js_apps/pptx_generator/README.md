# PPTX Generator with PptxGenJS

A Node.js-based PowerPoint presentation generator that converts YAML configuration files into styled PowerPoint presentations using templates.

## Features

- **Template-based generation**: Use PPTX templates to maintain consistent styling
- **YAML configuration**: Simple YAML format for defining presentation content
- **Batch processing**: Process multiple YAML files at once
- **Command-line interface**: Easy-to-use CLI with comprehensive options
- **Error handling**: Robust validation and error reporting
- **Clean output**: Generates presentations without including existing template content

## Installation

```bash
cd js_apps/pptx_generator
npm install
```

## Usage

### Single File Generation

```bash
node src/index.js -i inputs/presentation.yml -o outputs/presentation.pptx -t templates/simple1.pptx
```

### Batch Processing

```bash
node src/index.js -d inputs/ -D outputs/ -t templates/simple1.pptx
```

### With Verbose Output

```bash
node src/index.js -i inputs/presentation.yml -o outputs/presentation.pptx -t templates/simple1.pptx -v
```

### Default Behavior

```bash
node src/index.js -v
```

This will process all YAML files in the `inputs/` directory and output to `outputs/`.

## Configuration Format

Create YAML files with the following structure:

```yaml
title: "Presentation Title"
slides:
  - title: "Slide Title"
    content:
      - "Bullet point 1"
      - "Bullet point 2"
      - "Bullet point 3"
  - title: "Another Slide"
    content:
      - "Content for second slide"
      - "More content"
```

## Command Line Options

- `-i, --input <file>`: Input YAML configuration file
- `-o, --output <file>`: Output PPTX file
- `-t, --template <file>`: PPTX template file
- `-d, --input-dir <dir>`: Input directory for batch processing
- `-D, --output-dir <dir>`: Output directory for batch processing
- `-l, --layout <number>`: Slide layout number (1-11)
- `-v, --verbose`: Enable verbose output

## Project Structure

```
js_apps/pptx_generator/
├── src/
│   ├── index.js              # Main entry point and CLI
│   ├── config-parser.js      # YAML parsing and validation
│   └── pptx-generator.js     # Core PPTX generation logic
├── inputs/                   # YAML configuration files
├── outputs/                  # Generated PPTX files
├── templates/                # PPTX template files
├── package.json
├── .gitignore
└── README.md
```

## Dependencies

- **PptxGenJS**: Core PowerPoint generation library
- **js-yaml**: YAML parsing
- **commander**: Command-line interface
- **fs-extra**: Enhanced file system operations

## Key Features

### Template Loading

The generator uses PptxGenJS's `loadTemplate()` method, which automatically extracts layouts and styles from templates without including existing slide content. This solves the problem encountered with the Python python-pptx library.

### Error Handling

- File existence validation
- YAML syntax validation
- Required field validation
- Template compatibility checking
- Graceful degradation for batch processing

### Performance

- Template caching for batch operations
- Async file operations
- Sequential processing to manage memory usage
- Progress reporting for long operations

## Examples

### Basic Presentation

```yaml
title: "My Presentation"
slides:
  - title: "Introduction"
    content:
      - "Welcome to my presentation"
      - "Today we'll discuss..."
  - title: "Main Points"
    content:
      - "Point 1"
      - "Point 2"
      - "Point 3"
```

### With Custom Styling

The generator applies consistent styling:
- Title: 28pt, bold, dark gray
- Content: 18pt, bullet points, dark gray
- Margins: 0.5 inches from edges
- Width: 90% of slide width

## Troubleshooting

### Common Issues

1. **Template Loading Failures**
   - Check template file path and permissions
   - Verify template format compatibility
   - Ensure PptxGenJS version supports template features

2. **YAML Parsing Errors**
   - Validate YAML syntax
   - Check for required fields (title, slides, content)
   - Handle empty or malformed files

3. **Output Generation Issues**
   - Verify output directory permissions
   - Check available disk space
   - Ensure PptxGenJS can write files

### Error Messages

The generator provides clear, actionable error messages:
- File not found errors include the full path
- YAML errors show the specific issue and line number
- Template errors indicate compatibility problems

## Development

### Adding New Features

1. **Custom Styling**: Modify text formatting in `pptx-generator.js`
2. **New Layouts**: Add layout support in the generation logic
3. **Additional Formats**: Extend the configuration parser
4. **Web Interface**: Create a web-based configuration editor

### Testing

1. **Unit Tests**: Test individual modules in isolation
2. **Integration Tests**: Test complete workflow
3. **Template Tests**: Verify different template formats
4. **Error Tests**: Test error handling scenarios

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for your changes
5. Submit a pull request

## Future Enhancements

- Custom styling options
- Image embedding capabilities
- Charts and data visualization
- Web-based interface
- REST API endpoint
- Multiple output formats (PDF, HTML)

## Support

For questions, issues, or feature requests, please create an issue in the repository or refer to the documentation files:
- `ai/skills/pptx_generator/SKILL.md`: Learning objectives and skill development
- `ai/skills/pptx_generator/pptxgenjs.md`: Detailed implementation guidance
