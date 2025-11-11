// application-payment-buy.js - Complete Property Purchase Payment Logic
document.addEventListener('DOMContentLoaded', function() {
    console.log('💳 Initializing Purchase Payment Page (Step 3)...');
    
    // Initialize the payment page
    initializePurchasePaymentPage();
});

// Global variables
let currentApplication = null;
let selectedPaymentMethod = null;
let uploadedReceipt = null;

function initializePurchasePaymentPage() {
    console.log('💰 Initializing Purchase Payment Process...');
    
    // Load application data from Steps 1 & 2
    loadApplicationData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize payment method selection
    initializePaymentMethods();
    
    // Update payment details
    updatePaymentDetails();
    
    console.log('✅ Purchase payment page initialized');
}

function loadApplicationData() {
    try {
        // Get application data from sessionStorage (set in Step 2)
        const applicationData = sessionStorage.getItem('current_purchase_application');
        
        if (applicationData) {
            currentApplication = JSON.parse(applicationData);
            console.log('📄 Purchase application data loaded:', currentApplication);
            
            // Update UI with application data
            updateApplicationDisplay();
            
            // Update hidden fields
            document.getElementById('applicationData').value = JSON.stringify(currentApplication);
            
        } else {
            console.error('❌ No purchase application data found');
            showNotification('Error: Purchase application data not found. Please start from Step 1.', 'error');
            
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
    
    // Update property price
    const totalAmount = currentApplication.propertyPrice || 0;
    document.getElementById('propertyPrice').textContent = `₦${totalAmount.toLocaleString()}`;
    document.getElementById('totalAmount').textContent = `₦${totalAmount.toLocaleString()}`;
    
    // Update financing method
    const financingElement = document.getElementById('financingMethod');
    if (financingElement) {
        financingElement.textContent = 'Property Purchase';
    }
    
    // Update context type
    const contextElement = document.getElementById('paymentContextType');
    if (contextElement) {
        contextElement.textContent = 'Property Purchase Application';
    }
    
    // Generate unique payment reference
    const paymentReference = `DOMI-BUY-${currentApplication.applicationId}-${Date.now().toString().slice(-6)}`;
    document.getElementById('paymentReference').textContent = paymentReference;
}

function updatePaymentDetails() {
    if (!currentApplication) return;
    
    // Calculate total amount based on property price
    const totalAmount = currentApplication.propertyPrice || 0;
    const formattedAmount = `₦${totalAmount.toLocaleString()}`;
    
    // Update all amount displays
    document.getElementById('bankAmount').textContent = formattedAmount;
    document.getElementById('totalPaymentAmount').value = totalAmount;
    
    console.log('💰 Purchase payment details updated:', formattedAmount);
}

function initializeEventListeners() {
    // Form submission
    document.getElementById('purchasePaymentForm').addEventListener('submit', handlePaymentSubmission);
    
    // Back buttons
    document.getElementById('backToDocuments').addEventListener('click', redirectToDocuments);
    document.getElementById('backToDocumentsBtn').addEventListener('click', redirectToDocuments);
    
    // Modal buttons
    document.getElementById('closeModalBtn').addEventListener('click', closeSuccessModal);
    document.getElementById('downloadReceiptBtn').addEventListener('click', downloadReceipt);
    document.getElementById('goToDashboardBtn').addEventListener('click', redirectToNotification);
    
    // Legal terms checkboxes validation
    document.getElementById('agreeLegalReview').addEventListener('change', validateForm);
    document.getElementById('agreePurchaseTerms').addEventListener('change', validateForm);
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
}

function formatExpiryDate(event) {
    let input = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (input.length >= 2) {
        input = input.substring(0, 2) + '/' + input.substring(2, 4);
    }
    
    event.target.value = input;
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
    
    // Validate legal terms agreements
    const requiredCheckboxes = [
        'agreeLegalReview',
        'agreePurchaseTerms',
        'agreePrivacyPolicy'
    ];
    
    requiredCheckboxes.forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        if (!checkbox.checked) {
            showFieldError(checkbox, 'This legal agreement is required');
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
        console.log('✅ Purchase payment form validation passed');
    } else {
        submitBtn.disabled = true;
        console.log('❌ Purchase payment form validation failed');
    }
    
    return isValid;
}

function validateCardPayment() {
    let isValid = true;
    
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s+/g, '');
    const cardHolder = document.getElementById('cardHolder').value.trim();
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    
    // Validate card number
    if (!cardNumber || cardNumber.length < 16) {
        showFieldError(document.getElementById('cardNumber'), 'Valid card number is required (16 digits)');
        isValid = false;
    }
    
    // Validate card holder
    if (!cardHolder) {
        showFieldError(document.getElementById('cardHolder'), 'Card holder name is required');
        isValid = false;
    }
    
    // Validate expiry date
    if (!expiryDate || expiryDate.length !== 5) {
        showFieldError(document.getElementById('expiryDate'), 'Valid expiry date is required (MM/YY)');
        isValid = false;
    }
    
    // Validate CVV
    if (!cvv || cvv.length < 3) {
        showFieldError(document.getElementById('cvv'), 'Valid CVV is required (3-4 digits)');
        isValid = false;
    }
    
    return isValid;
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
    console.log('💳 Purchase payment form submission started...');
    
    if (validateForm()) {
        processPayment();
    }
}

function processPayment() {
    console.log('🔄 Processing purchase payment...');
    
    // Show processing modal
    const processingModal = document.getElementById('processingModal');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const processingSteps = document.querySelectorAll('.processing-step');
    
    processingModal.classList.add('active');
    
    // Simulate payment processing
    let progress = 0;
    const steps = [
        { progress: 33, text: 'Processing payment transaction...', step: 0 },
        { progress: 66, text: 'Initiating legal document review...', step: 1 },
        { progress: 100, text: 'Finalizing application submission...', step: 2 }
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
    }, 800);
}

