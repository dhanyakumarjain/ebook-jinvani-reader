// ========================================
// LANDING PAGE FUNCTIONALITY
// ======================================== 

class LandingPage {
    constructor() {
        this.init();
    }
    
    init() {
        this.loadContinueReading();
        this.loadRecentBooks();
        this.updateStats();
    }
    
    // Load Continue Reading section
    loadContinueReading() {
        const positions = JSON.parse(localStorage.getItem('pdfPositions') || '{}');
        const recentBooks = JSON.parse(localStorage.getItem('recentBooks') || '[]');
        
        if (recentBooks.length === 0) {
            document.getElementById('continueReadingSection').style.display = 'none';
            return;
        }
        
        // Get the most recent book
        const lastBook = recentBooks[0];
        const currentPage = positions[lastBook.path] || 1;
        
        // Estimate total pages (we'll update this when PDF loads)
        const totalPages = this.getEstimatedPages(lastBook.path);
        const progress = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;
        
        const continueCard = document.getElementById('continueReadingCard');
        continueCard.innerHTML = `
            <div class="book-cover">
                <i class="fas fa-book-open"></i>
            </div>
            <div class="book-info">
                <h3 class="book-title">${this.escapeHtml(lastBook.name)}</h3>
                <div class="book-meta">
                    <span>
                        <i class="fas fa-file-pdf"></i>
                        Page ${currentPage}${totalPages > 0 ? ` of ${totalPages}` : ''}
                    </span>
                    <span>
                        <i class="fas fa-clock"></i>
                        ${this.formatDate(lastBook.date)}
                    </span>
                </div>
                <div class="progress-container">
                    <div class="progress-label">
                        <span>Reading Progress</span>
                        <span><strong>${progress}%</strong></span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                <button class="resume-button" onclick="landingPage.resumeReading('${this.escapeHtml(lastBook.path)}', '${this.escapeHtml(lastBook.name)}')">
                    <i class="fas fa-play"></i>
                    Resume Reading
                </button>
            </div>
        `;
        
        document.getElementById('continueReadingSection').style.display = 'block';
    }
    
    // Load Recent Books carousel
    loadRecentBooks() {
        const recentBooks = JSON.parse(localStorage.getItem('recentBooks') || '[]');
        
        if (recentBooks.length === 0) {
            document.getElementById('recentBooksSection').style.display = 'none';
            return;
        }
        
        const carousel = document.getElementById('recentBooksCarousel');
        carousel.innerHTML = recentBooks.map(book => `
            <div class="recent-book-card" onclick="landingPage.openBook('${this.escapeHtml(book.path)}', '${this.escapeHtml(book.name)}')">
                <div class="recent-book-thumbnail">
                    <i class="fas fa-book"></i>
                </div>
                <h4 class="recent-book-title">${this.escapeHtml(book.name)}</h4>
                <div class="recent-book-date">
                    <i class="fas fa-calendar-alt"></i>
                    ${this.formatDate(book.date)}
                </div>
            </div>
        `).join('');
        
        document.getElementById('recentBooksSection').style.display = 'block';
    }
    
    // Update stats
    updateStats() {
        // Total PDFs
        const totalPdfsElement = document.getElementById('totalPdfs');
        if (totalPdfsElement && window.allPdfs) {
            totalPdfsElement.textContent = window.allPdfs.length || 0;
        }
        
        // Total Bookmarks
        const bookmarks = JSON.parse(localStorage.getItem('pdfBookmarks') || '[]');
        const totalBookmarksElement = document.getElementById('totalBookmarks');
        if (totalBookmarksElement) {
            totalBookmarksElement.textContent = bookmarks.length;
        }
        
        // Recent Count
        const recentBooks = JSON.parse(localStorage.getItem('recentBooks') || '[]');
        const recentCountElement = document.getElementById('recentCount');
        if (recentCountElement) {
            recentCountElement.textContent = recentBooks.length;
        }
    }
    
    // Resume reading
    resumeReading(path, name) {
        if (typeof pdfViewer !== 'undefined') {
            pdfViewer.openPdf(path, name);
        }
    }
    
    // Open book
    openBook(path, name) {
        if (typeof pdfViewer !== 'undefined') {
            pdfViewer.openPdf(path, name);
        }
    }
    
    // Get estimated pages (from cache or default)
    getEstimatedPages(path) {
        const pagesCache = JSON.parse(localStorage.getItem('pdfPagesCache') || '{}');
        return pagesCache[path] || 0;
    }
    
    // Cache total pages when PDF is loaded
    cacheTotalPages(path, totalPages) {
        const pagesCache = JSON.parse(localStorage.getItem('pdfPagesCache') || '{}');
        pagesCache[path] = totalPages;
        localStorage.setItem('pdfPagesCache', JSON.stringify(pagesCache));
    }
    
    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Refresh landing page
    refresh() {
        this.loadContinueReading();
        this.loadRecentBooks();
        this.updateStats();
    }
}

// Carousel scroll function
function scrollCarousel(direction) {
    const carousel = document.getElementById('recentBooksCarousel');
    const scrollAmount = 300;
    
    if (direction === 'left') {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// Scroll to Continue Reading section
function scrollToContinueReading() {
    const section = document.getElementById('continueReadingSection');
    if (section && section.style.display !== 'none') {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        // If no continue reading, show recent books
        const recentSection = document.getElementById('recentBooksSection');
        if (recentSection && recentSection.style.display !== 'none') {
            recentSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // If nothing to show, focus search
            document.getElementById('searchInput').focus();
        }
    }
}

// Initialize landing page
let landingPage;
document.addEventListener('DOMContentLoaded', () => {
    landingPage = new LandingPage();
    
    // Refresh landing page when returning from PDF viewer
    document.addEventListener('pdfClosed', () => {
        if (landingPage) {
            landingPage.refresh();
        }
    });
});

// Hook into PDF viewer to cache total pages
if (typeof PDFViewer !== 'undefined') {
    const originalOpenPdf = PDFViewer.prototype.openPdf;
    PDFViewer.prototype.openPdf = async function(path, name) {
        const result = await originalOpenPdf.call(this, path, name);
        
        // Cache total pages
        if (this.totalPages && landingPage) {
            landingPage.cacheTotalPages(path, this.totalPages);
        }
        
        return result;
    };
    
    const originalClosePdf = PDFViewer.prototype.closePdf;
    PDFViewer.prototype.closePdf = function() {
        originalClosePdf.call(this);
        
        // Dispatch event to refresh landing page
        document.dispatchEvent(new Event('pdfClosed'));
    };
}
