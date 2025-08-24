import os
import sys
import base64
import requests
import yaml
import mimetypes
from pathlib import Path
from typing import Dict, Any, Tuple

OPENAI_URL = "https://api.openai.com/v1/images/edits"
DEFAULT_SIZE = "1024x1024"
DEFAULT_VARIATIONS = 1

class ConfigError(Exception):
    """Custom exception for configuration-related errors."""
    pass

class APIError(Exception):
    """Custom exception for API-related errors."""
    pass

def load_yaml_file(file_path: str) -> Dict[str, Any]:
    """Load and parse a YAML file.
    
    Args:
        file_path: Path to the YAML file
        
    Returns:
        Parsed YAML content as dictionary
        
    Raises:
        FileNotFoundError: If the YAML file doesn't exist
        ConfigError: If the YAML file is invalid or empty
    """
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"YAML file '{file_path}' not found.")
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
        
        if not data:
            raise ConfigError(f"YAML file '{file_path}' is empty or invalid.")
        
        return data
    except yaml.YAMLError as e:
        raise ConfigError(f"Invalid YAML syntax in '{file_path}': {e}")

def get_api_key(yaml_file: str = "config.yaml") -> str:
    """Extract API key from YAML configuration file.
    
    Args:
        yaml_file: Path to the configuration file
        
    Returns:
        API key string
        
    Raises:
        ConfigError: If API key is not found
    """
    config = load_yaml_file(yaml_file)
    api_key = config.get("api_key")
    
    if not api_key:
        raise ConfigError(f"API key not found in '{yaml_file}'.")
    
    return api_key

def parse_prompt_config(yaml_path: str) -> Tuple[str, str, str, int]:
    """Parse the prompt configuration YAML file.
    
    Args:
        yaml_path: Path to the prompt configuration file
        
    Returns:
        Tuple of (prompt, output_path, size, variations)
        
    Raises:
        ConfigError: If required fields are missing
    """
    data = load_yaml_file(yaml_path)
    
    # Required fields
    prompt = data.get("prompt")
    output = data.get("output")
    
    if not prompt:
        raise ConfigError("'prompt' field is required in the YAML file.")
    if not output:
        raise ConfigError("'output' field is required in the YAML file.")
    
    # Optional fields with defaults
    size = data.get("size", DEFAULT_SIZE)
    variations = data.get("variations", DEFAULT_VARIATIONS)
    
    # Validate size format
    if not isinstance(size, str) or "x" not in size:
        raise ConfigError(f"Invalid size format '{size}'. Expected format: 'WIDTHxHEIGHT'")
    
    # Validate variations
    if not isinstance(variations, int) or variations < 1:
        raise ConfigError(f"Invalid variations '{variations}'. Must be a positive integer.")
    
    return prompt.strip(), output, size, variations

def validate_image_file(image_path: str) -> None:
    """Validate that the image file exists and is readable.
    
    Args:
        image_path: Path to the image file
        
    Raises:
        FileNotFoundError: If image file doesn't exist
    """
    if not os.path.isfile(image_path):
        raise FileNotFoundError(f"Image file '{image_path}' not found.")

def create_output_directory(output_path: str) -> None:
    """Create the output directory if it doesn't exist.
    
    Args:
        output_path: Path to the output file
    """
    output_dir = os.path.dirname(output_path)
    if output_dir:
        Path(output_dir).mkdir(parents=True, exist_ok=True)

def get_mime_type(file_path: str) -> str:
    """Get MIME type for a file.
    
    Args:
        file_path: Path to the file
        
    Returns:
        MIME type string
    """
    mime_type, _ = mimetypes.guess_type(file_path)
    return mime_type if mime_type else "application/octet-stream"

