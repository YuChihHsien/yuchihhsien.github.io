// Initialize GA_RY namespace if it doesn't exist (support standalone loading)
window.GA_RY = window.GA_RY || {};

window.GA_RY.COMPONENTS = {
    navbar: `
    <nav>
        <a href="index.html" class="nav-brand"><i class="fa-solid fa-code"></i> C-H. Yu</a>
        <div class="nav-left">
            <ul class="nav-links">
                <li><a href="index.html" id="nav-home"><i class="fa-solid fa-house"></i> <span data-zh="首頁" data-en="Home">Home</span></a></li>
                <li><a href="resume.html" id="nav-resume"><i class="fa-solid fa-file-lines"></i> <span data-zh="履歷" data-en="Resume">Resume</span></a></li>
                <li><a href="lab.html" id="nav-lab"><i class="fa-solid fa-flask"></i> <span data-zh="實驗室" data-en="Lab">Lab</span></a></li>
                <li><a href="contact.html" id="nav-support"><i class="fa-solid fa-mug-hot"></i> <span data-zh="贊助" data-en="Support">Support</span></a></li>
            </ul>
            <div class="nav-controls">
                <button id="theme-toggle" class="icon-btn" onclick="toggleTheme()" title="Toggle Theme">☀️</button>
                <button id="lang-toggle" class="icon-btn lang-btn" onclick="toggleLanguage()" title="Toggle Language">EN</button>
                <div class="hamburger">
                    <span class="line1"></span>
                    <span class="line2"></span>
                    <span class="line3"></span>
                </div>
            </div>
        </div>
    </nav>`,

    footer: `
    <footer>
        <div class="footer-tech-stats">
            <span><i class="fa-solid fa-bolt"></i> OS: GA-RY_OS v1.0.4</span>
            <span class="separator">|</span>
            <span><i class="fa-solid fa-desktop"></i> STATUS: SECURE</span>
        </div>
        <p>&copy; <span id="year"></span> <span data-zh="余致賢" data-en="Chih-Hsien Yu">余致賢</span>. All rights reserved.</p>
    </footer>`,

    init() {
        this.inject('nav-container', this.navbar);
        this.inject('footer-container', this.footer);
        this.highlightActivePage();
        this.updateYear();
    },

    inject(containerId, html) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html;
        }
    },

    highlightActivePage() {
        const path = window.location.pathname;
        const page = path.split("/").pop() || 'index.html';

        let activeId = '';
        if (page === 'index.html' || page === '') activeId = 'nav-home';
        else if (page === 'resume.html') activeId = 'nav-resume';
        else if (page === 'lab.html') activeId = 'nav-lab';
        else if (page === 'contact.html') activeId = 'nav-support';

        if (activeId) {
            const activeLink = document.getElementById(activeId);
            if (activeLink) activeLink.classList.add('active');
        }
    },

    updateYear() {
        const yearSpan = document.getElementById('year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }
};

// Initialize components immediately when script loads if DOM is ready, 
// or wait for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.GA_RY.COMPONENTS.init());
} else {
    window.GA_RY.COMPONENTS.init();
}
