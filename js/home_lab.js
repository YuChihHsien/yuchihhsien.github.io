/**
 * Hero Orbital Voyager (Three.js)
 * Created for yuchihhsien.github.io
 * A Q-version astronaut that orbits the entire hero section.
 */

function initHomeLabOrbit(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- Astronaut Construction (Procedural Q-Version) ---
    const voyagerGroup = new THREE.Group();
    scene.add(voyagerGroup);

    const astro = new THREE.Group();
    voyagerGroup.add(astro);

    // 1. Body (Rounded Suit)
    const bodyGeo = new THREE.SphereGeometry(1, 32, 32);
    bodyGeo.scale(1, 1.2, 0.8);
    const suitMat = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 80 });
    const body = new THREE.Mesh(bodyGeo, suitMat);
    astro.add(body);

    // 2. Helmet (Clear Visor + White Frame)
    const helmetGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const helmet = new THREE.Mesh(helmetGeo, suitMat);
    helmet.position.y = 1.1;
    astro.add(helmet);

    const visorGeo = new THREE.SphereGeometry(0.6, 32, 32);
    visorGeo.scale(1, 0.7, 0.5);
    const visorMat = new THREE.MeshPhongMaterial({
        color: 0x0ea5e9,
        emissive: 0x075985,
        shininess: 150,
        transparent: true,
        opacity: 0.9
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.1, 0.45);
    astro.add(visor);

    // 3. Backpack (Jetpack)
    const packGeo = new THREE.BoxGeometry(1.2, 1.5, 0.6);
    const pack = new THREE.Mesh(packGeo, suitMat);
    pack.position.set(0, 0.2, -0.6);
    astro.add(pack);

    // 4. Limbs (Stubby Q-version)
    const limbGeo = new THREE.SphereGeometry(0.3, 16, 16);

    const lArm = new THREE.Mesh(limbGeo, suitMat);
    lArm.position.set(1.1, 0.2, 0);
    astro.add(lArm);

    const rArm = new THREE.Mesh(limbGeo, suitMat);
    rArm.position.set(-1.1, 0.2, 0);
    astro.add(rArm);

    const lLeg = new THREE.Mesh(limbGeo, suitMat);
    lLeg.position.set(0.5, -1.1, 0);
    astro.add(lLeg);

    const rLeg = new THREE.Mesh(limbGeo, suitMat);
    rLeg.position.set(-0.5, -1.1, 0);
    astro.add(rLeg);

    // 5. Backpack Light (Interactive)
    const lightGeo = new THREE.BoxGeometry(0.4, 0.2, 0.1);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    const packLight = new THREE.Mesh(lightGeo, lightMat);
    packLight.position.set(0, 0.8, -0.9);
    astro.add(packLight);

    // --- Lighting ---
    const lightFront = new THREE.DirectionalLight(0xffffff, 1.2);
    lightFront.position.set(5, 5, 10);
    scene.add(lightFront);

    const lightBack = new THREE.DirectionalLight(0x3b82f6, 0.8);
    lightBack.position.set(-5, -5, -10);
    scene.add(lightBack);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    camera.position.z = 25;

    // --- Orbit Parameters ---
    let orbitX = window.innerWidth / 40; // Full screen width based
    let orbitZ = 12; // Z-depth to go behind content
    let angle = 0;

    // --- Interaction ---
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let isHovering = false;

    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(astro.children, true);

        if (intersects.length > 0) {
            if (!isHovering) {
                isHovering = true;
                container.style.cursor = 'pointer';
                lightMat.color.setHex(0x4ade80); // Success green light
            }
        } else {
            if (isHovering) {
                isHovering = false;
                container.style.cursor = 'default';
                lightMat.color.setHex(0x3b82f6);
            }
        }
    });

    window.addEventListener('click', () => {
        if (isHovering) {
            window.location.href = 'lab.html';
        }
    });

    function animate(time) {
        requestAnimationFrame(animate);

        angle += 0.005;

        // Elliptical Orbit
        const curOrbitX = Math.max(12, window.innerWidth / 50); // Scale with width
        const curOrbitZ = 15;

        astro.position.x = Math.cos(angle) * curOrbitX;
        astro.position.z = Math.sin(angle) * curOrbitZ;
        astro.position.y = Math.sin(angle * 0.5) * 4;

        // Auto-rotation (Looking where he's going)
        astro.rotation.y = -angle + Math.PI / 2;
        astro.rotation.z = Math.sin(time * 0.002) * 0.2; // Float wobble

        // --- Occlusion/Depth Management ---
        // If the astronaut is behind the text (Z < 0), we can make him semi-transparent
        // or just let him be smaller to simulate depth.
        // Actually, since z-index is higher than content, he'll cover the content.
        // We simulate "Behind" by reducing opacity if he's far.
        const zPos = astro.position.z;
        if (zPos < -2) {
            // Far away (Passing behind)
            suitMat.opacity = Math.max(0.2, 1 + (zPos / 15));
            suitMat.transparent = true;
            visorMat.opacity = Math.max(0.1, 0.9 + (zPos / 15));
        } else {
            // Close (Passing in front)
            suitMat.opacity = 1;
            suitMat.transparent = false;
            visorMat.opacity = 0.9;
        }

        // Scale up when close to camera
        const scale = 1 + (zPos / 15);
        voyagerGroup.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
    }

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate(0);
}

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initHomeLabOrbit('hero-orbit-container'));
} else {
    initHomeLabOrbit('hero-orbit-container');
}
