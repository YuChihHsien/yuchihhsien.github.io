document.addEventListener('DOMContentLoaded', () => {
    // ---- Global State: Theme & Language ----
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const currentLang = localStorage.getItem('lang') || 'en';

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

    // ---- Professional Polish: Custom Cursor ----
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const updateCursor = () => {
            // Smooth lagging effect (optional but premium)
            // If you want instant, just use cursorX = mouseX
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;

            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(updateCursor);
        };
        updateCursor();

        const interactiveElements = document.querySelectorAll('a, button, .social-btn, .skill-tag, .nav-brand, .toggle-btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    // ---- Professional Polish: Scroll Progress ----
    const progressContainer = document.createElement('div');
    progressContainer.className = 'scroll-progress-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);

    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (window.scrollY / windowHeight) * 100;
                progressBar.style.width = scrolled + '%';
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // ---- Professional Polish: Typing Effect ----
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const text = "Senior Software Engineer";
        let index = 0;
        function type() {
            if (index < text.length) {
                typingElement.textContent += text.charAt(index);
                index++;
                setTimeout(type, 100);
            }
        }
        type();
    }

    // ---- Professional Gift: Easter Egg Console ----
    let keySequence = "";
    const secretWord = "gary";

    document.addEventListener('keydown', (e) => {
        keySequence += e.key.toLowerCase();
        if (keySequence.length > 4) keySequence = keySequence.slice(-4);

        if (keySequence === secretWord) {
            toggleAdminOverlay();
            keySequence = "";
        }
    });

    const overlay = document.createElement('div');
    overlay.className = 'admin-overlay';
    overlay.innerHTML = `
        <div class="admin-header">
            <span>GA-RY_SYSTEM_ADMIN [AUTHORIZED_ACCESS]</span>
            <button class="admin-close" onclick="toggleAdminOverlay()">CLOSE_SIGNAL</button>
        </div>
        <div class="admin-content">
            <div class="ascii-art">
   _____  _____  _____ __     __
  / ____|/ ____||  __ \\\\ \\   / /
 | |  __| (___  | |__) |\\\\ \\_/ / 
 | | |_ |\\\\___ \\\\ |  _  /  \\\\   /  
 | |__| |____) || | \\\\ \\\\   | |   
  \\\\_____|_____/ |_|  \\\\_\\\\  |_|   
            </div>
            <div id="admin-logs"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    window.toggleAdminOverlay = function () {
        overlay.classList.toggle('active');
        if (overlay.classList.contains('active')) {
            startAdminLogs();
        }
    };

    function startAdminLogs() {
        const logsContainer = document.getElementById('admin-logs');
        logsContainer.innerHTML = "";
        const logs = [
            "> INITIALIZING SYSTEM_KERNEL_V4.0...",
            "> AUTHENTICATING USER: GARY_YU",
            "> DEPLOYING CLOUD_INFRASTRUCTURE: AWS_EKS",
            "> CORE_SYSTEM: .NET_MICROSERVICES_ACTIVE",
            "> MESSAGE_BROKER: KAFKA_CLUSTER_STABLE",
            "> DATA_LAYER: ORLEANS_SILO_RUNNING",
            "> SECURITY_STATUS: HCAPTCHA_ENABLED",
            "> ANALYTICS: GA4_STREAMING_DATA",
            "> WELCOME BACK, ARCHITECT.",
            "---------------------------------------",
            "> VIEWING_SESSION_METRICS...",
            `> REFRESH_RATE: ${window.screen.refreshRate || 60}Hz`,
            `> CLIENT_OS: ${navigator.platform}`,
            `> BROWSER: ${navigator.userAgent.split(' ')[0]}`,
            "---------------------------------------",
            "> LOG_STREAM: [INFO] Packet 0xc0ffee captured.",
            "> LOG_STREAM: [SUCCESS] Neural interface synced."
        ];

        let i = 0;
        function showNextLog() {
            if (i < logs.length) {
                const p = document.createElement('p');
                p.textContent = logs[i];
                p.style.margin = "2px 0";
                logsContainer.appendChild(p);
                overlay.scrollTop = overlay.scrollHeight; // Auto-scroll
                i++;
                setTimeout(showNextLog, 150);
            }
        }
        showNextLog();
    }

    // ---- Professional Gift: 3D Tech Cloud ----
    const cloudContainer = document.getElementById('tech-cloud-container');
    if (cloudContainer) {
        initTechCloud(cloudContainer);
    }
});

function initTechCloud(container) {
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Categories for colors and connections
    const techData = [
        { label: "AWS", cat: "cloud", color: "#FF9900" },
        { label: "ASP.NET Core", cat: "back", color: "#512bd4" },
        { label: "C#", cat: "back", color: "#239120" },
        { label: "K8s", cat: "cloud", color: "#326ce5" },
        { label: "Docker", cat: "ops", color: "#2496ed" },
        { label: "Apache Kafka", cat: "dist", color: "#5d4037" },
        { label: "Microservices", cat: "back", color: "#9c27b0" },
        { label: "MongoDB", cat: "data", color: "#47A248" },
        { label: "Redis", cat: "data", color: "#d82c20" },
        { label: "Vue.js", cat: "front", color: "#4FC08D" },
        { label: "DDD", cat: "arch", color: "#f39c12" },
        { label: "GitLab", cat: "ops", color: "#FCA121" },
        { label: "AWX", cat: "ops", color: "#00c853" },
        { label: "SQL Server", cat: "data", color: "#CC2927" },
        { label: "Nginx", cat: "ops", color: "#009639" },
        { label: "Scrum", cat: "proc", color: "#607d8b" },
        { label: "jQuery", cat: "front", color: "#0769AD" },
        { label: "IIS", cat: "ops", color: "#3b82f6" },
        { label: "Architecture", cat: "arch", color: "#ffeb3b" }
    ];

    const group = new THREE.Group();
    scene.add(group);

    const sprites = [];
    techData.forEach((tech, i) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;

        // Draw Glow
        const gradient = ctx.createRadialGradient(128, 64, 0, 128, 64, 100);
        gradient.addColorStop(0, tech.color + '44');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 128);

        ctx.fillStyle = tech.color;
        ctx.font = 'Bold 36px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = tech.color;
        ctx.shadowBlur = 10;
        ctx.fillText(tech.label, 128, 75);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.9 });
        const sprite = new THREE.Sprite(material);

        const phi = Math.acos(-1 + (2 * i) / techData.length);
        const theta = Math.sqrt(techData.length * Math.PI) * phi;
        const radius = 9;

        sprite.position.set(
            radius * Math.cos(theta) * Math.sin(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(phi)
        );
        sprite.scale.set(6, 3, 1);
        sprite.userData = { category: tech.cat, color: tech.color };
        group.add(sprite);
        sprites.push(sprite);
    });

    // Add neural connections (lines between same categories)
    const lineMaterial = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0.15,
        vertexColors: true
    });

    const points = [];
    const colors = [];
    for (let i = 0; i < sprites.length; i++) {
        for (let j = i + 1; j < sprites.length; j++) {
            if (sprites[i].userData.category === sprites[j].userData.category) {
                points.push(sprites[i].position.clone());
                points.push(sprites[j].position.clone());

                const c1 = new THREE.Color(sprites[i].userData.color);
                const c2 = new THREE.Color(sprites[j].userData.color);
                colors.push(c1.r, c1.g, c1.b);
                colors.push(c2.r, c2.g, c2.b);
            }
        }
    }

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);

    // Interaction
    let isMouseDown = false;
    let targetRotationX = 0, targetRotationY = 0;

    container.addEventListener('mousedown', () => isMouseDown = true);
    window.addEventListener('mouseup', () => isMouseDown = false);
    container.addEventListener('mousemove', (e) => {
        if (isMouseDown) {
            group.rotation.y += e.movementX * 0.005;
            group.rotation.x += e.movementY * 0.005;
        }
    });

    function animate() {
        requestAnimationFrame(animate);
        if (!isMouseDown) {
            group.rotation.y += 0.002;
            group.rotation.x += 0.001;
        }
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });
}

// --- Global Namespace ---
window.GA_RY = {
    theme: {
        toggle: toggleTheme,
        set: setTheme
    },
    lang: {
        toggle: toggleLanguage,
        set: setLanguage
    },
    particles: {
        instance: null
    }
};

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

    document.querySelectorAll('[data-zh][data-en]').forEach(el => {
        el.innerHTML = el.getAttribute(`data-${lang}`);
    });
}

// Optimized Particle Network Background
function initParticles(canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationId;
    let isPaused = false;

    // Responsive config
    const getParticleCount = () => window.innerWidth < 768 ? 30 : 60;
    const connectionDistance = 150;
    const particleSpeed = 0.5;

    function resize() {
        width = canvas.parentElement.clientWidth;
        height = canvas.parentElement.clientHeight;
        canvas.width = width;
        canvas.height = height;

        // Re-initialize particles on major resize to adjust density
        const targetCount = getParticleCount();
        if (particles.length !== targetCount) {
            particles = [];
            for (let i = 0; i < targetCount; i++) {
                particles.push(new Particle());
            }
        }
    }

    window.addEventListener('resize', () => {
        // Simple debounce-like check
        clearTimeout(window.particleResizeTimer);
        window.particleResizeTimer = setTimeout(resize, 200);
    });
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
            ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'dark'
                ? 'rgba(88, 166, 255, 0.4)'
                : 'rgba(59, 130, 246, 0.4)';
            ctx.fill();
        }
    }

    function animate() {
        if (isPaused) return;

        ctx.clearRect(0, 0, width, height);
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    const opacity = (1 - (distance / connectionDistance)) * 0.3;
                    ctx.strokeStyle = isDark
                        ? `rgba(88, 166, 255, ${opacity})`
                        : `rgba(59, 130, 246, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        animationId = requestAnimationFrame(animate);
    }

    // Performance: Pause when not visible
    document.addEventListener('visibilitychange', () => {
        isPaused = document.hidden;
        if (!isPaused) animate();
    });

    animate();

    return {
        stop: () => cancelAnimationFrame(animationId),
        pause: () => { isPaused = true; },
        resume: () => { isPaused = false; animate(); }
    };
}
