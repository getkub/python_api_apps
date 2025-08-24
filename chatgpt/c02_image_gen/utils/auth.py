"""
Authentication utilities for managing API keys.
"""

import os
from getpass import getpass
from core.image_gen import get_api_key


class AuthManager:
    """Manages API key authentication."""
    
    def get_api_key_interactive(self, config_path: str, verbose: bool = False) -> str:
        """Get API key either from config file or user input."""
        # First try to load from config file
        if os.path.exists(config_path):
            try:
                api_key = get_api_key(config_path)
                if verbose:
                    print(f"✅ API key loaded from {config_path}")
                return api_key
            except Exception as e:
                if verbose:
                    print(f"⚠️  Could not load API key from {config_path}: {e}")
        
        # If config file doesn't exist or failed, ask user
        print(f"💡 Tip: Create {config_path} with 'api_key: your_key_here' to skip this step")
        api_key = getpass("🔑 Enter your OpenAI API key: ").strip()
        
        if not api_key:
            raise ValueError("API key is required")
        
        return api_key