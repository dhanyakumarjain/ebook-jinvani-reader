// Configuration for Jinvani eBook Reader
const CONFIG = {
    // Media folder path (relative to index.html)
    mediaFolder: 'media/',
    
    // Folder structure with PDFs
    // Organize your PDFs in folders for better management
    // Format: 
    // {
    //   'FolderName': ['file1.pdf', 'file2.pdf'],
    //   'AnotherFolder': {
    //     'Subfolder': ['file3.pdf'],
    //     '_files': ['file4.pdf']  // Files directly in AnotherFolder
    //   },
    //   '_files': ['root-file.pdf']  // Files in root media folder
    // }
    structure: {
        // Add your folder structure here
        // Example:
        // 'Technical Books': ['javascript.pdf', 'python.pdf'],
        // 'Novels': ['book1.pdf', 'book2.pdf'],
    },
    
    // Application settings
    settings: {
        defaultZoom: 1.5,
        enableKeyboardShortcuts: true,
        showWelcomeScreen: true,
        autoExpandFolders: false,  // Auto-expand all folders on load
    }
};
