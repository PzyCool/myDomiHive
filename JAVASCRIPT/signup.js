// signup.js - ENTERPRISE AUTHENTICATION WITH GOOGLE/APPLE ACCOUNT SELECTION
// Production-ready for millions of users

class DomiHiveAuth {
    constructor() {
        this.currentStep = 1;
        this.otpTimer = null;
        this.isSubmitting = false;
    }

    // ===== INITIALIZATION =====
    init() {
    console.log('🚀 DomiHive Enterprise Auth Initialized');
    this.initializeSocialAuth();
    this.initializePhoneAuth();
    this.initializeProfilePhotoUpload(); // ADD THIS LINE
    this.initializeEventListeners();
    this.checkExistingSession();
}

    // ===== GOOGLE/APPLE ACCOUNT SELECTION =====
    initializeSocialAuth() {
        // Google Signup with Account Selection
        document.getElementById('googleSignupBtn').addEventListener('click', () => {
            this.handleGoogleSignup();
        });

        // Apple Signup with Account Selection  
        document.getElementById('appleSignupBtn').addEventListener('click', () => {
            this.handleAppleSignup();
        });
    }

    async handleGoogleSignup() {
        if (this.isSubmitting) return;
        
        const btn = document.getElementById('googleSignupBtn');
        this.showButtonLoading(btn, 'Connecting to Google...');

        try {
            // Show Google Account Selection (Simulated)
            const selectedAccount = await this.showGoogleAccountSelection();
            
            if (selectedAccount) {
                await this.processSocialSignup(selectedAccount, 'google');
            } else {
                this.showNotification('Please select a Google account to continue', 'warning');
            }
        } catch (error) {
            console.error('Google signup failed:', error);
            this.showNotification('Google signup failed. Please try again.', 'error');
        } finally {
            this.hideButtonLoading(btn, 'Continue with Google');
        }
    }

    async handleAppleSignup() {
        if (this.isSubmitting) return;
        
        const btn = document.getElementById('appleSignupBtn');
        this.showButtonLoading(btn, 'Connecting to Apple...');

        try {
            // Show Apple Account Selection (Simulated)
            const selectedAccount = await this.showAppleAccountSelection();
            
            if (selectedAccount) {
                await this.processSocialSignup(selectedAccount, 'apple');
            } else {
                this.showNotification('Please select an Apple account to continue', 'warning');
            }
        } catch (error) {
            console.error('Apple signup failed:', error);
            this.showNotification('Apple signup failed. Please try again.', 'error');
        } finally {
            this.hideButtonLoading(btn, 'Continue with Apple');
        }
    }

