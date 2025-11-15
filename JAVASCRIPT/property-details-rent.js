// property-details-rent.js - UPDATED FOR SPA COMPATIBILITY

// ===== GLOBAL INITIALIZATION FUNCTION =====
window.initializePropertyDetails = function() {
    console.log('🎯 SPA: Initializing Property Details Content');
    initializePropertyDetailsPage();
};

// ===== MAIN INITIALIZATION FUNCTION =====
function initializePropertyDetailsPage() {
    console.log('🏠 Initializing Property Details Page');
    
    // 1. BACK TO DASHBOARD - SPA COMPATIBLE
    const backButton = document.getElementById('backToDashboard');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔙 Back button clicked');
            
            if (window.spa && typeof window.spa.navigateToSection === 'function') {
                window.spa.navigateToSection('browse');
            } else {
                window.location.href = '/spa.html?section=browse';
            }
        });
    }

    // 2. MAP DIRECTIONS BUTTON
    const mapDirectionBtn = document.querySelector('.map-direction-btn');
    if (mapDirectionBtn) {
        mapDirectionBtn.addEventListener('click', function() {
            const address = "24 Bourdillon Road, Ikoyi, Lagos";
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
            window.open(mapsUrl, '_blank');
            console.log('🗺️ Opening directions to:', address);
        });
    }

    // 3. LIKE CHECKBOX - SHOW BOOK INSPECTION BUTTON
    const likeCheckbox = document.getElementById('likeCheckbox');
    const proceedButtonContainer = document.getElementById('proceedButtonContainer');
    
    if (likeCheckbox && proceedButtonContainer) {
        likeCheckbox.addEventListener('change', function() {
            console.log('🔘 Checkbox changed:', this.checked);
            if (this.checked) {
                proceedButtonContainer.style.display = 'block';
                setTimeout(() => {
                    proceedButtonContainer.classList.add('show');
                }, 10);
            } else {
                proceedButtonContainer.classList.remove('show');
                setTimeout(() => {
                    proceedButtonContainer.style.display = 'none';
                }, 300);
            }
        });
        
        // Set initial state
        proceedButtonContainer.style.display = 'none';
    }

    // 4. BOOK INSPECTION BUTTON
    const bookInspectionBtn = document.getElementById('bookInspectionBtn');
    if (bookInspectionBtn) {
        bookInspectionBtn.addEventListener('click', handleBookInspection);
    }

    // 5. IMAGE CAROUSEL
    initializeCarousel();

    // 6. VIDEO THUMBNAIL SWITCHING
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const mainVideo = document.getElementById('mainVideo');
    
    if (videoThumbnails.length > 0 && mainVideo) {
        videoThumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', function() {
                videoThumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                if (index === 0) {
                    mainVideo.src = "https://assets.mixkit.co/videos/preview/mixkit-a-residential-building-facade-44517-large.mp4";
                    mainVideo.poster = "https://images.unsplash.com/photo-1564019471349-34e8a875c5c8?w=800&h=450&fit=crop";
                } else if (index === 1) {
                    mainVideo.src = "https://assets.mixkit.co/videos/preview/mixkit-countryside-aerial-view-44578-large.mp4";
                    mainVideo.poster = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=450&fit=crop";
                }
                
                mainVideo.load();
            });
        });
    }

    // 7. UPDATE PROPERTY CONTEXT
    const propertyContext = document.getElementById('propertyContext');
    if (propertyContext) {
        propertyContext.textContent = 'Viewing from Rental Properties';
    }

    // 8. REVIEW SYSTEM
    initializeReviewSystem();

    // 9. PROPERTY DATA
    initializePropertyData();

    // 10. FLOATING CALL BUTTON
    initializeFloatingCallButton();

    // 11. TAB FUNCTIONALITY - MOST IMPORTANT FOR SPA
    initializeTabs();

    console.log('✅ All Property Details functionality initialized');
}

