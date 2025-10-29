// book-inspection.js - SPA Compatible with Available Dates System

// Nigerian Public Holidays 2024-2028
const NIGERIAN_HOLIDAYS = {
    "2024": [
        "2024-01-01", "2024-03-29", "2024-04-01", "2024-05-01", 
        "2024-05-27", "2024-06-12", "2024-06-16", "2024-09-16", 
        "2024-10-01", "2024-12-25", "2024-12-26"
    ],
    "2025": [
        "2025-01-01", "2025-04-18", "2025-04-21", "2025-05-01", 
        "2025-05-27", "2025-06-12", "2025-06-06", "2025-09-05", 
        "2025-10-01", "2025-12-25", "2025-12-26"
    ],
    "2026": [
        "2026-01-01", "2026-04-03", "2026-04-06", "2026-05-01", 
        "2026-05-27", "2026-06-12", "2026-05-26", "2026-08-25", 
        "2026-10-01", "2026-12-25", "2026-12-26"
    ],
    "2027": [
        "2027-01-01", "2027-03-26", "2027-03-29", "2027-05-01", 
        "2027-05-27", "2027-06-12", "2027-05-16", "2027-08-15", 
        "2027-10-01", "2027-12-25", "2027-12-26"
    ],
    "2028": [
        "2028-01-01", "2028-04-14", "2028-04-17", "2028-05-01", 
        "2028-05-27", "2028-06-12", "2028-05-04", "2028-08-03", 
        "2028-10-01", "2028-12-25", "2028-12-26"
    ]
};

// SPA Integration Function - This is called by your SPA system
window.initializeBookInspection = function() {
    console.log('🏠 SPA: Initializing Book Inspection Page...');
    initBookInspectionPage();
    initEventListeners();
};

// Auto-initialize if loaded directly (non-SPA)
if (window.location.pathname.includes('book-inspection')) {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 Direct load: Initializing Book Inspection Page...');
        initBookInspectionPage();
        initEventListeners();
    });
} else {
    // SPA environment - check if we're on the page and initialize
    setTimeout(function() {
        if (document.querySelector('.book-inspection-page')) {
            console.log('🔍 SPA auto-detected: Initializing Book Inspection Page...');
            initBookInspectionPage();
            initEventListeners();
        }
    }, 500);
}

function initBookInspectionPage() {
    console.log('🏠 Initializing book inspection page...');
    
    // Load property data from localStorage (set in property details)
    const propertyData = getPropertyDataFromStorage();
    
    if (propertyData) {
        updatePropertySummary(propertyData);
        updateBookingContext(propertyData);
    } else {
        // Fallback to demo data
        const demoProperty = getDemoPropertyData();
        updatePropertySummary(demoProperty);
        showNotification('Using demo property data', 'info');
    }
    
    // Initialize available dates system (NEW)
    initializeAvailableDatesSystem();
    
    // Auto-detect and display user context
    displayUserContext();
    
    console.log('✅ Book inspection page initialized');
}

// NEW: Available Dates System Functions
function initializeAvailableDatesSystem() {
    console.log('📅 Initializing available dates system...');
    
    // Debug: Check if elements exist
    console.log('🔍 Checking elements:', {
        availableDates: document.getElementById('availableDates'),
        availableTimes: document.getElementById('availableTimes'),
        inspectionDate: document.getElementById('inspectionDate'),
        inspectionTime: document.getElementById('inspectionTime')
    });
    
    loadAvailableDates();
    setupDateSelection();
}

