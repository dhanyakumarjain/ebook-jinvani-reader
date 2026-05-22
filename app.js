// PDF.js worker configuration
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Application state
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;
let currentFileName = '';

// DOM elements
const fileList = document.getElementById('fileList');
const welcomeScreen = document.getElementById('welcomeScreen');
const pdfViewer = document.getElementById('pdfViewer');
const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');
const pageNumInput = document.getElementById('pageNum');
const pageCountSpan = document.getElementById('pageCount');
const zoomLevelSpan = document.getElementById('zoomLevel');
const canvasContainer = document.getElementById('canvasContainer');

// Event Listeners
document.getElementById('prevPage').addEventListener('click', onPrevPage);
document.getElementById('nextPage').addEventListener('click', onNextPage);
document.getElementById('zoomIn').addEventListener('click', onZoomIn);
document.getElementById('zoomOut').addEventListener('click', onZoomOut);
document.getElementById('fitWidth').addEventListener('click', onFitWidth);
document.getElementById('closeBook').addEventListener('click', closeBook);
pageNumInput.addEventListener('change', onPageInputChange);

// Initialize - Load PDFs from media folder
window.addEventListener('DOMContentLoaded', initializeMediaFolder);

async function initializeMediaFolder() {
    if (typeof CONFIG !== 'undefined' && CONFIG.structure) {
        displayFolderStructure();
    } else {
        fileList.innerHTML = '<p class="placeholder">No PDFs configured. Please update config.js</p>';
    }
}

// Display folder structure
function displayFolderStructure() {
    fileList.innerHTML = '';
    
    const structure = CONFIG.structure;
    
    if (Object.keys(structure).length === 0) {
        fileList.innerHTML = '<p class="placeholder">No PDFs found. Add PDFs to media folder and update config.js</p>';
        return;
    }
    
    renderStructure(structure, fileList, '');
}

// Recursively render folder structure
function renderStructure(structure, parentElement, currentPath) {
    for (const [key, value] of Object.entries(structure)) {
        if (key === '_files' && Array.isArray(value)) {
            // Render files in current folder
            value.forEach(filename => {
                createFileItem(filename, currentPath, parentElement);
            });
        } else if (Array.isArray(value)) {
            // It's a folder with files
            const folderItem = createFolderItem(key, parentElement);
            const folderContent = folderItem.querySelector('.folder-content');
            
            value.forEach(filename => {
                createFileItem(filename, currentPath + key + '/', folderContent);
            });
        } else if (typeof value === 'object') {
            // It's a folder with subfolders
            const folderItem = createFolderItem(key, parentElement);
            const folderContent = folderItem.querySelector('.folder-content');
            
            renderStructure(value, folderContent, currentPath + key + '/');
        }
    }
}

// Create folder item with expand/collapse
function createFolderItem(folderName, parentElement) {
    const folderContainer = document.createElement('div');
    folderContainer.className = 'folder-container';
    
    const folderHeader = document.createElement('div');
    folderHeader.className = 'folder-header';
    folderHeader.innerHTML = `
        <span class="folder-icon">📁</span>
        <span class="folder-name">${folderName}</span>
        <span class="folder-toggle">▼</span>
    `;
    
    const folderContent = document.createElement('div');
    folderContent.className = 'folder-content';
    
    // Auto-expand if configured
    if (CONFIG.settings.autoExpandFolders) {
        folderContent.classList.add('expanded');
        folderHeader.classList.add('expanded');
    }
    
    // Toggle folder on click
    folderHeader.addEventListener('click', () => {
        folderContent.classList.toggle('expanded');
        folderHeader.classList.toggle('expanded');
    });
    
    folderContainer.appendChild(folderHeader);
    folderContainer.appendChild(folderContent);
    parentElement.appendChild(folderContainer);
    
    return folderContainer;
}

// Create file item
function createFileItem(filename, path, parentElement) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `<span class="file-icon">📄</span><span class="file-name">${filename}</span>`;
    
    const fullPath = CONFIG.mediaFolder + path + filename;
    
    fileItem.addEventListener('click', () => loadPDFFromMedia(fullPath, filename, fileItem));
    parentElement.appendChild(fileItem);
}

