// Lab Effects Implementation

/**
 * Section 2: Gravity Particles
 * An interactive particle system that reacts to mouse position and gravity.
 */
function initGravityParticles(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 100;
    const mouse = { x: null, y: null, radius: 150 };

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    resize();

    // Splat effect on click - ISOLATED to canvas
    canvas.addEventListener('mousedown', (e) => {
        if (!particles.length) return;
        const rect = canvas.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        for (let i = 0; i < 20; i++) {
            const p = new Particle();
            p.x = offsetX;
            p.y = offsetY;
            // High velocity temporary particles
            p.density = (Math.random() * 50) + 20;
            p.color = '#fff'; // White splat
            particles.push(p);
            // Limit total particles to prevent lag
            if (particles.length > 200) particles.shift();
        }
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 3 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.color = `rgba(59, 130, 246, ${Math.random() * 0.8 + 0.2})`;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 20;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 20;
                }
            }
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
            particles[i].update();
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();
}

/**
 * Section 3: 3D Morphing Geometry (Three.js)
 * A morphing wireframe sphere using Three.js.
 */
function initMorphingSphere(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(2, 20);
    const material = new THREE.MeshPhongMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 5;

    const originalPositions = geometry.attributes.position.array.slice();
    let pulseFactor = 0;

    // Pulse effect on click - ISOLATED to container
    container.addEventListener('mousedown', () => {
        pulseFactor = 1.0;
    });

    function animate(time) {
        requestAnimationFrame(animate);

        const positions = geometry.attributes.position.array;
        const speed = time * 0.001;

        for (let i = 0; i < positions.length; i += 3) {
            const x = originalPositions[i];
            const y = originalPositions[i + 1];
            const z = originalPositions[i + 2];

            // Perlin-like noise movement + click pulse
            const factor = (1 + 0.2 * Math.sin(speed + (x * 2) + (y * 3) + (z * 1))) + (pulseFactor * 0.5);
            positions[i] = x * factor;
            positions[i + 1] = y * factor;
            positions[i + 2] = z * factor;
        }

        if (pulseFactor > 0) pulseFactor *= 0.92; // Decay pulse

        geometry.attributes.position.needsUpdate = true;
        sphere.rotation.y += 0.005;
        sphere.rotation.x += 0.002;

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate(0);
}

/**
 * Section 4: Orbital Odyssey (Three.js)
 * A 3D orbital scene with an astronaut and a spaceship circling a planet.
 */
function initOrbitalOdyssey(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Starfield Background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
        starPositions[i] = (Math.random() - 0.5) * 200;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Planet
    const planetGeometry = new THREE.SphereGeometry(2, 64, 64);
    const planetMaterial = new THREE.MeshPhongMaterial({
        color: 0x1e3a8a, // Deep blue
        emissive: 0x071e4d,
        specular: 0x3b82f6,
        shininess: 30,
        flatShading: false
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planet);

    // Planet Glow/Atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(2.1, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Orbital Groups
    const astronautGroup = new THREE.Group();
    const shipGroup = new THREE.Group();
    scene.add(astronautGroup);
    scene.add(shipGroup);

    // Procedural Astronaut
    const astronaut = new THREE.Group();

    // Suit/Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.2), new THREE.MeshPhongMaterial({ color: 0xeeeeee }));
    astronaut.add(body);

    // Helmet
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshPhongMaterial({ color: 0x333333 }));
    helmet.position.y = 0.3;
    astronaut.add(helmet);

    // Backpack
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.3, 0.15), new THREE.MeshPhongMaterial({ color: 0xcccccc }));
    pack.position.z = -0.15;
    astronaut.add(pack);

    astronaut.position.set(4, 1, 0);
    astronautGroup.add(astronaut);

    // Procedural Spaceship
    const ship = new THREE.Group();

    // Body (Capsule/Cone)
    const shipBody = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.2, 0.6, 16), new THREE.MeshPhongMaterial({ color: 0x3b82f6 }));
    shipBody.rotation.x = Math.PI / 2;
    ship.add(shipBody);

    // Wings
    const wingGeo = new THREE.BoxGeometry(1, 0.05, 0.3);
    const wings = new THREE.Mesh(wingGeo, new THREE.MeshPhongMaterial({ color: 0x1e40af }));
    ship.add(wings);

    ship.position.set(-6, -1, 0);
    shipGroup.add(ship);

    // Lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(5, 5, 5);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0x404040, 0.5));

    camera.position.z = 10;

    let shipPulse = 0;
    container.addEventListener('mousedown', () => {
        shipPulse = 1.0;
    });

    function animate(time) {
        requestAnimationFrame(animate);
        const speed = time * 0.0005;

        // Rotation
        planet.rotation.y += 0.002;
        stars.rotation.y += 0.0001;

        // Astronaut Orbit
        astronautGroup.rotation.y += 0.01;
        astronautGroup.rotation.z = Math.sin(speed) * 0.2;
        astronaut.rotation.x += 0.02;
        astronaut.rotation.z += 0.01;

        // Ship Orbit
        shipGroup.rotation.y -= 0.008;
        shipGroup.rotation.x = Math.cos(speed * 0.5) * 0.3;
        ship.rotation.y += 0.05;

        if (shipPulse > 0) {
            ship.scale.set(1 + shipPulse * 0.5, 1 + shipPulse * 0.5, 1 + shipPulse * 0.5);
            shipPulse *= 0.95;
        } else {
            ship.scale.set(1, 1, 1);
        }

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate(0);
}

// Overlay Retreat Logic
function initOverlayRetreat() {
    const overlays = document.querySelectorAll('.lab-overlay');
    const sections = document.querySelectorAll('.lab-section');
    const timers = new Map();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            const overlay = section.querySelector('.lab-overlay');
            if (!overlay) return;

            // Behavior Refinement:
            // 1. If very visible (>60%), ensure it's NOT mini (resets on scroll back)
            if (entry.intersectionRatio > 0.6) {
                overlay.classList.remove('mini');
                if (timers.has(section)) {
                    clearTimeout(timers.get(section));
                    timers.delete(section);
                }

                // Start a fresh timer to retreat if it stays visible
                const timer = setTimeout(() => {
                    if (section.getBoundingClientRect().top < window.innerHeight * 0.4) {
                        overlay.classList.add('mini');
                    }
                }, 2500);
                timers.set(section, timer);
            }
            // 2. If it leaves view, clear everything
            else if (!entry.isIntersecting) {
                overlay.classList.remove('mini');
                if (timers.has(section)) {
                    clearTimeout(timers.get(section));
                    timers.delete(section);
                }
            }
        });
    }, { threshold: [0, 0.2, 0.6, 0.9] });

    sections.forEach(section => observer.observe(section));

    // Allow user to toggle back by clicking
    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            if (overlay.classList.contains('mini')) {
                overlay.classList.remove('mini');
                // Re-retreat after 5 seconds if still in view
                const section = overlay.parentElement;
                if (timers.has(section)) clearTimeout(timers.get(section));
                const timer = setTimeout(() => {
                    if (document.visibilityState === 'visible') {
                        overlay.classList.add('mini');
                    }
                }, 5000);
                timers.set(section, timer);
            }
        });
    });
}

// Global initialization
window.addEventListener('load', () => {
    // Initial section effects
    if (document.getElementById('gravity-canvas')) initGravityParticles('gravity-canvas');
    if (document.getElementById('morph-container')) initMorphingSphere('morph-container');
    if (document.getElementById('orbit-container')) initOrbitalOdyssey('orbit-container');

    // UI Effects
    initOverlayRetreat();
});
