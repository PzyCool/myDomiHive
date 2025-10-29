// my-properties-content.js - My Properties Management System

// SPA Integration
window.spaMyPropertiesInit = function() {
    console.log('🎯 SPA: Initializing My Properties Content');
    initializePropertiesSystem();
};

// Auto-initialize if loaded directly
if (window.location.pathname.includes('my-properties-content.html')) {
    document.addEventListener('DOMContentLoaded', initializePropertiesSystem);
} else {
    // SPA environment - check if we're on the page and initialize
    setTimeout(function() {
        if (document.querySelector('.my-properties-content')) {
            console.log('🔍 Detected SPA environment - auto-initializing');
            initializePropertiesSystem();
        }
    }, 500);
}

function initializePropertiesSystem() {
    console.log('🏠 Initializing My Properties System...');
    
    // Global variables
    let userProperties = [];
    
    // Load user data and properties
    loadUserProperties();
    
    // Render properties grid
    renderPropertiesGrid();
    
    // Update statistics
    updateStatistics();
    
    console.log('✅ My Properties system ready');
}

function loadUserProperties() {
    console.log('📦 Loading user properties...');
    
    // Try to load from localStorage first
    const storedProperties = localStorage.getItem('domihive_user_properties');
    
    if (storedProperties && JSON.parse(storedProperties).length > 0) {
        userProperties = JSON.parse(storedProperties);
        console.log('✅ Loaded properties from storage:', userProperties.length);
    } else {
        console.log('📝 No properties found, creating demo properties...');
        
        // Check if user is tenant
        const currentUser = JSON.parse(localStorage.getItem('domihive_current_user') || sessionStorage.getItem('domihive_current_user') || '{}');
        
        if (currentUser.userType === 'tenant' || currentUser.tenantActivated) {
            console.log('✅ User is tenant, creating demo properties');
            createDemoProperties();
        } else {
            console.log('🎭 User not tenant, but creating demo properties for testing');
            createDemoProperties();
            
            // Mark user as tenant for future
            currentUser.userType = 'tenant';
            currentUser.tenantActivated = true;
            localStorage.setItem('domihive_current_user', JSON.stringify(currentUser));
            sessionStorage.setItem('domihive_current_user', JSON.stringify(currentUser));
        }
    }
    
    // Sort by most recent
    userProperties.sort((a, b) => new Date(b.leaseStart) - new Date(a.leaseStart));
}

function createDemoProperties() {
    console.log('🏗️ Creating demo properties...');
    
    const demoProperties = [
        {
            id: 'prop_1',
            title: 'Luxury 3-Bedroom Apartment in Ikoyi',
            location: 'Ikoyi, Lagos',
            price: 15000000,
            image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
            leaseStart: '2024-01-15',
            leaseEnd: '2025-01-14',
            status: 'active',
            rentDueDate: '2024-02-01',
            documents: {
                tenantAgreement: { signed: true, signedDate: '2024-01-10' },
                domihiveAgreement: { signed: true, signedDate: '2024-01-10' }
            }
        },
        {
            id: 'prop_2',
            title: 'Modern 2-Bedroom Condo in Victoria Island',
            location: 'Victoria Island, Lagos',
            price: 12000000,
            image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
            leaseStart: '2024-02-01',
            leaseEnd: '2025-01-31',
            status: 'active',
            rentDueDate: '2024-03-01',
            documents: {
                tenantAgreement: { signed: true, signedDate: '2024-01-25' },
                domihiveAgreement: { signed: true, signedDate: '2024-01-25' }
            }
        }
    ];
    
    userProperties = demoProperties;
    saveUserProperties();
    console.log('✅ Created', demoProperties.length, 'demo properties');
}

function saveUserProperties() {
    localStorage.setItem('domihive_user_properties', JSON.stringify(userProperties));
}

