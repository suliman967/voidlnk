// EDIT HERE: Main JavaScript functionality for VOIDLNK portfolio website

document.addEventListener('DOMContentLoaded', function() {
    // EDIT HERE: Smooth scrolling configuration
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // EDIT HERE: Navigation functionality
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        
        const isExpanded = navMenu.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // EDIT HERE: Portfolio functionality
    const portfolioGrid = document.getElementById('portfolio-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let portfolioData = [];
    
    // Load portfolio data
    async function loadPortfolioData() {
        try {
            const response = await fetch('./assets/projects.json');
            portfolioData = await response.json();
            renderPortfolio(portfolioData.projects);
        } catch (error) {
            console.error('Error loading portfolio data:', error);
        }
    }
    
    // Render portfolio items
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
            
            // Add click event for lightbox
            portfolioItem.addEventListener('click', function() {
                openLightbox(project);
            });
            
            portfolioGrid.appendChild(portfolioItem);
        });
        
        // Trigger fade-in animation
        setTimeout(() => {
            document.querySelectorAll('.portfolio-item').forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('fade-in-up');
                }, index * 100);
            });
        }, 100);
    }
    
    // Portfolio filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            let filteredProjects = portfolioData.projects;
            if (filter !== 'all') {
                filteredProjects = portfolioData.projects.filter(project => project.category === filter);
            }
            
            renderPortfolio(filteredProjects);
        });
    });
    
    // EDIT HERE: Lightbox functionality
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
        
        // Focus management for accessibility
        lightboxClose.focus();
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Escape key to close lightbox
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    // EDIT HERE: Testimonials carousel
    const testimonialTrack = document.getElementById('testimonial-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.testimonial-slide').length;
    
    function updateCarousel() {
        const translateX = -currentSlide * 100;
        testimonialTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
            dot.setAttribute('aria-selected', index === currentSlide);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            updateCarousel();
        });
    });
    
    // Auto-rotate testimonials
    setInterval(nextSlide, 5000);
    
    // EDIT HERE: Contact form functionality
    const contactForm = document.getElementById('contact-form');
    const formInputs = contactForm.querySelectorAll('.form-input');
    
    // Form validation
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
    
    // Real-time validation
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isFormValid = true;
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (isFormValid) {
            // EDIT HERE: Replace with your form submission logic
            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
        }
    });
    
    // EDIT HERE: Scroll animations using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.service-card, .about-content, .testimonials, .contact-form');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // EDIT HERE: Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-layer');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Chess pieces parallax
        const chessElements = document.querySelectorAll('.chess-piece');
        chessElements.forEach((element, index) => {
            const speed = 0.3 + (index * 0.2);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // EDIT HERE: 3D hover effects for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateX(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0deg)';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
    
    // EDIT HERE: Initialize everything
    loadPortfolioData();
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    console.log('VOIDLNK portfolio website loaded successfully!');
});

