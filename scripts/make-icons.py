"""Generates the PWA icons in public/icons. Run: npm run icons (needs Pillow)."""
from PIL import Image, ImageDraw, ImageFont
import os
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
os.makedirs(OUT, exist_ok=True)
BG, FG, ACC = (15, 21, 20), (227, 236, 233), (79, 191, 166)

def font(size):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf"]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def icon(size, pad_ratio, rounded):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if rounded:
        d.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * 0.22), fill=BG)
    else:
        d.rectangle([0, 0, size, size], fill=BG)
    inner = size * (1 - 2 * pad_ratio)
    f1 = font(int(inner * 0.24)); f2 = font(int(inner * 0.36))
    cx = size / 2
    d.text((cx, size * 0.40), "DP", font=f1, fill=ACC, anchor="mm")
    d.text((cx, size * 0.62), "700", font=f2, fill=FG, anchor="mm")
    d.rounded_rectangle([cx - inner * 0.28, size * 0.78, cx + inner * 0.28, size * 0.78 + max(2, size * 0.025)], radius=size * 0.01, fill=ACC)
    return im

icon(192, 0.08, True).save(f"{OUT}/icon-192.png")
icon(512, 0.08, True).save(f"{OUT}/icon-512.png")
icon(512, 0.18, False).save(f"{OUT}/icon-maskable-512.png")
icon(180, 0.06, False).convert("RGB").save(f"{OUT}/apple-touch-icon.png")
print("icons written")
