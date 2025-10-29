// overview-content.js - DomiHive Live Overview Dashboard - COMPLETE VERSION

// ===== GLOBAL VARIABLES =====
let currentUser = null;
let liveDataInterval = null;
let activities = [];
let propertyInterests = [];
let userApplications = [];
let userPayments = [];
let autoPayEnabled = false;
let referralData = null;

// ===== SPA-COMPATIBLE INITIALIZATION =====
function initializeOverview() {
    console.log('🚀 INITIALIZING Overview Dashboard...');
    
    try {
        // Load all user data first
        loadCurrentUser();
        loadUserPreferences();
        loadReferralData();
        loadPropertyInterests();
        loadUserApplications();
        loadUserPayments();
        
        // Initialize all live components
        initializeContinueJourney();
        initializeRecentProperties();
        initializeApplicationsSystem();
        initializeActivitySystem();
        initializeSmartRecommendations();
        initializeRealTimeUpdates();
        initializeEventListeners();
        
        // Start live data updates
        startLiveDataUpdates();
        
        console.log('✅ Overview Dashboard initialized successfully');
        showNotification('Dashboard loaded!', 'success');
        
    } catch (error) {
        console.error('❌ Error initializing overview:', error);
        showNotification('Error loading dashboard', 'error');
    }
}

// ===== MULTIPLE INITIALIZATION METHODS =====

// Method 1: SPA-specific initialization
window.spaOverviewInit = function() {
    console.log('🎯 SPA: Initializing Overview Content');
    setTimeout(initializeOverview, 100);
};

// Method 2: Direct initialization for standalone page
if (window.location.pathname.includes('overview-content.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 Standalone page - Initializing overview');
        setTimeout(initializeOverview, 500);
    });
}

// Method 3: Auto-initialization when DOM is ready in SPA
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded - Checking for overview content');
    
    // Check if we're in an SPA context with overview content
    const overviewContent = document.querySelector('.overview-content');
    if (overviewContent && typeof initializeOverview === 'function') {
        console.log('🔄 Auto-initializing overview in SPA');
        setTimeout(initializeOverview, 300);
    }
});

// Method 4: Force initialization after a timeout (fallback)
setTimeout(function() {
    const overviewContent = document.querySelector('.overview-content');
    if (overviewContent && typeof initializeOverview === 'function' && !window.overviewInitialized) {
        console.log('🔄 Fallback initialization');
        initializeOverview();
        window.overviewInitialized = true;
    }
}, 2000);

// Make function globally available
window.initializeOverview = initializeOverview;

// ===== CONTINUE YOUR JOURNEY SYSTEM =====
function initializeContinueJourney() {
    const pendingBooking = localStorage.getItem('domihive_pending_booking');
    
    if (pendingBooking) {
        try {
            const bookingData = JSON.parse(pendingBooking);
            showContinueJourneySection(bookingData);
        } catch (error) {
            console.error('Error loading pending booking:', error);
            hideContinueJourneySection();
        }
    } else {
        hideContinueJourneySection();
    }
}

function showContinueJourneySection(bookingData) {
    const section = document.getElementById('continueJourneySection');
    const content = document.getElementById('journeyContent');
    
    if (!section || !content) return;
    
    content.innerHTML = `
        <div class="journey-item">
            <div class="journey-property-image">
                <img src="${bookingData.property.image || 'https://images.unsplash.com/photo-1545323157-f6f63c0d66a7?w=400&h=300&fit=crop'}" 
                     alt="${bookingData.property.title}">
            </div>
            <div class="journey-details">
                <h3>${bookingData.property.title}</h3>
                <p>${bookingData.property.location}</p>
                <div class="journey-meta">
                    <span>${bookingData.property.price}</span>
                    <span>${bookingData.property.bedrooms} beds • ${bookingData.property.bathrooms} baths</span>
                </div>
            </div>
            <div class="journey-actions">
                <button class="continue-btn" onclick="continuePendingBooking()">
                    <i class="fas fa-play"></i>
                    Continue Booking
                </button>
                <button class="dismiss-btn" onclick="dismissPendingBooking()">
                    Dismiss
                </button>
            </div>
        </div>
    `;
    
    section.classList.add('active');
}

function hideContinueJourneySection() {
    const section = document.getElementById('continueJourneySection');
    if (section) {
        section.classList.remove('active');
    }
}

function continuePendingBooking() {
    const pendingBooking = localStorage.getItem('domihive_pending_booking');
    
    if (pendingBooking) {
        showNotification('Continuing your booking...', 'success');
        
        // Navigate to book inspection with the pending property
        if (window.spa && typeof window.spa.navigateToSection === 'function') {
            window.spa.navigateToSection('book-inspection');
        } else {
            window.location.href = '/Pages/book-inspection.html';
        }
        
        // Log activity
        logActivity('booking_continue', 'Continued pending property booking');
    }
}

function dismissPendingBooking() {
    localStorage.removeItem('domihive_pending_booking');
    hideContinueJourneySection();
    showNotification('Booking dismissed', 'info');
}

// ===== USER DATA MANAGEMENT =====
function loadCurrentUser() {
    const userData = localStorage.getItem('domihive_current_user');
    
    if (userData) {
        try {
            currentUser = JSON.parse(userData);
            console.log('👤 User loaded:', currentUser.name);
            updateUserGreeting();
        } catch (error) {
            console.error('Error loading user data:', error);
            currentUser = getDefaultUser();
        }
    } else {
        console.log('⚠️ No user found, creating demo user');
        currentUser = getDefaultUser();
        localStorage.setItem('domihive_current_user', JSON.stringify(currentUser));
    }
}

