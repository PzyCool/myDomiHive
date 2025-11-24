// my-properties-content.js - Enhanced My Properties Management System with SPA Compatibility

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

// Global variables
let userProperties = [];
let currentPropertyType = '';

// Property type configuration
// Property type configuration
const PROPERTY_TYPES = {
    rent: {
        name: 'For Rent',
        icon: 'fa-home',
        color: '#3b82f6',
        spaSection: 'tenant-property' // ✅ Rent uses tenant-property
    },
    shortlet: {
        name: 'Shortlet',
        icon: 'fa-calendar-day',
        color: '#8b5cf6',
        spaSection: 'tenant-property-shortlet' // ✅ Shortlet uses its own section
    },
    commercial: {
        name: 'Commercial',
        icon: 'fa-building',
        color: '#06b6d4',
        spaSection: 'tenant-property-commercial' // ✅ Commercial uses its own section
    },
    buy: {
        name: 'Buy',
        icon: 'fa-key',
        color: '#ef4444',
        spaSection: 'tenant-property-buy' // ✅ Buy uses its own section
    }
};

// ===== INITIALIZATION =====
function initializePropertiesSystem() {
    console.log('🏠 Initializing My Properties System...');
    
    // Load user data and properties
    loadUserProperties();
    
    // Initialize components
    initializeTabs();
    updateAllStatistics();
    renderAllPropertiesGrids();
    initializeEventListeners();
    
    console.log('✅ My Properties system ready');
}

function loadUserProperties() {
    console.log('📦 Loading user properties...');
    
    // Try to load from localStorage first - USE THE CORRECT KEY
    const storedProperties = localStorage.getItem('domihive_user_properties');
    
    if (storedProperties && JSON.parse(storedProperties).length > 0) {
        userProperties = JSON.parse(storedProperties);
        console.log('✅ Loaded properties from storage:', userProperties.length);
        
        // DEBUG: Log all properties to see what we have
        console.log('🔍 All loaded properties:', userProperties);
        
        // Check if properties have propertyType field
        const propertiesWithType = userProperties.filter(p => p.propertyType);
        console.log('📊 Properties with propertyType:', propertiesWithType.length);
        
    } else {
        console.log('📝 No properties found, creating demo properties...');
        createDemoProperties();
    }
    
    // Sort by most recent
    userProperties.sort((a, b) => new Date(b.leaseStart) - new Date(a.leaseStart));
}

function createDemoProperties() {
    console.log('🏗️ Creating demo properties...');
    
    const demoProperties = [
        // RENT PROPERTIES - Make sure they have propertyType: 'rent'
        {
            id: 'prop_rent_1',
            title: 'Luxury 3-Bedroom Apartment in Ikoyi',
            location: 'Ikoyi, Lagos',
            price: 15000000,
            image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
            leaseStart: '2024-01-15',
            leaseEnd: '2025-01-14',
            status: 'active',
            rentDueDate: '2024-02-01',
            propertyType: 'rent', // THIS IS CRITICAL
            documents: {
                tenantAgreement: { signed: true, signedDate: '2024-01-10' },
                domihiveAgreement: { signed: true, signedDate: '2024-01-10' }
            },
            bedrooms: 3,
            bathrooms: 2
        },
        {
            id: 'prop_rent_2',
            title: 'Modern 2-Bedroom Condo in Victoria Island',
            location: 'Victoria Island, Lagos',
            price: 12000000,
            image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
            leaseStart: '2024-02-01',
            leaseEnd: '2025-01-31',
            status: 'active',
            rentDueDate: '2024-03-01',
            propertyType: 'rent', // THIS IS CRITICAL
            documents: {
                tenantAgreement: { signed: true, signedDate: '2024-01-25' },
                domihiveAgreement: { signed: true, signedDate: '2024-01-25' }
            },
            bedrooms: 2,
            bathrooms: 2
        },
        
        // SHORTLET PROPERTIES
        {
            id: 'prop_shortlet_1',
            title: 'Luxury Shortlet Apartment in VI',
            location: 'Victoria Island, Lagos',
            price: 85000,
            image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
            leaseStart: '2024-02-01',
            leaseEnd: '2024-02-07',
            status: 'active',
            rentDueDate: '2024-02-01',
            propertyType: 'shortlet', // THIS IS CRITICAL
            documents: {
                tenantAgreement: { signed: true, signedDate: '2024-01-28' },
                domihiveAgreement: { signed: true, signedDate: '2024-01-28' }
            },
            bedrooms: 2,
            bathrooms: 2
        },
        
        // COMMERCIAL PROPERTIES
        {
            id: 'prop_commercial_1',
            title: 'Office Space in Ikeja GRA',
            location: 'Ikeja GRA, Lagos',
            price: 8500000,
            image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
            leaseStart: '2024-01-20',
            leaseEnd: '2025-01-19',
            status: 'active',
            rentDueDate: '2024-02-20',
            propertyType: 'commercial', // THIS IS CRITICAL
            documents: {
                tenantAgreement: { signed: true, signedDate: '2024-01-15' },
                domihiveAgreement: { signed: true, signedDate: '2024-01-15' }
            },
            size: '1200 sqft'
        },
        
        // BUY PROPERTIES
        {
            id: 'prop_buy_1',
            title: '4-Bedroom Detached House in Ajah',
            location: 'Ajah, Lagos',
            price: 85000000,
            image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
            purchaseDate: '2024-01-10',
            status: 'active',
            propertyType: 'buy', // THIS IS CRITICAL
            documents: {
                deed: { signed: true, signedDate: '2024-01-05' },
                domihiveAgreement: { signed: true, signedDate: '2024-01-05' }
            },
            bedrooms: 4,
            bathrooms: 3
        }
    ];
    
    userProperties = demoProperties;
    saveUserProperties();
    console.log('✅ Created demo properties for all types');
    
    // DEBUG: Log what we created
    console.log('🔍 Demo properties created:', demoProperties);
}

