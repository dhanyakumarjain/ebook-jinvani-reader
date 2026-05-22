# 📚 Jinvani eBook Reader - Complete PDF Library System

A modern, elegant, and fully-featured PDF library website built with pure HTML, CSS, and Vanilla JavaScript. No frameworks, no dependencies, just clean code.

## ✨ Features

### 🎨 Modern UI/UX
- **Glassmorphism Design** - Beautiful frosted glass effects
- **Dark/Light Theme** - Toggle between themes with persistence
- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile
- **Smooth Animations** - Polished transitions and hover effects
- **Professional Typography** - Clean, readable fonts

### 📁 Folder Management
- **Nested Folder Support** - Unlimited folder depth
- **Expand/Collapse** - Interactive folder tree navigation
- **Breadcrumb Navigation** - Always know where you are
- **Folder Statistics** - See PDF count in each folder

### 🔍 Search & Discovery
- **Real-time Search** - Instant filtering as you type
- **Recursive Search** - Searches through all folders
- **Highlight Results** - Easy to spot matches
- **Clear Search** - Quick reset button

### 📄 PDF Operations
- **In-Browser Viewing** - View PDFs without leaving the site
- **Download Support** - Download any PDF with one click
- **PDF Cards** - Beautiful card-based layout
- **Modal Viewer** - Full-screen PDF viewing experience

### 🛠️ Automation Tools
- **Auto Data Generation** - Scans media folder automatically
- **Local Server** - One-click local testing
- **Git Integration** - Easy push to GitHub
- **Reset Utility** - Clean slate when needed

## 🚀 Quick Start

### Prerequisites
- **Python 3.x** (for local server)
- **Git** (for version control)
- **Modern Browser** (Chrome, Firefox, Edge, Safari)

### Installation

1. **Clone or Download** this repository

2. **Add Your PDFs**
   ```
   Copy your PDF files into the media/ folder
   You can organize them in subfolders
   ```

3. **Generate Data**
   ```batch
   cd scripts
   generate-data.bat
   ```

4. **Start Local Server**
   ```batch
   run-local-server.bat
   ```

5. **Open Browser**
   ```
   http://localhost:8000
   ```

## 📂 Project Structure

```
jinvani-ebook-reader/
│
├── index.html              # Main HTML structure
├── style.css               # All styling and themes
├── script.js               # Application logic
├── data.json               # Auto-generated folder structure
│
├── media/                  # Your PDF files go here
│   ├── Folder A/
│   │   ├── file1.pdf
│   │   └── file2.pdf
│   ├── Folder B/
│   │   └── Nested Folder/
│   │       └── sample.pdf
│   └── root-file.pdf
│
├── scripts/                # Automation utilities
│   ├── generate-data.bat   # Scan media and create data.json
│   ├── run-local-server.bat # Start local development server
│   ├── git-push.bat        # Push changes to Git
│   └── reset-library.bat   # Reset library to empty state
│
└── README.md               # This file
```

## 🎯 Usage Guide

### Adding PDFs

**Method 1: Root Level**
```
media/
├── book1.pdf
├── book2.pdf
└── book3.pdf
```

**Method 2: Organized in Folders**
```
media/
├── Technical Books/
│   ├── javascript.pdf
│   └── python.pdf
├── Novels/
│   └── fiction.pdf
└── reference.pdf
```

**Method 3: Nested Folders**
```
media/
├── Programming/
│   ├── JavaScript/
│   │   ├── basics.pdf
│   │   └── advanced.pdf
│   └── Python/
│       └── tutorial.pdf
└── Literature/
    └── classics.pdf
```

### Workflow

#### Daily Workflow
1. Add new PDFs to `media/` folder
2. Run `scripts/generate-data.bat`
3. Run `scripts/run-local-server.bat` to test
4. Run `scripts/git-push.bat` to publish

#### Testing Locally
```batch
cd scripts
run-local-server.bat
```
Opens `http://localhost:8000` automatically

#### Publishing to GitHub Pages
```batch
cd scripts
git-push.bat
```
Enter commit message and push

#### Resetting Library
```batch
cd scripts
reset-library.bat
```
Confirms before deleting all PDFs

## 🔧 Batch Files Explained

### 1. generate-data.bat
**Purpose:** Scans `media/` folder and generates `data.json`

**What it does:**
- Recursively scans all folders
- Finds all PDF files
- Builds nested JSON structure
- Saves to `data.json`
- Ignores hidden files and system files

**When to use:**
- After adding new PDFs
- After reorganizing folders
- After deleting PDFs

### 2. run-local-server.bat
**Purpose:** Starts local Python HTTP server

**What it does:**
- Checks if Python is installed
- Starts server on port 8000
- Opens browser automatically
- Shows server URL

**When to use:**
- Testing before publishing
- Local development
- Previewing changes

### 3. git-push.bat
**Purpose:** Commits and pushes changes to Git

**What it does:**
- Checks Git status
- Adds all files
- Asks for commit message
- Commits changes
- Pushes to remote

**When to use:**
- Publishing to GitHub Pages
- Backing up changes
- Sharing with team