function getDefaultUser() {
    const userId = 'user_' + Date.now();
    return {
        id: userId,
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '+2348012345678',
        joinDate: new Date().toISOString(),
        tier: 'premium',
        referralCode: generateReferralCode(userId)
    };
}

function updateUserGreeting() {
    const welcomeTitle = document.getElementById('welcomeTitle');
    if (!welcomeTitle) return;
    
    const hour = new Date().getHours();
    let greeting = 'Good Morning';
    
    if (hour >= 12 && hour < 17) {
        greeting = 'Good Afternoon';
    } else if (hour >= 17) {
        greeting = 'Good Evening';
    }
    
    welcomeTitle.innerHTML = `${greeting}, <span id="userName">${currentUser.name}</span>! 👋`;
}

function loadUserPreferences() {
    const preferences = localStorage.getItem('domihive_user_preferences');
    if (preferences) {
        try {
            const prefs = JSON.parse(preferences);
            autoPayEnabled = prefs.autoPayEnabled || false;
            updateAutoPayUI();
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    }
}

function saveUserPreferences() {
    const preferences = {
        autoPayEnabled: autoPayEnabled,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('domihive_user_preferences', JSON.stringify(preferences));
}

// ===== PROPERTY INTERESTS SYSTEM =====
function loadPropertyInterests() {
    const interests = localStorage.getItem('domihive_property_interests');
    if (interests) {
        try {
            propertyInterests = JSON.parse(interests);
            // Ensure it's an array
            if (!Array.isArray(propertyInterests)) {
                propertyInterests = generateSamplePropertyInterests();
            }
        } catch (error) {
            console.error('Error loading property interests:', error);
            propertyInterests = generateSamplePropertyInterests();
        }
    } else {
        propertyInterests = generateSamplePropertyInterests();
        savePropertyInterests();
    }
    return propertyInterests;
}

function generateSamplePropertyInterests() {
    return [
        {
            id: 'prop_001',
            title: 'Luxury Apartment in Victoria Island',
            price: 220000,
            location: 'Victoria Island, Lagos',
            bedrooms: 3,
            bathrooms: 2,
            area: '1200 sq ft',
            image: 'https://images.unsplash.com/photo-1545323157-f6f63c0d66a7?w=400&h=300&fit=crop',
            viewedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // Store as ISO string
            stillInterested: null,
            similarProperties: []
        }
    ];
}

function generateSamplePropertyInterests() {
    return [
        {
            id: 'prop_001',
            title: 'Luxury Apartment in Victoria Island',
            price: 220000,
            location: 'Victoria Island, Lagos',
            bedrooms: 3,
            bathrooms: 2,
            area: '1200 sq ft',
            image: 'https://images.unsplash.com/photo-1545323157-f6f63c0d66a7?w=400&h=300&fit=crop',
            viewedAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
            stillInterested: null, // null, true, or false
            similarProperties: []
        },
        {
            id: 'prop_002',
            title: 'Modern Lekki Apartment',
            price: 180000,
            location: 'Lekki Phase 1, Lagos',
            bedrooms: 2,
            bathrooms: 2,
            area: '950 sq ft',
            image: 'https://images.unsplash.com/photo-1564019471349-34e8a875c5c8?w=400&h=300&fit=crop',
            viewedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            stillInterested: true,
            similarProperties: []
        }
    ];
}

function savePropertyInterests() {
    localStorage.setItem('domihive_property_interests', JSON.stringify(propertyInterests));
}

function updatePropertyInterest(propertyId, interested) {
    const interest = propertyInterests.find(pi => pi.id === propertyId);
    if (interest) {
        interest.stillInterested = interested;
        interest.updatedAt = new Date();
        savePropertyInterests();
        renderPropertiesActivity();
        
        showNotification(
            interested ? 'Marked as still interested!' : 'Removed from interests',
            interested ? 'success' : 'info'
        );
        
        logActivity(
            interested ? 'property_interest_keep' : 'property_interest_remove',
            `${interested ? 'Kept' : 'Removed'} interest in ${interest.title}`
        );
    }
}

// ===== RECENT PROPERTIES SYSTEM =====
function initializeRecentProperties() {
    loadRecentProperties();
    updateRecentPropertiesUI();
}

function loadRecentProperties() {
    const propertyInterests = localStorage.getItem('domihive_property_interests');
    if (propertyInterests) {
        try {
            return JSON.parse(propertyInterests);
        } catch (error) {
            console.error('Error loading property interests:', error);
            return [];
        }
    }
    return [];
}

function updateRecentPropertiesUI() {
    const recentPropertiesGrid = document.getElementById('recentPropertiesGrid');
    if (!recentPropertiesGrid) return;
    
    const recentProperties = loadRecentProperties();
    
    if (recentProperties.length === 0) {
        recentPropertiesGrid.innerHTML = `
            <div class="empty-recent-properties">
                <div class="empty-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No Recent Properties</h3>
                <p>Properties you view will appear here for easy access</p>
                <button class="browse-properties-btn" onclick="spa.navigateToSection('browse')">
                    <i class="fas fa-search"></i>
                    Browse Properties
                </button>
            </div>
        `;
        return;
    }
    
    // Show last 6 properties
    const displayProperties = recentProperties.slice(-6).reverse();
    
    recentPropertiesGrid.innerHTML = displayProperties.map(property => `
        <div class="property-card" onclick="viewPropertyDetails('${property.id}')">
            <div class="property-image">
                <img src="${property.image || 'https://images.unsplash.com/photo-1545323157-f6f63c0d66a7?w=400&h=300&fit=crop'}" 
                     alt="${property.title}" 
                     onerror="this.src='https://images.unsplash.com/photo-1545323157-f6f63c0d66a7?w=400&h=300&fit=crop'">
            </div>
            <div class="property-details">
                <div class="property-price">₦${property.price?.toLocaleString() || '0'}/year</div>
                <div class="property-title">${property.title || 'Unknown Property'}</div>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${property.location || 'Location not specified'}</span>
                </div>
                <div class="property-features">
                    <div class="property-feature">
                        <i class="fas fa-bed"></i>
                        <span>${property.bedrooms || 0} beds</span>
                    </div>
                    <div class="property-feature">
                        <i class="fas fa-bath"></i>
                        <span>${property.bathrooms || 0} baths</span>
                    </div>
                    <div class="property-feature">
                        <i class="fas fa-ruler-combined"></i>
                        <span>${property.area || 'N/A'} sq ft</span>
                    </div>
                </div>
                <div class="property-actions">
                    <button class="btn-view-details" onclick="event.stopPropagation(); viewPropertyDetails('${property.id}')">
                        View Details
                    </button>
                    <button class="btn-favorite ${isPropertyFavorited(property.id) ? 'active' : ''}" 
                            onclick="event.stopPropagation(); toggleFavorite('${property.id}')">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function viewPropertyDetails(propertyId) {
    console.log('Viewing property:', propertyId);
    showNotification(`Opening property details...`, 'info');
    
    // Navigate to property details page
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('property-details');
    } else {
        window.location.href = '/Pages/property-details-rent.html?id=' + propertyId;
    }
    
    // Simulate property view tracking
    setTimeout(() => {
        logActivity('property_view', `Viewed property ${propertyId}`);
    }, 1000);
}

function isPropertyFavorited(propertyId) {
    const favorites = JSON.parse(localStorage.getItem('domihive_user_favorites') || '[]');
    return favorites.includes(propertyId);
}

function toggleFavorite(propertyId) {
    let favorites = JSON.parse(localStorage.getItem('domihive_user_favorites') || '[]');
    
    if (favorites.includes(propertyId)) {
        favorites = favorites.filter(id => id !== propertyId);
        showNotification('Removed from favorites', 'info');
    } else {
        favorites.push(propertyId);
        showNotification('Added to favorites', 'success');
    }
    
    localStorage.setItem('domihive_user_favorites', JSON.stringify(favorites));
    updateRecentPropertiesUI();
    updateSidebarStatus();
}

function loadUserApplications() {
    const applications = localStorage.getItem('domihive_user_applications');
    if (applications) {
        try {
            userApplications = JSON.parse(applications);
            // Convert date strings back to Date objects
            userApplications = userApplications.map(app => ({
                ...app,
                submittedAt: new Date(app.submittedAt),
                estimatedCompletion: new Date(app.estimatedCompletion)
            }));
        } catch (error) {
            console.error('Error loading applications:', error);
            userApplications = generateSampleApplications();
        }
    } else {
        userApplications = generateSampleApplications();
        saveUserApplications();
    }
    return userApplications;
}

function generateSampleApplications() {
    return [
        {
            id: 'app_001',
            propertyId: 'prop_001',
            status: 'under_review',
            submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            steps: {
                info: true,
                documents: true,
                payment: true
            },
            currentStep: 'review',
            estimatedCompletion: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
        },
        {
            id: 'app_002',
            propertyId: 'prop_002',
            status: 'submitted',
            submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            steps: {
                info: true,
                documents: false,
                payment: false
            },
            currentStep: 'documents',
            estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
        }
    ];
}

function saveUserApplications() {
    localStorage.setItem('domihive_user_applications', JSON.stringify(userApplications));
}

function initializeApplicationsSystem() {
    updateApplicationsUI();
    updateApplicationStats();
    updateSidebarStatus();
}

function updateApplicationsUI() {
    const applications = loadUserApplications();
    const currentApp = applications.find(app => app.status === 'submitted' || app.status === 'under_review');
    
    if (!currentApp) {
        // No active application
        document.querySelector('.application-status-card').innerHTML = `
            <div class="status-header">
                <h3>Application Progress</h3>
                <div class="live-badge">
                    <i class="fas fa-circle"></i>
                    Ready to Start
                </div>
            </div>
            <div class="no-application">
                <div class="no-app-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <h4>No Active Application</h4>
                <p>Start your property application journey</p>
                <button class="btn-continue" onclick="spa.navigateToSection('applications')">
                    Start Application
                </button>
            </div>
        `;
        return;
    }
    
    // Update progress steps based on application status
    updateProgressSteps(currentApp);
    updateCurrentApplication(currentApp);
}

function updateProgressSteps(application) {
    const progressTracker = document.querySelector('.progress-tracker');
    if (!progressTracker) return;
    
    const steps = [
        { step: 1, title: 'Information', completed: application.steps?.info || false },
        { step: 2, title: 'Documents', completed: application.steps?.documents || false },
        { step: 3, title: 'Payment', completed: application.steps?.payment || false }
    ];
    
    progressTracker.innerHTML = steps.map(step => `
        <div class="progress-step ${step.completed ? 'completed' : (step.step === 2 && application.status === 'under_review' ? 'active' : 'pending')}" 
             data-step="${step.step}">
            <div class="step-indicator">
                ${step.completed ? '<i class="fas fa-check"></i>' : `<span>${step.step}</span>`}
            </div>
            <div class="step-info">
                <span class="step-title">${step.title}</span>
                <span class="step-status">
                    ${step.completed ? 'Completed' : (step.step === 2 && application.status === 'under_review' ? 'In Progress' : 'Pending')}
                </span>
            </div>
        </div>
    `).join('');
}

function updateCurrentApplication(application) {
    const property = getPropertyById(application.propertyId);
    if (!property) return;
    
    const currentApplicationEl = document.querySelector('.current-application');
    if (currentApplicationEl) {
        currentApplicationEl.innerHTML = `
            <div class="property-preview">
                <div class="property-image">
                    <img src="${property.image || 'https://images.unsplash.com/photo-1545323157-f6f63c0d66a7?w=400&h=300&fit=crop'}" 
                         alt="${property.title}">
                </div>
                <div class="property-details">
                    <h4>${property.title}</h4>
                    <p>₦${property.price?.toLocaleString()}/year</p>
                    <span class="application-id">${application.id}</span>
                </div>
            </div>
        `;
    }
}

function updateApplicationStats() {
    const applications = loadUserApplications();
    
    const submittedCount = applications.filter(app => app.status === 'submitted').length;
    const reviewCount = applications.filter(app => app.status === 'under_review').length;
    const approvedCount = applications.filter(app => app.status === 'approved').length;
    
    // Update stats display
    const submittedEl = document.getElementById('submittedCount');
    const reviewEl = document.getElementById('reviewCount');
    const approvedEl = document.getElementById('approvedCount');
    const lastUpdatedEl = document.getElementById('appsLastUpdated');
    
    if (submittedEl) submittedEl.textContent = submittedCount;
    if (reviewEl) reviewEl.textContent = reviewCount;
    if (approvedEl) approvedEl.textContent = approvedCount;
    if (lastUpdatedEl) lastUpdatedEl.textContent = 'Updated just now';
    
    // Update sidebar status
    updateSidebarStatus();
}

function continueApplication(applicationId) {
    console.log('Continuing application:', applicationId);
    showNotification('Opening application...', 'info');
    
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('applications');
    }
    
    // Log activity
    logActivity('application_continue', `Continued application ${applicationId}`);
}

function getPropertyById(propertyId) {
    // This would typically fetch from your properties data
    // For now, return a mock property
    const properties = {
        'prop_001': {
            id: 'prop_001',
            title: 'Luxury Apartment in Victoria Island',
            price: 220000,
            image: 'https://images.unsplash.com/photo-1545323157-f6f63c0d66a7?w=400&h=300&fit=crop',
            location: 'Victoria Island, Lagos'
        },
        'prop_002': {
            id: 'prop_002',
            title: 'Modern Lekki Apartment',
            price: 180000,
            image: 'https://images.unsplash.com/photo-1564019471349-34e8a875c5c8?w=400&h=300&fit=crop',
            location: 'Lekki Phase 1, Lagos'
        }
    };
    
    return properties[propertyId] || {
        id: propertyId,
        title: 'Unknown Property',
        price: 0,
        image: 'https://images.unsplash.com/photo-1545323157-f6f63c0d66a7?w=400&h=300&fit=crop',
        location: 'Location not specified'
    };
}

// ===== PAYMENTS SYSTEM =====
function loadUserPayments() {
    const payments = localStorage.getItem('domihive_user_payments');
    if (payments) {
        try {
            userPayments = JSON.parse(payments);
        } catch (error) {
            console.error('Error loading payments:', error);
            userPayments = generateSamplePayments();
        }
    } else {
        userPayments = generateSamplePayments();
        saveUserPayments();
    }
    return userPayments;
}

function generateSamplePayments() {
    return [
        {
            id: 'pay_001',
            propertyId: 'prop_001',
            amount: 150000,
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            type: 'rent',
            status: 'pending',
            property: {
                title: 'Luxury Apartment in Victoria Island',
                image: 'https://images.unsplash.com/photo-1545323157-f6f63c0d66a7?w=400&h=300&fit=crop',
                location: 'Victoria Island, Lagos'
            }
        },
        {
            id: 'pay_002',
            propertyId: 'prop_002',
            amount: 120000,
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now (urgent)
            type: 'rent',
            status: 'pending',
            property: {
                title: 'Modern Lekki Apartment',
                image: 'https://images.unsplash.com/photo-1564019471349-34e8a875c5c8?w=400&h=300&fit=crop',
                location: 'Lekki Phase 1, Lagos'
            }
        }
    ];
}

function saveUserPayments() {
    localStorage.setItem('domihive_user_payments', JSON.stringify(userPayments));
}

// ===== ACTIVITY SYSTEM =====
function initializeActivitySystem() {
    loadActivities();
    initializeActivityFilters();
    renderActivities('all');
}

function loadActivities() {
    const storedActivities = localStorage.getItem('domihive_user_activities');
    if (storedActivities) {
        try {
            activities = JSON.parse(storedActivities);
        } catch (error) {
            console.error('Error loading activities:', error);
            activities = generateSampleActivities();
        }
    } else {
        activities = generateSampleActivities();
        saveActivities();
    }
    return activities;
}

function generateSampleActivities() {
    return [
        {
            id: 1,
            type: 'property',
            title: 'Property Viewed',
            description: 'You viewed Luxury Apartment in Victoria Island',
            time: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
            icon: 'fas fa-eye',
            propertyPrice: '₦220,000/year',
            propertyId: 'prop_001'
        },
        {
            id: 2,
            type: 'application',
            title: 'Application Submitted',
            description: 'Your application for Lekki Apartment was submitted',
            time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            icon: 'fas fa-file-alt',
            status: 'submitted',
            applicationId: 'app_002'
        },
        {
            id: 3,
            type: 'payment',
            title: 'Payment Processed',
            description: 'Application fee payment was successful',
            time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            icon: 'fas fa-credit-card',
            amount: '₦5,000',
            paymentId: 'pay_003'
        }
    ];
}

function saveActivities() {
    localStorage.setItem('domihive_user_activities', JSON.stringify(activities));
}

function renderActivities(filter = 'all') {
    // Hide all tab contents first
    document.querySelectorAll('.activity-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    const activeTab = document.querySelector(`.activity-tab-content[data-tab="${filter}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    switch(filter) {
        case 'all':
            renderAllActivities();
            break;
        case 'property':
            renderPropertiesActivity();
            break;
        case 'application':
            renderApplicationsActivity();
            break;
        case 'payment':
            renderPaymentsActivity();
            break;
    }
}

function renderAllActivities() {
    const activitiesTimeline = document.getElementById('activitiesTimeline');
    if (!activitiesTimeline) return;
    
    const filteredActivities = activities.slice(0, 10); // Show last 10 activities
    
    if (filteredActivities.length === 0) {
        activitiesTimeline.innerHTML = `
            <div class="empty-tab-content">
                <i class="fas fa-inbox"></i>
                <h4>No activities yet</h4>
                <p>Your activities will appear here as you use DomiHive</p>
            </div>
        `;
        return;
    }
    
    activitiesTimeline.innerHTML = filteredActivities.map(activity => `
        <div class="activity-item" data-type="${activity.type}" onclick="handleActivityClick(${activity.id})">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-meta">
                    <span class="activity-time">${formatRelativeTime(activity.time)}</span>
                    ${activity.propertyPrice ? `<span class="activity-property">${activity.propertyPrice}</span>` : ''}
                    ${activity.amount ? `<span class="activity-amount">${activity.amount}</span>` : ''}
                </div>
            </div>
            <button class="activity-action" onclick="event.stopPropagation(); handleActivityAction('${activity.type}', '${activity.propertyId || activity.applicationId || activity.paymentId}')">
                ${getActivityActionText(activity.type)}
            </button>
        </div>
    `).join('');
}

function renderPropertiesActivity() {
    const propertiesActivity = document.getElementById('propertiesActivity');
    if (!propertiesActivity) return;
    
    if (propertyInterests.length === 0) {
        propertiesActivity.innerHTML = `
            <div class="empty-tab-content">
                <i class="fas fa-home"></i>
                <h4>No property interests</h4>
                <p>Properties you view will appear here</p>
                <button class="browse-properties-btn" onclick="spa.navigateToSection('browse')" style="margin-top: 1rem;">
                    Browse Properties
                </button>
            </div>
        `;
        return;
    }
    
    propertiesActivity.innerHTML = propertyInterests.map(interest => `
        <div class="property-interest-item">
            <div class="interest-property-image">
                <img src="${interest.image}" alt="${interest.title}">
            </div>
            <div class="interest-property-details">
                <h4>${interest.title}</h4>
                <div class="interest-property-price">₦${interest.price.toLocaleString()}/year</div>
                <div class="interest-property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${interest.location}</span>
                </div>
                <div class="interest-actions">
                    ${interest.stillInterested === null ? `
                        <button class="interest-btn still-interested-btn" onclick="updatePropertyInterest('${interest.id}', true)">
                            Still Interested?
                        </button>
                        <button class="interest-btn not-interested-btn" onclick="updatePropertyInterest('${interest.id}', false)">
                            Not Interested
                        </button>
                    ` : interest.stillInterested ? `
                        <span style="color: var(--success); font-weight: 600;">✓ Still Interested</span>
                    ` : `
                        <span style="color: var(--gray);">Not Interested</span>
                    `}
                    <button class="interest-btn view-similar-btn" onclick="showSimilarProperties('${interest.id}')">
                        View Similar
                    </button>
                </div>
                <div class="similar-properties-grid" id="similarProperties_${interest.id}" style="display: none;">
                    <!-- Similar properties will be loaded here -->
                </div>
            </div>
        </div>
    `).join('');
}

function renderApplicationsActivity() {
    const applicationsActivity = document.getElementById('applicationsActivity');
    if (!applicationsActivity) return;
    
    if (userApplications.length === 0) {
        applicationsActivity.innerHTML = `
<div class="application-details">
    Applied on ${application.submittedAt ? application.submittedAt.toLocaleDateString() : 'Recent'}
</div>
<div class="application-date">
    Estimated completion: ${application.estimatedCompletion ? application.estimatedCompletion.toLocaleDateString() : 'Soon'}
</div>
        `;
        return;
    }
    
    applicationsActivity.innerHTML = userApplications.map(application => {
        const property = getPropertyById(application.propertyId);
        const statusClass = application.status === 'under_review' ? 'review' : 
                           application.status === 'approved' ? 'completed' : 'pending';
        
        return `
            <div class="application-activity-item">
                <div class="application-progress">
                    <h4>${property.title}</h4>
                    <span class="application-status ${statusClass}">
                        ${application.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <div class="application-details">
                        Applied on ${application.submittedAt.toLocaleDateString()}
                    </div>
                    <div class="application-date">
                        Estimated completion: ${application.estimatedCompletion.toLocaleDateString()}
                    </div>
                </div>
                <button class="activity-action" onclick="continueApplication('${application.id}')">
                    View Application
                </button>
            </div>
        `;
    }).join('');
}

function renderPaymentsActivity() {
    const paymentsActivity = document.getElementById('paymentsActivity');
    if (!paymentsActivity) return;
    
    if (userPayments.length === 0) {
        paymentsActivity.innerHTML = `
            <div class="empty-tab-content">
                <i class="fas fa-credit-card"></i>
                <h4>No upcoming payments</h4>
                <p>Your upcoming payments will appear here</p>
            </div>
        `;
        return;
    }
    
    paymentsActivity.innerHTML = userPayments.map(payment => {
        const daysUntilDue = Math.ceil((payment.dueDate - new Date()) / (1000 * 60 * 60 * 24));
        const isUrgent = daysUntilDue <= 3;
        
        return `
            <div class="payment-activity-item">
                <div class="payment-property-image">
                    <img src="${payment.property.image}" alt="${payment.property.title}">
                </div>
                <div class="payment-details">
                    <h4>${payment.property.title}</h4>
                    <div class="payment-amount">₦${payment.amount.toLocaleString()}</div>
                    <div class="payment-due-date ${isUrgent ? 'urgent' : ''}">
                        <i class="fas fa-calendar-alt"></i>
                        Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}
                    </div>
                </div>
                <div class="payment-actions">
                    <button class="pay-now-btn" onclick="processPayment('${payment.id}')">
                        Pay Now
                    </button>
                    <button class="view-details-btn" onclick="viewPaymentDetails('${payment.id}')">
                        Details
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function initializeActivityFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter activities
            const filter = this.getAttribute('data-filter');
            renderActivities(filter);
        });
    });
}

function getActivityActionText(type) {
    const actions = {
        'property': 'View Similar',
        'application': 'View App',
        'payment': 'View Details'
    };
    return actions[type] || 'View';
}

function handleActivityClick(activityId) {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;
    
    console.log('Activity clicked:', activity);
    
    // Navigate based on activity type
    switch(activity.type) {
        case 'property':
            if (window.spa && typeof window.spa.navigateToSection === 'function') {
                window.spa.navigateToSection('browse');
            }
            break;
        case 'application':
            if (window.spa && typeof window.spa.navigateToSection === 'function') {
                window.spa.navigateToSection('applications');
            }
            break;
        case 'payment':
            if (window.spa && typeof window.spa.navigateToSection === 'function') {
                window.spa.navigateToSection('payments');
            }
            break;
    }
}

function handleActivityAction(type, id) {
    switch(type) {
        case 'property':
            showSimilarProperties(id);
            break;
        case 'application':
            continueApplication(id);
            break;
        case 'payment':
            viewPaymentDetails(id);
            break;
    }
}

function showSimilarProperties(propertyId) {
    const interest = propertyInterests.find(pi => pi.id === propertyId);
    if (!interest) return;
    
    const similarContainer = document.getElementById(`similarProperties_${propertyId}`);
    if (!similarContainer) return;
    
    // Toggle visibility
    if (similarContainer.style.display === 'block') {
        similarContainer.style.display = 'none';
        return;
    }
    
    // Load similar properties (this would come from your browse-content data)
    const similarProperties = findSimilarProperties(interest);
    
    similarContainer.innerHTML = similarProperties.map(property => `
        <div class="property-card" onclick="viewPropertyDetails('${property.id}')">
            <div class="property-image">
                <img src="${property.image}" alt="${property.title}">
            </div>
            <div class="property-details">
                <div class="property-price">₦${property.price.toLocaleString()}/year</div>
                <div class="property-title">${property.title}</div>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${property.location}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    similarContainer.style.display = 'block';
}

function findSimilarProperties(interest) {
    // This would integrate with your browse-content.html property data
    // For now, return sample similar properties
    return [
        {
            id: 'prop_sim_001',
            title: 'Similar Luxury Apartment',
            price: interest.price + 20000,
            location: interest.location,
            image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop'
        },
        {
            id: 'prop_sim_002',
            title: 'Modern Similar Property',
            price: interest.price - 30000,
            location: interest.location,
            image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=300&fit=crop'
        }
    ];
}

function refreshActivities() {
    showNotification('Refreshing activities...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        loadActivities();
        const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
        renderActivities(activeFilter);
        showNotification('Activities updated!', 'success');
    }, 1000);
}

function logActivity(type, description) {
    const newActivity = {
        id: activities.length + 1,
        type: type,
        title: getActivityTitle(type),
        description: description,
        time: new Date(),
        icon: getActivityIcon(type)
    };
    
    activities.unshift(newActivity);
    
    // Keep only last 50 activities
    if (activities.length > 50) {
        activities = activities.slice(0, 50);
    }
    
    saveActivities();
    
    // Update the currently active tab
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    renderActivities(activeFilter);
}

function getActivityTitle(type) {
    const titles = {
        'property_view': 'Property Viewed',
        'application_submit': 'Application Submitted',
        'payment_success': 'Payment Processed',
        'favorite_add': 'Added to Favorites',
        'booking_continue': 'Continued Booking',
        'property_interest_keep': 'Property Interest Kept',
        'property_interest_remove': 'Property Interest Removed'
    };
    return titles[type] || 'Activity Recorded';
}

function getActivityIcon(type) {
    const icons = {
        'property_view': 'fas fa-eye',
        'application_submit': 'fas fa-file-alt',
        'payment_success': 'fas fa-credit-card',
        'favorite_add': 'fas fa-heart',
        'booking_continue': 'fas fa-play',
        'property_interest_keep': 'fas fa-star',
        'property_interest_remove': 'fas fa-times'
    };
    return icons[type] || 'fas fa-bell';
}

// ===== SMART RECOMMENDATIONS =====
function initializeSmartRecommendations() {
    updateAutoPayUI();
    initializeReferralSystem();
}

function toggleAutoPay() {
    const toggle = document.getElementById('autoPayToggle');
    if (!toggle) return;
    
    autoPayEnabled = toggle.checked;
    saveUserPreferences();
    updateAutoPayUI();
    
    showNotification(
        autoPayEnabled ? 'Auto-pay enabled successfully!' : 'Auto-pay disabled',
        autoPayEnabled ? 'success' : 'info'
    );
    
    logActivity(
        autoPayEnabled ? 'autopay_enable' : 'autopay_disable',
        autoPayEnabled ? 'Enabled automatic payments' : 'Disabled automatic payments'
    );
}

function updateAutoPayUI() {
    const toggle = document.getElementById('autoPayToggle');
    const statusLabel = document.getElementById('autoPayStatus');
    const detailsSection = document.getElementById('autoPayDetails');
    
    if (toggle) toggle.checked = autoPayEnabled;
    if (statusLabel) {
        statusLabel.textContent = autoPayEnabled ? 'Auto-Pay Enabled' : 'Enable Auto-Pay';
    }
    if (detailsSection) {
        if (autoPayEnabled) {
            detailsSection.style.display = 'block';
            // Update with real data
            document.getElementById('nextAutoPayDate').textContent = '15th Jan 2024';
            document.getElementById('autoPayAmount').textContent = '₦150,000';
        } else {
            detailsSection.style.display = 'none';
        }
    }
}

// ===== REFERRAL SYSTEM =====
function loadReferralData() {
    const storedData = localStorage.getItem('domihive_referral_data');
    if (storedData) {
        try {
            referralData = JSON.parse(storedData);
        } catch (error) {
            console.error('Error loading referral data:', error);
            referralData = initializeReferralData();
        }
    } else {
        referralData = initializeReferralData();
        saveReferralData();
    }
    return referralData;
}

function initializeReferralData() {
    return {
        userId: currentUser?.id || 'unknown',
        referralCode: currentUser?.referralCode || generateReferralCode(),
        earnings: 0,
        successfulReferrals: 0,
        totalClicks: 0,
        createdAt: new Date().toISOString()
    };
}

function saveReferralData() {
    localStorage.setItem('domihive_referral_data', JSON.stringify(referralData));
}

function initializeReferralSystem() {
    updateReferralUI();
    generateReferralLink();
}

function generateReferralCode(userId = null) {
    const baseCode = 'DOMI';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const userPart = userId ? userId.slice(-4) : 'USER';
    return `${baseCode}-${userPart}-${randomNum}`;
}

function generateReferralLink() {
    const linkInput = document.getElementById('referralLinkInput');
    if (!linkInput || !referralData) return;
    
    const baseUrl = window.location.origin;
    const referralLink = `${baseUrl}/ref/${referralData.referralCode}`;
    linkInput.value = referralLink;
}

function updateReferralUI() {
    const earningsEl = document.getElementById('referralEarnings');
    const countEl = document.getElementById('referralCount');
    
    if (earningsEl) earningsEl.textContent = `₦${referralData.earnings.toLocaleString()}`;
    if (countEl) countEl.textContent = referralData.successfulReferrals.toString();
}

function copyReferralLink() {
    const linkInput = document.getElementById('referralLinkInput');
    if (!linkInput) return;
    
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        navigator.clipboard.writeText(linkInput.value).then(() => {
            showNotification('Referral link copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            document.execCommand('copy');
            showNotification('Referral link copied to clipboard!', 'success');
        });
    } catch (error) {
        console.error('Failed to copy:', error);
        showNotification('Failed to copy link', 'error');
    }
}

function shareReferral(platform) {
    const linkInput = document.getElementById('referralLinkInput');
    if (!linkInput) return;
    
    const message = `Join me on DomiHive! Use my referral code for amazing property deals. Your referral code: ${referralData.referralCode}`;
    const url = linkInput.value;
    
    let shareUrl = '';
    
    switch(platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`;
            break;
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`;
            break;
        default:
            return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    logActivity('referral_share', `Shared referral link via ${platform}`);
}

// ===== SIDEBAR STATUS UPDATES =====
function updateSidebarStatus() {
    const applications = loadUserApplications();
    const favorites = JSON.parse(localStorage.getItem('domihive_user_favorites') || '[]');
    const recentProperties = loadRecentProperties();
    
    // Update status values
    updateStatusElement('browseStatus', `${recentProperties.length > 0 ? 'Continue browsing' : '80+ verified properties'}`);
    updateStatusElement('applicationsStatus', `${applications.length} active applications`);
    updateStatusElement('inspectionsStatus', '0 upcoming inspections'); // Would come from real data
    updateStatusElement('favoritesStatus', `${favorites.length} saved properties`);
    updateStatusElement('messagesStatus', '0 unread messages'); // Would come from real data
    
    // Update badges
    updateBadgeElement('applicationsBadge', applications.length);
    updateBadgeElement('inspectionsBadge', 0);
    updateBadgeElement('favoritesBadge', favorites.length);
    updateBadgeElement('messagesBadge', 0);
}

function updateStatusElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) element.textContent = value;
}

function updateBadgeElement(elementId, count) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = count;
        element.style.display = count > 0 ? 'flex' : 'none';
    }
}

// ===== REAL-TIME UPDATES =====
function initializeRealTimeUpdates() {
    // Update every 30 seconds
    liveDataInterval = setInterval(updateLiveData, 30000);
    
    // Initial update
    updateLiveData();
}

function updateLiveData() {
    console.log('🔄 Updating live data...');
    
    // Update all components
    updateRecentPropertiesUI();
    updateApplicationsUI();
    updateApplicationStats();
    updateSidebarStatus();
    updateReferralUI();
    
    // Simulate occasional new activities
    if (Math.random() > 0.8) {
        simulateNewActivity();
    }
}

function simulateNewActivity() {
    const activityTypes = ['property_view', 'application_submit', 'payment_success'];
    const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    
    const messages = {
        'property_view': 'Viewed new property in your area',
        'application_submit': 'New application submitted by user',
        'payment_success': 'Payment processed successfully'
    };
    
    logActivity(randomType, messages[randomType]);
}

function startLiveDataUpdates() {
    console.log('🔄 Starting live data updates...');
}

// ===== PAYMENT FUNCTIONS =====
function processPayment(paymentId) {
    showNotification('Processing payment...', 'info');
    
    // Simulate payment processing
    setTimeout(() => {
        const payment = userPayments.find(p => p.id === paymentId);
        if (payment) {
            payment.status = 'paid';
            payment.paidAt = new Date();
            saveUserPayments();
            
            showNotification('Payment processed successfully!', 'success');
            logActivity('payment_success', `Paid ₦${payment.amount.toLocaleString()} for ${payment.property.title}`);
            
            // Refresh payments display
            renderPaymentsActivity();
        }
    }, 2000);
}

function viewPaymentDetails(paymentId) {
    const payment = userPayments.find(p => p.id === paymentId);
    if (payment) {
        showNotification(`Opening payment details for ${payment.property.title}`, 'info');
        // Navigate to payment details page
        if (window.spa && typeof window.spa.navigateToSection === 'function') {
            window.spa.navigateToSection('payments');
        }
    }
}

// ===== UTILITY FUNCTIONS =====
function formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
}

