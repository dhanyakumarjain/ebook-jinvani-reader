# 📦 Jinvani eBook Reader - Project Transfer Guide

## 🎯 Complete Guide to Move This Project to Another Computer

---

## 📋 REQUIRED FILES AND FOLDERS

### ✅ Essential Files (MUST COPY)

Copy the **entire project folder** with these files:

#### 1. **HTML Files**
- `index.html` - Main application page

#### 2. **CSS Files**
- `style.css` - Main styles
- `landing-page.css` - Home page styles
- `enhanced-styles.css` - Additional styles
- `decorative-enhancements.css` - Decorative elements

#### 3. **JavaScript Files**
- `script.js` - Main application logic
- `pdf-viewer.js` - PDF viewer functionality
- `pdf-search.js` - PDF search functionality
- `landing-page.js` - Landing page logic
- `service-worker.js` - PWA offline support

#### 4. **Data Files**
- `data.json` - Library index (generated file)
- `manifest.json` - PWA manifest

#### 5. **Image Files**
- `MUNISUVRATHDBLK.png` - Main hero image on home page
- `MunisuvratHD.jpg` - Alternative image (if used)

#### 6. **Media Folder**
- `media/` - **ENTIRE FOLDER** containing all PDF files
  - All your PDF books (47 PDF files)

#### 7. **Scripts Folder**
- `scripts/generate-data.bat` - Windows batch script to generate data.json
- `scripts/generate-data.ps1` - PowerShell script to generate data.json
- `scripts/git-push.bat` - Git push helper
- `scripts/reset-library.bat` - Reset library helper
- `scripts/run-local-server.bat` - Local server helper

#### 8. **Assets Folder** (Optional but recommended)
- `assets/` folder with icons if you have them
- `assets/generate-icons.html` - Icon generator
- `assets/jain-statue.jpg` - Asset image

#### 9. **Documentation Files** (Optional)
- `README.md`
- `BOOKMARK_GUIDE.md`
- `HOW_TO_BOOKMARK.md`
- `HOW_TO_MANAGE_PDFS.md`
- `QUICK_GUIDE.md`
- All other `.md` documentation files

#### 10. **GitHub Workflow** (if using GitHub Pages)
- `.github/workflows/static.yml` - GitHub Pages deployment

---

## 💻 REQUIRED SOFTWARE

### 1. **Web Browser** (Choose One)
- ✅ **Google Chrome** (Recommended) - Latest version
- ✅ **Microsoft Edge** - Latest version
- ✅ **Firefox** - Latest version
- ✅ **Safari** (Mac only) - Latest version

**Download:**
- Chrome: https://www.google.com/chrome/
- Edge: https://www.microsoft.com/edge
- Firefox: https://www.mozilla.org/firefox/

---

### 2. **Local Web Server** (Choose One Method)

#### **Option A: Python (Easiest - Recommended)**

**For Windows:**
1. Download Python from: https://www.python.org/downloads/
2. During installation, **CHECK** "Add Python to PATH"
3. Install Python 3.8 or higher

**To Run Server:**
```cmd
cd path\to\ebook-jinvani-reader
python -m http.server 8000
```

Then open browser: `http://localhost:8000`

---

#### **Option B: Node.js with http-server**

**Install Node.js:**
1. Download from: https://nodejs.org/
2. Install LTS version (Long Term Support)

**Install http-server:**
```cmd
npm install -g http-server
```

**To Run Server:**
```cmd
cd path\to\ebook-jinvani-reader
http-server -p 8000
```

Then open browser: `http://localhost:8000`

---

#### **Option C: Live Server (VS Code Extension)**

**Install Visual Studio Code:**
1. Download from: https://code.visualstudio.com/
2. Install VS Code

**Install Live Server Extension:**
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search "Live Server"
4. Install "Live Server" by Ritwick Dey

**To Run:**
1. Open project folder in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

---

#### **Option D: XAMPP (Full Web Server)**

**Install XAMPP:**
1. Download from: https://www.apachefriends.org/
2. Install XAMPP
3. Copy project folder to `C:\xampp\htdocs\ebook-jinvani-reader`
4. Start Apache from XAMPP Control Panel
5. Open browser: `http://localhost/ebook-jinvani-reader`

---

### 3. **Text Editor** (Optional - for editing)

Choose one:
- **Visual Studio Code** (Recommended): https://code.visualstudio.com/
- **Notepad++**: https://notepad-plus-plus.org/
- **Sublime Text**: https://www.sublimetext.com/

---

### 4. **PowerShell or Command Prompt** (Already in Windows)

For running batch scripts to generate `data.json`

---

## 📦 STEP-BY-STEP TRANSFER PROCESS

### Step 1: Copy Files
1. Copy the **entire project folder** to USB drive or cloud storage
2. Transfer to new computer
3. Extract to desired location (e.g., `C:\Projects\ebook-jinvani-reader`)

### Step 2: Install Software
1. Install Python (or Node.js, or VS Code with Live Server)
2. Install a modern web browser (Chrome/Edge/Firefox)

### Step 3: Generate Library Index
```cmd
cd C:\Projects\ebook-jinvani-reader
cd scripts
generate-data.bat
```

This creates `data.json` file with all PDF information.

### Step 4: Start Local Server

