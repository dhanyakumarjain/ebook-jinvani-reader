# 🚀 Quick Setup Guide - Jinvani eBook Reader

## Prerequisites
- ✅ Python installed (for local server)
- ✅ Modern web browser (Chrome, Firefox, Edge, Safari)
- ✅ PDF files in the `media/` folder

---

## 📦 Installation Steps

### Step 1: Generate App Icons
```bash
# Open the icon generator in your browser
1. Navigate to: assets/generate-icons.html
2. Icons will auto-generate
3. Click "Download 192x192" button
4. Click "Download 512x512" button
5. Save both as:
   - assets/icon-192.png
   - assets/icon-512.png
```

### Step 2: Generate Data File
```bash
# Run the data generation script
cd scripts
generate-data.bat

# This creates data.json with all your PDFs
```

### Step 3: Start Local Server
```bash
# Run the local server
cd scripts
run-local-server.bat

# Server starts on: http://localhost:8000
```

### Step 4: Open in Browser
```
1. Open Chrome/Edge
2. Go to: http://localhost:8000
3. ✅ App loads with beautiful welcome screen!
```

---

## 🌐 Deploy to GitHub Pages

### Step 1: Push to GitHub
```bash
# Use the provided script
cd scripts
git-push.bat

# Or manually:
git add .
git commit -m "Enhanced with PWA features"
git push origin main
```

### Step 2: Enable GitHub Pages
```
1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll to "Pages" section
4. Source: Select "main" branch
5. Click "Save"
6. Wait 2-3 minutes
7. ✅ Site live at: https://[username].github.io/[repo-name]
```

### Step 3: Test PWA Online
```
1. Visit your GitHub Pages URL
2. Look for install prompt
3. Click "Install"
4. ✅ App installed!
```

---

## 📱 Install as PWA

### On Desktop (Chrome/Edge):
```
1. Open the app
2. Look for install icon in address bar (⊕)
3. Click it
4. Click "Install"
5. ✅ App opens in standalone window
6. ✅ Icon added to Start Menu/Applications
```

### On Android:
```
1. Open in Chrome
2. Tap menu (⋮)
3. Tap "Install app" or "Add to Home screen"
4. Tap "Install"
5. ✅ Icon added to home screen
6. ✅ Opens like native app
```

### On iOS (Safari):
```
1. Open in Safari
2. Tap share button (□↑)
3. Tap "Add to Home Screen"
4. Tap "Add"
5. ✅ Icon added to home screen
6. ⚠️ Limited PWA features on iOS
```

---

## 🧪 Testing Checklist

### ✅ Basic Functionality
- [ ] Welcome screen loads
- [ ] Can browse folders
- [ ] Can open PDFs
- [ ] Can navigate pages
- [ ] Zoom in/out works
- [ ] Bookmarks work
- [ ] Search works

### ✅ PWA Features
- [ ] Install prompt appears
- [ ] Can install to device
- [ ] Works offline (after caching)
- [ ] App icon shows correctly
- [ ] Standalone mode works

### ✅ Search Functionality
- [ ] Search panel opens
- [ ] Can search text
- [ ] Results show correctly
- [ ] Can navigate to results
- [ ] Case sensitive works
- [ ] Whole word works

### ✅ Mobile Experience
- [ ] Responsive on mobile
- [ ] Touch gestures work
- [ ] Controls accessible
- [ ] Swipe navigation works
- [ ] Zoom works on mobile

### ✅ Performance
- [ ] Loads quickly (< 2s)
- [ ] Smooth animations
- [ ] No lag when scrolling
- [ ] PDFs render fast

---

## 🐛 Troubleshooting

### Issue: Icons not showing
**Solution:**
```bash
1. Generate icons using assets/generate-icons.html
2. Save as icon-192.png and icon-512.png
3. Place in assets/ folder
4. Clear browser cache
5. Reload page
```

### Issue: Install prompt doesn't appear
**Solution:**
```bash
1. Must be served over HTTPS (or localhost)
2. manifest.json must be valid
3. Service worker must register successfully
4. Icons must exist
5. Check browser console for errors
```

