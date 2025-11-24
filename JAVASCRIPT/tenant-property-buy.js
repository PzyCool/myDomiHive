// tenant-property-buy.js - Owned Property Management System

// ===== SPA INTEGRATION =====
window.spaTenantPropertyBuyInit = function() {
    console.log('🎯 SPA: Initializing Buy Property Content');
    initializeBuyProperty();
};

// ===== AUTO-INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded - checking buy property initialization...');
    
    const isBuyPage = window.location.pathname.includes('tenant-property-buy.html');
    const hasPropertyContent = document.querySelector('.tenant-property-content');
    const hasPropertyOverview = document.getElementById('propertyOverview');
    
    // Only auto-initialize if it's a direct page load, not SPA
    if ((isBuyPage || hasPropertyContent || hasPropertyOverview) && !window.spa) {
        console.log('🏠 Auto-initializing Buy Property (Direct Load)...');
        setTimeout(initializeBuyProperty, 100);
    }
});

// ===== MAIN INITIALIZATION =====
function initializeBuyProperty() {
    console.log('🏠 Initializing Buy Property Page...');
    
    try {
        loadBuyPropertyData();
        initializeTabSystem();
        initializeEventListeners();
        initializeReviewSystem();
        initializeModalSystems();
        
        console.log('✅ Buy Property page initialized successfully');
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        showNotification('Failed to initialize page', 'error');
    }
}

// ===== PROPERTY DATA MANAGEMENT =====
function loadBuyPropertyData() {
    console.log('📦 Loading buy property data...');
    
    const propertyId = sessionStorage.getItem('currentPropertyId');
    console.log('🔑 Property ID from session:', propertyId);
    
    if (!propertyId) {
        console.log('❌ No property ID found, creating demo...');
        createDemoBuyPropertyData();
        return;
    }
    
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const property = userProperties.find(p => p.id === propertyId);
    
    if (property) {
        console.log('✅ Found property:', property.title);
        console.log('📊 Property data structure:', property); // Debug log
        renderBuyPropertyPage(property);
    } else {
        console.log('❌ Property not found, creating demo...');
        createDemoBuyPropertyData();
    }
}

function createDemoBuyPropertyData() {
    console.log('🏗️ Creating demo buy property data...');
    
    const demoProperty = {
        id: 'demo_buy_1',
        title: 'Luxury Duplex in Lekki Phase 1',
        location: '12 Admiralty Way, Lekki Phase 1, Lagos',
        price: 85000000,
        image: '/ASSECT/luxury-duplex.jpg',
        propertyType: 'Residential Duplex',
        purchaseDate: '2024-01-15',
        currentValue: 92000000,
        status: 'owned',
        bedrooms: 4,
        bathrooms: 5,
        squareFeet: 3200,
        landSize: 600,
        documents: {
            titleDeed: { signed: true, signedDate: '2024-01-15' },
            saleAgreement: { signed: true, signedDate: '2024-01-15' },
            surveyPlan: { signed: true, signedDate: '2024-01-15' }
        },
        financials: {
            landUseCharge: 120000,
            hoaDues: 60000,
            appreciation: 7000000
        },
        updates: [
            {
                date: '2024-03-01',
                title: 'Annual Community Meeting 🏘️',
                content: 'The annual homeowners association meeting is scheduled for March 15th. Important agenda includes security upgrades and community development projects.'
            },
            {
                date: '2024-02-25',
                title: 'Property Tax Assessment 📊',
                content: 'New property tax assessments have been released. Your property\'s assessed value has increased by 8%. Contact us if you have questions about your tax obligations.'
            },
            {
                date: '2024-02-20',
                title: 'Security System Upgrade 🔒',
                content: 'The community security system is being upgraded with new cameras and access control. Temporary access changes will be communicated via email.'
            },
            {
                date: '2024-02-15',
                title: 'Market Value Report 📈',
                content: 'Latest market analysis shows continued growth in property values in your area. Your property has appreciated significantly since purchase.'
            }
        ]
    };
    
    // Save to localStorage for persistence
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    if (!userProperties.find(p => p.id === demoProperty.id)) {
        userProperties.push(demoProperty);
        localStorage.setItem('domihive_user_properties', JSON.stringify(userProperties));
    }
    
    renderBuyPropertyPage(demoProperty);
}

function renderBuyPropertyPage(property) {
    console.log('🎨 Rendering buy property page...');
    
    updatePageHeader(property);
    renderBuyPropertyOverview(property);
    
    console.log('✅ Buy property page rendered');
}

function updatePageHeader(property) {
    const titleElement = document.getElementById('propertyPageTitle');
    const subtitleElement = document.getElementById('propertyPageSubtitle');
    
    if (titleElement) {
        titleElement.innerHTML = `<i class="fas fa-key"></i>${property.title || 'Owned Property'}`;
    }
    
    if (subtitleElement) {
        subtitleElement.textContent = `Managing your property investment in ${property.location || 'your property'}`;
    }
}

