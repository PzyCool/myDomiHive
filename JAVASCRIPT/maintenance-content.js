// maintenance-content.js - Maintenance Properties Management System

// SPA Integration
window.spaMaintenanceInit = function() {
    console.log('🎯 SPA: Initializing Maintenance Content');
    initializeMaintenanceSystem();
};

// Auto-initialize if loaded directly
if (window.location.pathname.includes('maintenance-content.html')) {
    document.addEventListener('DOMContentLoaded', initializeMaintenanceSystem);
} else {
    // SPA environment - check if we're on the page and initialize
    setTimeout(function() {
        if (document.querySelector('.maintenance-content')) {
            console.log('🔍 Detected SPA environment - auto-initializing maintenance');
            initializeMaintenanceSystem();
        }
    }, 500);
}

function initializeMaintenanceSystem() {
    console.log('🛠️ Initializing Maintenance System...');
    
    // Global variables
    let userProperties = [];
    let currentFilter = 'all';
    
    // Load user data and properties
    loadUserProperties();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Render properties grid
    renderPropertiesGrid();
    
    // Update statistics
    updateStatistics();
    
    // Load recent activity
    loadRecentActivity();
    
    console.log('✅ Maintenance system ready');
}

function loadUserProperties() {
    console.log('📦 Loading user properties for maintenance...');
    
    // Try to load from localStorage first
    const storedProperties = localStorage.getItem('domihive_user_properties');
    
    if (storedProperties && JSON.parse(storedProperties).length > 0) {
        userProperties = JSON.parse(storedProperties);
        console.log('✅ Loaded properties from storage:', userProperties.length);
    } else {
        console.log('📝 No properties found, creating demo properties...');
        createDemoProperties();
    }
    
    // Add maintenance data to properties
    enhancePropertiesWithMaintenanceData();
}

function createDemoProperties() {
    console.log('🏗️ Creating demo properties for maintenance...');
    
    const demoProperties = [
        {
            id: 'prop_1',
            title: 'Luxury 3-Bedroom Apartment',
            location: 'Ikoyi, Lagos',
            price: 15000000,
            image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
            leaseStart: '2024-01-15',
            leaseEnd: '2025-01-14',
            status: 'active'
        },
        {
            id: 'prop_2',
            title: 'Modern 2-Bedroom Condo',
            location: 'Victoria Island, Lagos',
            price: 12000000,
            image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
            leaseStart: '2024-02-01',
            leaseEnd: '2025-01-31',
            status: 'active'
        },
        {
            id: 'prop_3',
            title: 'Executive Penthouse Suite',
            location: 'Lekki Phase 1, Lagos',
            price: 25000000,
            image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
            leaseStart: '2024-03-01',
            leaseEnd: '2025-02-28',
            status: 'active'
        },
        {
            id: 'prop_4',
            title: 'Garden Duplex Apartment',
            location: 'GRA, Ikeja, Lagos',
            price: 9000000,
            image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
            leaseStart: '2024-01-10',
            leaseEnd: '2024-12-09',
            status: 'active'
        }
    ];
    
    userProperties = demoProperties;
    saveUserProperties();
    console.log('✅ Created', demoProperties.length, 'demo properties');
}

function enhancePropertiesWithMaintenanceData() {
    console.log('🔧 Enhancing properties with maintenance data...');
    
    // Sample maintenance data for each property
    const maintenanceData = {
        'prop_1': {
            pending: 2,
            inProgress: 1,
            completed: 3,
            latestIssue: 'Leaking Kitchen Faucet',
            latestIssueDate: '2024-01-18',
            needsMaintenance: true,
            maintenanceLevel: 'high' // high, medium, low
        },
        'prop_2': {
            pending: 0,
            inProgress: 0,
            completed: 1,
            latestIssue: 'AC Maintenance Completed',
            latestIssueDate: '2024-01-15',
            needsMaintenance: false,
            maintenanceLevel: 'low'
        },
        'prop_3': {
            pending: 1,
            inProgress: 0,
            completed: 0,
            latestIssue: 'Balcony Door Sticking',
            latestIssueDate: '2024-01-20',
            needsMaintenance: true,
            maintenanceLevel: 'medium'
        },
        'prop_4': {
            pending: 0,
            inProgress: 1,
            completed: 2,
            latestIssue: 'Painting in Progress',
            latestIssueDate: '2024-01-19',
            needsMaintenance: true,
            maintenanceLevel: 'medium'
        }
    };
    
    // Add maintenance data to each property
    userProperties.forEach(property => {
        property.maintenance = maintenanceData[property.id] || {
            pending: 0,
            inProgress: 0,
            completed: 0,
            latestIssue: 'No recent issues',
            latestIssueDate: null,
            needsMaintenance: false,
            maintenanceLevel: 'low'
        };
    });
    
    console.log('✅ Enhanced properties with maintenance data');
}