function saveUserProperties() {
    localStorage.setItem('domihive_user_properties', JSON.stringify(userProperties));
}

// ===== TAB FUNCTIONALITY =====
function initializeTabs() {
    console.log('🎯 Initializing tab functionality...');
    
    // Add click event listeners to tabs
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
    
    // Update tab counts
    updateTabCounts();
    
    // Set initial active tab from URL hash or default to 'rent'
    const initialTab = window.location.hash.replace('#', '') || 'rent';
    if (PROPERTY_TYPES[initialTab]) {
        switchTab(initialTab);
    } else {
        switchTab('rent');
    }
    
    console.log('✅ Tabs initialized successfully');
}

function switchTab(tabName) {
    console.log('🔄 Switching to tab:', tabName);
    
    if (!PROPERTY_TYPES[tabName]) {
        console.error('❌ Invalid tab name:', tabName);
        return;
    }
    
    currentPropertyType = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Update sections
    document.querySelectorAll('.properties-section').forEach(section => {
        section.classList.remove('active');
    });
    const activeSection = document.getElementById(`${tabName}Section`);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    // Update URL hash for deep linking
    window.location.hash = tabName;
    
    console.log(`✅ Switched to ${PROPERTY_TYPES[tabName].name} tab`);
}

function updateTabCounts() {
    Object.keys(PROPERTY_TYPES).forEach(type => {
        const typeProperties = userProperties.filter(prop => prop.propertyType === type);
        const count = typeProperties.length;
        const countElement = document.getElementById(`${type}TabCount`);
        
        if (countElement) {
            countElement.textContent = count;
            console.log(`📊 ${type} tab count: ${count}`);
        }
    });
    console.log('📊 Tab counts updated');
}

// ===== STATISTICS MANAGEMENT =====
function updateAllStatistics() {
    console.log('📊 Updating all statistics...');
    
    // Calculate totals across all property types
    let totalActive = 0;
    let totalDocuments = 0;
    let totalPayments = 0;
    
    Object.keys(PROPERTY_TYPES).forEach(type => {
        const stats = calculatePropertyTypeStats(type);
        totalActive += stats.active;
        totalDocuments += stats.documents;
        totalPayments += stats.payments;
        
        // Update individual section stats
        document.getElementById(`${type}ActiveCount`).textContent = stats.active;
        document.getElementById(`${type}DocumentsCount`).textContent = stats.documents;
        document.getElementById(`${type}PaymentsCount`).textContent = stats.payments;
        
        console.log(`📈 ${type} stats:`, stats);
    });
    
    // Update total stats
    document.getElementById('totalActiveCount').textContent = totalActive;
    document.getElementById('totalDocumentsCount').textContent = totalDocuments;
    document.getElementById('totalPaymentsCount').textContent = totalPayments;
    
    // Update tab counts as well
    updateTabCounts();
    
    console.log('📈 All statistics updated successfully');
}

