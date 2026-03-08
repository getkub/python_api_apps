# PPTX Generator

Convert YAML files to PowerPoint presentations with ease.

## Quick Start

```bash
# Single file conversion
python generate_ppt.py --input my_presentation.yml --output my_presentation.pptx

# Batch processing
python generate_ppt.py --input-dir inputs/ --output-dir outputs/
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

- `--input, -i`: Input YAML file
- `--output, -o`: Output PPTX file
- `--input-dir, -d`: Input directory (batch)
- `--output-dir, -D`: Output directory (batch)
- `--layout, -l`: Slide layout (1-11)
- `--verbose, -v`: Show detailed output

## Examples

```bash
# Convert single file
python generate_ppt.py -i inputs/presentation.yml -o outputs/presentation.pptx

# Process all YAML files in directory
python generate_ppt.py -d inputs/ -D outputs/

# Use custom layout
python generate_ppt.py -i inputs/presentation.yml -o outputs/presentation.pptx -l 2
```
