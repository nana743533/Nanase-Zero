import os
from PIL import Image

def analyze_assets(dir_path):
    files = ["cell_empty.png", "stone_black.png", "stone_white.png"]
    for f in files:
        path = os.path.join(dir_path, f)
        if not os.path.exists(path):
            print(f"MISSING: {f}")
            continue
            
        try:
            img = Image.open(path)
            print(f"File: {f}")
            print(f"  Size: {img.size}")
            print(f"  Mode: {img.mode}")
            # Check center pixel alpha
            center = (img.size[0]//2, img.size[1]//2)
            px = img.getpixel(center)
            print(f"  Center pixel: {px}")
            
            # Check corner pixel (should be transparent for stones if masked)
            corner = (0, 0)
            px_c = img.getpixel(corner)
            print(f"  Corner pixel: {px_c}")
            
        except Exception as e:
            print(f"INVALID: {f} - {e}")

if __name__ == "__main__":
    analyze_assets("frontend/public/assets/game")
