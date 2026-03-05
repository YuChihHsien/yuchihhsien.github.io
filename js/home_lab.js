/**
 * Hero Orbital Voyager (Three.js)
 * Created for yuchihhsien.github.io
 * A cute, Q-version astronaut that orbits the hero section.
 */

function initHomeLabOrbit(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- Mobile Check ---
    if (window.innerWidth < 768) {
        container.style.display = 'none';
        return; // Don't run on mobile to save performance/ux, banner handled in CSS/HTML
    }

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- Astronaut Construction (Cute Q-Version 2.0) ---
    const voyagerGroup = new THREE.Group();
    scene.add(voyagerGroup);

    const astro = new THREE.Group();
    voyagerGroup.add(astro);

    // Base Multi-Use Material
    const suitMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 100,
        transparent: true,
        opacity: 1
    });

    // 1. Head (Large & Round)
    const headGeo = new THREE.SphereGeometry(2.4, 32, 32);
    const head = new THREE.Mesh(headGeo, suitMat);
    head.position.y = 2.4;
    astro.add(head);

    // 2. Dark Visor (The "Cute" factor)
    const visorGeo = new THREE.SphereGeometry(1.8, 32, 32);
    visorGeo.scale(1.1, 0.8, 0.6); // Wide and flat-ish
    const visorMat = new THREE.MeshPhongMaterial({
        color: 0x1e1b4b, // Deep space indigo/black
        emissive: 0x0f172a,
        shininess: 200,
        transparent: true,
        opacity: 0.95
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 2.4, 1.4);
    astro.add(visor);

    // 3. Ear-Muffs / Headphones
    const muffGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.5, 32);
    muffGeo.rotateZ(Math.PI / 2);

    const lMuff = new THREE.Mesh(muffGeo, suitMat);
    lMuff.position.set(2.2, 2.4, 0);
    astro.add(lMuff);

    const rMuff = new THREE.Mesh(muffGeo, suitMat);
    rMuff.position.set(-2.2, 2.4, 0);
    astro.add(rMuff);

    // 4. Body (Short & Stubby)
    const bodyGeo = new THREE.SphereGeometry(2.0, 32, 32);
    bodyGeo.scale(1.1, 1.1, 0.9);
    const body = new THREE.Mesh(bodyGeo, suitMat);
    body.position.y = -0.5;
    astro.add(body);

    // 5. Backpack
    const packGeo = new THREE.BoxGeometry(2.8, 3.2, 1.2);
    const pack = new THREE.Mesh(packGeo, suitMat);
    pack.position.set(0, 0.5, -1.5);
    astro.add(pack);

    // 6. Limbs (Small & Cute)
    const limbGeo = new THREE.SphereGeometry(0.7, 16, 16);

    const lArm = new THREE.Mesh(limbGeo, suitMat);
    lArm.position.set(2.4, 0, 0.2);
    astro.add(lArm);

    const rArm = new THREE.Mesh(limbGeo, suitMat);
    rArm.position.set(-2.4, 0, 0.2);
    astro.add(rArm);

    const lLeg = new THREE.Mesh(limbGeo, suitMat);
    lLeg.position.set(1.0, -2.5, 0);
    astro.add(lLeg);

    const rLeg = new THREE.Mesh(limbGeo, suitMat);
    rLeg.position.set(-1.0, -2.5, 0);
    astro.add(rLeg);

    // 7. Small Chest Plate Light
    const lightGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    const chestLight = new THREE.Mesh(lightGeo, lightMat);
    chestLight.position.set(0, 0.8, 1.8);
    astro.add(chestLight);

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
                lightMat.color.setHex(0x4ade80); // Success green
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

        const curOrbitX = Math.min(20, targetRadiusX);
        const curOrbitZ = 12;

        astro.position.x = Math.cos(angle) * curOrbitX;
        astro.position.z = Math.sin(angle) * curOrbitZ;
        astro.position.y = Math.sin(angle * 0.5) * 3;

        // Front-Facing Orientation
        astro.lookAt(camera.position);

        // Floaty wiggle
        astro.rotation.z += Math.sin(time * 0.001) * 0.1;
        astro.rotation.x += Math.cos(time * 0.001) * 0.05;

        // --- Occlusion/Depth Management ---
        const zPos = astro.position.z;
        if (zPos < 0) {
            suitMat.opacity = Math.max(0.2, 1 + (zPos / 15));
            suitMat.transparent = true;
            visorMat.opacity = Math.max(0.1, 0.95 + (zPos / 15));
        } else {
            suitMat.opacity = 1;
            suitMat.transparent = false;
            visorMat.opacity = 0.95;
        }

        // Distance scale effect
        const distScale = 1.0 + (zPos / 15);
        voyagerGroup.scale.set(distScale, distScale, distScale);

        renderer.render(scene, camera);
    }

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Mobile guard: If resized to mobile, hide container
        if (window.innerWidth < 768) {
            container.style.display = 'none';
        } else {
            container.style.display = 'block';
        }
    });

    animate(0);
}

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initHomeLabOrbit('hero-orbit-container'));
} else {
    initHomeLabOrbit('hero-orbit-container');
}