### Issue: Service worker not registering
**Solution:**
```bash
1. Check browser console for errors
2. Ensure service-worker.js is in root folder
3. Clear browser cache
4. Hard reload (Ctrl+Shift+R)
5. Check if HTTPS is required
```

### Issue: Search not working
**Solution:**
```bash
1. Open browser console
2. Check for JavaScript errors
3. Ensure pdf-search.js is loaded
4. Try searching simple text like "a"
5. Check if PDF has searchable text (not scanned image)
```

### Issue: PDFs not loading
**Solution:**
```bash
1. Run generate-data.bat
2. Check data.json exists
3. Verify PDF paths are correct
4. Check browser console for errors
5. Try opening PDF directly in browser
```

### Issue: Offline mode not working
**Solution:**
```bash
1. Open a PDF first (to cache it)
2. Check service worker is registered
3. Go to DevTools > Application > Service Workers
4. Verify cache storage has files
5. Try in incognito mode
```

---

## 🔧 Configuration

### Customize Colors
Edit `enhanced-styles.css`:
```css
:root {
    --accent-primary: #667eea;  /* Change this */
    --accent-secondary: #764ba2; /* Change this */
}
```

### Customize Welcome Screen
Edit `index.html` - Welcome Screen section:
```html
<h2 class="welcome-title">
    <span class="gradient-text">Your Title Here</span>
    <span class="subtitle">Your Subtitle Here</span>
</h2>
```

### Customize App Name
Edit `manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "Short Name",
  "description": "Your description"
}
```

### Customize Cache Strategy
Edit `service-worker.js`:
```javascript
const CACHE_NAME = 'your-app-v1';
const ASSETS_TO_CACHE = [
    // Add your files here
];
```

---

## 📊 Performance Tips

### Optimize PDFs:
```bash
1. Compress PDFs before adding
2. Use tools like Adobe Acrobat
3. Reduce image quality if needed
4. Remove unnecessary pages
5. Aim for < 10MB per PDF
```

### Optimize Images:
```bash
1. Compress images (TinyPNG, etc.)
2. Use WebP format if possible
3. Lazy load images
4. Use appropriate sizes
```

### Optimize Loading:
```bash
1. Enable service worker caching
2. Use CDN for libraries
3. Minify CSS/JS files
4. Enable gzip compression
5. Use HTTP/2 if available
```

---

## 📈 Analytics (Optional)

### Add Google Analytics:
```html
<!-- Add before </head> in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-ID');
</script>
```

---

## 🔒 Security

### HTTPS Requirement:
- PWA features require HTTPS
- GitHub Pages provides HTTPS automatically
- For custom domain, use Cloudflare or Let's Encrypt

### Content Security Policy:
```html
<!-- Add to <head> for extra security -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;">
```

---

## 📚 Resources

### Documentation:
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)

### Tools:
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - PWA audit
- [PWA Builder](https://www.pwabuilder.com/) - PWA testing
- [Workbox](https://developers.google.com/web/tools/workbox) - Service worker library

---

## ✅ Launch Checklist

Before going live:
- [ ] All PDFs added to media folder
- [ ] data.json generated
- [ ] Icons created (192x192, 512x512)
- [ ] manifest.json configured
- [ ] Service worker tested
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] Tested offline mode
- [ ] Search functionality tested
- [ ] Performance optimized
- [ ] GitHub Pages enabled
- [ ] Custom domain configured (optional)
- [ ] Analytics added (optional)
- [ ] README updated
- [ ] Documentation complete

---

## 🎉 You're Ready!

Your Jinvani eBook Reader is now:
- ✅ A full Progressive Web App
- ✅ Installable on any device
- ✅ Works offline
- ✅ Has beautiful UI
- ✅ Includes search functionality
- ✅ Optimized for performance
- ✅ Mobile-friendly

**Enjoy your enhanced reading experience!** 📚✨

---

**Need Help?**
- Check ENHANCEMENTS.md for feature details
- Check MOBILE_FIXES.md for mobile issues
- Check ZOOM_FIX.md for zoom issues
- Open browser console for errors

**Last Updated:** 2026-05-23
