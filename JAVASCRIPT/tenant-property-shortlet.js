// tenant-property-shortlet.js - Complete Short-Let Property Management System

// ===== SPA INTEGRATION =====
window.spaTenantPropertyShortletInit = function() {
    console.log('🎯 SPA: Initializing Short-Let Property Content');
    initializeShortletProperty();
};

// ===== AUTO-INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded - checking shortlet initialization...');
    
    const isShortletPage = window.location.pathname.includes('tenant-property-shortlet.html');
    const hasPropertyContent = document.querySelector('.tenant-property-content');
    const hasPropertyOverview = document.getElementById('propertyOverview');
    
    if (isShortletPage || hasPropertyContent || hasPropertyOverview) {
        console.log('🚀 Auto-initializing Shortlet Property...');
        setTimeout(initializeShortletProperty, 100);
    }
});

// ===== MAIN INITIALIZATION =====
function initializeShortletProperty() {
    console.log('🏨 Initializing Short-Let Property Page...');
    
    try {
        loadShortletPropertyData();
        initializeTabSystem();
        initializeEventListeners();
        initializeReviewSystem();
        initializeModalSystems();
        
        console.log('✅ Short-Let Property page initialized successfully');
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        showNotification('Failed to initialize page', 'error');
    }
}

// ===== PROPERTY DATA MANAGEMENT =====
function loadShortletPropertyData() {
    console.log('📦 Loading shortlet property data...');
    
    const propertyId = sessionStorage.getItem('currentPropertyId');
    console.log('🔑 Property ID from session:', propertyId);
    
    if (!propertyId) {
        console.log('❌ No property ID found, creating demo...');
        createDemoShortletPropertyData();
        return;
    }
    
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const property = userProperties.find(p => p.id === propertyId);
    
    if (property) {
        console.log('✅ Found property:', property.title);
        renderShortletPropertyPage(property);
    } else {
        console.log('❌ Property not found, creating demo...');
        createDemoShortletPropertyData();
    }
}

function createDemoShortletPropertyData() {
    console.log('🏗️ Creating demo shortlet property data...');
    
    const demoProperty = {
        id: 'demo_shortlet_1',
        title: 'Luxury Studio Apartment in VI',
        location: '24A Adeola Odeku, Victoria Island, Lagos',
        price: 37000,
        image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
        propertyType: 'shortlet',
        checkIn: '2024-02-20',
        checkOut: '2024-02-25',
        duration: 5,
        status: 'active',
        totalAmount: 185000,
        paymentStatus: 'paid',
        guests: 2,
        documents: {
            bookingConfirmation: { signed: true, signedDate: '2024-02-15' },
            houseRules: { signed: true, signedDate: '2024-02-15' },
            checkInInstructions: { signed: true, signedDate: '2024-02-15' },
            receipt: { signed: true, signedDate: '2024-02-15' }
        },
        updates: [
            {
                date: '2024-02-18',
                title: 'Check-In Instructions Sent 📧',
                content: 'Your check-in instructions and access codes have been sent to your email. Check-in time is from 3:00 PM onwards.'
            },
            {
                date: '2024-02-19',
                title: 'Welcome Package Prepared 🎁',
                content: 'Your welcome package with complimentary snacks, drinks, and local guides has been prepared and will be waiting in your apartment.'
            },
            {
                date: '2024-02-21',
                title: 'Housekeeping Scheduled 🧹',
                content: 'Regular housekeeping is scheduled for your stay. If you need additional cleaning services, please use the "Request Cleaning" button.'
            }
        ],
        amenities: [
            'Free WiFi', 'Air Conditioning', 'Smart TV', 'Fully Equipped Kitchen',
            'Swimming Pool Access', '24/7 Security', 'Daily Housekeeping',
            'Concierge Service', 'Parking Space'
        ]
    };
    
    // Save to localStorage for persistence
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    if (!userProperties.find(p => p.id === demoProperty.id)) {
        userProperties.push(demoProperty);
        localStorage.setItem('domihive_user_properties', JSON.stringify(userProperties));
    }
    
    renderShortletPropertyPage(demoProperty);
}

function renderShortletPropertyPage(property) {
    console.log('🎨 Rendering shortlet property page...');
    
    updatePageHeader(property);
    renderShortletPropertyOverview(property);
    renderGuestStayOverview(property);
    loadTabData('stay-management');
}

function updatePageHeader(property) {
    const titleElement = document.getElementById('propertyPageTitle');
    const subtitleElement = document.getElementById('propertyPageSubtitle');
    
    if (titleElement) {
        titleElement.innerHTML = `<i class="fas fa-calendar-day"></i>${property.title}`;
    }
    
    if (subtitleElement) {
        subtitleElement.textContent = `Managing your short-term stay in ${property.location}`;
    }
}

