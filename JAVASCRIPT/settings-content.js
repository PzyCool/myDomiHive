// settings-content.js - Complete Settings Management System

// SPA Integration
window.spaSettingsInit = function() {
    console.log('🎯 SPA: Initializing Settings Content');
    initializeSettingsSystem();
};

// Auto-initialize if loaded directly
if (window.location.pathname.includes('settings-content.html')) {
    document.addEventListener('DOMContentLoaded', initializeSettingsSystem);
} else {
    // SPA environment - check if we're on the page and initialize
    setTimeout(function() {
        if (document.querySelector('.settings-content')) {
            console.log('🔍 Detected SPA environment - auto-initializing settings');
            initializeSettingsSystem();
        }
    }, 500);
}

function initializeSettingsSystem() {
    console.log('⚙️ Initializing Settings System...');
    
    // Global variables
    let userSettings = {};
    let currentPhoto = null;
    
    // Load settings and initialize
    loadUserSettings();
    initializeEventListeners();
    initializeNavigation();
    initializeThemeSystem();
    
    console.log('✅ Settings system ready');
}

// ===== DATA MANAGEMENT =====
function loadUserSettings() {
    console.log('📦 Loading user settings...');
    
    const storedSettings = localStorage.getItem('domihive_user_settings');
    
    if (storedSettings) {
        userSettings = JSON.parse(storedSettings);
        console.log('✅ Loaded user settings');
    } else {
        console.log('📝 No settings found, creating default settings...');
        createDefaultSettings();
    }
    
    // Apply settings to UI
    applySettingsToUI();
}

function createDefaultSettings() {
    userSettings = {
        profile: {
            fullName: 'John Doe',
            bio: 'Property enthusiast and DomiHive user',
            email: 'john.doe@example.com',
            phone: '+234 812 345 6789',
            photo: null
        },
        security: {
            twoFactorEnabled: false,
            sessions: [
                {
                    id: 'session_1',
                    device: 'Chrome on Windows',
                    location: 'Lagos, Nigeria',
                    current: true,
                    lastActive: new Date().toISOString()
                },
                {
                    id: 'session_2',
                    device: 'Safari on iPhone',
                    location: 'Abuja, Nigeria',
                    current: false,
                    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                }
            ]
        },
        notifications: {
            push: true,
            email: true,
            sms: false,
            paymentReminders: true,
            maintenanceUpdates: true,
            messageNotifications: true,
            securityAlerts: true,
            quietHours: {
                enabled: false,
                start: '22:00',
                end: '07:00'
            }
        },
        appearance: {
            theme: 'light',
            accentColor: 'gold'
        },
        privacy: {
            activityTracking: true,
            personalizedContent: true,
            marketingEmails: false
        }
    };
    
    saveUserSettings();
}

function saveUserSettings() {
    localStorage.setItem('domihive_user_settings', JSON.stringify(userSettings));
    console.log('💾 Settings saved');
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    console.log('🎯 Initializing event listeners...');
    
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section, this);
        });
    });
    
    // Theme selection
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectTheme(this.getAttribute('data-theme'));
        });
    });
    
    // Color selection
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectAccentColor(this.getAttribute('data-color'));
        });
    });
    
    // Password strength
    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', updatePasswordStrength);
    }
    
    // Delete account confirmation
    const confirmDeleteInput = document.getElementById('confirmDelete');
    if (confirmDeleteInput) {
        confirmDeleteInput.addEventListener('input', toggleDeleteButton);
    }
    
    console.log('✅ Event listeners initialized');
}

function initializeNavigation() {
    // Show first section by default
    const firstNavItem = document.querySelector('.nav-item');
    if (firstNavItem) {
        const firstSection = firstNavItem.getAttribute('data-section');
        showSection(firstSection, firstNavItem);
    }
}

