// application-payment.js - Complete Payment Logic
document.addEventListener('DOMContentLoaded', function() {
    console.log('💳 Initializing Payment Page (Step 3)...');
    
    // Initialize the payment page
    initializePaymentPage();
});

// Global variables
let currentApplication = null;
let selectedPaymentMethod = null;
let uploadedReceipt = null;

function initializePaymentPage() {
    console.log('💰 Initializing Payment Process...');
    
    // Load application data from Steps 1 & 2
    loadApplicationData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize payment method selection
    initializePaymentMethods();
    
    // Update payment details
    updatePaymentDetails();
    
    console.log('✅ Payment page initialized');
}

function loadApplicationData() {
    try {
        // Get application data from sessionStorage (set in Step 2)
        const applicationData = sessionStorage.getItem('current_rental_application');
        
        if (applicationData) {
            currentApplication = JSON.parse(applicationData);
            console.log('📄 Application data loaded:', currentApplication);
            
            // Update UI with application data
            updateApplicationDisplay();
            
            // Update hidden fields
            document.getElementById('applicationData').value = JSON.stringify(currentApplication);
            
        } else {
            console.error('❌ No application data found');
            showNotification('Error: Application data not found. Please start from Step 1.', 'error');
            
            // Redirect back to application page after delay
            setTimeout(() => {
                redirectToApplication();
            }, 3000);
            return;
        }
        
    } catch (error) {
        console.error('Error loading application data:', error);
        showNotification('Error loading application data', 'error');
    }
}

function updateApplicationDisplay() {
    if (!currentApplication) return;
    
    // Update applicant details
    document.getElementById('applicantName').textContent = currentApplication.personalInfo.fullName;
    document.getElementById('applicationId').textContent = currentApplication.applicationId;
    document.getElementById('propertyTitle').textContent = currentApplication.propertyTitle;
    document.getElementById('propertyLocation').textContent = currentApplication.propertyLocation;
    
    // Update context type
    const contextElement = document.getElementById('paymentContextType');
    if (contextElement) {
        contextElement.textContent = 'Rental Application';
    }
    
    // Generate unique payment reference
    const paymentReference = `DOMI-${currentApplication.applicationId}-${Date.now().toString().slice(-6)}`;
    document.getElementById('paymentReference').textContent = paymentReference;
}

function updatePaymentDetails() {
    // Update bank amount
    document.getElementById('bankAmount').textContent = '₦22,500';
    
    // Update all payment method amounts if needed
    console.log('💰 Payment details updated');
}

function initializeEventListeners() {
    // Form submission
    document.getElementById('paymentForm').addEventListener('submit', handlePaymentSubmission);
    
    // Back buttons
    document.getElementById('backToDocuments').addEventListener('click', redirectToDocuments);
    document.getElementById('backToDocumentsBtn').addEventListener('click', redirectToDocuments);
    
    // Modal buttons
    document.getElementById('closeModalBtn').addEventListener('click', closeSuccessModal);
    document.getElementById('downloadReceiptBtn').addEventListener('click', downloadReceipt);
    document.getElementById('goToDashboardBtn').addEventListener('click', redirectToDashboard);
    
    // Terms checkboxes validation
    document.getElementById('agreeEscrowTerms').addEventListener('change', validateForm);
    document.getElementById('agreeRefundPolicy').addEventListener('change', validateForm);
    document.getElementById('agreePrivacyPolicy').addEventListener('change', validateForm);
    
    // Card input formatting
    document.getElementById('cardNumber').addEventListener('input', formatCardNumber);
    document.getElementById('expiryDate').addEventListener('input', formatExpiryDate);
    document.getElementById('cvv').addEventListener('input', formatCVV);
    
    // Bank receipt upload
    document.getElementById('bankReceipt').addEventListener('change', handleReceiptUpload);
    
    // Close modal on background click
    document.getElementById('successModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeSuccessModal();
        }
    });
}

