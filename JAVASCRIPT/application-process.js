// application-process.js - Complete with Employment Logic & Redirection
document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Initializing Application Process (Step 1)...');
    
    // Initialize the application
    initializeApplicationProcess();
});

// Global variables
let currentUser = null;
let currentProperty = null;
let currentBooking = null;

function initializeApplicationProcess() {
    console.log('🏠 Initializing Application Process...');
    
    // Load user data, property information, and booking data
    loadUserData();
    loadPropertyData();
    loadBookingData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Prefill user information
    prefillUserData();
    
    // Initialize employment section
    initializeEmploymentSection();
    
    console.log('✅ Application process initialized');
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
                phone: '+2348012345678',
                userType: 'tenant'
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
            // Demo property data
            currentProperty = {
                id: 'prop_' + Date.now(),
                title: "Luxury 3-Bedroom Apartment in Ikoyi",
                price: 4500000,
                location: "Ikoyi, Lagos Island",
                bedrooms: 3,
                bathrooms: 3,
                size: "180 sqm",
                type: "apartment",
                rentalType: "long-term"
            };
            console.log('⚠️ Using demo property data');
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
    document.getElementById('applicationPropertyPrice').textContent = formatPrice(currentProperty.price, currentProperty.rentalType);
    document.getElementById('applicationPropertyLocation').textContent = currentProperty.location;
    document.getElementById('applicationBedrooms').textContent = currentProperty.bedrooms;
    document.getElementById('applicationBathrooms').textContent = currentProperty.bathrooms;
    document.getElementById('applicationSize').textContent = currentProperty.size;
    
    // Update context type
    const contextElement = document.getElementById('applicationContextType');
    if (contextElement) {
        const type = currentProperty.rentalType === 'short-term' ? 'Short Let Application' : 'Rental Application';
        contextElement.textContent = type;
    }
}

function formatPrice(price, rentalType) {
    if (rentalType === 'short-term') {
        return `₦${price.toLocaleString()}/night`;
    } else {
        return `₦${price.toLocaleString()}/year`;
    }
}

function prefillUserData() {
    if (!currentUser) return;
    
    // Prefill user information
    document.getElementById('prefilledFullName').textContent = currentUser.fullName || 'Not provided';
    document.getElementById('prefilledEmail').textContent = currentUser.email || 'Not provided';
    document.getElementById('prefilledPhone').textContent = currentUser.phone || 'Not provided';
    
    // Prefill additional user data if available
    if (currentUser.dateOfBirth) {
        document.getElementById('dateOfBirth').value = currentUser.dateOfBirth;
    }
    
    if (currentUser.occupation) {
        document.getElementById('occupation').value = currentUser.occupation;
    }
}

function initializeEmploymentSection() {
    // Initially hide employment details
    const employmentDetails = document.getElementById('employmentDetails');
    employmentDetails.style.display = 'none';
    
    // Set all employment fields as not required initially
    const employmentFields = employmentDetails.querySelectorAll('input, select');
    employmentFields.forEach(field => {
        field.required = false;
    });
}

function initializeEventListeners() {
    // Form submission
    document.getElementById('rentalApplicationForm').addEventListener('submit', handleFormSubmission);
    
    // Back button
    document.getElementById('backToPrevious').addEventListener('click', goBackToInspection);
    document.getElementById('backToPreviousBtn').addEventListener('click', goBackToInspection);
    
    // Real-time validation
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
    
    // Date of birth validation (must be at least 18 years old)
    document.getElementById('dateOfBirth').addEventListener('change', validateDateOfBirth);
    
    // Phone number validation for emergency contact
    document.getElementById('emergencyContactPhone').addEventListener('blur', validatePhoneNumber);
}

// Employment Logic Functions
function setEmploymentStatus(isEmployed) {
    const yesBtn = document.querySelector('.yes-btn');
    const noBtn = document.querySelector('.no-btn');
    const employmentDetails = document.getElementById('employmentDetails');
    const hiddenInput = document.getElementById('isEmployed');
    
    console.log('💼 Employment status set to:', isEmployed);
    
    // Update button states
    yesBtn.classList.toggle('active', isEmployed);
    noBtn.classList.toggle('active', !isEmployed);
    
    // Update hidden input
    hiddenInput.value = isEmployed;
    
    // Show/hide employment details section
    if (isEmployed) {
        employmentDetails.style.display = 'block';
        employmentDetails.classList.add('show');
        
        // Make employment fields required
        const employmentFields = employmentDetails.querySelectorAll('input, select');
        employmentFields.forEach(field => {
            field.required = true;
        });
    } else {
        employmentDetails.style.display = 'none';
        employmentDetails.classList.remove('show');
        
        // Clear employment fields and make them not required
        const employmentFields = employmentDetails.querySelectorAll('input, select');
        employmentFields.forEach(field => {
            field.required = false;
            field.value = '';
            clearFieldError({ target: field });
        });
    }
}

