import sys
from PIL import Image, ImageDraw, ImageFont

def main():
    img_path = 'public/assets/hero_perfume_v6_backup.jpg'
    out_path = 'public/assets/hero_perfume_v6.jpg'
    img = Image.open(img_path)
    
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 48)
    except:
        font = ImageFont.load_default()

    txt = Image.new('RGBA', img.size, (255,255,255,0))
    d = ImageDraw.Draw(txt)
    
    text = "ZENV"
    
    bbox = d.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    
    x = 700
    y = 310
    
    # Draw text in black with some opacity, add a bit of letter spacing by drawing letter by letter
    letters = list(text)
    spacing = 15
    total_w = sum(d.textbbox((0,0), letter, font=font)[2] - d.textbbox((0,0), letter, font=font)[0] for letter in letters) + spacing * (len(letters) - 1)
    
    start_x = x - total_w / 2
    current_x = start_x
    for letter in letters:
        lw = d.textbbox((0,0), letter, font=font)[2] - d.textbbox((0,0), letter, font=font)[0]
        d.text((current_x, y - h/2), letter, font=font, fill=(20, 20, 20, 220))
        current_x += lw + spacing
    
    out = Image.alpha_composite(img.convert('RGBA'), txt)
    out.convert('RGB').save(out_path, quality=95)
    print("Image saved.")

if __name__ == '__main__':
    main()
