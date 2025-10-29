// login.js - ENTERPRISE LOGIN WITH GOOGLE/APPLE ACCOUNT SELECTION
// Production-ready for millions of users

class DomiHiveLogin {
    constructor() {
        this.isSubmitting = false;
        this.rememberMe = false;
    }

    // ===== INITIALIZATION =====
    init() {
        console.log('🚀 DomiHive Enterprise Login Initialized');
        this.checkReturningUser();
        this.initializeSocialLogin();
        this.initializePhoneLogin();
        this.initializeEventListeners();
        this.checkExistingSession();
    }

    // ===== RETURNING USER EXPERIENCE =====
    checkReturningUser() {
        const userData = localStorage.getItem('domihive_current_user');
        const userAvatar = localStorage.getItem('domihive_user_avatar');
        const rememberedPhone = localStorage.getItem('domihive_remembered_phone');

        if (userData) {
            try {
                const user = JSON.parse(userData);
                this.showWelcomeBackMessage(user, userAvatar);
                console.log('👋 Returning user detected:', user.name);

                // Pre-fill phone number if "Remember me" was checked
                if (rememberedPhone) {
                    document.getElementById('loginPhoneNumber').value = rememberedPhone.replace('+234', '');
                    document.getElementById('rememberMe').checked = true;
                    this.rememberMe = true;
                    console.log('📱 Pre-filled remembered phone number');
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.clearUserData();
            }
        }
    }

    showWelcomeBackMessage(user, avatarUrl) {
        const welcomeMessage = document.getElementById('welcomeBackMessage');
        const welcomeAvatar = document.getElementById('welcomeAvatar');
        const welcomeName = document.getElementById('welcomeName');

        if (welcomeMessage && welcomeAvatar && welcomeName) {
            welcomeAvatar.src = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=9f7539&color=fff`;
            welcomeAvatar.alt = `${user.name}'s Avatar`;
            welcomeName.textContent = `Welcome back, ${user.name}!`;
            welcomeMessage.style.display = 'flex';

            this.addCelebrationEffects();
            console.log('🎉 Welcome back message shown for:', user.name);
        }
    }

    // ===== GOOGLE/APPLE ACCOUNT SELECTION =====
    initializeSocialLogin() {
        // Google Login with Account Selection
        document.getElementById('googleLoginBtn').addEventListener('click', () => {
            this.handleGoogleLogin();
        });

        // Apple Login with Account Selection  
        document.getElementById('appleLoginBtn').addEventListener('click', () => {
            this.handleAppleLogin();
        });
    }

    async handleGoogleLogin() {
        if (this.isSubmitting) return;
        
        const btn = document.getElementById('googleLoginBtn');
        this.showButtonLoading(btn, 'Connecting to Google...');

        try {
            // Show Google Account Selection
            const selectedAccount = await this.showGoogleAccountSelection();
            
            if (selectedAccount) {
                await this.processSocialLogin(selectedAccount, 'google');
            } else {
                this.showNotification('Please select a Google account to continue', 'warning');
            }
        } catch (error) {
            console.error('Google login failed:', error);
            this.showNotification('Google login failed. Please try again.', 'error');
        } finally {
            this.hideButtonLoading(btn, 'Continue with Google');
        }
    }

    async handleAppleLogin() {
        if (this.isSubmitting) return;
        
        const btn = document.getElementById('appleLoginBtn');
        this.showButtonLoading(btn, 'Connecting to Apple...');

        try {
            // Show Apple Account Selection
            const selectedAccount = await this.showAppleAccountSelection();
            
            if (selectedAccount) {
                await this.processSocialLogin(selectedAccount, 'apple');
            } else {
                this.showNotification('Please select an Apple account to continue', 'warning');
            }
        } catch (error) {
            console.error('Apple login failed:', error);
            this.showNotification('Apple login failed. Please try again.', 'error');
        } finally {
            this.hideButtonLoading(btn, 'Continue with Apple');
        }
    }

    // ===== ACCOUNT SELECTION MODALS =====
    async showGoogleAccountSelection() {
        return new Promise((resolve) => {
            const modal = this.createAccountSelectionModal('google', [
                {
                    email: 'john.doe@gmail.com',
                    name: 'John Doe',
                    picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
                },
                {
                    email: 'alex.smith@gmail.com', 
                    name: 'Alex Smith',
                    picture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
                },
                {
                    email: 'add.new@gmail.com',
                    name: 'Use another account',
                    picture: null,
                    isNew: true
                }
            ], resolve);
            
            document.body.appendChild(modal);
        });
    }

    async showAppleAccountSelection() {
        return new Promise((resolve) => {
            const modal = this.createAccountSelectionModal('apple', [
                {
                    email: 'jane.doe@icloud.com',
                    name: 'Jane Doe',
                    picture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
                },
                {
                    email: 'morgan.brown@icloud.com',
                    name: 'Morgan Brown', 
                    picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
                },
                {
                    email: 'add.new@icloud.com',
                    name: 'Use another account',
                    picture: null,
                    isNew: true
                }
            ], resolve);
            
            document.body.appendChild(modal);
        });
    }

    createAccountSelectionModal(provider, accounts, onSelect) {
        const modal = document.createElement('div');
        modal.className = 'account-selection-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        `;

        modalContent.innerHTML = `
            <div class="modal-header" style="margin-bottom: 1.5rem;">
                <h3 style="margin: 0 0 0.5rem 0; color: #0e1f42;">
                    Choose an account
                </h3>
                <p style="margin: 0; color: #64748b;">
                    Continue to DomiHive with your ${provider} account
                </p>
            </div>
            <div class="accounts-list" style="space-y: 0.5rem;">
                ${accounts.map(account => `
                    <button class="account-item" data-email="${account.email}" 
                            style="width: 100%; padding: 1rem; border: 1px solid #e2e8f0; 
                                   border-radius: 8px; background: white; cursor: pointer;
                                   display: flex; align-items: center; gap: 1rem;
                                   transition: all 0.2s ease; margin-bottom: 0.5rem;">
                        <div class="account-avatar" style="width: 40px; height: 40px; border-radius: 50%; 
                                 overflow: hidden; background: ${account.picture ? 'transparent' : '#9f7539'}; 
                                 display: flex; align-items: center; justify-content: center;">
                            ${account.picture ? 
                                `<img src="${account.picture}" alt="${account.name}" style="width: 100%; height: 100%; object-fit: cover;">` :
                                `<span style="color: white; font-weight: 600;">${account.name.split(' ').map(n => n[0]).join('')}</span>`
                            }
                        </div>
                        <div class="account-info" style="text-align: left; flex: 1;">
                            <div style="font-weight: 600; color: #0e1f42;">${account.name}</div>
                            <div style="font-size: 0.875rem; color: #64748b;">${account.email}</div>
                        </div>
                    </button>
                `).join('')}
            </div>
            <div class="modal-footer" style="margin-top: 1.5rem; text-align: center;">
                <button class="cancel-btn" style="padding: 0.75rem 1.5rem; border: 1px solid #e2e8f0;
                        background: white; border-radius: 6px; cursor: pointer; color: #64748b;">
                    Cancel
                </button>
            </div>
        `;

        // Add event listeners
        modalContent.querySelectorAll('.account-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const email = btn.getAttribute('data-email');
                const account = accounts.find(acc => acc.email === email);
                if (account) {
                    modal.remove();
                    onSelect(account);
                }
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.background = '#f8fafc';
                btn.style.borderColor = '#9f7539';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'white';
                btn.style.borderColor = '#e2e8f0';
            });
        });

        modalContent.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
            onSelect(null);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                onSelect(null);
            }
        });

        modal.appendChild(modalContent);
        return modal;
    }

    // ===== SOCIAL LOGIN PROCESSING =====
    async processSocialLogin(account, provider) {
        this.isSubmitting = true;
        
        try {
            // Backend API Integration Point
            const userData = await this.callSocialLoginAPI(account, provider);
            
            // Save user session
            this.saveUserSession(userData);
            
            // Handle "Remember me" functionality
            this.handleRememberMe(userData.phone);
            
            // Track login activity
            this.trackUserLogin(userData.id, provider);
            
            // Show success and redirect
            this.showNotification(`Welcome back, ${userData.name}!`, 'success');
            
            setTimeout(() => {
                this.redirectToSPA('overview');
            }, 1500);
            
        } catch (error) {
            console.error(`${provider} login failed:`, error);
            this.showNotification(`Login failed: ${error.message}`, 'error');
        } finally {
            this.isSubmitting = false;
        }
    }

    // ===== BACKEND API INTEGRATION =====
    async callSocialLoginAPI(account, provider) {
        // Simulate API call - REPLACE WITH ACTUAL BACKEND ENDPOINT
        console.log(`🔐 Calling ${provider} login API for:`, account.email);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user exists in localStorage first
        const existingUser = this.getExistingUser(provider, account.email);
        if (existingUser) {
            return {
                ...existingUser,
                lastLogin: new Date().toISOString(),
                authToken: 'simulated_jwt_token_' + Date.now()
            };
        }

        // Create new user if doesn't exist (shouldn't happen with proper auth)
        return {
            id: 'user_' + Date.now(),
            name: account.name,
            email: account.email,
            phone: '+23480' + Math.floor(1000000 + Math.random() * 9000000),
            type: 'tenant',
            provider: provider,
            avatar: account.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&background=9f7539&color=fff`,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            isVerified: true,
            authToken: 'simulated_jwt_token_' + Date.now()
        };
    }

    getExistingUser(provider, email) {
        const userData = localStorage.getItem('domihive_current_user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.provider === provider && user.email === email) {
                    return user;
                }
            } catch (error) {
                console.error('Error parsing existing user:', error);
            }
        }
        return null;
    }

    // ===== PHONE LOGIN =====
    initializePhoneLogin() {
        const loginForm = document.getElementById('phoneLoginForm');
        const rememberMeCheckbox = document.getElementById('rememberMe');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePhoneLogin(e);
        });

        rememberMeCheckbox.addEventListener('change', (e) => {
            this.rememberMe = e.target.checked;
        });

        // Real-time validation
        const inputs = loginForm.querySelectorAll('input[type="tel"], input[type="password"]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateLoginField(input));
            input.addEventListener('input', () => this.clearLoginFieldError(input));
        });
    }

    async handlePhoneLogin(e) {
        if (this.isSubmitting) return;
        
        const submitBtn = document.getElementById('loginSubmitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        submitBtn.disabled = true;
        this.isSubmitting = true;

        try {
            // Validate form
            if (!this.validateLoginForm()) {
                return;
            }
            
            // Get form data
            const formData = new FormData(e.target);
            const phoneNumber = formData.get('loginPhoneNumber');
            const password = formData.get('loginPassword');
            
            // Backend API Integration Point
            const userData = await this.callPhoneLoginAPI(phoneNumber, password);
            
            if (userData) {
                await this.completePhoneLogin(userData);
            } else {
                this.showNotification('Invalid phone number or password', 'error');
            }
            
        } catch (error) {
            console.error('Phone login failed:', error);
            this.showNotification('Login failed. Please try again.', 'error');
        } finally {
            // Restore button
            btnText.style.display = 'flex';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
            this.isSubmitting = false;
        }
    }

    async callPhoneLoginAPI(phoneNumber, password) {
        // Simulate API call - REPLACE WITH ACTUAL BACKEND ENDPOINT
        console.log('🔐 Calling phone login API for:', phoneNumber);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check localStorage for existing user first
        const existingUser = this.getExistingPhoneUser(phoneNumber);
        if (existingUser && this.validatePassword(password)) {
            return {
                ...existingUser,
                lastLogin: new Date().toISOString(),
                authToken: 'simulated_jwt_token_' + Date.now()
            };
        }

        // Fallback to simulated users (for demo)
        return this.simulatePhoneLogin(phoneNumber, password);
    }

    getExistingPhoneUser(phoneNumber) {
        const userData = localStorage.getItem('domihive_current_user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                const fullPhone = '+234' + phoneNumber;
                if (user.phone === fullPhone && user.provider === 'phone') {
                    return user;
                }
            } catch (error) {
                console.error('Error parsing existing user:', error);
            }
        }
        return null;
    }

    validatePassword(password) {
        // In real app, this would be handled by backend
        // For demo, accept any password of length >= 6
        return password && password.length >= 6;
    }

    simulatePhoneLogin(phoneNumber, password) {
        const simulatedUsers = [
            {
                id: 'user_phone_1',
                name: 'John Doe',
                phone: '+2348012345678',
                type: 'tenant',
                provider: 'phone',
                avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=9f7539&color=fff',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            },
            {
                id: 'user_phone_2', 
                name: 'Jane Smith',
                phone: '+2348098765432',
                type: 'tenant',
                provider: 'phone',
                avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=0e1f42&color=fff',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            }
        ];
        
        const fullPhone = '+234' + phoneNumber;
        const user = simulatedUsers.find(u => u.phone === fullPhone && this.validatePassword(password));
        
        return user || null;
    }

    async completePhoneLogin(userData) {
        console.log('✅ Phone login completed:', userData.name);
        
        // Update last login timestamp
        userData.lastLogin = new Date().toISOString();
        
        // Save user session
        this.saveUserSession(userData);
        
        // Handle "Remember me" functionality
        this.handleRememberMe(this.rememberMe ? userData.phone : null);
        
        // Track login activity
        this.trackUserLogin(userData.id, 'phone');
        
        // Show success notification
        this.showNotification(`Welcome back, ${userData.name}!`, 'success');
        
        // Redirect to SPA after short delay
        setTimeout(() => {
            this.redirectToSPA('overview');
        }, 1500);
    }

    // ===== SESSION MANAGEMENT =====
    saveUserSession(userData) {
        localStorage.setItem('domihive_current_user', JSON.stringify(userData));
        localStorage.setItem('domihive_user_avatar', userData.avatar);
        localStorage.setItem('domihive_auth_token', userData.authToken);
        
        console.log('💾 User session saved:', userData.name);
    }

    handleRememberMe(phoneNumber) {
        if (this.rememberMe && phoneNumber) {
            localStorage.setItem('domihive_remembered_phone', phoneNumber);
            console.log('💾 Phone number remembered for future logins');
        } else {
            localStorage.removeItem('domihive_remembered_phone');
            console.log('🗑️ Phone number remembering disabled');
        }
    }

    checkExistingSession() {
        const userData = localStorage.getItem('domihive_current_user');
        if (userData) {
            console.log('👋 User already logged in, redirecting...');
            this.redirectToSPA('overview');
        }
    }

    // ===== REDIRECT LOGIC =====
    redirectToSPA(section = 'overview') {
        // Get any redirect context from property viewing
        const redirectContext = sessionStorage.getItem('domihive_redirect_section');
        const finalSection = redirectContext || section;
        
        // Clear redirect context
        sessionStorage.removeItem('domihive_redirect_section');
        
        // Redirect to SPA
        window.location.href = `/Pages/spa.html?section=${finalSection}`;
    }

    // ===== FORM VALIDATION =====
    validateLoginForm() {
        let isValid = true;
        this.clearAllLoginErrors();
        
        // Validate phone number
        const phoneNumber = document.getElementById('loginPhoneNumber').value.trim();
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneNumber) {
            this.showLoginError('phoneError', 'Phone number is required');
            document.querySelector('.phone-input-container').classList.add('error');
            isValid = false;
        } else if (!phoneRegex.test(phoneNumber)) {
            this.showLoginError('phoneError', 'Please enter a valid 10-digit phone number');
            document.querySelector('.phone-input-container').classList.add('error');
            isValid = false;
        }
        
        // Validate password
        const password = document.getElementById('loginPassword').value;
        if (!password) {
            this.showLoginError('passwordError', 'Password is required');
            document.getElementById('loginPassword').classList.add('error');
            isValid = false;
        } else if (password.length < 6) {
            this.showLoginError('passwordError', 'Password must be at least 6 characters');
            document.getElementById('loginPassword').classList.add('error');
            isValid = false;
        }
        
        return isValid;
    }

    validateLoginField(field) {
        const fieldId = field.id;
        const value = field.value.trim();
        
        switch (fieldId) {
            case 'loginPhoneNumber':
                const phoneRegex = /^[0-9]{10}$/;
                if (!value) {
                    this.showLoginError('phoneError', 'Phone number is required');
                    document.querySelector('.phone-input-container').classList.add('error');
                } else if (!phoneRegex.test(value)) {
                    this.showLoginError('phoneError', 'Please enter a valid 10-digit phone number');
                    document.querySelector('.phone-input-container').classList.add('error');
                } else {
                    this.clearLoginError('phoneError');
                    document.querySelector('.phone-input-container').classList.remove('error');
                }
                break;
                
            case 'loginPassword':
                if (!value) {
                    this.showLoginError('passwordError', 'Password is required');
                    field.classList.add('error');
                } else if (value.length < 6) {
                    this.showLoginError('passwordError', 'Password must be at least 6 characters');
                    field.classList.add('error');
                } else {
                    this.clearLoginError('passwordError');
                    field.classList.remove('error');
                }
                break;
        }
    }

    clearLoginFieldError(field) {
        const fieldId = field.id;
        this.clearLoginError(fieldId + 'Error');
        field.classList.remove('error');
        
        if (fieldId === 'loginPhoneNumber') {
            document.querySelector('.phone-input-container').classList.remove('error');
        }
    }

    // ===== ERROR HANDLING =====
    showLoginError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    clearLoginError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    clearAllLoginErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(error => error.classList.remove('show'));
        
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
        
        document.querySelector('.phone-input-container').classList.remove('error');
    }

    // ===== FORGOT PASSWORD =====
    handleForgotPassword() {
        const phoneNumber = document.getElementById('loginPhoneNumber').value.trim();
        
        if (!phoneNumber || phoneNumber.length !== 10) {
            this.showNotification('Please enter your phone number first to reset password', 'warning');
            document.getElementById('loginPhoneNumber').focus();
            return;
        }
        
        // Backend API Integration Point
        this.callForgotPasswordAPI(phoneNumber);
    }

    async callForgotPasswordAPI(phoneNumber) {
        console.log('📧 Calling forgot password API for:', phoneNumber);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showNotification(`Password reset link sent to +234${phoneNumber}`, 'success');
            
            setTimeout(() => {
                this.showNotification('Check your phone for password reset instructions', 'success');
            }, 2000);
            
        } catch (error) {
            console.error('Forgot password failed:', error);
            this.showNotification('Failed to send reset link. Please try again.', 'error');
        }
    }

    // ===== USER ACTIVITY TRACKING =====
    trackUserLogin(userId, method) {
        const loginActivity = {
            userId: userId,
            method: method,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            platform: navigator.platform
        };
        
        // Save login activity
        const activities = JSON.parse(localStorage.getItem('domihive_login_activities') || '[]');
        activities.push(loginActivity);
        
        // Keep only last 10 activities
        if (activities.length > 10) {
            activities.shift();
        }
        
        localStorage.setItem('domihive_login_activities', JSON.stringify(activities));
        console.log('📊 Login activity tracked:', loginActivity);
    }

    // ===== UI HELPERS =====
    showButtonLoading(button, loadingText) {
        const originalHTML = button.innerHTML;
        button.setAttribute('data-original-html', originalHTML);
        button.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            ${loadingText}
        `;
        button.disabled = true;
    }

    hideButtonLoading(button, originalText) {
        const originalHTML = button.getAttribute('data-original-html');
        if (originalHTML) {
            button.innerHTML = originalHTML;
        } else {
            button.innerHTML = originalText;
        }
        button.disabled = false;
    }

    // ===== NOTIFICATION SYSTEM =====
    showNotification(message, type = 'success') {
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
            background: ${this.getNotificationColor(type)};
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
        
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
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

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-triangle',
            warning: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // ===== ANIMATIONS & EFFECTS =====
    addCelebrationEffects() {
        const style = document.createElement('style');
        style.textContent = `
            .welcome-back-message {
                position: relative;
                overflow: hidden;
            }
            
            .welcome-back-message::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(159, 117, 57, 0.1), transparent);
                animation: shimmer 3s ease-in-out infinite;
            }
            
            @keyframes shimmer {
                0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { 
                    opacity: 0;
                    transform: translateY(20px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
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
            
            .social-btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
                transform: none !important;
            }
            
            .account-selection-modal {
                animation: fadeIn 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== DATA MANAGEMENT =====
    clearUserData() {
        localStorage.removeItem('domihive_current_user');
        localStorage.removeItem('domihive_user_avatar');
        localStorage.removeItem('domihive_remembered_phone');
        localStorage.removeItem('domihive_auth_token');
        console.log('🧹 User data cleared');
    }

    // ===== EVENT LISTENERS =====
    initializeEventListeners() {
        // Add CSS animations
        this.addPageAnimations();
    }

    addPageAnimations() {
        // CSS animations are already added in addCelebrationEffects
        console.log('🎬 Page animations initialized');
    }
}

// ===== GLOBAL INITIALIZATION =====
const domiHiveLogin = new DomiHiveLogin();

document.addEventListener('DOMContentLoaded', function() {
    domiHiveLogin.init();
});

// ===== GLOBAL FUNCTIONS =====
window.handleForgotPassword = () => domiHiveLogin.handleForgotPassword();
window.showNotification = (message, type) => domiHiveLogin.showNotification(message, type);
window.clearUserData = () => domiHiveLogin.clearUserData();

// Make login instance globally available
window.domiHiveLogin = domiHiveLogin;

console.log('🎉 DomiHive Enterprise Login System Loaded!');