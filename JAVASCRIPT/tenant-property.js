// tenant-property.js - Property Dashboard Management System (PROFESSIONAL VERSION)

// SPA Integration
window.spaTenantPropertyInit = function() {
    console.log('🎯 SPA: Initializing Tenant Property Content');
    initializeTenantProperty();
};

// Auto-initialize if loaded directly
if (window.location.pathname.includes('tenant-property.html')) {
    document.addEventListener('DOMContentLoaded', initializeTenantProperty);
} else {
   
}

function initializeTenantProperty() {
    console.log('🏠 Initializing Tenant Property Page...');
    
    // Load the property data and render the page
    loadPropertyData();
    initializeTabSystem();
    initializeEventListeners();
    initializeReviewSystem();
    
    console.log('✅ Tenant Property page ready');
}

function initializeTabSystem() {
    console.log('📑 Initializing tab system...');
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab, this);
        });
    });
    
    console.log('✅ Tab system initialized');
}

function switchTab(tabName, clickedButton) {
    console.log('🔄 Switching to tab:', tabName);
    
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    clickedButton.classList.add('active');
    
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show target tab content
    const targetContent = document.getElementById(`${tabName}-content`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Load tab-specific data if needed
    loadTabData(tabName);
}

function loadTabData(tabName) {
    console.log('📦 Loading data for tab:', tabName);
    
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const property = userProperties.find(p => p.id === propertyId);
    
    if (!property) {
        console.log('❌ No property data found for tab loading');
        return;
    }
    
    switch(tabName) {
        case 'timeline':
            loadTimelineData(property);
            break;
        case 'updates':
            loadUpdatesData(property);
            break;
        case 'lease':
            loadLeaseData(property);
            break;
    }
}

function loadPropertyData() {
    const propertyId = sessionStorage.getItem('currentPropertyId');
    console.log('📦 Loading property data for:', propertyId);
    
    if (!propertyId) {
        console.log('❌ No property ID found, creating demo property...');
        createDemoPropertyData();
        return;
    }
    
    // Load from user properties
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const property = userProperties.find(p => p.id === propertyId);
    
    if (property) {
        console.log('✅ Found property:', property.title);
        renderPropertyPage(property);
    } else {
        console.log('❌ Property not found, creating demo...');
        createDemoPropertyData();
    }
}

function createDemoPropertyData() {
    console.log('🏗️ Creating demo property data...');
    
    const demoProperty = {
        id: 'demo_prop_1',
        title: 'Luxury 3-Bedroom Apartment in Ikoyi',
        location: '24 Bourdillon Road, Ikoyi, Lagos',
        price: 15000000,
        image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
        leaseStart: '2024-01-15',
        leaseEnd: '2025-01-14',
        status: 'active',
        rentDueDate: '2024-02-01',
        documents: {
            tenantAgreement: { signed: false, signedDate: null, signedDocument: null }
        },
        timeline: [
            {
                date: '2024-01-05',
                title: 'Application Submitted',
                description: 'Your rental application for the Luxury 3-Bedroom Apartment was submitted for review. Application ID: APP-2024-00123'
            },
            {
                date: '2024-01-08',
                title: 'Application Approved ✅',
                description: 'Congratulations! Your application has been approved. The property management team has verified all your documents.'
            },
            {
                date: '2024-01-10',
                title: 'Payment Processed 💳',
                description: 'Your security deposit and first month rent of ₦1,250,000 has been processed successfully. Transaction ID: TXN-2024-00123'
            },
            {
                date: '2024-01-12',
                title: 'Lease Agreement Sent',
                description: 'The digital lease agreement has been sent to your email for review and signature.'
            },
            {
                date: '2024-01-15',
                title: 'Lease Started 🏠',
                description: 'Your lease period officially began. Welcome to your new home! Keys and access cards have been activated.'
            },
            {
                date: '2024-01-16',
                title: 'Move-in Inspection Completed',
                description: 'The initial move-in inspection has been completed. All utilities are now active and functioning properly.'
            }
        ],
        updates: [
            {
                date: '2024-01-20',
                title: 'Welcome Package Delivered 🎁',
                content: 'Your welcome package containing building rules, emergency contacts, and community information has been delivered to your apartment. Please review the building guidelines.'
            },
            {
                date: '2024-01-25',
                title: 'Rent Payment Reminder 💰',
                content: 'Friendly reminder: Your next rent payment of ₦1,250,000 is due on February 1st, 2024. You can make payments through your DomiHive portal or via bank transfer.'
            },
            {
                date: '2024-02-05',
                title: 'Building Maintenance Schedule 🛠️',
                content: 'Scheduled building maintenance will occur on February 15th from 9 AM - 12 PM. There will be temporary water shutdown during this period. Please plan accordingly.'
            },
            {
                date: '2024-02-10',
                title: 'Community Meeting Invitation 🏘️',
                content: 'You are invited to the quarterly community meeting on February 20th at 6:00 PM in the building lobby. Agenda includes security updates, facility improvements, and community events.'
            }
        ]
    };
    
    renderPropertyPage(demoProperty);
}

function renderPropertyPage(property) {
    console.log('🎨 Rendering property page...');
    
    // Update page header
    updatePageHeader(property);
    
    // Render property overview
    renderPropertyOverview(property);
    
    // Load initial tab data
    loadTabData('timeline');
}

function updatePageHeader(property) {
    const titleElement = document.getElementById('propertyPageTitle');
    const subtitleElement = document.getElementById('propertyPageSubtitle');
    
    if (titleElement) {
        titleElement.innerHTML = `<i class="fas fa-home"></i>${property.title}`;
    }
    
    if (subtitleElement) {
        subtitleElement.textContent = `Managing your rental property in ${property.location}`;
    }
}

function renderPropertyOverview(property) {
    const overviewElement = document.getElementById('propertyOverview');
    
    if (!overviewElement) {
        console.error('❌ Property overview element not found');
        return;
    }
    
    const daysRemaining = calculateDaysRemaining(property.leaseEnd);
    
    overviewElement.innerHTML = `
        <div class="property-overview-image">
            <img src="${property.image}" alt="${property.title}" onerror="this.src='/ASSECT/placeholder-property.jpg'">
        </div>
        <div class="property-overview-info">
            <h2>${property.title}</h2>
            <div class="property-overview-price">₦${property.price.toLocaleString()}/year</div>
            <div class="property-overview-location">
                <i class="fas fa-map-marker-alt"></i>
                ${property.location}
            </div>
            <div class="property-overview-meta">
                <div class="meta-item">
                    <span class="meta-label">Lease Start</span>
                    <span class="meta-value">${formatDate(property.leaseStart)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Lease End</span>
                    <span class="meta-value">${formatDate(property.leaseEnd)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Status</span>
                    <span class="meta-value" style="color: ${property.status === 'active' ? '#10b981' : '#f59e0b'}">
                        ${property.status === 'active' ? 'Active' : 'Ending Soon'}
                    </span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Days Remaining</span>
                    <span class="meta-value">${daysRemaining}</span>
                </div>
            </div>
        </div>
    `;
}

function loadTimelineData(property) {
    const timelineElement = document.getElementById('journeyTimeline');
    
    if (!timelineElement) {
        console.error('❌ Timeline element not found');
        return;
    }
    
    if (!property.timeline || property.timeline.length === 0) {
        timelineElement.innerHTML = `
            <div class="empty-timeline">
                <i class="fas fa-road"></i>
                <h4>No Timeline Data</h4>
                <p>Your property journey timeline will appear here</p>
            </div>
        `;
        return;
    }
    
    const timelineHTML = property.timeline.map(item => `
        <div class="timeline-item">
            <div class="timeline-date">${formatDate(item.date)}</div>
            <div class="timeline-title">${item.title}</div>
            <div class="timeline-description">${item.description}</div>
        </div>
    `).join('');
    
    timelineElement.innerHTML = timelineHTML;
}

function loadUpdatesData(property) {
    const updatesElement = document.getElementById('updatesList');
    
    if (!updatesElement) {
        console.error('❌ Updates element not found');
        return;
    }
    
    if (!property.updates || property.updates.length === 0) {
        updatesElement.innerHTML = `
            <div class="empty-updates">
                <i class="fas fa-bullhorn"></i>
                <h4>No Updates Available</h4>
                <p>Property updates and announcements will appear here</p>
            </div>
        `;
        return;
    }
    
    const updatesHTML = property.updates.map(update => `
        <div class="update-item">
            <div class="update-date">${formatDate(update.date)}</div>
            <div class="update-title">${update.title}</div>
            <div class="update-content">${update.content}</div>
        </div>
    `).join('');
    
    updatesElement.innerHTML = updatesHTML;
}

function loadLeaseData(property) {
    const leaseOverviewElement = document.getElementById('leaseOverview');
    
    if (!leaseOverviewElement) {
        console.error('❌ Lease overview element not found');
        return;
    }
    
    const daysRemaining = calculateDaysRemaining(property.leaseEnd);
    
    leaseOverviewElement.innerHTML = `
        <div class="lease-detail-card">
            <div class="lease-detail-label">Annual Rent</div>
            <div class="lease-detail-value">₦${property.price.toLocaleString()}</div>
            <div class="lease-detail-note">Per year</div>
        </div>
        <div class="lease-detail-card">
            <div class="lease-detail-label">Lease Duration</div>
            <div class="lease-detail-value">${calculateLeaseDuration(property.leaseStart, property.leaseEnd)}</div>
            <div class="lease-detail-note">Remaining: ${daysRemaining} days</div>
        </div>
        <div class="lease-detail-card">
            <div class="lease-detail-label">Next Payment</div>
            <div class="lease-detail-value">${formatDate(property.rentDueDate)}</div>
            <div class="lease-detail-note">₦${Math.round(property.price / 12).toLocaleString()} due</div>
        </div>
    `;
}

function initializeEventListeners() {
    console.log('🎯 Initializing event listeners...');
    
    // Back button
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', goBackToProperties);
    }
    
    console.log('✅ Event listeners initialized');
}

