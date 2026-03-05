/**
 * Hero Orbital Planet Effect (Three.js)
 * Created for yuchihhsien.github.io
 * A small "Tech Planet" that orbits the central hero content.
 */

function initHomeLabOrbit(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- Orbital Planet (The Lab Ball) ---
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    // Create a small, glowing "Tech Planet"
    const planetGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const planetMaterial = new THREE.MeshPhongMaterial({
        color: 0x60a5fa,      // Bright Blue
        emissive: 0x2563eb,
        shininess: 100
    });
    const labPlanet = new THREE.Mesh(planetGeometry, planetMaterial);

    // Position it in a large orbit (Radius fits the hero content)
    // We adjust X for the elliptical feel
    const orbitRadiusX = 12;
    const orbitRadiusZ = 6;
    labPlanet.position.set(orbitRadiusX, 0, 0);
    orbitGroup.add(labPlanet);

    // Add a glow/corona effect
    const glowGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.3
    });
    const planetGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    labPlanet.add(planetGlow);

    // --- Lighting ---
    const mainLight = new THREE.PointLight(0xffffff, 1.5, 100);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    camera.position.z = 15;

    // --- Interaction ---
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let isHovering = false;

    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(labPlanet);

        if (intersects.length > 0) {
            if (!isHovering) {
                isHovering = true;
                container.classList.add('hovering-planet');
                labPlanet.scale.set(1.5, 1.5, 1.5); // Emphasize on hover
                planetMaterial.emissive.setHex(0x3b82f6);
            }
        } else {
            if (isHovering) {
                isHovering = false;
                container.classList.remove('hovering-planet');
                labPlanet.scale.set(1, 1, 1);
                planetMaterial.emissive.setHex(0x2563eb);
            }
        }
    });

    container.addEventListener('click', () => {
        if (isHovering) {
            window.location.href = 'lab.html';
        }
    });

    function animate(time) {
        requestAnimationFrame(animate);

        const speed = time * 0.0004;

        // Orbit movement along the ellipse
        labPlanet.position.x = Math.cos(speed) * orbitRadiusX;
        labPlanet.position.z = Math.sin(speed) * orbitRadiusZ;
        labPlanet.position.y = Math.sin(speed * 0.5) * 2; // Vertical wobble

        labPlanet.rotation.y += 0.02;

        // Pulsing glow
        glowMaterial.opacity = 0.2 + Math.sin(time * 0.003) * 0.1;

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
    if (document.getElementById('hero-orbit-container')) {
        initHomeLabOrbit('hero-orbit-container');
    }
});
