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

    // 1. Body (Rounded Suit) - Significantly Increased Size
    const bodyGeo = new THREE.SphereGeometry(2.5, 32, 32);
    bodyGeo.scale(1, 1.2, 0.8);
    const suitMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 80,
        transparent: true,
        opacity: 1
    });
    const body = new THREE.Mesh(bodyGeo, suitMat);
    astro.add(body);

    // 2. Helmet (Clear Visor + White Frame)
    const helmetGeo = new THREE.SphereGeometry(2.0, 32, 32);
    const helmet = new THREE.Mesh(helmetGeo, suitMat);
    helmet.position.y = 2.5;
    astro.add(helmet);

    const visorGeo = new THREE.SphereGeometry(1.6, 32, 32);
    visorGeo.scale(1, 0.7, 0.5);
    const visorMat = new THREE.MeshPhongMaterial({
        color: 0x0ea5e9,
        emissive: 0x075985,
        shininess: 150,
        transparent: true,
        opacity: 0.9
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 2.5, 1.2);
    astro.add(visor);

    // 3. Backpack (Jetpack)
    const packGeo = new THREE.BoxGeometry(3.0, 3.5, 1.2);
    const pack = new THREE.Mesh(packGeo, suitMat);
    pack.position.set(0, 0.5, -1.5);
    astro.add(pack);

    // 4. Limbs (Stubby Q-version)
    const limbGeo = new THREE.SphereGeometry(0.8, 16, 16);

    const lArm = new THREE.Mesh(limbGeo, suitMat);
    lArm.position.set(2.8, 0.5, 0);
    astro.add(lArm);

    const rArm = new THREE.Mesh(limbGeo, suitMat);
    rArm.position.set(-2.8, 0.5, 0);
    astro.add(rArm);

    const lLeg = new THREE.Mesh(limbGeo, suitMat);
    lLeg.position.set(1.2, -2.8, 0);
    astro.add(lLeg);

    const rLeg = new THREE.Mesh(limbGeo, suitMat);
    rLeg.position.set(-1.2, -2.8, 0);
    astro.add(rLeg);

    // 5. Backpack Light (Interactive)
    const lightGeo = new THREE.BoxGeometry(1.0, 0.5, 0.2);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    const packLight = new THREE.Mesh(lightGeo, lightMat);
    packLight.position.set(0, 2.0, -2.1);
    astro.add(packLight);

    // --- Lighting ---
    const lightFront = new THREE.DirectionalLight(0xffffff, 1.2);
    lightFront.position.set(5, 5, 20);
    scene.add(lightFront);

    const lightBack = new THREE.DirectionalLight(0x3b82f6, 0.8);
    lightBack.position.set(-5, -5, -20);
    scene.add(lightBack);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    camera.position.z = 25;

    // --- Interaction ---
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let isHovering = false;
    let angle = 0;

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

        // Dynamic Orbit Range (constrained to 70% of viewport width)
        const aspect = window.innerWidth / window.innerHeight;
        const visibleWidthAtZ0 = 28.8 * aspect;
        const targetRadiusX = (visibleWidthAtZ0 * 0.7) / 2; // 70% width radius

        const curOrbitX = Math.min(22, targetRadiusX);
        const curOrbitZ = 12;

        astro.position.x = Math.cos(angle) * curOrbitX;
        astro.position.z = Math.sin(angle) * curOrbitZ;
        astro.position.y = Math.sin(angle * 0.5) * 3.5;

        // Front-Facing Orientation: Always face the camera/user
        astro.lookAt(camera.position);

        // Add a slight "floaty" tilt relative to the camera-facing orientation
        astro.rotation.z += Math.sin(time * 0.001) * 0.1;
        astro.rotation.x += Math.cos(time * 0.001) * 0.05;

        // --- Occlusion/Depth Management ---
        const zPos = astro.position.z;
        if (zPos < 0) {
            // Passing behind content
            suitMat.opacity = Math.max(0.2, 1 + (zPos / 15));
            suitMat.transparent = true;
            visorMat.opacity = Math.max(0.1, 0.9 + (zPos / 15));
        } else {
            // Passing in front of content
            suitMat.opacity = 1;
            suitMat.transparent = false;
            visorMat.opacity = 0.9;
        }

        // Final scale boost based on distance
        const distScale = 1.0 + (zPos / 15);
        voyagerGroup.scale.set(distScale, distScale, distScale);

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
