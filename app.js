// PDF.js worker configuration
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Application state
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;
let pdfFiles = [];
let currentFileName = '';

// DOM elements
const folderInput = document.getElementById('folderInput');
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
folderInput.addEventListener('change', handleFolderSelect);
document.getElementById('prevPage').addEventListener('click', onPrevPage);
document.getElementById('nextPage').addEventListener('click', onNextPage);
document.getElementById('zoomIn').addEventListener('click', onZoomIn);
document.getElementById('zoomOut').addEventListener('click', onZoomOut);
document.getElementById('fitWidth').addEventListener('click', onFitWidth);
document.getElementById('closeBook').addEventListener('click', closeBook);
pageNumInput.addEventListener('change', onPageInputChange);

// Handle folder selection
function handleFolderSelect(e) {
    const files = Array.from(e.target.files);
    pdfFiles = files.filter(file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
    
    if (pdfFiles.length === 0) {
        fileList.innerHTML = '<p class="placeholder">No PDF files found in the selected folder.</p>';
        return;
    }

    displayFileList();
}

// Display list of PDF files
function displayFileList() {
    fileList.innerHTML = '';
    
    pdfFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.textContent = file.name;
        fileItem.dataset.index = index;
        fileItem.addEventListener('click', () => loadPDF(file, fileItem));
        fileList.appendChild(fileItem);
    });
}

// Load and display PDF
async function loadPDF(file, fileItem) {
    try {
        // Update active file in list
        document.querySelectorAll('.file-item').forEach(item => item.classList.remove('active'));
        fileItem.classList.add('active');
        
        currentFileName = file.name;
        
        // Read file as array buffer
        const arrayBuffer = await file.arrayBuffer();
        
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
        
        // Render first page
        renderPage(pageNum);
        
    } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Error loading PDF: ' + error.message);
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
    
    // Clear active selection
    document.querySelectorAll('.file-item').forEach(item => item.classList.remove('active'));
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (!pdfDoc) return;
    
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