function completePayment() {
    console.log('✅ Purchase payment completed');
    
    // Generate transaction details
    const transactionId = 'TXN-BUY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    const totalAmount = currentApplication.propertyPrice || 0;
    const paidAmount = `₦${totalAmount.toLocaleString()}`;
    
    // Save payment data
    savePaymentData(transactionId);
    
    // Show success modal after delay
    setTimeout(() => {
        const processingModal = document.getElementById('processingModal');
        processingModal.classList.remove('active');
        
        showSuccessModal(transactionId, paidAmount);
        
        console.log('🎉 Purchase payment process completed');
    }, 1000);
}

function savePaymentData(transactionId) {
    const paymentData = {
        applicationId: currentApplication.applicationId,
        transactionId: transactionId,
        paymentMethod: selectedPaymentMethod,
        amount: currentApplication.propertyPrice || 0,
        paymentDate: new Date().toISOString(),
        status: 'completed',
        applicationStatus: 'under_legal_review'
    };
    
    // Update application data with payment info
    currentApplication.payment = paymentData;
    currentApplication.currentStep = 'payment_completed';
    currentApplication.status = 'under_legal_review';
    currentApplication.legalReviewStartDate = new Date().toISOString();
    
    // Save to sessionStorage
    sessionStorage.setItem('current_purchase_application', JSON.stringify(currentApplication));
    
    // Save to localStorage for persistence
    let applications = JSON.parse(localStorage.getItem('domihive_purchase_applications')) || [];
    const appIndex = applications.findIndex(app => app.applicationId === currentApplication.applicationId);
    
    if (appIndex !== -1) {
        applications[appIndex] = currentApplication;
    } else {
        applications.push(currentApplication);
    }
    
    localStorage.setItem('domihive_purchase_applications', JSON.stringify(applications));
    
    // Create payment notification
    createPurchasePaymentNotification(transactionId);
    
    console.log('💾 Purchase payment data saved:', paymentData);
}