function initializeReviewSystem() {
    console.log('⭐ Initializing review system...');
    
    // Initialize star rating functionality
    initializeStarRatings();
    
    // Load review history if any exists
    loadReviewHistory();
    
    console.log('✅ Review system initialized');
}

function initializeStarRatings() {
    // Overall rating stars
    const overallStars = document.querySelectorAll('#overallRating .star');
    overallStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            setOverallRating(rating);
        });
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars('overallRating', rating);
        });
    });
    
    // Category rating stars
    const categoryContainers = document.querySelectorAll('.category-stars');
    categoryContainers.forEach(container => {
        const stars = container.querySelectorAll('.star');
        const category = container.getAttribute('data-category');
        
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                setCategoryRating(category, rating);
            });
            
            star.addEventListener('mouseover', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                highlightStars(container, rating);
            });
        });
        
        // Reset stars when mouse leaves category
        container.addEventListener('mouseleave', function() {
            const currentRating = getCurrentCategoryRating(category);
            if (currentRating > 0) {
                highlightStars(container, currentRating);
            } else {
                resetStars(container);
            }
        });
    });
    
    // Reset overall stars when mouse leaves
    document.getElementById('overallRating').addEventListener('mouseleave', function() {
        const currentRating = getCurrentOverallRating();
        if (currentRating > 0) {
            highlightStars('overallRating', currentRating);
        } else {
            resetStars('overallRating');
        }
    });
}

