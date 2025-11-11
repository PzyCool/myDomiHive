// application-process-shortlet.js - Complete Shortlet Property Application Logic
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Initializing Shortlet Application Process (Step 1)...');
    
    // Initialize the application
    initializeShortletApplicationProcess();
});

// Global variables
let currentUser = null;
let currentProperty = null;
let currentBooking = null;
let guestCount = 1;

// Country phone number validation patterns
const countryPhonePatterns = {
    '+234': /^[789][01]\d{8}$/, // Nigeria: 10 digits starting with 70, 80, 81, 90, 91
    '+233': /^[2345]\d{8}$/, // Ghana: 9 digits starting with 2,3,4,5
    '+254': /^[17]\d{8}$/, // Kenya: 9 digits starting with 1 or 7
    '+27': /^[678]\d{8}$/, // South Africa: 9 digits starting with 6,7,8
    '+1': /^[2-9]\d{9}$/, // USA/Canada: 10 digits, area code 2-9
    '+44': /^[1-9]\d{9}$/, // UK: 10 digits
    '+33': /^[1-9]\d{8}$/, // France: 9 digits
    '+49': /^[1-9]\d{10}$/, // Germany: 11 digits
    '+39': /^[3]\d{9}$/, // Italy: 10 digits starting with 3
    '+34': /^[6789]\d{8}$/, // Spain: 9 digits starting with 6,7,8,9
    '+91': /^[6789]\d{9}$/, // India: 10 digits starting with 6,7,8,9
    '+86': /^[1][3-9]\d{9}$/, // China: 11 digits starting with 13-19
    '+81': /^[789]\d{9}$/, // Japan: 10 digits starting with 7,8,9
    '+82': /^[1]\d{9}$/, // South Korea: 10 digits starting with 1
    '+61': /^[4]\d{8}$/, // Australia: 9 digits starting with 4
    '+55': /^[1-9]\d{9}$/ // Brazil: 10 digits
};

function initializeShortletApplicationProcess() {
    console.log('🏨 Initializing Shortlet Application Process...');
    
    // Load user data, property information, and booking data
    loadUserData();
    loadPropertyData();
    loadBookingData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Prefill user information
    prefillUserData();
    
    // Initialize date restrictions
    initializeDateRestrictions();
    
    console.log('✅ Shortlet application process initialized');
}

