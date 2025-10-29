// property-details-buy.js - CUSTOMIZED FOR BUY PROPERTIES WITH SPA FIX

// ===== SPA INTEGRATION =====
window.spaPropertyDetailsBuyInit = function() {
    console.log('🎯 SPA: Initializing Property Details Buy Content');
    initializePropertyDetailsPage();
};

// Auto-initialize if loaded directly
if (window.location.pathname.includes('property-details-buy.html')) {
    document.addEventListener('DOMContentLoaded', initializePropertyDetailsPage);
} else {
    // SPA environment - check if we're on the page and initialize
    setTimeout(function() {
        if (document.querySelector('.property-details-page') && document.getElementById('bookViewingBtn')) {
            console.log('🔍 Detected SPA environment - auto-initializing property details buy');
            initializePropertyDetailsPage();
        }
    }, 500);
}

// ===== MAIN INITIALIZATION FUNCTION =====
function initializePropertyDetailsPage() {
    console.log('🏠 Initializing Property Details Page - BUY VERSION');
    
    // 1. BACK TO DASHBOARD - UPDATED FOR SPA
    const backButton = document.getElementById('backToDashboard');
    if (backButton) {
        backButton.addEventListener('click', function() {
            console.log('🔙 Back button clicked - navigating to browse');
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
            const address = "12 Admiralty Way, Lekki Phase 1, Lagos";
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
            window.open(mapsUrl, '_blank');
        });
    }

    // 3. LIKE CHECKBOX - SHOW BOOK VIEWING BUTTON (FIXED)
    const likeCheckbox = document.getElementById('likeCheckbox');
    const proceedButtonContainer = document.getElementById('proceedButtonContainer');
    
    if (likeCheckbox && proceedButtonContainer) {
        console.log('✅ Setting up checkbox functionality for BUY property');
        
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

    // 4. BOOK VIEWING BUTTON - UPDATED WITH LOGIN CHECK
    const bookViewingBtn = document.getElementById('bookViewingBtn');
    if (bookViewingBtn) {
        bookViewingBtn.addEventListener('click', handleBookViewing);
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
                    mainVideo.src = "https://assets.mixkit.co/videos/preview/mixkit-modern-house-exterior-44516-large.mp4";
                    mainVideo.poster = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=450&fit=crop";
                } else if (index === 1) {
                    mainVideo.src = "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-suburban-neighborhood-44579-large.mp4";
                    mainVideo.poster = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=450&fit=crop";
                }
                
                mainVideo.load();
            });
        });
    }

    // 7. UPDATE PROPERTY CONTEXT
    const propertyContext = document.getElementById('propertyContext');
    if (propertyContext) {
        propertyContext.textContent = 'Viewing from Properties For Sale';
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

    console.log('✅ All Property Details functionality initialized for BUY property');
}

// ===== UPDATED BOOK VIEWING FUNCTION =====
function handleBookViewing() {
    console.log('👀 Book Viewing clicked for BUY property');
    
    const propertyData = getCurrentProperty();
    
    // Check if user is logged in
    const isLoggedIn = checkUserLoggedIn();
    
    if (!isLoggedIn) {
        // User is NOT logged in - Store intent and redirect to signup
        console.log('👤 User not logged in - storing viewing intent');
        
        localStorage.setItem('domihive_pending_booking', JSON.stringify({
            property: propertyData,
            intended_action: 'book_viewing',
            redirect_to: 'book-inspection',
            timestamp: new Date().toISOString(),
            message: 'Continue to book viewing for this property'
        }));
        
        // Also store the property for the dashboard
        localStorage.setItem('domihive_selected_property', JSON.stringify(propertyData));
        
        showNotification('Please sign up to book a viewing', 'info');
        
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
        console.log('👤 User logged in - proceeding to viewing booking');
        
        localStorage.setItem('domihive_selected_property', JSON.stringify(propertyData));
        
        showNotification('Redirecting to book viewing...', 'success');
        
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
        id: document.getElementById('propertyId')?.textContent || 'buy_456',
        title: document.getElementById('propertyTitle')?.textContent || 'Luxury Property For Sale',
        price: document.getElementById('propertyPrice')?.textContent || '₦85,000,000',
        location: document.getElementById('propertyLocation')?.textContent || 'Lekki Phase 1, Lagos',
        bedrooms: document.getElementById('bedroomsCount')?.textContent || '4',
        bathrooms: document.getElementById('bathroomsCount')?.textContent || '4',
        size: document.getElementById('propertySize')?.textContent || '350 sqm',
        type: document.getElementById('propertyType')?.textContent || 'Detached House',
        category: 'buy' // Important for routing back
    };
}

// ===== CAROUSEL FUNCTIONS =====
function initializeCarousel() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    const thumbnailsContainer = document.querySelector('.thumbnails-container');
    
    const propertyImages = [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop'
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
    console.log('Initializing review system for BUY property...');
    
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
    const propertyId = urlParams.get('id') || 'buy_456';
    
    const propertyData = {
        id: propertyId,
        title: "Luxury 4-Bedroom Detached House in Lekki",
        price: "₦85,000,000",
        location: "Lekki Phase 1, Lagos Island",
        bedrooms: "4",
        bathrooms: "4", 
        size: "350 sqm",
        type: "Detached House",
        description: "This exquisite 4-bedroom detached house offers premium living in the heart of Lekki Phase 1. Featuring modern architecture, luxury finishes, and premium amenities, this property represents an excellent investment opportunity with great potential for appreciation. Perfect for families seeking a permanent home in a secure, upscale neighborhood.",
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

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Property details buy page loaded via DOMContentLoaded');
    initializePropertyDetailsPage();
});

console.log('✅ Property Details Buy JavaScript Module Loaded!');