function setOverallRating(rating) {
    console.log('⭐ Setting overall rating:', rating);
    highlightStars('overallRating', rating);
    
    // Update rating text
    const ratingTexts = [
        'Select your rating',
        'Poor',
        'Fair', 
        'Good',
        'Very Good',
        'Excellent'
    ];
    document.getElementById('overallRatingText').textContent = ratingTexts[rating];
    
    // Store the rating
    window.currentOverallRating = rating;
}

function setCategoryRating(category, rating) {
    console.log(`⭐ Setting ${category} rating:`, rating);
    const container = document.querySelector(`[data-category="${category}"]`);
    highlightStars(container, rating);
    
    // Store the rating
    if (!window.categoryRatings) window.categoryRatings = {};
    window.categoryRatings[category] = rating;
}

function highlightStars(container, rating) {
    const stars = typeof container === 'string' 
        ? document.querySelectorAll(`#${container} .star`)
        : container.querySelectorAll('.star');
    
    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        star.classList.toggle('active', starRating <= rating);
    });
}

function resetStars(container) {
    const stars = typeof container === 'string' 
        ? document.querySelectorAll(`#${container} .star`)
        : container.querySelectorAll('.star');
    
    stars.forEach(star => {
        star.classList.remove('active');
    });
}

function getCurrentOverallRating() {
    return window.currentOverallRating || 0;
}

