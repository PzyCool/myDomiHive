// notification.js - Clean Modern Notification System

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.currentSearch = '';
        
        this.init();
    }

    async init() {
        console.log('🔔 Initializing Notification System...');
        
        // Load notifications
        this.loadNotifications();
        
        // Initialize UI
        this.initUI();
        
        // Render initial state
        this.render();
        
        console.log('✅ Notification System Ready');
    }

    loadNotifications() {
        const stored = localStorage.getItem('domihive_notifications');
        
        if (stored) {
            this.notifications = JSON.parse(stored);
            console.log(`📧 Loaded ${this.notifications.length} notifications`);
        } else {
            this.createSampleNotifications();
        }
        
        // Sort by newest first
        this.notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    createSampleNotifications() {
        this.notifications = [
            {
                id: 'notif_1',
                type: 'welcome',
                title: 'Welcome to DomiHive! 🎉',
                message: 'Thank you for joining DomiHive. Start exploring properties and begin your rental journey.',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                read: true,
                category: 'system',
                icon: 'fas fa-home'
            },
            {
                id: 'notif_2',
                type: 'application_started',
                title: 'Application Started 📝',
                message: 'You\'ve started a rental application for "Luxury Apartment, Ikoyi". Complete it to proceed.',
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                read: true,
                category: 'applications',
                icon: 'fas fa-file-alt',
                actions: [
                    {
                        text: 'Continue Application',
                        type: 'primary',
                        action: 'continue_application',
                        data: { applicationId: 'APP-2024-00123' }
                    }
                ]
            },
            {
                id: 'notif_3',
                type: 'payment_success',
                title: 'Payment Successful 💳',
                message: 'Your payment of ₦250,000 for application fees has been processed successfully.',
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                read: false,
                category: 'payments',
                icon: 'fas fa-credit-card',
                actions: [
                    {
                        text: 'View Receipt',
                        type: 'default',
                        action: 'view_receipt',
                        data: { paymentId: 'PAY-2024-00123' }
                    }
                ]
            },
            {
                id: 'notif_4',
                type: 'application_approved',
                title: 'Congratulations! Application Approved 🎊',
                message: 'Your rental application has been approved! You can now activate your tenant account.',
                timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                read: false,
                category: 'applications',
                icon: 'fas fa-check-circle',
                actions: [
                    {
                        text: 'Activate Tenant Mode',
                        type: 'primary',
                        action: 'activate_tenant',
                        data: { propertyId: 'PROP-001' }
                    },
                    {
                        text: 'View Details',
                        type: 'default',
                        action: 'view_details'
                    }
                ]
            },
            {
                id: 'notif_5',
                type: 'system_update',
                title: 'System Maintenance ⚙️',
                message: 'Scheduled maintenance on Sunday, 2 AM - 4 AM. The system may be temporarily unavailable.',
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                read: false,
                category: 'system',
                icon: 'fas fa-cog'
            }
        ];
        
        this.saveNotifications();
        console.log('📧 Created sample notifications');
    }

    initUI() {
        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handleFilterChange(e.currentTarget);
            });
        });
        
        // Search input
        const searchInput = document.getElementById('notificationSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
        
        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.handleSortChange(e.target.value);
            });
        }
        
        // Action buttons
        const markAllReadBtn = document.getElementById('markAllReadBtn');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => this.markAllAsRead());
        }
        
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refresh());
        }
        
        const clearAllBtn = document.getElementById('clearAllBtn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAll());
        }
        
        // Modal close
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }
        
        // Close modal on backdrop click
        const modal = document.getElementById('notificationModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    handleFilterChange(tab) {
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update current filter
        this.currentFilter = tab.dataset.filter;
        
        // Re-render
        this.render();
        
        console.log(`🔍 Filter changed to: ${this.currentFilter}`);
    }

    handleSearch(query) {
        this.currentSearch = query.toLowerCase();
        this.render();
        
        if (query) {
            console.log(`🔎 Searching for: ${query}`);
        }
    }

    handleSortChange(sort) {
        this.currentSort = sort;
        this.render();
        console.log(`🔄 Sort changed to: ${sort}`);
    }

    getFilteredNotifications() {
        let filtered = [...this.notifications];
        
        // Apply search filter
        if (this.currentSearch) {
            filtered = filtered.filter(notification => 
                notification.title.toLowerCase().includes(this.currentSearch) ||
                notification.message.toLowerCase().includes(this.currentSearch)
            );
        }
        
        // Apply category filter
        if (this.currentFilter !== 'all') {
            if (this.currentFilter === 'unread') {
                filtered = filtered.filter(notification => !notification.read);
            } else {
                filtered = filtered.filter(notification => notification.category === this.currentFilter);
            }
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            const dateA = new Date(a.timestamp);
            const dateB = new Date(b.timestamp);
            
            if (this.currentSort === 'oldest') {
                return dateA - dateB;
            } else {
                return dateB - dateA; // newest first (default)
            }
        });
        
        return filtered;
    }

    render() {
        this.renderNotificationsList();
        this.updateStats();
        this.updateFilterCounts();
    }

    renderNotificationsList() {
        const listContainer = document.getElementById('notificationsList');
        const emptyState = document.getElementById('emptyState');
        const filteredNotifications = this.getFilteredNotifications();
        
        if (!listContainer) return;
        
        if (filteredNotifications.length === 0) {
            // Show empty state
            if (emptyState) {
                emptyState.style.display = 'block';
                listContainer.innerHTML = '';
                listContainer.appendChild(emptyState);
            }
        } else {
            // Hide empty state
            if (emptyState) {
                emptyState.style.display = 'none';
            }
            
            // Clear and render notifications
            listContainer.innerHTML = '';
            
            filteredNotifications.forEach(notification => {
                const notificationElement = this.createNotificationElement(notification);
                listContainer.appendChild(notificationElement);
            });
        }
    }

    createNotificationElement(notification) {
        const element = document.createElement('div');
        element.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
        element.dataset.id = notification.id;
        
        const timeAgo = this.getTimeAgo(notification.timestamp);
        const iconClass = this.getIconClass(notification.category);
        
        element.innerHTML = `
            <div class="notification-item-header">
                <div class="notification-item-title">
                    <div class="notification-icon ${iconClass}">
                        <i class="${notification.icon || 'fas fa-bell'}"></i>
                    </div>
                    <div class="notification-text">
                        <h4>${notification.title}</h4>
                        <p>${notification.message}</p>
                    </div>
                </div>
                <div class="notification-time">${timeAgo}</div>
            </div>
            ${notification.read ? '' : '<div class="unread-indicator"></div>'}
            ${notification.actions ? this.renderNotificationActions(notification.actions, notification.id) : ''}
        `;
        
        // Add click event
        element.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-action-btn')) {
                this.markAsRead(notification.id);
                this.openNotificationDetail(notification);
            }
        });
        
        return element;
    }

    renderNotificationActions(actions, notificationId) {
        return `
            <div class="notification-actions">
                ${actions.map(action => `
                    <button class="notification-action-btn ${action.type === 'primary' ? 'primary' : ''}"
                            onclick="event.stopPropagation(); notificationSystem.handleAction('${action.action}', ${JSON.stringify(action.data)}, '${notificationId}')">
                        ${action.text}
                    </button>
                `).join('')}
            </div>
        `;
    }

    getIconClass(category) {
        const iconMap = {
            'applications': 'application',
            'payments': 'payment',
            'system': 'system',
            'alerts': 'alert'
        };
        return iconMap[category] || 'general';
    }

    getTimeAgo(timestamp) {
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
            year: time.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }

    updateStats() {
        const total = this.notifications.length;
        const unread = this.notifications.filter(n => !n.read).length;
        const today = this.notifications.filter(n => {
            const notificationDate = new Date(n.timestamp);
            const today = new Date();
            return notificationDate.toDateString() === today.toDateString();
        }).length;
        
        // Update header count
        const headerCount = document.getElementById('totalNotificationCount');
        if (headerCount) {
            headerCount.textContent = unread > 0 ? unread : '';
        }
        
        // Update stats bar
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };
        
        updateElement('statsTotal', total);
        updateElement('statsUnread', unread);
        updateElement('statsToday', today);
    }

    updateFilterCounts() {
        const total = this.notifications.length;
        const unread = this.notifications.filter(n => !n.read).length;
        const applications = this.notifications.filter(n => n.category === 'applications').length;
        const payments = this.notifications.filter(n => n.category === 'payments').length;
        const system = this.notifications.filter(n => n.category === 'system').length;
        
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };
        
        updateElement('filterAllCount', total);
        updateElement('filterUnreadCount', unread);
        updateElement('filterAppCount', applications);
        updateElement('filterPaymentCount', payments);
        updateElement('filterSystemCount', system);
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            notification.read = true;
            this.saveNotifications();
            this.updateStats();
            this.updateFilterCounts();
            
            // Update UI
            const element = document.querySelector(`[data-id="${notificationId}"]`);
            if (element) {
                element.classList.remove('unread');
                element.classList.add('read');
                const indicator = element.querySelector('.unread-indicator');
                if (indicator) indicator.remove();
            }
            
            console.log(`📭 Marked notification as read: ${notificationId}`);
        }
    }

    markAllAsRead() {
        let updated = false;
        
        this.notifications.forEach(notification => {
            if (!notification.read) {
                notification.read = true;
                updated = true;
            }
        });
        
        if (updated) {
            this.saveNotifications();
            this.render();
            this.showToast('All notifications marked as read', 'success');
            console.log('📭 Marked all notifications as read');
        } else {
            this.showToast('All notifications are already read', 'info');
        }
    }

    refresh() {
        this.loadNotifications();
        this.render();
        this.showToast('Notifications refreshed', 'success');
        console.log('🔄 Refreshed notifications');
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
            this.notifications = [];
            this.saveNotifications();
            this.render();
            this.showToast('All notifications cleared', 'success');
            console.log('🗑️ Cleared all notifications');
        }
    }

    openNotificationDetail(notification) {
        const modal = document.getElementById('notificationModal');
        const modalIcon = document.getElementById('modalIcon');
        const modalTitle = document.getElementById('modalTitle');
        const modalTime = document.getElementById('modalTime');
        const modalCategory = document.getElementById('modalCategory');
        const modalMessage = document.getElementById('modalMessage');
        const modalActions = document.getElementById('modalActions');
        
        if (!modal) return;
        
        // Update modal content
        if (modalIcon) {
            modalIcon.innerHTML = `<i class="${notification.icon || 'fas fa-bell'}"></i>`;
            modalIcon.className = `modal-icon ${this.getIconClass(notification.category)}`;
        }
        
        if (modalTitle) modalTitle.textContent = notification.title;
        if (modalTime) modalTime.textContent = this.getTimeAgo(notification.timestamp);
        if (modalCategory) modalCategory.textContent = notification.category;
        if (modalMessage) modalMessage.textContent = notification.message;
        
        // Update actions
        if (modalActions) {
            modalActions.innerHTML = '';
            
            if (notification.actions && notification.actions.length > 0) {
                notification.actions.forEach(action => {
                    const button = document.createElement('button');
                    button.className = `modal-action-btn ${action.type === 'primary' ? 'primary' : ''}`;
                    button.textContent = action.text;
                    button.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.handleAction(action.action, action.data, notification.id);
                        this.closeModal();
                    });
                    modalActions.appendChild(button);
                });
            }
            
            // Always add close button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'modal-action-btn';
            closeBtn.innerHTML = '<i class="fas fa-times"></i> Close';
            closeBtn.addEventListener('click', () => this.closeModal());
            modalActions.appendChild(closeBtn);
        }
        
        // Show modal
        modal.classList.add('active');
        
        console.log(`📖 Opened notification detail: ${notification.id}`);
    }

    closeModal() {
        const modal = document.getElementById('notificationModal');
        if (modal) {
            modal.classList.remove('active');
            console.log('🚪 Closed notification modal');
        }
    }

    handleAction(action, data, notificationId) {
        console.log(`🔄 Handling action: ${action}`, data);
        
        switch (action) {
            case 'continue_application':
                this.showToast('Opening application...', 'info');
                // In real app: window.spa.navigateToSection('applications');
                break;
                
            case 'view_receipt':
                this.showToast('Opening receipt...', 'info');
                // In real app: window.spa.navigateToSection('payments');
                break;
                
            case 'activate_tenant':
                this.showToast('Activating tenant mode...', 'success');
                // In real app: window.spa.navigateToSection('tenant-activation');
                break;
                
            case 'view_details':
                // Already viewing details in modal
                break;
                
            default:
                this.showToast('Action completed', 'success');
        }
        
        // Mark as read if not already
        this.markAsRead(notificationId);
    }

    showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10001;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(toastContainer);
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                     type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    saveNotifications() {
        localStorage.setItem('domihive_notifications', JSON.stringify(this.notifications));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded - Starting Notification System...');
    window.notificationSystem = new NotificationSystem();
});

