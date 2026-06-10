// ========================================
// ENHANCED PDF VIEWER
// ========================================

class PDFViewer {
    constructor() {
        console.log('PDFViewer constructor called');
        
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
        if (!this.canvas) {
            console.error('pdfCanvas element not found!');
            throw new Error('PDF Canvas element not found');
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.modal = document.getElementById('pdfModal');
        this.loading = document.getElementById('pdfLoading');
        this.scrollLoading = document.getElementById('scrollLoading');
        this.singlePageView = document.getElementById('singlePageView');
        this.scrollView = document.getElementById('scrollView');
        this.pagesContainer = document.getElementById('pagesContainer');
        
        console.log('DOM elements loaded:', {
            canvas: !!this.canvas,
            modal: !!this.modal,
            loading: !!this.loading,
            scrollLoading: !!this.scrollLoading,
            singlePageView: !!this.singlePageView,
            scrollView: !!this.scrollView,
            pagesContainer: !!this.pagesContainer
        });
        
        this.initializeControls();
        this.loadBookmarks();
        this.loadRecentBooks();
        
        console.log('PDFViewer initialized successfully');
    }
    
    initializeControls() {
        // Helper function to add both click and touch events for mobile compatibility
        const addButtonEvent = (btn, handler) => {
            if (!btn) return;
            
            // Prevent double-firing on devices that support both
            let touchHandled = false;
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                touchHandled = true;
                handler();
                setTimeout(() => { touchHandled = false; }, 300);
            }, { passive: false });
            
            btn.addEventListener('click', (e) => {
                if (!touchHandled) {
                    handler();
                }
            });
        };
        
        // View mode toggle
        const toggleViewModeBtn = document.getElementById('toggleViewMode');
        addButtonEvent(toggleViewModeBtn, () => this.toggleViewMode());
        
        // More controls toggle (mobile)
        const moreBtn = document.getElementById('moreControls');
        const secondaryControls = document.getElementById('secondaryControls');
        if (moreBtn && secondaryControls) {
            addButtonEvent(moreBtn, () => {
                secondaryControls.classList.toggle('active');
                const icon = moreBtn.querySelector('i');
                if (icon) {
                    icon.className = secondaryControls.classList.contains('active') 
                        ? 'fas fa-times' 
                        : 'fas fa-ellipsis-v';
                }
            });
        }
        
        // Page navigation
        const firstPageBtn = document.getElementById('firstPage');
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const lastPageBtn = document.getElementById('lastPage');
        const pageNumberInput = document.getElementById('pageNumber');
        
        // Bottom navigation arrows
        const bottomPrevBtn = document.getElementById('bottomPrevPage');
        const bottomNextBtn = document.getElementById('bottomNextPage');
        const bottomFirstBtn = document.getElementById('bottomFirstPage');
        const bottomLastBtn = document.getElementById('bottomLastPage');
        
        addButtonEvent(firstPageBtn, () => this.goToPage(1));
        addButtonEvent(prevPageBtn, () => this.previousPage());
        addButtonEvent(nextPageBtn, () => this.nextPage());
        addButtonEvent(lastPageBtn, () => this.goToPage(this.totalPages));
        
        // Bottom navigation
        addButtonEvent(bottomPrevBtn, () => this.previousPage());
        addButtonEvent(bottomNextBtn, () => this.nextPage());
        addButtonEvent(bottomFirstBtn, () => this.goToPage(1));
        addButtonEvent(bottomLastBtn, () => this.goToPage(this.totalPages));
        
        if (pageNumberInput) {
            pageNumberInput.addEventListener('change', (e) => {
                this.goToPage(parseInt(e.target.value));
            });
        }
        
        // Zoom controls - CRITICAL FOR MOBILE
        const zoomInBtn = document.getElementById('zoomIn');
        const zoomOutBtn = document.getElementById('zoomOut');
        const fitWidthBtn = document.getElementById('fitWidth');
        const fitPageBtn = document.getElementById('fitPage');
        
        addButtonEvent(zoomInBtn, () => this.zoomIn());
        addButtonEvent(zoomOutBtn, () => this.zoomOut());
        addButtonEvent(fitWidthBtn, () => this.fitWidth());
        addButtonEvent(fitPageBtn, () => this.fitPage());
        
