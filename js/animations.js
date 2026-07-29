// ============================================================
//   BLUEMOON PRODUCTION — CRAZY 3D MUSIC EXPERIENCE
// ============================================================

// ---- 1. CUSTOM CURSOR ----
// COMMENTED OUT - Using default mouse cursor
/*
function initCursor() {
    if (window.innerWidth <= 768) return;

    const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
    });

    // Smooth ring follow
    (function animateRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(animateRing);
    })();

    // Hover effect on interactive elements
    document.querySelectorAll('a, button, .service-card, .nav-link').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
}
*/

// ---- 2. PARTICLE TRAIL ON MOUSE MOVE ----
function initParticleTrail() {
    if (window.innerWidth <= 768) return;

    const colors = ['#352487', '#6a3de8', '#9b6dff', '#ffffff', '#e94560'];
    let lastTime = 0;

    document.addEventListener('mousemove', e => {
        const now = Date.now();
        if (now - lastTime < 40) return; // throttle
        lastTime = now;

        const p = document.createElement('div');
        p.className = 'particle-trail';
        p.style.left = e.clientX + 'px';
        p.style.top  = e.clientY + 'px';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.width  = (4 + Math.random() * 6) + 'px';
        p.style.height = p.style.width;
        p.style.boxShadow = `0 0 8px ${p.style.background}`;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 800);
    });
}

// ---- 3. 3D CANVAS BACKGROUND (floating music objects) ----
function initBgCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Music symbols to float
    const symbols = ['♪', '♫', '♬', '♩', '🎵', '🎶', '🎸', '🥁', '🎤', '🎹'];

    const particles = Array.from({ length: 55 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        size: 12 + Math.random() * 22,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: -0.3 - Math.random() * 0.5,
        opacity: 0.05 + Math.random() * 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        hue: Math.random() > 0.5 ? '#352487' : '#6a3de8'
    }));

    // Connection lines between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(53, 36, 135, ${0.12 * (1 - dist / 140)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);

        drawConnections();

        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.rotation += p.rotSpeed;

            if (p.y < -40) { p.y = H + 40; p.x = Math.random() * W; }
            if (p.x < -40) p.x = W + 40;
            if (p.x > W + 40) p.x = -40;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = p.opacity;
            ctx.font = `${p.size}px serif`;
            ctx.fillStyle = p.hue;
            ctx.shadowColor = p.hue;
            ctx.shadowBlur = 15;
            ctx.fillText(p.symbol, 0, 0);
            ctx.restore();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// ---- 4. SOUND WAVE BARS (hero) ----
function createSoundWave() {
    const homeSection = document.querySelector('.home-section');
    if (!homeSection) return;

    const container = document.createElement('div');
    container.className = 'sound-wave-container';

    const barCount = window.innerWidth <= 768 ? 50 : 100;
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'wave-bar';
        bar.style.height = (8 + Math.random() * 60) + 'px';
        bar.style.animationDelay = (i / barCount * 1.2) + 's';
        bar.style.animationDuration = (0.5 + Math.random() * 0.9) + 's';
        container.appendChild(bar);
    }
    homeSection.appendChild(container);
}

// ---- 5. SPINNING VINYL RECORD ----
function createVinylRecord() {
    if (window.innerWidth <= 768) return;
    const homeSection = document.querySelector('.home-section');
    if (!homeSection) return;
    const vinyl = document.createElement('div');
    vinyl.className = 'vinyl-record';
    homeSection.appendChild(vinyl);
}

// ---- 6. FOOTER EQUALIZER ----
function createFooterEqualizer() {
    const footerIcons = document.querySelector('.footer-icons');
    if (!footerIcons) return;

    const eq = document.createElement('div');
    eq.className = 'footer-equalizer';

    for (let i = 0; i < 22; i++) {
        const bar = document.createElement('div');
        bar.className = 'eq-bar';
        bar.style.height = (8 + Math.random() * 35) + 'px';
        bar.style.animationDelay = (i / 22 * 0.8) + 's';
        bar.style.animationDuration = (0.35 + Math.random() * 0.55) + 's';
        eq.appendChild(bar);
    }
    footerIcons.parentElement.insertBefore(eq, footerIcons);
}

