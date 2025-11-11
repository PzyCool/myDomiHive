// application-payment-shortlet.js - Complete Shortlet Property Payment Logic
document.addEventListener('DOMContentLoaded', function() {
    console.log('💳 Initializing Shortlet Payment Page (Step 3)...');
    
    // Initialize the payment page
    initializeShortletPaymentPage();
});

// Global variables
let currentApplication = null;
let selectedPaymentMethod = null;
let uploadedReceipt = null;

function initializeShortletPaymentPage() {
    console.log('💰 Initializing Shortlet Payment Process...');
    
    // Load application data from Steps 1 & 2
    loadApplicationData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize payment method selection
    initializePaymentMethods();
    
    // Update payment details
    updatePaymentDetails();
    
    console.log('✅ Shortlet payment page initialized');
}

function loadApplicationData() {
    try {
        // Get application data from sessionStorage (set in Step 2)
        const applicationData = sessionStorage.getItem('current_shortlet_application');
        
        if (applicationData) {
            currentApplication = JSON.parse(applicationData);
            console.log('📄 Shortlet application data loaded:', currentApplication);
            
            // Update UI with application data
            updateApplicationDisplay();
            
            // Update hidden fields
            document.getElementById('applicationData').value = JSON.stringify(currentApplication);
            
        } else {
            console.error('❌ No shortlet application data found');
            showNotification('Error: Shortlet application data not found. Please start from Step 1.', 'error');
            
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
    
    // Update guest details
    document.getElementById('guestName').textContent = currentApplication.guestInfo.primaryGuest.fullName;
    document.getElementById('applicationId').textContent = currentApplication.applicationId;
    document.getElementById('propertyTitle').textContent = currentApplication.propertyTitle;
    
    // Update stay duration
    const checkIn = new Date(currentApplication.bookingInfo.checkInDate);
    const checkOut = new Date(currentApplication.bookingInfo.checkOutDate);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const stayDuration = `${checkIn.toLocaleDateString('en-US', options)} - ${checkOut.toLocaleDateString('en-US', options)} (${currentApplication.bookingInfo.nights} nights)`;
    document.getElementById('stayDuration').textContent = stayDuration;
    
    // Update total guests
    document.getElementById('totalGuests').textContent = currentApplication.guestInfo.totalGuests;
    
    // Update context type
    const contextElement = document.getElementById('paymentContextType');
    if (contextElement) {
        contextElement.textContent = 'Shortlet Application';
    }
    
    // Generate unique payment reference
    const paymentReference = `DOMI-SHORT-${currentApplication.applicationId}-${Date.now().toString().slice(-6)}`;
    document.getElementById('paymentReference').textContent = paymentReference;
}

function updatePaymentDetails() {
    if (!currentApplication) return;
    
    // Calculate total amount based on nights and nightly rate
    const totalAmount = currentApplication.financialInfo.estimatedTotal;
    const formattedAmount = `₦${totalAmount.toLocaleString()}`;
    
    // Update all amount displays
    document.getElementById('totalAmount').textContent = formattedAmount;
    document.getElementById('bankAmount').textContent = formattedAmount;
    document.getElementById('totalPaymentAmount').value = totalAmount;
    
    console.log('💰 Shortlet payment details updated:', formattedAmount);
}

function initializeEventListeners() {
    console.log('🔗 Setting up event listeners...');
    
    // Form submission
    const paymentForm = document.getElementById('shortletPaymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(event) {
            console.log('📝 Form submission triggered');
            event.preventDefault();
            handlePaymentSubmission(event);
        });
    } else {
        console.error('❌ Payment form not found');
    }
    
    // Back buttons
    const backToDocuments = document.getElementById('backToDocuments');
    const backToDocumentsBtn = document.getElementById('backToDocumentsBtn');
    
    if (backToDocuments) {
        backToDocuments.addEventListener('click', redirectToDocuments);
    }
    if (backToDocumentsBtn) {
        backToDocumentsBtn.addEventListener('click', redirectToDocuments);
    }
    
    // Modal buttons
    const closeModalBtn = document.getElementById('closeModalBtn');
    const downloadReceiptBtn = document.getElementById('downloadReceiptBtn');
    const goToDashboardBtn = document.getElementById('goToDashboardBtn');
    
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeSuccessModal);
    if (downloadReceiptBtn) downloadReceiptBtn.addEventListener('click', downloadShortletReceipt);
    if (goToDashboardBtn) goToDashboardBtn.addEventListener('click', redirectToNotification);
    
    // Shortlet terms checkboxes validation
    const checkboxes = [
        'agreeShortletEscrow',
        'agreeGuestVerification',
        'agreeCancellationPolicy',
        'agreeHouseRules',
        'agreePrivacyPolicy'
    ];
    
    checkboxes.forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.addEventListener('change', validateForm);
        }
    });
    
    // Card input formatting
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    
    if (cardNumber) cardNumber.addEventListener('input', formatCardNumber);
    if (expiryDate) expiryDate.addEventListener('input', formatExpiryDate);
    if (cvv) cvv.addEventListener('input', formatCVV);
    
    // Bank receipt upload
    const bankReceipt = document.getElementById('bankReceipt');
    if (bankReceipt) {
        bankReceipt.addEventListener('change', handleReceiptUpload);
    }
    
    // Close modal on background click
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSuccessModal();
            }
        });
    }
    
    console.log('✅ Event listeners initialized');
}

