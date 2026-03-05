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

    const balloonMat = new THREE.MeshPhongMaterial({
        color: 0xf59e0b, // Amber/Orange
        emissive: 0xb45309,
        emissiveIntensity: 0.3,
        shininess: 40,
        transparent: true,
        opacity: 1
    });

    const craterMat = new THREE.MeshPhongMaterial({
        color: 0xc2410c, // Darker orange
        shininess: 20,
        transparent: true,
        opacity: 1
    });

    const lineMat = new THREE.MeshBasicMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 1
    });

    const lightMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 }); // Blue chest dot

    // --- 1. The "Balloon" (Moon) ---
    const balloonGroup = new THREE.Group();
    // Positioned vertically above the horizontal right hand
    balloonGroup.position.set(3.7, 9.2, 1.2);
    astro.add(balloonGroup);

    // Main Sphere (Using Icosahedron for better vertex distribution for noise)
    const balloonGeo = new THREE.IcosahedronGeometry(3.5, 5);

    // Procedurally perturb vertices to create a lumpy, realistic moon surface
    const posAttribute = balloonGeo.attributes.position;
    const vertex = new THREE.Vector3();
    for (let i = 0; i < posAttribute.count; i++) {
        vertex.fromBufferAttribute(posAttribute, i);
        // More complex topographical noise: blend of low and high frequency
        const noise = (Math.sin(vertex.x * 1.5) * Math.cos(vertex.y * 1.5) * 0.1) +
            (Math.sin(vertex.x * 4.0) * Math.sin(vertex.z * 4.0) * 0.05);
        vertex.add(vertex.clone().normalize().multiplyScalar(noise));
        posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    balloonGeo.computeVertexNormals();

    // Realistic moon material (grey with slight roughness and faint glow)
    const moonMat = new THREE.MeshStandardMaterial({
        color: 0xcbd5e1,
        roughness: 0.95,
        metalness: 0.0,
        flatShading: true,
        emissive: 0xffffff,
        emissiveIntensity: 0.05, // Very subtle glow to make it "pop"
    });
    const balloon = new THREE.Mesh(balloonGeo, moonMat);
    balloonGroup.add(balloon);

    // Add realistic 3D craters (Floor + Raised Rim)
    const craterFloorMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 1.0 });
    const craterRimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 });

    const craterData = [
        { radius: 1.2, lat: 0.3, lon: 0.5, rays: true }, // Main "Tycho" crater with rays
        { radius: 0.6, lat: -0.2, lon: 0.8 },
        { radius: 0.8, lat: 0.6, lon: -0.4 },
        { radius: 0.5, lat: -0.5, lon: -0.6 },
        { radius: 0.7, lat: 0.1, lon: -0.9 },
        { radius: 0.9, lat: -0.4, lon: 0.2 },
    ];

    craterData.forEach(data => {
        const phi = (90 - data.lat * 180) * (Math.PI / 180);
        const theta = (data.lon * 180) * (Math.PI / 180);
        const r = 3.42;

        // Crater Floor
        const innerGeo = new THREE.CircleGeometry(data.radius, 16);
        const innerMesh = new THREE.Mesh(innerGeo, craterFloorMat);
        innerMesh.position.setFromSphericalCoords(r, phi, theta);
        const normal = innerMesh.position.clone().normalize();
        innerMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

        // Crater Rim
        const rimGeo = new THREE.TorusGeometry(data.radius, 0.12, 8, 16);
        const rimMesh = new THREE.Mesh(rimGeo, craterRimMat);
        rimMesh.position.copy(innerMesh.position);
        rimMesh.quaternion.copy(innerMesh.quaternion);

        balloonGroup.add(innerMesh, rimMesh);

        // Add "Crater Rays" for the largest crater
        if (data.rays) {
            for (let i = 0; i < 8; i++) {
                const rayLen = 2 + Math.random() * 3;
                const rayGeo = new THREE.PlaneGeometry(0.08, rayLen);
                const rayMesh = new THREE.Mesh(rayGeo, new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.15
                }));
                // Position and orient ray
                rayMesh.position.copy(innerMesh.position).add(normal.clone().multiplyScalar(0.05));
                rayMesh.quaternion.copy(innerMesh.quaternion);
                rayMesh.rotateZ((i / 8) * Math.PI * 2);
                rayMesh.translateY(rayLen / 2 + data.radius);
                balloonGroup.add(rayMesh);
            }
        }
    });

    // Balloon Knot (Tie)
    const knotGeo = new THREE.ConeGeometry(0.3, 0.5, 8);
    const knotMesh = new THREE.Mesh(knotGeo, moonMat);
    knotMesh.position.set(0, -3.5, 0);
    knotMesh.rotation.x = Math.PI;
    balloonGroup.add(knotMesh);

    // String (Connecting from balloon bottom to hand)
    const stringLength = 5.8;
    const stringGeo = new THREE.CylinderGeometry(0.03, 0.03, stringLength, 8);
    stringGeo.translate(0, -stringLength / 2, 0);
    const stringMesh = new THREE.Mesh(stringGeo, lineMat);
    stringMesh.position.set(0, -3.5, 0);
    balloonGroup.add(stringMesh);

    // --- 2. The Astronaut Character ---
    const charGroup = new THREE.Group();
    // Correct dangling offset: center of astronaut closer to 0,0
    charGroup.position.set(0, -1, 0);
    astro.add(charGroup);

    // Head
    const headGeo = new THREE.SphereGeometry(2.3, 32, 32);
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

    // Right Arm (Reaching horizontally to the right to hold string)
    const rArmLength = 1.8;
    const rArm = createCapsule(0.45, rArmLength);
    rArm.children.forEach(c => c.position.y -= rArmLength / 2);
    rArm.position.set(1.4, 0.5, 0.2);
    rArm.rotation.z = Math.PI / 2; // Point exactly right (horizontal)
    rArm.rotation.x = 0;
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
        const visibleWidthAtZ0 = 32.2 * aspect; // adjusted for camera Z=28
        const targetRadiusX = (visibleWidthAtZ0 * 0.7) / 2;

        const curOrbitX = Math.min(22, targetRadiusX);
        const curOrbitZ = 12;

        // Base astronaut movement
        astro.position.x = Math.cos(angle) * curOrbitX;
        astro.position.z = Math.sin(angle) * curOrbitZ;

        // Gentle vertical drift
        astro.position.y = Math.sin(angle * 0.5) * 3;

        // Front-Facing Orientation
        astro.lookAt(camera.position);

        // Floaty wiggle simulating being pulled by the balloon
        astro.rotation.z += Math.sin(time * 0.001) * 0.1;
        astro.rotation.x += Math.cos(time * 0.0015) * 0.05;

        // --- Occlusion/Depth Management ---
        const zPos = astro.position.z;
        let targetOpacity = 1;

        if (zPos < 0) {
            // Passing behind
            targetOpacity = Math.max(0.15, 1 + (zPos / 15));
            suitMat.transparent = true;
            balloonMat.transparent = true;
        } else {
            // Passing in front
            targetOpacity = 1;
            suitMat.transparent = false;
            balloonMat.transparent = false;
        }

        // Apply opacities
        suitMat.opacity = targetOpacity;
        darkMat.opacity = Math.max(0.1, targetOpacity * 0.95);
        balloonMat.opacity = targetOpacity;
        craterMat.opacity = targetOpacity;
        lineMat.opacity = targetOpacity * targetOpacity; // Make string fade faster

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