def call_openai_api(api_key: str, image_path: str, prompt: str, size: str) -> Dict[str, Any]:
    """Make API call to OpenAI image editing endpoint.
    
    Args:
        api_key: OpenAI API key
        image_path: Path to the source image
        prompt: Text prompt for editing
        size: Image size in format "WIDTHxHEIGHT"
        
    Returns:
        API response as dictionary
        
    Raises:
        APIError: If API call fails
    """
    mime_type = get_mime_type(image_path)
    
    with open(image_path, "rb") as img_file:
        files = {
            "image": (os.path.basename(image_path), img_file, mime_type),
        }
        data = {
            "prompt": prompt,
            "size": size,
            "response_format": "b64_json",
        }
        headers = {
            "Authorization": f"Bearer {api_key}",
        }
        
        try:
            response = requests.post(
                OPENAI_URL, 
                headers=headers, 
                data=data, 
                files=files, 
                timeout=60
            )
        except requests.RequestException as e:
            raise APIError(f"Request failed: {e}")
    
    if response.status_code != 200:
        raise APIError(f"API ERROR: [{response.status_code}] {response.text}")
    
    try:
        return response.json()
    except ValueError as e:
        raise APIError(f"Invalid JSON response: {e}")

def save_base64_image(b64_data: str, output_path: str) -> None:
    """Save base64 encoded image data to file.
    
    Args:
        b64_data: Base64 encoded image data
        output_path: Path where to save the image
    """
    try:
        image_data = base64.b64decode(b64_data)
        with open(output_path, "wb") as out_file:
            out_file.write(image_data)
    except Exception as e:
        raise RuntimeError(f"Failed to save image: {e}")

def edit_image(api_key: str, image_path: str, prompt: str, output_path: str, 
               size: str = DEFAULT_SIZE, variations: int = DEFAULT_VARIATIONS) -> str:
    """Edit an image using OpenAI's image editing API.
    
    Args:
        api_key: OpenAI API key
        image_path: Path to the source image
        prompt: Text prompt for editing
        output_path: Path where to save the edited image
        size: Image size in format "WIDTHxHEIGHT"
        variations: Number of variations to generate (currently only uses first)
        
    Returns:
        Path to the saved edited image
        
    Raises:
        ValueError: If parameters are invalid
        APIError: If API call fails
        RuntimeError: If image processing fails
    """
    if not api_key:
        raise ValueError("API key is required.")
    
    validate_image_file(image_path)
    create_output_directory(output_path)
    
    # Make API call
    result = call_openai_api(api_key, image_path, prompt, size)
    
    # Process response
    if "data" not in result or not result["data"]:
        raise RuntimeError("Received empty response data from API.")
    
    b64_image = result["data"][0].get("b64_json")
    if not b64_image:
        raise RuntimeError("No base64 image data found in API response.")
    
    # Save the image
    save_base64_image(b64_image, output_path)
    
    return output_path

def main() -> None:
    """Main function to handle command line interface."""
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} IMAGE_PATH PROMPT_YAML_PATH [API_KEY_YAML_PATH]")
        print("\nExample:")
        print(f"  {sys.argv[0]} input.png bedroom_prompt.yaml config.yaml")
        sys.exit(1)

    image_path = sys.argv[1]
    prompt_yaml_path = sys.argv[2]
    api_key_yaml_path = sys.argv[3] if len(sys.argv) > 3 else "config.yaml"

    try:
        # Load configuration
        prompt, output_path, size, variations = parse_prompt_config(prompt_yaml_path)
        api_key = get_api_key(api_key_yaml_path)
        
        # Process image
        print(f"🎨 Editing image '{image_path}' with prompt: '{prompt[:50]}{'...' if len(prompt) > 50 else ''}'")
        print(f"📐 Size: {size}, Variations: {variations}")
        
        result_path = edit_image(api_key, image_path, prompt, output_path, size, variations)
        
        print(f"✅ Decorated image saved to: {result_path}")
        
    except (FileNotFoundError, ConfigError, ValueError, APIError, RuntimeError) as e:
        print(f"❌ Error ({type(e).__name__}): {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n⚠️  Operation cancelled by user.")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error ({type(e).__name__}): {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()