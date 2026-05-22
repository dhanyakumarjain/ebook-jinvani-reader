# 📁 Folder Structure Guide

## Overview

The Jinvani eBook Reader now automatically loads PDFs from the `media/` folder with full folder structure support. No manual upload needed!

## 🎯 How It Works

1. **Place PDFs** in the `media/` folder
2. **Organize** into subfolders (optional)
3. **Run** `add-pdf.bat` to scan and update config
4. **Push** to GitHub with `push.bat`
5. **View** online - folder structure appears automatically!

## 📂 Folder Structure Examples

### Example 1: Simple Structure
```
media/
├── book1.pdf
├── book2.pdf
└── book3.pdf
```

**Result in UI:**
- 📄 book1.pdf
- 📄 book2.pdf
- 📄 book3.pdf

---

### Example 2: With Folders
```
media/
├── Technical Books/
│   ├── javascript.pdf
│   ├── python.pdf
│   └── react.pdf
├── Novels/
│   ├── fiction1.pdf
│   └── fiction2.pdf
└── reference.pdf
```

**Result in UI:**
- 📁 Technical Books (click to expand)
  - 📄 javascript.pdf
  - 📄 python.pdf
  - 📄 react.pdf
- 📁 Novels (click to expand)
  - 📄 fiction1.pdf
  - 📄 fiction2.pdf
- 📄 reference.pdf

---

### Example 3: Complex Structure
```
media/
├── Programming/
│   ├── JavaScript/
│   │   ├── basics.pdf
│   │   └── advanced.pdf
│   ├── Python/
│   │   └── tutorial.pdf
│   └── general.pdf
├── Literature/
│   ├── classics.pdf
│   └── modern.pdf
└── quick-reference.pdf
```

**Result in UI:**
- 📁 Programming
  - 📁 JavaScript
    - 📄 basics.pdf
    - 📄 advanced.pdf
  - 📁 Python
    - 📄 tutorial.pdf
  - 📄 general.pdf
- 📁 Literature
  - 📄 classics.pdf
  - 📄 modern.pdf
- 📄 quick-reference.pdf

## 🔧 Configuration (config.js)

The `add-pdf.bat` script automatically generates this structure:

```javascript
const CONFIG = {
    mediaFolder: 'media/',
    
    structure: {
        // Root level files
        '_files': ['reference.pdf', 'quick-guide.pdf'],
        
        // Folders with files
        'Technical Books': ['javascript.pdf', 'python.pdf'],
        'Novels': ['book1.pdf', 'book2.pdf'],
        
        // Nested folders (advanced)
        'Programming': {
            '_files': ['general.pdf'],
            'JavaScript': ['basics.pdf', 'advanced.pdf'],
            'Python': ['tutorial.pdf']
        }
    },
    
    settings: {
        defaultZoom: 1.5,
        enableKeyboardShortcuts: true,
        showWelcomeScreen: true,
        autoExpandFolders: false,  // Set to true to auto-expand all folders
    }
};
```

## 🚀 Quick Start

### Step 1: Add PDFs
```bash
# Double-click this file:
add-pdf.bat
```
- Opens the media folder
- Copy your PDFs
- Organize into folders
- Press any key to scan

### Step 2: Test Locally
```bash
# Double-click this file:
open-local.bat
```
- Opens in browser
- Check folder structure
- Test PDF loading

### Step 3: Publish Online
```bash
# Double-click this file:
push.bat
```
- Commits changes
- Pushes to GitHub
- Live in 2-3 minutes

## 📋 Best Practices

### ✅ DO:
- Use descriptive folder names
- Keep folder structure simple (2-3 levels max)
- Use clear PDF filenames
- Group related PDFs together
- Run `add-pdf.bat` after changes

### ❌ DON'T:
- Use special characters in names (!, @, #, etc.)
- Create too many nested levels
- Use very long file/folder names
- Mix different languages in names
- Forget to run `add-pdf.bat`

## 🎨 UI Features

### Folder Display
- **Collapsed by default** - Click to expand
- **📁 Icon** - Indicates folder
- **📄 Icon** - Indicates PDF file
- **📖 Icon** - Currently reading
- **Hover effects** - Smooth animations
- **Color coding** - Active file highlighted

### Navigation
- Click folder name to expand/collapse
- Click PDF name to open
- Folders remember expand state
- Smooth transitions

## 🔄 Updating Structure

### Adding New PDFs:
1. Copy PDFs to media folder
2. Run `add-pdf.bat`
3. Run `push.bat`

### Reorganizing:
1. Move PDFs between folders
2. Rename folders
3. Run `add-pdf.bat`
4. Run `push.bat`

### Removing PDFs:
1. Delete PDFs from media folder
2. Run `add-pdf.bat`
3. Run `push.bat`

## 🐛 Troubleshooting

### PDFs not showing?
- Check if PDFs are in media folder
- Run `add-pdf.bat` to rescan
- Check config.js was updated
- Refresh browser (Ctrl+F5)

### Folder structure wrong?
- Check folder names (no special chars)
- Run `add-pdf.bat` again
- Verify config.js structure
- Check browser console for errors

### Can't open PDF?
- Verify PDF file is not corrupted
- Check file path in config.js
- Ensure PDF is in correct folder
- Check browser console for errors

## 💡 Tips

1. **Organize by Category**: Create folders like "Technical", "Fiction", "Reference"
2. **Use Subfolders**: Group related books in subfolders
3. **Clear Names**: Use descriptive file and folder names
4. **Test Locally**: Always test with `open-local.bat` before pushing
5. **Auto-expand**: Set `autoExpandFolders: true` to show all folders open

## 📱 Mobile Experience

The folder structure works perfectly on mobile:
- Touch-friendly folder headers
- Smooth expand/collapse
- Optimized spacing
- Easy navigation

## 🌐 Live Example

Visit your live site to see the folder structure in action:
https://dhanyakumarjain.github.io/ebook-jinvani-reader/

---

**Happy organizing! 📚✨**
