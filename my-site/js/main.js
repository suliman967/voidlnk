// ...existing code...
document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    // Navigation functionality - guard nodes so script never throws
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link') || [];

    // Navbar scroll effect
    let lastScrollTop = 0;
    if (navbar) {
        window.addEventListener('scroll', function () {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            lastScrollTop = scrollTop;
        });
    }

    // Mobile menu toggle (guarded)
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            const isExpanded = navMenu.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Close mobile menu when clicking nav links (guard)
    if (navLinks && navLinks.length) {
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                if (navMenu) navMenu.classList.remove('active');
                if (mobileMenuToggle) {
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Portfolio functionality (guarded)
    const portfolioGrid = document.getElementById('portfolio-grid');
    const filterButtons = document.querySelectorAll('.filter-btn') || [];
    let portfolioData = [];

    async function loadPortfolioData() {
        try {
            const response = await fetch('./assets/projects.json');
            portfolioData = await response.json();
            if (portfolioGrid && portfolioData.projects) renderPortfolio(portfolioData.projects);
        } catch (error) {
            console.error('Error loading portfolio data:', error);
        }
    }

    function renderPortfolio(projects = []) {
        if (!portfolioGrid) return;
        portfolioGrid.innerHTML = '';
        projects.forEach(project => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.setAttribute('data-category', project.category || 'uncategorized');

            portfolioItem.innerHTML = `
                <img src="${project.thumbnail}" alt="${project.title}" class="portfolio-image">
                <div class="portfolio-overlay">
                    <h3 class="portfolio-title">${project.title}</h3>
                    <div class="portfolio-metric">${project.metric || ''}</div>
                    <div class="portfolio-link-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                            <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z"/>
                        </svg>
                    </div>
                </div>
            `;

            portfolioItem.addEventListener('click', function () {
                if (project) openLightbox(project);
            });

            portfolioGrid.appendChild(portfolioItem);
        });
    }

    // filter buttons - safely reference data
    if (filterButtons && filterButtons.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                const filter = this.getAttribute('data-filter');
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                let projects = (portfolioData && portfolioData.projects) ? portfolioData.projects : [];
                if (filter && filter !== 'all') {
                    projects = projects.filter(project => project.category === filter);
                }
                renderPortfolio(projects);
            });
        });
    }

    // Lightbox functionality (guard nodes)
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');
    const lightboxLink = document.querySelector('.lightbox-link');

    function openLightbox(project = {}) {
        if (!lightbox || !lightboxImage) return;
        lightboxImage.src = project.image || project.thumbnail || '';
        lightboxImage.alt = project.title || '';
        if (lightboxTitle) lightboxTitle.textContent = project.title || '';
        if (lightboxDescription) lightboxDescription.textContent = project.description || '';
        if (lightboxLink) lightboxLink.href = project.link || '#';

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (lightboxClose) lightboxClose.focus();
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // --- Testimonial YouTube video logic ---
    const playBtn = document.getElementById('playTestimonialBtn');
    const youtubeIframe = document.getElementById('marcYoutubeIframe');
    const poster = document.getElementById('testimonialPoster');

    if (playBtn && youtubeIframe && poster) {
        playBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const base = youtubeIframe.getAttribute('data-src') ||
              'https://www.youtube-nocookie.com/embed/ejqXK62ttEk?rel=0&modestbranding=1';

            if (!youtubeIframe.src) {
                youtubeIframe.src = base + (base.indexOf('?') === -1 ? '?autoplay=1' : '&autoplay=1');
            }

            youtubeIframe.style.display = 'block';
            poster.style.display = 'none';
        });
    }

    // Contact form: only wire if the markup exists (prevents runtime errors)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('.form-input');

        function validateField(field) {
            const value = field.value.trim();
            const errorElement = document.getElementById(field.name + '-error');
            let isValid = true;
            let errorMessage = '';

            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'This field is required.';
            } else if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
            }

            if (errorElement) errorElement.textContent = errorMessage;
            field.classList.toggle('error', !isValid);
            return isValid;
        }

        formInputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateField(this);
            });
            input.addEventListener('input', function () {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let isFormValid = true;
            formInputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });
            if (isFormValid) {
                alert('Thank you for your message! I\\')('ll get back to you soon.');
            }
        });
    }

    // Initialize
    loadPortfolioData();

    // Do this on load to apply global "loaded" state
    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
    });

    // Single, coherent console message
    console.log('Suliman website loaded successfully!');
});
// ...existing code...