// ===== NAVIGATION =====
function showSection(sectionId, navElement) {
    console.log('📱 Showing section:', sectionId);
    
    // Hide all sections
    document.querySelectorAll('.settings-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show target section and activate nav item
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    if (navElement) {
        navElement.classList.add('active');
    }
    
    // Update URL hash
    window.location.hash = sectionId;
}

// ===== PROFILE SETTINGS =====
function applySettingsToUI() {
    console.log('🎨 Applying settings to UI...');
    
    // Profile settings
    if (userSettings.profile) {
        document.getElementById('fullName').value = userSettings.profile.fullName || '';
        document.getElementById('userBio').value = userSettings.profile.bio || '';
        document.getElementById('userEmail').value = userSettings.profile.email || '';
        
        // Handle phone with country code
        const phoneValue = userSettings.profile.phone || '';
        if (phoneValue) {
            // Extract country code and phone number
            const countryCodeMatch = phoneValue.match(/^(\+\d+)/);
            if (countryCodeMatch) {
                const countryCode = countryCodeMatch[1];
                const phoneNumber = phoneValue.replace(countryCode, '').trim();
                
                document.getElementById('userCountryCode').value = countryCode;
                document.getElementById('userPhone').value = phoneNumber;
            } else {
                // Default to Nigeria if no country code found
                document.getElementById('userCountryCode').value = '+234';
                document.getElementById('userPhone').value = phoneValue;
            }
        } else {
            // Default values
            document.getElementById('userCountryCode').value = '+234';
            document.getElementById('userPhone').value = '';
        }
        
        // Load profile photo if exists
        if (userSettings.profile.photo) {
            loadProfilePhoto(userSettings.profile.photo);
        }
    }
    
    
    // Security settings
    if (userSettings.security) {
        document.getElementById('twoFactorToggle').checked = userSettings.security.twoFactorEnabled || false;
        renderSessionsList();
    }
    
    // Notification settings
    if (userSettings.notifications) {
        document.getElementById('pushNotifications').checked = userSettings.notifications.push || false;
        document.getElementById('emailNotifications').checked = userSettings.notifications.email || false;
        document.getElementById('smsNotifications').checked = userSettings.notifications.sms || false;
        document.getElementById('paymentReminders').checked = userSettings.notifications.paymentReminders || false;
        document.getElementById('maintenanceUpdates').checked = userSettings.notifications.maintenanceUpdates || false;
        document.getElementById('messageNotifications').checked = userSettings.notifications.messageNotifications || false;
        document.getElementById('securityAlerts').checked = userSettings.notifications.securityAlerts || false;
        document.getElementById('quietHoursToggle').checked = userSettings.notifications.quietHours.enabled || false;
        document.getElementById('quietStart').value = userSettings.notifications.quietHours.start || '22:00';
        document.getElementById('quietEnd').value = userSettings.notifications.quietHours.end || '07:00';
    }
    
    // Appearance settings
    if (userSettings.appearance) {
        // Set theme
        const themeRadio = document.querySelector(`input[name="theme"][value="${userSettings.appearance.theme}"]`);
        if (themeRadio) {
            themeRadio.checked = true;
            updateThemePreview();
        }
        
        // Set accent color
        const colorRadio = document.querySelector(`input[name="accent-color"][value="${userSettings.appearance.accentColor}"]`);
        if (colorRadio) {
            colorRadio.checked = true;
            updateColorPreview();
        }
    }
    
    // Privacy settings
    if (userSettings.privacy) {
        document.getElementById('activityTracking').checked = userSettings.privacy.activityTracking || false;
        document.getElementById('personalizedContent').checked = userSettings.privacy.personalizedContent || false;
        document.getElementById('marketingEmails').checked = userSettings.privacy.marketingEmails || false;
    }
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('📸 Processing photo upload...');
    
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
        showNotification('Please select a JPG or PNG image file', 'error');
        return;
    }
    
    if (file.size > maxSize) {
        showNotification('File size must be less than 5MB', 'error');
        return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = function(e) {
        currentPhoto = e.target.result;
        loadProfilePhoto(currentPhoto);
        showNotification('Profile photo uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
}

function loadProfilePhoto(photoData) {
    const avatar = document.querySelector('.current-photo .avatar-placeholder');
    if (avatar && photoData) {
        avatar.innerHTML = `<img src="${photoData}" alt="Profile Photo" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    }
}

function removeProfilePhoto() {
    if (confirm('Are you sure you want to remove your profile photo?')) {
        currentPhoto = null;
        const avatar = document.querySelector('.current-photo .avatar-placeholder');
        if (avatar) {
            avatar.innerHTML = '<i class="fas fa-user"></i>';
        }
        showNotification('Profile photo removed', 'info');
    }
}

function resetProfileForm() {
    if (confirm('Reset all profile changes?')) {
        applySettingsToUI();
        showNotification('Profile form reset', 'info');
    }
}

function saveProfileSettings() {
    console.log('💾 Saving profile settings...');
    
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const bio = document.getElementById('userBio').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const countryCode = document.getElementById('userCountryCode').value;
    const phoneNumber = document.getElementById('userPhone').value.trim();
    const phone = phoneNumber ? `${countryCode} ${phoneNumber}` : '';
    
    // Basic validation
    if (!fullName) {
        showNotification('Please enter your full name', 'error');
        return;
    }
    
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (phoneNumber && !isValidPhone(phoneNumber)) {
        showNotification('Please enter a valid phone number', 'error');
        return;
    }
    
    // Update settings
    userSettings.profile = {
        ...userSettings.profile,
        fullName,
        bio,
        email,
        phone,
        photo: currentPhoto || userSettings.profile.photo
    };
    
    saveUserSettings();
    showNotification('Profile settings saved successfully!', 'success');
}

// Update phone validation to handle numbers without country code
function isValidPhone(phoneNumber) {
    // Remove any non-digit characters for validation
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Basic phone validation - adjust based on your requirements
    // This example validates Nigerian phone numbers (10 digits starting with 7,8,9)
    const nigerianRegex = /^[789][01]\d{8}$/;
    
    return cleanNumber.length >= 10 && nigerianRegex.test(cleanNumber);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Basic phone validation for Nigerian numbers
    const phoneRegex = /^\+234[789][01]\d{8}$|^0[789][01]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// ===== SECURITY SETTINGS =====
function updatePasswordStrength() {
    const password = document.getElementById('newPassword').value;
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!password) {
        strengthBar.style.width = '0%';
        strengthBar.setAttribute('data-strength', '0');
        strengthText.textContent = 'Password strength';
        return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    
    // Lowercase check
    if (/[a-z]/.test(password)) strength++;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength++;
    
    // Number check
    if (/[0-9]/.test(password)) strength++;
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Update UI
    strengthBar.style.width = `${strength * 25}%`;
    strengthBar.setAttribute('data-strength', strength.toString());
    
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    strengthText.textContent = strengthLabels[strength] || 'Password strength';
}

function updatePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!currentPassword) {
        showNotification('Please enter your current password', 'error');
        return;
    }
    
    if (!newPassword) {
        showNotification('Please enter a new password', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    
    // Simulate password update
    showNotification('Updating password...', 'info');
    
    setTimeout(() => {
        // Clear form
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        // Reset strength meter
        updatePasswordStrength();
        
        showNotification('Password updated successfully!', 'success');
    }, 1500);
}

function renderSessionsList() {
    const sessionsList = document.querySelector('.sessions-list');
    if (!sessionsList || !userSettings.security.sessions) return;
    
    const sessionsHTML = userSettings.security.sessions.map(session => {
        const isCurrent = session.current;
        const lastActive = formatTimeAgo(session.lastActive);
        
        return `
            <div class="session-item">
                <div class="session-info">
                    <div class="session-device">
                        <i class="fas ${session.device.includes('iPhone') ? 'fa-mobile-alt' : 'fa-desktop'}"></i>
                        <div>
                            <strong>${session.device}</strong>
                            <small>${isCurrent ? 'Current session' : 'Last active'} • ${session.location}</small>
                        </div>
                    </div>
                    <div class="session-time">${isCurrent ? 'Active now' : lastActive}</div>
                </div>
                ${!isCurrent ? `
                    <button class="btn-secondary btn-sm" onclick="revokeSession('${session.id}')">
                        <i class="fas fa-times"></i>
                        Revoke
                    </button>
                ` : ''}
            </div>
        `;
    }).join('');
    
    sessionsList.innerHTML = sessionsHTML;
}

function revokeSession(sessionId) {
    if (confirm('Are you sure you want to revoke this session?')) {
        userSettings.security.sessions = userSettings.security.sessions.filter(session => session.id !== sessionId);
        saveUserSettings();
        renderSessionsList();
        showNotification('Session revoked successfully', 'success');
    }
}

function revokeAllSessions() {
    if (confirm('Are you sure you want to revoke all other sessions? You will be logged out from all other devices.')) {
        userSettings.security.sessions = userSettings.security.sessions.filter(session => session.current);
        saveUserSettings();
        renderSessionsList();
        showNotification('All other sessions revoked', 'success');
    }
}

// ===== NOTIFICATION SETTINGS =====
function saveNotificationSettings() {
    console.log('💾 Saving notification settings...');
    
    userSettings.notifications = {
        push: document.getElementById('pushNotifications').checked,
        email: document.getElementById('emailNotifications').checked,
        sms: document.getElementById('smsNotifications').checked,
        paymentReminders: document.getElementById('paymentReminders').checked,
        maintenanceUpdates: document.getElementById('maintenanceUpdates').checked,
        messageNotifications: document.getElementById('messageNotifications').checked,
        securityAlerts: document.getElementById('securityAlerts').checked,
        quietHours: {
            enabled: document.getElementById('quietHoursToggle').checked,
            start: document.getElementById('quietStart').value,
            end: document.getElementById('quietEnd').value
        }
    };
    
    saveUserSettings();
    showNotification('Notification preferences saved!', 'success');
}

// ===== APPEARANCE SETTINGS =====
function initializeThemeSystem() {
    // Load saved theme
    const savedTheme = userSettings.appearance?.theme || 'light';
    applyTheme(savedTheme);
    updateThemePreview();
    updateColorPreview();
}

function selectTheme(theme) {
    console.log('🎨 Selecting theme:', theme);
    
    // Update radio button
    const radio = document.querySelector(`input[name="theme"][value="${theme}"]`);
    if (radio) {
        radio.checked = true;
    }
    
    updateThemePreview();
}

function selectAccentColor(color) {
    console.log('🎨 Selecting accent color:', color);
    
    // Update radio button
    const radio = document.querySelector(`input[name="accent-color"][value="${color}"]`);
    if (radio) {
        radio.checked = true;
    }
    
    updateColorPreview();
}

function updateThemePreview() {
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        const theme = option.getAttribute('data-theme');
        const radio = option.querySelector('input[type="radio"]');
        if (radio && radio.checked) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

function updateColorPreview() {
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        const color = option.getAttribute('data-color');
        const radio = option.querySelector('input[type="radio"]');
        if (radio && radio.checked) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

function applyAppearanceSettings() {
    console.log('🎨 Applying appearance settings...');
    
    const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
    const selectedColor = document.querySelector('input[name="accent-color"]:checked').value;
    
    userSettings.appearance = {
        theme: selectedTheme,
        accentColor: selectedColor
    };
    
    saveUserSettings();
    applyTheme(selectedTheme);
    showNotification('Appearance settings applied!', 'success');
}

function applyTheme(theme) {
    console.log('Applying theme:', theme);
    
    // Remove existing theme classes
    document.body.classList.remove('light-theme', 'dark-gray-theme', 'true-black-theme', 'blue-dark-theme');
    
    // Add new theme class
    document.body.classList.add(`${theme}-theme`);
    
    // Update CSS variables based on theme
    updateThemeVariables(theme);
}

function updateThemeVariables(theme) {
    const root = document.documentElement;
    
    switch(theme) {
        case 'light':
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f8fafc');
            root.style.setProperty('--text-primary', '#334155');
            root.style.setProperty('--text-secondary', '#64748b');
            root.style.setProperty('--border-color', '#e2e8f0');
            break;
        case 'dark-gray':
            root.style.setProperty('--bg-primary', '#1f2937');
            root.style.setProperty('--bg-secondary', '#111827');
            root.style.setProperty('--text-primary', '#f9fafb');
            root.style.setProperty('--text-secondary', '#d1d5db');
            root.style.setProperty('--border-color', '#374151');
            break;
        case 'true-black':
            root.style.setProperty('--bg-primary', '#000000');
            root.style.setProperty('--bg-secondary', '#111111');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#bbbbbb');
            root.style.setProperty('--border-color', '#333333');
            break;
        case 'blue-dark':
            root.style.setProperty('--bg-primary', '#0e1f42');
            root.style.setProperty('--bg-secondary', '#0a1630');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#cbd5e1');
            root.style.setProperty('--border-color', '#1e3a8a');
            break;
    }
}

// ===== PRIVACY SETTINGS =====
function savePrivacySettings() {
    console.log('💾 Saving privacy settings...');
    
    userSettings.privacy = {
        activityTracking: document.getElementById('activityTracking').checked,
        personalizedContent: document.getElementById('personalizedContent').checked,
        marketingEmails: document.getElementById('marketingEmails').checked
    };
    
    saveUserSettings();
    showNotification('Privacy preferences saved!', 'success');
}

function exportAccountData() {
    showNotification('Preparing your data export...', 'info');
    
    setTimeout(() => {
        // Create a blob with the user data
        const dataStr = JSON.stringify(userSettings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `domihive-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showNotification('Account data exported successfully!', 'success');
    }, 2000);
}

function clearSearchHistory() {
    if (confirm('Are you sure you want to clear your search history? This action cannot be undone.')) {
        showNotification('Clearing search history...', 'info');
        
        setTimeout(() => {
            showNotification('Search history cleared successfully!', 'success');
        }, 1500);
    }
}

// ===== ACCOUNT ACTIONS =====
function downloadAccountData() {
    exportAccountData(); // Reuse the same function
}

function deactivateAccount() {
    document.getElementById('deactivateModal').classList.add('active');
}

function closeDeactivateModal() {
    document.getElementById('deactivateModal').classList.remove('active');
}

function confirmDeactivation() {
    const reason = document.getElementById('deactivateReason').value;
    
    showNotification('Deactivating your account...', 'info');
    
    setTimeout(() => {
        closeDeactivateModal();
        showNotification('Account deactivated successfully. You can reactivate by logging in again.', 'success');
        
        // Reset form
        document.getElementById('deactivateReason').value = '';
    }, 2000);
}

function deleteAccount() {
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    document.getElementById('confirmDelete').value = '';
    document.getElementById('confirmDeleteBtn').disabled = true;
}

function toggleDeleteButton() {
    const input = document.getElementById('confirmDelete');
    const button = document.getElementById('confirmDeleteBtn');
    
    if (input.value.toUpperCase() === 'DELETE') {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}

function confirmDeletion() {
    showNotification('Deleting your account permanently...', 'info');
    
    setTimeout(() => {
        // Clear all user data
        localStorage.removeItem('domihive_user_settings');
        localStorage.removeItem('domihive_conversations');
        localStorage.removeItem('domihive_annie_settings');
        
        closeDeleteModal();
        showNotification('Account deleted successfully. Thank you for using DomiHive.', 'success');
        
        // Redirect to home page after delay
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    }, 3000);
}

// ===== UTILITY FUNCTIONS =====
function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function showNotification(message, type = 'info') {
    // Remove existing notification
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
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
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
                 type === 'error' ? 'fa-exclamation-triangle' : 
                 type === 'warning' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
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

// Handle hash changes for direct section access
window.addEventListener('hashchange', function() {
    const sectionId = window.location.hash.substring(1);
    const navItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (navItem) {
        showSection(sectionId, navItem);
    }
});

// Initialize hash on load
if (window.location.hash) {
    const sectionId = window.location.hash.substring(1);
    const navItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (navItem) {
        showSection(sectionId, navItem);
    }
}

console.log('🎉 Settings Content JavaScript Loaded!');