        // Rotation
        const rotateLeftBtn = document.getElementById('rotateLeft');
        const rotateRightBtn = document.getElementById('rotateRight');
        
        addButtonEvent(rotateLeftBtn, () => this.rotate(-90));
        addButtonEvent(rotateRightBtn, () => this.rotate(90));
        
        // Other controls
        const downloadPdfBtn = document.getElementById('downloadPdf');
        const bookmarkPageBtn = document.getElementById('bookmarkPageBtn');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const searchPdfBtn = document.getElementById('searchPdfBtn');
        const closeSearchBtn = document.getElementById('closeSearch');
        
        addButtonEvent(downloadPdfBtn, () => this.downloadPdf());
        if (bookmarkPageBtn) {
            addButtonEvent(bookmarkPageBtn, () => this.addBookmark());
            bookmarkPageBtn.title = 'Bookmark This Page (B)';
        }
        addButtonEvent(fullscreenBtn, () => this.toggleFullscreen());
        if (searchPdfBtn) {
            addButtonEvent(searchPdfBtn, () => {
                console.log('Search button clicked!');
                const searchPanel = document.getElementById('searchPanel');
                if (searchPanel) {
                    searchPanel.classList.toggle('active');
                    console.log('Search panel toggled, active:', searchPanel.classList.contains('active'));
                } else {
                    console.error('Search panel not found!');
                }
            });
        }
        
        // Close search panel button
        if (closeSearchBtn) {
            addButtonEvent(closeSearchBtn, () => {
                const searchPanel = document.getElementById('searchPanel');
                if (searchPanel) {
                    searchPanel.classList.remove('active');
                }
            });
        }
        
        // Scroll detection for scroll mode
        if (this.scrollView) {
            this.scrollView.addEventListener('scroll', () => this.handleScroll());
        }
        
        // Touch gestures for mobile
        this.initializeTouchGestures();
        
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
        
