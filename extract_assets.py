import os
from PIL import Image, ImageDraw

def extract_assets(src_path, dest_dir):
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
        
    img = Image.open(src_path).convert("RGBA")
    width, height = img.size
    cell_w = width // 8
    cell_h = height // 8
    
    print(f"Cell size: {cell_w}x{cell_h}")
    
    # 1. Empty Cell (1,1) -> Use this as the base for everything
    # Using (1,1) avoids potential outer border artifacts
    empty_rect = (cell_w, cell_h, 2*cell_w, 2*cell_h)
    empty_cell = img.crop(empty_rect)
    empty_cell.save(os.path.join(dest_dir, "cell_empty.png"))
    print("Saved cell_empty.png")
    
    # Function to circle mask
    def save_masked_stone(r, c, name):
        rect = (c*cell_w, r*cell_h, (c+1)*cell_w, (r+1)*cell_h)
        stone_img = img.crop(rect)
        
        # Create circular mask
        mask = Image.new('L', (cell_w, cell_h), 0)
        draw = ImageDraw.Draw(mask)
        # Draw white circle. Shrink slightly to avoid edge bleeding (e.g. 5% margin)
        margin = int(cell_w * 0.1) 
        draw.ellipse((margin, margin, cell_w - margin, cell_h - margin), fill=255)
        
        # Apply mask
        stone_masked = stone_img.copy()
        stone_masked.putalpha(mask)
        stone_masked.save(os.path.join(dest_dir, name))
        print(f"Saved {name} with mask")

    # 2. White Stone (3,3)
    save_masked_stone(3, 3, "stone_white.png")
    
    # 3. Black Stone (3,4)
    save_masked_stone(3, 4, "stone_black.png")

if __name__ == "__main__":
    extract_assets("public/assets/preview.png", "frontend/public/assets/game")
