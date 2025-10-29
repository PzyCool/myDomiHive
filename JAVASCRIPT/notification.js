// notification.js - Clean Notification System

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔔 Initializing DomiHive Notification System...');
    
    // Global variables
    let notifications = [];
    let currentFilter = 'all';
    let currentSort = 'newest';
    let currentSearch = '';

    // Initialize the notification system
    initNotificationSystem();

    function initNotificationSystem() {
        console.log('🚀 Starting Notification System...');
        
        // Load notifications from storage
        loadNotifications();
        
        // Initialize event listeners
        initEventListeners();
        
        // Render notifications
        renderNotifications();
        
        // Update statistics
        updateStatistics();
        
        console.log('✅ Notification system ready');
    }

    function loadNotifications() {
        // Load from localStorage
        const storedNotifications = localStorage.getItem('domihive_notifications');
        
        if (storedNotifications) {
            notifications = JSON.parse(storedNotifications);
            console.log('📧 Loaded notifications from storage:', notifications.length);
        } else {
            // Create sample notifications if none exist
            createSampleNotifications();
        }
        
        // Sort by newest first
        notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    function createSampleNotifications() {
        const sampleNotifications = [
            {
                id: 'notif_1',
                type: 'welcome',
                title: 'Welcome to DomiHive! 🎉',
                message: 'Thank you for joining DomiHive. Start your rental journey by browsing available properties.',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                read: true,
                category: 'system'
            },
            {
                id: 'notif_2',
                type: 'application_submitted',
                title: 'Application Submitted Successfully 📄',
                message: 'Your rental application has been received and is now being processed by our team.',
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                read: true,
                category: 'application',
                applicationId: 'APP-2024-00123'
            },
            {
                id: 'notif_3',
                type: 'payment_confirmation',
                title: 'Payment Received Successfully 💳',
                message: 'Your payment of ₦22,500 has been processed and secured in escrow.',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                read: false,
                category: 'payment',
                paymentId: 'PAY-2024-00123',
                actions: [
                    {
                        action: 'view_payment',
                        text: 'View Receipt',
                        id: 'PAY-2024-00123'
                    }
                ]
            },
            {
                id: 'notif_4',
                type: 'application_approved',
                title: 'Application Approved! 🎊',
                message: 'Congratulations! Your rental application has been approved. Activate tenant mode to proceed.',
                timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                read: false,
                category: 'approval',
                propertyId: 'prop_1',
                actions: [
                    {
                        action: 'activate_tenant_mode',
                        text: 'Activate Tenant Mode',
                        id: 'prop_1'
                    }
                ]
            }
        ];
        
        notifications = sampleNotifications;
        saveNotifications();
        console.log('📧 Created sample notifications');
    }

    function initEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', handleFilterChange);
        });
        
        // Sort dropdown
        document.getElementById('sortNotifications').addEventListener('change', handleSortChange);
        
        // Search input
        document.getElementById('notificationSearch').addEventListener('input', handleSearch);
        
        // Action buttons
        document.getElementById('markAllRead').addEventListener('click', markAllAsRead);
        document.getElementById('refreshNotifications').addEventListener('click', refreshNotifications);
        document.getElementById('clearAllNotifications').addEventListener('click', clearAllNotifications);
        document.getElementById('exportNotifications').addEventListener('click', exportNotifications);
        
        // Close modals when clicking outside
        setupModalCloseHandlers();
        
        console.log('🎯 Event listeners initialized');
    }

    function handleFilterChange(event) {
        const filter = event.currentTarget.getAttribute('data-filter');
        
        // Update active filter
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.currentTarget.classList.add('active');
        
        currentFilter = filter;
        
        // Update UI title
        updateFilterTitle(event.currentTarget);
        
        // Re-render notifications
        renderNotifications();
        
        console.log('🔍 Filter changed to:', filter);
    }

    function updateFilterTitle(buttonElement) {
        const filterText = buttonElement.querySelector('span').textContent.trim();
        document.getElementById('currentFilterTitle').textContent = filterText;
    }

    function handleSortChange(event) {
        currentSort = event.target.value;
        renderNotifications();
        console.log('🔄 Sort changed to:', currentSort);
    }

    function handleSearch(event) {
        currentSearch = event.target.value.toLowerCase();
        renderNotifications();
        
        if (currentSearch) {
            console.log('🔎 Searching for:', currentSearch);
        }
    }

    function getFilteredNotifications() {
        let filtered = [...notifications];
        
        // Apply search filter
        if (currentSearch) {
            filtered = filtered.filter(notification => 
                notification.title.toLowerCase().includes(currentSearch) ||
                notification.message.toLowerCase().includes(currentSearch) ||
                (notification.category && notification.category.toLowerCase().includes(currentSearch))
            );
        }
        
        // Apply category filter
        if (currentFilter !== 'all') {
            if (currentFilter === 'unread') {
                filtered = filtered.filter(notification => !notification.read);
            } else {
                filtered = filtered.filter(notification => notification.category === currentFilter);
            }
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            const dateA = new Date(a.timestamp);
            const dateB = new Date(b.timestamp);
            
            switch (currentSort) {
                case 'newest':
                    return dateB - dateA;
                case 'oldest':
                    return dateA - dateB;
                case 'unread':
                    if (a.read === b.read) return dateB - dateA;
                    return a.read ? 1 : -1;
                default:
                    return dateB - dateA;
            }
        });
        
        return filtered;
    }

    function renderNotifications() {
        const notificationsList = document.getElementById('notificationsList');
        const filteredNotifications = getFilteredNotifications();
        
        // Show/hide empty state
        const emptyState = document.getElementById('emptyState');
        if (filteredNotifications.length === 0) {
            emptyState.style.display = 'block';
            notificationsList.innerHTML = '';
            notificationsList.appendChild(emptyState);
        } else {
            emptyState.style.display = 'none';
            
            // Clear existing notifications
            notificationsList.innerHTML = '';
            
            // Add notifications to the list
            filteredNotifications.forEach(notification => {
                const notificationElement = createNotificationElement(notification);
                notificationsList.appendChild(notificationElement);
            });
        }
        
        // Update results count
        updateResultsCount(filteredNotifications.length);
        
        console.log('📋 Rendered', filteredNotifications.length, 'notifications');
    }

    function createNotificationElement(notification) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `notification-item ${notification.read ? '' : 'unread'}`;
        notificationDiv.setAttribute('data-id', notification.id);
        
        const timeAgo = getTimeAgo(notification.timestamp);
        const iconClass = getNotificationIconClass(notification.type);
        
        notificationDiv.innerHTML = `
            <div class="notification-icon ${iconClass}">
                <i class="${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-header">
                    <h4 class="notification-title">${notification.title}</h4>
                    <span class="notification-time">${timeAgo}</span>
                </div>
                <p class="notification-message">${notification.message}</p>
                ${notification.actions ? renderNotificationActions(notification.actions) : ''}
                <div class="notification-meta">
                    <span class="notification-type">${notification.category}</span>
                    ${!notification.read ? '<div class="unread-badge"></div>' : ''}
                </div>
            </div>
        `;
        
        // Add click event to mark as read and show details
        notificationDiv.addEventListener('click', () => {
            markAsRead(notification.id);
            openNotificationDetail(notification);
        });
        
        return notificationDiv;
    }

    function renderNotificationActions(actions) {
        if (!actions || actions.length === 0) return '';
        
        return `
            <div class="notification-actions">
                ${actions.map(action => `
                    <button class="btn-notification ${action.primary ? 'primary' : ''}" 
                            onclick="event.stopPropagation(); handleNotificationAction('${action.action}', '${action.id || ''}')">
                        <i class="${getActionIcon(action.action)}"></i>
                        ${action.text}
                    </button>
                `).join('')}
            </div>
        `;
    }

    function getNotificationIcon(type) {
        const icons = {
            'welcome': 'fas fa-home',
            'application_submitted': 'fas fa-file-alt',
            'application_approved': 'fas fa-check-circle',
            'payment_confirmation': 'fas fa-credit-card',
            'tenant_approval': 'fas fa-key'
        };
        
        return icons[type] || 'fas fa-bell';
    }

    function getNotificationIconClass(type) {
        const classes = {
            'welcome': 'system',
            'application_submitted': 'application',
            'application_approved': 'approval',
            'payment_confirmation': 'payment',
            'tenant_approval': 'approval'
        };
        
        return classes[type] || 'system';
    }

    function getActionIcon(action) {
        const icons = {
            'activate_tenant_mode': 'fas fa-rocket',
            'view_payment': 'fas fa-receipt',
            'view_application': 'fas fa-file-alt',
            'contact_support': 'fas fa-headset'
        };
        
        return icons[action] || 'fas fa-arrow-right';
    }

    function getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return time.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    }

    function openNotificationDetail(notification) {
        // Update notification in modal
        document.getElementById('modalNotificationTitle').textContent = notification.title;
        
        const detailContent = document.getElementById('notificationDetailContent');
        const timeAgo = getTimeAgo(notification.timestamp);
        
        detailContent.innerHTML = `
            <div class="detail-header">
                <div class="detail-icon ${getNotificationIconClass(notification.type)}">
                    <i class="${getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="detail-title">
                    <h4>${notification.title}</h4>
                    <div class="detail-meta">
                        <span>${timeAgo}</span>
                        <span class="notification-type">${notification.category}</span>
                    </div>
                </div>
            </div>
            <div class="detail-content">
                <p>${notification.message}</p>
                ${getAdditionalDetails(notification)}
            </div>
            <div class="detail-actions">
                <button class="btn-secondary" onclick="closeNotificationModal()">
                    <i class="fas fa-times"></i>
                    Close
                </button>
                ${notification.actions ? renderNotificationActions(notification.actions) : ''}
            </div>
        `;
        
        // Show modal
        document.getElementById('notificationDetailModal').classList.add('active');
        
        console.log('📖 Opened notification detail:', notification.id);
    }

    function getAdditionalDetails(notification) {
        if (notification.paymentId) {
            return `
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--gray-light);">
                    <strong>Payment Details:</strong><br>
                    Transaction ID: ${notification.paymentId}<br>
                    Status: Completed
                </div>
            `;
        }
        
        if (notification.applicationId) {
            return `
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--gray-light);">
                    <strong>Application Details:</strong><br>
                    Application ID: ${notification.applicationId}<br>
                    Status: Under Review
                </div>
            `;
        }
        
        return '';
    }

    // Global function for notification actions
    window.handleNotificationAction = function(action, actionId) {
        console.log('🔄 Handling action:', action, 'ID:', actionId);
        
        switch (action) {
            case 'activate_tenant_mode':
                activateTenantMode(actionId);
                break;
            case 'view_payment':
                viewPaymentDetails(actionId);
                break;
            case 'view_application':
                viewApplicationDetails(actionId);
                break;
            default:
                console.log('Unknown action:', action);
                showNotification('Action not implemented yet', 'info');
        }
    };

    function activateTenantMode(propertyId) {
        console.log('🔑 Activating tenant mode for property:', propertyId);
        
        // Get property data from applications
        const applications = JSON.parse(localStorage.getItem('domihive_applications')) || [];
        const application = applications.find(app => app.propertyId === propertyId);
        
        // Show activation modal
        showActivationModal(application);
        
        // Mark related notification as read
        const relatedNotification = notifications.find(n => 
            n.type === 'application_approved' && n.propertyId === propertyId
        );
        if (relatedNotification) {
            markAsRead(relatedNotification.id);
        }
    }

    function showActivationModal(applicationData = null) {
        const propertySummary = document.getElementById('activatedPropertySummary');
        
        if (applicationData && applicationData.propertyTitle) {
            propertySummary.innerHTML = `
                <h5>${applicationData.propertyTitle}</h5>
                <p>${applicationData.propertyLocation || 'Your new home'}</p>
                <p style="color: var(--accent-color); font-weight: 600; margin-top: 0.5rem;">
                    ₦${applicationData.propertyPrice ? applicationData.propertyPrice.toLocaleString() : '0'}/year
                </p>
            `;
        } else {
            propertySummary.innerHTML = `
                <h5>Your New Property</h5>
                <p>Welcome to your new home with DomiHive!</p>
            `;
        }
        
        // Show modal
        document.getElementById('activateTenantModal').classList.add('active');
        
        console.log('🏠 Showing tenant activation modal');
    }

    window.closeActivateTenantModal = function() {
        document.getElementById('activateTenantModal').classList.remove('active');
        console.log('🚪 Closed tenant activation modal');
    };

    window.completeTenantActivation = function() {
        console.log('✅ Completing tenant activation...');
        
        // Update user status to tenant
        const currentUser = JSON.parse(localStorage.getItem('domihive_current_user') || sessionStorage.getItem('domihive_current_user') || '{}');
        currentUser.userType = 'tenant';
        currentUser.tenantActivated = true;
        currentUser.tenantSince = new Date().toISOString();
        
        localStorage.setItem('domihive_current_user', JSON.stringify(currentUser));
        sessionStorage.setItem('domihive_current_user', JSON.stringify(currentUser));
        
        // Show success message
        showNotification('🎉 Tenant mode activated successfully!', 'success');
        
        // Close modal and redirect
        closeActivateTenantModal();
        
        setTimeout(() => {
            if (window.spa && typeof window.spa.navigateToSection === 'function') {
                window.spa.navigateToSection('my-properties');
            } else {
                window.location.href = '/Pages/dashboard-rent.html';
            }
        }, 1500);
    };

    function viewPaymentDetails(paymentId) {
        console.log('💰 Viewing payment details:', paymentId);
        showNotification('Opening payment receipt...', 'info');
        
        // In a real app, this would open payment details
        // For now, just show a notification
        setTimeout(() => {
            showNotification('Payment receipt loaded successfully', 'success');
        }, 1000);
    }

    function viewApplicationDetails(applicationId) {
        console.log('📄 Viewing application details:', applicationId);
        showNotification('Opening application details...', 'info');
        
        // In a real app, this would open application details
        // For now, just show a notification
        setTimeout(() => {
            showNotification('Application details loaded', 'success');
        }, 1000);
    }

    function markAsRead(notificationId) {
        const notification = notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            notification.read = true;
            saveNotifications();
            updateStatistics();
            
            // Update UI
            const notificationElement = document.querySelector(`[data-id="${notificationId}"]`);
            if (notificationElement) {
                notificationElement.classList.remove('unread');
                const badge = notificationElement.querySelector('.unread-badge');
                if (badge) badge.remove();
            }
            
            console.log('📭 Marked notification as read:', notificationId);
        }
    }

    function markAllAsRead() {
        let updated = false;
        notifications.forEach(notification => {
            if (!notification.read) {
                notification.read = true;
                updated = true;
            }
        });
        
        if (updated) {
            saveNotifications();
            updateStatistics();
            renderNotifications();
            showNotification('All notifications marked as read', 'success');
            console.log('📭 Marked all notifications as read');
        } else {
            showNotification('All notifications are already read', 'info');
        }
    }

    function refreshNotifications() {
        loadNotifications();
        renderNotifications();
        updateStatistics();
        showNotification('Notifications refreshed', 'success');
        console.log('🔄 Refreshed notifications');
    }

    function clearAllNotifications() {
        if (confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
            notifications = [];
            saveNotifications();
            renderNotifications();
            updateStatistics();
            showNotification('All notifications cleared', 'success');
            console.log('🗑️ Cleared all notifications');
        }
    }

    function exportNotifications() {
        const dataStr = JSON.stringify(notifications, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `domihive-notifications-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showNotification('Notifications exported successfully', 'success');
        console.log('📤 Exported notifications');
    }

    function updateStatistics() {
        const total = notifications.length;
        const unread = notifications.filter(n => !n.read).length;
        const today = notifications.filter(n => {
            const notificationDate = new Date(n.timestamp);
            const today = new Date();
            return notificationDate.toDateString() === today.toDateString();
        }).length;
        
        // Update counts in sidebar
        document.getElementById('totalNotifications').textContent = total;
        document.getElementById('unreadNotifications').textContent = unread;
        document.getElementById('todayNotifications').textContent = today;
        
        // Update filter counts
        document.getElementById('countAll').textContent = total;
        document.getElementById('countUnread').textContent = unread;
        document.getElementById('countApplication').textContent = notifications.filter(n => n.category === 'application').length;
        document.getElementById('countPayment').textContent = notifications.filter(n => n.category === 'payment').length;
        document.getElementById('countApproval').textContent = notifications.filter(n => n.category === 'approval').length;
        document.getElementById('countSystem').textContent = notifications.filter(n => n.category === 'system').length;
        
        console.log('📊 Updated statistics - Total:', total, 'Unread:', unread, 'Today:', today);
    }

    function updateResultsCount(count) {
        document.getElementById('resultsCount').textContent = 
            `${count} notification${count !== 1 ? 's' : ''}`;
    }

    function saveNotifications() {
        localStorage.setItem('domihive_notifications', JSON.stringify(notifications));
    }

    window.closeNotificationModal = function() {
        document.getElementById('notificationDetailModal').classList.remove('active');
        console.log('🚪 Closed notification detail modal');
    };

    function setupModalCloseHandlers() {
        // Close modals when clicking outside
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    console.log('🚪 Closed modal by clicking outside');
                }
            });
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.remove('active');
                });
                console.log('🚪 Closed all modals with Escape key');
            }
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

    // Add CSS animations for notifications
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

    console.log('🎉 DomiHive Notification System Ready!');
});

// Global function to add new notification
window.addNotification = function(notificationData) {
    const notifications = JSON.parse(localStorage.getItem('domihive_notifications')) || [];
    
    const newNotification = {
        id: 'notif_' + Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
        ...notificationData
    };
    
    notifications.unshift(newNotification);
    localStorage.setItem('domihive_notifications', JSON.stringify(notifications));
    
    // Update notification badge if exists
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        const unreadCount = notifications.filter(n => !n.read).length;
        badge.textContent = unreadCount > 0 ? unreadCount : '';
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
    
    console.log('📨 Added new notification:', newNotification.id);
    return newNotification.id;
};

// Global function to create specific notification types
window.createApplicationNotification = function(type, propertyData) {
    const notificationTypes = {
        'application_started': {
            title: 'Application Started 📝',
            message: `You've started an application for ${propertyData.title}`,
            category: 'application',
            type: 'application_submitted'
        },
        'application_approved': {
            title: 'Application Approved! 🎊',
            message: `Congratulations! Your application for ${propertyData.title} has been approved.`,
            category: 'approval',
            type: 'application_approved',
            propertyId: propertyData.id,
            actions: [
                {
                    action: 'activate_tenant_mode',
                    text: 'Activate Tenant Mode',
                    id: propertyData.id,
                    primary: true
                }
            ]
        },
        'payment_received': {
            title: 'Payment Received 💳',
            message: `Your payment for ${propertyData.title} has been processed successfully.`,
            category: 'payment',
            type: 'payment_confirmation',
            actions: [
                {
                    action: 'view_payment',
                    text: 'View Receipt',
                    id: 'PAY-' + Date.now()
                }
            ]
        }
    };
    
    const notificationConfig = notificationTypes[type];
    if (notificationConfig) {
        return window.addNotification(notificationConfig);
    }
    
    return null;
};