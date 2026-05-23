# ⚡ Quick Guide - PDF Management

## 🔄 When You Delete a PDF from Media Folder

### The Process (3 Simple Steps):

```
┌─────────────────────────────────────────────────────────┐
│  Step 1: Delete PDF from media/ folder                 │
│  ✓ Use Windows Explorer                                │
│  ✓ Delete any PDF file(s)                              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Step 2: Run generate-data.bat                         │
│  ✓ Double-click: scripts\generate-data.bat             │
│  ✓ This updates data.json automatically                │
│  ✓ Deleted PDFs are removed from the list              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Step 3: Deploy to web                                 │
│  ✓ Double-click: scripts\git-push.bat                  │
│  ✓ Wait 2-3 minutes for GitHub Pages                   │
│  ✓ Deleted PDF is now gone from website! ✅            │
└─────────────────────────────────────────────────────────┘
```

## 📝 Example

**You want to delete:** `media/old-book.pdf`

**Do this:**
```bash
# 1. Delete the file
Delete: media/old-book.pdf

# 2. Update library
Double-click: scripts\generate-data.bat

# 3. Deploy
Double-click: scripts\git-push.bat
```

**Result:** `old-book.pdf` is removed from your website! ✨

## 🎯 Key Points

✅ **Automatic Sync** - The script automatically detects what's in the media folder  
✅ **No Manual Editing** - You never need to edit data.json manually  
✅ **Works for Everything** - Add, delete, rename, reorganize - all automatic  

## ⚡ All Operations

| What You Want | What You Do | Scripts to Run |
|---------------|-------------|----------------|
| **Add PDFs** | Copy to media/ | generate-data.bat → git-push.bat |
| **Delete PDFs** | Delete from media/ | generate-data.bat → git-push.bat |
| **Rename PDFs** | Rename in media/ | generate-data.bat → git-push.bat |
| **Move PDFs** | Move in media/ | generate-data.bat → git-push.bat |

## 🚀 Remember

**Always run these 2 scripts after any change:**
1. `scripts\generate-data.bat` (updates library)
2. `scripts\git-push.bat` (deploys to web)

**That's it!** Your changes will be live in 2-3 minutes! 🎉

---

See `HOW_TO_MANAGE_PDFS.md` for detailed documentation.
