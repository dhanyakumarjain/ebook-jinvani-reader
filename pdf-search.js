// ========================================
// PDF SEARCH FUNCTIONALITY
// ========================================

class PDFSearch {
    constructor(pdfViewer) {
        this.pdfViewer = pdfViewer;
        this.searchResults = [];
        this.currentResultIndex = -1;
        this.searchPanel = document.getElementById('searchPanel');
        this.searchInput = document.getElementById('pdfSearchInput');
        this.searchResultsContainer = document.getElementById('searchResults');
        
        this.initializeSearch();
    }
    
    initializeSearch() {
        // Search button in PDF controls
        const searchBtn = document.getElementById('searchPdfBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.toggleSearchPanel());
        }
        
        // Close search panel
        const closeBtn = document.getElementById('closeSearch');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeSearchPanel());
        }
        
        // Search input
        if (this.searchInput) {
            this.searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }
        
        // Search button
        const searchInPdfBtn = document.getElementById('searchInPdf');
        if (searchInPdfBtn) {
            searchInPdfBtn.addEventListener('click', () => this.performSearch());
        }
    }
    
    toggleSearchPanel() {
        this.searchPanel.classList.toggle('active');
        if (this.searchPanel.classList.contains('active')) {
            this.searchInput.focus();
        }
    }
    
    closeSearchPanel() {
        this.searchPanel.classList.remove('active');
        this.clearSearch();
    }
    
    async performSearch() {
        const query = this.searchInput.value.trim();
        if (!query || !this.pdfViewer.pdfDoc) {
            return;
        }
        
        this.searchResultsContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>Searching...</p></div>';
        this.searchResults = [];
        
        try {
            const caseSensitive = document.getElementById('caseSensitiveSearch').checked;
            const wholeWord = document.getElementById('wholeWordSearch').checked;
            
            // Search through all pages
            for (let pageNum = 1; pageNum <= this.pdfViewer.totalPages; pageNum++) {
                const page = await this.pdfViewer.pdfDoc.getPage(pageNum);
                const textContent = await page.getTextContent();
                
                // Extract text
                const pageText = textContent.items.map(item => item.str).join(' ');
                
                // Perform search
                const results = this.searchInText(pageText, query, caseSensitive, wholeWord);
                
                if (results.length > 0) {
                    results.forEach(result => {
                        this.searchResults.push({
                            pageNum: pageNum,
                            text: result.text,
                            context: result.context,
                            index: result.index
                        });
                    });
                }
            }
            
            this.displaySearchResults();
            
        } catch (error) {
            console.error('Search error:', error);
            this.searchResultsContainer.innerHTML = '<p class="search-placeholder">Error performing search</p>';
        }
    }
    
    searchInText(text, query, caseSensitive, wholeWord) {
        const results = [];
        let searchText = caseSensitive ? text : text.toLowerCase();
        let searchQuery = caseSensitive ? query : query.toLowerCase();
        
        if (wholeWord) {
            searchQuery = `\\b${searchQuery}\\b`;
        }
        
        const regex = new RegExp(searchQuery, caseSensitive ? 'g' : 'gi');
        let match;
        
        while ((match = regex.exec(searchText)) !== null) {
            const start = Math.max(0, match.index - 50);
            const end = Math.min(text.length, match.index + query.length + 50);
            const context = text.substring(start, end);
            
            results.push({
                text: match[0],
                context: context,
                index: match.index
            });
        }
        
        return results;
    }
    
    displaySearchResults() {
        if (this.searchResults.length === 0) {
            this.searchResultsContainer.innerHTML = '<p class="search-placeholder">No results found</p>';
            return;
        }
        
        const query = this.searchInput.value.trim();
        const caseSensitive = document.getElementById('caseSensitiveSearch').checked;
        
        let html = `<div style="margin-bottom: 1rem; color: var(--text-secondary);">
            <strong>${this.searchResults.length}</strong> result${this.searchResults.length > 1 ? 's' : ''} found
        </div>`;
        
        this.searchResults.forEach((result, index) => {
            const highlightedContext = this.highlightText(result.context, query, caseSensitive);
            
            html += `
                <div class="search-result-item" onclick="pdfSearch.goToResult(${index})">
                    <div class="search-result-page">Page ${result.pageNum}</div>
                    <div class="search-result-text">${highlightedContext}</div>
                </div>
            `;
        });
        
        this.searchResultsContainer.innerHTML = html;
    }
    
    highlightText(text, query, caseSensitive) {
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(`(${query})`, flags);
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    goToResult(index) {
        if (index < 0 || index >= this.searchResults.length) return;
        
        this.currentResultIndex = index;
        const result = this.searchResults[index];
        
        // Navigate to the page
        this.pdfViewer.goToPage(result.pageNum);
        
        // Highlight active result
        const resultItems = document.querySelectorAll('.search-result-item');
        resultItems.forEach((item, i) => {
            if (i === index) {
                item.style.background = 'var(--accent-primary)';
                item.style.color = 'white';
            } else {
                item.style.background = 'var(--bg-tertiary)';
                item.style.color = 'var(--text-primary)';
            }
        });
    }
    
    clearSearch() {
        this.searchInput.value = '';
        this.searchResults = [];
        this.currentResultIndex = -1;
        this.searchResultsContainer.innerHTML = '<p class="search-placeholder">Enter text to search...</p>';
    }
    
    nextResult() {
        if (this.searchResults.length === 0) return;
        this.currentResultIndex = (this.currentResultIndex + 1) % this.searchResults.length;
        this.goToResult(this.currentResultIndex);
    }
    
    previousResult() {
        if (this.searchResults.length === 0) return;
        this.currentResultIndex = (this.currentResultIndex - 1 + this.searchResults.length) % this.searchResults.length;
        this.goToResult(this.currentResultIndex);
    }
}

// Initialize search when PDF viewer is ready
let pdfSearch;
document.addEventListener('DOMContentLoaded', () => {
    // Wait for pdfViewer to be initialized
    const checkViewer = setInterval(() => {
        if (typeof pdfViewer !== 'undefined') {
            pdfSearch = new PDFSearch(pdfViewer);
            clearInterval(checkViewer);
        }
    }, 100);
});
