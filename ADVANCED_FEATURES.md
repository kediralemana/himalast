# Advanced Features Documentation

This document describes the advanced features implemented in the Himma Group website.

## Table of Contents
1. [Progressive Web App (PWA)](#progressive-web-app-pwa)
2. [Dark Mode](#dark-mode)
3. [Lazy Loading & Performance](#lazy-loading--performance)
4. [Google Analytics 4](#google-analytics-4)
5. [Email Notifications](#email-notifications)
6. [Image Lightbox Gallery](#image-lightbox-gallery)
7. [Rate Limiting](#rate-limiting)
8. [Advanced SEO Schema](#advanced-seo-schema)

---

## Progressive Web App (PWA)

The website is now a fully functional Progressive Web App, offering offline capabilities and app-like experience.

### Features:
- **Service Worker**: Caches critical assets for offline access
- **Web App Manifest**: Enables "Add to Home Screen" on mobile devices
- **Offline Support**: Website works without internet connection
- **Fast Loading**: Assets are cached and served quickly

### Files:
- `/static/manifest.json` - App manifest configuration
- `/static/sw.js` - Service worker for caching

### Installation:
Users can install the website as an app on mobile devices:
1. Visit the website on mobile
2. Tap browser menu
3. Select "Add to Home Screen" or "Install App"

---

## Dark Mode

Fully functional dark mode with smooth transitions and localStorage persistence.

### Features:
- Toggle button (bottom-left corner)
- Automatic theme persistence across sessions
- Smooth color transitions
- Custom dark theme optimized for readability

### Usage:
Click the sun/moon icon in the bottom-left corner to toggle between light and dark modes.

### Implementation:
- CSS Variables in `/static/css/styles.css`
- JavaScript in `/static/js/main.js` (Dark Mode Toggle section)
- Theme stored in browser's localStorage

---

## Lazy Loading & Performance

Advanced image loading with WebP support and scroll animations.

### Features:
- **Lazy Loading**: Images load only when they enter the viewport
- **WebP Detection**: Automatic WebP support detection
- **Scroll Animations**: Elements fade in as you scroll
- **Performance Optimization**: Preloads critical resources

### Implementation:
To use lazy loading, add `data-src` attribute to images:
```html
<img data-src="/static/img/photo.jpg" alt="Description">
```

### Animations:
Elements with class `.animate-on-scroll` will animate when they enter the viewport.

---

## Google Analytics 4

Comprehensive event tracking and user behavior analytics.

### Setup:
1. Get your Google Analytics 4 Measurement ID from [Google Analytics](https://analytics.google.com/)
2. Replace `G-XXXXXXXXXX` in `/templates/base.html` with your actual ID
3. Update `.env` file with `GA_MEASUREMENT_ID=G-YOUR-ID`

### Tracked Events:
- **Button Clicks**: All CTA and button interactions
- **WhatsApp Button**: Clicks on WhatsApp floating button
- **Theme Toggle**: Dark/light mode switches
- **Navigation**: Menu link clicks
- **Scroll Depth**: 25%, 50%, 75%, 100% scroll milestones
- **Form Submissions**: Contact form submissions
- **Gallery Views**: Image lightbox interactions

### Custom Event Tracking:
Use the global `trackEvent()` function:
```javascript
trackEvent('custom_event', {
  parameter1: 'value1',
  parameter2: 'value2'
});
```

---

## Email Notifications

Automated email system for contact form submissions.

### Features:
- **Admin Notifications**: Receive formatted emails for each submission
- **Customer Auto-Reply**: Automatic confirmation email to customers
- **HTML Emails**: Beautiful, branded email templates
- **Spam Protection**: Integrated with rate limiting

### Setup:

#### 1. Create `.env` file:
```bash
cp .env.example .env
```

#### 2. Configure Email Settings:

**For Gmail:**
```env
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=info@himmagroup.com
```

**Getting Gmail App Password:**
1. Enable 2-Step Verification in your Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an App Password for "Mail"
4. Use that password in `MAIL_PASSWORD`

**For Other Email Providers:**
- **Outlook**: `smtp.office365.com`, Port 587
- **Yahoo**: `smtp.mail.yahoo.com`, Port 587
- **Custom SMTP**: Use your provider's settings

#### 3. Install Dependencies:
```bash
pip install -r requirements.txt
```

#### 4. Test Email:
Submit the contact form and check your inbox.

### Email Templates:
Email templates are defined in `/app.py` in the `send_contact_email()` function.

---

## Image Lightbox Gallery

Professional image gallery with fullscreen lightbox viewer.

### Features:
- Fullscreen image viewing
- Keyboard navigation (Arrow keys, Escape)
- Touch/swipe support on mobile
- Image counter
- Smooth transitions

### Usage:

#### 1. Add Gallery Grid:
```html
<div class="gallery-grid">
  <div class="gallery-item">
    <img src="/static/img/photo1.jpg" alt="Photo 1">
  </div>
  <div class="gallery-item">
    <img src="/static/img/photo2.jpg" alt="Photo 2">
  </div>
  <div class="gallery-item">
    <img src="/static/img/photo3.jpg" alt="Photo 3">
  </div>
</div>
```

#### 2. Keyboard Controls:
- **Escape**: Close lightbox
- **Arrow Left**: Previous image
- **Arrow Right**: Next image

#### 3. Click anywhere outside the image to close

---

## Rate Limiting

Protects the website from spam and abuse.

### Configuration:
- **Global Limits**: 200 requests/day, 50 requests/hour per IP
- **Contact Form**: 5 submissions/hour per IP

### Implementation:
Rate limiting is handled by Flask-Limiter in `/app.py`.

### Customization:
Edit limits in `/app.py`:
```python
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)
```

For contact form:
```python
@app.route('/api/contact', methods=['POST'])
@limiter.limit("5 per hour")  # Adjust this value
def contact():
    ...
```

---

## Advanced SEO Schema

Rich snippets and structured data for better search engine visibility.

### Implemented Schema Types:

#### 1. Organization Schema (`/templates/base.html`)
- Company information
- Contact details
- Social media links
- Location

#### 2. Product Schema (All product pages)
- **Coffee Page**: Coffee products with ratings
- **Machinery Page**: Equipment and services
- **Materials Page**: Food ingredients

### Benefits:
- Rich search results with ratings and details
- Better visibility in Google Search
- Enhanced social media sharing
- Improved local SEO

### Validation:
Test your schema markup:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

---

## Testing the Features

### 1. PWA Installation:
- Visit site on mobile device
- Check for "Install App" banner
- Add to home screen

### 2. Dark Mode:
- Click theme toggle (bottom-left)
- Verify smooth color transitions
- Refresh page - theme should persist

### 3. Lazy Loading:
- Open DevTools Network tab
- Scroll down the page
- Images should load as you scroll

### 4. Email Notifications:
- Configure `.env` file
- Submit contact form
- Check admin email inbox
- Check customer email inbox

### 5. Image Gallery:
- Add gallery grid to any page
- Click on images
- Test keyboard navigation

### 6. Rate Limiting:
- Submit contact form 6 times quickly
- 6th submission should be blocked

---

## Performance Optimizations

### Implemented:
- Service Worker caching
- Image lazy loading
- Critical resource preloading
- Minified CSS/JS (in production)
- Efficient scroll listeners with throttling

### Recommendations:
1. Enable Gzip compression on server
2. Use CDN for static assets
3. Implement HTTP/2
4. Add security headers
5. Enable HTTPS

---

## Browser Compatibility

All features have fallbacks for older browsers:

- **Service Workers**: Falls back to regular loading
- **Intersection Observer**: Loads all images immediately
- **Dark Mode**: Works on all browsers
- **Lightbox**: Works on all modern browsers

### Tested On:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Configuration Files

### `.env` - Environment Variables
Contains sensitive configuration (not in git)

### `.env.example` - Example Configuration
Template for setting up environment variables

### `requirements.txt` - Python Dependencies
All required Python packages

### `manifest.json` - PWA Configuration
Progressive Web App settings

---

## Deployment Notes

### Production Checklist:
1. ✅ Set strong `SECRET_KEY` in `.env`
2. ✅ Configure production email credentials
3. ✅ Add real Google Analytics ID
4. ✅ Enable HTTPS
5. ✅ Set `FLASK_ENV=production`
6. ✅ Use production WSGI server (Gunicorn, uWSGI)
7. ✅ Enable firewall and security headers
8. ✅ Configure proper rate limits
9. ✅ Set up backup for emails
10. ✅ Test all features on production

### Security:
- Never commit `.env` file to git
- Use environment variables for secrets
- Keep dependencies updated
- Monitor rate limit logs
- Regularly update SSL certificates

---

## Support

For issues or questions:
- Check the main `README.md`
- Review `SEO_IMPLEMENTATION.md` for SEO features
- Contact development team

---

## License

Part of the Himma Group website project.
