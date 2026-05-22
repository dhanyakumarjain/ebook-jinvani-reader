# 📚 Jinvani eBook Reader

A modern, web-based PDF reader application that allows you to browse and read PDF files from your local folders.

## Features

✨ **Key Features:**
- 📁 Browse and select PDF files from any folder
- 📖 Clean, intuitive reading interface
- 🔍 Zoom in/out controls
- ↔️ Fit to width option
- ⬅️➡️ Page navigation (buttons and keyboard shortcuts)
- 🎨 Beautiful gradient UI design
- 📱 Responsive design for different screen sizes

## How to Use

1. **Open the Application**
   - Simply open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari)

2. **Select Your PDF Folder**
   - Click the "📁 Select PDF Folder" button in the sidebar
   - Choose a folder containing your PDF files
   - All PDF files in that folder will appear in the sidebar

3. **Read a Book**
   - Click on any PDF file name in the sidebar to open it
   - Use the navigation controls:
     - **Previous/Next buttons**: Navigate between pages
     - **Page input**: Jump to a specific page
     - **Zoom buttons**: Adjust the zoom level
     - **Fit Width button**: Auto-fit the page to your screen width
     - **Close button**: Close the current book

4. **Keyboard Shortcuts**
   - `Arrow Left`: Previous page
   - `Arrow Right`: Next page
   - `+` or `=`: Zoom in
   - `-`: Zoom out

## Technical Details

**Technologies Used:**
- HTML5
- CSS3 (with modern gradients and animations)
- JavaScript (ES6+)
- PDF.js library (for PDF rendering)

**Browser Requirements:**
- Modern web browser with JavaScript enabled
- Support for File System Access API (for folder selection)

## File Structure

```
jinvani-reader/
├── index.html      # Main HTML file
├── style.css       # Styling and layout
├── app.js          # Application logic
└── README.md       # This file
```

## Setup

No installation required! Just:
1. Download all files to a folder
2. Open `index.html` in your web browser
3. Start reading!

## Notes

- The application runs entirely in your browser
- No files are uploaded to any server
- All PDF processing happens locally on your device
- Works offline (after the first load of PDF.js library)

## Future Enhancements

Possible features to add:
- Bookmarks and reading progress
- Full-text search within PDFs
- Dark mode
- Reading history
- Annotations and highlights
- Table of contents navigation

## License

Free to use and modify for personal and commercial projects.

---

**Enjoy reading with Jinvani eBook Reader! 📚✨**
