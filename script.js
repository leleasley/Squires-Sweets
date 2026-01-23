// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });
}

// Floating WhatsApp Button - Show after scrolling
const whatsappFloat = document.getElementById('whatsappFloat');

if (whatsappFloat) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            whatsappFloat.classList.add('visible');
        } else {
            whatsappFloat.classList.remove('visible');
        }
    });
}

// Smooth Scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hero Carousel
const carousel = document.querySelector('.carousel-container');
if (carousel) {
    const AUTOPLAY_INTERVAL = 5000; // 5 seconds between slides
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    let currentSlide = 0;
    let autoplayInterval;
    let touchStartX = 0;
    let touchEndX = 0;

    // Show specific slide
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    // Next slide
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    // Previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    // Start autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    }

    // Stop autoplay
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Event listeners for controls
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoplay();
            startAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoplay();
            startAutoplay();
        });
    }

    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopAutoplay();
            startAutoplay();
        });
    });

    // Touch/swipe support
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
            stopAutoplay();
            startAutoplay();
        }
    }

    // Start autoplay on load
    startAutoplay();

    // Pause autoplay when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });
}

// Mix Builder - select up to 10 sweets and generate a WhatsApp message
(function() {
    const MAX_ITEMS = 10;
    const PHONE = '447564230269';
    const selected = [];

    function createBuilder() {
        if (document.getElementById('mixBuilder')) return;
        const builder = document.createElement('div');
        builder.className = 'mix-builder';
        builder.id = 'mixBuilder';
        builder.innerHTML = `
            <div class="mix-header">
                <strong>Build Your Mix</strong>
                <span id="mixCount">0/${MAX_ITEMS}</span>
            </div>
            <div class="mix-items" id="mixItems">No items selected</div>
            <div class="mix-actions">
                <button class="btn btn-secondary" id="mixClear">Clear</button>
                <button class="btn btn-primary" id="mixMessage">Message on WhatsApp</button>
            </div>
        `;
        document.body.appendChild(builder);
    }

    function updateBuilder() {
        const builder = document.getElementById('mixBuilder');
        const count = document.getElementById('mixCount');
        const items = document.getElementById('mixItems');
        if (!builder) return;
        count.textContent = `${selected.length}/${MAX_ITEMS}`;
        if (selected.length === 0) {
            items.textContent = 'No items selected';
            builder.classList.remove('visible');
        } else {
            items.innerHTML = selected.map(s => `<div>🍬 ${s}</div>`).join('');
            builder.classList.add('visible');
        }
    }

    function toggleCard(card) {
        const nameEl = card.querySelector('.product-name');
        if (!nameEl) return;
        const name = nameEl.innerText.trim();
        const idx = selected.indexOf(name);
        if (idx > -1) {
            selected.splice(idx, 1);
            card.classList.remove('selected');
        } else {
            if (selected.length >= MAX_ITEMS) {
                alert(`You can only select up to ${MAX_ITEMS} items.`);
                return;
            }
            selected.push(name);
            card.classList.add('selected');
        }
        updateBuilder();
    }

    document.addEventListener('DOMContentLoaded', () => {
        createBuilder();

        // Toggle selection by clicking a product card
        document.body.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (card) {
                toggleCard(card);
            }
        });

        // Clear selection
        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'mixClear') {
                selected.length = 0;
                document.querySelectorAll('.product-card.selected').forEach(c => c.classList.remove('selected'));
                updateBuilder();
            }

            if (e.target && e.target.id === 'mixMessage') {
                if (selected.length === 0) {
                    alert('Please select at least one sweet to message.');
                    return;
                }
                const list = selected.join(', ');
                const text = `Hi! I'd like to order a custom mix: ${list}.`;
                const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
            }
        });
    });
})();