function initializePaymentMethods() {
    const paymentMethodCards = document.querySelectorAll('.payment-method-card');
    
    paymentMethodCards.forEach(card => {
        card.addEventListener('click', function() {
            selectPaymentMethod(this);
        });
    });
    
    // Select card payment by default
    const defaultMethod = document.querySelector('.payment-method-card[data-method="card"]');
    if (defaultMethod) {
        selectPaymentMethod(defaultMethod);
    }
}

function selectPaymentMethod(card) {
    const method = card.getAttribute('data-method');
    console.log('💳 Payment method selected:', method);
    
    // Remove selected class from all cards
    document.querySelectorAll('.payment-method-card').forEach(c => {
        c.classList.remove('selected');
    });
    
    // Add selected class to clicked card
    card.classList.add('selected');
    
    // Store selected method
    selectedPaymentMethod = method;
    
    // Show/hide payment details
    showPaymentDetails(method);
    
    // Validate form
    validateForm();
}

function showPaymentDetails(method) {
    // Hide all payment details
    document.querySelectorAll('.payment-details').forEach(detail => {
        detail.style.display = 'none';
        detail.classList.remove('active');
    });
    
    // Show selected payment details
    const detailsElement = document.getElementById(`${method}Details`);
    if (detailsElement) {
        detailsElement.style.display = 'block';
        detailsElement.classList.add('active');
    }
    
    console.log('📋 Showing payment details for:', method);
}

// Card Input Formatting Functions
function formatCardNumber(event) {
    let input = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedInput = '';
    
    for (let i = 0; i < input.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedInput += ' ';
        }
        formattedInput += input[i];
    }
    
    event.target.value = formattedInput;
    
    // Validate card type
    validateCardType(input);
}

function validateCardType(cardNumber) {
    const cardIcons = document.querySelectorAll('.card-icons i');
    cardIcons.forEach(icon => icon.style.opacity = '0.3');
    
    // Visa
    if (/^4/.test(cardNumber)) {
        document.querySelector('.fa-cc-visa').style.opacity = '1';
    }
    // Mastercard
    else if (/^5[1-5]/.test(cardNumber)) {
        document.querySelector('.fa-cc-mastercard').style.opacity = '1';
    }
    // Amex
    else if (/^3[47]/.test(cardNumber)) {
        document.querySelector('.fa-cc-amex').style.opacity = '1';
    }
}

function formatExpiryDate(event) {
    let input = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (input.length >= 2) {
        input = input.substring(0, 2) + '/' + input.substring(2, 4);
    }
    
    event.target.value = input;
    
    // Validate expiry date
    if (input.length === 5) {
        validateExpiryDate(input);
    }
}

function validateExpiryDate(expiryDate) {
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) {
        showFieldError(document.getElementById('expiryDate'), 'Invalid month');
        return false;
    }
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        showFieldError(document.getElementById('expiryDate'), 'Card has expired');
        return false;
    }
    
    clearFieldError(document.getElementById('expiryDate'));
    return true;
}

function formatCVV(event) {
    let input = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    event.target.value = input.substring(0, 4);
}

function handleReceiptUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Validate file
    const validation = validateReceiptFile(file);
    if (!validation.isValid) {
        showNotification(validation.message, 'error');
        event.target.value = '';
        return;
    }
    
    uploadedReceipt = file;
    console.log('📄 Receipt uploaded:', file.name);
    showNotification('Receipt uploaded successfully', 'success');
    
    validateForm();
}

function validateReceiptFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    // Check file size
    if (file.size > maxSize) {
        return { isValid: false, message: 'File size must be less than 5MB' };
    }
    
    // Check file type
    if (!allowedTypes.includes(fileExtension)) {
        return { 
            isValid: false, 
            message: `File type not allowed. Accepted types: ${allowedTypes.join(', ')}` 
        };
    }
    
    return { isValid: true, message: 'File is valid' };
}

