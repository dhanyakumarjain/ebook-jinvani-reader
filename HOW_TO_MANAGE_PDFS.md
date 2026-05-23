# 📚 How to Manage PDFs - Add, Delete, Update

## 🔄 Automatic Sync System

Your eBook reader uses a **simple 3-step process** to sync PDFs between your local folder and the web:

```
1. Make changes to media/ folder (add/delete/rename PDFs)
2. Run generate-data.bat
3. Deploy to web (git-push.bat)
```

## ➕ Adding New PDFs

### Step 1: Add PDF Files
Copy your PDF files to the `media/` folder:
```
media/
├── my-new-book.pdf
├── another-book.pdf
└── subfolder/
    └── organized-book.pdf
```

### Step 2: Generate Data
Run the script to update the library:
```bash
scripts\generate-data.bat
```

This creates/updates `data.json` with the new PDF list.

### Step 3: Deploy to Web
Push changes to GitHub Pages:
```bash
scripts\git-push.bat
```

**Done!** New PDFs will appear on your website.

## ➖ Deleting PDFs

### Step 1: Delete PDF Files
Simply delete the PDF file(s) from the `media/` folder:
- Delete individual files
- Delete entire folders
- Use Windows Explorer or command line

### Step 2: Regenerate Data
Run the script to update the library:
```bash
scripts\generate-data.bat
```

This will **automatically remove** deleted PDFs from `data.json`.

### Step 3: Deploy to Web
Push changes to GitHub Pages:
```bash
scripts\git-push.bat
```

**Done!** Deleted PDFs will be removed from your website.

## 🔄 Renaming PDFs

### Step 1: Rename PDF Files
Rename files in the `media/` folder using Windows Explorer.

### Step 2: Regenerate Data
```bash
scripts\generate-data.bat
```

### Step 3: Deploy to Web
```bash
scripts\git-push.bat
```

**Done!** PDFs will show with new names on your website.

## 📁 Organizing with Folders

You can organize PDFs in subfolders:

```
media/
├── Prayers/
│   ├── morning-prayer.pdf
│   └── evening-prayer.pdf
├── Scriptures/
│   ├── sutra-1.pdf
│   └── sutra-2.pdf
└── Poojas/
    └── special-pooja.pdf
```

The app will automatically create a folder tree structure!

### To Add Folders:
1. Create folders in `media/`
2. Add PDFs to folders
3. Run `generate-data.bat`
4. Deploy with `git-push.bat`

### To Delete Folders:
1. Delete folder from `media/`
2. Run `generate-data.bat`
3. Deploy with `git-push.bat`

## 🚀 Quick Commands

### All-in-One Update (After any changes)
```bash
# 1. Generate data
scripts\generate-data.bat

# 2. Deploy to web
scripts\git-push.bat
```

That's it! Your changes are live.

## 🔍 How It Works

### The generate-data.bat Script:
1. Scans the `media/` folder
2. Finds all `.pdf` files (including subfolders)
3. Creates a JSON structure with:
   - File names
   - File paths
   - Folder structure
4. Saves to `data.json`

### What Gets Included:
- ✅ All `.pdf` files
- ✅ Files in subfolders (any depth)
- ✅ Folder structure

### What Gets Excluded:
- ❌ Hidden files (starting with `.`)
- ❌ `README.txt` files
- ❌ Non-PDF files

### The Web App:
1. Loads `data.json` on startup
2. Displays PDFs based on the JSON structure
3. If a PDF is not in `data.json`, it won't appear
4. If a PDF is in `data.json` but file is missing, shows error

## 📝 Example Workflow

### Scenario: Delete 3 PDFs and Add 2 New Ones

**Step 1: Make Changes**
```
Delete:
- media/old-book-1.pdf
- media/old-book-2.pdf
- media/subfolder/old-book-3.pdf

Add:
- media/new-book-1.pdf
- media/new-book-2.pdf
```

**Step 2: Regenerate**
```bash
scripts\generate-data.bat
```

Output:
```
Successfully generated data.json
```

**Step 3: Deploy**
```bash
scripts\git-push.bat
```

