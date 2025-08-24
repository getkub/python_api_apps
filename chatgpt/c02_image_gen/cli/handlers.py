"""
CLI Command Handlers
Different handlers for various CLI operations.
"""

import os
import sys
from abc import ABC, abstractmethod
from typing import Any

from utils.prompts import PromptManager
from utils.auth import AuthManager  
from core.image_gen import parse_prompt_config, edit_image, ConfigError, APIError


class BaseHandler(ABC):
    """Base class for CLI handlers."""
    
    @abstractmethod
    def handle(self, args: Any) -> None:
        """Handle the CLI command."""
        pass


class ListHandler(BaseHandler):
    """Handler for listing available prompts."""
    
    def __init__(self):
        self.prompt_manager = PromptManager()
    
    def handle(self, args: Any) -> None:
        """List available prompt files."""
        self.prompt_manager.list_prompts()


class InteractiveHandler(BaseHandler):
    """Handler for interactive mode."""
    
    def __init__(self):
        self.auth_manager = AuthManager()
        self.prompt_manager = PromptManager()
    
    def handle(self, args: Any) -> None:
        """Handle interactive mode."""
        print("🎨 === OpenAI Image Editor - Interactive Mode ===")
        print()
        
        # Show available prompts first
        print("📋 Available prompts:")
        self.prompt_manager.list_prompts()
        
        # Get user inputs for files first
        prompt_path = self._get_input_with_default(
            "📄 Enter path to YAML prompt file", 
            "prompts/p01_bedroom_master.yml"
        )
        
        if not prompt_path:
            print("❌ Prompt file path is required")
            sys.exit(1)
        
        image_path = self._get_input_with_default("🖼️  Enter path to input image")
        
        if not image_path:
            print("❌ Image file path is required")
            sys.exit(1)
        
        # Get API key AFTER file inputs
        print()  # Add some spacing
        try:
            api_key = self.auth_manager.get_api_key_interactive(args.config, args.verbose)
        except Exception as e:
            print(f"❌ Error getting API key: {e}")
            sys.exit(1)
        
        # Process the image
        self._process_image(api_key, image_path, prompt_path, args.verbose)
    
    def _get_input_with_default(self, prompt: str, default: str = None) -> str:
        """Get user input with optional default value."""
        if default:
            full_prompt = f"{prompt} (default: {default}): "
        else:
            full_prompt = f"{prompt}: "
        
        user_input = input(full_prompt).strip()
        return user_input if user_input else (default or "")
    
    def _process_image(self, api_key: str, image_path: str, prompt_path: str, verbose: bool = False) -> None:
        """Process the image with the given parameters."""
        try:
            # Parse prompt configuration
            prompt, output_file, size, variations = parse_prompt_config(prompt_path)
            
            if verbose:
                print(f"\n📋 Configuration:")
                print(f"   Input image: {image_path}")
                print(f"   Prompt file: {prompt_path}")
                print(f"   Output file: {output_file}")
                print(f"   Size: {size}")
                print(f"   Variations: {variations}")
            
            print(f"\n🎨 Processing image with prompt:")
            print(f"   \"{prompt[:100]}{'...' if len(prompt) > 100 else ''}\"")
            print(f"📐 Size: {size} | 🔄 Variations: {variations}")
            print(f"⏳ Please wait, this may take a moment...")
            
            # Edit the image
            result_file = edit_image(api_key, image_path, prompt, output_file, size, variations)
            
            print(f"\n✅ Success! Edited image saved to:")
            print(f"   {os.path.abspath(result_file)}")
            
            # Show file size if possible
            try:
                file_size = os.path.getsize(result_file)
                size_mb = file_size / (1024 * 1024)
                print(f"📊 File size: {size_mb:.2f} MB")
            except:
                pass
                
        except (FileNotFoundError, ConfigError, ValueError, APIError) as e:
            print(f"❌ Error: {e}")
            sys.exit(1)


class DirectHandler(BaseHandler):
    """Handler for direct (non-interactive) mode."""
    
    def __init__(self):
        self.auth_manager = AuthManager()
    
    def handle(self, args: Any) -> None:
        """Handle direct execution mode."""
        if not args.image or not args.prompt:
            print("❌ In non-interactive mode, both --image and --prompt are required")
            print("💡 Use --help for usage information")
            sys.exit(1)
        
        try:
            api_key = self.auth_manager.get_api_key_interactive(args.config, args.verbose)
            self._process_image(api_key, args.image, args.prompt, args.verbose)
        except Exception as e:
            print(f"❌ Error: {e}")
            sys.exit(1)
    
    def _process_image(self, api_key: str, image_path: str, prompt_path: str, verbose: bool = False) -> None:
        """Process the image with the given parameters."""
        try:
            # Parse prompt configuration
            prompt, output_file, size, variations = parse_prompt_config(prompt_path)
            
            if verbose:
                print(f"📋 Processing: {image_path} -> {output_file}")
                print(f"📐 Size: {size} | 🔄 Variations: {variations}")
            
            # Edit the image
            result_file = edit_image(api_key, image_path, prompt, output_file, size, variations)
            
            print(f"✅ Success! Output: {os.path.abspath(result_file)}")
            
        except (FileNotFoundError, ConfigError, ValueError, APIError) as e:
            print(f"❌ Error: {e}")
            sys.exit(1)