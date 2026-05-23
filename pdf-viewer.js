// ========================================
// ENHANCED PDF VIEWER
// ========================================

class PDFViewer {
    constructor() {
        this.pdfDoc = null;
        this.currentPage = 1;
        this.totalPages = 0;
        this.scale = 1.5;
        this.rotation = 0;
        this.rendering = false;
        this.currentPdfPath = '';
        this.currentPdfName = '';
        this.viewMode = 'single'; // 'single' or 'scroll'
        this.renderedPages = new Set();
        
        // DOM elements
        this.canvas = document.getElementById('pdfCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.modal = document.getElementById('pdfModal');
        this.loading = document.getElementById('pdfLoading');
        this.scrollLoading = document.getElementById('scrollLoading');
        this.singlePageView = document.getElementById('singlePageView');
        this.scrollView = document.getElementById('scrollView');
        this.pagesContainer = document.getElementById('pagesContainer');
        
        this.initializeControls();
        this.loadBookmarks();
        this.loadRecentBooks();
    }
    
    initializeControls() {
        // View mode toggle
        document.getElementById('toggleViewMode').addEventListener('click', () => this.toggleViewMode());
        
        // Page navigation
        document.getElementById('firstPage').addEventListener('click', () => this.goToPage(1));
        document.getElementById('prevPage').addEventListener('click', () => this.previousPage());
        document.getElementById('nextPage').addEventListener('click', () => this.nextPage());
        document.getElementById('lastPage').addEventListener('click', () => this.goToPage(this.totalPages));
        document.getElementById('pageNumber').addEventListener('change', (e) => {
            this.goToPage(parseInt(e.target.value));
        });
        
        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoomOut').addEventListener('click', () => this.zoomOut());
        document.getElementById('fitWidth').addEventListener('click', () => this.fitWidth());
        document.getElementById('fitPage').addEventListener('click', () => this.fitPage());
        
        // Rotation
        document.getElementById('rotateLeft').addEventListener('click', () => this.rotate(-90));
        document.getElementById('rotateRight').addEventListener('click', () => this.rotate(90));
        
        // Other controls
        document.getElementById('downloadPdf').addEventListener('click', () => this.downloadPdf());
        document.getElementById('bookmarkBtn').addEventListener('click', () => this.addBookmark());
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
        
        // Scroll detection for scroll mode
        this.scrollView.addEventListener('scroll', () => this.handleScroll());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'PageUp':
                    if (this.viewMode === 'single') this.previousPage();
                    break;
                case 'ArrowRight':
                case 'PageDown':
                    if (this.viewMode === 'single') this.nextPage();
                    break;
                case 'Home':
                    this.goToPage(1);
                    break;
                case 'End':
                    this.goToPage(this.totalPages);
                    break;
                case '+':
                case '=':
                    this.zoomIn();
                    break;
                case '-':
                    this.zoomOut();
                    break;
                case 'f':
                case 'F':
                    this.toggleFullscreen();
                    break;
                case 'b':
                case 'B':
                    this.addBookmark();
                    break;
                case 's':
                case 'S':
                    this.toggleViewMode();
                    break;
            }
        });
    }
    
    toggleViewMode() {
        this.viewMode = this.viewMode === 'single' ? 'scroll' : 'single';
        
        const btn = document.getElementById('toggleViewMode');
        const modeText = btn.querySelector('.mode-text');
        const icon = btn.querySelector('i');
        
        if (this.viewMode === 'scroll') {
            this.singlePageView.style.display = 'none';
            this.scrollView.style.display = 'block';
            modeText.textContent = 'Single';
            icon.className = 'fas fa-file';
            this.renderScrollView();
        } else {
            this.singlePageView.style.display = 'flex';
            this.scrollView.style.display = 'none';
            modeText.textContent = 'Scroll';
            icon.className = 'fas fa-th-list';
            this.renderPage(this.currentPage);
        }
    }
    
    async renderScrollView() {
        this.scrollLoading.style.display = 'flex';
        this.pagesContainer.innerHTML = '';
        this.renderedPages.clear();
        
        try {
            // Render first 5 pages initially
            const initialPages = Math.min(5, this.totalPages);
            for (let i = 1; i <= initialPages; i++) {
                await this.renderPageInScroll(i);
            }
            
            this.scrollLoading.style.display = 'none';
        } catch (error) {
            console.error('Error rendering scroll view:', error);
            this.scrollLoading.style.display = 'none';
        }
    }
    
    async renderPageInScroll(pageNum) {
        if (this.renderedPages.has(pageNum)) return;
        
        try {
            const page = await this.pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: this.scale, rotation: this.rotation });
            
            // Create canvas for this page
            const canvas = document.createElement('canvas');
            canvas.className = 'pdf-page';
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.dataset.pageNumber = pageNum;
            
            // Create page container with label
            const pageContainer = document.createElement('div');
            pageContainer.style.position = 'relative';
            pageContainer.style.marginBottom = '2rem';
            
            const pageLabel = document.createElement('div');
            pageLabel.className = 'page-number-label';
            pageLabel.textContent = `Page ${pageNum}`;
            
            pageContainer.appendChild(pageLabel);
            pageContainer.appendChild(canvas);
            this.pagesContainer.appendChild(pageContainer);
            
            // Render page
            const ctx = canvas.getContext('2d');
            await page.render({
                canvasContext: ctx,
                viewport: viewport
            }).promise;
            
            this.renderedPages.add(pageNum);
        } catch (error) {
            console.error(`Error rendering page ${pageNum}:`, error);
        }
    }
    
    handleScroll() {
        if (this.viewMode !== 'scroll') return;
        
        // Lazy load more pages as user scrolls
        const container = this.scrollView;
        const scrollPosition = container.scrollTop + container.clientHeight;
        const scrollHeight = container.scrollHeight;
        
        // Load more pages when near bottom
        if (scrollPosition > scrollHeight - 1000) {
            const nextPage = this.renderedPages.size + 1;
            if (nextPage <= this.totalPages && !this.rendering) {
                this.rendering = true;
                this.renderPageInScroll(nextPage).then(() => {
                    this.rendering = false;
                });
            }
        }
        
        // Update current page based on scroll position
        const canvases = this.pagesContainer.querySelectorAll('.pdf-page');
        canvases.forEach(canvas => {
            const rect = canvas.getBoundingClientRect();
            if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
                const pageNum = parseInt(canvas.dataset.pageNumber);
                if (this.currentPage !== pageNum) {
                    this.currentPage = pageNum;
                    document.getElementById('pageNumber').value = pageNum;
                    this.updateProgress();
                }
            }
        });
    }
    
    goToPage(pageNum) {
        if (pageNum < 1 || pageNum > this.totalPages) return;
        
        if (this.viewMode === 'scroll') {
            // Scroll to specific page
            const canvas = this.pagesContainer.querySelector(`[data-page-number="${pageNum}"]`);
            if (canvas) {
                canvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // Page not rendered yet, render it
                this.renderPageInScroll(pageNum).then(() => {
                    const newCanvas = this.pagesContainer.querySelector(`[data-page-number="${pageNum}"]`);
                    if (newCanvas) {
                        newCanvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            }
        } else {
            this.renderPage(pageNum);
        }
    }
    
    async openPdf(path, name) {
        try {
            this.currentPdfPath = path;
            this.currentPdfName = name;
            
            // Show modal and loading
            this.modal.classList.add('active');
            this.loading.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Update title
            document.getElementById('modalTitle').textContent = name;
            
            // Load PDF
            const loadingTask = pdfjsLib.getDocument(path);
            this.pdfDoc = await loadingTask.promise;
            this.totalPages = this.pdfDoc.numPages;
            
            // Update UI
            document.getElementById('totalPages').textContent = this.totalPages;
            document.getElementById('pageNumber').max = this.totalPages;
            
            // Load saved position or start from page 1
            const savedPosition = this.getSavedPosition(path);
            this.currentPage = savedPosition || 1;
            
            // Render first page
            await this.renderPage(this.currentPage);
            
            // Add to recent books
            this.addToRecent(name, path);
            
            // Hide loading
            this.loading.style.display = 'none';
            
        } catch (error) {
            console.error('Error loading PDF:', error);
            alert('Error loading PDF: ' + error.message);
            this.closePdf();
        }
    }
    
    async renderPage(pageNum) {
        if (this.rendering) return;
        
        this.rendering = true;
        this.loading.style.display = 'flex';
        
        try {
            const page = await this.pdfDoc.getPage(pageNum);
            
            // Calculate viewport
            let viewport = page.getViewport({ scale: this.scale, rotation: this.rotation });
            
            // Set canvas dimensions
            this.canvas.height = viewport.height;
            this.canvas.width = viewport.width;
            
            // Render page
            const renderContext = {
                canvasContext: this.ctx,
                viewport: viewport
            };
            
            await page.render(renderContext).promise;
            
            // Update UI
            this.currentPage = pageNum;
            document.getElementById('pageNumber').value = pageNum;
            this.updateProgress();
            this.updateNavigationButtons();
            
            // Save position
            this.savePosition(this.currentPdfPath, pageNum);
            
        } catch (error) {
            console.error('Error rendering page:', error);
        } finally {
            this.rendering = false;
            this.loading.style.display = 'none';
        }
    }
    
    previousPage() {
        if (this.currentPage <= 1) return;
        this.renderPage(this.currentPage - 1);
    }
    
    nextPage() {
        if (this.currentPage >= this.totalPages) return;
        this.renderPage(this.currentPage + 1);
    }
    
    goToPage(pageNum) {
        if (pageNum < 1 || pageNum > this.totalPages) return;
        this.renderPage(pageNum);
    }
    
    zoomIn() {
        this.scale += 0.25;
        this.updateZoomLevel();
        if (this.viewMode === 'scroll') {
            this.renderScrollView();
        } else {
            this.renderPage(this.currentPage);
        }
    }
    
    zoomOut() {
        if (this.scale <= 0.5) return;
        this.scale -= 0.25;
        this.updateZoomLevel();
        if (this.viewMode === 'scroll') {
            this.renderScrollView();
        } else {
            this.renderPage(this.currentPage);
        }
    }
    
    async fitWidth() {
        const page = await this.pdfDoc.getPage(this.currentPage);
        const viewport = page.getViewport({ scale: 1 });
        const container = this.viewMode === 'scroll' ? this.scrollView : document.querySelector('.pdf-viewer-container');
        const containerWidth = container.clientWidth - 80;
        this.scale = containerWidth / viewport.width;
        this.updateZoomLevel();
        if (this.viewMode === 'scroll') {
            this.renderScrollView();
        } else {
            this.renderPage(this.currentPage);
        }
    }
    
    async fitPage() {
        const page = await this.pdfDoc.getPage(this.currentPage);
        const viewport = page.getViewport({ scale: 1 });
        const container = this.viewMode === 'scroll' ? this.scrollView : document.querySelector('.pdf-viewer-container');
        const containerWidth = container.clientWidth - 80;
        const containerHeight = container.clientHeight - 80;
        
        const scaleWidth = containerWidth / viewport.width;
        const scaleHeight = containerHeight / viewport.height;
        this.scale = Math.min(scaleWidth, scaleHeight);
        
        this.updateZoomLevel();
        if (this.viewMode === 'scroll') {
            this.renderScrollView();
        } else {
            this.renderPage(this.currentPage);
        }
    }
    
    rotate(degrees) {
        this.rotation = (this.rotation + degrees) % 360;
        if (this.viewMode === 'scroll') {
            this.renderScrollView();
        } else {
            this.renderPage(this.currentPage);
        }
    }
    
    updateZoomLevel() {
        document.getElementById('zoomLevel').textContent = Math.round(this.scale * 100) + '%';
    }
    
    updateProgress() {
        const progress = Math.round((this.currentPage / this.totalPages) * 100);
        document.getElementById('readingProgress').textContent = progress + '%';
    }
    
    updateNavigationButtons() {
        document.getElementById('firstPage').disabled = this.currentPage <= 1;
        document.getElementById('prevPage').disabled = this.currentPage <= 1;
        document.getElementById('nextPage').disabled = this.currentPage >= this.totalPages;
        document.getElementById('lastPage').disabled = this.currentPage >= this.totalPages;
    }
    
    toggleFullscreen() {
        const elem = this.modal;
        const btn = document.getElementById('fullscreenBtn');
        
        if (!document.fullscreenElement) {
            elem.requestFullscreen();
            btn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            btn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }
    
    downloadPdf() {
        const link = document.createElement('a');
        link.href = this.currentPdfPath;
        link.download = this.currentPdfName;
        link.click();
    }
    
    closePdf() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        this.pdfDoc = null;
        this.currentPage = 1;
        this.scale = 1.5;
        this.rotation = 0;
    }
    
    // Bookmarks
    addBookmark() {
        const bookmarks = this.getBookmarks();
        const bookmark = {
            name: this.currentPdfName,
            path: this.currentPdfPath,
            page: this.currentPage,
            date: new Date().toISOString()
        };
        
        bookmarks.push(bookmark);
        localStorage.setItem('pdfBookmarks', JSON.stringify(bookmarks));
        
        // Show feedback
        const btn = document.getElementById('bookmarkBtn');
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 1000);
        
        this.loadBookmarks();
    }
    
    getBookmarks() {
        const stored = localStorage.getItem('pdfBookmarks');
        return stored ? JSON.parse(stored) : [];
    }
    
    loadBookmarks() {
        const bookmarks = this.getBookmarks();
        const list = document.getElementById('bookmarksList');
        
        if (bookmarks.length === 0) {
            list.innerHTML = '<p class="empty-bookmarks">No bookmarks yet</p>';
            return;
        }
        
        list.innerHTML = bookmarks.map(bookmark => `
            <div class="bookmark-item" onclick="pdfViewer.openBookmark('${bookmark.path}', '${bookmark.name}', ${bookmark.page})">
                <h4>${bookmark.name}</h4>
                <p>Page ${bookmark.page} • ${new Date(bookmark.date).toLocaleDateString()}</p>
            </div>
        `).join('');
    }
    
    openBookmark(path, name, page) {
        this.openPdf(path, name).then(() => {
            this.goToPage(page);
        });
    }
    
    // Recent books
    addToRecent(name, path) {
        let recent = this.getRecentBooks();
        
        // Remove if already exists
        recent = recent.filter(item => item.path !== path);
        
        // Add to beginning
        recent.unshift({
            name: name,
            path: path,
            date: new Date().toISOString()
        });
        
        // Keep only last 10
        recent = recent.slice(0, 10);
        
        localStorage.setItem('recentBooks', JSON.stringify(recent));
        this.loadRecentBooks();
    }
    
    getRecentBooks() {
        const stored = localStorage.getItem('recentBooks');
        return stored ? JSON.parse(stored) : [];
    }
    
    loadRecentBooks() {
        const recent = this.getRecentBooks();
        const list = document.getElementById('recentList');
        
        if (recent.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: var(--text-tertiary);">No recent books</p>';
            return;
        }
        
        list.innerHTML = recent.map(item => `
            <div class="recent-item" onclick="pdfViewer.openPdf('${item.path}', '${item.name}')">
                <h4>${item.name}</h4>
                <p>${new Date(item.date).toLocaleDateString()}</p>
            </div>
        `).join('');
    }
    
    // Save/load reading position
    savePosition(path, page) {
        const positions = this.getSavedPositions();
        positions[path] = page;
        localStorage.setItem('pdfPositions', JSON.stringify(positions));
    }
    
    getSavedPosition(path) {
        const positions = this.getSavedPositions();
        return positions[path] || null;
    }
    
    getSavedPositions() {
        const stored = localStorage.getItem('pdfPositions');
        return stored ? JSON.parse(stored) : {};
    }
}

// Initialize PDF Viewer
let pdfViewer;
document.addEventListener('DOMContentLoaded', () => {
    pdfViewer = new PDFViewer();
    
    // Close modal
    document.getElementById('modalClose').addEventListener('click', () => {
        pdfViewer.closePdf();
    });
    
    // Close on background click
    document.getElementById('pdfModal').addEventListener('click', (e) => {
        if (e.target.id === 'pdfModal') {
            pdfViewer.closePdf();
        }
    });
});