function saveUserProperties() {
    localStorage.setItem('domihive_user_properties', JSON.stringify(userProperties));
}

function initializeEventListeners() {
    console.log('🎯 Initializing event listeners...');
    
    // Filter tabs
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setActiveFilter(filter, this);
        });
    });
    
    console.log('✅ Event listeners initialized');
}

function setActiveFilter(filter, clickedButton) {
    console.log('🔍 Setting active filter:', filter);
    
    currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    clickedButton.classList.add('active');
    
    // Re-render properties grid with filter
    renderPropertiesGrid();
}

function renderPropertiesGrid() {
    console.log('🎨 Rendering properties grid with filter:', currentFilter);
    
    const container = document.getElementById('propertiesGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!container) {
        console.error('❌ Properties grid container not found!');
        return;
    }
    
    // Filter properties based on current filter
    let filteredProperties = userProperties;
    
    switch(currentFilter) {
        case 'active':
            filteredProperties = userProperties.filter(p => p.status === 'active');
            break;
        case 'maintenance':
            filteredProperties = userProperties.filter(p => p.maintenance.needsMaintenance);
            break;
        case 'all':
        default:
            filteredProperties = userProperties;
    }
    
    if (filteredProperties.length === 0) {
        // Show empty state
        container.innerHTML = '';
        if (emptyState) emptyState.classList.add('visible');
        console.log('📭 No properties to display for filter:', currentFilter);
        return;
    }
    
    // Hide empty state
    if (emptyState) emptyState.classList.remove('visible');
    
    // Create property cards
    const propertiesHTML = filteredProperties.map(property => {
        const maintenance = property.maintenance;
        const badgeType = getMaintenanceBadgeType(property);
        const badgeText = getMaintenanceBadgeText(property);
        
        return `
            <div class="property-card" data-property-id="${property.id}">
                <div class="property-image">
                    <img src="${property.image}" alt="${property.title}" onerror="this.src='/ASSECT/placeholder-property.jpg'">
                    <div class="property-badges">
                        <span class="property-badge ${badgeType}">${badgeText}</span>
                    </div>
                </div>
                
                <div class="property-details">
                    <h3 class="property-title">${property.title}</h3>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${property.location}
                    </div>
                    
                    <!-- Maintenance Statistics -->
                    <div class="maintenance-stats">
                        <div class="maintenance-stat stat-pending">
                            <div class="stat-count">${maintenance.pending}</div>
                            <div class="stat-label-small">Pending</div>
                        </div>
                        <div class="maintenance-stat stat-progress">
                            <div class="stat-count">${maintenance.inProgress}</div>
                            <div class="stat-label-small">In Progress</div>
                        </div>
                        <div class="maintenance-stat stat-completed">
                            <div class="stat-count">${maintenance.completed}</div>
                            <div class="stat-label-small">Completed</div>
                        </div>
                    </div>
                    
                    <!-- Latest Issue -->
                    ${maintenance.latestIssue && maintenance.latestIssue !== 'No recent issues' ? `
                        <div class="latest-issue">
                            <div class="issue-title">${maintenance.latestIssue}</div>
                            <div class="issue-date">${maintenance.latestIssueDate ? formatDate(maintenance.latestIssueDate) : 'Recent'}</div>
                        </div>
                    ` : ''}
                    
                    <div class="property-actions">
                        <button class="btn-request-maintenance" onclick="openMaintenanceDashboard('${property.id}')">
                            <i class="fas fa-tools"></i>
                            Request Maintenance
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = propertiesHTML;
    console.log('✅ Rendered', filteredProperties.length, 'property cards with filter:', currentFilter);
}

function getMaintenanceBadgeType(property) {
    const maintenance = property.maintenance;
    
    if (maintenance.pending > 0 || maintenance.inProgress > 0) {
        if (maintenance.maintenanceLevel === 'high') {
            return 'badge-urgent';
        }
        return 'badge-maintenance';
    }
    
    return 'badge-active';
}

function getMaintenanceBadgeText(property) {
    const maintenance = property.maintenance;
    
    if (maintenance.maintenanceLevel === 'high') {
        return 'Urgent';
    } else if (maintenance.pending > 0 || maintenance.inProgress > 0) {
        return 'Needs Maintenance';
    }
    
    return 'Active';
}

function updateStatistics() {
    console.log('📊 Updating maintenance statistics...');
    
    let totalPending = 0;
    let totalInProgress = 0;
    let totalCompleted = 0;
    let totalUrgent = 0;
    
    userProperties.forEach(property => {
        const maintenance = property.maintenance;
        totalPending += maintenance.pending;
        totalInProgress += maintenance.inProgress;
        totalCompleted += maintenance.completed;
        
        if (maintenance.maintenanceLevel === 'high') {
            totalUrgent += (maintenance.pending + maintenance.inProgress);
        }
    });
    
    // Update DOM elements
    const pendingEl = document.getElementById('pendingRequests');
    const progressEl = document.getElementById('inProgressRequests');
    const completedEl = document.getElementById('completedRequests');
    const urgentEl = document.getElementById('urgentRequests');
    
    if (pendingEl) pendingEl.textContent = totalPending;
    if (progressEl) progressEl.textContent = totalInProgress;
    if (completedEl) completedEl.textContent = totalCompleted;
    if (urgentEl) urgentEl.textContent = totalUrgent;
    
    console.log('✅ Statistics updated - Pending:', totalPending, 'Progress:', totalInProgress, 'Completed:', totalCompleted, 'Urgent:', totalUrgent);
}

function loadRecentActivity() {
    console.log('📋 Loading recent maintenance activity...');
    
    const activityContainer = document.getElementById('recentActivity');
    
    if (!activityContainer) {
        console.error('❌ Activity container not found!');
        return;
    }
    
    // Sample recent activity data
    const recentActivities = [
        {
            icon: 'fas fa-tools',
            title: 'New Maintenance Request',
            description: 'Leaking faucet reported for Luxury 3-Bedroom Apartment',
            time: '2 hours ago'
        },
        {
            icon: 'fas fa-check-circle',
            title: 'Maintenance Completed',
            description: 'AC repair completed for Modern 2-Bedroom Condo',
            time: '1 day ago'
        },
        {
            icon: 'fas fa-hammer',
            title: 'Maintenance In Progress',
            description: 'Painting work started at Garden Duplex Apartment',
            time: '2 days ago'
        },
        {
            icon: 'fas fa-exclamation-triangle',
            title: 'Urgent Maintenance',
            description: 'Electrical issue reported for Executive Penthouse',
            time: '3 days ago'
        }
    ];
    
    const activityHTML = recentActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
            </div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `).join('');
    
    activityContainer.innerHTML = activityHTML;
    console.log('✅ Loaded recent maintenance activity');
}

// Global function to open maintenance dashboard
window.openMaintenanceDashboard = function(propertyId) {
    console.log('🛠️ Opening maintenance dashboard for:', propertyId);
    
    // Store the selected property for the next page
    sessionStorage.setItem('currentMaintenancePropertyId', propertyId);
    
    // Redirect to the maintenance dashboard page
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('tenant-maintenance');
    } else {
        window.location.href = '/Pages/tenant-maintenance.html';
    }
};

// Global function to navigate to My Properties
window.goToMyProperties = function() {
    console.log('🔙 Navigating to My Properties...');
    
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('my-properties');
    } else {
        window.location.href = '/Pages/my-properties-content.html';
    }
};

function formatDate(dateString) {
    if (!dateString) return 'Recent';
    
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
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

// Add CSS animations for notifications if not already present
if (!document.querySelector('#notification-animations')) {
    const style = document.createElement('style');
    style.id = 'notification-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    document.head.appendChild(style);
}

console.log('🎉 Maintenance Content JavaScript Loaded!');