function initializePaymentMethods() {
    const paymentMethodCards = document.querySelectorAll('.payment-method-card');
    console.log(`🔍 Found ${paymentMethodCards.length} payment method cards`);
    
    paymentMethodCards.forEach(card => {
        card.addEventListener('click', function() {
            selectPaymentMethod(this);
        });
    });
    
    // Select card payment by default
    const defaultMethod = document.querySelector('.payment-method-card[data-method="card"]');
    if (defaultMethod) {
        selectPaymentMethod(defaultMethod);
    } else {
        console.error('❌ Default payment method card not found');
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
    console.log('📋 Showing payment details for:', method);
    
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
        console.log('✅ Payment details shown for:', method);
    } else {
        console.error('❌ Payment details element not found for:', method);
    }
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
}

function formatCVV(event) {
    let input = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    event.target.value = input.substring(0, 4);
}

function handleReceiptUpload(event) {
    const file = event.target.files[0];
    
    if (!file) {
        console.log('❌ No file selected for receipt upload');
        return;
    }
    
    console.log('📄 File selected for receipt upload:', file.name);
    
    // Validate file
    const validation = validateReceiptFile(file);
    if (!validation.isValid) {
        showNotification(validation.message, 'error');
        event.target.value = '';
        return;
    }
    
    uploadedReceipt = file;
    console.log('✅ Receipt uploaded successfully:', file.name);
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
    console.log('🔍 Validating form...');
    let isValid = true;
    
    // Clear previous errors
    clearValidationErrors();
    
    // Validate payment method selection
    if (!selectedPaymentMethod) {
        console.log('❌ No payment method selected');
        showNotification('Please select a payment method', 'error');
        isValid = false;
    } else {
        console.log('✅ Payment method selected:', selectedPaymentMethod);
    }
    
    // Validate shortlet terms agreements
    const requiredCheckboxes = [
        'agreeShortletEscrow',
        'agreeGuestVerification',
        'agreeCancellationPolicy',
        'agreeHouseRules',
        'agreePrivacyPolicy'
    ];
    
    let uncheckedCheckboxes = [];
    requiredCheckboxes.forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox && !checkbox.checked) {
            uncheckedCheckboxes.push(checkboxId);
            showFieldError(checkbox, 'This shortlet agreement is required');
            isValid = false;
        }
    });
    
    if (uncheckedCheckboxes.length > 0) {
        console.log('❌ Unchecked checkboxes:', uncheckedCheckboxes);
    }
    
    // Validate payment method specific fields
    if (selectedPaymentMethod === 'card') {
        console.log('🔍 Validating card payment...');
        isValid = validateCardPayment() && isValid;
    } else if (selectedPaymentMethod === 'bank') {
        console.log('🔍 Validating bank transfer...');
        isValid = validateBankTransfer() && isValid;
    } else if (selectedPaymentMethod === 'paystack') {
        console.log('✅ Paystack method selected - no additional validation needed');
        // Paystack doesn't need additional validation as it redirects to gateway
    }
    
    // Update submit button state
    const submitBtn = document.getElementById('submitPaymentBtn');
    if (submitBtn) {
        if (isValid) {
            submitBtn.disabled = false;
            console.log('✅ Shortlet payment form validation passed');
        } else {
            submitBtn.disabled = true;
            console.log('❌ Shortlet payment form validation failed');
        }
    } else {
        console.error('❌ Submit button not found');
    }
    
    return isValid;
}