function renderShortletPropertyOverview(property) {
    const overviewElement = document.getElementById('propertyOverview');
    
    if (!overviewElement) {
        console.error('❌ Property overview element not found');
        return;
    }
    
    overviewElement.innerHTML = `
        <div class="property-overview-image">
            <img src="${property.image}" alt="${property.title}" onerror="this.src='/ASSECT/placeholder-property.jpg'">
        </div>
        <div class="property-overview-info">
            <h2>${property.title}</h2>
            <div class="property-overview-price">₦${property.price.toLocaleString()}/night</div>
            <div class="property-overview-location">
                <i class="fas fa-map-marker-alt"></i>
                ${property.location}
            </div>
            <div class="property-overview-meta">
                <div class="meta-item">
                    <span class="meta-label">Guests</span>
                    <span class="meta-value">${property.guests || 2}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Property Type</span>
                    <span class="meta-value">Short-Let</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Status</span>
                    <span class="meta-value" style="color: ${property.status === 'active' ? '#10b981' : '#f59e0b'}">
                        ${property.status === 'active' ? 'Active Stay' : 'Completed'}
                    </span>
                </div>
            </div>
        </div>
    `;
}

function renderGuestStayOverview(property) {
    const stayOverviewElement = document.getElementById('guestStayOverview');
    
    if (!stayOverviewElement) {
        console.error('❌ Guest stay overview element not found');
        return;
    }
    
    // SAFE DATA ACCESS with fallbacks
    const checkIn = property?.checkIn || 'N/A';
    const checkOut = property?.checkOut || 'N/A';
    const duration = property?.duration || 0;
    const totalAmount = property?.totalAmount || 0;
    const paymentStatus = property?.paymentStatus || 'pending';
    const nightsRemaining = calculateNightsRemaining(checkOut);
    
    stayOverviewElement.innerHTML = `
        <h3>Guest Stay Overview</h3>
        <div class="stay-details-grid">
            <div class="stay-detail-card">
                <div class="stay-detail-label">Check-In</div>
                <div class="stay-detail-value">${formatDate(checkIn)}</div>
            </div>
            <div class="stay-detail-card">
                <div class="stay-detail-label">Check-Out</div>
                <div class="stay-detail-value">${formatDate(checkOut)}</div>
            </div>
            <div class="stay-detail-card">
                <div class="stay-detail-label">Duration</div>
                <div class="stay-detail-value">${duration} nights</div>
            </div>
            <div class="stay-detail-card">
                <div class="stay-detail-label">Total Amount</div>
                <div class="stay-detail-value amount">₦${totalAmount.toLocaleString()}</div>
            </div>
            <div class="stay-detail-card">
                <div class="stay-detail-label">Payment Status</div>
                <div class="stay-detail-value status-paid">${paymentStatus === 'paid' ? 'Paid' : 'Pending'}</div>
            </div>
            <div class="stay-detail-card">
                <div class="stay-detail-label">Nights Remaining</div>
                <div class="stay-detail-value">${nightsRemaining}</div>
            </div>
        </div>
    `;
}
// ===== TAB SYSTEM =====
function initializeTabSystem() {
    console.log('📑 Initializing tab system...');
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab, this);
        });
    });
    
    // Set first tab as active
    if (tabButtons.length > 0) {
        const firstTab = document.querySelector('.tab-btn');
        if (firstTab) {
            firstTab.classList.add('active');
            const firstTabContent = document.getElementById('stay-management-content');
            if (firstTabContent) firstTabContent.classList.add('active');
        }
    }
    
    console.log('✅ Tab system initialized');
}