function getCurrentCategoryRating(category) {
    return window.categoryRatings?.[category] || 0;
}

function loadReviewHistory() {
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const userReviews = JSON.parse(localStorage.getItem('domihive_user_reviews') || '[]');
    const propertyReviews = userReviews.filter(review => review.propertyId === propertyId);
    
    const historySection = document.getElementById('reviewHistorySection');
    const historyList = document.getElementById('reviewHistoryList');
    
    if (propertyReviews.length > 0) {
        historySection.style.display = 'block';
        
        const reviewsHTML = propertyReviews.map(review => `
            <div class="review-history-item">
                <div class="review-history-date">
                    Submitted: ${formatDateTime(review.submittedAt)}
                </div>
                <div class="review-history-rating">
                    <div class="stars-container">
                        ${generateStarsHTML(review.ratings.overall)}
                    </div>
                    <span>${review.ratings.overall}/5</span>
                </div>
                <div class="review-history-title">${review.title}</div>
                <div class="review-history-text">${review.reviewText}</div>
                <div class="review-history-status ${review.status === 'pending' ? 'status-pending' : 'status-approved'}">
                    <i class="fas ${review.status === 'pending' ? 'fa-clock' : 'fa-check'}"></i>
                    ${review.status === 'pending' ? 'Pending Approval' : 'Approved & Published'}
                </div>
            </div>
        `).join('');
        
        historyList.innerHTML = reviewsHTML;
    } else {
        historySection.style.display = 'none';
    }
}

function generateStarsHTML(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star ${i <= rating ? 'active' : ''}">★</span>`;
    }
    return stars;
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Add this to the tab data loading function - find loadTabData() and add the 'rate' case:
function loadTabData(tabName) {
    console.log('📦 Loading data for tab:', tabName);
    
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const property = userProperties.find(p => p.id === propertyId);
    
    if (!property) {
        console.log('❌ No property data found for tab loading');
        return;
    }
    
    switch(tabName) {
        case 'timeline':
            loadTimelineData(property);
            break;
        case 'updates':
            loadUpdatesData(property);
            break;
        case 'lease':
            loadLeaseData(property);
            break;
        case 'rate': // ADD THIS CASE
            loadReviewHistory();
            break;
    }
}

// Add the review submission function:
window.submitPropertyReview = function() {
    console.log('📝 Submitting property review...');
    
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const currentUser = JSON.parse(localStorage.getItem('domihive_current_user') || '{}');
    
    // Validate required fields
    if (!validateReviewForm()) {
        return;
    }
    
    // Collect review data
    const reviewData = {
        id: 'review_' + Date.now(),
        propertyId: propertyId,
        userId: currentUser.id || 'user_' + Date.now(),
        userName: currentUser.name || 'Anonymous',
        submittedAt: new Date().toISOString(),
        status: 'pending', // Goes to admin for approval
        title: document.getElementById('reviewTitle').value.trim(),
        reviewText: document.getElementById('reviewText').value.trim(),
        pros: document.getElementById('pros').value.trim(),
        cons: document.getElementById('cons').value.trim(),
        anonymous: document.getElementById('anonymousPost').checked,
        recommend: document.querySelector('input[name="recommend"]:checked').value,
        ratings: {
            overall: getCurrentOverallRating(),
            propertyCondition: getCurrentCategoryRating('propertyCondition') || 0,
            landlordResponsiveness: getCurrentCategoryRating('landlordResponsiveness') || 0,
            neighborhood: getCurrentCategoryRating('neighborhood') || 0,
            valueForMoney: getCurrentCategoryRating('valueForMoney') || 0,
            maintenanceQuality: getCurrentCategoryRating('maintenanceQuality') || 0
        }
    };
    
    // Save to localStorage
    const userReviews = JSON.parse(localStorage.getItem('domihive_user_reviews') || '[]');
    userReviews.push(reviewData);
    localStorage.setItem('domihive_user_reviews', JSON.stringify(userReviews));
    
    // Show success message
    showNotification('Review submitted successfully! It will be published after admin approval.', 'success');
    
    // Clear form and reload history
    clearReviewForm();
    loadReviewHistory();
    
    console.log('✅ Review submitted:', reviewData);
};

