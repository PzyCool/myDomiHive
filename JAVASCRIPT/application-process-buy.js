// application-process-buy.js - Complete Property Purchase Application Logic
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Initializing Property Purchase Application Process (Step 1)...');
    
    // Initialize the application
    initializePurchaseApplicationProcess();
});

// Global variables
let currentUser = null;
let currentProperty = null;
let currentBooking = null;

function initializePurchaseApplicationProcess() {
    console.log('💰 Initializing Purchase Application Process...');
    
    // Load user data, property information, and booking data
    loadUserData();
    loadPropertyData();
    loadBookingData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Prefill user information
    prefillUserData();
    
    console.log('✅ Purchase application process initialized');
}

function loadUserData() {
    try {
        // Get current user from localStorage
        const userData = localStorage.getItem('domihive_current_user');
        
        if (userData) {
            currentUser = JSON.parse(userData);
            console.log('👤 User data loaded:', currentUser);
        } else {
            // Demo user data for testing
            currentUser = {
                id: 'user_' + Date.now(),
                fullName: 'John Doe',
                email: 'john.doe@example.com',
                phone: '8012345678',
                countryCode: '+234',
                userType: 'buyer'
            };
            console.log('⚠️ Using demo user data');
            
            // Save demo user for consistency
            localStorage.setItem('domihive_current_user', JSON.stringify(currentUser));
        }
        
        // Update hidden fields
        document.getElementById('userId').value = currentUser.id;
        
    } catch (error) {
        console.error('Error loading user data:', error);
        showNotification('Error loading user data', 'error');
    }
}

function loadPropertyData() {
    try {
        // Get property data from localStorage (set in property details)
        const propertyData = localStorage.getItem('domihive_selected_property');
        
        if (propertyData) {
            currentProperty = JSON.parse(propertyData);
            console.log('🏘️ Property data loaded:', currentProperty);
        } else {
            // Demo property data for purchase
            currentProperty = {
                id: 'prop_buy_' + Date.now(),
                title: "4-Bedroom Detached House in Ajah",
                price: 85000000,
                location: "Ajah, Lagos",
                bedrooms: 4,
                bathrooms: 3,
                size: "450 sqm",
                type: "detached-house",
                propertyType: "buy"
            };
            console.log('⚠️ Using demo property data for purchase');
        }
        
        // Update hidden field
        document.getElementById('propertyId').value = currentProperty.id;
        
        // Update property display
        updatePropertyDisplay();
        
    } catch (error) {
        console.error('Error loading property data:', error);
        showNotification('Error loading property data', 'error');
    }
}

function loadBookingData() {
    try {
        // Get booking data from sessionStorage (set in book inspection)
        const bookingData = sessionStorage.getItem('domihive_current_booking');
        
        if (bookingData) {
            currentBooking = JSON.parse(bookingData);
            document.getElementById('bookingId').value = currentBooking.bookingId;
            console.log('📅 Booking data loaded:', currentBooking);
        } else {
            console.log('⚠️ No booking data found');
        }
        
    } catch (error) {
        console.error('Error loading booking data:', error);
    }
}

function updatePropertyDisplay() {
    if (!currentProperty) return;
    
    document.getElementById('applicationPropertyTitle').textContent = currentProperty.title;
    document.getElementById('applicationPropertyPrice').textContent = `₦${currentProperty.price.toLocaleString()}`;
    document.getElementById('applicationPropertyLocation').textContent = currentProperty.location;
    document.getElementById('applicationBedrooms').textContent = currentProperty.bedrooms;
    document.getElementById('applicationBathrooms').textContent = currentProperty.bathrooms;
    document.getElementById('applicationSize').textContent = currentProperty.size;
    
    // Update context type
    const contextElement = document.getElementById('applicationContextType');
    if (contextElement) {
        contextElement.textContent = 'Property Purchase Application';
    }
}

