"""
Command Line Argument Parser
"""

import argparse
from typing import Any


class ArgumentParser:
    """Handles command line argument parsing."""
    
    def __init__(self):
        self.parser = self._setup_parser()
    
    def _setup_parser(self) -> argparse.ArgumentParser:
        """Set up the argument parser."""
        parser = argparse.ArgumentParser(
            description="Edit images using OpenAI's DALL-E API with YAML prompts",
            formatter_class=argparse.RawDescriptionHelpFormatter,
            epilog="""
Examples:
  %(prog)s                                    # Interactive mode
  %(prog)s -i image.jpg -p prompts/bedroom.yml # Direct execution
  %(prog)s -i image.jpg -p prompts/bedroom.yml -c config.yaml # With config file
  %(prog)s --list-prompts                     # List available prompts
            """
        )
        
        parser.add_argument(
            "-i", "--image", 
            help="Path to input image file"
        )
        
        parser.add_argument(
            "-p", "--prompt", 
            help="Path to YAML prompt file"
        )
        
        parser.add_argument(
            "-c", "--config", 
            default="config.yaml",
            help="Path to config YAML file (default: config.yaml)"
        )
        
        parser.add_argument(
            "--list-prompts", 
            action="store_true",
            help="List available prompt files in the prompts/ directory"
        )
        
        parser.add_argument(
            "--interactive", 
            action="store_true", 
            default=True,
            help="Run in interactive mode (default)"
        )
        
        parser.add_argument(
            "--no-interactive", 
            dest="interactive", 
            action="store_false",
            help="Disable interactive mode"
        )
        
        parser.add_argument(
            "-v", "--verbose", 
            action="store_true",
            help="Enable verbose output"
        )
        
        return parser
    
    def parse(self) -> Any:
        """Parse command line arguments."""
        return self.parser.parse_args()