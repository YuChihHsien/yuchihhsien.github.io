/**
 * Hero Orbital Voyager (Three.js)
 * Created for yuchihhsien.github.io
 * A floating balloon astronaut that orbits the hero section.
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // --- Astronaut Construction (Balloon Model) ---
    const voyagerGroup = new THREE.Group();
    scene.add(voyagerGroup);

    const astro = new THREE.Group();
    voyagerGroup.add(astro);

    // Base Multi-Use Materials
    const suitMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 60,
        transparent: true,
        opacity: 1
    });

    const darkMat = new THREE.MeshPhongMaterial({
        color: 0x0f172a, // Very dark blue/black (visor/details)
        shininess: 150,
        transparent: true,
        opacity: 0.95
    });

    const lightMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 }); // Blue chest dot

    // --- 2. The Astronaut Character ---
    const charGroup = new THREE.Group();
    // Correct dangling offset: center of astronaut closer to 0,0
    charGroup.position.set(0, -1, 0);
    astro.add(charGroup);

    // Head
    const headGeo = new THREE.SphereGeometry(2.3, 32, 32);
    const head = new THREE.Mesh(headGeo, suitMat);
    head.position.y = 1.8;
    charGroup.add(head);

    // Dark Visor
    const visorGeo = new THREE.SphereGeometry(1.9, 32, 32);
    visorGeo.scale(1.0, 0.85, 0.75); // Wide, rounded visor
    const visor = new THREE.Mesh(visorGeo, darkMat);
    visor.position.set(0, 1.9, 1.0);
    // Add a slight tilt to the visor looking up at the balloon
    visor.rotation.x = -0.1;
    charGroup.add(visor);

    // Body (Pill shape constructed from cylinder + sphere ends)
    const bodyGroup = new THREE.Group();
    charGroup.add(bodyGroup);

    const bodyCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.4, 2.0, 32), suitMat);
    bodyGroup.add(bodyCyl);

    const bodyBot = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), suitMat);
    bodyBot.position.y = -1.0;
    bodyGroup.add(bodyBot);

    // Chest Box (Reference has a simple white rectangular box)
    const chestGeo = new THREE.BoxGeometry(1.8, 1.2, 0.6);
    const chestBox = new THREE.Mesh(chestGeo, suitMat);
    chestBox.position.set(0, 0, 1.4);
    bodyGroup.add(chestBox);

    // Chest Line/Belt (Dark outline effect)
    const beltGeo = new THREE.BoxGeometry(1.9, 0.1, 0.65);
    const belt = new THREE.Mesh(beltGeo, darkMat);
    belt.position.set(0, -0.1, 1.38);
    bodyGroup.add(belt);

    // Blue dot on chest box (Interactive light)
    const dotGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const chestLight = new THREE.Mesh(dotGeo, lightMat);
    chestLight.position.set(0.5, -0.2, 0.35); // Lower right of chest box
    chestBox.add(chestLight);

    // Backpack
    const packGeo = new THREE.BoxGeometry(2.4, 2.8, 1.0);
    const pack = new THREE.Mesh(packGeo, suitMat);
    pack.position.set(0, 0, -1.4);
    bodyGroup.add(pack);

    // --- Limbs (Dangling Capsules) ---
    function createCapsule(radius, length) {
        const group = new THREE.Group();
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 16), suitMat);
        const j1 = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 16), suitMat);
        const j2 = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 16), suitMat);
        j1.position.y = length / 2;
        j2.position.y = -length / 2;
        group.add(cyl, j1, j2);
        return group;
    }

    // Left Arm (Relaxed/Dangling)
    const lArmLength = 1.3;
    const lArm = createCapsule(0.45, lArmLength);
    lArm.children.forEach(c => c.position.y -= lArmLength / 2);
    lArm.position.set(-1.6, 0.3, 0.2);
    lArm.rotation.z = -0.3; // Hang slightly out to the left
    lArm.rotation.x = -0.2; // Hang forward
    charGroup.add(lArm);

    // Right Arm (Relaxed/Dangling)
    const rArmLength = 1.6;
    const rArm = createCapsule(0.45, rArmLength);
    rArm.children.forEach(c => c.position.y -= rArmLength / 2);
    rArm.position.set(1.4, 0.5, 0.2);
    rArm.rotation.z = 0.5; // Hang slightly out to the right
    rArm.rotation.x = 0.2; // Hang forward
    charGroup.add(rArm);

    // Left Leg (Dangling)
    const legLength = 1.4;
    const lLeg = createCapsule(0.55, legLength);
    lLeg.children.forEach(c => c.position.y -= legLength / 2);
    lLeg.position.set(-0.8, -1.2, 0.4);
    lLeg.rotation.z = -0.1;
    lLeg.rotation.x = -0.4;
    charGroup.add(lLeg);

    // Right Leg (Dangling)
    const rLeg = createCapsule(0.55, legLength);
    rLeg.children.forEach(c => c.position.y -= legLength / 2);
    rLeg.position.set(0.8, -1.4, 0.2);
    rLeg.rotation.z = 0.2;
    rLeg.rotation.x = 0.1;
    charGroup.add(rLeg);

    // --- Lighting ---
    const lightFront = new THREE.DirectionalLight(0xffffff, 1.2);
    lightFront.position.set(5, 5, 20);
    scene.add(lightFront);

    const lightBack = new THREE.DirectionalLight(0x3b82f6, 0.8);
    lightBack.position.set(-5, -5, -20);
    scene.add(lightBack);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    camera.position.z = 28; // Pulled back slightly for taller model

    // --- Interaction ---
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let isHovering = false;
    let angle = 0;

    window.addEventListener('mousemove', (event) => {
        // Ignore if mouse is over navbar elements
        if (event.target.tagName.toLowerCase() !== 'canvas') {
            if (isHovering) {
                isHovering = false;
                document.body.classList.remove('is-astro-hovering');
                lightMat.color.setHex(0x3b82f6);
            }
            return;
        }

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(astro.children, true);

        if (intersects.length > 0) {
            if (!isHovering) {
                isHovering = true;
                document.body.classList.add('is-astro-hovering');
                lightMat.color.setHex(0x4ade80); // Success green
            }
        } else {
            if (isHovering) {
                isHovering = false;
                document.body.classList.remove('is-astro-hovering');
                lightMat.color.setHex(0x3b82f6);
            }
        }
    });

    window.addEventListener('click', (event) => {
        // Redo raycast on click for maximum reliability
        const clickMouse = new THREE.Vector2();
        clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(clickMouse, camera);
        const intersects = raycaster.intersectObjects(astro.children, true);

        if (intersects.length > 0) {
            window.location.href = 'lab.html';
        }
    });

    function animate(time) {
        requestAnimationFrame(animate);

        angle += 0.005;

        // Dynamic Orbit Range (constrained to 70% of viewport width)
        const aspect = window.innerWidth / window.innerHeight;
        const visibleWidthAtZ0 = 32.2 * aspect; // adjusted for camera Z=28
        const targetRadiusX = (visibleWidthAtZ0 * 0.7) / 2;

        const curOrbitX = Math.min(22, targetRadiusX);
        const curOrbitZ = 12;

        // Base astronaut movement
        astro.position.x = Math.cos(angle) * curOrbitX;
        astro.position.z = Math.sin(angle) * curOrbitZ;

        // Gentle vertical drift
        astro.position.y = Math.sin(angle * 0.5) * 3;

        // --- 360 Degree Space Tumble ---
        // Instead of strict lookAt, we use a slow, weightless tumbling effect
        charGroup.rotation.y += 0.003;
        charGroup.rotation.x += 0.002;
        charGroup.rotation.z += 0.001;

        // Slight floaty wiggle based on time
        charGroup.position.y = -1 + Math.sin(time * 0.001) * 0.2;

        // --- Occlusion/Depth Management ---
        const zPos = astro.position.z;
        let targetOpacity = 1;

        if (zPos < 0) {
            // Passing behind
            targetOpacity = Math.max(0.15, 1 + (zPos / 15));
            suitMat.transparent = true;
        } else {
            // Passing in front
            targetOpacity = 1;
            suitMat.transparent = false;
        }

        // Apply opacities
        suitMat.opacity = targetOpacity;
        darkMat.opacity = Math.max(0.1, targetOpacity * 0.95);

        // Distance scale effect (Make it slightly smaller overall so the taller model fits on screen)
        const distScale = 0.7 + (zPos / 25);
        voyagerGroup.scale.set(distScale, distScale, distScale);

        renderer.render(scene, camera);
    }

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

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
