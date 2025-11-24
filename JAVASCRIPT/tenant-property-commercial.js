// tenant-property-commercial.js - Commercial Property Management System

// ===== SPA INTEGRATION =====
window.spaTenantPropertyCommercialInit = function() {
    console.log('🎯 SPA: Initializing Commercial Property Content');
    initializeCommercialProperty();
};

// ===== AUTO-INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded - checking commercial initialization...');
    
    const isCommercialPage = window.location.pathname.includes('tenant-property-commercial.html');
    const hasPropertyContent = document.querySelector('.tenant-property-content');
    const hasPropertyOverview = document.getElementById('propertyOverview');
    
    if (isCommercialPage || hasPropertyContent || hasPropertyOverview) {
        console.log('🏢 Auto-initializing Commercial Property...');
        setTimeout(initializeCommercialProperty, 100);
    }
});

// ===== MAIN INITIALIZATION =====
function initializeCommercialProperty() {
    console.log('🏢 Initializing Commercial Property Page...');
    
    try {
        loadCommercialPropertyData();
        initializeTabSystem();
        initializeEventListeners();
        initializeReviewSystem();
        initializeModalSystems();
        initializePaymentSystem();
        
        console.log('✅ Commercial Property page initialized successfully');
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        showNotification('Failed to initialize page', 'error');
    }
}

// ===== PROPERTY DATA MANAGEMENT =====
function loadCommercialPropertyData() {
    console.log('📦 Loading commercial property data...');
    
    const propertyId = sessionStorage.getItem('currentPropertyId');
    console.log('🔑 Property ID from session:', propertyId);
    
    if (!propertyId) {
        console.log('❌ No property ID found, creating demo...');
        createDemoCommercialPropertyData();
        return;
    }
    
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const property = userProperties.find(p => p.id === propertyId);
    
    if (property) {
        console.log('✅ Found property:', property.title);
        renderCommercialPropertyPage(property);
    } else {
        console.log('❌ Property not found, creating demo...');
        createDemoCommercialPropertyData();
    }
}

function createDemoCommercialPropertyData() {
    console.log('🏗️ Creating demo commercial property data...');
    
    const demoProperty = {
        id: 'demo_commercial_1',
        title: 'Premium Office Space in VI',
        location: '124A Adeola Odeku, Victoria Island, Lagos',
        price: 12000000,
        image: '/ASSECT/commercial-office.jpg',
        propertyType: 'Office Space',
        leaseStart: '2024-01-01',
        leaseEnd: '2026-12-31',
        duration: 3,
        status: 'active',
        totalAmount: 12000000,
        paymentStatus: 'paid',
        monthlyRent: 1000000,
        documents: {
            commercialAgreement: { signed: true, signedDate: '2024-01-01' }
        },
        updates: [
            {
                date: '2024-02-25',
                title: 'Building Maintenance Schedule 🛠️',
                content: 'Scheduled building maintenance will occur on March 1st from 8 AM - 5 PM. There will be temporary power shutdown during this period. Please plan your business operations accordingly.'
            },
            {
                date: '2024-02-20',
                title: 'Rent Payment Reminder 💰',
                content: 'Friendly reminder: Your next rent payment of ₦1,000,000 is due on March 1st, 2024. You can make payments through your DomiHive portal or via bank transfer.'
            },
            {
                date: '2024-02-15',
                title: 'Security System Upgrade 🔒',
                content: 'We are upgrading the building\'s security system this weekend. Access cards will need to be reactivated on Monday. Please visit the management office.'
            },
            {
                date: '2024-02-10',
                title: 'Parking Space Allocation 🅿️',
                content: 'New parking space allocations have been assigned. Please check your email for your designated parking spots and access instructions.'
            }
        ]
    };
    
    // Save to localStorage for persistence
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    if (!userProperties.find(p => p.id === demoProperty.id)) {
        userProperties.push(demoProperty);
        localStorage.setItem('domihive_user_properties', JSON.stringify(userProperties));
    }
    
    renderCommercialPropertyPage(demoProperty);
}

function renderCommercialPropertyPage(property) {
    console.log('🎨 Rendering commercial property page...');
    
    updatePageHeader(property);
    renderCommercialPropertyOverview(property);
    
    console.log('✅ Commercial property page rendered');
}

function updatePageHeader(property) {
    const titleElement = document.getElementById('propertyPageTitle');
    const subtitleElement = document.getElementById('propertyPageSubtitle');
    
    if (titleElement) {
        titleElement.innerHTML = `<i class="fas fa-building"></i>${property.title}`;
    }
    
    if (subtitleElement) {
        subtitleElement.textContent = `Managing your commercial rental space in ${property.location}`;
    }
}

