// ===== HERO PHOTO COLLAGE — DROP TO TABLE =====
(function () {
    const collageContainer = document.getElementById('heroCollage');
    if (!collageContainer) return;

    // Dynamically pull image paths from projects-data.js config
    const projectImages = (typeof getProjectImagePaths === 'function')
        ? getProjectImagePaths()
        : []; // fallback if config not loaded

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    // Dense overlapping layout — 35 slots covering every pixel of the hero
    // Tiles are large and overlap generously so no background is visible
    const photoSlots = [
        // Row 0 — very top overflow
        { x: -8, y: -12, w: 26, h: 30 },
        { x: 14, y: -10, w: 24, h: 28 },
        { x: 34, y: -14, w: 26, h: 30 },
        { x: 56, y: -10, w: 24, h: 28 },
        { x: 76, y: -12, w: 26, h: 30 },
        // Row 1
        { x: -4, y: 10, w: 28, h: 30 },
        { x: 18, y: 8, w: 24, h: 28 },
        { x: 38, y: 12, w: 26, h: 30 },
        { x: 58, y: 8, w: 24, h: 28 },
        { x: 78, y: 10, w: 26, h: 30 },
        // Row 2
        { x: -6, y: 30, w: 26, h: 30 },
        { x: 16, y: 28, w: 28, h: 32 },
        { x: 36, y: 32, w: 24, h: 28 },
        { x: 54, y: 28, w: 26, h: 30 },
        { x: 74, y: 30, w: 28, h: 32 },
        // Row 3
        { x: -4, y: 50, w: 28, h: 30 },
        { x: 20, y: 48, w: 24, h: 28 },
        { x: 40, y: 52, w: 26, h: 30 },
        { x: 60, y: 48, w: 24, h: 28 },
        { x: 80, y: 50, w: 26, h: 30 },
        // Row 4
        { x: -6, y: 70, w: 26, h: 30 },
        { x: 14, y: 68, w: 28, h: 32 },
        { x: 36, y: 72, w: 24, h: 28 },
        { x: 56, y: 68, w: 26, h: 30 },
        { x: 76, y: 70, w: 28, h: 32 },
        // Row 5 — bottom overflow
        { x: -4, y: 88, w: 26, h: 26 },
        { x: 18, y: 86, w: 24, h: 28 },
        { x: 40, y: 90, w: 26, h: 26 },
        { x: 60, y: 86, w: 24, h: 28 },
        { x: 80, y: 88, w: 26, h: 26 },
        // Extra fill — diagonal gaps
        { x: 6, y: 20, w: 22, h: 26 },
        { x: 28, y: 42, w: 22, h: 26 },
        { x: 48, y: 60, w: 22, h: 26 },
        { x: 68, y: 40, w: 22, h: 26 },
        { x: 88, y: 58, w: 22, h: 26 },
    ];

    const TILE_COUNT = photoSlots.length;
    const tiles = [];
    let imgPool = shuffle(projectImages);
    let poolIdx = 0;

    function nextImage() {
        if (poolIdx >= imgPool.length) {
            imgPool = shuffle(projectImages);
            poolIdx = 0;
        }
        return imgPool[poolIdx++];
    }

    // Generate random rotation values for CSS custom properties
    function setTileRotations(el) {
        const startRot = rand(-25, 25);
        const midRot = rand(-8, 8);
        const landRot = rand(-15, 15);
        const liftRot = rand(-20, 20);
        el.style.setProperty('--start-rotation', startRot.toFixed(1) + 'deg');
        el.style.setProperty('--mid-rotation', midRot.toFixed(1) + 'deg');
        el.style.setProperty('--land-rotation', landRot.toFixed(1) + 'deg');
        el.style.setProperty('--lift-rotation', liftRot.toFixed(1) + 'deg');
        return landRot;
    }

    // Create all photo tiles with staggered drop-in
    photoSlots.forEach((slot, i) => {
        const tile = document.createElement('div');
        tile.className = 'collage-tile';

        // Add random jitter to position so it looks organic
        const jx = rand(-4, 4);
        const jy = rand(-4, 4);
        const jw = rand(-3, 3);

        tile.style.left = (slot.x + jx) + '%';
        tile.style.top = (slot.y + jy) + '%';
        tile.style.width = (slot.w + jw) + '%';
        tile.style.height = slot.h + '%';
        tile.style.zIndex = Math.floor(rand(1, 25));

        // Set per-tile rotation CSS custom properties
        setTileRotations(tile);

        // Staggered drop timing — cascade effect
        const dropDelay = rand(0, 2.8);
        const dropDuration = rand(1.5, 2.2);
        tile.style.setProperty('--drop-delay', dropDelay.toFixed(2) + 's');
        tile.style.setProperty('--drop-duration', dropDuration.toFixed(2) + 's');

        const imgSrc = nextImage();
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = 'Project artwork';
        img.loading = (i < 10) ? 'eager' : 'lazy';
        tile.appendChild(img);
        collageContainer.appendChild(tile);

        tiles.push({
            el: tile,
            currentSrc: imgSrc,
            isSwapping: false,
            slot: slot,
            dropDelay: dropDelay,
            dropDuration: dropDuration
        });

        // Trigger the drop animation
        requestAnimationFrame(() => {
            tile.classList.add('dropping');
        });

        // After drop completes, switch to static landed state
        const totalTime = (dropDelay + dropDuration) * 1000 + 100;
        setTimeout(() => {
            tile.classList.remove('dropping');
            tile.classList.add('landed');
        }, totalTime);
    });

    // Swap a tile: old photo lifts away, new photo drops in
    function swapTile(idx) {
        const tileData = tiles[idx];
        if (tileData.isSwapping) return;
        tileData.isSwapping = true;

        const el = tileData.el;

        // Pick a different image
        let newSrc;
        do {
            newSrc = projectImages[Math.floor(Math.random() * projectImages.length)];
        } while (newSrc === tileData.currentSrc);

        // Preload new image
        const preload = new Image();
        preload.src = newSrc;

        // Phase 1: Lift away the current tile
        el.classList.remove('landed');
        el.classList.add('lifting');

        // Phase 2: After lift completes, swap image and drop back in
        setTimeout(() => {
            // Swap the image source
            const img = el.querySelector('img');
            if (img) {
                img.src = newSrc;
            }
            tileData.currentSrc = newSrc;

            // Remove lifting, set new rotation values for the new drop
            el.classList.remove('lifting');
            setTileRotations(el);

            // Set swap drop delay
            el.style.setProperty('--swap-delay', '0s');

            // Reset to initial state for drop
            el.style.opacity = '0';
            el.style.transform = 'translateY(-80vh) rotate(0deg) scale(0.7)';

            // Trigger swap drop animation
            requestAnimationFrame(() => {
                el.style.opacity = '';
                el.style.transform = '';
                el.classList.add('swap-dropping');
            });

            // After swap drop completes, settle into landed
            setTimeout(() => {
                el.classList.remove('swap-dropping');
                el.classList.add('landed');
                tileData.isSwapping = false;
            }, 1600);
        }, 1300); // wait for lift to finish
    }

    // Periodically swap 1–2 random photos
    function cycleRandom() {
        const count = 1 + Math.floor(Math.random() * 2);
        const indices = shuffle([...Array(TILE_COUNT).keys()]).slice(0, count);
        indices.forEach((idx, i) => {
            setTimeout(() => swapTile(idx), i * 1500);
        });
    }

    // Start cycling after all initial drops have landed
    setTimeout(() => {
        cycleRandom();
        setInterval(cycleRandom, 5000);
    }, 5500);
})();

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== SCROLL FADE-IN ANIMATION =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    fadeObserver.observe(el);
});

// ===== NAVBAR SCROLL EFFECT =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.style.borderBottomColor = 'rgba(0, 229, 160, 0.15)';
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.borderBottomColor = 'rgba(0, 229, 160, 0.08)';
        navbar.style.background = 'rgba(10, 10, 10, 0.85)';
    }

    lastScroll = currentScroll;
});

// ===== IMAGE LIGHTBOX =====
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('gallery-img')) {
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close">&times;</span>
                <img src="${e.target.src}" alt="${e.target.alt || 'Gallery image'}">
            </div>
        `;
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Close on click
        lightbox.addEventListener('click', function (ev) {
            if (ev.target === lightbox || ev.target.classList.contains('close')) {
                lightbox.remove();
                document.body.style.overflow = '';
            }
        });

        // Close on Escape
        document.addEventListener('keydown', function handler(ev) {
            if (ev.key === 'Escape') {
                lightbox.remove();
                document.body.style.overflow = '';
                document.removeEventListener('keydown', handler);
            }
        });
    }
});

// ===== MOBILE MENU - close on link click =====
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        }
    });
});