function loadUserData() {
    try {
        // Get current user from localStorage
        const userData = localStorage.getItem('domihive_current_user');
        
        if (userData) {
            currentUser = JSON.parse(userData);
            console.log('👤 User data loaded:', currentUser);
        } else {
            // Demo user data for shortlet
            currentUser = {
                id: 'user_' + Date.now(),
                fullName: 'Alex Johnson',
                email: 'alex.johnson@example.com',
                phone: '8012345680',
                countryCode: '+234',
                userType: 'guest'
            };
            console.log('⚠️ Using demo user data for shortlet');
            
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
            console.log('🏨 Shortlet property data loaded:', currentProperty);
        } else {
            // Demo shortlet property data
            currentProperty = {
                id: 'prop_shortlet_' + Date.now(),
                title: "Luxury Serviced Apartment in Lekki",
                price: 85000,
                location: "Lekki Phase 1, Lagos",
                bedrooms: 2,
                bathrooms: 2,
                size: "120 sqm",
                type: "serviced-apartment",
                propertyType: "shortlet",
                amenities: ["wifi", "air-conditioning", "kitchen", "tv", "security"]
            };
            console.log('⚠️ Using demo shortlet property data');
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
    document.getElementById('applicationPropertyPrice').textContent = `₦${currentProperty.price.toLocaleString()}/night`;
    document.getElementById('applicationPropertyLocation').textContent = currentProperty.location;
    document.getElementById('applicationBedrooms').textContent = currentProperty.bedrooms;
    document.getElementById('applicationBathrooms').textContent = currentProperty.bathrooms;
    document.getElementById('applicationSize').textContent = currentProperty.size;
    
    // Update context type
    const contextElement = document.getElementById('applicationContextType');
    if (contextElement) {
        contextElement.textContent = 'Shortlet Application';
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
    
    if (currentUser.nationality) {
        document.getElementById('nationality').value = currentUser.nationality;
    }
}

function initializeDateRestrictions() {
    // Set minimum dates for check-in (tomorrow) and check-out (day after tomorrow)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    const checkInDate = document.getElementById('checkInDate');
    const checkOutDate = document.getElementById('checkOutDate');
    
    // Format dates for input min attribute (YYYY-MM-DD)
    const minCheckIn = tomorrow.toISOString().split('T')[0];
    const minCheckOut = dayAfterTomorrow.toISOString().split('T')[0];
    
    checkInDate.min = minCheckIn;
    checkOutDate.min = minCheckOut;
    
    // Set check-in date to tomorrow by default
    checkInDate.value = minCheckIn;
    checkOutDate.value = minCheckOut;
    
    console.log('📅 Date restrictions initialized');
}

function initializeEventListeners() {
    // Form submission
    document.getElementById('shortletApplicationForm').addEventListener('submit', handleFormSubmission);
    
    // Back buttons
    document.getElementById('backToPrevious').addEventListener('click', goBackToProperty);
    document.getElementById('backToPreviousBtn').addEventListener('click', goBackToProperty);
    
    // Date change listeners
    document.getElementById('checkInDate').addEventListener('change', handleDateChange);
    document.getElementById('checkOutDate').addEventListener('change', handleDateChange);
    
    // Number of guests change
    document.getElementById('numberOfGuests').addEventListener('change', handleGuestsChange);
    
    // Add guest button
    document.getElementById('addGuestBtn').addEventListener('click', addGuestForm);
    
    // Country code change listeners
    document.getElementById('emergencyCountryCode').addEventListener('change', validatePhoneNumberByCountry);
    
    // Phone number validation
    document.getElementById('emergencyContactPhone').addEventListener('blur', validatePhoneNumberByCountry);
    document.getElementById('emergencyContactPhone').addEventListener('input', clearFieldError);
    
    // Real-time validation for other fields
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
        if (field.id !== 'emergencyContactPhone') {
            field.addEventListener('blur', validateField);
            field.addEventListener('input', clearFieldError);
        }
    });
    
    // ID number validation
    document.getElementById('idNumber').addEventListener('blur', validateIdNumber);
}

// Shortlet Specific Functions
function handleDateChange() {
    const checkInDate = document.getElementById('checkInDate').value;
    const checkOutDate = document.getElementById('checkOutDate').value;
    
    if (checkInDate && checkOutDate) {
        validateDates(checkInDate, checkOutDate);
        calculateBookingSummary(checkInDate, checkOutDate);
    }
}

function validateDates(checkIn, checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Check if check-out is after check-in
    if (checkOutDate <= checkInDate) {
        showFieldError(document.getElementById('checkOutDate'), 'Check-out date must be after check-in date');
        return false;
    }
    
    // Check minimum stay (1 night)
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nightDiff = timeDiff / (1000 * 3600 * 24);
    
    if (nightDiff < 1) {
        showFieldError(document.getElementById('checkOutDate'), 'Minimum stay is 1 night');
        return false;
    }
    
    // Check maximum stay (90 days)
    if (nightDiff > 90) {
        showFieldError(document.getElementById('checkOutDate'), 'Maximum stay is 90 nights');
        return false;
    }
    
    clearFieldError({ target: document.getElementById('checkOutDate') });
    return true;
}

function calculateBookingSummary(checkIn, checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Calculate nights
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Get nightly rate
    const nightlyRate = currentProperty.price;
    const estimatedTotal = nights * nightlyRate;
    
    // Format dates for display
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const stayDuration = `${checkInDate.toLocaleDateString('en-US', options)} - ${checkOutDate.toLocaleDateString('en-US', options)}`;
    
    // Update booking summary
    document.getElementById('stayDuration').textContent = stayDuration;
    document.getElementById('totalNights').textContent = `${nights} night${nights > 1 ? 's' : ''}`;
    document.getElementById('nightlyRate').textContent = `₦${nightlyRate.toLocaleString()}/night`;
    document.getElementById('estimatedTotal').textContent = `₦${estimatedTotal.toLocaleString()}`;
    
    // Show booking summary
    document.getElementById('bookingSummary').style.display = 'block';
    
    console.log('💰 Booking summary calculated:', { nights, estimatedTotal });
}

function handleGuestsChange() {
    const numberOfGuests = parseInt(document.getElementById('numberOfGuests').value);
    const additionalGuestsSection = document.getElementById('additionalGuestsSection');
    const additionalGuestsForms = document.getElementById('additionalGuestsForms');
    
    // Show/hide additional guests section
    if (numberOfGuests > 1) {
        additionalGuestsSection.style.display = 'block';
    } else {
        additionalGuestsSection.style.display = 'none';
        // Clear any existing guest forms
        additionalGuestsForms.innerHTML = '';
        guestCount = 1;
        return;
    }
    
    // Clear existing guest forms
    additionalGuestsForms.innerHTML = '';
    guestCount = 1;
    
    // Add guest forms based on number of guests (excluding the primary guest)
    // If user selects 2 guests, we need 1 additional guest form
    // If user selects 3 guests, we need 2 additional guest forms, etc.
    const additionalGuestsNeeded = numberOfGuests - 1;
    
    for (let i = 1; i <= additionalGuestsNeeded; i++) {
        addGuestForm(i + 1); // Start from guest 2
    }
    
    console.log('👥 Guest count updated:', numberOfGuests, 'Additional guests needed:', additionalGuestsNeeded);
}

function addGuestForm(guestNumber = null) {
    if (!guestNumber) {
        // Only allow adding more guests if we haven't exceeded the selected total
        const numberOfGuests = parseInt(document.getElementById('numberOfGuests').value);
        const currentAdditionalGuests = guestCount - 1; // Subtract primary guest
        
        if (currentAdditionalGuests >= numberOfGuests - 1) {
            showNotification('Cannot add more guests than selected in "Number of Guests"', 'error');
            return;
        }
        
        guestCount++;
        guestNumber = guestCount;
    }
    
    const additionalGuestsForms = document.getElementById('additionalGuestsForms');
    
    const guestForm = document.createElement('div');
    guestForm.className = 'guest-form';
    guestForm.id = `guest${guestNumber}`;
    guestForm.innerHTML = `
        <div class="guest-header">
            <h4>Guest ${guestNumber} Details</h4>
            <button type="button" class="remove-guest-btn" onclick="removeGuestForm(${guestNumber})">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="form-grid">
            <div class="form-group">
                <label for="guest${guestNumber}Name" class="required">Full Name</label>
                <input type="text" id="guest${guestNumber}Name" name="guest${guestNumber}Name" 
                       placeholder="Guest full name" required>
            </div>
            <div class="form-group">
                <label for="guest${guestNumber}Relationship" class="required">Relationship</label>
                <select id="guest${guestNumber}Relationship" name="guest${guestNumber}Relationship" required>
                    <option value="">Select relationship</option>
                    <option value="spouse">Spouse/Partner</option>
                    <option value="child">Child</option>
                    <option value="friend">Friend</option>
                    <option value="colleague">Colleague</option>
                    <option value="other">Other</option>
                </select>
            </div>
        </div>
    `;
    
    additionalGuestsForms.appendChild(guestForm);
    
    // Add event listeners for new fields
    document.getElementById(`guest${guestNumber}Name`).addEventListener('blur', validateField);
    document.getElementById(`guest${guestNumber}Relationship`).addEventListener('blur', validateField);
    
    console.log('👤 Guest form added:', guestNumber);
}

function removeGuestForm(guestNumber) {
    const guestForm = document.getElementById(`guest${guestNumber}`);
    if (guestForm) {
        guestForm.remove();
        guestCount--;
        console.log('👤 Guest form removed:', guestNumber);
        
        // Update the guest numbers for remaining forms
        updateGuestFormNumbers();
    }
}

function updateGuestFormNumbers() {
    const guestForms = document.querySelectorAll('.guest-form');
    guestForms.forEach((form, index) => {
        const newGuestNumber = index + 2; // Start from guest 2
        const oldGuestNumber = form.id.replace('guest', '');
        
        if (newGuestNumber !== parseInt(oldGuestNumber)) {
            // Update the form ID
            form.id = `guest${newGuestNumber}`;
            
            // Update the header
            const header = form.querySelector('h4');
            header.textContent = `Guest ${newGuestNumber} Details`;
            
            // Update input names and IDs
            const nameInput = form.querySelector('input[type="text"]');
            const relationshipSelect = form.querySelector('select');
            
            nameInput.id = `guest${newGuestNumber}Name`;
            nameInput.name = `guest${newGuestNumber}Name`;
            
            relationshipSelect.id = `guest${newGuestNumber}Relationship`;
            relationshipSelect.name = `guest${newGuestNumber}Relationship`;
            
            // Update remove button onclick
            const removeBtn = form.querySelector('.remove-guest-btn');
            removeBtn.setAttribute('onclick', `removeGuestForm(${newGuestNumber})`);
        }
    });
}

// Phone Number Validation with Country Code
function validatePhoneNumberByCountry(event) {
    const phoneInput = document.getElementById('emergencyContactPhone');
    const countryCodeSelect = document.getElementById('emergencyCountryCode');
    const phoneNumber = phoneInput.value.trim();
    const countryCode = countryCodeSelect.value;
    
    if (!phoneNumber) {
        showFieldError(phoneInput, 'Phone number is required');
        return false;
    }
    
    // Get validation pattern for selected country
    const pattern = countryPhonePatterns[countryCode];
    if (pattern && !pattern.test(phoneNumber)) {
        const countryName = getCountryName(countryCode);
        showFieldError(phoneInput, `Please enter a valid ${countryName} phone number`);
        return false;
    }
    
    clearFieldError({ target: phoneInput });
    return true;
}

function getCountryName(countryCode) {
    const countryNames = {
        '+234': 'Nigerian',
        '+233': 'Ghanaian',
        '+254': 'Kenyan',
        '+27': 'South African',
        '+1': 'US/Canadian',
        '+44': 'UK',
        '+33': 'French',
        '+49': 'German',
        '+39': 'Italian',
        '+34': 'Spanish',
        '+91': 'Indian',
        '+86': 'Chinese',
        '+81': 'Japanese',
        '+82': 'South Korean',
        '+61': 'Australian',
        '+55': 'Brazilian'
    };
    
    return countryNames[countryCode] || 'phone';
}

// Form Validation and Submission
function handleFormSubmission(event) {
    event.preventDefault();
    console.log('📝 Shortlet application form submission started...');
    
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
    
    // Validate dates
    const checkInDate = document.getElementById('checkInDate').value;
    const checkOutDate = document.getElementById('checkOutDate').value;
    if (checkInDate && checkOutDate && !validateDates(checkInDate, checkOutDate)) {
        isValid = false;
    }
    
    // Validate ID number
    const idNumber = document.getElementById('idNumber').value;
    if (idNumber && !isValidIdNumber(idNumber)) {
        showFieldError(document.getElementById('idNumber'), 'Please enter a valid ID number');
        isValid = false;
    }
    
    // Validate emergency contact phone number with country code
    if (!validatePhoneNumberByCountry()) {
        isValid = false;
    }
    
    // Validate additional guests if there are any
    const numberOfGuests = parseInt(document.getElementById('numberOfGuests').value);
    if (numberOfGuests > 1) {
        // Check if we have the correct number of guest forms
        const additionalGuestsNeeded = numberOfGuests - 1;
        const currentAdditionalGuests = document.querySelectorAll('.guest-form').length;
        
        if (currentAdditionalGuests < additionalGuestsNeeded) {
            showNotification(`Please provide details for all ${additionalGuestsNeeded} additional guest(s)`, 'error');
            isValid = false;
        }
        
        // Validate each additional guest form
        for (let i = 2; i <= numberOfGuests; i++) {
            const guestName = document.getElementById(`guest${i}Name`);
            const guestRelationship = document.getElementById(`guest${i}Relationship`);
            
            if (guestName && (!guestName.value.trim() || !guestRelationship.value)) {
                showFieldError(guestName, 'Guest name and relationship are required');
                isValid = false;
            }
        }
    }
    
    // Validate terms agreements
    const requiredCheckboxes = [
        'agreeHouseRules',
        'agreeDamagePolicy',
        'agreeCancellationPolicy',
        'agreePrivacyPolicy'
    ];
    
    requiredCheckboxes.forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        if (!checkbox.checked) {
            showFieldError(checkbox, 'This agreement is required');
            isValid = false;
        }
    });
    
    if (isValid) {
        console.log('✅ Shortlet form validation passed');
    } else {
        console.log('❌ Shortlet form validation failed');
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

function validateIdNumber(event) {
    const field = event.target;
    if (field.value && !isValidIdNumber(field.value)) {
        showFieldError(field, 'Please enter a valid ID number');
    } else {
        clearFieldError(field);
    }
}

function isValidIdNumber(idNumber) {
    // Basic ID number validation
    const idRegex = /^[A-Z0-9]{8,20}$/i;
    return idRegex.test(idNumber.trim());
}

function showFieldError(field, message) {
    field.style.borderColor = '#e53e3e';
    
    // For phone input group, add error class to parent
    if (field.id === 'emergencyContactPhone') {
        field.parentNode.classList.add('error');
    }
    
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
    
    // For phone input group, remove error class
    if (field.id === 'emergencyContactPhone') {
        field.parentNode.classList.remove('error');
    }
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearValidationErrors() {
    const fields = document.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.style.borderColor = '';
        if (field.parentNode.classList.contains('phone-input-group')) {
            field.parentNode.classList.remove('error');
        }
    });
    
    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(error => error.remove());
}