function validateCardPayment() {
    let isValid = true;
    
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s+/g, '');
    const cardHolder = document.getElementById('cardHolder').value.trim();
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    
    console.log('🔍 Card validation:', { cardNumber: cardNumber?.length, cardHolder: !!cardHolder, expiryDate, cvv: cvv?.length });
    
    // Validate card number (basic validation - accept any 16-digit number)
    if (!cardNumber || cardNumber.length < 16) {
        showFieldError(document.getElementById('cardNumber'), 'Valid card number is required (16 digits)');
        isValid = false;
        console.log('❌ Card number validation failed');
    }
    
    // Validate card holder
    if (!cardHolder) {
        showFieldError(document.getElementById('cardHolder'), 'Card holder name is required');
        isValid = false;
        console.log('❌ Card holder validation failed');
    }
    
    // Validate expiry date
    if (!expiryDate || expiryDate.length !== 5) {
        showFieldError(document.getElementById('expiryDate'), 'Valid expiry date is required (MM/YY)');
        isValid = false;
        console.log('❌ Expiry date validation failed');
    }
    
    // Validate CVV
    if (!cvv || cvv.length < 3) {
        showFieldError(document.getElementById('cvv'), 'Valid CVV is required (3-4 digits)');
        isValid = false;
        console.log('❌ CVV validation failed');
    }
    
    console.log('✅ Card payment validation:', isValid ? 'PASSED' : 'FAILED');
    return isValid;
}

function validateBankTransfer() {
    let isValid = true;
    
    // Validate receipt upload for bank transfer
    if (!uploadedReceipt) {
        showFieldError(document.getElementById('bankReceipt'), 'Receipt upload is required for bank transfer');
        isValid = false;
        console.log('❌ Bank transfer validation failed - no receipt');
    } else {
        console.log('✅ Bank transfer validation passed - receipt uploaded');
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
    console.log('❌ Field error:', message);
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
    console.log('💳 Shortlet payment form submission started...');
    console.log('📊 Form data:', {
        selectedPaymentMethod,
        hasApplication: !!currentApplication,
        totalAmount: currentApplication?.financialInfo?.estimatedTotal
    });
    
    if (validateForm()) {
        console.log('✅ Form validation passed, processing payment...');
        processPayment();
    } else {
        console.log('❌ Form validation failed, stopping submission');
        showNotification('Please fix the errors in the form before submitting', 'error');
    }
}

function processPayment() {
    console.log('🔄 Processing shortlet payment for method:', selectedPaymentMethod);
    
    // Show processing modal
    const processingModal = document.getElementById('processingModal');
    if (processingModal) {
        processingModal.classList.add('active');
        console.log('✅ Processing modal shown');
    } else {
        console.error('❌ Processing modal not found');
    }
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const processingSteps = document.querySelectorAll('.processing-step');
    
    // Simulate payment processing
    let progress = 0;
    const steps = [
        { progress: 33, text: 'Processing payment transaction...', step: 0 },
        { progress: 66, text: 'Confirming payment details...', step: 1 },
        { progress: 100, text: 'Finalizing booking confirmation...', step: 2 }
    ];
    
    let currentStep = 0;
    
    const processInterval = setInterval(() => {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            progress = step.progress;
            
            if (progressFill) progressFill.style.width = progress + '%';
            if (progressText) progressText.textContent = step.text;
            
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
            console.log('✅ Payment processing simulation completed');
            completePayment();
        }
    }, 800);
}

