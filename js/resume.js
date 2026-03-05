// --- View Mode Controller ---
const body = document.body;
const btnBook = document.getElementById('btnBook');
const btnClassic = document.getElementById('btnClassic');
const backToTopBtn = document.getElementById('backToTop');

function setViewMode(mode) {
    if (mode === 'classic') {
        body.classList.add('view-classic');
        btnClassic.classList.add('active');
        btnBook.classList.remove('active');
        localStorage.setItem('resumeViewMode', 'classic');
        handleClassicScroll(); // Check if button should be visible
    } else {
        body.classList.remove('view-classic');
        btnBook.classList.add('active');
        btnClassic.classList.remove('active');
        localStorage.setItem('resumeViewMode', 'book');
        currentPage = 1;
        updateBook();
        backToTopBtn.classList.remove('visible'); // Always hide in book mode
    }
}

// --- Back to Top Logic ---
function handleClassicScroll() {
    if (!body.classList.contains('view-classic')) return;
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleClassicScroll);

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- Book Navigation Controller ---
const pages = document.querySelectorAll('.page');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicator = document.getElementById('pageIndicator');
let currentPage = 1;
const totalPages = pages.length;

function updateBook() {
    if (body.classList.contains('view-classic')) return;

    pages.forEach((page, index) => {
        const pageNum = index + 1;
        if (pageNum < currentPage) {
            page.classList.add('flipped');
            page.classList.remove('active');
        } else if (pageNum === currentPage) {
            page.classList.remove('flipped');
            page.classList.add('active');
        } else {
            page.classList.remove('flipped');
            page.classList.remove('active');
        }
    });

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    if (indicator) indicator.innerText = `PAGE ${currentPage} / ${totalPages}`;
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateBook();
        }
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateBook();
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (body.classList.contains('view-classic')) return;
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
});

// --- Initialize ---
window.GA_RY_RESUME_INIT = () => {
    const savedMode = localStorage.getItem('resumeViewMode');
    // Default to 'classic' if no saved preference is found
    if (savedMode === 'book') {
        setViewMode('book');
    } else {
        setViewMode('classic');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Only init if we are on the resume page (has the resume book element)
    if (document.getElementById('resumeBook')) {
        window.GA_RY_RESUME_INIT();
    }
});