function loadAvailableDates() {
    const calendarContainer = document.getElementById('availableDates');
    console.log('📆 Loading available dates into:', calendarContainer);
    
    if (!calendarContainer) {
        console.error('❌ Calendar container not found!');
        return;
    }
    
    // Show loading state immediately
    calendarContainer.innerHTML = `
        <div class="calendar-loading">
            <i class="fas fa-spinner fa-spin"></i>
            Loading available dates...
        </div>
    `;
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
        try {
            const availableDates = generateAvailableDates();
            console.log('📊 Generated dates:', availableDates);
            
            if (availableDates.length === 0) {
                console.log('❌ No available dates found');
                calendarContainer.innerHTML = `
                    <div class="no-available-dates">
                        <i class="fas fa-calendar-times"></i>
                        <h4>No Available Dates</h4>
                        <p>Please check back later for available inspection dates</p>
                    </div>
                `;
                return;
            }
            
            console.log('✅ Found available dates:', availableDates.length);
            const datesHTML = availableDates.map(date => createDateOptionHTML(date)).join('');
            calendarContainer.innerHTML = datesHTML;
            
        } catch (error) {
            console.error('❌ Error loading dates:', error);
            calendarContainer.innerHTML = `
                <div class="no-available-dates">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h4>Error Loading Dates</h4>
                    <p>Please refresh the page and try again</p>
                </div>
            `;
        }
    }, 100);
}

function generateAvailableDates() {
    const availableDates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time
    const maxDays = 14; // 2 weeks in advance
    const maxBookingsPerDay = 8; // Increased for testing
    
    console.log('🔄 Generating dates from:', today.toDateString());
    
    for (let i = 1; i <= maxDays; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Skip weekends (Saturday = 6, Sunday = 0)
        if (date.getDay() === 0 || date.getDay() === 6) {
            console.log('⏭️ Skipping weekend:', date.toDateString());
            continue;
        }
        
        // Skip public holidays
        if (isPublicHoliday(date)) {
            console.log('⏭️ Skipping holiday:', date.toDateString());
            continue;
        }
        
        // Check if date has available slots
        const existingBookings = getBookingsForDate(date);
        const availableSlots = maxBookingsPerDay - existingBookings.length;
        
        console.log(`📋 Date: ${date.toDateString()}, Slots: ${availableSlots}, Bookings: ${existingBookings.length}`);
        
        if (availableSlots > 0) {
            availableDates.push({
                date: date.toISOString().split('T')[0],
                dateObj: new Date(date), // Create new instance to avoid reference issues
                availableSlots: availableSlots,
                isNextDay: i === 1
            });
        }
    }
    
    console.log('🎯 Final available dates:', availableDates);
    return availableDates;
}

function createDateOptionHTML(dateInfo) {
    const date = dateInfo.dateObj;
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = dateInfo.date;
    
    let statusClass = '';
    let statusBadge = '';
    
    if (dateInfo.availableSlots <= 2) {
        statusClass = 'date-limited';
        statusBadge = `<div class="date-badge">${dateInfo.availableSlots} left</div>`;
    } else if (dateInfo.isNextDay) {
        statusClass = 'date-next-day';
        statusBadge = '<div class="date-badge">Next Day</div>';
    }
    
    return `
        <div class="date-option ${statusClass}" data-date="${formattedDate}">
            <span class="date-day">${day}</span>
            <span class="date-month">${month}</span>
            <span class="date-weekday">${weekday}</span>
            ${statusBadge}
        </div>
    `;
}

function setupDateSelection() {
    console.log('🎯 Setting up date selection...');
    
    document.addEventListener('click', function(e) {
        if (e.target.closest('.date-option')) {
            const dateOption = e.target.closest('.date-option');
            const selectedDate = dateOption.getAttribute('data-date');
            console.log('📅 Date clicked:', selectedDate);
            selectDate(selectedDate, dateOption);
        }
        
        if (e.target.closest('.time-slot')) {
            const timeSlot = e.target.closest('.time-slot');
            const selectedTime = timeSlot.getAttribute('data-time');
            console.log('⏰ Time clicked:', selectedTime);
            selectTime(selectedTime, timeSlot);
        }
    });
}