function renderCommercialPropertyOverview(property) {
    const overviewElement = document.getElementById('propertyOverview');
    
    if (!overviewElement) {
        console.error('❌ Property overview element not found');
        return;
    }
    
    overviewElement.innerHTML = `
        <div class="property-overview-image">
            <img src="${property.image}" alt="${property.title}" onerror="this.src='/ASSECT/placeholder-commercial.jpg'">
        </div>
        <div class="property-overview-info">
            <h2>${property.title}</h2>
            <div class="property-overview-price">₦${property.price.toLocaleString()}/year</div>
            <div class="property-overview-location">
                <i class="fas fa-map-marker-alt"></i>
                ${property.location}
            </div>
            <div class="property-overview-meta">
                <div class="meta-item">
                    <span class="meta-label">Property Type</span>
                    <span class="meta-value">${property.propertyType}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Lease Status</span>
                    <span class="meta-value" style="color: ${property.status === 'active' ? '#10b981' : '#f59e0b'}">
                        ${property.status === 'active' ? 'Active' : 'Ending Soon'}
                    </span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Payment Status</span>
                    <span class="meta-value" style="color: ${property.paymentStatus === 'paid' ? '#10b981' : '#f59e0b'}">
                        ${property.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                </div>
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
        const firstTab = document.querySelector('.tab-btn.active');
        if (firstTab) {
            const firstTabName = firstTab.getAttribute('data-tab');
            const firstTabContent = document.getElementById(`${firstTabName}-content`);
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
    
    console.log('✅ Tab switched to:', tabName);
}

// ===== MODAL MANAGEMENT =====
function initializeModalSystems() {
    console.log('🎪 Initializing modal systems...');
    
    // Close modals when clicking overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    console.log('✅ Modal systems initialized');
}

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
        status: 'submitted',
        type: 'commercial'
    };
    
    // Save to localStorage
    const maintenanceRequests = JSON.parse(localStorage.getItem('domihive_maintenance_requests') || '[]');
    maintenanceRequests.push(maintenanceRequest);
    localStorage.setItem('domihive_maintenance_requests', JSON.stringify(maintenanceRequests));
    
    showNotification('Maintenance request submitted successfully! Our team will contact you within 30 minutes.', 'success');
    closeMaintenanceModal();
};

// ===== MESSAGE MODAL FUNCTIONS =====
window.openMessageModal = function() {
    console.log('💬 Opening message modal...');
    document.getElementById('messageModal').classList.add('active');
};

window.closeMessageModal = function() {
    document.getElementById('messageModal').classList.remove('active');
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
                <p>Thank you for your message regarding your commercial property. Our commercial team will get back to you shortly.</p>
            </div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        `;
        
        chatMessages.appendChild(replyElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 2000);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    console.log('💬 Commercial message sent:', message);
};

// ===== RENEW LEASE MODAL FUNCTIONS =====
window.openRenewLeaseModal = function() {
    console.log('🔄 Opening renew lease modal...');
    document.getElementById('renewLeaseModal').classList.add('active');
};

window.closeRenewLeaseModal = function() {
    document.getElementById('renewLeaseModal').classList.remove('active');
};

window.proceedToRenewalPayment = function() {
    console.log('💰 Proceeding to renewal payment...');
    
    const renewalAmount = 1041667; // First month of new annual rent
    
    // Update payment section with renewal details
    document.getElementById('breakdownRent').textContent = `₦${renewalAmount.toLocaleString()}`;
    document.getElementById('breakdownService').textContent = '₦0';
    document.getElementById('breakdownTotal').textContent = `₦${renewalAmount.toLocaleString()}`;
    document.getElementById('totalPaymentAmount').value = renewalAmount;
    
    // Show payment section and hide modal
    closeRenewLeaseModal();
    document.getElementById('paymentSection').style.display = 'block';
    
    // Scroll to payment section
    document.getElementById('paymentSection').scrollIntoView({ behavior: 'smooth' });
    
    showNotification('Please complete payment to confirm your lease renewal', 'info');
};

// ===== END LEASE MODAL FUNCTIONS =====
window.openEndLeaseModal = function() {
    console.log('🚪 Opening end lease modal...');
    document.getElementById('endLeaseModal').classList.add('active');
};