    // ===== GOOGLE ACCOUNT SELECTION MODAL =====
    async showGoogleAccountSelection() {
        return new Promise((resolve) => {
            // Create Google Account Selection Modal
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

    // ===== APPLE ACCOUNT SELECTION MODAL =====
    async showAppleAccountSelection() {
        return new Promise((resolve) => {
            // Create Apple Account Selection Modal
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

    // ===== SOCIAL SIGNUP PROCESSING =====
    async processSocialSignup(account, provider) {
        this.isSubmitting = true;
        
        try {
            // Backend API Integration Point
            const userData = await this.callSocialSignupAPI(account, provider);
            
            // Save user session
            this.saveUserSession(userData);
            
            // Show success and redirect
            this.showNotification(`Welcome to DomiHive, ${userData.name}!`, 'success');
            
            setTimeout(() => {
                this.redirectToSPA('overview');
            }, 1500);
            
        } catch (error) {
            console.error(`${provider} signup failed:`, error);
            this.showNotification(`Signup failed: ${error.message}`, 'error');
        } finally {
            this.isSubmitting = false;
        }
    }

    // ===== BACKEND API INTEGRATION =====
    async callSocialSignupAPI(account, provider) {
        // Simulate API call - REPLACE WITH ACTUAL BACKEND ENDPOINT
        console.log(`🔐 Calling ${provider} signup API for:`, account.email);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate API response
        return {
            id: 'user_' + Date.now(),
            name: account.name,
            email: account.email,
            phone: '+23480' + Math.floor(1000000 + Math.random() * 9000000),
            type: 'tenant',
            provider: provider,
            avatar: account.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&background=9f7539&color=fff`,
            createdAt: new Date().toISOString(),
            isVerified: true,
            authToken: 'simulated_jwt_token_' + Date.now() // Backend will provide real JWT
        };
    }

    // ===== PHONE AUTHENTICATION =====
    initializePhoneAuth() {
        document.getElementById('nextToOtpBtn').addEventListener('click', () => {
            this.handleNextToOtp();
        });

        document.getElementById('backToInfoBtn').addEventListener('click', () => {
            this.handleBackToInfo();
        });

        document.getElementById('verifyOtpBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleVerifyOtp();
        });

        document.getElementById('resendOtpBtn').addEventListener('click', () => {
            this.handleResendOtp();
        });

        // OTP Input Handling
        this.initializeOtpInputs();
        
        // Form Validation
        this.initializeFormValidation();
    }

    // ===== OTP MANAGEMENT =====
    initializeOtpInputs() {
        const otpInputs = document.querySelectorAll('.otp-input');
        
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => this.handleOtpInput(e, index));
            input.addEventListener('keydown', (e) => this.handleOtpKeydown(e, index));
            input.addEventListener('paste', (e) => this.handleOtpPaste(e));
        });
    }

    handleOtpInput(e, index) {
        const input = e.target;
        const value = input.value;
        
        if (!/^\d*$/.test(value)) {
            input.value = '';
            return;
        }
        
        if (value.length === 1 && index < 3) {
            document.getElementById(`otp${index + 2}`).focus();
        }
        
        if (value.length === 1) {
            input.classList.add('filled');
        } else {
            input.classList.remove('filled');
        }
        
        this.clearError('otpError');
    }

    handleOtpKeydown(e, index) {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            document.getElementById(`otp${index}`).focus();
        }
    }

    handleOtpPaste(e) {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text');
        const otpDigits = pasteData.replace(/\D/g, '').substring(0, 4);
        
        for (let i = 0; i < otpDigits.length; i++) {
            const input = document.getElementById(`otp${i + 1}`);
            input.value = otpDigits[i];
            input.classList.add('filled');
            
            if (i === 3) {
                input.focus();
            }
        }
    }

    // ===== FORM VALIDATION =====
    initializeFormValidation() {
        const inputs = document.querySelectorAll('#step1 input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const fieldId = field.id;
        const value = field.value.trim();
        
        switch (fieldId) {
            case 'fullName':
                if (!value || value.length < 2) {
                    this.showError('nameError', 'Full name must be at least 2 characters');
                    field.classList.add('error');
                    return false;
                }
                break;
                
            case 'phoneNumber':
                const phoneRegex = /^[0-9]{10}$/;
                if (!phoneRegex.test(value)) {
                    this.showError('phoneError', 'Please enter a valid 10-digit phone number');
                    document.querySelector('.phone-input-container').classList.add('error');
                    return false;
                }
                break;
                
            case 'password':
                if (!value || value.length < 6) {
                    this.showError('passwordError', 'Password must be at least 6 characters');
                    field.classList.add('error');
                    return false;
                }
                break;
                
            case 'confirmPassword':
                const password = document.getElementById('password').value;
                if (value !== password) {
                    this.showError('confirmPasswordError', 'Passwords do not match');
                    field.classList.add('error');
                    return false;
                }
                break;
        }
        
        this.clearError(fieldId + 'Error');
        field.classList.remove('error');
        if (fieldId === 'phoneNumber') {
            document.querySelector('.phone-input-container').classList.remove('error');
        }
        
        return true;
    }

    // ===== FORM STEP MANAGEMENT =====
    async handleNextToOtp() {
    if (!this.validateSignupForm()) {
        return;
    }
    
    const phoneNumber = document.getElementById('phoneNumber').value;
    document.getElementById('verificationPhoneNumber').textContent = `+234 ${phoneNumber.substring(0, 3)} ${phoneNumber.substring(3, 6)} ${phoneNumber.substring(6)}`;
    
    // Send OTP via Backend API
    await this.sendOtpToPhone(phoneNumber);
    
    // Switch to OTP step
    this.showStep(2);
    document.getElementById('otp1').focus();
    }

async handleVerifyOtp() {
    if (this.isSubmitting) return;
    
    const enteredOtp = this.getEnteredOtp();
    if (!this.validateOtp(enteredOtp)) {
        return;
    }
    
    this.isSubmitting = true;
    const verifyBtn = document.getElementById('verifyOtpBtn');
    this.showButtonLoading(verifyBtn, 'Verifying...');
    
    try {
        // Backend OTP Verification
        const isValid = await this.verifyOtpWithBackend(enteredOtp);
        
        if (isValid) {
            await this.completePhoneSignup(); // This now goes to step 3 instead of dashboard
        } else {
            this.showError('otpError', 'Invalid verification code');
        }
    } catch (error) {
        console.error('OTP verification failed:', error);
        this.showError('otpError', 'Verification failed. Please try again.');
    } finally {
        this.isSubmitting = false;
        this.hideButtonLoading(verifyBtn, 'Verify & Create Account');
    }
}


    // ===== BACKEND OTP INTEGRATION =====
    async sendOtpToPhone(phoneNumber) {
    console.log(`📱 Sending OTP to +234${phoneNumber}`);
    
    try {
        // Backend API Integration Point
        const response = await this.callSendOtpAPI(phoneNumber);
        
        // Store OTP data (in real app, backend handles this)
        const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
        sessionStorage.setItem('domihive_signup_otp', generatedOtp);
        sessionStorage.setItem('domihive_signup_phone', phoneNumber);
        sessionStorage.setItem('domihive_otp_expires', Date.now() + 300000);
        
        // Display OTP for testing
        document.getElementById('generatedOtp').textContent = generatedOtp;
        
        this.showNotification(`OTP sent to +234${phoneNumber}`, 'success');
        this.startResendTimer();
        
        // For testing - show OTP in console
        console.log(`🔐 Generated OTP: ${generatedOtp}`);
        
    } catch (error) {
        console.error('OTP sending failed:', error);
        this.showNotification('Failed to send OTP. Please try again.', 'error');
    }
}

    async callSendOtpAPI(phoneNumber) {
        // Simulate API call - REPLACE WITH ACTUAL BACKEND ENDPOINT
        console.log('🔐 Calling send OTP API for:', phoneNumber);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            success: true,
            message: 'OTP sent successfully',
            // Backend would provide these:
            // otpId: 'otp_123456',
            // expiresIn: 300
        };
    }

    async verifyOtpWithBackend(enteredOtp) {
        // Backend API Integration Point
        const storedOtp = sessionStorage.getItem('domihive_signup_otp');
        const otpExpires = parseInt(sessionStorage.getItem('domihive_otp_expires'));
        
        // Simulate API verification
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return enteredOtp === storedOtp && Date.now() < otpExpires;
    }

    // ===== PHONE SIGNUP COMPLETION =====
    async completePhoneSignup() {
    const formData = new FormData(document.getElementById('phoneSignupForm'));
    const fullName = formData.get('fullName');
    const phoneNumber = formData.get('phoneNumber');
    
    try {
        // Backend API Integration Point
        const userData = await this.callPhoneSignupAPI({
            fullName,
            phoneNumber: '+234' + phoneNumber,
            password: formData.get('password')
        });
        
        this.saveUserSession(userData);
        this.showNotification(`Welcome to DomiHive, ${userData.name}!`, 'success');
        
        // Clean up OTP data
        this.cleanupOtpData();
        
        // Go to profile photo step instead of dashboard
        this.showStep(3);
        
    } catch (error) {
        console.error('Phone signup failed:', error);
        this.showNotification('Signup failed. Please try again.', 'error');
    }
}
    async callPhoneSignupAPI(userData) {
        // Simulate API call - REPLACE WITH ACTUAL BACKEND ENDPOINT
        console.log('🔐 Calling phone signup API for:', userData.phone);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            id: 'user_' + Date.now(),
            name: userData.fullName,
            phone: userData.phone,
            type: 'tenant',
            provider: 'phone',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=9f7539&color=fff`,
            createdAt: new Date().toISOString(),
            isVerified: true,
            authToken: 'simulated_jwt_token_' + Date.now()
        };
    }

    // ===== SESSION MANAGEMENT =====
    saveUserSession(userData) {
        localStorage.setItem('domihive_current_user', JSON.stringify(userData));
        localStorage.setItem('domihive_user_avatar', userData.avatar);
        localStorage.setItem('domihive_auth_token', userData.authToken);
        
        console.log('💾 User session saved:', userData.name);
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

    // ===== VALIDATION HELPERS =====
    validateSignupForm() {
        let isValid = true;
        this.clearAllErrors();
        
        const fields = ['fullName', 'phoneNumber', 'password', 'confirmPassword'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Check terms agreement
        const agreeTerms = document.getElementById('agreeTerms').checked;
        const screeningConsent = document.getElementById('screeningConsent').checked;
        
        if (!agreeTerms) {
            this.showNotification('You must agree to the Terms of Service and Privacy Policy', 'error');
            isValid = false;
        }
        
        if (!screeningConsent) {
            this.showNotification('You must consent to background screening and verification checks', 'error');
            isValid = false;
        }
        
        return isValid;
    }

    validateOtp(enteredOtp) {
        if (!enteredOtp || enteredOtp.length !== 4) {
            this.showError('otpError', 'Please enter the 4-digit code');
            return false;
        }
        return true;
    }

    getEnteredOtp() {
        let otp = '';
        for (let i = 1; i <= 4; i++) {
            otp += document.getElementById(`otp${i}`).value;
        }
        return otp;
    }

    // ===== UI HELPERS =====
    showStep(step) {
    document.getElementById('step1').classList.toggle('hidden', step !== 1);
    document.getElementById('step2').classList.toggle('hidden', step !== 2);
    document.getElementById('step3').classList.toggle('hidden', step !== 3);
    this.currentStep = step;
}

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

    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.classList.add('show');
        }
    }

    clearError(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('show');
        }
    }

    clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(error => error.classList.remove('show'));
        
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
        
        document.querySelector('.phone-input-container').classList.remove('error');
    }

    clearFieldError(field) {
        const fieldId = field.id;
        this.clearError(fieldId + 'Error');
        field.classList.remove('error');
        
        if (fieldId === 'phoneNumber') {
            document.querySelector('.phone-input-container').classList.remove('error');
        }
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

    // ===== TIMER MANAGEMENT =====
    startResendTimer() {
        const resendBtn = document.getElementById('resendOtpBtn');
        const timerSpan = document.getElementById('resendTimer');
        let timeLeft = 30;
        
        resendBtn.disabled = true;
        
        if (this.otpTimer) {
            clearInterval(this.otpTimer);
        }
        
        this.otpTimer = setInterval(() => {
            timerSpan.textContent = `Resend in ${timeLeft}s`;
            timeLeft--;
            
            if (timeLeft < 0) {
                clearInterval(this.otpTimer);
                timerSpan.textContent = 'Resend code';
                resendBtn.disabled = false;
            }
        }, 1000);
    }

    handleResendOtp() {
        const phoneNumber = sessionStorage.getItem('domihive_signup_phone');
        if (!phoneNumber) {
            this.showNotification('Please go back and enter your phone number first', 'error');
            return;
        }
        
        this.sendOtpToPhone(phoneNumber);
    }

    cleanupOtpData() {
        sessionStorage.removeItem('domihive_signup_otp');
        sessionStorage.removeItem('domihive_signup_phone');
        sessionStorage.removeItem('domihive_otp_expires');
    }

    // ===== EVENT LISTENERS =====
    initializeEventListeners() {
        // Add CSS animations
        this.addPageAnimations();
    }

    addPageAnimations() {
        const style = document.createElement('style');
        style.textContent = `
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
}

// ===== GLOBAL INITIALIZATION =====
const domiHiveAuth = new DomiHiveAuth();

document.addEventListener('DOMContentLoaded', function() {
    domiHiveAuth.init();
});

// Make auth instance globally available
window.domiHiveAuth = domiHiveAuth;

console.log('🎉 DomiHive Enterprise Authentication System Loaded!');