function selectDate(dateString, dateElement) {
    // Remove previous selection
    document.querySelectorAll('.date-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection to clicked date
    dateElement.classList.add('selected');
    
    // Update hidden input and display
    document.getElementById('inspectionDate').value = dateString;
    
    const displayText = new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('selectedDateText').textContent = displayText;
    document.getElementById('selectedDateDisplay').style.display = 'flex';
    
    // Load available times for selected date
    loadAvailableTimes(dateString);
    
    console.log('✅ Date selected:', dateString);
}

function loadAvailableTimes(dateString) {
    const timesContainer = document.getElementById('availableTimes');
    console.log('⏰ Loading times for date:', dateString);
    
    if (!timesContainer) {
        console.error('❌ Times container not found!');
        return;
    }
    
    const availableTimes = generateAvailableTimes(dateString);
    console.log('📊 Available times:', availableTimes);
    
    if (availableTimes.length === 0) {
        timesContainer.innerHTML = `
            <div class="no-times-available">
                <i class="fas fa-clock"></i>
                <h4>No Available Times</h4>
                <p>All time slots are booked for this date</p>
            </div>
        `;
        return;
    }
    
    const timesHTML = availableTimes.map(time => createTimeSlotHTML(time, dateString)).join('');
    timesContainer.innerHTML = timesHTML;
}

function generateAvailableTimes(dateString) {
    const availableTimes = [];
    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00',
        '14:00', '15:00', '16:00'
    ];
    
    const existingBookings = getBookingsForDate(new Date(dateString));
    const bookedTimes = existingBookings.map(booking => booking.inspectionTime);
    
    console.log('📋 Existing bookings for date:', existingBookings);
    console.log('🚫 Booked times:', bookedTimes);
    
    timeSlots.forEach(time => {
        if (!bookedTimes.includes(time)) {
            availableTimes.push(time);
        }
    });
    
    return availableTimes;
}

function createTimeSlotHTML(time, dateString) {
    const timeDisplay = formatTimeForDisplay(time);
    return `
        <div class="time-slot" data-time="${time}">
            ${timeDisplay}
        </div>
    `;
}

function selectTime(timeString, timeElement) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Add selection to clicked time
    timeElement.classList.add('selected');
    
    // Update hidden input
    document.getElementById('inspectionTime').value = timeString;
    
    console.log('✅ Time selected:', timeString);
}

// Utility Functions for Available Dates System
function isPublicHoliday(date) {
    const year = date.getFullYear().toString();
    const dateString = date.toISOString().split('T')[0];
    
    if (NIGERIAN_HOLIDAYS[year]) {
        return NIGERIAN_HOLIDAYS[year].includes(dateString);
    }
    
    return false;
}

function getBookingsForDate(date) {
    try {
        const bookings = JSON.parse(localStorage.getItem('domihive_inspection_bookings')) || [];
        const dateString = date.toISOString().split('T')[0];
        
        return bookings.filter(booking => 
            booking.inspectionDate === dateString && booking.status !== 'cancelled'
        );
    } catch (error) {
        console.error('❌ Error getting bookings:', error);
        return [];
    }
}

