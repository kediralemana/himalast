"""
Export Flask-rendered pages to a static site (dist/ folder).

Usage (Windows PowerShell):
  # Activate your venv first if needed
  # python tools/export_static.py

It will create:
  dist/index.html
  dist/company/machines.html
  dist/company/materials.html
  dist/company/coffee.html
and copy the /static folder to dist/static.

Upload the contents of dist/ to your hosting document root to
serve the same pages you see locally from Flask.
"""
from __future__ import annotations
import os
import shutil
from pathlib import Path

import sys
BASE_DIR = Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app import app  # reuse the Flask app and templates

DIST = Path('dist')
ROUTES = {
    '/': 'index.html',
    '/company/machines': 'company/machines.html',
    '/company/materials': 'company/materials.html',
    '/company/coffee': 'company/coffee.html',
}


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def export_pages() -> None:
    # Clean dist folder
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True, exist_ok=True)

    # Use Flask test client to render full pages (with correct url_for paths)
    with app.test_client() as client:
        for route, out_rel in ROUTES.items():
            resp = client.get(route)
            if resp.status_code != 200:
                raise RuntimeError(f"Route {route} returned {resp.status_code}")
            out_path = DIST / out_rel
            ensure_parent(out_path)
            out_path.write_bytes(resp.data)
            print(f"✓ Exported {route} -> {out_rel}")

    # Copy static assets
    src_static = Path(app.static_folder)
    dst_static = DIST / 'static'
    shutil.copytree(src_static, dst_static)
    print(f"✓ Copied static -> {dst_static}")

    # Optionally copy assets/ if you want to keep the alternative static site
    if Path('assets').exists():
        shutil.copytree('assets', DIST / 'assets', dirs_exist_ok=True)
        print("✓ Copied assets -> dist/assets")


if __name__ == '__main__':
    export_pages()
    print("\nStatic export complete. Upload the 'dist' folder contents to your host.")
