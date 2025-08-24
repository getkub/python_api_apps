#!/usr/bin/env python3
"""
OpenAI Image Editor - Main Entry Point
Simple entry point that delegates to the CLI module.
"""

import sys
from pathlib import Path

# Add project root to Python path
sys.path.insert(0, str(Path(__file__).parent))

from cli.interface import main

if __name__ == "__main__":
    main()