function switchTab(tabName, clickedButton) {
    console.log('🔄 Switching to tab:', tabName);
    
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    clickedButton.classList.add('active');
    
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show target tab content
    const targetContent = document.getElementById(`${tabName}-content`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Load tab-specific data
    loadTabData(tabName);
}

function loadTabData(tabName) {
    console.log('📦 Loading data for tab:', tabName);
    
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const property = userProperties.find(p => p.id === propertyId);
    
    if (!property) {
        console.log('❌ No property data found for tab loading');
        return;
    }
    
    switch(tabName) {
        case 'updates':
            loadUpdatesData(property);
            break;
        case 'rate':
            loadReviewHistory();
            break;
    }
}

function loadUpdatesData(property) {
    const updatesElement = document.getElementById('updatesList');
    
    if (!updatesElement) {
        console.error('❌ Updates element not found');
        return;
    }
    
    if (!property.updates || property.updates.length === 0) {
        updatesElement.innerHTML = `
            <div class="empty-updates">
                <i class="fas fa-bullhorn"></i>
                <h4>No Updates Available</h4>
                <p>Property updates and announcements will appear here</p>
            </div>
        `;
        return;
    }
    
    const updatesHTML = property.updates.map(update => `
        <div class="update-item">
            <div class="update-date">${formatDate(update.date)}</div>
            <div class="update-title">${update.title}</div>
            <div class="update-content">${update.content}</div>
        </div>
    `).join('');
    
    updatesElement.innerHTML = updatesHTML;
    console.log('✅ Updates loaded:', property.updates.length);
}

// ===== MODAL MANAGEMENT =====
function initializeModalSystems() {
    console.log('🎪 Initializing modal systems...');
    
    // Initialize cleaning type descriptions
    initializeCleaningDescriptions();
    
    console.log('✅ Modal systems initialized');
}

function initializeCleaningDescriptions() {
    const cleaningType = document.getElementById('cleaningType');
    if (cleaningType) {
        cleaningType.addEventListener('change', function() {
            // Hide all descriptions
            document.querySelectorAll('.cleaning-description p').forEach(p => {
                p.classList.add('desc-hidden');
            });
            
            // Show selected description
            const selectedDesc = document.getElementById(`${this.value}-desc`);
            if (selectedDesc) {
                selectedDesc.classList.remove('desc-hidden');
            }
        });
    }
}

// ===== CLEANING MODAL FUNCTIONS =====
window.openCleaningModal = function() {
    console.log('🧹 Opening cleaning modal...');
    document.getElementById('cleaningModal').classList.add('active');
    calculateCleaningCost(); // Initial calculation
};

window.closeCleaningModal = function() {
    document.getElementById('cleaningModal').classList.remove('active');
    // Reset form
    document.getElementById('cleaningType').value = '';
    document.getElementById('cleaningDuration').value = '1';
    document.getElementById('cleaningDate').value = '';
    document.getElementById('cleaningTime').value = '';
};

window.calculateCleaningCost = function() {
    const cleaningType = document.getElementById('cleaningType');
    const cleaningDuration = document.getElementById('cleaningDuration');
    
    if (!cleaningType.value || !cleaningDuration.value) {
        return;
    }
    
    const selectedOption = cleaningType.selectedOptions[0];
    const pricePerSession = parseInt(selectedOption.dataset.price) || 0;
    const days = parseInt(cleaningDuration.value) || 1;
    const totalCost = pricePerSession * days;
    
    document.getElementById('cleaningTypePrice').textContent = `₦${pricePerSession.toLocaleString()}`;
    document.getElementById('cleaningDays').textContent = days;
    document.getElementById('cleaningTotalCost').textContent = `₦${totalCost.toLocaleString()}`;
};

window.proceedToCleaningPayment = function() {
    const cleaningType = document.getElementById('cleaningType').value;
    const cleaningDuration = document.getElementById('cleaningDuration').value;
    
    if (!cleaningType) {
        showNotification('Please select a cleaning type', 'error');
        return;
    }
    
    const selectedOption = document.getElementById('cleaningType').selectedOptions[0];
    const pricePerSession = parseInt(selectedOption.dataset.price) || 0;
    const days = parseInt(cleaningDuration) || 1;
    const totalCost = pricePerSession * days;
    
    console.log('💰 Proceeding to cleaning payment:', { cleaningType, days, totalCost });
    
    // Update payment section
    document.getElementById('breakdownNights').textContent = `₦${totalCost.toLocaleString()}`;
    document.getElementById('breakdownService').textContent = '₦0';
    document.getElementById('breakdownTotal').textContent = `₦${totalCost.toLocaleString()}`;
    document.getElementById('totalPaymentAmount').value = totalCost;
    
    // Show payment section and hide modal
    closeCleaningModal();
    document.getElementById('paymentSection').style.display = 'block';
    
    // Scroll to payment section
    document.getElementById('paymentSection').scrollIntoView({ behavior: 'smooth' });
    
    showNotification('Please complete payment for cleaning services', 'info');
};

// ===== MAINTENANCE MODAL FUNCTIONS =====
window.openMaintenanceModal = function() {
    console.log('🔧 Opening maintenance modal...');
    document.getElementById('maintenanceModal').classList.add('active');
};

window.closeMaintenanceModal = function() {
    document.getElementById('maintenanceModal').classList.remove('active');
    // Reset form
    document.getElementById('issueType').value = '';
    document.getElementById('issueDescription').value = '';
    document.getElementById('issuePhoto').value = '';
};

window.submitMaintenanceRequest = function() {
    const issueType = document.getElementById('issueType').value;
    const issueDescription = document.getElementById('issueDescription').value;
    
    if (!issueType || !issueDescription) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    console.log('🔧 Submitting maintenance request:', { issueType, issueDescription });
    
    // Create maintenance request object
    const maintenanceRequest = {
        id: 'maintenance_' + Date.now(),
        propertyId: sessionStorage.getItem('currentPropertyId'),
        issueType: issueType,
        issueDescription: issueDescription,
        submittedAt: new Date().toISOString(),
        status: 'submitted'
    };
    
    // Save to localStorage
    const maintenanceRequests = JSON.parse(localStorage.getItem('domihive_maintenance_requests') || '[]');
    maintenanceRequests.push(maintenanceRequest);
    localStorage.setItem('domihive_maintenance_requests', JSON.stringify(maintenanceRequests));
    
    showNotification('Maintenance request submitted successfully! Our team will contact you within 30 minutes.', 'success');
    closeMaintenanceModal();
};

// ===== EXTEND STAY MODAL FUNCTIONS =====
window.openExtendStayModal = function() {
    console.log('📅 Opening extend stay modal...');
    document.getElementById('extendStayModal').classList.add('active');
    calculateExtensionCost(); // Initial calculation
};

window.closeExtendStayModal = function() {
    document.getElementById('extendStayModal').classList.remove('active');
};

window.calculateExtensionCost = function() {
    const extendDays = parseInt(document.getElementById('extendDays').value) || 1;
    const nightlyRate = 37000; // This should come from property data
    const serviceFee = 0;
    
    const additionalNightsPrice = nightlyRate * extendDays;
    const extendTotalPrice = additionalNightsPrice + serviceFee;
    
    document.getElementById('additionalNightsPrice').textContent = `₦${additionalNightsPrice.toLocaleString()}`;
    document.getElementById('serviceFee').textContent = `₦${serviceFee.toLocaleString()}`;
    document.getElementById('extendTotalPrice').textContent = `₦${extendTotalPrice.toLocaleString()}`;
};

window.proceedToPayment = function() {
    const extendDays = parseInt(document.getElementById('extendDays').value) || 1;
    const nightlyRate = 37000;
    const totalAmount = nightlyRate * extendDays;
    
    console.log('💰 Proceeding to payment for extension:', { extendDays, totalAmount });
    
    // Update payment section with extension details
    document.getElementById('breakdownNights').textContent = `₦${totalAmount.toLocaleString()}`;
    document.getElementById('breakdownService').textContent = '₦0';
    document.getElementById('breakdownTotal').textContent = `₦${totalAmount.toLocaleString()}`;
    document.getElementById('totalPaymentAmount').value = totalAmount;
    
    // Show payment section and hide modal
    closeExtendStayModal();
    document.getElementById('paymentSection').style.display = 'block';
    
    // Scroll to payment section
    document.getElementById('paymentSection').scrollIntoView({ behavior: 'smooth' });
    
    showNotification('Please complete payment to extend your stay', 'info');
};

// ===== MESSAGE HOST MODAL FUNCTIONS =====
window.openMessageHostModal = function() {
    console.log('💬 Opening message host modal...');
    document.getElementById('messageHostModal').classList.add('active');
};

window.closeMessageHostModal = function() {
    document.getElementById('messageHostModal').classList.remove('active');
    // Clear message input
    document.getElementById('messageInput').value = '';
};

window.sendMessage = function() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) {
        showNotification('Please enter a message', 'error');
        return;
    }
    
    const chatMessages = document.getElementById('chatMessages');
    
    // Add sent message
    const messageElement = document.createElement('div');
    messageElement.className = 'message sent';
    messageElement.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
        <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
    `;
    
    chatMessages.appendChild(messageElement);
    
    // Clear input
    messageInput.value = '';
    
    // Simulate reply after 2 seconds
    setTimeout(() => {
        const replyElement = document.createElement('div');
        replyElement.className = 'message received';
        replyElement.innerHTML = `
            <div class="message-content">
                <p>Thank you for your message. Our team will get back to you shortly.</p>
            </div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        `;
        
        chatMessages.appendChild(replyElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 2000);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    console.log('💬 Message sent:', message);
};

// ===== TERMINATION MODAL FUNCTIONS =====
window.openTerminationModal = function() {
    console.log('🚪 Opening termination modal...');
    document.getElementById('terminationModal').classList.add('active');
};

window.closeTerminationModal = function() {
    document.getElementById('terminationModal').classList.remove('active');
    // Reset form
    document.getElementById('confirmTermination').checked = false;
    document.querySelectorAll('input[name="waitingOption"]').forEach(radio => {
        radio.checked = false;
    });
};

window.submitTerminationRequest = function() {
    const confirmTermination = document.getElementById('confirmTermination').checked;
    const waitingOption = document.querySelector('input[name="waitingOption"]:checked');
    
    if (!confirmTermination || !waitingOption) {
        showNotification('Please confirm termination and select waiting option', 'error');
        return;
    }
    
    console.log('🚪 Submitting termination request:', { waitingOption: waitingOption.value });
    
    // Create termination request
    const terminationRequest = {
        id: 'termination_' + Date.now(),
        propertyId: sessionStorage.getItem('currentPropertyId'),
        waitingOption: waitingOption.value,
        submittedAt: new Date().toISOString(),
        status: 'pending'
    };
    
    // Save to localStorage
    const terminationRequests = JSON.parse(localStorage.getItem('domihive_termination_requests') || '[]');
    terminationRequests.push(terminationRequest);
    localStorage.setItem('domihive_termination_requests', JSON.stringify(terminationRequests));
    
    showNotification('Termination request submitted! Our team will call you within 5 minutes.', 'success');
    closeTerminationModal();
};

// ===== DOCUMENT MANAGEMENT =====
window.viewBookingConfirmation = function() {
    openDocumentViewer('Booking Confirmation', generateBookingConfirmation());
};

window.downloadBookingConfirmation = function() {
    downloadPDF('Booking-Confirmation', generateBookingConfirmation());
    showNotification('Booking confirmation downloaded successfully', 'success');
};

window.viewHouseRules = function() {
    openDocumentViewer('House Rules', generateHouseRules());
};

window.downloadHouseRules = function() {
    downloadPDF('House-Rules', generateHouseRules());
    showNotification('House rules downloaded successfully', 'success');
};

window.viewCheckInInstructions = function() {
    openDocumentViewer('Check-In Instructions', generateCheckInInstructions());
};

window.downloadCheckInInstructions = function() {
    downloadPDF('Check-In-Instructions', generateCheckInInstructions());
    showNotification('Check-in instructions downloaded successfully', 'success');
};

window.viewReceipt = function() {
    openDocumentViewer('Receipt & Invoice', generateReceipt());
};

window.downloadReceipt = function() {
    downloadPDF('Receipt-Invoice', generateReceipt());
    showNotification('Receipt downloaded successfully', 'success');
};

function openDocumentViewer(title, content) {
    document.getElementById('documentViewerTitle').textContent = title;
    document.getElementById('documentViewerContent').innerHTML = content;
    document.getElementById('documentViewerModal').classList.add('active');
}

window.closeDocumentViewer = function() {
    document.getElementById('documentViewerModal').classList.remove('active');
};

window.downloadCurrentDocument = function() {
    const title = document.getElementById('documentViewerTitle').textContent;
    const content = document.getElementById('documentViewerContent').innerHTML;
    downloadPDF(title, content);
    showNotification(`${title} downloaded successfully`, 'success');
};

function generateBookingConfirmation() {
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const property = userProperties.find(p => p.id === propertyId);
    const currentUser = JSON.parse(localStorage.getItem('domihive_current_user') || '{}');
    
    return `
        <div class="legal-document">
            <div class="document-header">
                <h1>BOOKING CONFIRMATION</h1>
                <div class="document-subtitle">Short-Let Accommodation Booking</div>
            </div>
            
            <div class="booking-details">
                <h3>Booking Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Guest Name:</strong>
                        <span>${currentUser.name || 'Guest'}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Property:</strong>
                        <span>${property?.title || 'Short-Let Property'}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Check-In:</strong>
                        <span>${property?.checkIn ? formatDate(property.checkIn) : 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Check-Out:</strong>
                        <span>${property?.checkOut ? formatDate(property.checkOut) : 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Duration:</strong>
                        <span>${property?.duration || 0} nights</span>
                    </div>
                    <div class="detail-item">
                        <strong>Total Amount:</strong>
                        <span>₦${property?.totalAmount?.toLocaleString() || '0'}</span>
                    </div>
                </div>
            </div>
            
            <div class="booking-terms">
                <h3>Booking Terms & Conditions</h3>
                <p>This confirmation serves as proof of your booking with DomiHive. Please present this document upon check-in.</p>
                
                <h4>Cancellation Policy</h4>
                <p>Free cancellation up to 48 hours before check-in. Late cancellations may incur charges.</p>
                
                <h4>House Rules</h4>
                <p>Please respect the property and neighbors. No smoking, no parties, no pets unless specified.</p>
            </div>
            
            <div class="contact-info">
                <h3>Contact Information</h3>
                <p><strong>DomiHive Support:</strong> +234 08103279654</p>
                <p><strong>Emergency Contact:</strong> +234 08103279654</p>
                <p><strong>Email:</strong> support@domihive.com</p>
            </div>
        </div>
    `;
}

function generateHouseRules() {
    return `
        <div class="legal-document">
            <div class="document-header">
                <h1>HOUSE RULES</h1>
                <div class="document-subtitle">Property Rules and Guidelines</div>
            </div>
            
            <div class="rules-content">
                <h3>General Rules</h3>
                <ul>
                    <li>No smoking inside the property</li>
                    <li>No parties or events without prior permission</li>
                    <li>No pets unless specifically approved</li>
                    <li>Quiet hours from 10:00 PM to 7:00 AM</li>
                    <li>Maximum occupancy must not be exceeded</li>
                </ul>
                
                <h3>Check-In & Check-Out</h3>
                <ul>
                    <li>Check-in time: 3:00 PM onwards</li>
                    <li>Check-out time: 11:00 AM</li>
                    <li>Late check-out may be available upon request</li>
                    <li>Please return all keys and access cards</li>
                </ul>
                
                <h3>Property Care</h3>
                <ul>
                    <li>Please report any damages immediately</li>
                    <li>Keep the property clean and tidy</li>
                    <li>Dispose of trash properly</li>
                    <li>Conserve water and electricity</li>
                </ul>
                
                <h3>Safety & Security</h3>
                <ul>
                    <li>Lock all doors and windows when leaving</li>
                    <li>Do not share access codes with others</li>
                    <li>Emergency numbers are posted in the property</li>
                    <li>Report any security concerns immediately</li>
                </ul>
            </div>
        </div>
    `;
}

function generateCheckInInstructions() {
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const property = userProperties.find(p => p.id === propertyId);
    
    return `
        <div class="legal-document">
            <div class="document-header">
                <h1>CHECK-IN INSTRUCTIONS</h1>
                <div class="document-subtitle">Access and Arrival Information</div>
            </div>
            
            <div class="instructions-content">
                <h3>Property Access</h3>
                <div class="access-info">
                    <div class="access-item">
                        <strong>Access Code:</strong>
                        <span>#${Math.floor(1000 + Math.random() * 9000)}</span>
                    </div>
                    <div class="access-item">
                        <strong>Key Location:</strong>
                        <span>Key safe by main entrance</span>
                    </div>
                </div>
                
                <h3>Arrival Instructions</h3>
                <ol>
                    <li>Proceed to the property address: ${property?.location || 'Property Location'}</li>
                    <li>Locate the key safe next to the main entrance</li>
                    <li>Enter the access code provided above</li>
                    <li>Retrieve the keys from the safe</li>
                    <li>Lock the key safe after use</li>
                </ol>
                
                <h3>WiFi Information</h3>
                <div class="wifi-info">
                    <div class="wifi-item">
                        <strong>Network Name:</strong>
                        <span>DomiHive_Guest_${propertyId?.slice(-4) || '0000'}</span>
                    </div>
                    <div class="wifi-item">
                        <strong>Password:</strong>
                        <span>Welcome${propertyId?.slice(-4) || '0000'}!</span>
                    </div>
                </div>
                
                <h3>Emergency Contacts</h3>
                <div class="emergency-contacts">
                    <div class="contact-item">
                        <strong>Property Manager:</strong>
                        <span>+234 08103279654</span>
                    </div>
                    <div class="contact-item">
                        <strong>Emergency Maintenance:</strong>
                        <span>+234 08103279654</span>
                    </div>
                    <div class="contact-item">
                        <strong>Police/Fire:</strong>
                        <span>112 or 199</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateReceipt() {
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const property = userProperties.find(p => p.id === propertyId);
    const currentUser = JSON.parse(localStorage.getItem('domihive_current_user') || '{}');
    
    return `
        <div class="legal-document">
            <div class="document-header">
                <h1>PAYMENT RECEIPT & INVOICE</h1>
                <div class="document-subtitle">Booking Payment Confirmation</div>
            </div>
            
            <div class="receipt-details">
                <div class="receipt-header">
                    <div class="receipt-from">
                        <strong>DomiHive Properties Ltd.</strong>
                        <p>124 Awolowo Road, Ikoyi, Lagos</p>
                        <p>RC: 1234567</p>
                    </div>
                    <div class="receipt-to">
                        <strong>${currentUser.name || 'Guest'}</strong>
                        <p>${currentUser.email || 'guest@email.com'}</p>
                        <p>Invoice Date: ${new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                
                <div class="receipt-items">
                    <h3>Booking Details</h3>
                    <table class="receipt-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${property?.duration || 0} nights accommodation</td>
                                <td>₦${property?.totalAmount?.toLocaleString() || '0'}</td>
                            </tr>
                            <tr>
                                <td>Service fee</td>
                                <td>₦0</td>
                            </tr>
                            <tr>
                                <td>Cleaning fee</td>
                                <td>₦0</td>
                            </tr>
                            <tr class="total-row">
                                <td><strong>Total Amount</strong></td>
                                <td><strong>₦${property?.totalAmount?.toLocaleString() || '0'}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="payment-info">
                    <h3>Payment Information</h3>
                    <div class="payment-details">
                        <div class="payment-item">
                            <strong>Payment Method:</strong>
                            <span>${property?.paymentStatus === 'paid' ? 'Card Payment' : 'Pending'}</span>
                        </div>
                        <div class="payment-item">
                            <strong>Payment Status:</strong>
                            <span class="status-${property?.paymentStatus || 'pending'}">${property?.paymentStatus === 'paid' ? 'Paid' : 'Pending'}</span>
                        </div>
                        <div class="payment-item">
                            <strong>Transaction ID:</strong>
                            <span>TXN-${Date.now()}</span>
                        </div>
                    </div>
                </div>
                
                <div class="download-section" style="text-align: center; margin: 2rem 0; padding: 1rem; background: #f8fafc; border-radius: 8px;">
                    <button onclick="downloadReceipt()" style="background: var(--accent-color); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-download"></i> Download Receipt PDF
                    </button>
                </div>
            </div>
        </div>
    `;
}

function downloadPDF(filename, content) {
    const blob = new Blob([content], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.html`;
    link.click();
}

// ===== PAYMENT SYSTEM =====
window.hidePaymentSection = function() {
    document.getElementById('paymentSection').style.display = 'none';
    showNotification('Payment cancelled', 'info');
};

window.selectPaymentMethod = function(method) {
    console.log('💳 Selecting payment method:', method);
    
    // Remove selected class from all methods
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked method
    event.currentTarget.classList.add('selected');
    
    // Show corresponding payment details
    document.querySelectorAll('.payment-details').forEach(detail => {
        detail.classList.remove('active');
    });
    
    const detailsId = `${method}Details`;
    const detailsElement = document.getElementById(detailsId);
    if (detailsElement) {
        detailsElement.classList.add('active');
    }
};

// Initialize payment method selection
document.addEventListener('DOMContentLoaded', function() {
    const paymentMethods = document.querySelectorAll('.payment-method-card');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            const methodType = this.getAttribute('data-method');
            selectPaymentMethod(methodType);
        });
    });
    
    // Initialize payment form submission
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitPayment();
        });
    }
});

window.submitPayment = function() {
    const selectedMethod = document.querySelector('.payment-method-card.selected');
    if (!selectedMethod) {
        showNotification('Please select a payment method', 'error');
        return;
    }
    
    const method = selectedMethod.getAttribute('data-method');
    const totalAmount = document.getElementById('totalPaymentAmount').value;
    
    console.log('💰 Processing payment:', { method, totalAmount });
    
    // Show processing state
    showNotification('Processing your payment...', 'info');
    
    // Simulate payment processing
    setTimeout(() => {
        showNotification('Payment completed successfully!', 'success');
        document.getElementById('paymentSection').style.display = 'none';
        
        // Reset payment form
        document.getElementById('paymentForm').reset();
        document.querySelectorAll('.payment-method-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelectorAll('.payment-details').forEach(detail => {
            detail.classList.remove('active');
        });
        
        // Update property status if it was an extension
        updatePropertyAfterPayment();
        
    }, 2000);
};

function updatePropertyAfterPayment() {
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const propertyIndex = userProperties.findIndex(p => p.id === propertyId);
    
    if (propertyIndex !== -1) {
        // Update payment status
        userProperties[propertyIndex].paymentStatus = 'paid';
        
        // Save updated property
        localStorage.setItem('domihive_user_properties', JSON.stringify(userProperties));
        
        console.log('✅ Payment processed and property updated');
    }
}

// ===== REVIEW SYSTEM =====
function initializeReviewSystem() {
    console.log('⭐ Initializing review system...');
    initializeStarRatings();
    loadReviewHistory();
    console.log('✅ Review system initialized');
}

function initializeStarRatings() {
    const overallStars = document.querySelectorAll('#overallRating .star');
    overallStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            setOverallRating(rating);
        });
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars('overallRating', rating);
        });
    });
    
    document.getElementById('overallRating').addEventListener('mouseleave', function() {
        const currentRating = getCurrentOverallRating();
        if (currentRating > 0) {
            highlightStars('overallRating', currentRating);
        } else {
            resetStars('overallRating');
        }
    });
}

function setOverallRating(rating) {
    console.log('⭐ Setting overall rating:', rating);
    highlightStars('overallRating', rating);
    
    const ratingTexts = [
        'Select your rating',
        'Poor',
        'Fair', 
        'Good',
        'Very Good',
        'Excellent'
    ];
    document.getElementById('overallRatingText').textContent = ratingTexts[rating];
    
    window.currentOverallRating = rating;
}

function highlightStars(container, rating) {
    const stars = document.querySelectorAll(`#${container} .star`);
    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        star.classList.toggle('active', starRating <= rating);
    });
}

function resetStars(container) {
    const stars = document.querySelectorAll(`#${container} .star`);
    stars.forEach(star => {
        star.classList.remove('active');
    });
}

function getCurrentOverallRating() {
    return window.currentOverallRating || 0;
}

function loadReviewHistory() {
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const userReviews = JSON.parse(localStorage.getItem('domihive_user_reviews') || '[]');
    const propertyReviews = userReviews.filter(review => review.propertyId === propertyId);
    
    // Note: Review history section is hidden by default in HTML
    // This function can be expanded to show history if needed
    console.log('📝 Review history loaded:', propertyReviews.length);
}

window.submitPropertyReview = function() {
    console.log('📝 Submitting property review...');
    
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const currentUser = JSON.parse(localStorage.getItem('domihive_current_user') || '{}');
    
    if (!validateReviewForm()) {
        return;
    }
    
    const reviewData = {
        id: 'review_' + Date.now(),
        propertyId: propertyId,
        userId: currentUser.id || 'user_' + Date.now(),
        userName: currentUser.name || 'Anonymous',
        submittedAt: new Date().toISOString(),
        status: 'pending',
        title: document.getElementById('reviewTitle').value.trim(),
        reviewText: document.getElementById('reviewText').value.trim(),
        anonymous: document.getElementById('anonymousPost').checked,
        recommend: document.querySelector('input[name="recommend"]:checked').value,
        ratings: {
            overall: getCurrentOverallRating()
        }
    };
    
    const userReviews = JSON.parse(localStorage.getItem('domihive_user_reviews') || '[]');
    userReviews.push(reviewData);
    localStorage.setItem('domihive_user_reviews', JSON.stringify(userReviews));
    
    showNotification('Review submitted successfully! It will be published after admin approval.', 'success');
    clearReviewForm();
    
    console.log('✅ Review submitted:', reviewData);
};

function validateReviewForm() {
    const overallRating = getCurrentOverallRating();
    const title = document.getElementById('reviewTitle').value.trim();
    const reviewText = document.getElementById('reviewText').value.trim();
    const recommend = document.querySelector('input[name="recommend"]:checked');
    
    if (overallRating === 0) {
        showNotification('Please provide an overall rating', 'error');
        return false;
    }
    
    if (!title) {
        showNotification('Please enter a review title', 'error');
        document.getElementById('reviewTitle').focus();
        return false;
    }
    
    if (!reviewText) {
        showNotification('Please write your review', 'error');
        document.getElementById('reviewText').focus();
        return false;
    }
    
    if (!recommend) {
        showNotification('Please indicate if you would recommend this property', 'error');
        return false;
    }
    
    return true;
}

window.clearReviewForm = function() {
    console.log('🧹 Clearing review form...');
    
    window.currentOverallRating = 0;
    resetStars('overallRating');
    document.getElementById('overallRatingText').textContent = 'Select your rating';
    
    document.getElementById('reviewTitle').value = '';
    document.getElementById('reviewText').value = '';
    
    document.querySelectorAll('input[name="recommend"]').forEach(radio => {
        radio.checked = false;
    });
    document.getElementById('anonymousPost').checked = false;
    
    showNotification('Form cleared', 'info');
};

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    console.log('🎯 Initializing event listeners...');
    
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', goBackToProperties);
    }
    
    // Close modals when clicking overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    console.log('✅ Event listeners initialized');
}

// ===== NAVIGATION FUNCTIONS =====
window.goBackToProperties = function() {
    console.log('🔙 Returning to My Properties...');
    
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('my-properties');
    } else {
        window.location.href = '/Pages/my-properties-content.html';
    }
};

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Date formatting error:', error);
        return 'Invalid Date';
    }
}

function calculateNightsRemaining(checkOutDate) {
    if (!checkOutDate) return 0;
    const today = new Date();
    const checkOut = new Date(checkOutDate);
    const diffTime = checkOut - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
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
        font-weight: 600;
        animation: slideInRight 0.3s ease;
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

// Add CSS for notifications if not already in main CSS
const notificationStyles = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
`;

// Inject styles if not already present
if (!document.querySelector('#notification-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'notification-styles';
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);
}

console.log('🎉 tenant-property-shortlet.js loaded successfully!');