import sys
try:
    from PIL import Image
except ImportError:
    print("Pillow not installed")
    sys.exit(1)

def analyze_image(path):
    try:
        img = Image.open(path)
        print(f"Image Size: {img.size}")
        print(f"Mode: {img.mode}")
        # Sample center pixel
        center = (img.size[0]//2, img.size[1]//2)
        print(f"Center pixel: {img.getpixel(center)}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    analyze_image("public/assets/preview.png")
