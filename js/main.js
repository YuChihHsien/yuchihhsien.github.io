document.addEventListener('DOMContentLoaded', () => {
    // ---- Global State: Theme & Language ----
    const currentTheme = localStorage.getItem('theme') || 'light';
    const currentLang = localStorage.getItem('lang') || 'zh';

    // Apply initial state
    setTheme(currentTheme);
    setLanguage(currentLang);

    // Set dynamic year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Intersection Observer for scroll animations
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.animate-on-scroll');
    hiddenElements.forEach(el => observer.observe(el));

    // Initialize particle network if canvas exists
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        initParticles(canvas);
    }

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            hamburger.classList.toggle('toggle');
        });
    }

    // Hacker Glitch Easter Egg
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const titleElement = document.querySelector('.hero h1');
    if (titleElement) {
        let h1TextNodes = Array.from(titleElement.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
        let targetTextNode = h1TextNodes[0];

        if (targetTextNode) {
            let originalText = targetTextNode.textContent.trim();
            // Wrap the text in a span so we can animate it without affecting the nested span.zh
            let spanWrapper = document.createElement('span');
            spanWrapper.textContent = originalText;
            spanWrapper.style.cursor = "pointer";
            titleElement.insertBefore(spanWrapper, targetTextNode);
            titleElement.removeChild(targetTextNode);

            spanWrapper.addEventListener('mouseover', event => {
                let iterations = 0;
                clearInterval(spanWrapper.dataset.interval);

                spanWrapper.dataset.interval = setInterval(() => {
                    event.target.innerText = originalText
                        .split("")
                        .map((letter, index) => {
                            if (index < iterations) {
                                return originalText[index];
                            }
                            return letters[Math.floor(Math.random() * 26)]
                        })
                        .join("");

                    if (iterations >= originalText.length) {
                        clearInterval(spanWrapper.dataset.interval);
                    }
                    iterations += 1 / 3;
                }, 30);
            });
        }
    }
});

// Theme Management
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(currentTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Language Management
function toggleLanguage() {
    const currentLang = document.documentElement.getAttribute('lang') === 'en' ? 'zh' : 'en';
    setLanguage(currentLang);
}

function setLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('lang', lang);
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.textContent = lang === 'en' ? '中' : 'EN';
    }

    // Find all elements that have bilingual data attributes
    document.querySelectorAll('[data-zh][data-en]').forEach(el => {
        el.innerHTML = el.getAttribute(`data-${lang}`);
    });
}

// Particle Network Background
function initParticles(canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Config
    const particleCount = 60;
    const connectionDistance = 150;
    const particleSpeed = 0.5;

    function resize() {
        width = canvas.parentElement.clientWidth;
        height = canvas.parentElement.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * particleSpeed;
            this.vy = (Math.random() - 0.5) * particleSpeed;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            // Color adapts to theme natively via css variables in real implementations, 
            // but we'll use a semi-transparent blue/gray that works on both
            ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'dark'
                ? 'rgba(88, 166, 255, 0.5)'
                : 'rgba(59, 130, 246, 0.5)';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    // Line opacity based on distance
                    const opacity = 1 - (distance / connectionDistance);

                    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                    ctx.strokeStyle = isDark
                        ? `rgba(88, 166, 255, ${opacity * 0.3})`
                        : `rgba(59, 130, 246, ${opacity * 0.3})`;

                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    animate();
}
