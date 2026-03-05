/**
 * Home Lab Planet Effect (Three.js)
 * Created for yuchihhsien.github.io
 */

function initHomeLabPlanet(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- Objects ---

    // 1. Central Planet (Core)
    const planetGeometry = new THREE.SphereGeometry(1.8, 64, 64);
    const planetMaterial = new THREE.MeshPhongMaterial({
        color: 0x1e3a8a,      // Deep Blue
        emissive: 0x0a192f,   // Dark shadow
        specular: 0x3b82f6,   // Accent blue highlight
        shininess: 40,
        flatShading: false
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planet);

    // 2. Atmosphere Glow
    const atmosGeometry = new THREE.SphereGeometry(1.9, 64, 64);
    const atmosMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);
    scene.add(atmosphere);

    // 3. Orbiting Satellite (The "Moon" or Lab Ball)
    const moonGroup = new THREE.Group();
    scene.add(moonGroup);

    const moonGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const moonMaterial = new THREE.MeshPhongMaterial({
        color: 0x60a5fa,      // Bright Blue
        emissive: 0x2563eb,
        shininess: 100
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(3.5, 0, 0); // Orbit radius
    moonGroup.add(moon);

    // 4. Moon Glow (Aura)
    const moonGlowGeometry = new THREE.SphereGeometry(0.45, 32, 32);
    const moonGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.3
    });
    const moonGlow = new THREE.Mesh(moonGlowGeometry, moonGlowMaterial);
    moon.add(moonGlow);

    // --- Lights ---
    const mainLight = new THREE.PointLight(0xffffff, 1.5, 100);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    camera.position.z = 7;

    // --- Interaction & Animation ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
    };

    container.addEventListener('mousemove', handleMouseMove);

    function animate(time) {
        requestAnimationFrame(animate);

        const speed = time * 0.001;

        // Smoothing planet tilt
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        planet.rotation.y += 0.005;
        planet.rotation.x = targetY * 0.5;
        planet.rotation.z = targetX * 0.2;

        atmosphere.rotation.y -= 0.002;

        // Orbit logic
        moonGroup.rotation.y = speed * 0.8;
        moonGroup.rotation.z = Math.sin(speed * 0.5) * 0.2;

        moon.rotation.y += 0.02;

        // Pulsing glow for moon
        const pulse = 0.3 + Math.sin(speed * 3) * 0.1;
        moonGlowMaterial.opacity = pulse;

        renderer.render(scene, camera);
    }

    // Handle Resize
    const observer = new ResizeObserver(() => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    observer.observe(container);

    animate(0);
}

// Auto-init if container exists
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('home-planet-container')) {
        initHomeLabPlanet('home-planet-container');
    }
});
