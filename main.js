/* =============================================
   TeraLink — main.js
   ============================================= */

// ── Smooth scroll ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ── Header shrink on scroll ──────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── Hero scroll hint ─────────────────────────
const heroScroll = document.querySelector('.hero-scroll');
if (heroScroll) {
    heroScroll.addEventListener('click', () => {
        const nextSection = document.querySelector('#sobre-nosotros');
        if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
    });
}

// ── Mobile menu ──────────────────────────────
const menuToggle = document.querySelector('.menu-toggle');
const navMenu    = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Abrir menú');
        });
    });
}

// ── Main process carousel ────────────────────
(function () {
    const slides     = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn    = document.querySelector('.carousel-button.prev');
    const nextBtn    = document.querySelector('.carousel-button.next');
    const track      = document.querySelector('.carousel-track');
    if (!slides.length || !track) return;

    let current  = 0;
    let interval = null;

    const goTo = (index) => {
        slides[current].classList.remove('active');
        indicators[current].classList.remove('active');
        indicators[current].setAttribute('aria-selected', 'false');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        indicators[current].classList.add('active');
        indicators[current].setAttribute('aria-selected', 'true');
        track.style.transform = `translateX(-${current * 100}%)`;
    };

    const reset = () => {
        clearInterval(interval);
        interval = setInterval(() => goTo(current + 1), 5000);
    };

    prevBtn?.addEventListener('click', () => { goTo(current - 1); reset(); });
    nextBtn?.addEventListener('click', () => { goTo(current + 1); reset(); });
    indicators.forEach((dot, i) => {
        dot.addEventListener('click', () => { goTo(i); reset(); });
    });

    // Swipe support
    const car = document.querySelector('.carousel');
    if (car) {
        let startX = 0;
        car.addEventListener('touchstart', e => { startX = e.changedTouches[0].clientX; }, { passive: true });
        car.addEventListener('touchend',   e => {
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 44) { dx < 0 ? goTo(current + 1) : goTo(current - 1); reset(); }
        }, { passive: true });
    }

    interval = setInterval(() => goTo(current + 1), 5000);
})();

// ── Mini carousels (inside service cards) ────
document.querySelectorAll('.mini-carousel').forEach(wrap => {
    const slides = wrap.querySelectorAll('.mini-slide');
    const dots   = wrap.querySelectorAll('.mdot');
    const prev   = wrap.querySelector('.mprev');
    const next   = wrap.querySelector('.mnext');
    if (!slides.length) return;

    // Add dots if not present
    let mdots = wrap.querySelector('.mdots');
    if (!mdots) {
        mdots = document.createElement('div');
        mdots.className = 'mdots';
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('button');
            dot.className = 'mdot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', e => { e.stopPropagation(); goTo(i); startInterval(); });
            mdots.appendChild(dot);
        }
        wrap.appendChild(mdots);
    }

    let cur = 0;
    let interval;

    const goTo = (index) => {
        slides[cur].classList.remove('active');
        mdots.children[cur]?.classList.remove('active');
        cur = (index + slides.length) % slides.length;
        slides[cur].classList.add('active');
        mdots.children[cur]?.classList.add('active');
    };

    const startInterval = () => {
        clearInterval(interval);
        interval = setInterval(() => goTo(cur + 1), 2000);
    };

    prev?.addEventListener('click', e => { e.stopPropagation(); goTo(cur - 1); startInterval(); });
    next?.addEventListener('click', e => { e.stopPropagation(); goTo(cur + 1); startInterval(); });
    mdots.querySelectorAll('.mdot').forEach((dot, i) => {
        dot.addEventListener('click', e => { e.stopPropagation(); goTo(i); startInterval(); });
    });

    // Touch/swipe on mini carousel
    let startX = 0;
    wrap.addEventListener('touchstart', e => { startX = e.changedTouches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 30) { 
            dx < 0 ? goTo(cur + 1) : goTo(cur - 1); 
            startInterval();
        }
    }, { passive: true });

    // Start auto-advance
    startInterval();
});

// ── Expandable service cards ─────────────────
document.querySelectorAll('.svc-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const card   = btn.closest('.svc-card');
        const body   = card.querySelector('.svc-body');
        const isOpen = card.classList.toggle('is-open');

        btn.setAttribute('aria-expanded', String(isOpen));
        body.setAttribute('aria-hidden', String(!isOpen));

        // Update button label
        const label = btn.querySelector('span');
        if (label) label.textContent = isOpen ? 'Ver menos' : 'Ver más';

        // Smooth scroll to card if opening and partially off-screen
        if (isOpen) {
            setTimeout(() => {
                const rect = card.getBoundingClientRect();
                if (rect.bottom > window.innerHeight) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 200);
        }
    });
});

// Allow clicking the .svc-base row to toggle too
document.querySelectorAll('.svc-base').forEach(base => {
    base.addEventListener('click', function (e) {
        // Don't double-fire if the button itself was clicked
        if (e.target.closest('.svc-toggle')) return;
        const btn = this.querySelector('.svc-toggle');
        btn?.click();
    });
    base.style.cursor = 'pointer';
});

// ── Intersection Observer — fade-in ──────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── Stats counter animation ───────────────────
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.stat-number').forEach(el => {
            const target = parseFloat(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            if (isNaN(target)) return;
            const duration = 1400;
            const startTime = performance.now();
            const tick = (now) => {
                const pct    = Math.min((now - startTime) / duration, 1);
                const eased  = 1 - Math.pow(1 - pct, 3);
                el.textContent = Math.round(eased * target) + suffix;
                if (pct < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
        statsObserver.unobserve(entry.target);
    });
}, { threshold: 0.5 });

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) statsObserver.observe(statsStrip);