// ===== TAB FUNCTIONALITY =====
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabsNav = document.getElementById('propertyTabsNav');
    
    console.log('📑 Initializing tabs:', tabButtons.length, 'buttons found');
    
    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            console.log('🔄 Switching to tab:', tabId);
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetTab = document.getElementById(`${tabId}-tab`);
            if (targetTab) {
                targetTab.classList.add('active');
                console.log('✅ Tab switched successfully');
            }
        });
    });
    
    // Sticky tab navigation
    if (tabsNav) {
        const observer = new IntersectionObserver(
            ([e]) => {
                const isSticky = e.intersectionRatio < 1;
                e.target.classList.toggle('sticky', isSticky);
            },
            { threshold: [1] }
        );
        
        observer.observe(tabsNav);
        console.log('📌 Sticky tabs initialized');
    }
}

// ===== CAROUSEL FUNCTIONS =====
function initializeCarousel() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    const thumbnailsContainer = document.querySelector('.thumbnails-container');
    
    const propertyImages = [
        '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
        'https://images.unsplash.com/photo-1564019471349-34e8a875c5c8?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1545323157-f6f63c0d66a7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
    ];

    // Clear existing content
    if (dotsContainer) dotsContainer.innerHTML = '';
    if (thumbnailsContainer) thumbnailsContainer.innerHTML = '';

    // Create slides, dots, and thumbnails
    propertyImages.forEach((imageSrc, index) => {
        // Create dots
        if (dotsContainer) {
            const dot = document.createElement('span');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => showSlide(index));
            dotsContainer.appendChild(dot);
        }

        // Create thumbnails
        if (thumbnailsContainer) {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail-item ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `<img src="${imageSrc}" alt="Property image ${index + 1}" loading="lazy">`;
            thumbnail.addEventListener('click', () => showSlide(index));
            thumbnailsContainer.appendChild(thumbnail);
        }
    });

    const dots = document.querySelectorAll('.carousel-dot');
    const thumbnails = document.querySelectorAll('.thumbnail-item');

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        if (slides[index]) slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        if (thumbnails[index]) thumbnails[index].classList.add('active');
        
        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= propertyImages.length) nextIndex = 0;
        showSlide(nextIndex);
    }

    function prevSlide() {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) prevIndex = propertyImages.length - 1;
        showSlide(prevIndex);
    }

    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }

    // Auto-advance
    setInterval(nextSlide, 5000);
}

// ===== REVIEW SYSTEM FUNCTIONS =====
function initializeReviewSystem() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const reviewCards = document.querySelectorAll('.review-card');
    const loadMoreBtn = document.getElementById('loadMoreReviews');
    const helpfulButtons = document.querySelectorAll('.helpful-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            filterReviews(filter);
        });
    });

    helpfulButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentCount = parseInt(this.textContent.match(/\((\d+)\)/)[1]) || 0;
            this.innerHTML = `<i class="fas fa-thumbs-up"></i> Helpful (${currentCount + 1})`;
            this.style.backgroundColor = 'var(--accent-color)';
            this.style.color = 'var(--white)';
            this.style.borderColor = 'var(--accent-color)';
            this.disabled = true;
            showNotification('Thanks for your feedback!', 'success');
        });
    });

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                showNotification('No more reviews available', 'info');
                this.innerHTML = '<i class="fas fa-check"></i> All Reviews Loaded';
                this.style.backgroundColor = 'var(--success)';
            }, 1500);
        });
    }

    filterReviews('all');
}

function filterReviews(filter) {
    const reviewCards = document.querySelectorAll('.review-card');
    let visibleCount = 0;

    reviewCards.forEach(card => {
        const rating = card.getAttribute('data-rating');
        const isVerified = card.getAttribute('data-verified') === 'true';
        
        let shouldShow = false;

        switch(filter) {
            case 'all':
                shouldShow = true;
                break;
            case '5':
            case '4':
            case '3':
                shouldShow = rating === filter;
                break;
            case 'verified':
                shouldShow = isVerified;
                break;
            default:
                shouldShow = true;
        }

        if (shouldShow) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== PROPERTY DATA FUNCTIONS =====
function initializePropertyData() {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id') || 'rent_123';
    
    const propertyData = {
        id: propertyId,
        title: "Luxury 3-Bedroom Apartment in Ikoyi",
        price: "₦4,500,000/year",
        location: "Ikoyi, Lagos Island",
        bedrooms: "3",
        bathrooms: "3", 
        size: "180 sqm",
        type: "Apartment",
        description: "This stunning 3-bedroom apartment offers luxurious living in the heart of Ikoyi. Featuring modern finishes, spacious rooms, and premium amenities, this property is perfect for families seeking comfort and style.",
        isVerified: true,
        isFeatured: true,
        isNew: true
    };
    
    updatePropertyDetails(propertyData);
}

function updatePropertyDetails(data) {
    const elements = {
        'propertyTitle': data.title,
        'propertyPrice': data.price,
        'propertyLocation': data.location,
        'propertyId': data.id,
        'bedroomsCount': data.bedrooms,
        'bathroomsCount': data.bathrooms,
        'propertySize': data.size,
        'propertyType': data.type,
        'propertyDescription': data.description
    };

    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = elements[id];
    });

    // Update badges
    const badges = {
        'verifiedBadge': data.isVerified,
        'featuredBadge': data.isFeatured,
        'newBadge': data.isNew
    };

    Object.keys(badges).forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = badges[id] ? 'block' : 'none';
    });
}

