// --- Resume 2-Page Spread Controller ---
let currentLeaf = 1;
let totalLeafs = 0;
let resumeBook, prevBtn, nextBtn, pageIndicator;

document.addEventListener('DOMContentLoaded', () => {
    resumeBook = document.getElementById('resumeBook');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    pageIndicator = document.getElementById('pageIndicator');

    const leaves = document.querySelectorAll('.leaf');
    totalLeafs = leaves.length;

    if (!resumeBook) return;

    // Initialize view mode
    const savedMode = localStorage.getItem('resumeViewMode') || 'book';
    setViewMode(savedMode);

    // Leaf click flipping
    leaves.forEach((leaf, index) => {
        leaf.onclick = () => {
            if (document.body.classList.contains('view-classic')) return;
            const leafNum = index + 1;
            if (leafNum === currentLeaf && currentLeaf < totalLeafs) {
                currentLeaf++;
                updateBook();
            } else if (leafNum === currentLeaf - 1) {
                currentLeaf--;
                updateBook();
            }
        };
    });

    // Button listeners
    if (prevBtn) {
        prevBtn.onclick = () => {
            if (currentLeaf > 1) {
                currentLeaf--;
                updateBook();
            }
        };
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
            if (currentLeaf < totalLeafs) {
                currentLeaf++;
                updateBook();
            }
        };
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.body.classList.contains('view-classic')) return;
        if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
        if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    });
});

function setViewMode(mode) {
    const isClassic = (mode === 'classic');
    document.body.classList.toggle('view-classic', isClassic);

    const btnBook = document.getElementById('btnBook');
    const btnClassic = document.getElementById('btnClassic');

    if (btnBook) btnBook.classList.toggle('active', !isClassic);
    if (btnClassic) btnClassic.classList.toggle('active', isClassic);

    if (isClassic) {
        document.querySelectorAll('.leaf').forEach(leaf => {
            leaf.classList.remove('flipped');
            leaf.style.zIndex = "";
        });
        if (resumeBook) resumeBook.classList.remove('book-open');
    } else {
        updateBook();
    }
    localStorage.setItem('resumeViewMode', mode);
}

function updateBook() {
    if (document.body.classList.contains('view-classic')) return;

    const leaves = document.querySelectorAll('.leaf');
    leaves.forEach((leaf, index) => {
        const leafNum = index + 1;
        if (leafNum < currentLeaf) {
            leaf.classList.add('flipped');
            leaf.style.zIndex = leafNum;
        } else {
            leaf.classList.remove('flipped');
            leaf.style.zIndex = totalLeafs - leafNum + 1;
        }
    });

    if (resumeBook) {
        if (currentLeaf > 1) {
            resumeBook.classList.add('book-open');
        } else {
            resumeBook.classList.remove('book-open');
        }
    }

    if (prevBtn) prevBtn.disabled = (currentLeaf === 1);
    if (nextBtn) nextBtn.disabled = (currentLeaf === totalLeafs);

    if (pageIndicator) {
        const startPage = (currentLeaf - 1) * 2 + 1;
        const endPage = startPage + 1;
        pageIndicator.innerText = `PAGE ${startPage} - ${endPage} / ${totalLeafs * 2}`;
    }
}

// Terminal toggle helper
window.toggleTerminal = function () {
    const win = document.getElementById('terminalWindow');
    if (win) win.classList.toggle('active');
};