function showSuccessModal(transactionId, paidAmount) {
    // Update modal content
    document.getElementById('transactionId').textContent = transactionId;
    document.getElementById('paidAmount').textContent = paidAmount;
    document.getElementById('paymentMethod').textContent = formatPaymentMethod(selectedPaymentMethod);
    
    // Show modal
    const successModal = document.getElementById('successModal');
    successModal.classList.add('active');
    
    showNotification('Payment completed successfully! Legal review has been initiated.', 'success');
}

function formatPaymentMethod(method) {
    const methodNames = {
        'card': 'Credit/Debit Card',
        'bank': 'Bank Transfer',
        'paystack': 'Paystack'
    };
    
    return methodNames[method] || method;
}

function createPurchasePaymentNotification(transactionId) {
    const notifications = JSON.parse(localStorage.getItem('domihive_notifications')) || [];
    
    const notification = {
        id: 'notif_buy_' + Date.now(),
        type: 'purchase_payment_completed',
        title: 'Purchase Payment Successful',
        message: `Your payment of ₦${(currentApplication.propertyPrice || 0).toLocaleString()} for ${currentApplication.propertyTitle} has been processed. Legal review is now in progress.`,
        timestamp: new Date().toISOString(),
        read: false,
        applicationId: currentApplication.applicationId,
        transactionId: transactionId,
        actions: [
            {
                text: 'View Application Status',
                action: 'view_application_status',
                applicationId: currentApplication.applicationId
            },
            {
                text: 'Download Receipt',
                action: 'download_receipt',
                transactionId: transactionId
            }
        ]
    };
    
    notifications.unshift(notification);
    localStorage.setItem('domihive_notifications', JSON.stringify(notifications));
    
    console.log('📧 Purchase payment notification created');
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
    showNotification('Generating receipt...', 'success');
    console.log('📄 Receipt download triggered');
    
    // Simulate receipt generation
    setTimeout(() => {
        showNotification('Receipt downloaded successfully!', 'success');
        
        // Create receipt content
        const receiptContent = `
DOMIHIVE PROPERTY PURCHASE RECEIPT
===================================

Transaction ID: ${document.getElementById('transactionId').textContent}
Application ID: ${currentApplication.applicationId}
Payment Date: ${new Date().toLocaleDateString()}
Payment Time: ${new Date().toLocaleTimeString()}

APPLICANT DETAILS:
------------------
Name: ${currentApplication.personalInfo.fullName}
Email: ${currentApplication.personalInfo.email}

PROPERTY DETAILS:
-----------------
Property: ${currentApplication.propertyTitle}
Location: ${currentApplication.propertyLocation}
Purchase Price: ₦${(currentApplication.propertyPrice || 0).toLocaleString()}

PAYMENT DETAILS:
----------------
Total Amount: ₦${(currentApplication.propertyPrice || 0).toLocaleString()}
Payment Method: ${document.getElementById('paymentMethod').textContent}
Payment Status: Completed
Application Status: Under Legal Review

Thank you for choosing DomiHive Property Services!
Your legal review is now in progress.

DomiHive Property Services
www.domihive.com
        `;
        
        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `purchase-receipt-${currentApplication.applicationId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 1500);
}

function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    successModal.classList.remove('active');
    
    // Redirect to notification page after closing modal
    setTimeout(() => {
        redirectToNotification();
    }, 500);
}

function redirectToDocuments() {
    console.log('↩️ Redirecting to purchase document upload...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('application-document-buy');
    } else {
        // Fallback to direct navigation
        window.location.href = '/Pages/application-document-buy.html';
    }
}

function redirectToApplication() {
    console.log('↩️ Redirecting to purchase application page...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('application-process-buy');
    } else {
        // Fallback to direct navigation
        window.location.href = '/Pages/application-process-buy.html';
    }
}

function redirectToNotification() {
    console.log('📱 Redirecting to notification page...');
    
    // Redirect to notification page
    window.location.href = '/Pages/notification.html';
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

console.log('🎉 Purchase Payment JavaScript Loaded Successfully!');