function renderBuyPropertyOverview(property) {
    const overviewElement = document.getElementById('propertyOverview');
    
    if (!overviewElement) {
        console.error('❌ Property overview element not found');
        return;
    }
    
    // Safe data access with fallbacks
    const price = property.price || property.purchasePrice || property.amount || 0;
    const currentValue = property.currentValue || property.marketValue || price;
    const propertyType = property.propertyType || property.type || 'Residential Property';
    const location = property.location || property.address || 'Location not specified';
    const image = property.image || property.photo || '/ASSECT/placeholder-property.jpg';
    
    overviewElement.innerHTML = `
        <div class="property-overview-image">
            <img src="${image}" alt="${property.title || 'Property'}" onerror="this.src='/ASSECT/placeholder-property.jpg'">
        </div>
        <div class="property-overview-info">
            <h2>${property.title || 'Owned Property'}</h2>
            <div class="property-overview-price">₦${price.toLocaleString()}</div>
            <div class="property-overview-location">
                <i class="fas fa-map-marker-alt"></i>
                ${location}
            </div>
            <div class="property-overview-meta">
                <div class="meta-item">
                    <span class="meta-label">Property Type</span>
                    <span class="meta-value">${propertyType}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Current Value</span>
                    <span class="meta-value">₦${currentValue.toLocaleString()}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Ownership Status</span>
                    <span class="meta-value" style="color: #10b981">Fully Owned</span>
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

// ===== ASSIGN MANAGEMENT MODAL FUNCTIONS =====
window.openAssignManagementModal = function() {
    console.log('👔 Opening assign management modal...');
    document.getElementById('assignManagementModal').classList.add('active');
};

window.closeAssignManagementModal = function() {
    document.getElementById('assignManagementModal').classList.remove('active');
};

window.submitManagementRequest = function() {
    console.log('📝 Submitting management request...');
    
    // Create management request
    const managementRequest = {
        id: 'management_' + Date.now(),
        propertyId: sessionStorage.getItem('currentPropertyId'),
        submittedAt: new Date().toISOString(),
        status: 'pending',
        type: 'property_management'
    };
    
    // Save to localStorage
    const managementRequests = JSON.parse(localStorage.getItem('domihive_management_requests') || '[]');
    managementRequests.push(managementRequest);
    localStorage.setItem('domihive_management_requests', JSON.stringify(managementRequests));
    
    showNotification('Management request submitted! Our team will contact you within 24 hours to discuss details.', 'success');
    closeAssignManagementModal();
};

// ===== LIST PROPERTY MODAL FUNCTIONS =====
window.openListPropertyModal = function() {
    console.log('🏷️ Opening list property modal...');
    document.getElementById('listPropertyModal').classList.add('active');
};

window.closeListPropertyModal = function() {
    document.getElementById('listPropertyModal').classList.remove('active');
    // Reset form
    document.getElementById('listingType').value = '';
    document.getElementById('askingPrice').value = '';
    document.getElementById('propertyCondition').value = '';
};

window.submitListingRequest = function() {
    const listingType = document.getElementById('listingType').value;
    const askingPrice = document.getElementById('askingPrice').value;
    const propertyCondition = document.getElementById('propertyCondition').value;
    
    if (!listingType || !askingPrice || !propertyCondition) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    console.log('📝 Submitting listing request:', { listingType, askingPrice, propertyCondition });
    
    // Create listing request
    const listingRequest = {
        id: 'listing_' + Date.now(),
        propertyId: sessionStorage.getItem('currentPropertyId'),
        listingType: listingType,
        askingPrice: askingPrice,
        propertyCondition: propertyCondition,
        submittedAt: new Date().toISOString(),
        status: 'pending'
    };
    
    // Save to localStorage
    const listingRequests = JSON.parse(localStorage.getItem('domihive_listing_requests') || '[]');
    listingRequests.push(listingRequest);
    localStorage.setItem('domihive_listing_requests', JSON.stringify(listingRequests));
    
    showNotification('Listing request submitted! Our sales team will contact you within 24 hours with market analysis and pricing strategy.', 'success');
    closeListPropertyModal();
};

// ===== MAINTENANCE MODAL FUNCTIONS =====
window.openMaintenanceModal = function() {
    console.log('🔧 Opening maintenance modal...');
    document.getElementById('maintenanceModal').classList.add('active');
};

window.closeMaintenanceModal = function() {
    document.getElementById('maintenanceModal').classList.remove('active');
    // Reset form
    document.getElementById('serviceCategory').value = '';
    document.getElementById('serviceDescription').value = '';
    document.getElementById('servicePhotos').value = '';
    document.getElementById('timeline').value = '';
};

window.submitMaintenanceRequest = function() {
    const serviceCategory = document.getElementById('serviceCategory').value;
    const serviceDescription = document.getElementById('serviceDescription').value;
    const timeline = document.getElementById('timeline').value;
    
    if (!serviceCategory || !serviceDescription || !timeline) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    console.log('🔧 Submitting maintenance request:', { serviceCategory, serviceDescription, timeline });
    
    // Create maintenance request (quote-based)
    const maintenanceRequest = {
        id: 'maintenance_' + Date.now(),
        propertyId: sessionStorage.getItem('currentPropertyId'),
        serviceCategory: serviceCategory,
        serviceDescription: serviceDescription,
        timeline: timeline,
        submittedAt: new Date().toISOString(),
        status: 'quote_requested',
        type: 'owner_maintenance'
    };
    
    // Save to localStorage
    const maintenanceRequests = JSON.parse(localStorage.getItem('domihive_maintenance_requests') || '[]');
    maintenanceRequests.push(maintenanceRequest);
    localStorage.setItem('domihive_maintenance_requests', JSON.stringify(maintenanceRequests));
    
    showNotification('Maintenance quote request submitted! Our team will assess your request and provide a detailed quote within 24 hours.', 'success');
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
                <p>Thank you for your message regarding your owned property. Our property specialists will get back to you shortly to assist with your inquiry.</p>
            </div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        `;
        
        chatMessages.appendChild(replyElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 2000);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    console.log('💬 Owner message sent:', message);
};