**Using Python:**
```cmd
cd C:\Projects\ebook-jinvani-reader
python -m http.server 8000
```

**Using Node.js:**
```cmd
cd C:\Projects\ebook-jinvani-reader
http-server -p 8000
```

**Using VS Code Live Server:**
- Open folder in VS Code
- Right-click `index.html` → "Open with Live Server"

### Step 5: Open in Browser
Open your browser and go to:
```
http://localhost:8000
```

---

## 🌐 ALTERNATIVE: DEPLOY TO GITHUB PAGES (NO LOCAL SERVER NEEDED)

### Requirements:
- Git installed: https://git-scm.com/downloads
- GitHub account: https://github.com/

### Steps:

1. **Create GitHub Repository**
   - Go to GitHub.com
   - Click "New Repository"
   - Name it: `ebook-jinvani-reader`
   - Make it Public
   - Don't initialize with README

2. **Upload Project**
   ```cmd
   cd C:\Projects\ebook-jinvani-reader
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/ebook-jinvani-reader.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: Deploy from branch
   - Branch: `main` → `/root` → Save

4. **Access Your Site**
   - Wait 2-3 minutes
   - Visit: `https://YOUR-USERNAME.github.io/ebook-jinvani-reader/`
   - No local server needed!

---

## 📁 MINIMUM FILES NEEDED (Bare Minimum)

If you want the smallest transfer:

```
ebook-jinvani-reader/
├── index.html                    ✅ REQUIRED
├── script.js                     ✅ REQUIRED
├── pdf-viewer.js                 ✅ REQUIRED
├── pdf-search.js                 ✅ REQUIRED
├── landing-page.js               ✅ REQUIRED
├── style.css                     ✅ REQUIRED
├── landing-page.css              ✅ REQUIRED
├── enhanced-styles.css           ✅ REQUIRED
├── decorative-enhancements.css   ✅ REQUIRED
├── service-worker.js             ✅ REQUIRED
├── manifest.json                 ✅ REQUIRED
├── data.json                     ✅ REQUIRED (or regenerate)
├── MUNISUVRATHDBLK.png          ✅ REQUIRED
├── media/                        ✅ REQUIRED (all PDFs)
│   └── *.pdf                     ✅ REQUIRED (all PDF files)
└── scripts/
    └── generate-data.bat         ✅ REQUIRED (to regenerate data.json)
```

**Total Size:** Approximately 50-100 MB (depending on PDF sizes)

---

## ⚠️ IMPORTANT NOTES

### 1. **Browser Security**
- You **CANNOT** open `index.html` directly by double-clicking
- You **MUST** use a local web server (Python, Node.js, etc.)
- Reason: Browsers block PDF loading from `file://` protocol for security

### 2. **Data.json File**
- If `data.json` is missing, run `scripts\generate-data.bat`
- This scans the `media/` folder and creates the library index
- Must be regenerated if you add/remove PDFs

### 3. **PDF Files**
- Keep all PDFs in the `media/` folder
- Don't rename the `media/` folder
- Maintain the same folder structure

### 4. **Bookmarks**
- Bookmarks are stored in browser's localStorage
- They won't transfer automatically to new computer
- Each browser/computer has separate bookmarks

### 5. **Internet Connection**
- Required for first load (downloads PDF.js library from CDN)
- After first load, works offline (PWA feature)
- CDN links in `index.html`:
  - PDF.js: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/`
  - Font Awesome: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/`
  - Google Fonts: `https://fonts.googleapis.com/css2?family=Inter`

---

## 🔧 TROUBLESHOOTING

### Problem: "Cannot load PDFs"
**Solution:** Make sure you're using a local web server, not opening file directly

### Problem: "Library is empty"
**Solution:** Run `scripts\generate-data.bat` to create `data.json`

### Problem: "Python not found"
**Solution:** Reinstall Python and check "Add Python to PATH" during installation

### Problem: "Port 8000 already in use"
**Solution:** Use different port: `python -m http.server 8080`

### Problem: "PDFs not showing"
**Solution:** Check that `media/` folder exists and contains PDF files

---

## 📞 QUICK START SUMMARY

1. ✅ Copy entire project folder
2. ✅ Install Python (https://www.python.org/downloads/)
3. ✅ Open Command Prompt
4. ✅ Navigate to project folder: `cd path\to\ebook-jinvani-reader`
5. ✅ Run: `python -m http.server 8000`
6. ✅ Open browser: `http://localhost:8000`
7. ✅ Done! 🎉

---

## 📱 MOBILE ACCESS

To access from phone/tablet on same network:

1. Find your computer's IP address:
   ```cmd
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Start server on computer:
   ```cmd
   python -m http.server 8000
   ```

3. On phone/tablet browser, visit:
   ```
   http://192.168.1.100:8000
   ```
   (Replace with your actual IP address)

---

## 🎓 SUMMARY

**What You Need:**
1. All project files (especially `media/` folder with PDFs)
2. Python or Node.js (for local server)
3. Modern web browser
4. Internet connection (first time only)

**What You Do:**
1. Copy files to new computer
2. Install Python
3. Run `python -m http.server 8000`
4. Open `http://localhost:8000` in browser

**That's it!** 🚀

---

*Created: 2026-05-25*
*Project: Jinvani eBook Reader*
*Version: 1.0*
