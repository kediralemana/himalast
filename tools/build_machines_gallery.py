import os
import sys
from pathlib import Path
from PIL import Image, ImageOps

"""
Usage (Windows PowerShell):

# Activate your venv if needed, then run:
python tools/build_machines_gallery.py "C:/Users/Beto/Music/personal_filll/himma group/photos (9)/bakery matchine import"

What it does:
- Copies all images (jpg/jpeg/png/webp) from the source folder into static/img/machines-gallery/
- Normalizes filenames to safe, lowercase, hyphenated names
- Converts to JPEG when appropriate and resizes to max 1920px (keeps quality)
- Writes/updates manifest.json with the resulting filenames
"""

VALID_EXTS = {'.jpg', '.jpeg', '.png', '.webp'}
DEST_DIR = Path('static/img/machines-gallery')
MANIFEST = DEST_DIR / 'manifest.json'


def safe_name(name: str) -> str:
    s = name.strip().lower()
    for ch in [" ", "(", ")", ",", "+", "&", "[", "]", "{", "}"]:
        s = s.replace(ch, "-")
    s = s.replace("__", "-").replace("--", "-")
    return s


def process_image(src: Path, dest_dir: Path) -> str:
    dest_dir.mkdir(parents=True, exist_ok=True)
    name = safe_name(src.stem) + src.suffix.lower()

    # Open + autorotate
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        # Resize if too large
        max_side = 1920
        w, h = im.size
        scale = min(1.0, max_side / max(w, h))
        if scale < 1.0:
            im = im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)

        # Convert to JPEG if RGBA or WEBP to keep size small (unless transparency)
        ext = src.suffix.lower()
        if ext in {'.png', '.webp'} and (im.mode in ('RGBA', 'LA')):
            # Keep PNG to preserve transparency
            out_name = safe_name(src.stem) + '.png'
            out_path = dest_dir / out_name
            im.save(out_path)
        else:
            if im.mode in ('RGBA', 'LA'):
                im = im.convert('RGB')
            out_name = safe_name(src.stem) + '.jpg'
            out_path = dest_dir / out_name
            im.save(out_path, quality=86, optimize=True)

    return out_path.name


def main():
    if len(sys.argv) < 2:
        print('Please provide a source folder path with images.')
        print('Example: python tools/build_machines_gallery.py "C:/path/to/bakery matchine import"')
        sys.exit(1)

    src_dir = Path(sys.argv[1])
    if not src_dir.exists() or not src_dir.is_dir():
        print(f'Source not found: {src_dir}')
        sys.exit(1)

    files = [p for p in src_dir.iterdir() if p.suffix.lower() in VALID_EXTS]
    if not files:
        print('No supported image files found in the source directory.')
        sys.exit(0)

    DEST_DIR.mkdir(parents=True, exist_ok=True)

    result = []
    for fp in files:
        try:
            out = process_image(fp, DEST_DIR)
            result.append(out)
            print('Added:', out)
        except Exception as e:
            print('Failed:', fp, '->', e)

    # Write manifest
    import json
    with open(MANIFEST, 'w', encoding='utf-8') as f:
        json.dump(sorted(result), f, ensure_ascii=False, indent=2)
    print('\nWrote manifest with', len(result), 'images at', MANIFEST)


if __name__ == '__main__':
    main()