// Form Validation and Submission
function handleFormSubmission(event) {
    event.preventDefault();
    console.log('📝 Form submission started...');
    
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
    
    // Validate date of birth (must be at least 18 years old)
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    if (dateOfBirth && !isValidAge(dateOfBirth)) {
        showFieldError(document.getElementById('dateOfBirth'), 'You must be at least 18 years old');
        isValid = false;
    }
    
    // Validate emergency contact phone
    const emergencyPhone = document.getElementById('emergencyContactPhone').value;
    if (emergencyPhone && !isValidPhone(emergencyPhone)) {
        showFieldError(document.getElementById('emergencyContactPhone'), 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate employment details if employed
    const isEmployed = document.getElementById('isEmployed').value === 'true';
    if (isEmployed) {
        const employmentFields = document.querySelectorAll('#employmentDetails [required]');
        employmentFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            }
        });
    }
    
    if (isValid) {
        console.log('✅ Form validation passed');
    } else {
        console.log('❌ Form validation failed');
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
    switch (field.type) {
        case 'tel':
            if (field.value && !isValidPhone(field.value)) {
                showFieldError(field, 'Please enter a valid phone number');
            } else {
                clearFieldError(field);
            }
            break;
        case 'date':
            if (field.id === 'dateOfBirth' && field.value && !isValidAge(field.value)) {
                showFieldError(field, 'You must be at least 18 years old');
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
    if (field.value && !isValidAge(field.value)) {
        showFieldError(field, 'You must be at least 18 years old');
    } else {
        clearFieldError(field);
    }
}

function validatePhoneNumber(event) {
    const field = event.target;
    if (field.value && !isValidPhone(field.value)) {
        showFieldError(field, 'Please enter a valid phone number');
    } else {
        clearFieldError(field);
    }
}

function isValidAge(dateString) {
    const birthDate = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
    }
    return age >= 18;
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
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
    const isEmployed = document.getElementById('isEmployed').value === 'true';
    
    const applicationData = {
        // Application metadata
        applicationId: 'APP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        step: 1,
        propertyId: currentProperty.id,
        propertyTitle: currentProperty.title,
        propertyLocation: currentProperty.location,
        userId: currentUser.id,
        bookingId: currentBooking ? currentBooking.bookingId : null,
        applicationDate: new Date().toISOString(),
        status: 'in_progress',
        currentStep: 'application_details',
        
        // Personal Information
        personalInfo: {
            fullName: currentUser.fullName,
            email: currentUser.email,
            phone: currentUser.phone,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            sex: document.getElementById('sex').value,
            maritalStatus: document.getElementById('maritalStatus').value,
            religion: document.getElementById('religion').value,
            familySize: document.getElementById('familySize').value,
            occupation: document.getElementById('occupation').value
        },
        
        // Employment Information
        employmentInfo: {
            isEmployed: isEmployed,
            employer: isEmployed ? document.getElementById('employer').value : null,
            employmentType: isEmployed ? document.getElementById('employmentType').value : null,
            workDuration: isEmployed ? document.getElementById('workDuration').value : null,
            annualIncome: isEmployed ? document.getElementById('annualIncome').value : null
        },
        
        // Emergency Contact
        emergencyContact: {
            name: document.getElementById('emergencyContactName').value,
            phone: document.getElementById('emergencyContactPhone').value,
            relationship: document.getElementById('emergencyContactRelationship').value,
            email: document.getElementById('emergencyContactEmail').value
        },
        
        // Additional Information
        additionalInfo: {
            notes: document.getElementById('additionalNotes').value
        }
    };
    
    console.log('📦 Form data collected:', applicationData);
    return applicationData;
}

function saveApplicationData(applicationData) {
    console.log('💾 Saving application data...');
    
    // Show loading state
    const submitBtn = document.querySelector('#rentalApplicationForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        try {
            // Save application to localStorage
            let applications = JSON.parse(localStorage.getItem('domihive_rental_applications')) || [];
            applications.push(applicationData);
            localStorage.setItem('domihive_rental_applications', JSON.stringify(applications));
            
            // Store current application in session for next steps
            sessionStorage.setItem('current_rental_application', JSON.stringify(applicationData));
            
            // Update user data with new information
            updateUserProfile(applicationData);
            
            console.log('✅ Application data saved:', applicationData.applicationId);
            
            // Redirect to document upload page
            redirectToDocumentUpload();
            
        } catch (error) {
            console.error('❌ Error saving application:', error);
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
        // Add other fields as needed
    };
    
    localStorage.setItem('domihive_current_user', JSON.stringify(updatedUser));
    console.log('👤 User profile updated');
}

function redirectToDocumentUpload() {
    console.log('🔄 Redirecting to document upload page...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('application-document');
    } else {
        // Fallback to direct navigation
        window.location.href = '/Pages/application-document.html';
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

// Make functions available globally for HTML onclick
window.setEmploymentStatus = setEmploymentStatus;

console.log('🎉 Application Process JavaScript Loaded Successfully!');