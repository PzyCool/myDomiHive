// property-details-shortlet.js - UPDATED WITH TABS & SPA COMPATIBILITY

// ===== GLOBAL INITIALIZATION FUNCTION =====
window.initializePropertyDetailsShortlet = function() {
    console.log('🎯 SPA: Initializing Property Details Shortlet Content');
    initializePropertyDetailsPage();
};

// ===== MAIN INITIALIZATION FUNCTION =====
function initializePropertyDetailsPage() {
    console.log('🏡 Initializing Property Details Page - SHORTLET VERSION');
    
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
            const address = "56A Adeola Odeku Street, Victoria Island, Lagos";
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
            window.open(mapsUrl, '_blank');
            console.log('🗺️ Opening directions to:', address);
        });
    }

    // 3. LIKE CHECKBOX - SHOW BOOK NOW BUTTON
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

    // 4. BOOK NOW BUTTON
    const bookShortletBtn = document.getElementById('bookShortletBtn');
    if (bookShortletBtn) {
        bookShortletBtn.addEventListener('click', handleBookShortlet);
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
                    mainVideo.src = "https://assets.mixkit.co/videos/preview/mixkit-modern-living-room-interior-44514-large.mp4";
                    mainVideo.poster = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=450&fit=crop";
                } else if (index === 1) {
                    mainVideo.src = "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-suburban-neighborhood-44579-large.mp4";
                    mainVideo.poster = "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=450&fit=crop";
                }
                
                mainVideo.load();
            });
        });
    }

    // 7. UPDATE PROPERTY CONTEXT
    const propertyContext = document.getElementById('propertyContext');
    if (propertyContext) {
        propertyContext.textContent = 'Viewing from Shortlet Properties';
    }

    // 8. IMAGE ERROR HANDLING
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            console.log('🖼️ Image failed to load:', e.target.src);
            e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop';
            e.target.alt = 'Image not available';
        }
    }, true);

    // 9. REVIEW SYSTEM
    initializeReviewSystem();

    // 10. PROPERTY DATA
    initializePropertyData();

    // 11. FLOATING CALL BUTTON
    initializeFloatingCallButton();

    // 12. TAB FUNCTIONALITY - MOST IMPORTANT FOR SPA
    initializeTabs();

    console.log('✅ All Property Details functionality initialized for SHORTLET property');
}

// ===== TAB FUNCTIONALITY =====
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabsNav = document.getElementById('propertyTabsNav');
    
    console.log('📑 Initializing tabs for shortlet:', tabButtons.length, 'buttons found');
    
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
        console.log('📌 Sticky tabs initialized for shortlet');
    }
}

// ===== CAROUSEL FUNCTIONS =====
function initializeCarousel() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    const thumbnailsContainer = document.querySelector('.thumbnails-container');
    
    const propertyImages = [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop'
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
            thumbnail.innerHTML = `<img src="${imageSrc}" alt="Shortlet property image ${index + 1}" loading="lazy">`;
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
    const propertyId = urlParams.get('id') || 'shortlet_101';
    
    const propertyData = {
        id: propertyId,
        title: "Luxury 2-Bedroom Serviced Apartment in VI",
        price: "₦45,000/night",
        location: "Victoria Island, Lagos",
        bedrooms: "2",
        bathrooms: "2",
        size: "85 sqm",
        maxGuests: "4",
        description: "This beautifully furnished 2-bedroom serviced apartment offers the perfect short-term accommodation in the heart of Victoria Island. Perfect for business travelers, vacationers, or short stays, this property features modern amenities, comfortable living spaces, and excellent location convenience. Enjoy hotel-like services with the comfort and privacy of a home.",
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
        'maxGuests': data.maxGuests,
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

// ===== BOOK SHORTLET FUNCTION =====
function handleBookShortlet() {
    console.log('📅 Book Now clicked for SHORTLET property');
    
    const propertyData = getCurrentProperty();
    
    // Store property data for the book inspection page
    localStorage.setItem('domihive_selected_property', JSON.stringify(propertyData));
    
    // Store shortlet-specific context
    localStorage.setItem('domihive_booking_type', 'shortlet_booking');
    
    showNotification('Redirecting to book your stay...', 'success');
    
    // Direct redirect to book inspection page
    setTimeout(() => {
        if (window.spa && typeof window.spa.navigateToSection === 'function') {
            console.log('🚀 SPA Navigation to book-inspection');
            window.spa.navigateToSection('book-inspection');
        } else {
            console.log('🌐 Direct navigation to book-inspection.html');
            window.location.href = '/Pages/book-inspection.html';
        }
    }, 1000);
}

// ===== HELPER FUNCTIONS =====
function getCurrentProperty() {
    return {
        id: document.getElementById('propertyId')?.textContent || 'shortlet_101',
        title: document.getElementById('propertyTitle')?.textContent || 'Luxury Shortlet Apartment',
        price: document.getElementById('propertyPrice')?.textContent || '₦45,000/night',
        location: document.getElementById('propertyLocation')?.textContent || 'Victoria Island, Lagos',
        bedrooms: document.getElementById('bedroomsCount')?.textContent || '2',
        bathrooms: document.getElementById('bathroomsCount')?.textContent || '2',
        size: document.getElementById('propertySize')?.textContent || '85 sqm',
        maxGuests: document.getElementById('maxGuests')?.textContent || '4',
        type: 'Shortlet Apartment',
        category: 'shortlet'
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
    console.log('📄 Shortlet page loaded directly - initializing property details');
    initializePropertyDetailsPage();
});

console.log('✅ Property Details Shortlet JavaScript Loaded - SPA Ready');