window.closeEndLeaseModal = function() {
    document.getElementById('endLeaseModal').classList.remove('active');
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
    
    console.log('🚪 Submitting commercial lease termination request:', { waitingOption: waitingOption.value });
    
    // Create termination request
    const terminationRequest = {
        id: 'termination_' + Date.now(),
        propertyId: sessionStorage.getItem('currentPropertyId'),
        waitingOption: waitingOption.value,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        type: 'commercial'
    };
    
    // Save to localStorage
    const terminationRequests = JSON.parse(localStorage.getItem('domihive_termination_requests') || '[]');
    terminationRequests.push(terminationRequest);
    localStorage.setItem('domihive_termination_requests', JSON.stringify(terminationRequests));
    
    showNotification('Commercial lease termination request submitted! Our commercial team will contact you within 24 hours.', 'success');
    closeEndLeaseModal();
};

// ===== DOCUMENT MANAGEMENT =====
window.viewCommercialAgreement = function() {
    openDocumentViewer('Commercial Tenant Agreement', generateCommercialAgreement());
};

window.downloadCommercialAgreement = function() {
    downloadPDF('Commercial-Tenant-Agreement', generateCommercialAgreement());
    showNotification('Commercial agreement downloaded successfully', 'success');
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

function generateCommercialAgreement() {
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const property = userProperties.find(p => p.id === propertyId);
    const currentUser = JSON.parse(localStorage.getItem('domihive_current_user') || '{}');
    
    return `
        <div class="legal-document">
            <div class="document-header">
                <h1>COMMERCIAL LEASE AGREEMENT</h1>
                <div class="document-subtitle">Standard Form of Commercial Tenancy Agreement</div>
            </div>
            
            <div class="legal-parties">
                <div class="party-section">
                    <h3>LESSOR (Landlord):</h3>
                    <p><strong>DOMIHIVE COMMERCIAL PROPERTIES LTD.</strong></p>
                    <p>RC: 1234567</p>
                    <p>124 Awolowo Road, Ikoyi, Lagos</p>
                    <p>Email: commercial@domihive.com</p>
                    <p>Phone: +234 1 700 0000</p>
                </div>
                
                <div class="party-section">
                    <h3>LESSEE (Commercial Tenant):</h3>
                    <p><strong>${currentUser.name || 'BUSINESS NAME'}</strong></p>
                    <p>Email: ${currentUser.email || 'business@email.com'}</p>
                    <p>Phone: ${currentUser.phone || '+234 800 000 0000'}</p>
                </div>
            </div>
            
            <div class="property-section">
                <h3>DESCRIPTION OF COMMERCIAL PREMISES</h3>
                <p>The Lessor hereby leases to the Lessee the following described commercial premises:</p>
                <p><strong>Property:</strong> ${property?.title || 'Commercial Property'}</p>
                <p><strong>Address:</strong> ${property?.location || 'Commercial Address'}</p>
                <p><strong>Property Type:</strong> ${property?.propertyType || 'Office Space'}</p>
            </div>
            
            <div class="terms-section">
                <h3>COMMERCIAL LEASE TERMS AND CONDITIONS</h3>
                
                <div class="term-item">
                    <h4>ARTICLE 1: TERM</h4>
                    <p>This Commercial Lease shall be for a term of ${property?.duration || 3} years commencing on <strong>${property?.leaseStart ? formatDate(property.leaseStart) : 'N/A'}</strong> and ending on <strong>${property?.leaseEnd ? formatDate(property.leaseEnd) : 'N/A'}</strong>.</p>
                </div>
                
                <div class="term-item">
                    <h4>ARTICLE 2: RENT</h4>
                    <p>The annual rent shall be <strong>₦${property?.price?.toLocaleString() || '0'}</strong> payable in monthly installments of <strong>₦${property?.monthlyRent?.toLocaleString() || '0'}</strong> in advance on the first day of each month.</p>
                </div>
                
                <div class="term-item">
                    <h4>ARTICLE 3: SECURITY DEPOSIT</h4>
                    <p>Upon execution of this Agreement, Tenant shall deposit with Landlord the sum of <strong>₦${property?.monthlyRent?.toLocaleString() || '0'}</strong> as a security deposit to secure Tenant's faithful performance of the terms of this Lease.</p>
                </div>
                
                <div class="term-item">
                    <h4>ARTICLE 4: USE OF PREMISES</h4>
                    <p>The premises shall be used and occupied by Tenant exclusively for commercial purposes as specified in the business description. Tenant shall comply with all applicable zoning and business regulations.</p>
                </div>
                
                <div class="term-item">
                    <h4>ARTICLE 5: MAINTENANCE AND REPAIRS</h4>
                    <p>Tenant will keep and maintain the premises in a clean, sanitary, and good condition. Landlord shall be responsible for all structural repairs and repairs to common areas.</p>
                </div>
                
                <div class="term-item">
                    <h4>ARTICLE 6: COMMON AREA MAINTENANCE (CAM)</h4>
                    <p>Tenant shall pay their proportionate share of Common Area Maintenance charges as outlined in the CAM schedule attached hereto.</p>
                </div>
                
                <div class="term-item">
                    <h4>ARTICLE 7: INSURANCE</h4>
                    <p>Tenant is responsible for maintaining commercial liability insurance and property insurance for their business property. Landlord maintains insurance on the building structure.</p>
                </div>
                
                <div class="term-item">
                    <h4>ARTICLE 8: DEFAULT</h4>
                    <p>If Tenant fails to pay rent when due, Landlord may terminate this Lease after providing proper notice as required by commercial tenancy laws.</p>
                </div>
            </div>
            
            <div class="signature-section">
                <div class="signature-block">
                    <div class="signature-line"></div>
                    <div class="signature-label">DomiHive Commercial Properties Ltd.</div>
                    <div class="signature-title">Landlord/Authorized Agent</div>
                    <div class="signature-date">Date: ${new Date().toLocaleDateString()}</div>
                </div>
                
                <div class="signature-block">
                    <div class="signature-line"></div>
                    <div class="signature-label">${currentUser.name || 'Business Representative'}</div>
                    <div class="signature-title">Commercial Tenant</div>
                    <div class="signature-date">Date: ___________</div>
                </div>
            </div>
            
            <div class="legal-footer">
                <p><strong>Disclaimer:</strong> This is a legally binding commercial document. Please read carefully before signing. If you do not understand any part of this agreement, seek legal advice.</p>
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
function initializePaymentSystem() {
    console.log('💰 Initializing payment system...');
    
    // Initialize payment method selection
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
    
    console.log('✅ Payment system initialized');
}

window.showPaymentSection = function() {
    console.log('💰 Showing payment section...');
    document.getElementById('paymentSection').style.display = 'block';
    document.getElementById('paymentSection').scrollIntoView({ behavior: 'smooth' });
};

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

window.submitPayment = function() {
    const selectedMethod = document.querySelector('.payment-method-card.selected');
    if (!selectedMethod) {
        showNotification('Please select a payment method', 'error');
        return;
    }
    
    const method = selectedMethod.getAttribute('data-method');
    const totalAmount = document.getElementById('totalPaymentAmount').value;
    
    console.log('💰 Processing commercial payment:', { method, totalAmount });
    
    // Show processing state
    showNotification('Processing your commercial payment...', 'info');
    
    // Simulate payment processing
    setTimeout(() => {
        showNotification('Commercial payment completed successfully!', 'success');
        document.getElementById('paymentSection').style.display = 'none';
        
        // Reset payment form
        document.getElementById('paymentForm').reset();
        document.querySelectorAll('.payment-method-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelectorAll('.payment-details').forEach(detail => {
            detail.classList.remove('active');
        });
        
        // Update property payment status
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
        
        console.log('✅ Commercial payment processed and property updated');
    }
}

// ===== REVIEW SYSTEM =====
function initializeReviewSystem() {
    console.log('⭐ Initializing review system...');
    initializeStarRatings();
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

window.submitPropertyReview = function() {
    console.log('📝 Submitting commercial property review...');
    
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const currentUser = JSON.parse(localStorage.getItem('domihive_current_user') || '{}');
    
    if (!validateReviewForm()) {
        return;
    }
    
    const reviewData = {
        id: 'review_' + Date.now(),
        propertyId: propertyId,
        userId: currentUser.id || 'user_' + Date.now(),
        userName: currentUser.name || 'Anonymous Business',
        submittedAt: new Date().toISOString(),
        status: 'pending',
        title: document.getElementById('reviewTitle').value.trim(),
        reviewText: document.getElementById('reviewText').value.trim(),
        anonymous: document.getElementById('anonymousPost').checked,
        recommend: document.querySelector('input[name="recommend"]:checked').value,
        ratings: {
            overall: getCurrentOverallRating()
        },
        type: 'commercial'
    };
    
    const userReviews = JSON.parse(localStorage.getItem('domihive_user_reviews') || '[]');
    userReviews.push(reviewData);
    localStorage.setItem('domihive_user_reviews', JSON.stringify(userReviews));
    
    showNotification('Commercial property review submitted successfully! It will be published after admin approval.', 'success');
    clearReviewForm();
    
    console.log('✅ Commercial review submitted:', reviewData);
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
        showNotification('Please indicate if you would recommend this commercial property', 'error');
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

console.log('🎉 tenant-property-commercial.js loaded successfully!');