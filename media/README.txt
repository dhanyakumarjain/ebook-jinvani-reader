========================================
  MEDIA FOLDER - PDF ORGANIZATION
========================================

This folder contains all your PDF ebooks.

ORGANIZATION:
-------------
You can organize PDFs in two ways:

1. ROOT LEVEL (media/)
   - Place PDFs directly here
   - They will appear at the top of your library

2. SUBFOLDERS (media/FolderName/)
   - Create folders for categories
   - Example: media/Technical Books/
   - Example: media/Novels/
   - Example: media/Reference/

EXAMPLE STRUCTURE:
------------------
media/
├── book1.pdf                    (Root level)
├── book2.pdf                    (Root level)
├── Technical Books/
│   ├── javascript.pdf
│   ├── python.pdf
│   └── database.pdf
├── Novels/
│   ├── fiction1.pdf
│   └── fiction2.pdf
└── Reference/
    └── manual.pdf

HOW TO ADD PDFs:
----------------
1. Copy your PDF files here
2. Organize into folders (optional)
3. Run add-pdf.bat to update config.js
4. Run push.bat to publish online

NOTES:
------
- Only PDF files are supported
- Folder names will appear in the UI
- You can nest folders (subfolders)
- File names should not contain special characters

========================================
