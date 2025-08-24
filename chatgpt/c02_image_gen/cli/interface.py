"""
CLI Interface Module
Handles command-line parsing and user interaction.
"""

import argparse
import sys
from typing import Optional

from .handlers import InteractiveHandler, DirectHandler, ListHandler
from .parser import ArgumentParser


class CLIInterface:
    """Main CLI interface coordinator."""
    
    def __init__(self):
        self.parser = ArgumentParser()
        self.interactive_handler = InteractiveHandler()
        self.direct_handler = DirectHandler()
        self.list_handler = ListHandler()
    
    def run(self) -> None:
        """Run the CLI application."""
        try:
            args = self.parser.parse()
            
            if args.list_prompts:
                self.list_handler.handle(args)
            elif args.interactive:
                self.interactive_handler.handle(args)
            else:
                self.direct_handler.handle(args)
                
        except KeyboardInterrupt:
            print("\n⚠️  Operation cancelled by user")
            sys.exit(1)
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            sys.exit(1)


def main() -> None:
    """Main entry point for the CLI."""
    cli = CLIInterface()
    cli.run()