function validateReviewForm() {
    const overallRating = getCurrentOverallRating();
    const title = document.getElementById('reviewTitle').value.trim();
    const reviewText = document.getElementById('reviewText').value.trim();
    const recommend = document.querySelector('input[name="recommend"]:checked');
    
    if (overallRating === 0) {
        showNotification('Please provide an overall rating', 'error');
        return false;
    }
    
    if (!title) {
        showNotification('Please enter a review title', 'error');
        document.getElementById('reviewTitle').focus();
        return false;
    }
    
    if (!reviewText) {
        showNotification('Please write your review', 'error');
        document.getElementById('reviewText').focus();
        return false;
    }
    
    if (!recommend) {
        showNotification('Please indicate if you would recommend this property', 'error');
        return false;
    }
    
    return true;
}

window.clearReviewForm = function() {
    console.log('🧹 Clearing review form...');
    
    // Reset ratings
    window.currentOverallRating = 0;
    window.categoryRatings = {};
    
    // Clear stars
    resetStars('overallRating');
    document.querySelectorAll('.category-stars').forEach(resetStars);
    document.getElementById('overallRatingText').textContent = 'Select your rating';
    
    // Clear form fields
    document.getElementById('reviewTitle').value = '';
    document.getElementById('reviewText').value = '';
    document.getElementById('pros').value = '';
    document.getElementById('cons').value = '';
    
    // Clear radio buttons and checkbox
    document.querySelectorAll('input[name="recommend"]').forEach(radio => {
        radio.checked = false;
    });
    document.getElementById('anonymousPost').checked = false;
    
    showNotification('Form cleared', 'info');
};

// Global navigation functions
window.goBackToProperties = function() {
    console.log('🔙 Returning to My Properties...');
    
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('my-properties');
    } else {
        window.location.href = '/Pages/my-properties-content.html';
    }
};

// Redirect functions to other modules
window.redirectToMaintenance = function() {
    console.log('🔧 Redirecting to maintenance...');
    showNotification('Redirecting to maintenance requests...', 'info');
    
    setTimeout(() => {
        if (window.spa && typeof window.spa.navigateToSection === 'function') {
            window.spa.navigateToSection('maintenance');
        } else {
            window.location.href = '/Pages/maintenance-content.html';
        }
    }, 1000);
};

window.redirectToPayments = function() {
    console.log('💰 Redirecting to payments...');
    showNotification('Redirecting to payment portal...', 'info');
    
    setTimeout(() => {
        if (window.spa && typeof window.spa.navigateToSection === 'function') {
            window.spa.navigateToSection('payments');
        } else {
            window.location.href = '/Pages/payment-content.html';
        }
    }, 1000);
};

window.redirectToMessages = function() {
    console.log('💬 Redirecting to messages...');
    showNotification('Opening message center...', 'info');
    
    setTimeout(() => {
        if (window.spa && typeof window.spa.navigateToSection === 'function') {
            window.spa.navigateToSection('messages');
        } else {
            window.location.href = '/Pages/message-content.html';
        }
    }, 1000);
};

// Document management functions
window.viewTenantAgreement = function() {
    console.log('📄 Opening professional tenant agreement...');
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const property = userProperties.find(p => p.id === propertyId);
    const currentUser = JSON.parse(localStorage.getItem('domihive_current_user') || '{}');
    
    openProfessionalDocumentViewer('Tenant Agreement', generateProfessionalTenantAgreement(property, currentUser));
};

