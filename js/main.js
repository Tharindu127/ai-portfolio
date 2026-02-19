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
        navbar.style.borderBottomColor = 'rgba(0, 255, 136, 0.15)';
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.borderBottomColor = 'rgba(0, 255, 136, 0.08)';
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