function formatTimeForDisplay(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// ALL YOUR EXISTING FUNCTIONS BELOW - COMPLETELY UNCHANGED
function getPropertyDataFromStorage() {
    try {
        const propertyData = localStorage.getItem('domihive_selected_property');
        if (propertyData) {
            return JSON.parse(propertyData);
        }
    } catch (error) {
        console.error('Error loading property data:', error);
    }
    return null;
}

function getDemoPropertyData() {
    // Demo data for fallback
    return {
        id: 'demo_001',
        title: "Luxury 3-Bedroom Apartment in Ikoyi",
        price: 4500000,
        location: "Ikoyi, Lagos Island",
        bedrooms: 3,
        bathrooms: 3,
        size: "180 sqm",
        type: "apartment",
        rentalType: "long-term"
    };
}

function updatePropertySummary(property) {
    document.getElementById('inspectionPropertyTitle').textContent = property.title;
    document.getElementById('inspectionPropertyPrice').textContent = formatPrice(property.price, property.rentalType);
    document.getElementById('inspectionPropertyLocation').textContent = property.location;
    document.getElementById('inspectionBedrooms').textContent = property.bedrooms;
    document.getElementById('inspectionBathrooms').textContent = property.bathrooms;
    document.getElementById('inspectionSize').textContent = property.size;
    
    // Update image if available
    if (property.images && property.images[0]) {
        document.getElementById('inspectionPropertyImage').src = property.images[0];
    }
}

function formatPrice(price, rentalType) {
    if (rentalType === 'short-term') {
        return `₦${price.toLocaleString()}/night`;
    } else {
        return `₦${price.toLocaleString()}/year`;
    }
}

function updateBookingContext(property) {
    const contextElement = document.getElementById('bookingContextType');
    if (contextElement) {
        const type = property.rentalType === 'short-term' ? 'Short Let' : 'Rental Property';
        contextElement.textContent = type;
    }
}

function displayUserContext() {
    const currentUser = getCurrentUser();
    const userType = getUserType();

    // Update user display name
    document.getElementById('userDisplayName').textContent = currentUser.name;
    
    // Update dashboard type badge
    const dashboardBadge = document.getElementById('dashboardTypeBadge');
    const dashboardNames = {
        'rent': 'Rental Tenant',
        'short-term': 'Short Let Guest', 
        'student': 'Student',
        'buy': 'Property Buyer'
    };
    
    dashboardBadge.textContent = dashboardNames[userType] || 'Rental Tenant';
    
    // Add specific color based on user type
    const dashboardColors = {
        'rent': '#3498db',
        'short-term': '#f39c12',
        'student': '#9b59b6',
        'buy': '#27ae60'
    };
    
    dashboardBadge.style.backgroundColor = dashboardColors[userType] || '#3498db';
}

function getCurrentUser() {
    // Get user from localStorage or session
    try {
        const savedUser = localStorage.getItem('domihive_current_user');
        if (savedUser) {
            return JSON.parse(savedUser);
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
    
    // Default user data
    const defaultUser = {
        id: 'user_' + Date.now(),
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+2348012345678'
    };
    
    return defaultUser;
}

function getUserType() {
    // Get user type from property data or default to 'rent'
    const propertyData = getPropertyDataFromStorage();
    if (propertyData && propertyData.rentalType) {
        return propertyData.rentalType === 'short-term' ? 'short-term' : 'rent';
    }
    
    // Check localStorage
    const savedType = localStorage.getItem('domihive_user_type');
    return savedType || 'rent';
}

function initEventListeners() {
    // Form submission
    document.getElementById('inspectionBookingForm').addEventListener('submit', handleFormSubmission);
    
    // Back to property button
    document.getElementById('backToPropertyBtn').addEventListener('click', goBackToProperty);
    document.getElementById('backToProperty').addEventListener('click', goBackToProperty);
    
    // Modal buttons
    document.getElementById('closeModalBtn').addEventListener('click', closeSuccessModal);
    document.getElementById('goToDashboardBtn').addEventListener('click', redirectToDashboard);
    document.getElementById('viewApplicationBtn').addEventListener('click', proceedToApplication);
    
    // Real-time form validation
    document.getElementById('numberOfPeople').addEventListener('change', validateForm);
    document.getElementById('agreeTerms').addEventListener('change', validateForm);
    
    // Close modal on background click
    document.getElementById('successModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeSuccessModal();
        }
    });
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    if (validateForm()) {
        const formData = getFormData();
        submitInspectionBooking(formData);
    }
}

function validateForm() {
    const requiredFields = [
        'inspectionDate',
        'inspectionTime', 
        'numberOfPeople',
        'agreeTerms'
    ];
    
    let isValid = true;

    // Clear previous errors
    clearValidationErrors();

    // Check required fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim() && fieldId !== 'agreeTerms') {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else if (fieldId === 'agreeTerms' && !field.checked) {
            showFieldError(field, 'You must agree to the terms and conditions');
            isValid = false;
        }
    });

    return isValid;
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

function clearValidationErrors() {
    const fields = document.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.style.borderColor = '';
    });
    
    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(error => error.remove());
}

