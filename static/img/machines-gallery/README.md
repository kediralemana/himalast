# Machines Gallery

Drop your images in this folder, then update `manifest.json` (same folder) with the list of filenames, for example:

```json
[
  "1.jpg",
  "2.jpg",
  "3-decks-oven.jpg",
  "5-trays-convection-oven.png"
]
```

Tips
- Prefer JPG for photos; PNG for transparent images.
- Large files are fine; the page lazy-loads and uses a horizontal slider with scroll-snap.
- After adding files, hard-refresh the page (Ctrl+F5). If a service worker is installed, go to DevTools → Application → Service Workers → Update/Skip waiting.
