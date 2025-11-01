import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
src = ROOT / 'static' / 'logo.png'
dst_dir = ROOT / 'static' / 'img'
dst = dst_dir / 'logo.png'

if not src.exists():
    print(f"Source logo not found: {src}")
    raise SystemExit(1)

dst_dir.mkdir(parents=True, exist_ok=True)
shutil.copy2(src, dst)
print(f"Copied {src} -> {dst}")