function getFormData() {
    const propertyData = getPropertyDataFromStorage() || getDemoPropertyData();
    const currentUser = getCurrentUser();
    const userType = getUserType();
    
    const numberOfPeople = document.getElementById('numberOfPeople').value;
    const peopleText = numberOfPeople === '1' ? '1 person' : `${numberOfPeople} people`;
    
    return {
        // Property Information
        propertyId: propertyData.id,
        propertyTitle: propertyData.title,
        propertyLocation: propertyData.location,
        propertyType: propertyData.type,
        rentalType: propertyData.rentalType || 'long-term',
        
        // User Information
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userPhone: currentUser.phone,
        userType: userType,
        
        // Inspection Details
        inspectionDate: document.getElementById('inspectionDate').value,
        inspectionTime: document.getElementById('inspectionTime').value,
        inspectionNotes: document.getElementById('inspectionNotes').value,
        numberOfPeople: numberOfPeople,
        attendeesText: peopleText,
        
        // System Information
        agreeTerms: document.getElementById('agreeTerms').checked,
        bookingDate: new Date().toISOString(),
        bookingId: 'DOMI-INSP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        status: 'pending',
        source: 'inspection-booking'
    };
}

function submitInspectionBooking(formData) {
    console.log('📅 Submitting inspection booking:', formData);
    
    // Show loading state
    const submitBtn = document.querySelector('#inspectionBookingForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking Inspection...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        try {
            // Save booking to storage
            saveBookingToStorage(formData);
            
            // Create notification
            createBookingNotification(formData);
            
            // Update user applications
            updateUserApplications(formData);
            
            // Show success modal
            showSuccessModal(formData);
            
            console.log('✅ Inspection booking completed:', formData.bookingId);
        } catch (error) {
            console.error('❌ Booking failed:', error);
            showNotification('Booking failed. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 2000);
}

function saveBookingToStorage(bookingData) {
    // Save to bookings storage
    let bookings = JSON.parse(localStorage.getItem('domihive_inspection_bookings')) || [];
    bookings.unshift(bookingData); // Add to beginning
    localStorage.setItem('domihive_inspection_bookings', JSON.stringify(bookings));
    
    // Save as current booking for application flow
    sessionStorage.setItem('domihive_current_booking', JSON.stringify(bookingData));
    
    // Update user type if needed
    localStorage.setItem('domihive_user_type', bookingData.userType);
    
    console.log('💾 Booking saved to storage:', bookingData.bookingId);
}

function createBookingNotification(bookingData) {
    const notification = {
        id: 'notif_' + Date.now(),
        type: 'inspection_booked',
        title: 'Inspection Scheduled ✅',
        message: `Your inspection for ${bookingData.propertyTitle} is scheduled for ${formatDateTime(bookingData.inspectionDate, bookingData.inspectionTime)}`,
        timestamp: new Date().toISOString(),
        read: false,
        action: 'view_booking',
        propertyId: bookingData.propertyId,
        bookingId: bookingData.bookingId,
        priority: 'high'
    };
    
    // Save to notifications
    let notifications = JSON.parse(localStorage.getItem('domihive_notifications')) || [];
    notifications.unshift(notification);
    localStorage.setItem('domihive_notifications', JSON.stringify(notifications));
    
    // Update notification badge count
    updateNotificationBadge();
    
    console.log('🔔 Notification created:', notification.id);
}

function updateUserApplications(bookingData) {
    // Create application entry from booking
    const application = {
        id: 'app_' + Date.now(),
        bookingId: bookingData.bookingId,
        propertyId: bookingData.propertyId,
        propertyTitle: bookingData.propertyTitle,
        propertyLocation: bookingData.propertyLocation,
        type: bookingData.rentalType === 'short-term' ? 'shortlet' : 'rent',
        status: 'inspection_scheduled',
        inspectionDate: bookingData.inspectionDate,
        inspectionTime: bookingData.inspectionTime,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Save to applications
    let applications = JSON.parse(localStorage.getItem('domihive_user_applications')) || [];
    applications.unshift(application);
    localStorage.setItem('domihive_user_applications', JSON.stringify(applications));
    
    console.log('📋 Application created:', application.id);
}

function updateNotificationBadge() {
    // This would update the badge in your main navigation
    // For now, we'll just log it
    const notifications = JSON.parse(localStorage.getItem('domihive_notifications')) || [];
    const unreadCount = notifications.filter(n => !n.read).length;
    console.log('📱 Unread notifications:', unreadCount);
}

function showSuccessModal(bookingData) {
    // Update modal content with booking details
    document.getElementById('summaryPropertyTitle').textContent = bookingData.propertyTitle;
    document.getElementById('summaryDateTime').textContent = formatDateTime(bookingData.inspectionDate, bookingData.inspectionTime);
    document.getElementById('summaryLocation').textContent = bookingData.propertyLocation;
    document.getElementById('summaryAttendees').textContent = bookingData.attendeesText;
    
    // Show modal
    const modal = document.getElementById('successModal');
    modal.style.display = 'flex';
    modal.classList.add('active');
    
    // Auto-redirect after 15 seconds if user doesn't click
    setTimeout(() => {
        if (modal.style.display === 'flex') {
            redirectToDashboard();
        }
    }, 15000);
}

function formatDateTime(date, time) {
    const dateObj = new Date(date + 'T' + time);
    return dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }) + ' at ' + formatTimeDisplay(time);
}

function formatTimeDisplay(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    modal.classList.remove('active');
}

function goBackToProperty() {
    // Use SPA navigation to return to property details
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('property-details');
    } else {
        // Fallback to direct navigation
        const propertyData = getPropertyDataFromStorage();
        if (propertyData && propertyData.id) {
            window.location.href = `/Pages/property-details.html?id=${propertyData.id}`;
        } else {
            window.history.back();
        }
    }
}