function collectFormData() {
    const checkInDate = document.getElementById('checkInDate').value;
    const checkOutDate = document.getElementById('checkOutDate').value;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 3600 * 24));
    const totalCost = nights * currentProperty.price;
    
    const numberOfGuests = parseInt(document.getElementById('numberOfGuests').value);
    
    // Collect guest information
    const guests = [];
    const additionalGuests = [];
    
    // Primary guest (user)
    guests.push({
        name: currentUser.fullName,
        relationship: 'primary',
        isPrimary: true,
        guestNumber: 1
    });
    
    // Additional guests (only if numberOfGuests > 1)
    if (numberOfGuests > 1) {
        for (let i = 2; i <= numberOfGuests; i++) {
            const guestName = document.getElementById(`guest${i}Name`);
            const guestRelationship = document.getElementById(`guest${i}Relationship`);
            
            if (guestName && guestName.value.trim()) {
                const guestData = {
                    name: guestName.value,
                    relationship: guestRelationship ? guestRelationship.value : 'other',
                    isPrimary: false,
                    guestNumber: i
                };
                guests.push(guestData);
                additionalGuests.push(guestData);
            }
        }
    }
    
    const applicationData = {
        // Application metadata
        applicationId: 'SHORT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
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
        applicationType: 'shortlet',
        
        // Guest Information
        guestInfo: {
            primaryGuest: {
                fullName: currentUser.fullName,
                email: currentUser.email,
                phone: currentUser.phone,
                countryCode: document.getElementById('userCountryCode').value,
                dateOfBirth: document.getElementById('dateOfBirth').value,
                nationality: document.getElementById('nationality').value,
                idType: document.getElementById('idType').value,
                idNumber: document.getElementById('idNumber').value
            },
            additionalGuests: additionalGuests,
            totalGuests: numberOfGuests,
            hasAdditionalGuests: numberOfGuests > 1
        },
        
        // Booking Details
        bookingInfo: {
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            nights: nights,
            numberOfGuests: numberOfGuests,
            purposeOfStay: document.getElementById('purposeOfStay').value,
            estimatedCheckInTime: document.getElementById('checkInTime').value,
            specialRequirements: document.getElementById('specialRequirements').value
        },
        
        // Financial Information
        financialInfo: {
            nightlyRate: currentProperty.price,
            totalNights: nights,
            estimatedTotal: totalCost
        },
        
        // Emergency Contact
        emergencyContact: {
            name: document.getElementById('emergencyContactName').value,
            phone: document.getElementById('emergencyContactPhone').value,
            countryCode: document.getElementById('emergencyCountryCode').value,
            relationship: document.getElementById('emergencyContactRelationship').value,
            email: document.getElementById('emergencyContactEmail').value
        },
        
        // Terms Agreement
        termsAgreed: {
            houseRules: document.getElementById('agreeHouseRules').checked,
            damagePolicy: document.getElementById('agreeDamagePolicy').checked,
            cancellationPolicy: document.getElementById('agreeCancellationPolicy').checked,
            privacyPolicy: document.getElementById('agreePrivacyPolicy').checked
        }
    };
    
    console.log('📦 Shortlet form data collected:', applicationData);
    console.log('👥 Guest breakdown:', {
        totalGuests: numberOfGuests,
        primaryGuest: 1,
        additionalGuests: additionalGuests.length,
        guestList: guests.map(g => ({ name: g.name, relationship: g.relationship }))
    });
    
    return applicationData;
}