// Load PDF from media folder
async function loadPDFFromMedia(filePath, fileName, fileItem) {
    try {
        // Update active file in list
        document.querySelectorAll('.file-item').forEach(item => item.classList.remove('active'));
        fileItem.classList.add('active');
        
        // Update icon for active file
        const icon = fileItem.querySelector('.file-icon');
        if (icon) icon.textContent = '📖';
        
        currentFileName = fileName;
        
        // Show loading state
        showLoading(true);
        
        // Fetch PDF from media folder
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load PDF: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        
        // Load PDF document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        pdfDoc = await loadingTask.promise;
        
        // Reset to first page
        pageNum = 1;
        pageCountSpan.textContent = pdfDoc.numPages;
        pageNumInput.max = pdfDoc.numPages;
        pageNumInput.value = 1;
        
        // Show viewer, hide welcome screen
        welcomeScreen.style.display = 'none';
        pdfViewer.style.display = 'flex';
        
        showLoading(false);
        
        // Render first page
        renderPage(pageNum);
        
    } catch (error) {
        console.error('Error loading PDF:', error);
        showLoading(false);
        alert('Error loading PDF: ' + error.message + '\n\nMake sure the PDF file exists in the media folder.');
        
        // Reset icon on error
        const icon = fileItem.querySelector('.file-icon');
        if (icon) icon.textContent = '📄';
        fileItem.classList.remove('active');
    }
}

// Show/hide loading indicator
function showLoading(show) {
    const existingLoader = document.querySelector('.loading-overlay');
    
    if (show && !existingLoader) {
        const loader = document.createElement('div');
        loader.className = 'loading-overlay';
        loader.innerHTML = '<div class="loading-spinner"></div><p>Loading PDF...</p>';
        document.body.appendChild(loader);
    } else if (!show && existingLoader) {
        existingLoader.remove();
    }
}

// Render a page
function renderPage(num) {
    pageRendering = true;
    
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        const renderTask = page.render(renderContext);

        renderTask.promise.then(() => {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });

    // Update page number display
    pageNumInput.value = num;
    updateNavigationButtons();
}

// Queue page rendering
function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

// Navigation functions
function onPrevPage() {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
}

function onNextPage() {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
}

function onPageInputChange() {
    const inputPage = parseInt(pageNumInput.value);
    if (inputPage >= 1 && inputPage <= pdfDoc.numPages) {
        pageNum = inputPage;
        queueRenderPage(pageNum);
    } else {
        pageNumInput.value = pageNum;
    }
}

// Zoom functions
function onZoomIn() {
    scale += 0.25;
    updateZoomDisplay();
    queueRenderPage(pageNum);
}

function onZoomOut() {
    if (scale <= 0.5) return;
    scale -= 0.25;
    updateZoomDisplay();
    queueRenderPage(pageNum);
}

function onFitWidth() {
    if (!pdfDoc) return;
    
    pdfDoc.getPage(pageNum).then(page => {
        const containerWidth = canvasContainer.clientWidth - 40; // Account for padding
        const viewport = page.getViewport({ scale: 1 });
        scale = containerWidth / viewport.width;
        updateZoomDisplay();
        queueRenderPage(pageNum);
    });
}

function updateZoomDisplay() {
    zoomLevelSpan.textContent = Math.round(scale * 100) + '%';
}

// Update navigation button states
function updateNavigationButtons() {
    document.getElementById('prevPage').disabled = pageNum <= 1;
    document.getElementById('nextPage').disabled = pageNum >= pdfDoc.numPages;
}

// Close current book
function closeBook() {
    pdfDoc = null;
    pageNum = 1;
    scale = 1.5;
    currentFileName = '';
    
    pdfViewer.style.display = 'none';
    welcomeScreen.style.display = 'flex';
    
    // Clear active selection and reset icons
    document.querySelectorAll('.file-item').forEach(item => {
        item.classList.remove('active');
        const icon = item.querySelector('.file-icon');
        if (icon) icon.textContent = '📄';
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (!pdfDoc || !CONFIG.settings.enableKeyboardShortcuts) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            onPrevPage();
            break;
        case 'ArrowRight':
            onNextPage();
            break;
        case '+':
        case '=':
            onZoomIn();
            break;
        case '-':
            onZoomOut();
            break;
    }
});