function redirectToDashboard() {
    // Use SPA navigation to return to browse page
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('browse');
    } else {
        // Fallback to direct navigation
        window.location.href = '/Pages/spa.html?section=browse';
    }
}

function proceedToApplication() {
    const bookingData = JSON.parse(sessionStorage.getItem('domihive_current_booking'));
    
    if (bookingData) {
        console.log('🚀 Proceeding to application after inspection:', bookingData.bookingId);
        
        // Set flow type to inspection
        sessionStorage.setItem('domihive_application_flow', 'post-inspection');
        
        // Use SPA navigation
        if (window.spa && typeof window.spa.navigateToSection === 'function') {
            window.spa.navigateToSection('application');
        } else {
            // Fallback to direct navigation
            window.location.href = `/Pages/application.html?bookingId=${bookingData.bookingId}`;
        }
    } else {
        // Fallback to dashboard
        redirectToDashboard();
    }
}

// Notification system
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
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b'};
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
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Add CSS animation if not exists
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
    
    // Remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// Floating Call Button Functionality
function initializeFloatingCallButton() {
    const floatingBtn = document.getElementById('floatingCallBtn');
    let scrollTimer;
    let isScrolling = false;

    // Function to show the button
    function showButton() {
        floatingBtn.classList.add('visible');
        clearTimeout(scrollTimer);
    }

    // Function to hide the button after delay
    function hideButton() {
        scrollTimer = setTimeout(() => {
            floatingBtn.classList.remove('visible');
            isScrolling = false;
        }, 30000); // 30 seconds delay
    }

    // Scroll event listener
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            isScrolling = true;
            showButton();
        }
        
        // Reset the hide timer on every scroll
        clearTimeout(scrollTimer);
        hideButton();
    });

    // Make the button clickable to call
    floatingBtn.addEventListener('click', function() {
        window.open('tel:+2349010851071');
    });

    // Also make the phone number in tooltip clickable
    floatingBtn.addEventListener('click', function(e) {
        if (e.target.closest('.call-details') || e.target.closest('.phone-number')) {
            window.open('tel:+2349010851071');
        }
    });

    console.log('📞 Floating call button initialized');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeFloatingCallButton();
});

// Also initialize for SPA
if (typeof initializeFloatingCallButton === 'function') {
    // Call it after a short delay in SPA
    setTimeout(initializeFloatingCallButton, 1000);
}

console.log('🎉 Book Inspection JavaScript loaded successfully');