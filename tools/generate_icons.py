"""Generate resized app icons from the existing static/logo.png.

Creates:
  - static/logo-192.png
  - static/logo-512.png

Uses Pillow (PIL). Run with the project's venv python.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
src = ROOT / 'static' / 'logo.png'
if not src.exists():
    raise SystemExit(f"Source logo not found: {src}")

out_dir = ROOT / 'static'
out_dir.mkdir(parents=True, exist_ok=True)

def make_icon(size):
    out = out_dir / f'logo-{size}.png'
    with Image.open(src) as im:
        im = im.convert('RGBA')
        # Fit image into a square canvas while preserving aspect ratio
        canvas = Image.new('RGBA', (size, size), (255, 255, 255, 0))
        w, h = im.size
        if w == 0 or h == 0:
            raise SystemExit('Source image has zero dimension')
        ratio = min(size / w, size / h)
        new_w = int(w * ratio)
        new_h = int(h * ratio)
        resized = im.resize((new_w, new_h), Image.LANCZOS)
        paste_x = (size - new_w) // 2
        paste_y = (size - new_h) // 2
        canvas.paste(resized, (paste_x, paste_y), resized)
        canvas.save(out, format='PNG', optimize=True)
    print(f'Wrote {out}')

def main():
    for s in (192, 512):
        make_icon(s)

if __name__ == '__main__':
    main()