function completePayment() {
    console.log('✅ Shortlet payment completed');
    
    // Generate transaction details
    const transactionId = 'TXN-SHORT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    const totalAmount = currentApplication.financialInfo.estimatedTotal;
    const paidAmount = `₦${totalAmount.toLocaleString()}`;
    
    console.log('💰 Payment completed:', { transactionId, paidAmount, method: selectedPaymentMethod });
    
    // Save payment data
    savePaymentData(transactionId);
    
    // Show success modal after delay
    setTimeout(() => {
        const processingModal = document.getElementById('processingModal');
        if (processingModal) {
            processingModal.classList.remove('active');
        }
        
        showSuccessModal(transactionId, paidAmount);
        
        console.log('🎉 Shortlet payment process completed successfully');
    }, 1000);
}

function savePaymentData(transactionId) {
    const paymentData = {
        applicationId: currentApplication.applicationId,
        transactionId: transactionId,
        paymentMethod: selectedPaymentMethod,
        amount: currentApplication.financialInfo.estimatedTotal,
        paymentDate: new Date().toISOString(),
        status: 'completed',
        bookingStatus: 'confirmed'
    };
    
    // Update application data with payment info
    currentApplication.payment = paymentData;
    currentApplication.currentStep = 'payment_completed';
    currentApplication.status = 'confirmed';
    currentApplication.confirmationDate = new Date().toISOString();
    
    // Save to sessionStorage
    sessionStorage.setItem('current_shortlet_application', JSON.stringify(currentApplication));
    
    // Save to localStorage for persistence
    let applications = JSON.parse(localStorage.getItem('domihive_shortlet_applications')) || [];
    const appIndex = applications.findIndex(app => app.applicationId === currentApplication.applicationId);
    
    if (appIndex !== -1) {
        applications[appIndex] = currentApplication;
    } else {
        applications.push(currentApplication);
    }
    
    localStorage.setItem('domihive_shortlet_applications', JSON.stringify(applications));
    
    // Create payment notification
    createShortletPaymentNotification(transactionId);
    
    console.log('💾 Shortlet payment data saved:', paymentData);
}

function showSuccessModal(transactionId, paidAmount) {
    console.log('📱 Showing success modal...');
    
    // Update modal content
    const transactionIdElement = document.getElementById('transactionId');
    const paidAmountElement = document.getElementById('paidAmount');
    const paymentMethodElement = document.getElementById('paymentMethod');
    
    if (transactionIdElement) transactionIdElement.textContent = transactionId;
    if (paidAmountElement) paidAmountElement.textContent = paidAmount;
    if (paymentMethodElement) paymentMethodElement.textContent = formatPaymentMethod(selectedPaymentMethod);
    
    // Show modal
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.add('active');
        console.log('✅ Success modal shown');
    } else {
        console.error('❌ Success modal not found');
    }
    
    showNotification('Shortlet payment completed successfully! Your booking is now confirmed.', 'success');
}

function formatPaymentMethod(method) {
    const methodNames = {
        'card': 'Credit/Debit Card',
        'bank': 'Bank Transfer',
        'paystack': 'Paystack'
    };
    
    return methodNames[method] || method;
}