window.downloadTenantAgreement = function() {
    console.log('📥 Downloading tenant agreement...');
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const property = userProperties.find(p => p.id === propertyId);
    const currentUser = JSON.parse(localStorage.getItem('domihive_current_user') || '{}');
    
    if (property.documents.tenantAgreement.signed) {
        downloadPDF('Signed-Tenant-Agreement', property.documents.tenantAgreement.signedDocument);
        showNotification('Signed agreement downloaded successfully', 'success');
    } else {
        downloadPDF('Tenant-Agreement', generateProfessionalTenantAgreement(property, currentUser));
        showNotification('Agreement template downloaded successfully', 'success');
    }
};

function generateProfessionalTenantAgreement(property, currentUser) {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    return `
        <div class="legal-document">
            <div class="document-header">
                <h1>RESIDENTIAL LEASE AGREEMENT</h1>
                <div class="document-subtitle">Standard Form of Tenancy Agreement</div>
            </div>
            
            <div class="legal-parties">
                <div class="party-section">
                    <h3>LESSOR (Landlord):</h3>
                    <p><strong>DOMIHIVE PROPERTIES LTD.</strong></p>
                    <p>RC: 1234567</p>
                    <p>124 Awolowo Road, Ikoyi, Lagos</p>
                    <p>Email: legal@domihive.com</p>
                    <p>Phone: +234 1 700 0000</p>
                </div>
                
                <div class="party-section">
                    <h3>LESSEE (Tenant):</h3>
                    <p><strong>${currentUser.name || 'TENANT NAME'}</strong></p>
                    <p>Email: ${currentUser.email || 'tenant@email.com'}</p>
                    <p>Phone: ${currentUser.phone || '+234 800 000 0000'}</p>
                </div>
            </div>
            
            <div class="property-section">
                <h3>DESCRIPTION OF PREMISES</h3>
                <p>The Lessor hereby leases to the Lessee the following described premises:</p>
                <p><strong>Property:</strong> ${property?.title || 'Rental Property'}</p>
                <p><strong>Address:</strong> ${property?.location || 'Property Address'}</p>
                <p><strong>Unit:</strong> ${property?.unit || 'Unit A'}</p>
            </div>
            
            <div class="terms-section">
                <h3>LEASE TERMS AND CONDITIONS</h3>
                
                <div class="term-item">
                    <h4>ARTICLE 1: TERM</h4>
                    <p>This Lease shall be for a term of ${calculateLeaseDuration(property.leaseStart, property.leaseEnd)} commencing on <strong>${formatDate(property.leaseStart)}</strong> and ending on <strong>${formatDate(property.leaseEnd)}</strong>.</p>
                </div>
                
                <div class="term-item">
                    <h4>ARTICLE 2: RENT</h4>
                    <p>The monthly rent shall be <strong>₦${Math.round(property.price / 12).toLocaleString()}</strong> payable in advance on the first day of each month. The total annual rent is <strong>₦${property.price.toLocaleString()}</strong>.</p>
                </div>
                
                <div class="term-item">
                    <h4>ARTICLE 3: SECURITY DEPOSIT</h4>
                    <p>Upon execution of this Agreement, Tenant shall deposit with Landlord the sum of <strong>₦${Math.round(property.price / 12).toLocaleString()}</strong> as a security deposit to secure Tenant's faithful performance of the terms of this Lease.</p>
                </div>
                
                <div class="term-item">
                    <h4>ARTICLE 4: USE OF PREMISES</h4>
                    <p>The premises shall be used and occupied by Tenant exclusively as a private single-family residence. Tenant shall not use the premises for any purpose other than residential purposes.</p>
                </div>
                
                <div class="term-item">
                    <h4>ARTICLE 5: MAINTENANCE AND REPAIRS</h4>
                    <p>Tenant will keep and maintain the premises in a clean, sanitary, and good condition. Landlord shall be responsible for all structural repairs and repairs to common areas.</p>
                </div>
                
                <div class="term-item">
                    <h4>ARTICLE 6: ALTERATIONS AND IMPROVEMENTS</h4>
                    <p>Tenant shall not make any alterations, additions, or improvements to the premises without Landlord's prior written consent.</p>
                </div>
                
                <div class="term-item">
                    <h4>ARTICLE 7: INSURANCE</h4>
                    <p>Tenant is responsible for maintaining renter's insurance for their personal property. Landlord maintains insurance on the building structure.</p>
                </div>
                
                <div class="term-item">
                    <h4>ARTICLE 8: DEFAULT</h4>
                    <p>If Tenant fails to pay rent when due, Landlord may terminate this Lease after providing proper notice as required by law.</p>
                </div>
            </div>
            
            <div class="signature-section">
                <div class="signature-block">
                    <div class="signature-line"></div>
                    <div class="signature-label">DomiHive Properties Ltd.</div>
                    <div class="signature-title">Landlord/Authorized Agent</div>
                    <div class="signature-date">Date: ${today}</div>
                    <div class="domihive-signature">
                        <img src="/ASSECT/domihive-signature.png" alt="DomiHive Signature" style="height: 40px; margin: 10px 0;">
                        <div>Digitally signed and executed</div>
                    </div>
                </div>
                
                <div class="signature-block">
                    <div class="signature-line" id="tenantSignatureLine"></div>
                    <div class="signature-label">${currentUser.name || 'Tenant Signature'}</div>
                    <div class="signature-title">Tenant</div>
                    <div class="signature-date">Date: ${property.documents.tenantAgreement.signed ? formatDate(property.documents.tenantAgreement.signedDate) : '___________'}</div>
                    ${!property.documents.tenantAgreement.signed ? `
                        <div class="signature-instruction">
                            <small>Please sign above using the signature pad</small>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="legal-footer">
                <p><strong>Disclaimer:</strong> This is a legally binding document. Please read carefully before signing. If you do not understand any part of this agreement, seek legal advice.</p>
            </div>
        </div>
    `;
}

function openProfessionalDocumentViewer(title, content) {
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const property = userProperties.find(p => p.id === propertyId);
    
    document.getElementById('documentViewerTitle').textContent = title;
    document.getElementById('documentViewerContent').innerHTML = content;
    
    // Show appropriate buttons based on signing status
    const modalActions = document.querySelector('.modal-actions');
    if (property.documents.tenantAgreement.signed) {
        modalActions.innerHTML = `
            <button class="btn-secondary" onclick="closeDocumentViewer()">
                <i class="fas fa-times"></i>
                Close
            </button>
            <button class="btn-primary" onclick="downloadCurrentDocument()">
                <i class="fas fa-download"></i>
                Download PDF
            </button>
            <button class="btn-success" onclick="printCurrentDocument()">
                <i class="fas fa-print"></i>
                Print
            </button>
        `;
    } else {
        modalActions.innerHTML = `
            <button class="btn-secondary" onclick="closeDocumentViewer()">
                <i class="fas fa-times"></i>
                Close
            </button>
            <button class="btn-primary" onclick="openSignatureModal()">
                <i class="fas fa-pen"></i>
                Sign Document
            </button>
            <button class="btn-success" onclick="downloadCurrentDocument()">
                <i class="fas fa-download"></i>
                Download Template
            </button>
        `;
    }
    
    document.getElementById('documentViewerModal').classList.add('active');
}

window.openSignatureModal = function() {
    initializeSignaturePad();
    document.getElementById('signatureModal').classList.add('active');
};

window.closeSignatureModal = function() {
    document.getElementById('signatureModal').classList.remove('active');
    clearSignature();
};

function initializeSignaturePad() {
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Clear canvas and draw signature line
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw signature line
    ctx.strokeStyle = '#0e1f42';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(canvas.width - 50, 100);
    ctx.stroke();
    
    // Reset for drawing
    ctx.setLineDash([]);
    ctx.strokeStyle = '#0e1f42';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);

    function handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        if (e.type === 'touchstart') {
            startDrawing(mouseEvent);
        } else if (e.type === 'touchmove') {
            draw(mouseEvent);
        }
    }

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function draw(e) {
        if (!isDrawing) return;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function stopDrawing() {
        isDrawing = false;
    }
}

window.clearSignature = function() {
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear and redraw signature line
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#0e1f42';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(canvas.width - 50, 100);
    ctx.stroke();
    
    // Reset for drawing
    ctx.setLineDash([]);
    ctx.strokeStyle = '#0e1f42';
    ctx.lineWidth = 2;
};

window.saveSignature = function() {
    const canvas = document.getElementById('signatureCanvas');
    const signatureData = canvas.toDataURL();
    
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const propertyIndex = userProperties.findIndex(p => p.id === propertyId);
    
    if (propertyIndex !== -1) {
        // Update property documents
        userProperties[propertyIndex].documents.tenantAgreement.signed = true;
        userProperties[propertyIndex].documents.tenantAgreement.signedDate = new Date().toISOString();
        userProperties[propertyIndex].documents.tenantAgreement.signedDocument = generateProfessionalTenantAgreement(
            userProperties[propertyIndex], 
            JSON.parse(localStorage.getItem('domihive_current_user') || '{}')
        );
        
        // Save to storage
        localStorage.setItem('domihive_user_properties', JSON.stringify(userProperties));
        
        // Show success
        showNotification('Document signed and saved successfully!', 'success');
        closeSignatureModal();
        closeDocumentViewer();
        
        // Reload lease data to show updated status
        loadTabData('lease');
        
        console.log('✍️ Document signed for property:', propertyId);
    }
};

window.closeDocumentViewer = function() {
    document.getElementById('documentViewerModal').classList.remove('active');
};

window.downloadCurrentDocument = function() {
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const property = userProperties.find(p => p.id === propertyId);
    const currentUser = JSON.parse(localStorage.getItem('domihive_current_user') || '{}');
    
    if (property.documents.tenantAgreement.signed) {
        downloadPDF('Signed-Tenant-Agreement', property.documents.tenantAgreement.signedDocument);
        showNotification('Signed agreement downloaded successfully', 'success');
    } else {
        downloadPDF('Tenant-Agreement-Template', generateProfessionalTenantAgreement(property, currentUser));
        showNotification('Agreement template downloaded successfully', 'success');
    }
};

window.printCurrentDocument = function() {
    const printContent = document.getElementById('documentViewerContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Print Document</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .legal-document { max-width: 800px; margin: 0 auto; }
                    .document-header { text-align: center; margin-bottom: 30px; }
                    .legal-parties { display: flex; justify-content: space-between; margin: 20px 0; }
                    .party-section { flex: 1; margin: 0 10px; }
                    .signature-section { display: flex; justify-content: space-between; margin-top: 50px; }
                    .signature-block { text-align: center; }
                    .signature-line { border-bottom: 1px solid #000; width: 200px; margin: 20px auto; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>${printContent}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
};

function downloadPDF(filename, content) {
    const blob = new Blob([content], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.html`;
    link.click();
}

