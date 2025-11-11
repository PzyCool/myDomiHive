// property-details-rent.js - UPDATED WITH LOGIN CHECK FOR BOOK INSPECTION

// ===== CHECK IF USER IS COMING FROM HOMEPAGE =====
function isComingFromHomepage() {
    const referrer = document.referrer;
    const fromHomepage = referrer.includes('index.html') || referrer.includes('/') && !referrer.includes('dashboard');
    const fromDirectAccess = !referrer; // User typed URL directly
    
    console.log('Referrer:', referrer);
    console.log('From homepage:', fromHomepage);
    console.log('Direct access:', fromDirectAccess);
    
    return fromHomepage || fromDirectAccess;
}

// ===== REDIRECT TO SIGNUP IF COMING FROM HOMEPAGE =====
function setupBookingButtonRedirect(buttonId) {
    const button = document.getElementById(buttonId);
    if (button && isComingFromHomepage()) {
        console.log(`🔄 Setting up ${buttonId} to redirect to signup`);
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`📅 ${buttonId} clicked - user not logged in, redirecting to signup`);
            
            // Store the current property for after signup
            const currentProperty = localStorage.getItem('current_property_view');
            if (currentProperty) {
                sessionStorage.setItem('domihive_redirect_after_signup', window.location.pathname);
                sessionStorage.setItem('domihive_booking_intent', 'true');
            }
            
            window.location.href = '/Pages/signup.html';
        });
        
        // Optional: Change button text to indicate signup required
        button.innerHTML = button.innerHTML.replace('Book', 'Sign Up to Book');
    }
}

// ===== INITIALIZE BASED ON USER SOURCE =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Checking user source...');
    
    // Setup booking button redirects if coming from homepage
    const bookingButtons = {
        'property-details-rent.html': 'bookInspectionBtn',
        'property-details-shortlet.html': 'bookShortletBtn', 
        'property-details-commercial.html': 'scheduleTourBtn',
        'property-details-buy.html': 'bookViewingBtn'
    };
    
    const currentPage = window.location.pathname.split('/').pop();
    const buttonId = bookingButtons[currentPage];
    
    if (buttonId) {
        setupBookingButtonRedirect(buttonId);
    }
    
    // Update back button based on source
    const backButton = document.getElementById('backToDashboard');
    if (backButton && isComingFromHomepage()) {
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Home';
        backButton.addEventListener('click', function() {
            window.location.href = '/index.html';
        });
    }
});

// ===== MAIN INITIALIZATION FUNCTION =====
function initializePropertyDetailsPage() {
    console.log('🏠 Initializing Property Details Page');
    
    // 1. BACK TO DASHBOARD - UPDATED FOR SPA
    const backButton = document.getElementById('backToDashboard');
    if (backButton) {
        backButton.addEventListener('click', function() {
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
        });
    }

    // 3. LIKE CHECKBOX - SHOW BOOK INSPECTION BUTTON (FIXED)
    const likeCheckbox = document.getElementById('likeCheckbox');
    const proceedButtonContainer = document.getElementById('proceedButtonContainer');
    
    if (likeCheckbox && proceedButtonContainer) {
        console.log('✅ Setting up checkbox functionality');
        
        // Remove any existing event listeners first
        const newCheckbox = likeCheckbox.cloneNode(true);
        likeCheckbox.parentNode.replaceChild(newCheckbox, likeCheckbox);
        
        // Add new event listener
        newCheckbox.addEventListener('change', function() {
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
        proceedButtonContainer.style.display = newCheckbox.checked ? 'block' : 'none';
    }

    // 4. BOOK INSPECTION BUTTON - UPDATED WITH LOGIN CHECK
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

    // 8. IMAGE ERROR HANDLING
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            console.log('Image failed to load:', e.target.src);
            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop';
            e.target.alt = 'Image not available';
        }
    }, true);

    // 9. REVIEW SYSTEM
    initializeReviewSystem();

    // 10. PROPERTY DATA
    initializePropertyData();

    // 11. FLOATING CALL BUTTON
    initializeFloatingCallButton();

    console.log('✅ All Property Details functionality initialized');
}