function calculatePropertyTypeStats(propertyType) {
    const typeProperties = userProperties.filter(prop => prop.propertyType === propertyType);
    console.log(`📊 Calculating stats for ${propertyType}:`, typeProperties.length, 'properties');
    
    const activeCount = typeProperties.filter(property => property.status === 'active').length;
    
    const documentsCount = typeProperties.filter(property => 
        property.documents && 
        ((property.documents.tenantAgreement && property.documents.tenantAgreement.signed) ||
         (property.documents.domihiveAgreement && property.documents.domihiveAgreement.signed) ||
         (property.documents.deed && property.documents.deed.signed))
    ).length;
    
    // Calculate upcoming payments (within 30 days)
    const today = new Date();
    const paymentsCount = typeProperties.filter(property => {
        if (property.status !== 'active') return false;
        if (!property.rentDueDate) return false;
        
        const dueDate = new Date(property.rentDueDate);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays >= 0;
    }).length;
    
    return { 
        active: activeCount, 
        documents: documentsCount, 
        payments: paymentsCount 
    };
}

// ===== PROPERTIES GRID RENDERING =====
function renderAllPropertiesGrids() {
    console.log('🎨 Rendering all property grids...');
    
    Object.keys(PROPERTY_TYPES).forEach(type => {
        renderPropertiesGridByType(type);
    });
}

function renderPropertiesGridByType(propertyType) {
    const container = document.getElementById(`${propertyType}PropertiesGrid`);
    if (!container) {
        console.error('❌ Properties grid container not found for:', propertyType);
        return;
    }
    
    const typeProperties = userProperties.filter(prop => prop.propertyType === propertyType);
    console.log(`🔍 Found ${typeProperties.length} ${propertyType} properties:`, typeProperties);
    
    if (typeProperties.length === 0) {
        container.innerHTML = createEmptyStateHTML(propertyType);
        console.log(`📭 No ${propertyType} properties to display`);
        return;
    }
    
    let propertiesHTML = '';
    
    typeProperties.forEach(property => {
        propertiesHTML += createPropertyCardHTML(property);
    });
    
    container.innerHTML = propertiesHTML;
    console.log(`✅ ${PROPERTY_TYPES[propertyType].name} grid rendered with ${typeProperties.length} properties`);
}

function createEmptyStateHTML(propertyType) {
    const typeConfig = PROPERTY_TYPES[propertyType];
    return `
        <div class="empty-properties">
            <div class="empty-icon">
                <i class="fas ${typeConfig.icon}"></i>
            </div>
            <h3>No ${typeConfig.name} Properties</h3>
            <p>You don't have any ${typeConfig.name.toLowerCase()} properties yet.</p>
            <button class="btn-primary" onclick="browseProperties('${propertyType}')">
                <i class="fas fa-search"></i>
                Browse ${typeConfig.name} Properties
            </button>
        </div>
    `;
}