// Form Validation and Submission
function validateForm() {
    let isValid = true;
    
    // Clear previous errors
    clearValidationErrors();
    
    // Validate payment method selection
    if (!selectedPaymentMethod) {
        showNotification('Please select a payment method', 'error');
        isValid = false;
    }
    
    // Validate terms agreements
    const requiredCheckboxes = [
        'agreeEscrowTerms',
        'agreeRefundPolicy', 
        'agreePrivacyPolicy'
    ];
    
    requiredCheckboxes.forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        if (!checkbox.checked) {
            showFieldError(checkbox, 'This agreement is required');
            isValid = false;
        }
    });
    
    // Validate payment method specific fields
    if (selectedPaymentMethod === 'card') {
        isValid = validateCardPayment() && isValid;
    } else if (selectedPaymentMethod === 'bank') {
        isValid = validateBankTransfer() && isValid;
    }
    
    // Update submit button state
    const submitBtn = document.getElementById('submitPaymentBtn');
    if (isValid) {
        submitBtn.disabled = false;
        console.log('✅ Form validation passed');
    } else {
        submitBtn.disabled = true;
        console.log('❌ Form validation failed');
    }
    
    return isValid;
}

function validateCardPayment() {
    let isValid = true;
    
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s+/g, '');
    const cardHolder = document.getElementById('cardHolder').value.trim();
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    
    // Validate card number (basic Luhn check)
    if (!cardNumber || cardNumber.length < 16) {
        showFieldError(document.getElementById('cardNumber'), 'Valid card number is required');
        isValid = false;
    } else if (!luhnCheck(cardNumber)) {
        showFieldError(document.getElementById('cardNumber'), 'Invalid card number');
        isValid = false;
    }
    
    // Validate card holder
    if (!cardHolder) {
        showFieldError(document.getElementById('cardHolder'), 'Card holder name is required');
        isValid = false;
    }
    
    // Validate expiry date
    if (!expiryDate || expiryDate.length !== 5) {
        showFieldError(document.getElementById('expiryDate'), 'Valid expiry date is required');
        isValid = false;
    } else if (!validateExpiryDate(expiryDate)) {
        isValid = false;
    }
    
    // Validate CVV
    if (!cvv || cvv.length < 3) {
        showFieldError(document.getElementById('cvv'), 'Valid CVV is required');
        isValid = false;
    }
    
    return isValid;
}