function renderPropertiesGrid() {
    console.log('🎨 Rendering properties grid...');
    
    const container = document.getElementById('propertiesGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!container) {
        console.error('❌ Properties grid container not found!');
        return;
    }
    
    if (userProperties.length === 0) {
        // Show empty state
        container.innerHTML = '';
        if (emptyState) emptyState.classList.add('visible');
        console.log('📭 No properties to display');
        return;
    }
    
    // Hide empty state
    if (emptyState) emptyState.classList.remove('visible');
    
    // Create property cards
    const propertiesHTML = userProperties.map(property => {
        const statusClass = property.status === 'active' ? 'status-active' : 'status-ending';
        const statusText = property.status === 'active' ? 'Active' : 'Ending Soon';
        const badgeType = property.status === 'active' ? 'badge-active' : 'badge-ending';
        
        return `
            <div class="property-card" data-property-id="${property.id}">
                <div class="property-image">
                    <img src="${property.image}" alt="${property.title}" onerror="this.src='/ASSECT/placeholder-property.jpg'">
                    <div class="property-badges">
                        <span class="property-badge ${badgeType}">${statusText}</span>
                    </div>
                </div>
                
                <div class="property-details">
                    <div class="property-price">₦${property.price.toLocaleString()}/year</div>
                    <h3 class="property-title">${property.title}</h3>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${property.location}
                    </div>
                    
                    <div class="lease-info">
                        <span class="lease-dates">
                            ${formatDate(property.leaseStart)} - ${formatDate(property.leaseEnd)}
                        </span>
                        <span class="lease-status ${statusClass}">${statusText}</span>
                    </div>
                    
                    <div class="property-actions">
                        <button class="btn-view-details" onclick="openPropertyDashboard('${property.id}')">
                            <i class="fas fa-chart-line"></i>
                            View Dashboard
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = propertiesHTML;
    console.log('✅ Rendered', userProperties.length, 'property cards');
}

function updateStatistics() {
    console.log('📊 Updating statistics...');
    
    const activeProperties = userProperties.filter(p => p.status === 'active').length;
    const signedDocuments = userProperties.filter(p => 
        p.documents.tenantAgreement.signed && p.documents.domihiveAgreement.signed
    ).length;
    
    // Calculate upcoming payments (within 30 days)
    const today = new Date();
    const upcomingPayments = userProperties.filter(p => {
        if (p.status !== 'active') return false;
        const dueDate = new Date(p.rentDueDate);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays >= 0;
    }).length;
    
    // Update DOM elements
    const activeEl = document.getElementById('activeProperties');
    const signedEl = document.getElementById('signedDocuments');
    const paymentsEl = document.getElementById('upcomingPayments');
    
    if (activeEl) activeEl.textContent = activeProperties;
    if (signedEl) signedEl.textContent = signedDocuments;
    if (paymentsEl) paymentsEl.textContent = upcomingPayments;
    
    console.log('✅ Statistics updated - Active:', activeProperties, 'Signed:', signedDocuments, 'Due:', upcomingPayments);
}

// Global function to open property dashboard
window.openPropertyDashboard = function(propertyId) {
    console.log('🏠 Opening property dashboard for:', propertyId);
    
    // Store the selected property for the next page
    sessionStorage.setItem('currentPropertyId', propertyId);
    
    // For SPA - we need to load the tenant-property content
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        // Store property ID for the tenant-property page to use
        sessionStorage.setItem('currentPropertyId', propertyId);
        window.spa.navigateToSection('tenant-property');
    } else {
        // Direct page load
        window.location.href = '/Pages/tenant-property.html';
    }
};

// Add these functions to my-properties-content.js
function viewPropertyDetails(propertyId) {
    console.log('🏠 Viewing property details:', propertyId);
    if (window.spa && window.spa.showPropertyDetails) {
        window.spa.showPropertyDetails(propertyId);
    } else {
        console.error('SPA navigation not available');
    }
}

function bookInspection(propertyId) {
    console.log('📅 Booking inspection for:', propertyId);
    if (window.spa && window.spa.showBookInspection) {
        window.spa.showBookInspection(propertyId);
    } else {
        console.error('SPA navigation not available');
    }
}

// Make them globally available
window.viewPropertyDetails = viewPropertyDetails;
window.bookInspection = bookInspection;

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ===== PROPERTY NAVIGATION FUNCTIONS =====

// Global function to view property details
window.viewPropertyDetails = function(propertyId) {
    console.log('🏠 Opening property details for:', propertyId);
    
    // Store the selected property for the next page
    const property = userProperties.find(p => p.id === propertyId);
    if (property) {
        localStorage.setItem('current_property_view', JSON.stringify(property));
    }
    
    // ✅ USE SPA NAVIGATION TO REGISTERED SECTION
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('property-details-rent');
    } else {
        // Fallback
        window.location.href = '/Pages/property-details-rent.html';
    }
};

// Global function to book inspection
window.bookInspection = function(propertyId) {
    console.log('📅 Booking inspection for:', propertyId);
    
    // Store the selected property for inspection
    const property = userProperties.find(p => p.id === propertyId);
    if (property) {
        localStorage.setItem('inspection_property', JSON.stringify(property));
    }
    
    // ✅ USE SPA NAVIGATION TO REGISTERED SECTION
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('book-inspection');
    } else {
        // Fallback
        window.location.href = '/Pages/book-inspection.html';
    }
};

// Global function to navigate to My Properties (already exists, keep it)
window.goToMyProperties = function() {
    console.log('🔙 Navigating to My Properties...');
    
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('my-properties');
    } else {
        window.location.href = '/Pages/my-properties-content.html';
    }
};

// Global function to add property (for notification activation)
window.addUserProperty = function(propertyData) {
    console.log('🏠 Adding new user property...');
    
    const newProperty = {
        id: 'prop_' + Date.now(),
        status: 'active',
        documents: {
            tenantAgreement: { signed: false, signedDate: null },
            domihiveAgreement: { signed: false, signedDate: null }
        },
        ...propertyData
    };
    
    userProperties.unshift(newProperty);
    saveUserProperties();
    
    // Update UI
    renderPropertiesGrid();
    updateStatistics();
    
    console.log('✅ Added new property:', newProperty.id);
    return newProperty.id;
};

// Global function to check if user has properties
window.hasUserProperties = function() {
    return userProperties.length > 0;
};

console.log('🎉 My Properties Content JavaScript Loaded!');