function createPropertyCardHTML(property) {
    const typeConfig = PROPERTY_TYPES[property.propertyType];
    const statusClass = property.status === 'active' ? 'status-active' : 'status-ending';
    const statusText = property.status === 'active' ? 'Active' : 'Ending Soon';
    const badgeType = property.status === 'active' ? 'badge-active' : 'badge-ending';
    
    // Create property features based on type
    let featuresHTML = '';
    if (property.propertyType === 'commercial') {
        featuresHTML = `
            <span class="property-feature">
                <i class="fas fa-arrows-alt"></i>
                ${property.size || 'Commercial Space'}
            </span>
        `;
    } else {
        featuresHTML = `
            <span class="property-feature">
                <i class="fas fa-bed"></i>
                ${property.bedrooms || 'N/A'} Bed
            </span>
            <span class="property-feature">
                <i class="fas fa-bath"></i>
                ${property.bathrooms || 'N/A'} Bath
            </span>
        `;
    }
    
    // Create lease/purchase info based on type
    let infoHTML = '';
    if (property.propertyType === 'buy') {
        infoHTML = `
            <div class="lease-info">
                <span class="lease-dates">
                    Purchased on ${formatDate(property.purchaseDate || property.leaseStart)}
                </span>
                <span class="lease-status ${statusClass}">Owned</span>
            </div>
        `;
    } else {
        infoHTML = `
            <div class="lease-info">
                <span class="lease-dates">
                    ${formatDate(property.leaseStart)} - ${formatDate(property.leaseEnd)}
                </span>
                <span class="lease-status ${statusClass}">${statusText}</span>
            </div>
        `;
    }
    
    const priceSuffix = property.propertyType === 'shortlet' ? '/night' : 
                       property.propertyType === 'buy' ? '' : '/year';
    
    const propertyCardHTML = `
        <div class="property-card" data-property-id="${property.id}" data-property-type="${property.propertyType}">
            <div class="property-image">
                <img src="${property.image}" alt="${property.title}" onerror="this.src='/ASSECT/placeholder-property.jpg'">
                <div class="property-badges">
                    <span class="property-badge ${badgeType}">${statusText}</span>
                </div>
            </div>
            
            <div class="property-details">
                <div class="property-price">₦${property.price.toLocaleString()}${priceSuffix}</div>
                <h3 class="property-title">${property.title}</h3>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.location}
                </div>
                
                <div class="property-features">
                    ${featuresHTML}
                </div>
                
                ${infoHTML}
                
                <div class="property-actions">
                    <button class="btn-view-dashboard" onclick="redirectToPropertyDashboard('${property.id}')">
                        <i class="fas fa-chart-line"></i>
                        View Dashboard
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return propertyCardHTML;
}

// ===== DASHBOARD REDIRECTION =====
// ===== DASHBOARD REDIRECTION =====
function redirectToPropertyDashboard(propertyId) {
    const property = userProperties.find(p => p.id === propertyId);
    if (!property) {
        console.error('❌ Property not found:', propertyId);
        showNotification('Property not found', 'error');
        return;
    }
    
    const typeConfig = PROPERTY_TYPES[property.propertyType];
    
    // Store the selected property for the next page
    sessionStorage.setItem('currentPropertyId', propertyId);
    sessionStorage.setItem('currentPropertyType', property.propertyType);
    
    // ✅ USE TYPE-SPECIFIC SPA SECTIONS
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        console.log(`🔗 Loading ${typeConfig.name} content within SPA...`);
        window.spa.navigateToSection(typeConfig.spaSection);
    } else {
        console.log('🔗 Direct page load (SPA not available)');
        // Fallback to direct URLs if needed
        window.location.href = typeConfig.dashboardUrl || '/Pages/tenant-property.html';
    }
}
// Enhanced SPA-compatible navigation
function navigateToDashboardPage(url) {
    // FORCE direct navigation to actual HTML files
    console.log('🔗 Force redirecting to dashboard file:', url);
    
    // Use direct window.location navigation
    window.location.href = url;
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Hash change for tab deep linking
    window.addEventListener('hashchange', function() {
        const tabName = window.location.hash.replace('#', '');
        if (PROPERTY_TYPES[tabName]) {
            switchTab(tabName);
        }
    });
    
    console.log('🎯 Event listeners initialized');
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
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
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
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
        font-weight: 600;
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

// ===== GLOBAL FUNCTIONS FOR SPA COMPATIBILITY =====
window.initializePropertiesSystem = initializePropertiesSystem;
window.switchTab = switchTab;
window.redirectToPropertyDashboard = redirectToPropertyDashboard;

// Tab functionality exposed globally
window.initializeTabs = initializeTabs;

// Browse properties function for empty states
window.browseProperties = function(propertyType) {
    const typeConfig = PROPERTY_TYPES[propertyType];
    console.log('🔍 Browsing properties for:', typeConfig.name);
    
    // SPA navigation to browse page with filter
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        sessionStorage.setItem('browseFilter', propertyType);
        window.spa.navigateToSection('rent'); // Assuming rent page handles all browsing
    } else {
        // Direct page load
        window.location.href = '/Pages/rent.html';
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
    renderPropertiesGridByType(newProperty.propertyType);
    updateAllStatistics();
    
    console.log('✅ Added new property:', newProperty.id);
    return newProperty.id;
};

// Global function to check if user has properties
window.hasUserProperties = function() {
    return userProperties.length > 0;
};

// Global function to get user properties
window.getUserProperties = function() {
    return userProperties;
};

// QUICK FIX: If no properties are showing, run this in console to reset data
window.resetPropertiesData = function() {
    localStorage.removeItem('domihive_user_properties');
    console.log('🔄 Properties data reset. Refreshing...');
    location.reload();
};

// Auto-initialize when included in SPA
if (document.querySelector('.my-properties-content')) {
    setTimeout(initializePropertiesSystem, 100);
}

console.log('🎉 My Properties Content JavaScript Loaded Successfully!');

// Debug logging for containers and properties
console.log('Rent container:', document.getElementById('rentPropertiesGrid'));
console.log('Shortlet container:', document.getElementById('shortletPropertiesGrid'));
console.log('Commercial container:', document.getElementById('commercialPropertiesGrid'));
console.log('Buy container:', document.getElementById('buyPropertiesGrid'));