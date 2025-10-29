// payments-content.js - Payment Properties Management System

// payments-content.js - ADD THIS AT THE VERY TOP

// ✅ Prevent duplicate execution in SPA
if (window.paymentsContentLoaded) {
    console.log('⏭️ Payments content already loaded, skipping duplicate execution');
    // If using SPA initialization, call it anyway
    if (typeof window.spaPaymentsInit === 'function') {
        window.spaPaymentsInit();
    }
    // Stop execution
    throw new Error('Payments content already loaded');
}

// Mark as loaded
window.paymentsContentLoaded = true;

// ... rest of your existing code
// SPA Integration
window.spaPaymentsInit = function() {
    console.log('🎯 SPA: Initializing Payments Content');
    initializePaymentsSystem();
};

// Auto-initialize if loaded directly
if (window.location.pathname.includes('payments-content.html')) {
    document.addEventListener('DOMContentLoaded', initializePaymentsSystem);
} else {
    // SPA environment - check if we're on the page and initialize
    setTimeout(function() {
        if (document.querySelector('.payments-content')) {
            console.log('🔍 Detected SPA environment - auto-initializing payments');
            initializePaymentsSystem();
        }
    }, 500);
}

function initializePaymentsSystem() {
    console.log('💳 Initializing Payments System...');
    
    // Global variables
    let userProperties = [];
    let currentFilter = 'all';
    let paymentData = [];
    
    // Load user data and properties
    loadUserProperties();
    loadPaymentData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Render properties grid
    renderPropertiesGrid();
    
    // Update statistics
    updatePaymentStatistics();
    
    // Load recent activity
    loadRecentPaymentActivity();
    
    console.log('✅ Payments system ready');
}

function loadUserProperties() {
    console.log('📦 Loading user properties for payments...');
    
    // Try to load from localStorage first
    const storedProperties = localStorage.getItem('domihive_user_properties');
    
    if (storedProperties && JSON.parse(storedProperties).length > 0) {
        userProperties = JSON.parse(storedProperties);
        console.log('✅ Loaded properties from storage:', userProperties.length);
    } else {
        console.log('📝 No properties found, creating demo properties...');
        createDemoProperties();
    }
    
    // Add payment data to properties
    enhancePropertiesWithPaymentData();
}