// ---- 7. 3D CARD TILT (original — desktop mouse tracking on card) ----
function init3DCardTilt() {
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top  + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width  / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            card.style.transform = `rotateX(${-dy * 12}deg) rotateY(${dx * 12}deg) translateZ(25px) translateY(-8px)`;
            card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
            card.style.setProperty('--my', ((e.clientY - rect.top)  / rect.height * 100) + '%');
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ---- 7b. MOBILE CARD FLIP (tap to reveal back face) ----
function initMobileCardFlip() {
    if (window.innerWidth > 768) return;
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const isFlipped = card.classList.contains('flipped');
            // Close all cards first
            document.querySelectorAll('.service-card.flipped').forEach(c => c.classList.remove('flipped'));
            // Open clicked one only if it wasn't already open
            if (!isFlipped) card.classList.add('flipped');
        });
    });
}

// ---- 8. MAGNETIC BUTTONS + INVOICE FORM TILT ----
function initMagneticButtons() {
    if (window.innerWidth <= 768) return;

    document.querySelectorAll('.submit-btn, .login-btn, .auth-submit-btn, .slider-btn, .carousel-btn, .back-btn, .view-invoices-btn, .add-item-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const dx = e.clientX - (rect.left + rect.width  / 2);
            const dy = e.clientY - (rect.top  + rect.height / 2);
            btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // 3D tilt on invoice form sections
    document.querySelectorAll('.invoice-form h3, .invoice-totals, #bankDetails, #upiDetails').forEach(el => {
        el.style.transition = 'transform 0.3s ease';
        el.addEventListener('mouseenter', () => {
            el.style.transform = 'translateX(4px)';
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

// ---- 9. GLITCH TEXT SETUP ----
function initGlitchText() {
    document.querySelectorAll('.glitch').forEach(el => {
        el.setAttribute('data-text', el.textContent);
    });
}

// ---- 10. SCROLL REVEAL ----
function initScrollReveal() {
    const targets = document.querySelectorAll(
        '.service-card, .about-text h3, .about-text h4, .about-text p, .about-text li, .contact-form, .section-title'
    );
    targets.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 70);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    targets.forEach(el => observer.observe(el));
}

// ---- 11. FLOATING MUSIC NOTES (random positions) ----
function initFloatingNotes() {
    const notes = ['♪', '♫', '♬', '♩'];
    const container = document.querySelector('.home-section');
    if (!container) return;

    setInterval(() => {
        const note = document.createElement('div');
        note.className = 'music-note';
        note.textContent = notes[Math.floor(Math.random() * notes.length)];
        note.style.left = (10 + Math.random() * 80) + '%';
        note.style.bottom = '80px';
        note.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
        note.style.animationDuration = (4 + Math.random() * 4) + 's';
        note.style.animationDelay = '0s';
        container.appendChild(note);
        setTimeout(() => note.remove(), 8000);
    }, 800);
}

// ---- 12. WAVE BARS REACT TO SLIDE CHANGE ----
function animateWaveBarsOnSlide() {
    document.querySelectorAll('.wave-bar').forEach(bar => {
        bar.style.animationDuration = (0.2 + Math.random() * 0.3) + 's';
        setTimeout(() => {
            bar.style.animationDuration = (0.5 + Math.random() * 0.9) + 's';
        }, 500);
    });
}
window.animateWaveBarsOnSlide = animateWaveBarsOnSlide;

// ---- 13. NEON GLOW ON NAV LINKS HOVER ----
function initNavGlow() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.textShadow = `0 0 10px var(--highlight-color), 0 0 20px var(--highlight-color)`;
        });
        link.addEventListener('mouseleave', () => {
            link.style.textShadow = '';
        });
    });
}

// ---- 14. STATS COUNTER ANIMATION ----
function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            const duration = 1800;
            const step = target / (duration / 16);
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = Math.floor(current);
            }, 16);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}

// ---- INIT ALL ----
function initAll() {
    initBgCanvas();
    // initCursor(); // COMMENTED OUT - Using default mouse cursor
    initParticleTrail();
    createSoundWave();
    createVinylRecord();
    createFooterEqualizer();
    init3DCardTilt();
    initMobileCardFlip();
    initMagneticButtons();
    initGlitchText();
    initScrollReveal();
    initFloatingNotes();
    initNavGlow();
    initStatsCounter();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}