### 4. reset-library.bat
**Purpose:** Resets library to empty state

**What it does:**
- Asks for confirmation
- Deletes all PDFs
- Resets `data.json`
- Preserves folder structure

**When to use:**
- Starting fresh
- Removing all content
- Testing empty state

## 🎨 Customization

### Changing Colors

Edit `style.css` variables:

```css
:root {
    --accent-primary: #667eea;    /* Primary color */
    --accent-secondary: #764ba2;  /* Secondary color */
    --bg-primary: #f5f7fa;        /* Background */
    --text-primary: #1a202c;      /* Text color */
}
```

### Changing Fonts

Edit the Google Fonts import in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;600&display=swap" rel="stylesheet">
```

Then update in `style.css`:

```css
body {
    font-family: 'YourFont', sans-serif;
}
```

### Adding Features

The code is modular and well-commented. Key sections:

- **Data Loading:** `loadLibraryData()` in `script.js`
- **Folder Rendering:** `renderFolderTree()` in `script.js`
- **Search:** `handleSearch()` in `script.js`
- **Theme Toggle:** `toggleTheme()` in `script.js`

## 📱 Responsive Design

### Desktop (1024px+)
- Full sidebar visible
- Grid layout for PDFs
- All features accessible

### Tablet (768px - 1024px)
- Collapsible sidebar
- Adjusted grid columns
- Touch-friendly buttons

### Mobile (<768px)
- Hidden sidebar (toggle button)
- Single column layout
- Optimized for touch
- Simplified navigation

## 🔒 Security Notes

- All PDFs are served from your domain
- No external dependencies (except fonts/icons)
- No backend required
- No database
- No user data collection
- Static files only

## 🌐 GitHub Pages Deployment

### Initial Setup

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Source: Deploy from branch
   - Branch: main / (root)
   - Save

3. **Wait 2-3 Minutes**
   Your site will be live at:
   ```
   https://USERNAME.github.io/REPO_NAME/
   ```

### Updating Content

```batch
cd scripts
generate-data.bat
git-push.bat
```

Wait 2-3 minutes for GitHub Pages to rebuild.

## 🐛 Troubleshooting

### PDFs Not Showing

**Problem:** Empty library or no PDFs visible

**Solutions:**
1. Check if PDFs are in `media/` folder
2. Run `generate-data.bat` again
3. Check `data.json` was created
4. Refresh browser (Ctrl+F5)
5. Check browser console for errors

### data.json Not Generated

**Problem:** `generate-data.bat` fails

**Solutions:**
1. Check if PowerShell is available
2. Run as Administrator
3. Check media folder exists
4. Verify folder permissions

### Local Server Won't Start

**Problem:** `run-local-server.bat` fails

**Solutions:**
1. Install Python from python.org
2. Add Python to PATH
3. Try different port: `python -m http.server 8080`
4. Check if port 8000 is already in use

### Git Push Fails

**Problem:** `git-push.bat` shows errors

**Solutions:**
1. Check if Git is installed
2. Verify remote repository is set: `git remote -v`
3. Check authentication (GitHub token/SSH)
4. Try manual push: `git push -u origin main`

### Large PDF Files

**Problem:** GitHub warns about large files

**Solutions:**
1. GitHub has 100MB file limit
2. Use Git LFS for files >50MB
3. Compress PDFs before uploading
4. Consider external hosting for very large files

## 💡 Tips & Best Practices

### Organization
- Use descriptive folder names
- Keep folder structure simple (2-3 levels max)
- Group related PDFs together
- Use clear, readable file names

### Performance
- Limit to ~100-200 PDFs for best performance
- Compress large PDFs
- Use folders to organize large collections
- Test locally before publishing

### Maintenance
- Run `generate-data.bat` after any changes
- Test locally before pushing
- Keep backups of important PDFs
- Document your folder structure

### Git Workflow
- Commit frequently
- Use descriptive commit messages
- Test before pushing
- Keep repository clean

## 📊 Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling, animations, flexbox, grid
- **Vanilla JavaScript** - ES6+, async/await, fetch API
- **PDF.js** - Mozilla's PDF rendering library
- **Font Awesome** - Icon library
- **Google Fonts** - Typography

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### File Size
- HTML: ~5KB
- CSS: ~15KB
- JavaScript: ~10KB
- Total: ~30KB (excluding PDFs)

### Performance
- First Load: <1s (without PDFs)
- Search: Real-time (<100ms)
- Folder Toggle: Instant
- Theme Switch: Instant

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

Free to use and modify for personal and commercial projects.

## 🙏 Credits

- **PDF.js** - Mozilla Foundation
- **Font Awesome** - Icon library
- **Google Fonts** - Inter font family
- **Design** - Custom glassmorphism theme

## 📞 Support

For issues or questions:
1. Check this README
2. Review troubleshooting section
3. Check browser console for errors
4. Verify all batch files ran successfully

## 🎉 Enjoy!

Your Jinvani eBook Reader is ready to use. Add your PDFs, generate data, and start reading!

---

**Made with ❤️ for book lovers**

**Last Updated:** May 22, 2026
