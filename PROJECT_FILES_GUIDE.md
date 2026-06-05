# Jinvani eBook Reader - Project Files Guide

## Required Files to Move to Another Computer

### Core Application Files (Required)
```
ebook-jinvani-reader/
├── index.html                    # Main HTML file
├── script.js                     # Main JavaScript logic
├── pdf-viewer.js                 # PDF viewer functionality
├── pdf-search.js                 # PDF search functionality
├── landing-page.js               # Landing page scripts
├── style.css                     # Main stylesheet
├── enhanced-styles.css           # Enhanced UI styles
├── landing-page.css              # Landing page styles
├── decorative-enhancements.css   # Decorative UI elements
├── data.json                     # Library data (auto-generated)
├── manifest.json                 # PWA manifest
├── service-worker.js             # PWA service worker (if exists)
└── generate-data.bat             # Script to generate data.json
```

### Media Files (Required)
```
ebook-jinvani-reader/
├── MUNISUVRATHDBLK.png          # Main hero image on home page
└── media/                        # All your PDF files
    ├── *.pdf                     # All PDF books
    └── web */                    # Subfolders with PDFs
```

### Assets Folder (Optional but Recommended)
```
ebook-jinvani-reader/
└── assets/
    ├── icon-192.png              # PWA icon (192x192)
    ├── icon-512.png              # PWA icon (512x512)
    ├── jain-statue.jpg           # Background image (if used)
    └── generate-icons.html       # Icon generator utility
```

### Documentation Files (Optional)
```
ebook-jinvani-reader/
├── README.md                     # Project documentation
├── BOOKMARK_GUIDE.md             # Bookmark feature guide
├── HOW_TO_BOOKMARK.md            # Bookmark usage instructions
├── HOW_TO_MANAGE_PDFS.md         # PDF management guide
├── DELETE_WORKFLOW.md            # Delete workflow documentation
├── INCREMENTAL_UPLOAD_EXPLAINED.md
├── LAST_UPDATED_FEATURE.md
├── BOTTOM_NAV_UPDATE.md
├── ALL_FIXES_SUMMARY.md
└── PROJECT_FILES_GUIDE.md        # This file
```

### GitHub Workflow (Optional)
```
ebook-jinvani-reader/
└── .github/
    └── workflows/
        └── static.yml            # GitHub Pages deployment
```

---

## Software Requirements

### 1. Web Browser (Required)
- **Google Chrome** (recommended) - version 90+
- **Mozilla Firefox** - version 88+
- **Microsoft Edge** - version 90+
- **Safari** - version 14+ (for Mac)

### 2. Web Server (Required for Local Testing)
Choose ONE of the following:

#### Option A: Python HTTP Server (Easiest)
- **Python 3.x** - [Download here](https://www.python.org/downloads/)
- After installing Python, open terminal/command prompt in project folder:
  ```bash
  # Python 3
  python -m http.server 8000
  
  # Or Python 2 (if you have it)
  python -m SimpleHTTPServer 8000
  ```
- Then open: `http://localhost:8000`

#### Option B: Node.js HTTP Server
- **Node.js** - [Download here](https://nodejs.org/)
- Install http-server globally:
  ```bash
  npm install -g http-server
  ```
- Run in project folder:
  ```bash
  http-server -p 8000
  ```
- Then open: `http://localhost:8000`

#### Option C: VS Code Live Server
- **Visual Studio Code** - [Download here](https://code.visualstudio.com/)
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

#### Option D: XAMPP/WAMP/MAMP
- **XAMPP** - [Download here](https://www.apachefriends.org/)
- Place project folder in `htdocs` folder
- Access via: `http://localhost/ebook-jinvani-reader/`

### 3. Text Editor (Optional, for editing)
- **Visual Studio Code** (recommended)
- **Sublime Text**
- **Notepad++**
- **Atom**

### 4. Git (Optional, for version control)
- **Git** - [Download here](https://git-scm.com/)

---

## How to Set Up on New Computer

### Step 1: Copy Files
1. Copy the entire `ebook-jinvani-reader` folder to your new computer
2. Make sure all files listed above are included
3. Verify that the `media` folder contains all your PDF files

### Step 2: Install Software
1. Install Python 3.x OR Node.js OR VS Code with Live Server
2. Install a modern web browser (Chrome recommended)

### Step 3: Generate Library Data
1. Open command prompt/terminal in project folder
2. Run the data generator:
   ```bash
   generate-data.bat
   ```
   This will scan your `media` folder and create `data.json`

### Step 4: Start Local Server
Choose one method:

**Python Method:**
```bash
python -m http.server 8000
```

**Node.js Method:**
```bash
http-server -p 8000
```

**VS Code Method:**
- Open project in VS Code
- Right-click `index.html`
- Select "Open with Live Server"

### Step 5: Open in Browser
1. Open your web browser
2. Navigate to: `http://localhost:8000`
3. The application should load with your library

---

## Alternative: Deploy Online

### Option 1: GitHub Pages (Free)
1. Create GitHub account
2. Create new repository
3. Upload all files
4. Enable GitHub Pages in repository settings
5. Access via: `https://yourusername.github.io/repository-name/`

### Option 2: Netlify (Free)
1. Create Netlify account
2. Drag and drop project folder
3. Get instant public URL

### Option 3: Vercel (Free)
1. Create Vercel account
2. Deploy via Git or direct upload
3. Get instant public URL

---

## Important Notes

### File Size Warning
- If your PDF files are large (>100MB total), consider:
  - Using cloud storage for PDFs (Google Drive, Dropbox)
  - Splitting into smaller batches
  - Using GitHub LFS for large files

### Browser Compatibility
- Works best on modern browsers with JavaScript enabled
- PDF.js library requires modern browser features
- Mobile browsers (iOS Safari, Chrome Mobile) fully supported

### Local Storage
- Bookmarks are saved in browser's localStorage
- Recent books are saved locally
- Moving to another computer will NOT transfer bookmarks
- Export bookmarks before moving (feature can be added)

### Security
- Always run on local server (not by opening `index.html` directly)
- Files opened directly (file://) will have CORS issues
- Local server is required for proper PDF loading

---

## Troubleshooting

### Problem: "data.json not found"
**Solution:** Run `generate-data.bat` in project folder

### Problem: PDFs don't load
**Solution:** 
- Make sure you're using a local server
- Check that PDF files are in `media` folder
- Check browser console for errors

### Problem: Blank page or errors
**Solution:**
- Open browser console (F12)
- Check for JavaScript errors
- Verify all .js and .css files are present

### Problem: Bookmarks not working
**Solution:**
- Check browser localStorage is enabled
- Try different browser
- Clear cache and reload

---

## Minimum System Requirements

- **Operating System:** Windows 7+, macOS 10.12+, Linux (any modern distro)
- **RAM:** 2GB minimum, 4GB recommended
- **Storage:** 100MB + size of your PDF files
- **Internet:** Required for first load (CDN resources), optional after
- **Screen:** 1024x768 minimum, responsive design supports all sizes

---

## Contact & Support

For issues or questions about setting up on a new computer:
1. Check browser console for errors (F12)
2. Verify all required files are present
3. Ensure local server is running
4. Test with a simple HTML file first

---

*Last Updated: June 5, 2026*