function prefillUserData() {
    if (!currentUser) return;
    
    // Prefill user information
    document.getElementById('prefilledFullName').textContent = currentUser.fullName || 'Not provided';
    document.getElementById('prefilledEmail').textContent = currentUser.email || 'Not provided';
    
    // Prefill phone with country code
    const userCountryCode = document.getElementById('userCountryCode');
    if (currentUser.countryCode) {
        userCountryCode.value = currentUser.countryCode;
    }
    document.getElementById('prefilledPhone').textContent = currentUser.phone || 'Not provided';
    
    // Prefill additional user data if available
    if (currentUser.dateOfBirth) {
        document.getElementById('dateOfBirth').value = currentUser.dateOfBirth;
    }
    
    if (currentUser.occupation) {
        document.getElementById('occupation').value = currentUser.occupation;
    }
    
    if (currentUser.nationality) {
        document.getElementById('nationality').value = currentUser.nationality;
    }
}

function initializeEventListeners() {
    // Form submission
    document.getElementById('purchaseApplicationForm').addEventListener('submit', handleFormSubmission);
    
    // Back button
    document.getElementById('backToPrevious').addEventListener('click', goBackToProperty);
    document.getElementById('backToPreviousBtn').addEventListener('click', goBackToProperty);
    
    // Real-time validation
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
    
    // Date of birth validation (optional, but if provided must be at least 21 years old for purchase)
    document.getElementById('dateOfBirth').addEventListener('change', validateDateOfBirth);
    
    // ID number validation
    document.getElementById('idNumber').addEventListener('blur', validateIdNumber);
}

// Form Validation and Submission
function handleFormSubmission(event) {
    event.preventDefault();
    console.log('📝 Purchase application form submission started...');
    
    if (validateForm()) {
        const formData = collectFormData();
        saveApplicationData(formData);
    }
}

function validateForm() {
    let isValid = true;
    
    // Clear previous errors
    clearValidationErrors();
    
    // Validate required fields
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim() && field.offsetParent !== null) {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Validate date of birth (optional, but if provided must be at least 21 years old for purchase)
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    if (dateOfBirth && !isValidPurchaseAge(dateOfBirth)) {
        showFieldError(document.getElementById('dateOfBirth'), 'You must be at least 21 years old to purchase property');
        isValid = false;
    }
    
    // Validate ID number
    const idNumber = document.getElementById('idNumber').value;
    if (idNumber && !isValidIdNumber(idNumber)) {
        showFieldError(document.getElementById('idNumber'), 'Please enter a valid ID number');
        isValid = false;
    }
    
    // Validate terms agreement
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms.checked) {
        showFieldError(agreeTerms, 'You must agree to the terms to proceed');
        isValid = false;
    }
    
    if (isValid) {
        console.log('✅ Purchase form validation passed');
    } else {
        console.log('❌ Purchase form validation failed');
        showNotification('Please fix the errors in the form', 'error');
    }
    
    return isValid;
}

function validateField(event) {
    const field = event.target;
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, 'This field is required');
        return;
    }
    
    // Specific validations
    switch (field.id) {
        case 'dateOfBirth':
            if (field.value && !isValidPurchaseAge(field.value)) {
                showFieldError(field, 'You must be at least 21 years old to purchase property');
            } else {
                clearFieldError(field);
            }
            break;
        case 'idNumber':
            if (field.value && !isValidIdNumber(field.value)) {
                showFieldError(field, 'Please enter a valid ID number');
            } else {
                clearFieldError(field);
            }
            break;
        default:
            clearFieldError(field);
    }
}

function validateDateOfBirth(event) {
    const field = event.target;
    if (field.value && !isValidPurchaseAge(field.value)) {
        showFieldError(field, 'You must be at least 21 years old to purchase property');
    } else {
        clearFieldError(field);
    }
}

function validateIdNumber(event) {
    const field = event.target;
    if (field.value && !isValidIdNumber(field.value)) {
        showFieldError(field, 'Please enter a valid ID number');
    } else {
        clearFieldError(field);
    }
}

function isValidPurchaseAge(dateString) {
    const birthDate = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 21;
    }
    return age >= 21;
}