Output:
```
Pushing to GitHub...
Changes deployed!
```

**Result:**
- Old PDFs removed from website ✅
- New PDFs appear on website ✅
- All in ~2 minutes!

## ⚡ Pro Tips

### 1. Batch Operations
You can make multiple changes at once:
- Delete 10 PDFs
- Add 20 PDFs
- Rename 5 PDFs
- Reorganize folders

Then run `generate-data.bat` **once** to update everything!

### 2. Test Locally First
Before deploying to web:
```bash
# 1. Make changes
# 2. Generate data
scripts\generate-data.bat

# 3. Test locally
scripts\run-local-server.bat

# 4. Open browser: http://localhost:8000
# 5. Verify changes look good

# 6. Deploy when ready
scripts\git-push.bat
```

### 3. Backup Before Deleting
Before deleting PDFs, consider backing them up:
```bash
# Copy media folder to backup location
xcopy media backup\media /E /I
```

### 4. File Naming
Use clear, descriptive names:
- ✅ `morning-prayer-jain.pdf`
- ✅ `001-pratah-kalina-vandana.pdf`
- ❌ `untitled.pdf`
- ❌ `doc1.pdf`

### 5. Folder Organization
Organize by category:
```
media/
├── 01-Daily-Prayers/
├── 02-Special-Poojas/
├── 03-Scriptures/
└── 04-Vidhans/
```

## 🐛 Troubleshooting

### PDF Not Showing on Website?
1. Check if PDF is in `media/` folder
2. Run `generate-data.bat` again
3. Check if `data.json` was updated
4. Deploy with `git-push.bat`
5. Clear browser cache (Ctrl+Shift+R)

### Deleted PDF Still Showing?
1. Verify PDF is deleted from `media/`
2. Run `generate-data.bat` again
3. Check `data.json` (PDF should be gone)
4. Deploy with `git-push.bat`
5. Wait 2-3 minutes for GitHub Pages to update
6. Clear browser cache

### Changes Not Appearing?
1. Did you run `generate-data.bat`? ✓
2. Did you run `git-push.bat`? ✓
3. Wait 2-3 minutes for GitHub Pages
4. Clear browser cache (Ctrl+Shift+R)
5. Check GitHub repository for updates

## 📊 Summary

| Action | Steps | Time |
|--------|-------|------|
| **Add PDFs** | 1. Copy to media/<br>2. generate-data.bat<br>3. git-push.bat | ~2 min |
| **Delete PDFs** | 1. Delete from media/<br>2. generate-data.bat<br>3. git-push.bat | ~2 min |
| **Rename PDFs** | 1. Rename in media/<br>2. generate-data.bat<br>3. git-push.bat | ~2 min |
| **Reorganize** | 1. Move files/folders<br>2. generate-data.bat<br>3. git-push.bat | ~2 min |

## 🎯 Key Points

1. **The `media/` folder is the source of truth**
   - What's in media/ will appear on the website
   - What's not in media/ won't appear

2. **Always run `generate-data.bat` after changes**
   - This updates the library structure
   - Without this, changes won't be reflected

3. **Deploy with `git-push.bat` to make changes live**
   - Local changes need to be pushed to GitHub
   - GitHub Pages serves the live website

4. **The system is automatic**
   - No manual editing of `data.json` needed
   - Script handles everything automatically

## ✅ Checklist

After making any changes to PDFs:
- [ ] Made changes to `media/` folder
- [ ] Ran `scripts\generate-data.bat`
- [ ] Checked that `data.json` was updated
- [ ] (Optional) Tested locally with `run-local-server.bat`
- [ ] Ran `scripts\git-push.bat`
- [ ] Waited 2-3 minutes for deployment
- [ ] Cleared browser cache and verified changes

## 🎉 That's It!

Your PDF management is now **fully automatic**:
- Add PDFs → Generate → Deploy → Live! ✨
- Delete PDFs → Generate → Deploy → Gone! ✨
- Rename PDFs → Generate → Deploy → Updated! ✨

**Simple, fast, and automatic!** 📚🚀
