"""
Image format conversion utilities.
"""

import os
import tempfile
from pathlib import Path
from PIL import Image
from typing import Tuple


class ImageConverter:
    """Handles image format conversions for API compatibility."""
    
    @staticmethod
    def to_rgba(image_path: str, output_path: str = None) -> str:
        """Convert image to RGBA format required by OpenAI API.
        
        Args:
            image_path: Path to input image
            output_path: Optional output path. If None, creates temp file or overwrites input
            
        Returns:
            Path to RGBA image
            
        Raises:
            FileNotFoundError: If input image doesn't exist
            RuntimeError: If conversion fails
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file '{image_path}' not found.")
        
        try:
            with Image.open(image_path) as img:
                # Check if already RGBA
                if img.mode == 'RGBA':
                    print(f"✅ Image is already in RGBA format")
                    return image_path
                
                print(f"🔄 Converting {img.mode} to RGBA format...")
                
                # Convert to RGBA
                rgba_img = img.convert('RGBA')
                
                # Determine output path
                if output_path is None:
                    # Create new filename with _rgba suffix
                    path = Path(image_path)
                    output_path = str(path.parent / f"{path.stem}_rgba{path.suffix}")
                
                # Ensure output directory exists
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
                
                # Save RGBA image
                rgba_img.save(output_path, 'PNG')
                print(f"✅ Converted to RGBA: {output_path}")
                
                return output_path
                
        except Exception as e:
            raise RuntimeError(f"Failed to convert image to RGBA: {e}")
    
    @staticmethod
    def to_rgba_temp(image_path: str) -> Tuple[str, bool]:
        """Convert image to RGBA in a temporary file.
        
        Args:
            image_path: Path to input image
            
        Returns:
            Tuple of (rgba_image_path, is_temp_file)
            
        Raises:
            FileNotFoundError: If input image doesn't exist
            RuntimeError: If conversion fails
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file '{image_path}' not found.")
        
        try:
            with Image.open(image_path) as img:
                # Check if already RGBA
                if img.mode == 'RGBA':
                    return image_path, False
                
                print(f"🔄 Converting {img.mode} to RGBA format (temporary)...")
                
                # Create temporary PNG file
                temp_fd, temp_path = tempfile.mkstemp(suffix='.png')
                os.close(temp_fd)  # Close the file descriptor
                
                # Convert to RGBA
                rgba_img = img.convert('RGBA')
                rgba_img.save(temp_path, 'PNG')
                
                print(f"✅ Converted to RGBA: {temp_path}")
                return temp_path, True
                
        except Exception as e:
            raise RuntimeError(f"Failed to convert image to RGBA: {e}")
    
    @staticmethod
    def cleanup_temp_file(file_path: str, is_temp: bool) -> None:
        """Clean up temporary file if needed.
        
        Args:
            file_path: Path to file
            is_temp: Whether the file is temporary
        """
        if is_temp and os.path.exists(file_path):
            try:
                os.unlink(file_path)
                print(f"🗑️  Cleaned up temporary file: {file_path}")
            except OSError:
                pass  # Ignore cleanup errors
    
    @staticmethod
    def get_image_info(image_path: str) -> dict:
        """Get information about an image file.
        
        Args:
            image_path: Path to image file
            
        Returns:
            Dictionary with image information
        """
        try:
            with Image.open(image_path) as img:
                return {
                    'format': img.format,
                    'mode': img.mode,
                    'size': img.size,
                    'filename': os.path.basename(image_path)
                }
        except Exception as e:
            return {'error': str(e)}


# Standalone conversion function for quick use
def convert_image_to_rgba(input_path: str, output_path: str = None) -> str:
    """Standalone function to convert any image to RGBA PNG.
    
    Args:
        input_path: Path to input image
        output_path: Optional output path
        
    Returns:
        Path to converted RGBA image
    """
    converter = ImageConverter()
    return converter.to_rgba(input_path, output_path)


if __name__ == "__main__":
    """CLI usage for standalone conversion."""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python -m utils.converter INPUT_IMAGE [OUTPUT_IMAGE]")
        print("Example: python -m utils.converter image.jpg image_rgba.png")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    try:
        result = convert_image_to_rgba(input_file, output_file)
        print(f"🎉 Conversion complete: {result}")
    except Exception as e:
        print(f"❌ Conversion failed: {e}")
        sys.exit(1)