function isValidIdNumber(idNumber) {
    // Basic ID number validation - can be enhanced based on specific ID types
    const idRegex = /^[A-Z0-9]{8,20}$/i;
    return idRegex.test(idNumber.trim());
}

function showFieldError(field, message) {
    field.style.borderColor = '#e53e3e';
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(event) {
    const field = event.target;
    field.style.borderColor = '';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearValidationErrors() {
    const fields = document.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.style.borderColor = '';
    });
    
    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(error => error.remove());
}

function collectFormData() {
    const applicationData = {
        // Application metadata
        applicationId: 'BUY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        step: 1,
        propertyId: currentProperty.id,
        propertyTitle: currentProperty.title,
        propertyLocation: currentProperty.location,
        propertyPrice: currentProperty.price,
        userId: currentUser.id,
        bookingId: currentBooking ? currentBooking.bookingId : null,
        applicationDate: new Date().toISOString(),
        status: 'in_progress',
        currentStep: 'application_details',
        applicationType: 'purchase',
        
        // Personal Information
        personalInfo: {
            fullName: currentUser.fullName,
            email: currentUser.email,
            phone: currentUser.phone,
            countryCode: document.getElementById('userCountryCode').value,
            dateOfBirth: document.getElementById('dateOfBirth').value || null, // Optional
            nationality: document.getElementById('nationality').value,
            idType: document.getElementById('idType').value,
            idNumber: document.getElementById('idNumber').value,
            occupation: document.getElementById('occupation').value
        },
        
        // Property Usage
        usageInfo: {
            propertyUsage: document.getElementById('propertyUsage').value,
            occupancyTimeline: document.getElementById('occupancyTimeline').value
        },
        
        // Legal Information
        legalInfo: {
            legalRepresentative: document.getElementById('legalRepresentative').value || null, // Optional
            additionalNotes: document.getElementById('additionalNotes').value,
            termsAgreed: document.getElementById('agreeTerms').checked
        }
    };
    
    console.log('📦 Purchase form data collected:', applicationData);
    return applicationData;
}

function saveApplicationData(applicationData) {
    console.log('💾 Saving purchase application data...');
    
    // Show loading state
    const submitBtn = document.querySelector('#purchaseApplicationForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        try {
            // Save application to localStorage
            let applications = JSON.parse(localStorage.getItem('domihive_purchase_applications')) || [];
            applications.push(applicationData);
            localStorage.setItem('domihive_purchase_applications', JSON.stringify(applications));
            
            // Store current application in session for next steps
            sessionStorage.setItem('current_purchase_application', JSON.stringify(applicationData));
            
            // Update user data with new information
            updateUserProfile(applicationData);
            
            console.log('✅ Purchase application data saved:', applicationData.applicationId);
            
            // Redirect to document upload page
            redirectToDocumentUpload();
            
        } catch (error) {
            console.error('❌ Error saving purchase application:', error);
            showNotification('Error saving application. Please try again.', 'error');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 1500);
}

function updateUserProfile(applicationData) {
    // Update user profile with new information
    const updatedUser = {
        ...currentUser,
        dateOfBirth: applicationData.personalInfo.dateOfBirth,
        occupation: applicationData.personalInfo.occupation,
        nationality: applicationData.personalInfo.nationality,
        countryCode: applicationData.personalInfo.countryCode
    };
    
    localStorage.setItem('domihive_current_user', JSON.stringify(updatedUser));
    console.log('👤 User profile updated with purchase information');
}

function redirectToDocumentUpload() {
    console.log('🔄 Redirecting to purchase document upload page...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('application-document-buy');
    } else {
        // Fallback to direct navigation
        window.location.href = '/Pages/application-document-buy.html';
    }
}

function goBackToProperty() {
    console.log('↩️ Going back to property...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('property-details');
    } else {
        // Fallback to going back in history
        window.history.back();
    }
}

// Utility Functions
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

console.log('🎉 Property Purchase Application JavaScript Loaded Successfully!');