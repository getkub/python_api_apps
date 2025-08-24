"""
Prompt management utilities.
"""

from pathlib import Path
from core.image_gen import load_yaml_file


class PromptManager:
    """Manages prompt files and operations."""
    
    def __init__(self, prompts_dir: str = "prompts"):
        self.prompts_dir = Path(prompts_dir)
    
    def list_prompts(self) -> None:
        """List all available prompt files in the prompts directory."""
        if not self.prompts_dir.exists():
            print("❌ Prompts directory not found.")
            return
        
        yaml_files = list(self.prompts_dir.glob("*.yml")) + list(self.prompts_dir.glob("*.yaml"))
        
        if not yaml_files:
            print("📁 No prompt files found in prompts/ directory.")
            return
        
        print("📋 Available prompt files:")
        print("=" * 40)
        
        for prompt_file in sorted(yaml_files):
            try:
                # Try to read the prompt to show preview
                data = load_yaml_file(str(prompt_file))
                prompt_text = data.get("prompt", "No prompt found")
                preview = prompt_text[:60] + "..." if len(prompt_text) > 60 else prompt_text
                
                print(f"📄 {prompt_file.name}")
                print(f"   {preview}")
                
                # Show metadata if available
                metadata = data.get("metadata")
                if metadata:
                    room_info = metadata.get("room", {})
                    if room_info:
                        room_type = room_info.get("type", "unknown")
                        subtype = room_info.get("subtype", "")
                        room_desc = f"{room_type}" + (f" ({subtype})" if subtype else "")
                        print(f"   🏠 Room: {room_desc}")
                
                size = data.get("size", "1024x1024")
                print(f"   📐 Size: {size}")
                print()
                
            except Exception as e:
                print(f"📄 {prompt_file.name} (error reading: {e})")
                print()
    
    def get_prompt_files(self) -> list:
        """Get list of available prompt files."""
        if not self.prompts_dir.exists():
            return []
        
        return list(self.prompts_dir.glob("*.yml")) + list(self.prompts_dir.glob("*.yaml"))