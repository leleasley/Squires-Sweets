// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    // Toggle menu and manage aria-expanded
    mobileMenuBtn.addEventListener('click', () => {
        const opening = !navLinks.classList.contains('active');
        navLinks.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', opening ? 'true' : 'false');
        if (opening) {
            // move focus to first link for accessibility
            const first = navLinks.querySelector('.nav-link');
            if (first) first.focus();
        } else {
            mobileMenuBtn.focus();
        }
    });

    // Close mobile menu when clicking on a link and restore focus
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.focus();
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.focus();
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

// Mix Builder - bottom-sheet with improved message format
(function() {
    const MAX_ITEMS = 10;
    const PHONE = '447564230269';
    const selected = [];
    let expanded = false;

    function createBuilder() {
        if (document.getElementById('mixBuilder')) return;
        const builder = document.createElement('div');
        builder.className = 'mix-builder';
        builder.id = 'mixBuilder';
        builder.setAttribute('role','region');
        builder.setAttribute('aria-label','Build your mix');
        builder.innerHTML = `
            <div class="mix-handle" id="mixHandle" role="button" aria-label="Expand mix panel"></div>
            <div class="mix-header">
                <div>
                    <div class="mix-title">Build Your Mix</div>
                    <div class="mix-count" id="mixCount">0/${MAX_ITEMS}</div>
                </div>
                <div class="mix-actions">
                    <button class="btn btn-secondary" id="mixClear">Clear</button>
                    <button class="btn btn-light" id="mixCopy">Copy</button>
                    <button class="btn btn-primary" id="mixMessage">Message</button>
                </div>
            </div>
            <div class="mix-items" id="mixItems">No items selected</div>
            <div id="mixAria" class="sr-only" aria-live="polite" aria-atomic="true"></div>
        `;
        document.body.appendChild(builder);

        // Floating toggle button
        const toggle = document.createElement('button');
        toggle.id = 'mixToggle';
        toggle.className = 'mix-toggle';
        toggle.type = 'button';
        toggle.innerHTML = `<span>View Mix</span><strong id="mixToggleCount" style="margin-left:6px;">0</strong>`;
        toggle.setAttribute('aria-expanded','false');
        document.body.appendChild(toggle);

        // Toast for copy feedback
        if (!document.getElementById('mixToast')) {
            const toast = document.createElement('div');
            toast.id = 'mixToast';
            toast.className = 'mix-toast';
            toast.setAttribute('role','status');
            toast.setAttribute('aria-live','polite');
            document.body.appendChild(toast);
        }

        // Auto-collapse timer holder
        if (typeof window._mixAutoCollapseTimer === 'undefined') window._mixAutoCollapseTimer = null;
        if (typeof window._mixToastTimer === 'undefined') window._mixToastTimer = null;
    }

    function saveSelection() {
        try {
            localStorage.setItem('squires_mix', JSON.stringify(selected));
        } catch (e) {
            console.warn('Could not save selection', e);
        }
    }

    function loadSelection() {
        try {
            const raw = localStorage.getItem('squires_mix');
            if (!raw) return;
            const arr = JSON.parse(raw);
            if (!Array.isArray(arr)) return;
            // Populate selected up to MAX_ITEMS
            arr.slice(0, MAX_ITEMS).forEach(name => {
                if (selected.indexOf(name) === -1) selected.push(name);
            });
        } catch (e) {
            console.warn('Could not load stored selection', e);
        }
    }

    function expandIfFlagged() {
        try {
            const flag = localStorage.getItem('squires_mix_expand');
            if (flag === '1') {
                expandBuilder(true);
                localStorage.removeItem('squires_mix_expand');
            }
        } catch (e) { /* ignore */ }
    }

    function updateBuilder() {
        const builder = document.getElementById('mixBuilder');
        const countEl = document.getElementById('mixCount');
        const items = document.getElementById('mixItems');
        const toggle = document.getElementById('mixToggle');
        const toggleCount = document.getElementById('mixToggleCount');
        if (!builder) return;
        countEl.textContent = `${selected.length}/${MAX_ITEMS}`;
        toggleCount.textContent = selected.length;
        const aria = document.getElementById('mixAria');

        if (selected.length === 0) {
            items.textContent = 'No items selected';
            if (aria) aria.textContent = 'No items selected';
            builder.classList.remove('visible','expanded');
            if (toggle) toggle.classList.remove('visible');
            expanded = false;
        } else {
            // show items as bullet list (nicer for WA message)
            items.innerHTML = selected.map((s, i) => `<div><span style="color:#fbbf24;">•</span><span style="margin-left:8px;">${s}</span></div>`).join('');
            if (aria) aria.textContent = `${selected.length} items selected: ${selected.join(', ')}`;
            builder.classList.add('visible');
            if (toggle) toggle.classList.add('visible');
            // if already expanded keep state, otherwise stay peek
            if (expanded) builder.classList.add('expanded'); else builder.classList.remove('expanded');
        }

        // mark product cards as selected if they match
        document.querySelectorAll('.product-card').forEach(c => {
            const n = c.querySelector('.product-name');
            if (!n) return;
            const name = n.innerText.trim();
            if (selected.indexOf(name) > -1) c.classList.add('selected'); else c.classList.remove('selected');
        });

        // Update nav cart count
        const navCount = document.getElementById('navCartCount');
        if (navCount) navCount.textContent = selected.length;

        // Persist
        saveSelection();
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

    function clearAutoCollapse() {
        try {
            if (window._mixAutoCollapseTimer) { clearTimeout(window._mixAutoCollapseTimer); window._mixAutoCollapseTimer = null; }
        } catch (e) {}
    }

    function setAutoCollapse() {
        clearAutoCollapse();
        try {
            window._mixAutoCollapseTimer = setTimeout(() => {
                expandBuilder(false);
            }, 5000);
        } catch (e) {}
    }

    function showToast(msg) {
        const toast = document.getElementById('mixToast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('visible');
        try { if (window._mixToastTimer) clearTimeout(window._mixToastTimer); } catch(e) {}
        window._mixToastTimer = setTimeout(() => toast.classList.remove('visible'), 2600);
    }

    function expandBuilder(doExpand) {
        const builder = document.getElementById('mixBuilder');
        const toggle = document.getElementById('mixToggle');
        if (!builder || !toggle) return;
        expanded = typeof doExpand === 'boolean' ? doExpand : !expanded;
        if (expanded) {
            builder.classList.add('expanded');
            toggle.setAttribute('aria-expanded','true');
            // set auto-collapse timeout
            setAutoCollapse();
        } else {
            builder.classList.remove('expanded');
            toggle.setAttribute('aria-expanded','false');
            clearAutoCollapse();
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        createBuilder();

        // Load persisted selection and show builder if applicable
        loadSelection();
        updateBuilder();
        expandIfFlagged();
        // Update the nav mix/cart count
        const navCount = document.getElementById('navCartCount');
        if (navCount) navCount.textContent = selected.length;
        // Make cart button open the mix
        const navCartBtn = document.getElementById('navCart');
        if (navCartBtn) navCartBtn.addEventListener('click', (ev) => {
            expandBuilder(true);
            setTimeout(() => document.getElementById('mixToggle')?.classList.add('visible'), 10);
        });

        // If there is a hash target, scroll it into view
        if (location.hash) {
            const el = document.querySelector(location.hash);
            if (el) el.scrollIntoView({behavior: 'smooth', block: 'center'});
        }

        // Search handler (desktop: filter in-place on /products, otherwise submit to /products?q=)
        const searchInput = document.getElementById('siteSearch');
        if (searchInput) {
            const applyFilter = () => {
                const q = searchInput.value.trim().toLowerCase();
                if (location.pathname.includes('/products')) {
                    document.querySelectorAll('.product-card').forEach(card => {
                        const name = (card.querySelector('.product-name')?.innerText || '').toLowerCase();
                        const cat = (card.closest('.category-section')?.querySelector('.category-title')?.innerText || '').toLowerCase();
                        card.style.display = (name.includes(q) || cat.includes(q) || q === '') ? '' : 'none';
                    });
                }
            };

            // live filter on products page
            searchInput.addEventListener('input', () => {
                applyFilter();
            });

            // submit behavior
            searchInput.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter') {
                    const q = searchInput.value.trim();
                    if (!location.pathname.includes('/products')) {
                        location.href = `/products?q=${encodeURIComponent(q)}`;
                    }
                }
            });

            // if products page has ?q= prefill
            try {
                const params = new URLSearchParams(location.search);
                const q = params.get('q');
                if (q) { searchInput.value = q; applyFilter(); }
            } catch (e) {}
        }

        // Handle clicks for adding items from product grid or product detail
        document.body.addEventListener('click', (e) => {
            // Click on inline Add button in product grid
            const addBtn = e.target.closest && e.target.closest('.card-add');
            if (addBtn) {
                const card = addBtn.closest('.product-card');
                if (card) {
                    toggleCard(card);
                    updateBuilder();
                }
                return;
            }

            // Add from product detail "Add to Mix" button (redirects to /products)
            const addDetail = e.target.closest && e.target.closest('.add-to-mix');
            if (addDetail) {
                const name = addDetail.getAttribute('data-name');
                const slug = addDetail.getAttribute('data-slug');
                if (!name) return;
                if (selected.indexOf(name) === -1) {
                    if (selected.length >= MAX_ITEMS) {
                        alert(`You can only select up to ${MAX_ITEMS} items.`);
                        return;
                    }
                    selected.push(name);
                }
                // Persist and redirect to products page (keep mix saved)
                saveSelection();
                // flag to expand the sheet on arrival
                try { localStorage.setItem('squires_mix_expand', '1'); } catch(e) {}
                // redirect to products list and anchor to the product
                const target = slug ? `/products#${slug}` : '/products';
                window.location.href = target;
                return;
            }
        });

        // Handle clear/message/toggle actions
        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'mixClear') {
                selected.length = 0;
                document.querySelectorAll('.product-card.selected').forEach(c => c.classList.remove('selected'));
                updateBuilder();
            }

            if (e.target && (e.target.id === 'mixMessage' || e.target.closest('#mixMessage')) ) {
                if (selected.length === 0) {
                    alert('Please select at least one sweet to message.');
                    return;
                }
                // prettier message with bullets and line breaks
                const lines = ['Hi! I\'d like to order a custom mix:', ...selected.map(s => `• ${s}`), '', 'Thanks!'];
                const text = lines.join('\n');
                const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
            }

            // Copy message to clipboard
            if (e.target && (e.target.id === 'mixCopy' || e.target.closest('#mixCopy'))) {
                if (selected.length === 0) {
                    alert('Please select at least one sweet to copy.');
                    return;
                }
                const lines = ['Hi! I\'d like to order a custom mix:', ...selected.map(s => `• ${s}`), '', 'Thanks!'];
                const text = lines.join('\n');
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(() => showToast('Message copied'))
                    .catch(() => showToast('Could not copy'));
                } else {
                    // fallback
                    const ta = document.createElement('textarea');
                    ta.value = text;
                    document.body.appendChild(ta);
                    ta.select();
                    try { document.execCommand('copy'); showToast('Message copied'); } catch (err) { showToast('Could not copy'); }
                    document.body.removeChild(ta);
                }
            }

            // Toggle expand via floating button
            if (e.target && e.target.id === 'mixToggle') {
                expandBuilder();
                return;
            }

            // Handle clicking the drag handle to expand/collapse
            if (e.target && e.target.id === 'mixHandle') {
                expandBuilder();
                return;
            }
        });

        // Keyboard: Escape to collapse
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                expandBuilder(false);
            }
        });

        // Make initial state reflect any selected items (none at load)
        updateBuilder();
    });
})();

