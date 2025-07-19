// Main JavaScript functionality for VOIDLNK portfolio website
document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    // Navigation functionality
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScrollTop = scrollTop;
    });

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        const isExpanded = navMenu.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Portfolio functionality (same as yours)
    const portfolioGrid = document.getElementById('portfolio-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let portfolioData = [];

    async function loadPortfolioData() {
        try {
            const response = await fetch('./assets/projects.json');
            portfolioData = await response.json();
            renderPortfolio(portfolioData.projects);
        } catch (error) {
            console.error('Error loading portfolio data:', error);
        }
    }

    function renderPortfolio(projects) {
        portfolioGrid.innerHTML = '';
        projects.forEach(project => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.setAttribute('data-category', project.category);

            portfolioItem.innerHTML = `
                <img src="${project.thumbnail}" alt="${project.title}" class="portfolio-image">
                <div class="portfolio-overlay">
                    <h3 class="portfolio-title">${project.title}</h3>
                    <div class="portfolio-metric">${project.metric}</div>
                    <div class="portfolio-link-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z"/>
                        </svg>
                    </div>
                </div>
            `;

            portfolioItem.addEventListener('click', function () {
                openLightbox(project);
            });

            portfolioGrid.appendChild(portfolioItem);
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            let filteredProjects = portfolioData.projects;
            if (filter !== 'all') {
                filteredProjects = portfolioData.projects.filter(project => project.category === filter);
            }
            renderPortfolio(filteredProjects);
        });
    });

    // Lightbox functionality (same as yours)
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');
    const lightboxLink = document.querySelector('.lightbox-link');

    function openLightbox(project) {
        lightboxImage.src = project.image;
        lightboxImage.alt = project.title;
        lightboxTitle.textContent = project.title;
        lightboxDescription.textContent = project.description;
        lightboxLink.href = project.link;

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
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

            // Dynamically set YouTube src on click to avoid autoplay issues
            youtubeIframe.src = 'https://www.youtube.com/embed/ejqXK62ttEk?autoplay=1&rel=0&mute=0';
            youtubeIframe.style.display = 'block';
            poster.style.display = 'none';
        });
    }

    // Contact form functionality (same as yours)
    const contactForm = document.getElementById('contact-form');
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

        errorElement.textContent = errorMessage;
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
            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
        }
    });

    // Initialize
    loadPortfolioData();

    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
    });

    console.log('VOIDLNK portfolio website loaded successfully!');
});