function createShortletPaymentNotification(transactionId) {
    const notifications = JSON.parse(localStorage.getItem('domihive_notifications')) || [];
    
    const notification = {
        id: 'notif_short_' + Date.now(),
        type: 'shortlet_payment_completed',
        title: 'Shortlet Payment Successful',
        message: `Your shortlet payment of ₦${currentApplication.financialInfo.estimatedTotal.toLocaleString()} for ${currentApplication.propertyTitle} has been processed successfully. Your booking is now confirmed.`,
        timestamp: new Date().toISOString(),
        read: false,
        applicationId: currentApplication.applicationId,
        transactionId: transactionId,
        actions: [
            {
                text: 'View Booking Details',
                action: 'view_booking_details',
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
    
    console.log('📧 Shortlet payment notification created');
}

// Utility Functions
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('❌ Element not found for copy:', elementId);
        return;
    }
    
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
        console.log('📋 Copied to clipboard:', text);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('Failed to copy to clipboard', 'error');
    });
}

function downloadShortletReceipt() {
    console.log('📄 Downloading shortlet receipt...');
    showNotification('Generating shortlet booking receipt...', 'success');
    
    // Simulate receipt generation
    setTimeout(() => {
        showNotification('Shortlet booking receipt downloaded successfully!', 'success');
        
        // Create receipt content
        const receiptContent = `
DOMIHIVE SHORTLET BOOKING RECEIPT
==================================

Transaction ID: ${document.getElementById('transactionId')?.textContent || 'N/A'}
Application ID: ${currentApplication.applicationId}
Booking Date: ${new Date().toLocaleDateString()}
Booking Time: ${new Date().toLocaleTimeString()}

GUEST DETAILS:
--------------
Primary Guest: ${currentApplication.guestInfo.primaryGuest.fullName}
Email: ${currentApplication.guestInfo.primaryGuest.email}
Phone: ${currentApplication.guestInfo.primaryGuest.phone}
Total Guests: ${currentApplication.guestInfo.totalGuests}

PROPERTY DETAILS:
-----------------
Property: ${currentApplication.propertyTitle}
Location: ${currentApplication.propertyLocation}
Check-in: ${new Date(currentApplication.bookingInfo.checkInDate).toLocaleDateString()}
Check-out: ${new Date(currentApplication.bookingInfo.checkOutDate).toLocaleDateString()}
Nights: ${currentApplication.bookingInfo.nights}

PAYMENT DETAILS:
----------------
Total Amount: ₦${currentApplication.financialInfo.estimatedTotal.toLocaleString()}
Payment Method: ${document.getElementById('paymentMethod')?.textContent || 'N/A'}
Payment Status: Completed
Booking Status: Confirmed

Thank you for choosing DomiHive Shortlet Services!
Your booking is confirmed and secured.

DomiHive Shortlet Services
www.domihive.com/shortlet
        `;
        
        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shortlet-receipt-${currentApplication.applicationId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ Receipt downloaded successfully');
    }, 1500);
}

function closeSuccessModal() {
    console.log('❌ Closing success modal...');
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.remove('active');
    }
    
    // Redirect to notification page after closing modal
    setTimeout(() => {
        redirectToNotification();
    }, 500);
}

function redirectToDocuments() {
    console.log('↩️ Redirecting to shortlet document upload...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('application-document-shortlet');
    } else {
        // Fallback to direct navigation
        window.location.href = '/Pages/application-document-shortlet.html';
    }
}

function redirectToApplication() {
    console.log('↩️ Redirecting to shortlet application page...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('application-process-shortlet');
    } else {
        // Fallback to direct navigation
        window.location.href = '/Pages/application-process-shortlet.html';
    }
}

function redirectToNotification() {
    console.log('📱 Redirecting to notification page...');
    
    // Redirect to notification page
    window.location.href = '/Pages/notification.html';
}

function showNotification(message, type = 'success') {
    console.log(`📢 Notification [${type}]:`, message);
    
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

console.log('🎉 Shortlet Payment JavaScript Loaded Successfully!');