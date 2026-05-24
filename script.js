// ========================================
// JINVANI EBOOK READER - MAIN SCRIPT
// ========================================

// ========================================
// CONSTANTS & STATE
// ========================================

const STATE = {
    libraryData: null,
    currentFolder: null,
    searchQuery: '',
    theme: localStorage.getItem('theme') || 'light',
    allPdfs: [],
    totalFolders: 0
};

// ========================================
// DOM ELEMENTS
// ========================================

const DOM = {
    // Header
    menuToggle: document.getElementById('menuToggle'),
    searchInput: document.getElementById('searchInput'),
    searchClear: document.getElementById('searchClear'),
    themeToggle: document.getElementById('themeToggle'),
    
    // Sidebar
    sidebar: document.getElementById('sidebar'),
    folderTree: document.getElementById('folderTree'),
    collapseAll: document.getElementById('collapseAll'),
    
    // Main Content
    breadcrumb: document.getElementById('breadcrumb'),
    pdfGrid: document.getElementById('pdfGrid'),
    welcomeScreen: document.getElementById('welcomeScreen'),
    emptyState: document.getElementById('emptyState'),
    errorState: document.getElementById('errorState'),
    errorMessage: document.getElementById('errorMessage'),
    
    // Stats (may not exist in new layout)
    totalPdfs: document.getElementById('totalPdfs'),
    totalFolders: document.getElementById('totalFolders'),
    totalBookmarks: document.getElementById('totalBookmarks'),
    recentCount: document.getElementById('recentCount'),
    
    // Modal
    pdfModal: document.getElementById('pdfModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalClose: document.getElementById('modalClose'),
    pdfFrame: document.getElementById('pdfFrame')
};

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeEventListeners();
    loadLibraryData();
});

// ========================================
// THEME MANAGEMENT
// ========================================

function initializeTheme() {
    document.documentElement.setAttribute('data-theme', STATE.theme);
    updateThemeIcon();
}

function toggleTheme() {
    STATE.theme = STATE.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', STATE.theme);
    document.documentElement.setAttribute('data-theme', STATE.theme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = DOM.themeToggle.querySelector('i');
    icon.className = STATE.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// ========================================
// EVENT LISTENERS
// ========================================

function initializeEventListeners() {
    // Theme toggle
    DOM.themeToggle.addEventListener('click', toggleTheme);
    
    // Menu toggle (mobile)
    DOM.menuToggle.addEventListener('click', () => {
        DOM.sidebar.classList.toggle('active');
    });
    
    // Search
    DOM.searchInput.addEventListener('input', handleSearch);
    DOM.searchClear.addEventListener('click', clearSearch);
    
    // Collapse all folders
    DOM.collapseAll.addEventListener('click', collapseAllFolders);
    
    // Modal close
    DOM.modalClose.addEventListener('click', closeModal);
    DOM.pdfModal.addEventListener('click', (e) => {
        if (e.target === DOM.pdfModal) closeModal();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            DOM.searchInput.focus();
        }
    });
}

// ========================================
// DATA LOADING
// ========================================

async function loadLibraryData() {
    try {
        showLoading();
        
        const response = await fetch('data.json');
        
        if (!response.ok) {
            throw new Error('data.json not found. Please run generate-data.bat');
        }
        
        const data = await response.json();
        STATE.libraryData = data;
        
        // Extract all PDFs and count folders
        extractAllPdfs(data);
        
        // Update stats
        updateStats();
        
        // Render folder tree
        renderFolderTree(data);
        
        // Show welcome screen
        showWelcomeScreen();
        
    } catch (error) {
        console.error('Error loading library:', error);
        showError(error.message);
    }
}

function extractAllPdfs(node, path = '') {
    if (node.type === 'file') {
        STATE.allPdfs.push({
            name: node.name,
            path: node.path,
            fullPath: path + '/' + node.name
        });
    } else if (node.type === 'folder') {
        STATE.totalFolders++;
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                extractAllPdfs(child, path + '/' + node.name);
            });
        }
    }
}

function updateStats() {
    // Update total PDFs
    if (DOM.totalPdfs) {
        DOM.totalPdfs.textContent = STATE.allPdfs.length;
    }
    
    // Update total folders
    if (DOM.totalFolders) {
        DOM.totalFolders.textContent = STATE.totalFolders;
    }
    
    // Make allPdfs available globally for landing page
    window.allPdfs = STATE.allPdfs;
    
    // Refresh landing page if it exists
    if (typeof landingPage !== 'undefined') {
        landingPage.updateStats();
    }
}

// ========================================
// FOLDER TREE RENDERING
// ========================================