function saveApplicationData(applicationData) {
    console.log('💾 Saving shortlet application data...');
    
    // Show loading state
    const submitBtn = document.querySelector('#shortletApplicationForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        try {
            // Save application to localStorage
            let applications = JSON.parse(localStorage.getItem('domihive_shortlet_applications')) || [];
            applications.push(applicationData);
            localStorage.setItem('domihive_shortlet_applications', JSON.stringify(applications));
            
            // Store current application in session for next steps
            sessionStorage.setItem('current_shortlet_application', JSON.stringify(applicationData));
            
            // Update user data with new information
            updateUserProfile(applicationData);
            
            console.log('✅ Shortlet application data saved:', applicationData.applicationId);
            
            // Redirect to document upload page
            redirectToDocumentUpload();
            
        } catch (error) {
            console.error('❌ Error saving shortlet application:', error);
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
        dateOfBirth: applicationData.guestInfo.primaryGuest.dateOfBirth,
        nationality: applicationData.guestInfo.primaryGuest.nationality,
        countryCode: applicationData.guestInfo.primaryGuest.countryCode
    };
    
    localStorage.setItem('domihive_current_user', JSON.stringify(updatedUser));
    console.log('👤 User profile updated with shortlet information');
}

function redirectToDocumentUpload() {
    console.log('🔄 Redirecting to shortlet document upload page...');
    
    // Redirect to step 2 - document upload page
    window.location.href = '/Pages/application-document-shortlet.html';
}

function goBackToProperty() {
    console.log('↩️ Going back to shortlet property...');
    
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

// Make functions available globally for HTML onclick
window.removeGuestForm = removeGuestForm;

console.log('🎉 Shortlet Application JavaScript Loaded Successfully!');