        console.log('Controls initialized successfully');
    }
    
    initializeTouchGestures() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        // Pinch to zoom variables
        let initialDistance = 0;
        let currentScale = this.scale;
        
        const handleSwipe = () => {
            if (this.viewMode !== 'single') return;
            
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next page
                    this.nextPage();
                } else {
                    // Swipe right - previous page
                    this.previousPage();
                }
            }
        };
        
        // Swipe gestures
        this.singlePageView.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.changedTouches[0].screenX;
            } else if (e.touches.length === 2) {
                // Pinch zoom start
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                initialDistance = Math.hypot(
                    touch2.pageX - touch1.pageX,
                    touch2.pageY - touch1.pageY
                );
                currentScale = this.scale;
            }
        });
        
        this.singlePageView.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.hypot(
                    touch2.pageX - touch1.pageX,
                    touch2.pageY - touch1.pageY
                );
                
                if (initialDistance > 0) {
                    const scaleChange = currentDistance / initialDistance;
                    this.scale = Math.max(0.5, Math.min(5, currentScale * scaleChange));
                    this.updateZoomLevel();
                }
            }
        }, { passive: false });
        
        this.singlePageView.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1 && e.touches.length === 0) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            } else if (e.touches.length === 0 && initialDistance > 0) {
                // Pinch zoom end - re-render with new scale
                initialDistance = 0;
                this.renderPage(this.currentPage);
            }
        });
    }
    
    toggleViewMode() {
        this.viewMode = this.viewMode === 'single' ? 'scroll' : 'single';
        
        const btn = document.getElementById('toggleViewMode');
        const icon = btn.querySelector('i');
        
        if (this.viewMode === 'scroll') {
            this.singlePageView.style.display = 'none';
            this.scrollView.style.display = 'block';
            icon.className = 'fas fa-file';
            btn.title = 'Single Page Mode';
            this.renderScrollView();
        } else {
            this.singlePageView.style.display = 'flex';
            this.scrollView.style.display = 'none';
            icon.className = 'fas fa-th-list';
            btn.title = 'Scroll Mode';
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
            console.log('=== Opening NEW PDF ===');
            console.log('Path:', path);
            console.log('Name:', name);
            
            // Close sidebar on mobile when opening PDF
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) {
                    sidebar.classList.remove('active');
                }
            }
            
            // FORCE close any existing PDF
            if (this.pdfDoc) {
                console.log('Destroying previous PDF document');
                try {
                    await this.pdfDoc.destroy();
                } catch (e) {
                    console.log('Error destroying PDF:', e);
                }
                this.pdfDoc = null;
            }
            
            // FORCE clear canvas completely
            if (this.ctx && this.canvas) {
                console.log('Clearing canvas');
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.canvas.width = 0;
                this.canvas.height = 0;
            }
            
            // Clear scroll view if in scroll mode
            if (this.pagesContainer) {
                this.pagesContainer.innerHTML = '';
            }
            this.renderedPages.clear();
            
            // FORCE reset ALL state
            this.currentPage = 1;
            this.totalPages = 0;
            this.scale = 1.5;
            this.rotation = 0;
            this.rendering = false;
            this.viewMode = 'single';
            
            this.currentPdfPath = path;
            this.currentPdfName = name;
            
            // Ensure single page view is active
            if (this.singlePageView) {
                this.singlePageView.style.display = 'flex';
            }
            if (this.scrollView) {
                this.scrollView.style.display = 'none';
            }
            
            // Show modal and loading
            this.modal.classList.add('active');
            this.loading.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Show Add Bookmark button in header
            const addBookmarkHeaderBtn = document.getElementById('addBookmarkHeaderBtn');
            if (addBookmarkHeaderBtn) {
                addBookmarkHeaderBtn.style.display = 'flex';
            }
            
            // Update title
            document.getElementById('modalTitle').textContent = name;
            
            // Reset page display
            document.getElementById('pageNumber').value = 1;
            document.getElementById('totalPages').textContent = '0';
            
            console.log('Loading NEW PDF from:', path);
            
            // Load PDF with STRONG cache-busting and clear worker cache
            const cacheBuster = Date.now() + Math.random();
            
            // Clear PDF.js internal cache
            if (typeof pdfjsLib !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
                console.log('Clearing PDF.js cache');
            }
            
            const loadingTask = pdfjsLib.getDocument({
                url: path + '?nocache=' + cacheBuster,
                cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
                cMapPacked: true,
                disableAutoFetch: true,  // Changed to true to force fresh load
                disableStream: true,      // Changed to true to force fresh load
                disableRange: true,       // Changed to true to force fresh load
                isEvalSupported: false,
                useSystemFonts: false
            });
            
            this.pdfDoc = await loadingTask.promise;
            this.totalPages = this.pdfDoc.numPages;
            
            console.log('NEW PDF loaded successfully!');
            console.log('Total pages:', this.totalPages);
            console.log('PDF fingerprint:', this.pdfDoc.fingerprints);
            
            // Update UI
            document.getElementById('totalPages').textContent = this.totalPages;
            document.getElementById('pageNumber').max = this.totalPages;
            document.getElementById('zoomLevel').textContent = '150%';
            
            // Always start from page 1 for library books (ignore saved position)
            this.currentPage = 1;
            
            console.log('Rendering page 1 of NEW PDF');
            
            // Render first page
            await this.renderPage(1);
            
            // Add to recent books
            this.addToRecent(name, path);
            
            // Hide loading
            this.loading.style.display = 'none';
            
            console.log('=== NEW PDF opened successfully ===');
            
        } catch (error) {
            console.error('!!! Error loading PDF !!!', error);
            alert('Error loading PDF: ' + error.message);
            this.closePdf();
        }
    }
    
    async renderPage(pageNum) {
        if (this.rendering) {
            console.log('Already rendering, waiting...');
            // Wait a bit and try again
            await new Promise(resolve => setTimeout(resolve, 100));
            if (this.rendering) {
                console.log('Still rendering, skipping...');
                return;
            }
        }
        
        this.rendering = true;
        this.loading.style.display = 'flex';
        
        try {
            console.log('Rendering page:', pageNum, 'of', this.totalPages, 'at scale:', this.scale);
            
            const page = await this.pdfDoc.getPage(pageNum);
            
            // Calculate viewport with current scale and rotation
            let viewport = page.getViewport({ scale: this.scale, rotation: this.rotation });
            
            console.log('Viewport dimensions:', viewport.width, 'x', viewport.height);
            
            // Clear canvas before rendering
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Set canvas dimensions
            this.canvas.height = viewport.height;
            this.canvas.width = viewport.width;
            
            console.log('Canvas dimensions set to:', this.canvas.width, 'x', this.canvas.height);
            
            // Render page
            const renderContext = {
                canvasContext: this.ctx,
                viewport: viewport
            };
            
            await page.render(renderContext).promise;
            
            console.log('Page rendered successfully at', Math.round(this.scale * 100) + '%');
            
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
        if (this.viewMode === 'scroll') {
            this.goToPage(this.currentPage - 1);
        } else {
            this.renderPage(this.currentPage - 1);
        }
    }
    
    nextPage() {
        if (this.currentPage >= this.totalPages) return;
        if (this.viewMode === 'scroll') {
            this.goToPage(this.currentPage + 1);
        } else {
            this.renderPage(this.currentPage + 1);
        }
    }
    
    zoomIn() {
        console.log('=== ZOOM IN TRIGGERED ===');
        console.log('Current scale:', this.scale);
        console.log('View mode:', this.viewMode);
        console.log('Has PDF:', !!this.pdfDoc);
        
        if (!this.pdfDoc) {
            console.error('No PDF loaded!');
            this.showToast('Please open a PDF first', 'error');
            return;
        }
        
        this.scale += 0.25;
        console.log('New scale:', this.scale);
        
        this.updateZoomLevel();
        
        if (this.viewMode === 'scroll') {
            console.log('Rendering scroll view...');
            this.renderScrollView();
        } else {
            console.log('Rendering single page...');
            this.renderPage(this.currentPage);
        }
        
        // Visual feedback for mobile
        this.showToast(`Zoom: ${Math.round(this.scale * 100)}%`, 'info');
    }
    
    zoomOut() {
        console.log('=== ZOOM OUT TRIGGERED ===');
        console.log('Current scale:', this.scale);
        console.log('View mode:', this.viewMode);
        console.log('Has PDF:', !!this.pdfDoc);
        
        if (!this.pdfDoc) {
            console.error('No PDF loaded!');
            this.showToast('Please open a PDF first', 'error');
            return;
        }
        
        if (this.scale <= 0.5) {
            console.log('Already at minimum zoom (50%)');
            this.showToast('Minimum zoom reached (50%)', 'info');
            return;
        }
        
        this.scale -= 0.25;
        console.log('New scale:', this.scale);
        
        this.updateZoomLevel();
        
        if (this.viewMode === 'scroll') {
            console.log('Rendering scroll view...');
            this.renderScrollView();
        } else {
            console.log('Rendering single page...');
            this.renderPage(this.currentPage);
        }
        
        // Visual feedback for mobile
        this.showToast(`Zoom: ${Math.round(this.scale * 100)}%`, 'info');
    }
    
    async fitWidth() {
        const page = await this.pdfDoc.getPage(this.currentPage);
        const viewport = page.getViewport({ scale: 1 });
        const container = this.viewMode === 'scroll' ? this.scrollView : document.querySelector('.pdf-viewer-container');
        const containerWidth = container.clientWidth - 16;
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
        const containerWidth = container.clientWidth - 16;
        const containerHeight = container.clientHeight - 16;
        
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
        const zoomLevelElement = document.getElementById('zoomLevel');
        if (zoomLevelElement) {
            zoomLevelElement.textContent = Math.round(this.scale * 100) + '%';
        }
        // Also log to console for debugging
        console.log('Zoom level:', Math.round(this.scale * 100) + '%');
    }
    
    updateProgress() {
        const progress = Math.round((this.currentPage / this.totalPages) * 100);
        document.getElementById('readingProgress').textContent = progress + '%';
    }
    
    updateNavigationButtons() {
        // Top navigation buttons
        const firstPageBtn = document.getElementById('firstPage');
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const lastPageBtn = document.getElementById('lastPage');
        
        // Bottom navigation buttons
        const bottomPrevBtn = document.getElementById('bottomPrevPage');
        const bottomNextBtn = document.getElementById('bottomNextPage');
        const bottomFirstBtn = document.getElementById('bottomFirstPage');
        const bottomLastBtn = document.getElementById('bottomLastPage');
        
        const isFirstPage = this.currentPage <= 1;
        const isLastPage = this.currentPage >= this.totalPages;
        
        // Update top buttons
        if (firstPageBtn) firstPageBtn.disabled = isFirstPage;
        if (prevPageBtn) prevPageBtn.disabled = isFirstPage;
        if (nextPageBtn) nextPageBtn.disabled = isLastPage;
        if (lastPageBtn) lastPageBtn.disabled = isLastPage;
        
        // Update bottom buttons
        if (bottomPrevBtn) {
            bottomPrevBtn.disabled = isFirstPage;
            bottomPrevBtn.style.opacity = isFirstPage ? '0.4' : '1';
        }
        if (bottomNextBtn) {
            bottomNextBtn.disabled = isLastPage;
            bottomNextBtn.style.opacity = isLastPage ? '0.4' : '1';
        }
        if (bottomFirstBtn) {
            bottomFirstBtn.disabled = isFirstPage;
            bottomFirstBtn.style.opacity = isFirstPage ? '0.4' : '1';
        }
        if (bottomLastBtn) {
            bottomLastBtn.disabled = isLastPage;
            bottomLastBtn.style.opacity = isLastPage ? '0.4' : '1';
        }
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
    
    toggleBookmarksPanel() {
        const panel = document.getElementById('bookmarksPanel');
        if (panel) {
            const isActive = panel.classList.contains('active');
            if (isActive) {
                panel.classList.remove('active');
            } else {
                panel.classList.add('active');
                // Refresh bookmarks list
                this.loadBookmarks();
            }
        }
    }
    
    downloadPdf() {
        const link = document.createElement('a');
        link.href = this.currentPdfPath;
        link.download = this.currentPdfName;
        link.click();
    }
    
    closePdf() {
        console.log('Closing PDF...');
        
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        this.pdfDoc = null;
        this.currentPage = 1;
        this.scale = 1.5;
        this.rotation = 0;
        
        // Reset page display
        const pageNumberInput = document.getElementById('pageNumber');
        const totalPagesSpan = document.getElementById('totalPages');
        if (pageNumberInput) pageNumberInput.value = 1;
        if (totalPagesSpan) totalPagesSpan.textContent = '0';
        
        // Hide Add Bookmark button in header
        const addBookmarkHeaderBtn = document.getElementById('addBookmarkHeaderBtn');
        if (addBookmarkHeaderBtn) {
            addBookmarkHeaderBtn.style.display = 'none';
        }
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('active');
            }
        }
        
        // ALWAYS return to clean home page
        // Hide any library listings or bookmark sections
        const welcomeScreen = document.getElementById('welcomeScreen');
        const bookmarksSection = document.getElementById('homeBookmarksSection');
        const pdfGrid = document.getElementById('pdfGrid');
        
        // Show only welcome screen
        if (welcomeScreen) {
            welcomeScreen.style.display = 'flex';
        }
        
        // Hide bookmarks section
        if (bookmarksSection) {
            bookmarksSection.style.display = 'none';
        }
        
        // Remove any PDF cards from library view
        if (pdfGrid) {
            const pdfCards = pdfGrid.querySelectorAll('.pdf-card:not(.bookmark-card)');
            pdfCards.forEach(card => card.remove());
        }
        
        // Reset view bookmarks button
        const viewBookmarksBtn = document.getElementById('viewBookmarksBtn');
        if (viewBookmarksBtn) {
            viewBookmarksBtn.innerHTML = '<i class="far fa-bookmark"></i><span>View Bookmarks</span>';
        }
        
        // Hide empty state
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        console.log('PDF closed, returned to clean home page');
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
        
        // Show user-friendly feedback on bookmark button in panel
        const btn = document.getElementById('bookmarkPageBtn');
        if (btn) {
            const originalBg = btn.style.background;
            const originalColor = btn.style.color;
            const originalBorder = btn.style.borderColor;
            
            // Change to green with checkmark
            btn.innerHTML = '<i class="fas fa-check"></i><span class="btn-label">Bookmarked!</span>';
            btn.style.background = '#10b981';
            btn.style.color = 'white';
            btn.style.borderColor = '#10b981';
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-bookmark"></i><span class="btn-label">Bookmark</span>';
                btn.style.background = originalBg;
                btn.style.color = originalColor;
                btn.style.borderColor = originalBorder;
            }, 2000);
        }
        
        // Show user-friendly feedback on header button
        const headerBtn = document.getElementById('addBookmarkHeaderBtn');
        if (headerBtn) {
            const originalHTML = headerBtn.innerHTML;
            const originalBg = headerBtn.style.background;
            const originalColor = headerBtn.style.color;
            const originalBorder = headerBtn.style.borderColor;
            
            headerBtn.innerHTML = '<i class="fas fa-check"></i><span>Bookmarked!</span>';
            headerBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            headerBtn.style.color = 'white';
            headerBtn.style.borderColor = '#10b981';
            
            setTimeout(() => {
                headerBtn.innerHTML = originalHTML;
                headerBtn.style.background = originalBg;
                headerBtn.style.color = originalColor;
                headerBtn.style.borderColor = originalBorder;
            }, 2000);
        }
        
        // Show toast notification
        this.showToast(`✓ Bookmarked: Page ${this.currentPage}`, 'success');
        
        this.loadBookmarks();
        
        console.log('Bookmark added:', bookmark);
    }
    
    getBookmarks() {
        const stored = localStorage.getItem('pdfBookmarks');
        return stored ? JSON.parse(stored) : [];
    }
    
    // Show toast notification
    showToast(message, type = 'info') {
        // Remove existing toast if any
        const existingToast = document.querySelector('.pdf-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `pdf-toast pdf-toast-${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    loadBookmarks() {
        const bookmarks = this.getBookmarks();
        const list = document.getElementById('bookmarksList');
        
        if (!list) {
            console.warn('bookmarksList element not found');
            return;
        }
        
        if (bookmarks.length === 0) {
            list.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-tertiary);">
                    <i class="fas fa-bookmark" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>No bookmarks yet</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;">Click the bookmark button while reading to save pages</p>
                </div>
            `;
            return;
        }
        
        list.innerHTML = bookmarks.map((bookmark, index) => `
            <div class="bookmark-item" onclick="pdfViewer.openBookmark('${this.escapeHtml(bookmark.path)}', '${this.escapeHtml(bookmark.name)}', ${bookmark.page})">
                <div class="bookmark-header">
                    <h4><i class="fas fa-book"></i> ${this.escapeHtml(bookmark.name)}</h4>
                    <button class="delete-bookmark" onclick="event.stopPropagation(); pdfViewer.deleteBookmark(${index})" title="Delete bookmark">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <p class="bookmark-info">
                    <span><i class="fas fa-file-pdf"></i> Page ${bookmark.page}</span>
                    <span><i class="fas fa-calendar"></i> ${new Date(bookmark.date).toLocaleDateString()}</span>
                </p>
            </div>
        `).join('');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    deleteBookmark(index) {
        const bookmarks = this.getBookmarks();
        bookmarks.splice(index, 1);
        localStorage.setItem('pdfBookmarks', JSON.stringify(bookmarks));
        this.loadBookmarks();
        this.showToast('Bookmark deleted', 'info');
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
        
        if (!list) {
            console.warn('recentList element not found');
            return;
        }
        
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
    console.log('Initializing PDF Viewer...');
    
    // Check if PDF.js is loaded
    if (typeof pdfjsLib === 'undefined') {
        console.error('PDF.js library not loaded!');
        alert('PDF.js library failed to load. Please check your internet connection and refresh the page.');
        return;
    }
    
    console.log('PDF.js loaded successfully');
    
    try {
        pdfViewer = new PDFViewer();
        console.log('PDF Viewer initialized successfully');
        
        // Make it globally accessible for debugging
        window.pdfViewer = pdfViewer;
    } catch (error) {
        console.error('Error initializing PDF Viewer:', error);
        alert('Failed to initialize PDF Viewer: ' + error.message);
    }
    
    // Close modal with touch support
    const closeBtn = document.getElementById('modalClose');
    if (!closeBtn) {
        console.error('Close button not found!');
        return;
    }
    
    let touchHandled = false;
    
    closeBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        touchHandled = true;
        if (pdfViewer) pdfViewer.closePdf();
        setTimeout(() => { touchHandled = false; }, 300);
    });
    
    closeBtn.addEventListener('click', () => {
        if (!touchHandled && pdfViewer) {
            pdfViewer.closePdf();
        }
    });
    
    // Close on background click
    const modal = document.getElementById('pdfModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'pdfModal' && pdfViewer) {
                pdfViewer.closePdf();
            }
        });
    }
});