function createDemoProperties() {
    console.log('🏗️ Creating demo properties for payments...');
    
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

function enhancePropertiesWithPaymentData() {
    console.log('💰 Enhancing properties with payment data...');
    
    // Sample payment data for each property
    const paymentData = {
        'prop_1': {
            monthlyRent: 1250000,
            nextPaymentDate: '2024-02-01',
            paymentStatus: 'upcoming',
            overdueAmount: 0,
            paymentHistory: [
                { date: '2024-01-01', amount: 1250000, status: 'completed' }
            ]
        },
        'prop_2': {
            monthlyRent: 1000000,
            nextPaymentDate: '2024-02-01',
            paymentStatus: 'pending',
            overdueAmount: 0,
            paymentHistory: [
                { date: '2024-01-01', amount: 1000000, status: 'completed' }
            ]
        },
        'prop_3': {
            monthlyRent: 2083333,
            nextPaymentDate: '2024-01-25',
            paymentStatus: 'overdue',
            overdueAmount: 2083333,
            paymentHistory: []
        },
        'prop_4': {
            monthlyRent: 750000,
            nextPaymentDate: '2024-02-10',
            paymentStatus: 'upcoming',
            overdueAmount: 0,
            paymentHistory: [
                { date: '2024-01-10', amount: 750000, status: 'completed' }
            ]
        }
    };
    
    // Add payment data to each property
    userProperties.forEach(property => {
        property.payment = paymentData[property.id] || {
            monthlyRent: Math.round(property.price / 12),
            nextPaymentDate: null,
            paymentStatus: 'upcoming',
            overdueAmount: 0,
            escrowBalance: 0,
            paymentHistory: []
        };
    });
    
    console.log('✅ Enhanced properties with payment data');
}

function saveUserProperties() {
    localStorage.setItem('domihive_user_properties', JSON.stringify(userProperties));
}

function loadPaymentData() {
    console.log('📋 Loading payment data...');
    
    const storedPayments = localStorage.getItem('domihive_payment_data');
    
    if (storedPayments && JSON.parse(storedPayments).length > 0) {
        paymentData = JSON.parse(storedPayments);
        console.log('✅ Loaded payment data:', paymentData.length);
    } else {
        console.log('📝 No payment data found, creating demo data...');
        createDemoPaymentData();
    }
}

function createDemoPaymentData() {
    const demoPayments = [
        {
            id: 'pay_1',
            propertyId: 'prop_1',
            type: 'rent',
            amount: 1250000,
            status: 'completed',
            date: '2024-01-01',
            method: 'bank_transfer',
            reference: 'PAY-001-2024'
        },
        {
            id: 'pay_2',
            propertyId: 'prop_2',
            type: 'rent',
            amount: 1000000,
            status: 'completed',
            date: '2024-01-01',
            method: 'card',
            reference: 'PAY-002-2024'
        },
        {
            id: 'pay_3',
            propertyId: 'prop_3',
            type: 'rent',
            amount: 2083333,
            status: 'failed',
            date: '2024-01-25',
            method: 'card',
            reference: 'PAY-003-2024'
        },
        {
            id: 'pay_4',
            propertyId: 'prop_4',
            type: 'rent',
            amount: 750000,
            status: 'completed',
            date: '2024-01-10',
            method: 'flutterwave',
            reference: 'PAY-004-2024'
        }
    ];
    
    paymentData = demoPayments;
    savePaymentData();
    console.log('✅ Created demo payment data');
}

function savePaymentData() {
    localStorage.setItem('domihive_payment_data', JSON.stringify(paymentData));
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
        case 'payment-due':
            filteredProperties = userProperties.filter(p => 
                p.payment.paymentStatus === 'overdue' || p.payment.paymentStatus === 'pending'
            );
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
        const payment = property.payment;
        const badgeType = getPaymentBadgeType(property);
        const badgeText = getPaymentBadgeText(property);
        const monthlyRent = payment.monthlyRent;
        const nextPaymentDate = payment.nextPaymentDate;
        
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
                    
                    <!-- Payment Statistics -->
                    <div class="payment-stats">
                        <div class="payment-stat stat-rent">
                            <div class="stat-amount">₦${monthlyRent.toLocaleString()}</div>
                            <div class="stat-label-small">Monthly Rent</div>
                        </div>
                        <div class="payment-stat stat-due">
                            <div class="stat-amount">${payment.overdueAmount > 0 ? '₦' + payment.overdueAmount.toLocaleString() : 'None'}</div>
                            <div class="stat-label-small">Overdue</div>
                        </div>
                    </div>
                    
                    <!-- Next Payment -->
                    ${nextPaymentDate ? `
                        <div class="next-payment">
                            <div class="payment-title">Next Payment Due</div>
                            <div class="payment-date">${formatDate(nextPaymentDate)}</div>
                        </div>
                    ` : ''}

                    <div class="property-actions">
                        <button class="btn-make-payment ${payment.paymentStatus === 'overdue' ? 'urgent' : ''}" 
                                onclick="openPaymentDashboard('${property.id}')">
                            <i class="fas fa-credit-card"></i>
                            ${payment.paymentStatus === 'overdue' ? 'Pay Now' : 'Make Payment'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = propertiesHTML;
    console.log('✅ Rendered', filteredProperties.length, 'property cards with filter:', currentFilter);
}

function getPaymentBadgeType(property) {
    const paymentStatus = property.payment.paymentStatus;
    
    switch(paymentStatus) {
        case 'overdue':
            return 'badge-overdue';
        case 'pending':
            return 'badge-payment-due';
        default:
            return 'badge-active';
    }
}

function getPaymentBadgeText(property) {
    const paymentStatus = property.payment.paymentStatus;
    
    switch(paymentStatus) {
        case 'overdue':
            return 'Overdue';
        case 'pending':
            return 'Payment Due';
        default:
            return 'Active';
    }
}

function updatePaymentStatistics() {
    console.log('📊 Updating payment statistics...');
    
    let upcomingCount = 0;
    let pendingCount = 0;
    let completedCount = 0;
    let overdueCount = 0;
    
    userProperties.forEach(property => {
        const payment = property.payment;
        
        switch(payment.paymentStatus) {
            case 'upcoming':
                upcomingCount++;
                break;
            case 'pending':
                pendingCount++;
                break;
            case 'overdue':
                overdueCount++;
                break;
        }
        
        // Count completed payments from payment history
        completedCount += payment.paymentHistory.filter(p => p.status === 'completed').length;
    });
    
    // Update DOM elements
    const upcomingEl = document.getElementById('upcomingPayments');
    const pendingEl = document.getElementById('pendingPayments');
    const completedEl = document.getElementById('completedPayments');
    const overdueEl = document.getElementById('overduePayments');
    
    if (upcomingEl) upcomingEl.textContent = upcomingCount;
    if (pendingEl) pendingEl.textContent = pendingCount;
    if (completedEl) completedEl.textContent = completedCount;
    if (overdueEl) overdueEl.textContent = overdueCount;
    
    console.log('✅ Payment statistics updated - Upcoming:', upcomingCount, 'Pending:', pendingCount, 'Completed:', completedCount, 'Overdue:', overdueCount);
}

function loadRecentPaymentActivity() {
    console.log('📋 Loading recent payment activity...');
    
    const activityContainer = document.getElementById('recentActivity');
    
    if (!activityContainer) {
        console.error('❌ Activity container not found!');
        return;
    }
    
    // Get recent payments (last 5)
    const recentPayments = paymentData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    if (recentPayments.length === 0) {
        activityContainer.innerHTML = `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-credit-card"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">No recent activity</div>
                    <div class="activity-description">Payment transactions will appear here</div>
                </div>
                <div class="activity-time">Just now</div>
            </div>
        `;
        return;
    }
    
    const activityHTML = recentPayments.map(payment => {
        const property = userProperties.find(p => p.id === payment.propertyId);
        const propertyTitle = property ? property.title : 'Unknown Property';
        const amount = payment.amount;
        const status = payment.status;
        const date = payment.date;
        
        return `
            <div class="activity-item">
                <div class="activity-icon" style="background: ${getStatusColor(status)};">
                    <i class="fas ${getPaymentIcon(status)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${formatPaymentTitle(status)} - ${propertyTitle}</div>
                    <div class="activity-description">₦${amount.toLocaleString()} • ${formatPaymentMethod(payment.method)}</div>
                </div>
                <div class="activity-time">${formatTimeAgo(date)}</div>
            </div>
        `;
    }).join('');
    
    activityContainer.innerHTML = activityHTML;
    console.log('✅ Loaded recent payment activity');
}

function getStatusColor(status) {
    const colors = {
        'completed': '#10b981',
        'pending': '#f59e0b',
        'failed': '#dc2626',
        'processing': '#3b82f6'
    };
    return colors[status] || '#64748b';
}

function getPaymentIcon(status) {
    const icons = {
        'completed': 'fa-check-circle',
        'pending': 'fa-clock',
        'failed': 'fa-times-circle',
        'processing': 'fa-sync-alt'
    };
    return icons[status] || 'fa-credit-card';
}

function formatPaymentTitle(status) {
    const titles = {
        'completed': 'Payment Completed',
        'pending': 'Payment Pending',
        'failed': 'Payment Failed',
        'processing': 'Payment Processing'
    };
    return titles[status] || 'Payment';
}

function formatPaymentMethod(method) {
    const methods = {
        'card': 'Credit Card',
        'bank_transfer': 'Bank Transfer',
        'flutterwave': 'Flutterwave',
        'paystack': 'Paystack'
    };
    return methods[method] || method;
}

// Global function to open payment dashboard
window.openPaymentDashboard = function(propertyId) {
    console.log('💳 Opening payment dashboard for:', propertyId);
    
    // Store the selected property for the next page
    sessionStorage.setItem('currentPaymentPropertyId', propertyId);
    
    // Redirect to the payment dashboard page
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('tenant-payments');
    } else {
        window.location.href = '/Pages/tenant-payments.html';
    }
};

// Quick Actions Functions
window.viewPaymentHistory = function() {
    console.log('📊 Viewing payment history...');
    showNotification('Opening payment history...', 'info');
    
    // In a real app, this would navigate to a payment history page
    // For now, we'll show a notification
    setTimeout(() => {
        showNotification('Payment history feature coming soon!', 'info');
    }, 1000);
};

window.viewUpcomingPayments = function() {
    console.log('📅 Viewing upcoming payments...');
    showNotification('Opening upcoming payments...', 'info');
    
    // Filter to show only properties with upcoming payments
    setActiveFilter('payment-due', document.querySelector('.filter-btn[data-filter="payment-due"]'));
};

window.managePaymentMethods = function() {
    console.log('💳 Managing payment methods...');
    showNotification('Opening payment methods...', 'info');
    
    // In a real app, this would open a payment methods management page
    setTimeout(() => {
        showNotification('Payment methods management coming soon!', 'info');
    }, 1000);
};

window.viewEscrowAccount = function() {
    console.log('🏦 Viewing escrow account...');
    showNotification('Opening escrow account...', 'info');
    
    // Calculate total escrow balance
    const totalEscrow = userProperties.reduce((total, property) => {
        return total + (property.payment.escrowBalance || 0);
    }, 0);
    
    showNotification(`Total escrow balance: ₦${totalEscrow.toLocaleString()}`, 'success');
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

// Utility Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
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

console.log('🎉 Payments Content JavaScript Loaded!');