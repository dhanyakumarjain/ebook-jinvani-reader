# 📚 Jinvani eBook Reader

A modern, web-based PDF reader application with automatic media folder loading. Beautiful design that works on desktop, tablets, and mobile devices.

## 🌟 Features

✨ **Key Features:**
- 📁 **Auto-load PDFs** from media folder (no manual upload needed!)
- 📖 Clean, intuitive reading interface
- 🔍 Zoom in/out controls
- ↔️ Fit to width option
- ⬅️➡️ Page navigation (buttons and keyboard shortcuts)
- 🎨 Beautiful gradient UI with glassmorphism effects
- 📱 Fully responsive design (desktop, tablet, mobile)
- 🚀 Easy batch file operations for Git

## 🚀 Quick Start

### Method 1: Using Batch Files (Easiest!)

1. **Add PDFs to your library:**
   - Double-click `add-pdf.bat`
   - Copy your PDF files to the opened `media` folder
   - Press any key to auto-update config
   
2. **Test locally:**
   - Double-click `open-local.bat`
   
3. **Push to GitHub:**
   - Double-click `push.bat`
   - Enter a commit message (or press Enter for default)
   
4. **View online:**
   - Double-click `open-github.bat`

### Method 2: Manual Setup

1. **Add PDFs:**
   ```
   - Copy PDF files to the 'media' folder
   - Edit config.js and add filenames to pdfFiles array
   ```

2. **Test locally:**
   ```
   - Open index.html in your browser
   ```

3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add new PDFs"
   git push
   ```

## 📂 Project Structure

```
ebook-jinvani-reader/
├── media/              # Place your PDF files here
│   ├── book1.pdf
│   ├── book2.pdf
│   └── ...
├── index.html          # Main application
├── style.css           # Styling
├── app.js              # Application logic
├── config.js           # PDF configuration (auto-generated)
├── README.md           # This file
│
├── Batch Files (Windows):
├── add-pdf.bat         # Add PDFs and update config
├── push.bat            # Commit and push to GitHub
├── pull.bat            # Pull latest changes
├── status.bat          # Check Git status
├── open-local.bat      # Open in browser locally
└── open-github.bat     # Open GitHub repo and live site
```

## 🎮 Batch File Guide

| Batch File | Purpose |
|------------|---------|
| `add-pdf.bat` | Opens media folder, scans for PDFs, updates config.js |
| `push.bat` | Adds, commits, and pushes changes to GitHub |
| `pull.bat` | Pulls latest changes from GitHub |
| `status.bat` | Shows current Git status |
| `open-local.bat` | Opens the reader in your browser locally |
| `open-github.bat` | Opens GitHub repo and live site |

## 📖 How to Use the Reader

### Adding Books

**Option 1: Using add-pdf.bat (Recommended)**
1. Double-click `add-pdf.bat`
2. Copy PDFs to the opened folder
3. Press any key to auto-update
4. Run `push.bat` to publish

**Option 2: Manual**
1. Copy PDFs to `media/` folder
2. Edit `config.js`:
   ```javascript
   pdfFiles: [
       'book1.pdf',
       'book2.pdf',
   ],
   ```
3. Save and push changes

### Reading Books

1. Open the application (locally or online)
2. Click any book title in the sidebar
3. Use controls:
   - **Previous/Next**: Navigate pages
   - **Page input**: Jump to specific page
   - **Zoom +/-**: Adjust zoom level
   - **Fit Width**: Auto-fit to screen
   - **Close**: Return to library

### Keyboard Shortcuts

- `Arrow Left`: Previous page
- `Arrow Right`: Next page
- `+` or `=`: Zoom in
- `-`: Zoom out

## 🌐 Live Demo

**Live Site:** https://dhanyakumarjain.github.io/ebook-jinvani-reader/

**Repository:** https://github.com/dhanyakumarjain/ebook-jinvani-reader

## 💻 Technical Details

**Technologies:**
- HTML5
- CSS3 (Glassmorphism, Gradients, Animations)
- JavaScript (ES6+)
- PDF.js library (Mozilla)

**Browser Support:**
- Chrome, Firefox, Edge, Safari
- Desktop, Tablet, Mobile
- Works offline after first load

## 🔧 Configuration

Edit `config.js` to customize:

```javascript
const CONFIG = {
    mediaFolder: 'media/',
    pdfFiles: [
        'your-book.pdf',
    ],
    settings: {
        defaultZoom: 1.5,
        enableKeyboardShortcuts: true,
        showWelcomeScreen: true,
    }
};
```

## 📱 Responsive Design

- **Desktop (1024px+)**: Full sidebar + viewer
- **Tablet (768px-1024px)**: Optimized layout
- **Mobile (<768px)**: Stacked layout, touch-friendly
- **Small phones (<480px)**: Compact design

## 🎨 Design Features

- Animated gradient backgrounds
- Glassmorphism (frosted glass) effects
- Smooth transitions and animations
- 3D shadows and depth
- Gradient text effects
- Floating animations
- Touch-friendly buttons

## 🤝 Contributing

1. Fork the repository
2. Add your PDFs to media folder
3. Update config.js
4. Push changes
5. Create pull request

## 📝 Workflow

### Daily Workflow:
1. Add new PDFs → `add-pdf.bat`
2. Test locally → `open-local.bat`
3. Push to GitHub → `push.bat`
4. View online → `open-github.bat`

### Updating from GitHub:
1. Run `pull.bat` to get latest changes

### Checking Status:
1. Run `status.bat` to see what changed

## 🐛 Troubleshooting

**PDFs not showing?**
- Check if PDFs are in `media/` folder
- Verify filenames in `config.js` match exactly
- Run `add-pdf.bat` to auto-scan

**Can't push to GitHub?**
- Check internet connection
- Verify Git credentials
- Run `status.bat` to check status

**Site not updating?**
- Wait 2-3 minutes for GitHub Pages to rebuild
- Clear browser cache (Ctrl+F5)
- Check GitHub Actions tab for build status

## 📄 License

Free to use and modify for personal and commercial projects.

## 🙏 Credits

- PDF.js by Mozilla
- Icons: Unicode Emoji
- Design: Custom gradient theme

---

**Made with ❤️ for book lovers**

**Enjoy reading with Jinvani eBook Reader! 📚✨**
