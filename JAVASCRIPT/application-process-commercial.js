// application-process-commercial.js - Complete Commercial Property Application Logic
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏢 Initializing Commercial Property Application Process (Step 1)...');
    
    // Initialize the application
    initializeCommercialApplicationProcess();
});

// Global variables
let currentUser = null;
let currentProperty = null;
let currentBooking = null;

function initializeCommercialApplicationProcess() {
    console.log('💼 Initializing Commercial Application Process...');
    
    // Load user data, property information, and booking data
    loadUserData();
    loadPropertyData();
    loadBookingData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Prefill user information
    prefillUserData();
    
    console.log('✅ Commercial application process initialized');
}

function loadUserData() {
    try {
        // Get current user from localStorage
        const userData = localStorage.getItem('domihive_current_user');
        
        if (userData) {
            currentUser = JSON.parse(userData);
            console.log('👤 User data loaded:', currentUser);
        } else {
            // Demo user data for commercial application
            currentUser = {
                id: 'user_' + Date.now(),
                fullName: 'Jane Smith',
                email: 'jane.smith@example.com',
                phone: '+2348012345679',
                userType: 'business'
            };
            console.log('⚠️ Using demo user data for commercial application');
            
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
            console.log('🏢 Commercial property data loaded:', currentProperty);
        } else {
            // Demo commercial property data
            currentProperty = {
                id: 'prop_commercial_' + Date.now(),
                title: "Prime Retail Space in Victoria Island",
                price: 12500000,
                location: "Victoria Island, Lagos",
                size: "350 sqm",
                units: 1,
                parking: 5,
                type: "retail-space",
                propertyType: "commercial"
            };
            console.log('⚠️ Using demo commercial property data');
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
    document.getElementById('applicationPropertyPrice').textContent = `₦${currentProperty.price.toLocaleString()}/year`;
    document.getElementById('applicationPropertyLocation').textContent = currentProperty.location;
    document.getElementById('applicationSize').textContent = currentProperty.size;
    document.getElementById('applicationUnits').textContent = currentProperty.units || '1 unit';
    document.getElementById('applicationParking').textContent = `${currentProperty.parking || '0'} parking`;
    
    // Update context type
    const contextElement = document.getElementById('applicationContextType');
    if (contextElement) {
        contextElement.textContent = 'Commercial Property Application';
    }
}

function prefillUserData() {
    if (!currentUser) return;
    
    // Prefill user information for contact person
    document.getElementById('prefilledFullName').textContent = currentUser.fullName || 'Not provided';
    document.getElementById('prefilledEmail').textContent = currentUser.email || 'Not provided';
    document.getElementById('prefilledPhone').textContent = currentUser.phone || 'Not provided';
    
    // Prefill business data if available in user profile
    if (currentUser.businessName) {
        document.getElementById('businessName').value = currentUser.businessName;
    }
    
    if (currentUser.contactPosition) {
        document.getElementById('contactPosition').value = currentUser.contactPosition;
    }
}

function initializeEventListeners() {
    // Form submission
    document.getElementById('commercialApplicationForm').addEventListener('submit', handleFormSubmission);
    
    // Back button
    document.getElementById('backToPrevious').addEventListener('click', goBackToProperty);
    document.getElementById('backToPreviousBtn').addEventListener('click', goBackToProperty);
    
    // Real-time validation
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
    
    // Account number validation
    document.getElementById('accountNumber').addEventListener('blur', validateAccountNumber);
    
    // Business registration number validation
    document.getElementById('businessRegistration').addEventListener('blur', validateBusinessRegistration);
    
    // TIN validation
    document.getElementById('taxIdentification').addEventListener('blur', validateTaxIdentification);
}

// Form Validation and Submission
function handleFormSubmission(event) {
    event.preventDefault();
    console.log('📝 Commercial application form submission started...');
    
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
    
    // Validate business registration number
    const businessReg = document.getElementById('businessRegistration').value;
    if (businessReg && !isValidBusinessRegistration(businessReg)) {
        showFieldError(document.getElementById('businessRegistration'), 'Please enter a valid business registration number');
        isValid = false;
    }
    
    // Validate account number (must be 10 digits)
    const accountNumber = document.getElementById('accountNumber').value;
    if (accountNumber && !isValidAccountNumber(accountNumber)) {
        showFieldError(document.getElementById('accountNumber'), 'Please enter a valid 10-digit account number');
        isValid = false;
    }
    
    // Validate TIN number
    const tinNumber = document.getElementById('taxIdentification').value;
    if (tinNumber && !isValidTaxIdentification(tinNumber)) {
        showFieldError(document.getElementById('taxIdentification'), 'Please enter a valid Tax Identification Number');
        isValid = false;
    }
    
    // Validate terms agreements
    const requiredCheckboxes = [
        'agreeCommercialTerms',
        'agreeCreditCheck'
    ];
    
    requiredCheckboxes.forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        if (!checkbox.checked) {
            showFieldError(checkbox, 'This agreement is required');
            isValid = false;
        }
    });
    
    if (isValid) {
        console.log('✅ Commercial form validation passed');
    } else {
        console.log('❌ Commercial form validation failed');
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
    
    // Specific validations for commercial fields
    switch (field.id) {
        case 'businessRegistration':
            if (field.value && !isValidBusinessRegistration(field.value)) {
                showFieldError(field, 'Please enter a valid business registration number');
            } else {
                clearFieldError(field);
            }
            break;
        case 'accountNumber':
            if (field.value && !isValidAccountNumber(field.value)) {
                showFieldError(field, 'Please enter a valid 10-digit account number');
            } else {
                clearFieldError(field);
            }
            break;
        case 'taxIdentification':
            if (field.value && !isValidTaxIdentification(field.value)) {
                showFieldError(field, 'Please enter a valid Tax Identification Number');
            } else {
                clearFieldError(field);
            }
            break;
        default:
            clearFieldError(field);
    }
}

function validateBusinessRegistration(event) {
    const field = event.target;
    if (field.value && !isValidBusinessRegistration(field.value)) {
        showFieldError(field, 'Please enter a valid business registration number');
    } else {
        clearFieldError(field);
    }
}

function validateAccountNumber(event) {
    const field = event.target;
    if (field.value && !isValidAccountNumber(field.value)) {
        showFieldError(field, 'Please enter a valid 10-digit account number');
    } else {
        clearFieldError(field);
    }
}

function validateTaxIdentification(event) {
    const field = event.target;
    if (field.value && !isValidTaxIdentification(field.value)) {
        showFieldError(field, 'Please enter a valid Tax Identification Number');
    } else {
        clearFieldError(field);
    }
}

function isValidBusinessRegistration(regNumber) {
    // Basic validation for business registration numbers (CAC/BN format)
    const regRegex = /^[A-Z0-9]{6,12}$/i;
    return regRegex.test(regNumber.trim());
}

function isValidAccountNumber(accountNumber) {
    // Nigerian account numbers are typically 10 digits
    const accountRegex = /^\d{10}$/;
    return accountRegex.test(accountNumber.trim());
}

function isValidTaxIdentification(tin) {
    // Basic TIN validation (Nigeria TIN format)
    const tinRegex = /^\d{8,12}-\d{4}$/;
    return tinRegex.test(tin.trim());
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
    const spaceUsage = document.querySelector('input[name="spaceUsage"]:checked');
    
    const applicationData = {
        // Application metadata
        applicationId: 'COM-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
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
        applicationType: 'commercial',
        
        // Business Information
        businessInfo: {
            businessName: document.getElementById('businessName').value,
            businessType: document.getElementById('businessType').value,
            businessRegistration: document.getElementById('businessRegistration').value,
            businessIndustry: document.getElementById('businessIndustry').value,
            yearsInBusiness: document.getElementById('yearsInBusiness').value,
            numberOfEmployees: document.getElementById('numberOfEmployees').value,
            annualRevenue: document.getElementById('annualRevenue').value
        },
        
        // Contact Person Details
        contactInfo: {
            fullName: currentUser.fullName,
            email: currentUser.email,
            phone: currentUser.phone,
            position: document.getElementById('contactPosition').value,
            authority: document.getElementById('contactAuthority').value
        },
        
        // Commercial Requirements
        commercialRequirements: {
            spaceUsage: spaceUsage ? spaceUsage.value : null,
            operatingHours: document.getElementById('operatingHours').value,
            customerTraffic: document.getElementById('customerTraffic').value,
            leaseTerm: document.getElementById('leaseTerm').value,
            businessDescription: document.getElementById('businessDescription').value
        },
        
        // Financial Information
        financialInfo: {
            bankName: document.getElementById('bankName').value,
            accountName: document.getElementById('accountName').value,
            accountNumber: document.getElementById('accountNumber').value,
            taxIdentification: document.getElementById('taxIdentification').value,
            vatRegistered: document.getElementById('vatRegistered').value
        },
        
        // References & Additional Information
        additionalInfo: {
            previousLandlord: document.getElementById('previousLandlord').value,
            referenceContact: document.getElementById('referenceContact').value,
            additionalNotes: document.getElementById('additionalNotes').value,
            termsAgreed: document.getElementById('agreeCommercialTerms').checked,
            creditCheckAgreed: document.getElementById('agreeCreditCheck').checked
        }
    };
    
    console.log('📦 Commercial form data collected:', applicationData);
    return applicationData;
}

function saveApplicationData(applicationData) {
    console.log('💾 Saving commercial application data...');
    
    // Show loading state
    const submitBtn = document.querySelector('#commercialApplicationForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        try {
            // Save application to localStorage
            let applications = JSON.parse(localStorage.getItem('domihive_commercial_applications')) || [];
            applications.push(applicationData);
            localStorage.setItem('domihive_commercial_applications', JSON.stringify(applications));
            
            // Store current application in session for next steps
            sessionStorage.setItem('current_commercial_application', JSON.stringify(applicationData));
            
            // Update user data with business information
            updateUserProfile(applicationData);
            
            console.log('✅ Commercial application data saved:', applicationData.applicationId);
            
            // Redirect to document upload page
            redirectToDocumentUpload();
            
        } catch (error) {
            console.error('❌ Error saving commercial application:', error);
            showNotification('Error saving application. Please try again.', 'error');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 1500);
}

function updateUserProfile(applicationData) {
    // Update user profile with business information
    const updatedUser = {
        ...currentUser,
        businessName: applicationData.businessInfo.businessName,
        contactPosition: applicationData.contactInfo.position,
        businessType: applicationData.businessInfo.businessType
    };
    
    localStorage.setItem('domihive_current_user', JSON.stringify(updatedUser));
    console.log('👤 User profile updated with business information');
}

function redirectToDocumentUpload() {
    console.log('🔄 Redirecting to commercial document upload page...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('application-document-commercial');
    } else {
        // Fallback to direct navigation
        window.location.href = '/Pages/application-document-commercial.html';
    }
}

function goBackToProperty() {
    console.log('↩️ Going back to commercial property...');
    
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

console.log('🎉 Commercial Property Application JavaScript Loaded Successfully!');