// ===== DOCUMENT MANAGEMENT =====
window.viewDocument = function(documentType) {
    openDocumentViewer(documentType, generateDocumentContent(documentType));
};

window.downloadDocument = function(documentType) {
    downloadPDF(documentType, generateDocumentContent(documentType));
    showNotification(`${documentType} downloaded successfully`, 'success');
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

function generateDocumentContent(documentType) {
    const propertyId = sessionStorage.getItem('currentPropertyId');
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const property = userProperties.find(p => p.id === propertyId);
    const currentUser = JSON.parse(localStorage.getItem('domihive_current_user') || '{}');
    
    // Safe data access
    const price = property?.price || property?.purchasePrice || property?.amount || 0;
    const location = property?.location || property?.address || 'Property Address';
    const title = property?.title || 'Owned Property';
    const purchaseDate = property?.purchaseDate || '2024-01-15';
    const landSize = property?.landSize || property?.plotSize || 600;
    const bedrooms = property?.bedrooms || 4;
    const bathrooms = property?.bathrooms || 5;
    const squareFeet = property?.squareFeet || property?.area || 3200;
    
    const documentContents = {
        'Title Deed': `
            <div class="legal-document">
                <div class="document-header">
                    <h1>CERTIFICATE OF OCCUPANCY</h1>
                    <div class="document-subtitle">Title Deed - Proof of Ownership</div>
                </div>
                
                <div class="document-details">
                    <h3>Property Information</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <strong>Property Owner:</strong>
                            <span>${currentUser.name || 'Property Owner'}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Property Address:</strong>
                            <span>${location}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Land Size:</strong>
                            <span>${landSize} square meters</span>
                        </div>
                        <div class="detail-item">
                            <strong>C of O Number:</strong>
                            <span>COO/LAG/2024/00123</span>
                        </div>
                        <div class="detail-item">
                            <strong>Issue Date:</strong>
                            <span>${formatDate(purchaseDate)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="legal-notes">
                    <h3>Legal Notes</h3>
                    <p>This Certificate of Occupancy serves as legal proof of ownership and right to occupy the described property. The property is free from any encumbrances and the title is registered with the Lagos State Land Registry.</p>
                </div>
            </div>
        `,
        
        'Sale Agreement': `
            <div class="legal-document">
                <div class="document-header">
                    <h1>PROPERTY SALE AGREEMENT</h1>
                    <div class="document-subtitle">Purchase Contract & Closing Documents</div>
                </div>
                
                <div class="document-details">
                    <h3>Sale Details</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <strong>Buyer:</strong>
                            <span>${currentUser.name || 'Buyer Name'}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Seller:</strong>
                            <span>Previous Property Owner</span>
                        </div>
                        <div class="detail-item">
                            <strong>Purchase Price:</strong>
                            <span>₦${price.toLocaleString()}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Purchase Date:</strong>
                            <span>${formatDate(purchaseDate)}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Property Description:</strong>
                            <span>${title}</span>
                        </div>
                    </div>
                </div>
            </div>
        `,
        
        'Survey Plan': `
            <div class="legal-document">
                <div class="document-header">
                    <h1>SURVEY PLAN</h1>
                    <div class="document-subtitle">Official Boundary & Land Survey</div>
                </div>
                
                <div class="document-details">
                    <h3>Survey Information</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <strong>Surveyor:</strong>
                            <span>Licensed Surveyor General</span>
                        </div>
                        <div class="detail-item">
                            <strong>Survey Number:</strong>
                            <span>LAG/SUR/2024/00456</span>
                        </div>
                        <div class="detail-item">
                            <strong>Land Area:</strong>
                            <span>${landSize} square meters</span>
                        </div>
                        <div class="detail-item">
                            <strong>Boundary Coordinates:</strong>
                            <span>Registered with Surveyor General</span>
                        </div>
                    </div>
                </div>
            </div>
        `,
        
        'Warranties': `
            <div class="legal-document">
                <div class="document-header">
                    <h1>PROPERTY WARRANTIES</h1>
                    <div class="document-subtitle">Appliance & Construction Warranties</div>
                </div>
                
                <div class="warranty-list">
                    <h3>Active Warranties</h3>
                    <div class="warranty-item">
                        <strong>Air Conditioning Systems:</strong>
                        <span>Valid until December 2026</span>
                    </div>
                    <div class="warranty-item">
                        <strong>Electrical Installation:</strong>
                        <span>Valid until December 2025</span>
                    </div>
                    <div class="warranty-item">
                        <strong>Plumbing Systems:</strong>
                        <span>Valid until December 2025</span>
                    </div>
                    <div class="warranty-item">
                        <strong>Kitchen Appliances:</strong>
                        <span>Valid until January 2027</span>
                    </div>
                </div>
            </div>
        `,
        
        'Payment Receipts': `
            <div class="legal-document">
                <div class="document-header">
                    <h1>PAYMENT RECEIPTS</h1>
                    <div class="document-subtitle">Purchase Payment Records</div>
                </div>
                
                <div class="receipt-list">
                    <h3>Payment History</h3>
                    <div class="receipt-item">
                        <strong>Initial Deposit:</strong>
                        <span>₦${Math.round(price * 0.1).toLocaleString()} - Paid ${formatDate(purchaseDate)}</span>
                    </div>
                    <div class="receipt-item">
                        <strong>Final Payment:</strong>
                        <span>₦${Math.round(price * 0.9).toLocaleString()} - Paid ${formatDate(purchaseDate)}</span>
                    </div>
                    <div class="receipt-item">
                        <strong>Legal Fees:</strong>
                        <span>₦1,200,000 - Paid ${formatDate(purchaseDate)}</span>
                    </div>
                    <div class="receipt-item total">
                        <strong>Total Paid:</strong>
                        <span>₦${(price + 1200000).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `,
        
        'Floor Plans': `
            <div class="legal-document">
                <div class="document-header">
                    <h1>FLOOR PLANS</h1>
                    <div class="document-subtitle">Architectural Drawings & Layouts</div>
                </div>
                
                <div class="floor-plan-details">
                    <h3>Property Specifications</h3>
                    <div class="spec-grid">
                        <div class="spec-item">
                            <strong>Total Area:</strong>
                            <span>${squareFeet} square feet</span>
                        </div>
                        <div class="spec-item">
                            <strong>Bedrooms:</strong>
                            <span>${bedrooms}</span>
                        </div>
                        <div class="spec-item">
                            <strong>Bathrooms:</strong>
                            <span>${bathrooms}</span>
                        </div>
                        <div class="spec-item">
                            <strong>Living Areas:</strong>
                            <span>2 Living Rooms, 1 Dining Room</span>
                        </div>
                        <div class="spec-item">
                            <strong>Additional Features:</strong>
                            <span>Balcony, Garage, Garden</span>
                        </div>
                    </div>
                </div>
            </div>
        `
    };
    
    return documentContents[documentType] || '<p>Document content not available</p>';
}

function downloadPDF(filename, content) {
    const blob = new Blob([content], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.html`;
    link.click();
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
        userName: currentUser.name || 'Anonymous Owner',
        submittedAt: new Date().toISOString(),
        status: 'pending',
        title: document.getElementById('reviewTitle').value.trim(),
        reviewText: document.getElementById('reviewText').value.trim(),
        anonymous: document.getElementById('anonymousPost').checked,
        recommend: document.querySelector('input[name="recommend"]:checked').value,
        ratings: {
            overall: getCurrentOverallRating()
        },
        type: 'owner_review'
    };
    
    const userReviews = JSON.parse(localStorage.getItem('domihive_user_reviews') || '[]');
    userReviews.push(reviewData);
    localStorage.setItem('domihive_user_reviews', JSON.stringify(userReviews));
    
    showNotification('Property review submitted successfully! It will be published after admin approval.', 'success');
    clearReviewForm();
    
    console.log('✅ Owner review submitted:', reviewData);
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
        showNotification('Please indicate if you would recommend DomiHive', 'error');
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

console.log('🎉 tenant-property-buy.js loaded successfully!');