function showNotification(message, type = 'info') {
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
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        font-weight: 500;
        backdrop-filter: blur(10px);
    `;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Refresh activities button
    const refreshBtn = document.querySelector('.refresh-activities-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshActivities);
    }
    
    // Auto-pay toggle
    const autoPayToggle = document.getElementById('autoPayToggle');
    if (autoPayToggle) {
        autoPayToggle.addEventListener('change', toggleAutoPay);
    }
    
    // Window focus for data refresh
    window.addEventListener('focus', () => {
        console.log('🔄 Window focused - refreshing data');
        updateLiveData();
    });
}

// ===== CLEANUP =====
function cleanupOverview() {
    if (liveDataInterval) {
        clearInterval(liveDataInterval);
    }
    console.log('🧹 Overview cleanup completed');
}

// ===== SPA INTEGRATION =====
window.spaOverviewInit = function() {
    console.log('🎯 SPA: Initializing Overview Content');
    initializeOverview();
};

// ===== GLOBAL FUNCTIONS =====
window.initializeOverview = initializeOverview;
window.refreshActivities = refreshActivities;
window.toggleAutoPay = toggleAutoPay;
window.copyReferralLink = copyReferralLink;
window.shareReferral = shareReferral;
window.continueApplication = continueApplication;
window.viewPropertyDetails = viewPropertyDetails;
window.toggleFavorite = toggleFavorite;
window.updatePropertyInterest = updatePropertyInterest;
window.showSimilarProperties = showSimilarProperties;
window.processPayment = processPayment;
window.viewPaymentDetails = viewPaymentDetails;
window.continuePendingBooking = continuePendingBooking;
window.dismissPendingBooking = dismissPendingBooking;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.overview-content')) {
        setTimeout(initializeOverview, 1000);
    }
});

// Cleanup when leaving the page
window.addEventListener('beforeunload', cleanupOverview);

console.log('🎉 DomiHive Live Overview Dashboard Loaded! - Complete Version');