function renderFolderTree(data) {
    DOM.folderTree.innerHTML = '';
    
    if (!data.children || data.children.length === 0) {
        DOM.folderTree.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>No folders or PDFs found</p>
                <small>Add PDFs to media folder and run generate-data.bat</small>
            </div>
        `;
        return;
    }
    
    data.children.forEach(child => {
        const element = createTreeNode(child);
        DOM.folderTree.appendChild(element);
    });
}

function createTreeNode(node) {
    if (node.type === 'file') {
        return createFileNode(node);
    } else {
        return createFolderNode(node);
    }
}

function createFolderNode(folder) {
    const folderItem = document.createElement('div');
    folderItem.className = 'folder-item';
    
    // Count PDFs in folder (recursive)
    const pdfCount = countPdfsInFolder(folder);
    
    // Folder header
    const folderHeader = document.createElement('div');
    folderHeader.className = 'folder-header';
    folderHeader.innerHTML = `
        <i class="fas fa-chevron-right folder-toggle"></i>
        <i class="fas fa-folder folder-icon"></i>
        <span class="folder-name">${escapeHtml(folder.name)}</span>
        <span class="folder-count">${pdfCount}</span>
    `;
    
    // Folder children container
    const folderChildren = document.createElement('div');
    folderChildren.className = 'folder-children';
    
    // Add children
    if (folder.children && folder.children.length > 0) {
        folder.children.forEach(child => {
            const childElement = createTreeNode(child);
            folderChildren.appendChild(childElement);
        });
    }
    
    // Toggle folder on click
    folderHeader.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFolder(folderHeader, folderChildren);
    });
    
    // Click folder name to show its PDFs
    folderHeader.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        showFolderContents(folder);
    });
    
    folderItem.appendChild(folderHeader);
    folderItem.appendChild(folderChildren);
    
    return folderItem;
}

function createFileNode(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
        <i class="fas fa-file-pdf file-icon"></i>
        <span class="file-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</span>
    `;
    
    fileItem.addEventListener('click', (e) => {
        e.stopPropagation();
        openPdf(file);
    });
    
    return fileItem;
}

function toggleFolder(header, children) {
    const toggle = header.querySelector('.folder-toggle');
    const isExpanded = children.classList.contains('expanded');
    
    if (isExpanded) {
        children.classList.remove('expanded');
        toggle.classList.remove('expanded');
    } else {
        children.classList.add('expanded');
        toggle.classList.add('expanded');
    }
}

function collapseAllFolders() {
    const allFolderChildren = document.querySelectorAll('.folder-children');
    const allToggles = document.querySelectorAll('.folder-toggle');
    
    allFolderChildren.forEach(child => child.classList.remove('expanded'));
    allToggles.forEach(toggle => toggle.classList.remove('expanded'));
}

function countPdfsInFolder(folder) {
    let count = 0;
    
    if (folder.children) {
        folder.children.forEach(child => {
            if (child.type === 'file') {
                count++;
            } else if (child.type === 'folder') {
                count += countPdfsInFolder(child);
            }
        });
    }
    
    return count;
}

// ========================================
// CONTENT DISPLAY
// ========================================

function showWelcomeScreen() {
    if (DOM.welcomeScreen) {
        DOM.welcomeScreen.style.display = 'flex';
    }
    
    if (DOM.emptyState) {
        DOM.emptyState.style.display = 'none';
    }
    
    if (DOM.errorState) {
        DOM.errorState.style.display = 'none';
    }
    
    // Show recent panel if there are recent books (element may not exist in simplified layout)
    const recentPanel = document.getElementById('recentPanel');
    if (recentPanel && typeof pdfViewer !== 'undefined') {
        const recent = pdfViewer.getRecentBooks();
        if (recent.length > 0) {
            recentPanel.style.display = 'block';
        } else {
            recentPanel.style.display = 'none';
        }
    }
    
    // Clear PDF grid except welcome screen and recent panel
    const pdfCards = DOM.pdfGrid.querySelectorAll('.pdf-card');
    pdfCards.forEach(card => card.remove());
}

function showFolderContents(folder) {
    STATE.currentFolder = folder;
    
    // Update breadcrumb
    updateBreadcrumb(folder);
    
    // Get all PDFs in folder (recursive)
    const pdfs = getAllPdfsInFolder(folder);
    
    // Display PDFs
    displayPdfs(pdfs);
    
    // Hide welcome screen
    DOM.welcomeScreen.style.display = 'none';
}

function getAllPdfsInFolder(folder) {
    const pdfs = [];
    
    if (folder.children) {
        folder.children.forEach(child => {
            if (child.type === 'file') {
                pdfs.push(child);
            } else if (child.type === 'folder') {
                pdfs.push(...getAllPdfsInFolder(child));
            }
        });
    }
    
    return pdfs;
}

function displayPdfs(pdfs) {
    // Clear existing PDF cards
    const existingCards = DOM.pdfGrid.querySelectorAll('.pdf-card');
    existingCards.forEach(card => card.remove());
    
    if (pdfs.length === 0) {
        DOM.emptyState.style.display = 'flex';
        DOM.welcomeScreen.style.display = 'none';
        return;
    }
    
    DOM.emptyState.style.display = 'none';
    DOM.welcomeScreen.style.display = 'none';
    
    pdfs.forEach(pdf => {
        const card = createPdfCard(pdf);
        DOM.pdfGrid.appendChild(card);
    });
}

function createPdfCard(pdf) {
    const card = document.createElement('div');
    card.className = 'pdf-card';
    
    const fileName = pdf.name.replace('.pdf', '');
    const filePath = pdf.path.replace('media/', '');
    
    card.innerHTML = `
        <div class="pdf-card-icon">
            <i class="fas fa-file-pdf"></i>
        </div>
        <h3 class="pdf-card-title" title="${escapeHtml(fileName)}">${escapeHtml(fileName)}</h3>
        <p class="pdf-card-path" title="${escapeHtml(filePath)}">${escapeHtml(filePath)}</p>
        <div class="pdf-card-actions">
            <button class="btn-primary" onclick="openPdfByPath('${pdf.path}', '${escapeHtml(pdf.name)}')">
                <i class="fas fa-eye"></i>
                View
            </button>
            <button class="btn-secondary" onclick="downloadPdf('${pdf.path}', '${escapeHtml(pdf.name)}')">
                <i class="fas fa-download"></i>
                Download
            </button>
        </div>
    `;
    
    return card;
}

// ========================================
// BREADCRUMB
// ========================================

function updateBreadcrumb(folder) {
    DOM.breadcrumb.innerHTML = `
        <a href="#" class="breadcrumb-item" onclick="showWelcomeScreen(); return false;">
            <i class="fas fa-home"></i>
            Home
        </a>
    `;
    
    if (folder) {
        const breadcrumbItem = document.createElement('a');
        breadcrumbItem.href = '#';
        breadcrumbItem.className = 'breadcrumb-item';
        breadcrumbItem.textContent = folder.name;
        breadcrumbItem.onclick = (e) => {
            e.preventDefault();
            showFolderContents(folder);
        };
        DOM.breadcrumb.appendChild(breadcrumbItem);
    }
}

// ========================================
// SEARCH
// ========================================

function handleSearch(e) {
    const query = e.target.value.trim().toLowerCase();
    STATE.searchQuery = query;
    
    // Show/hide clear button
    if (query) {
        DOM.searchClear.classList.add('visible');
    } else {
        DOM.searchClear.classList.remove('visible');
        showWelcomeScreen();
        return;
    }
    
    // Search PDFs
    const results = searchPdfs(query);
    
    // Display results
    displayPdfs(results);
    
    // Update breadcrumb
    DOM.breadcrumb.innerHTML = `
        <a href="#" class="breadcrumb-item" onclick="showWelcomeScreen(); clearSearch(); return false;">
            <i class="fas fa-home"></i>
            Home
        </a>
        <span class="breadcrumb-item">
            <i class="fas fa-search"></i>
            Search: "${escapeHtml(query)}"
        </span>
    `;
}

function searchPdfs(query) {
    return STATE.allPdfs.filter(pdf => {
        return pdf.name.toLowerCase().includes(query) ||
               pdf.path.toLowerCase().includes(query);
    }).map(pdf => ({
        name: pdf.name,
        path: pdf.path,
        type: 'file'
    }));
}

function clearSearch() {
    DOM.searchInput.value = '';
    STATE.searchQuery = '';
    DOM.searchClear.classList.remove('visible');
    showWelcomeScreen();
}

// ========================================
// PDF OPERATIONS
// ========================================

function openPdf(file) {
    console.log('openPdf called with:', file);
    if (typeof pdfViewer !== 'undefined' && pdfViewer) {
        console.log('pdfViewer exists, opening PDF');
        pdfViewer.openPdf(file.path, file.name);
    } else {
        console.error('pdfViewer is not defined or not initialized');
        alert('PDF Viewer is not ready. Please refresh the page.');
    }
}

function openPdfByPath(path, name) {
    console.log('openPdfByPath called with:', path, name);
    if (typeof pdfViewer !== 'undefined' && pdfViewer) {
        console.log('pdfViewer exists, opening PDF');
        pdfViewer.openPdf(path, name);
    } else {
        console.error('pdfViewer is not defined or not initialized');
        alert('PDF Viewer is not ready. Please refresh the page.');
    }
}

function downloadPdf(path, name) {
    const link = document.createElement('a');
    link.href = path;
    link.download = name;
    link.click();
}

function closeModal() {
    if (typeof pdfViewer !== 'undefined') {
        pdfViewer.closePdf();
    }
}

// ========================================
// UI STATE MANAGEMENT
// ========================================

function showLoading() {
    DOM.folderTree.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading library...</p>
        </div>
    `;
}

function showError(message) {
    DOM.errorState.style.display = 'flex';
    DOM.welcomeScreen.style.display = 'none';
    DOM.emptyState.style.display = 'none';
    DOM.errorMessage.textContent = message;
    
    DOM.folderTree.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Error loading library</p>
        </div>
    `;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// GLOBAL FUNCTIONS (for inline onclick)
// ========================================

window.openPdfByPath = openPdfByPath;
window.downloadPdf = downloadPdf;
window.showWelcomeScreen = showWelcomeScreen;
window.clearSearch = clearSearch;