// ===== UPDATED BOOK INSPECTION FUNCTION =====
function handleBookInspection() {
    console.log('📅 Book Inspection clicked');
    
    const propertyData = getCurrentProperty();
    
    // Check if user is logged in
    const isLoggedIn = checkUserLoggedIn();
    
    if (!isLoggedIn) {
        // User is NOT logged in - Store intent and redirect to signup
        console.log('👤 User not logged in - storing booking intent');
        
        localStorage.setItem('domihive_pending_booking', JSON.stringify({
            property: propertyData,
            intended_action: 'book_inspection',
            redirect_to: 'book-inspection.html',
            timestamp: new Date().toISOString(),
            message: 'Continue to book inspection for this property'
        }));
        
        // Also store the property for the dashboard
        localStorage.setItem('domihive_selected_property', JSON.stringify(propertyData));
        
        showNotification('Please sign up to book an inspection', 'info');
        
        // Redirect to signup after short delay
        setTimeout(() => {
            if (window.spa && typeof window.spa.navigateToSection === 'function') {
                window.spa.navigateToSection('signup');
            } else {
                window.location.href = '/Pages/signup.html';
            }
        }, 1500);
        
    } else {
        // User IS logged in - Proceed directly to booking
        console.log('👤 User logged in - proceeding to booking');
        
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

// ===== USER AUTHENTICATION CHECK =====
function checkUserLoggedIn() {
    // Check multiple possible authentication indicators
    const userToken = localStorage.getItem('user_token');
    const domiHiveUser = localStorage.getItem('domihive_user');
    const authToken = localStorage.getItem('auth_token');
    const isAuthenticated = localStorage.getItem('is_authenticated');
    
    // Return true if any authentication indicator exists
    return !!(userToken || domiHiveUser || authToken || isAuthenticated === 'true');
}

// ===== GET CURRENT PROPERTY DATA =====
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

    setInterval(nextSlide, 5000);
}

// ===== REVIEW SYSTEM FUNCTIONS =====
function initializeReviewSystem() {
    console.log('Initializing review system...');
    
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
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.display = 'none';
        }
    });

    const loadMoreBtn = document.getElementById('loadMoreReviews');
    if (loadMoreBtn && visibleCount > 0) {
        loadMoreBtn.style.display = 'block';
    } else if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }

    console.log(`Filtered to ${visibleCount} reviews with filter: ${filter}`);
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
    if (document.getElementById('propertyTitle')) {
        document.getElementById('propertyTitle').textContent = data.title;
    }
    if (document.getElementById('propertyPrice')) {
        document.getElementById('propertyPrice').textContent = data.price;
    }
    if (document.getElementById('propertyLocation')) {
        document.getElementById('propertyLocation').textContent = data.location;
    }
    if (document.getElementById('propertyId')) {
        document.getElementById('propertyId').textContent = data.id;
    }
    if (document.getElementById('bedroomsCount')) {
        document.getElementById('bedroomsCount').textContent = data.bedrooms;
    }
    if (document.getElementById('bathroomsCount')) {
        document.getElementById('bathroomsCount').textContent = data.bathrooms;
    }
    if (document.getElementById('propertySize')) {
        document.getElementById('propertySize').textContent = data.size;
    }
    if (document.getElementById('propertyType')) {
        document.getElementById('propertyType').textContent = data.type;
    }
    if (document.getElementById('propertyDescription')) {
        document.getElementById('propertyDescription').textContent = data.description;
    }
    
    if (document.getElementById('verifiedBadge')) {
        document.getElementById('verifiedBadge').style.display = data.isVerified ? 'block' : 'none';
    }
    if (document.getElementById('featuredBadge')) {
        document.getElementById('featuredBadge').style.display = data.isFeatured ? 'block' : 'none';
    }
    if (document.getElementById('newBadge')) {
        document.getElementById('newBadge').style.display = data.isNew ? 'block' : 'none';
    }
}

// ===== FLOATING CALL BUTTON =====
function initializeFloatingCallButton() {
    const floatingBtn = document.getElementById('floatingCallBtn');
    let scrollTimer;
    let isScrolling = false;

    function showButton() {
        floatingBtn.classList.add('visible');
        clearTimeout(scrollTimer);
    }

    function hideButton() {
        scrollTimer = setTimeout(() => {
            floatingBtn.classList.remove('visible');
            isScrolling = false;
        }, 30000);
    }

    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            isScrolling = true;
            showButton();
        }
        
        clearTimeout(scrollTimer);
        hideButton();
    });

    floatingBtn.addEventListener('click', function() {
        window.open('tel:+2349010851071');
    });

    console.log('📞 Floating call button initialized');
}

// ===== NOTIFICATION SYSTEM =====
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
    
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(100%); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes slideOutRight {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// ===== SPA INTEGRATION =====
window.spaPropertyDetailsInit = function() {
    console.log('🎯 SPA: Initializing Property Details Content');
    initializePropertyDetailsPage();
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Property details page loaded via DOMContentLoaded');
    initializePropertyDetailsPage();
});

console.log('✅ Property Details JavaScript Module Loaded!');