// ===== FLOATING CALL BUTTON =====
function initializeFloatingCallButton() {
    const floatingBtn = document.getElementById('floatingCallBtn');
    if (!floatingBtn) return;

    let scrollTimer;

    function showButton() {
        floatingBtn.classList.add('visible');
        clearTimeout(scrollTimer);
    }

    function hideButton() {
        scrollTimer = setTimeout(() => {
            floatingBtn.classList.remove('visible');
        }, 3000);
    }

    floatingBtn.addEventListener('click', function() {
        window.open('tel:+2349010851071');
    });

    window.addEventListener('scroll', function() {
        showButton();
        clearTimeout(scrollTimer);
        hideButton();
    });

    // Show initially
    setTimeout(() => {
        floatingBtn.classList.add('visible');
    }, 1000);
}

// ===== BOOK INSPECTION FUNCTION =====
function handleBookInspection() {
    const propertyData = getCurrentProperty();
    
    // Check if user is logged in
    const isLoggedIn = checkUserLoggedIn();
    
    if (!isLoggedIn) {
        localStorage.setItem('domihive_pending_booking', JSON.stringify({
            property: propertyData,
            intended_action: 'book_inspection',
            redirect_to: 'book-inspection.html',
            timestamp: new Date().toISOString()
        }));
        
        localStorage.setItem('domihive_selected_property', JSON.stringify(propertyData));
        
        showNotification('Please sign up to book an inspection', 'info');
        
        setTimeout(() => {
            if (window.spa && typeof window.spa.navigateToSection === 'function') {
                window.spa.navigateToSection('signup');
            } else {
                window.location.href = '/Pages/signup.html';
            }
        }, 1500);
        
    } else {
        localStorage.setItem('domihive_selected_property', JSON.stringify(propertyData));
        
        showNotification('Redirecting to booking...', 'success');
        
        setTimeout(() => {
            if (window.spa && typeof window.spa.navigateToSection === 'function') {
                window.spa.navigateToSection('book-inspection');
            } else {
                window.location.href = '/Pages/book-inspection.html';
            }
        }, 1000);
    }
}

// ===== HELPER FUNCTIONS =====
function checkUserLoggedIn() {
    const userToken = localStorage.getItem('user_token');
    const domiHiveUser = localStorage.getItem('domihive_user');
    const authToken = localStorage.getItem('auth_token');
    const isAuthenticated = localStorage.getItem('is_authenticated');
    
    return !!(userToken || domiHiveUser || authToken || isAuthenticated === 'true');
}

function getCurrentProperty() {
    return {
        id: document.getElementById('propertyId')?.textContent || 'rent_123',
        title: document.getElementById('propertyTitle')?.textContent || 'Luxury Property',
        price: document.getElementById('propertyPrice')?.textContent || '₦4,500,000/year',
        location: document.getElementById('propertyLocation')?.textContent || 'Ikoyi, Lagos',
        bedrooms: document.getElementById('bedroomsCount')?.textContent || '3',
        bathrooms: document.getElementById('bathroomsCount')?.textContent || '3',
        size: document.getElementById('propertySize')?.textContent || '180 sqm',
        type: document.getElementById('propertyType')?.textContent || 'Apartment'
    };
}

function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.global-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `global-notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// ===== AUTO-INITIALIZE FOR DIRECT PAGE LOADS =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page loaded directly - initializing property details');
    initializePropertyDetailsPage();
});

console.log('✅ Property Details JavaScript Loaded - SPA Ready');