function luhnCheck(cardNumber) {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

function validateBankTransfer() {
    let isValid = true;
    
    // Validate receipt upload for bank transfer
    if (!uploadedReceipt) {
        showFieldError(document.getElementById('bankReceipt'), 'Receipt upload is required for bank transfer');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(field, message) {
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearValidationErrors() {
    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(error => error.remove());
}

function handlePaymentSubmission(event) {
    event.preventDefault();
    console.log('💳 Payment form submission started...');
    
    if (validateForm()) {
        processPayment();
    }
}

function processPayment() {
    console.log('🔄 Processing payment...');
    
    // Show processing modal
    const processingModal = document.getElementById('processingModal');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const processingSteps = document.querySelectorAll('.processing-step');
    
    processingModal.classList.add('active');
    
    // Simulate payment processing
    let progress = 0;
    const steps = [
        { progress: 25, text: 'Validating payment details...', step: 0 },
        { progress: 50, text: 'Processing transaction...', step: 1 },
        { progress: 75, text: 'Securing funds in escrow...', step: 2 },
        { progress: 100, text: 'Finalizing application...', step: 3 }
    ];
    
    let currentStep = 0;
    
    const processInterval = setInterval(() => {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            progress = step.progress;
            progressFill.style.width = progress + '%';
            progressText.textContent = step.text;
            
            // Update step status
            processingSteps.forEach((stepElement, index) => {
                if (index <= step.step) {
                    stepElement.classList.add('active');
                } else {
                    stepElement.classList.remove('active');
                }
            });
            
            currentStep++;
        } else {
            clearInterval(processInterval);
            completePayment();
        }
    }, 1000);
}

function completePayment() {
    console.log('✅ Payment completed');
    
    // Generate transaction details
    const transactionId = 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    const paidAmount = '₦22,500';
    
    // Save payment data
    savePaymentData(transactionId);
    
    // Show success modal after delay
    setTimeout(() => {
        const processingModal = document.getElementById('processingModal');
        processingModal.classList.remove('active');
        
        showSuccessModal(transactionId, paidAmount);
        
        console.log('🎉 Payment process completed');
    }, 1000);
}

function savePaymentData(transactionId) {
    const paymentData = {
        applicationId: currentApplication.applicationId,
        transactionId: transactionId,
        paymentMethod: selectedPaymentMethod,
        amount: 22500,
        paymentDate: new Date().toISOString(),
        status: 'completed',
        escrowStatus: 'funds_held'
    };
    
    // Update application data with payment info
    currentApplication.payment = paymentData;
    currentApplication.currentStep = 'payment_completed';
    currentApplication.status = 'under_review';
    
    // Save to sessionStorage
    sessionStorage.setItem('current_rental_application', JSON.stringify(currentApplication));
    
    // Save to localStorage for persistence
    let applications = JSON.parse(localStorage.getItem('domihive_rental_applications')) || [];
    const appIndex = applications.findIndex(app => app.applicationId === currentApplication.applicationId);
    
    if (appIndex !== -1) {
        applications[appIndex] = currentApplication;
    } else {
        applications.push(currentApplication);
    }
    
    localStorage.setItem('domihive_rental_applications', JSON.stringify(applications));
    
    // Create payment notification
    createPaymentNotification(transactionId);
    
    console.log('💾 Payment data saved:', paymentData);
}

function showSuccessModal(transactionId, paidAmount) {
    // Update modal content
    document.getElementById('transactionId').textContent = transactionId;
    document.getElementById('paidAmount').textContent = paidAmount;
    document.getElementById('paymentMethod').textContent = formatPaymentMethod(selectedPaymentMethod);
    
    // Show modal
    const successModal = document.getElementById('successModal');
    successModal.classList.add('active');
    
    showNotification('Payment completed successfully! Your application is now under review.', 'success');
}

function formatPaymentMethod(method) {
    const methodNames = {
        'card': 'Credit/Debit Card',
        'bank': 'Bank Transfer',
        'flutterwave': 'Flutterwave',
        'paystack': 'Paystack'
    };
    
    return methodNames[method] || method;
}

function createPaymentNotification(transactionId) {
    const notifications = JSON.parse(localStorage.getItem('domihive_notifications')) || [];
    
    const notification = {
        id: 'notif_' + Date.now(),
        type: 'payment_completed',
        title: 'Payment Completed Successfully',
        message: `Your payment of ₦22,500 for ${currentApplication.propertyTitle} has been processed. Transaction ID: ${transactionId}`,
        timestamp: new Date().toISOString(),
        read: false,
        applicationId: currentApplication.applicationId,
        transactionId: transactionId,
        actions: [
            {
                text: 'View Application',
                action: 'view_application',
                applicationId: currentApplication.applicationId
            }
        ]
    };
    
    notifications.unshift(notification);
    localStorage.setItem('domihive_notifications', JSON.stringify(notifications));
    
    console.log('📧 Payment notification created');
}

// Utility Functions
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
        console.log('📋 Copied to clipboard:', text);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('Failed to copy to clipboard', 'error');
    });
}

function downloadReceipt() {
    // In a real app, this would generate and download a PDF receipt
    showNotification('Receipt download started...', 'success');
    console.log('📄 Receipt download triggered');
    
    // Simulate receipt generation
    setTimeout(() => {
        showNotification('Receipt downloaded successfully!', 'success');
    }, 2000);
}

function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    successModal.classList.remove('active');
}

function redirectToDocuments() {
    console.log('↩️ Redirecting to document upload...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('application-document');
    } else {
        // Fallback to direct navigation
        window.location.href = '/application-document.html';
    }
}

function redirectToApplication() {
    console.log('↩️ Redirecting to application page...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('application-process');
    } else {
        // Fallback to direct navigation
        window.location.href = '/application-process.html';
    }
}

function redirectToDashboard() {
    console.log('🏠 Redirecting to dashboard...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('dashboard');
    } else {
        // Fallback to direct navigation
        window.location.href = '/dashboard.html';
    }
}

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
    
    // Remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// Add CSS animations for notifications
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
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

// Make functions available globally for HTML onclick
window.copyToClipboard = copyToClipboard;

console.log('🎉 Payment Page JavaScript Loaded Successfully!');