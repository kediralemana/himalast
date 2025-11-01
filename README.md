# Himma Group website

Static site with one landing page and three detail pages:
- Coffee Export (`company/coffee.html`)
- Bakery Machine Import (`company/machines.html`)
- Bakery Raw Materials (`company/materials.html`)

Brand colors are approximated from the provided logo and defined as CSS variables in `assets/css/styles.css`.

## How to use
1. Put your transparent PNG logo at `assets/logo.png` (replace the placeholder if needed). Use the attached Himma Coffee logo for now by saving it as that file.
2. (Optional) Provide your copy without editing HTML: copy `content/data.example.js` to `content/data.js` and replace the text values. Pages will auto-populate. You can also set a WhatsApp number and default message there.
3. Open `index.html` directly in your browser, or use a simple static server for local development.

### Optional: run a local server (Windows PowerShell)
```
# If you have Python installed
python -m http.server 8080
# then open http://localhost:8080/
```

## Customize
- Update contact info in `index.html` (Contact section).
- Tweak colors in `:root` of `assets/css/styles.css` if you want closer matching to the brand.
- Edit content on each company page to add photos, partner logos, and product catalogs.

### Configure WhatsApp chat button
1. Copy `content/data.example.js` to `content/data.js` if you haven’t already.
2. The button will first use the phone shown in the Contact section on `index.html`. You can also set `site.whatsapp` in `content/data.js` (international format, e.g., `+2519XXXXXXXX`).
3. Optionally edit `site.whatsappMessage`.
The floating button appears bottom-right on every page. If no number can be determined, clicking it shows a brief alert explaining how to set it up.
