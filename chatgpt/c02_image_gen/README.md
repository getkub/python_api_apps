# OpenAI Image Editor

A modular Python application for editing images using OpenAI's DALL-E API with YAML-based prompt configurations.

## Features

- 🎨 **Image Editing**: Transform images using OpenAI's powerful DALL-E API
- 📄 **YAML Prompts**: Define prompts and configurations in structured YAML files
- 🖥️ **Interactive CLI**: User-friendly command-line interface with multiple modes
- 🔧 **Modular Architecture**: Clean separation of concerns for easy maintenance and extension
- 🔑 **Flexible Authentication**: Support for config files or interactive API key input
- 📊 **Rich Metadata**: Support for room types, colors, and other metadata in prompts
- 🎯 **Multiple Modes**: Interactive mode, direct execution, and prompt listing

## Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd c02_image_gen
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up your API key** (optional but recommended)
   ```bash
   # Create config.yaml with your OpenAI API key
   echo "api_key: your_openai_api_key_here" > config.yaml
   ```

### Usage

#### Interactive Mode (Default)
```bash
python main.py
```
The interactive mode will guide you through:
- API key setup (if not in config file)
- Viewing available prompts
- Selecting input image and prompt files
- Processing and saving results

#### Direct Execution
```bash
python main.py -i input_image.jpg -p prompts/bedroom.yml
```

#### List Available Prompts
```bash
python main.py --list-prompts
```

#### Command Line Options
```
Options:
  -i, --image IMAGE        Path to input image file
  -p, --prompt PROMPT      Path to YAML prompt file
  -c, --config CONFIG      Path to config YAML file (default: config.yaml)
  --list-prompts          List available prompt files
  --interactive           Run in interactive mode (default)
  --no-interactive        Disable interactive mode
  -v, --verbose           Enable verbose output
  -h, --help             Show help message
```

## YAML Prompt Format

Create prompt files in the `prompts/` directory with the following structure:

```yaml
# prompts/bedroom_example.yml
prompt: >
  Modern minimalistic bedroom with a king-sized bed, 
  a wooden nightstand, warm lighting, and simple, elegant décor.

metadata:
  room:
    type: bedroom
    subtype: master
  colors:
    walls: blue
    windows: white

output: "/tmp/outputs/decorated_bedroom.png"
size: "1024x1024"  # Optional, defaults to "1024x1024"
variations: 1       # Optional, defaults to 1
```

### Supported Fields
- **`prompt`** *(required)*: Description of the desired image transformation
- **`output`** *(required)*: Path where the edited image will be saved
- **`size`** *(optional)*: Image dimensions (e.g., "512x512", "1024x1024")
- **`variations`** *(optional)*: Number of variations to generate
- **`metadata`** *(optional)*: Additional metadata for organization

## Project Structure

```
c02_image_gen/
├── main.py                    # Clean entry point (delegates to CLI)
├── requirements.txt           # Python dependencies
├── config.yaml               # API key configuration (create this)
│
├── cli/                       # Command Line Interface
│   ├── __init__.py
│   ├── interface.py          # Main CLI coordinator
│   ├── parser.py             # Argument parsing
│   └── handlers.py           # Command handlers (interactive, direct, list)
│
├── core/                      # Business Logic
│   └── image_gen.py          # Image processing and API calls
│
├── utils/                     # Utilities
│   ├── __init__.py
│   ├── auth.py               # API key management
│   └── prompts.py            # Prompt file operations
│
├── prompts/                   # YAML Prompt Files
│   └── p01_bedroom_master.yml # Example prompt
│
├── api/                       # Future API Implementation
│   └── app.py                # FastAPI backend (planned)
│
├── tests/                     # Test Suite
│   └── test_image_gen.py
│
├── static/                    # Static Assets
│   └── .gitkeep
│
└── README.md                  # This file
```

## Architecture

This project follows a clean, modular architecture:

- **`main.py`**: Minimal entry point that delegates to CLI
- **`cli/`**: All command-line interface logic, separated by concern
- **`core/`**: Pure business logic for image processing
- **`utils/`**: Reusable utilities (authentication, prompt management)
- **`api/`**: Future web API implementation
- **`tests/`**: Comprehensive test suite

## Examples

### Basic Usage
```bash
# Interactive mode - most user-friendly
python main.py

# Direct execution - good for automation
python main.py -i room.jpg -p prompts/modern_bedroom.yml

# List all available prompts with previews
python main.py --list-prompts
```

### Sample Prompt File
```yaml
# prompts/cozy_living_room.yml
prompt: >
  Transform this space into a cozy living room with warm lighting, 
  comfortable seating, plants, and modern décor elements.

metadata:
  room:
    type: living_room
    subtype: family
  style: cozy_modern
  colors:
    primary: warm_beige
    accent: forest_green

output: "outputs/cozy_living_room.png"
size: "1024x1024"
variations: 1
```

## Development

### Running Tests
```bash
python -m pytest tests/
```

### Adding New Features
The modular structure makes it easy to extend:

1. **New CLI commands**: Add handlers in `cli/handlers.py`
2. **New utilities**: Create modules in `utils/`
3. **Core functionality**: Extend `core/image_gen.py`
4. **API endpoints**: Implement in `api/app.py`

### Code Style
- Follow PEP 8 guidelines
- Use type hints where appropriate
- Add docstrings for public functions
- Keep modules focused on single responsibilities

## Requirements

- Python 3.7+
- OpenAI API key
- Dependencies listed in `requirements.txt`:
  - `requests` - HTTP client for API calls
  - `pyyaml` - YAML file parsing

## Configuration

### API Key Setup
Create a `config.yaml` file in the project root:

```yaml
api_key: "your_openai_api_key_here"
```

Alternatively, the application will prompt for your API key interactively.

### Environment Variables
You can also set the API key via environment variable:
```bash
export OPENAI_API_KEY="your_key_here"
```

## Troubleshooting

### Common Issues

1. **Import errors**: Ensure you're running from the project root directory
2. **API key errors**: Verify your OpenAI API key is valid and has credits
3. **File not found**: Check that image paths and prompt files exist
4. **YAML errors**: Validate your YAML syntax using a YAML linter

### Getting Help
- Use `python main.py --help` for command-line options
- Check the `prompts/` directory for example YAML files
- Enable verbose mode with `-v` for detailed error information

## Future Plans

- 🌐 **Web API**: FastAPI backend for web integration
- 🖼️ **Batch Processing**: Process multiple images at once
- 🎨 **Advanced Prompts**: Support for more complex prompt templates
- 📱 **Web UI**: Browser-based interface
- 🔄 **Prompt Templates**: Reusable prompt components
- 📊 **Analytics**: Usage statistics and performance metrics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the project structure
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---