// Global function to add new notification (for other parts of the app)
window.addNotification = function(notificationData) {
    if (window.notificationSystem) {
        const newNotification = {
            id: 'notif_' + Date.now(),
            timestamp: new Date().toISOString(),
            read: false,
            icon: 'fas fa-bell',
            ...notificationData
        };
        
        window.notificationSystem.notifications.unshift(newNotification);
        window.notificationSystem.saveNotifications();
        window.notificationSystem.render();
        
        console.log('📨 Added new notification:', newNotification.id);
        return newNotification.id;
    }
    return null;
};

// Global function to create specific notification types
window.createApplicationNotification = function(type, propertyData) {
    const templates = {
        'application_started': {
            title: 'Application Started 📝',
            message: `You've started an application for "${propertyData.title}"`,
            category: 'applications',
            icon: 'fas fa-file-alt'
        },
        'application_approved': {
            title: 'Application Approved! 🎊',
            message: `Congratulations! Your application for "${propertyData.title}" has been approved.`,
            category: 'applications',
            icon: 'fas fa-check-circle',
            actions: [
                {
                    text: 'Activate Tenant',
                    type: 'primary',
                    action: 'activate_tenant',
                    data: { propertyId: propertyData.id }
                }
            ]
        },
        'payment_received': {
            title: 'Payment Received 💳',
            message: `Payment for "${propertyData.title}" has been processed successfully.`,
            category: 'payments',
            icon: 'fas fa-credit-card',
            actions: [
                {
                    text: 'View Receipt',
                    type: 'default',
                    action: 'view_receipt'
                }
            ]
        }
    };
    
    const template = templates[type];
    if (template) {
        return window.addNotification(template);
    }
    
    return null;
};

// Add CSS animations for toasts
if (!document.querySelector('#toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
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

console.log('🎉 Notification System Module Loaded!');