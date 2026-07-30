// Three.js + GSAP Setup for 3D Music Production Site
// Preserves existing functionality (auth/forms/Google Apps Script)

// Core imports (CDN loaded in HTML)
let scene, camera, renderer, heroScene;
let heroOrbs = [], particles = [];
let mouse = { x: 0, y: 0 }, time = 0;

// GSAP
let gsap;

// Init main 3D context
function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a1a, 10, 100);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Hero canvas container
    // Multiple canvases support
    const heroCanvas = document.getElementById('hero-canvas');
    const servicesCanvas = document.getElementById('services-canvas');
    const clientsCanvas = document.getElementById('clients-canvas');
    
    if (heroCanvas) {
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        heroCanvas.appendChild(renderer.domElement);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Neon point lights for music vibe
    const neonLight1 = new THREE.PointLight(0x6bcf7f, 2, 50);
    neonLight1.position.set(-3, 2, 3);
    scene.add(neonLight1);
    const neonLight2 = new THREE.PointLight(0x4d96ff, 2, 50);
    neonLight2.position.set(3, -1, 2);
    scene.add(neonLight2);

    // Create hero 3D elements
    createHeroOrbs();
    createParticles();

    // Mouse move interaction
    document.addEventListener('mousemove', onMouseMove);

    // GSAP scroll triggers prep
    gsap = window.gsap;
    if (gsap && window.ScrollTrigger) {
        gsap.registerPlugin(window.ScrollTrigger);
    }

    animate();
}

// Hero floating neon orbs (music notes/speakers)
function createHeroOrbs() {
    const orbGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const colors = [0xff6b6b, 0xffd93d, 0x6bcf7f, 0x4d96ff, 0xff6bff];

    for (let i = 0; i < 12; i++) {
        const material = new THREE.MeshPhongMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            emissive: 0x222222,
            shininess: 100
        });
        const orb = new THREE.Mesh(orbGeometry, material);
        orb.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 10
        );
        orb.userData = { originalY: orb.position.y };
        scene.add(orb);
        heroOrbs.push(orb);
    }
}

// Particle system for dust/sound waves
function createParticles() {
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 1] = Math.random() * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.5);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    particles.push(particleSystem);
}

// Mouse interaction
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Animate loop
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Animate orbs
    heroOrbs.forEach((orb, i) => {
        orb.rotation.y += 0.01;
        orb.position.y = orb.userData.originalY + Math.sin(time + i) * 0.5;
        orb.position.x += Math.sin(time * 0.5 + i) * 0.01;
        orb.position.z += Math.cos(time * 0.3 + i) * 0.01;

        // Mouse attraction
        orb.position.x += (mouse.x * 2 - orb.position.x) * 0.02;
        orb.position.y += (mouse.y * 2 - orb.position.y) * 0.02;
    });

    // Particles rotation
    particles.forEach(p => {
        p.rotation.y += 0.002;
        p.rotation.x += 0.001;
    });

    // Camera subtle move
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.05;

    renderer.render(scene, camera);
}

// Resize handler (preserve existing resize logic)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Scroll GSAP effects (e.g., parallax)
function initScrollEffects() {
    gsap.to(heroOrbs, {
        duration: 1,
        y: '-=20',
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
}

// Export for main.js
window.ThreeSetup = {
    init: initThreeJS,
    resize: onWindowResize,
    scrollEffects: initScrollEffects,
    scene: () => scene
};

// Audio visualization prep (Web Audio API)
window.initAudioViz = function() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        // Connect to particle scale...
    }).catch(() => console.log('Audio access denied'));
};

