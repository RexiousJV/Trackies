
document.addEventListener('DOMContentLoaded', function() {
    
    initMobileNav();
    
    initVehicleCarousel();
    
    initFormValidation();
    
    initSmoothScroll();
    
    initVehicleFilters();
    
    initScrollAnimations();
});

function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

function initVehicleCarousel() {
    const carousel = document.getElementById('vehicle-carousel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    const cards = carousel.querySelectorAll('.vehicle-card');
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    
    window.addEventListener('resize', function() {
        cardsPerView = getCardsPerView();
        updateCarousel();
    });
    
    function getCardsPerView() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1024) return 2;
        return 4;
    }
    
    function updateCarousel() {
        cards.forEach(card => {
            card.style.display = 'none';
        });
        
        for (let i = 0; i < cardsPerView; i++) {
            const index = (currentIndex + i) % cards.length;
            if (cards[index]) {
                cards[index].style.display = 'block';
            }
        }
        
        updateButtonStates();
    }
    
    function updateButtonStates() {
        if (currentIndex === 0) {
            prevBtn.style.opacity = '0.5';
        } else {
            prevBtn.style.opacity = '1';
        }
        
        if (currentIndex >= cards.length - cardsPerView) {
            nextBtn.style.opacity = '0.5';
        } else {
            nextBtn.style.opacity = '1';
        }
    }
    
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (currentIndex < cards.length - cardsPerView) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    updateCarousel();
    
    let autoPlayInterval = setInterval(function() {
        if (currentIndex < cards.length - cardsPerView) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }, 5000);
    
    carousel.addEventListener('mouseenter', function() {
        clearInterval(autoPlayInterval);
    });
    
    carousel.addEventListener('mouseleave', function() {
        autoPlayInterval = setInterval(function() {
            if (currentIndex < cards.length - cardsPerView) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateCarousel();
        }, 5000);
    });
}

function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            let firstInvalidField = null;
            
            const existingErrors = form.querySelectorAll('.error-message');
            existingErrors.forEach(error => error.remove());
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff6b35';
                    
                    if (!firstInvalidField) {
                        firstInvalidField = field;
                    }
                } else {
                    field.style.borderColor = '';
                }
                
                if (field.type === 'email' && field.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        isValid = false;
                        field.style.borderColor = '#ff6b35';
                        if (!firstInvalidField) {
                            firstInvalidField = field;
                        }
                    }
                }
            });
            
            if (isValid) {
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Form submitted successfully! We will contact you soon.';
                form.appendChild(successMessage);
                
                setTimeout(function() {
                    form.reset();
                    successMessage.remove();
                }, 3000);
            } else {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Please fill in all required fields correctly.';
                form.appendChild(errorMessage);
                
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
                
                setTimeout(function() {
                    errorMessage.remove();
                }, 5000);
            }
        });
        
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.style.borderColor = '';
            });
        });
    });
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href.length <= 1) return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href.includes('.html')) {
                return;
            }
        });
    });
}

function initVehicleFilters() {
    const filterForm = document.querySelector('.filter-bar form');
    
    if (!filterForm) return;
    
    const makeFilter = document.getElementById('make');
    const modelFilter = document.getElementById('model');
    const priceFilter = document.getElementById('price');
    const yearFilter = document.getElementById('year');
    const vehicleCards = document.querySelectorAll('.vehicles-grid .vehicle-card');
    
    function applyFilters() {
        const makeValue = makeFilter ? makeFilter.value.toLowerCase() : '';
        const modelValue = modelFilter ? modelFilter.value.toLowerCase() : '';
        const priceValue = priceFilter ? priceFilter.value : '';
        const yearValue = yearFilter ? yearFilter.value : '';
        
        vehicleCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            let shouldShow = true;
            
            if (makeValue && makeValue !== 'all' && !cardText.includes(makeValue)) {
                shouldShow = false;
            }
            
            if (modelValue && !cardText.includes(modelValue)) {
                shouldShow = false;
            }
            
            if (priceValue && priceValue !== 'all') {
                const priceElement = card.querySelector('.vehicle-price');
                if (priceElement) {
                    const price = parseInt(priceElement.textContent.replace(/[^0-9]/g, ''));
                    
                    if (priceValue === 'under-50' && price >= 50) {
                        shouldShow = false;
                    } else if (priceValue === '50-100' && (price < 50 || price > 100)) {
                        shouldShow = false;
                    } else if (priceValue === '100-150' && (price < 100 || price > 150)) {
                        shouldShow = false;
                    } else if (priceValue === 'over-150' && price <= 150) {
                        shouldShow = false;
                    }
                }
            }
            
            if (yearValue && yearValue !== 'all') {
                const year = parseInt(yearValue);
                if (!cardText.includes(year.toString())) {
                    shouldShow = false;
                }
            }
            
            if (shouldShow) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    if (makeFilter) makeFilter.addEventListener('change', applyFilters);
    if (modelFilter) modelFilter.addEventListener('input', applyFilters);
    if (priceFilter) priceFilter.addEventListener('change', applyFilters);
    if (yearFilter) yearFilter.addEventListener('change', applyFilters);
    
    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        applyFilters();
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.vehicle-card, .service-card, .feature, .testimonial, .finance-card, .package-card, .step-card');
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function initFileUpload() {
    const fileInput = document.getElementById('photos');
    const fileUploadDiv = document.querySelector('.file-upload');
    
    if (!fileInput || !fileUploadDiv) return;
    
    fileUploadDiv.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        const files = this.files;
        const fileNames = Array.from(files).map(file => file.name).join(', ');
        
        if (fileNames) {
            const fileText = fileUploadDiv.querySelector('p');
            if (fileText) {
                fileText.textContent = `Selected: ${fileNames}`;
            }
        }
    });
    
    fileUploadDiv.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = '#00d4ff';
        this.style.backgroundColor = 'rgba(0, 212, 255, 0.1)';
    });
    
    fileUploadDiv.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = '';
        this.style.backgroundColor = '';
    });
    
    fileUploadDiv.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '';
        this.style.backgroundColor = '';
        
        const files = e.dataTransfer.files;
        fileInput.files = files;
        
        const fileNames = Array.from(files).map(file => file.name).join(', ');
        const fileText = this.querySelector('p');
        if (fileText) {
            fileText.textContent = `Selected: ${fileNames}`;
        }
    });
}

if (document.querySelector('.file-upload')) {
    initFileUpload();
}

const enquireButtons = document.querySelectorAll('.vehicle-card .btn');
enquireButtons.forEach(button => {
    button.addEventListener('click', function() {
        const vehicleCard = this.closest('.vehicle-card');
        const vehicleName = vehicleCard.querySelector('h3').textContent;
        
        sessionStorage.setItem('selectedVehicle', vehicleName);
        
        window.location.href = 'contact.html';
    });
});

if (window.location.pathname.includes('contact.html')) {
    const selectedVehicle = sessionStorage.getItem('selectedVehicle');
    const messageField = document.getElementById('message');
    
    if (selectedVehicle && messageField) {
        messageField.value = `I'm interested in the ${selectedVehicle}. Please contact me with more information.`;
        sessionStorage.removeItem('selectedVehicle');
    }
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

setActiveNavLink();

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
    }
    
    lastScroll = currentScroll;
});

console.log('%c🚗 Welcome to Trackies!', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%cDrive Your Dream Today', 'color: #b8c5d6; font-size: 14px;');
