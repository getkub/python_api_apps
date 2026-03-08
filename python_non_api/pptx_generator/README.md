# PPTX Generator

Convert YAML files to PowerPoint presentations with ease.

## Quick Start

```bash
# Single file conversion
python generate_ppt.py --input my_presentation.yml --output my_presentation.pptx

# Batch processing
python generate_ppt.py --input-dir inputs/ --output-dir outputs/
```

## PPTX Generator v2 (Template Support)

For advanced styling and custom layouts, use the v2 version with PPTX templates:

```bash
# Single file conversion with template
python v2.generate_ppt.py --input my_presentation.yml --output my_presentation.pptx --template my_template.pptx

# Batch processing with template
python v2.generate_ppt.py --input-dir inputs/ --output-dir outputs/ --template corporate_template.pptx
```

## YAML Format

```yaml
title: Your Presentation Title

slides:
  - title: Slide Title
    content:
      - First bullet point
      - Second bullet point
      - Third bullet point
```

## Command Options

### Basic Version (generate_ppt.py)

- `--input, -i`: Input YAML file
- `--output, -o`: Output PPTX file
- `--input-dir, -d`: Input directory (batch)
- `--output-dir, -D`: Output directory (batch)
- `--layout, -l`: Slide layout (1-11)
- `--verbose, -v`: Show detailed output

### Template Version (v2.generate_ppt.py)

- `--input, -i`: Input YAML file
- `--output, -o`: Output PPTX file
- `--input-dir, -d`: Input directory (batch)
- `--output-dir, -D`: Output directory (batch)
- `--template, -t`: PPTX template file for styling
- `--layout, -l`: Slide layout (1-11)
- `--verbose, -v`: Show detailed output

## Examples

### Basic Version

```bash
# Convert single file
python generate_ppt.py -i inputs/presentation.yml -o outputs/presentation.pptx

# Process all YAML files in directory
python generate_ppt.py -d inputs/ -D outputs/

# Use custom layout
python generate_ppt.py -i inputs/presentation.yml -o outputs/presentation.pptx -l 2
```

### Template Version

```bash
# Convert single file with template
python v2.generate_ppt.py -i inputs/presentation.yml -o outputs/presentation.pptx --template my_template.pptx

# Process all YAML files with template
python v2.generate_ppt.py -d inputs/ -D outputs/ --template corporate_template.pptx

# Use custom layout with template
python v2.generate_ppt.py -i inputs/presentation.yml -o outputs/presentation.pptx --template template.pptx -l 2
```