// Lease management functions
window.renewLease = function() {
    console.log('🔄 Renewing lease...');
    showNotification('Opening lease renewal process...', 'info');
    
    setTimeout(() => {
        showNotification('Lease renewal request submitted successfully', 'success');
    }, 1500);
};

window.endLease = function() {
    console.log('❌ Ending lease...');
    
    if (confirm('Are you sure you want to end this lease? This action cannot be undone.')) {
        const propertyId = sessionStorage.getItem('currentPropertyId');
        const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
        const propertyIndex = userProperties.findIndex(p => p.id === propertyId);
        
        if (propertyIndex !== -1) {
            // Update property status
            userProperties[propertyIndex].status = 'ended';
            userProperties[propertyIndex].leaseEnd = new Date().toISOString().split('T')[0];
            
            // Save changes
            localStorage.setItem('domihive_user_properties', JSON.stringify(userProperties));
            
            showNotification('Lease ended successfully', 'success');
            
            // Return to properties page
            setTimeout(() => {
                goBackToProperties();
            }, 2000);
        }
    }
};

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function calculateDaysRemaining(endDate) {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
}

function calculateLeaseDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''}${months > 0 ? `, ${months} month${months > 1 ? 's' : ''}` : ''}`;
    } else {
        return `${months} month${months > 1 ? 's' : ''}`;
    }
}

// Utility function for showing notifications
function showNotification(message, type = 'success') {
    // Remove existing notifications
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
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

console.log('🎉 Professional Tenant Property Dashboard JavaScript Loaded!');