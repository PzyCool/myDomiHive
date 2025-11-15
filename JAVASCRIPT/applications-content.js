// applications-content.js - Rewritten My Applications Logic with Tab Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 Initializing My Applications Page...');
    
    // Check if we're in SPA context and wait for SPA to be ready
    if (window.spa) {
        document.addEventListener('spaReady', function() {
            initializeApplicationsPage();
        });
        
        // Also initialize if SPA is already ready
        if (document.readyState === 'complete') {
            setTimeout(initializeApplicationsPage, 100);
        }
    } else {
        // Standard initialization for direct page load
        initializeApplicationsPage();
    }
});

// Global variables
let allProperties = [];
let allApplications = [];
let currentUser = null;
let currentPropertyForDecision = null;
let currentQuestionStep = 1;
let userAnswers = {};
let currentPropertyType = '';

// Property type configuration
const PROPERTY_TYPES = {
    rent: {
        name: 'For Rent',
        icon: 'fa-home',
        color: '#3b82f6',
        questions: [
            "Have you physically inspected this property?",
            "Did you like what you saw during inspection?",
            "Are you ready to rent this property now?"
        ],
        feedbackOptions: [
            { value: "price", text: "Property too expensive" },
            { value: "location", text: "Location not convenient" },
            { value: "condition", text: "Property condition not satisfactory" },
            { value: "size", text: "Size doesn't meet my needs" },
            { value: "other", text: "Other reasons" }
        ],
        redirectUrl: '/Pages/application-process.html',
        proceedTitle: "Great! Let's get you moved in",
        proceedMessage: "You're ready to start your rental application for this property."
    },
    shortlet: {
        name: 'Shortlet',
        icon: 'fa-calendar-day',
        color: '#8b5cf6',
        questions: [
            "Have you visited this shortlet property?",
            "Does this property meet your short-term stay requirements?",
            "Are you ready to book this shortlet property now?"
        ],
        feedbackOptions: [
            { value: "price", text: "Nightly rate too high" },
            { value: "location", text: "Location not suitable" },
            { value: "amenities", text: "Missing required amenities" },
            { value: "duration", text: "Doesn't fit my stay duration" },
            { value: "other", text: "Other reasons" }
        ],
        redirectUrl: '/Pages/application-process-shortlet.html',
        proceedTitle: "Perfect! Let's book your stay",
        proceedMessage: "You're ready to start your shortlet booking application."
    },
    commercial: {
        name: 'Commercial',
        icon: 'fa-building',
        color: '#06b6d4',
        questions: [
            "Have you conducted a business inspection of this property?",
            "Does this space meet your commercial requirements?",
            "Are you ready to proceed with the commercial lease application?"
        ],
        feedbackOptions: [
            { value: "price", text: "Rental cost exceeds budget" },
            { value: "location", text: "Not suitable for business location" },
            { value: "size", text: "Space doesn't meet business needs" },
            { value: "facilities", text: "Inadequate business facilities" },
            { value: "other", text: "Other reasons" }
        ],
        redirectUrl: '/Pages/application-process-commercial.html',
        proceedTitle: "Excellent! Let's setup your business",
        proceedMessage: "You're ready to start your commercial property application."
    },
    buy: {
        name: 'Buy',
        icon: 'fa-key',
        color: '#ef4444',
        questions: [
            "Have you personally visited this property for purchase?",
            "Does this property meet your purchase criteria?",
            "Are you ready to proceed with the purchase application now?"
        ],
        feedbackOptions: [
            { value: "price", text: "Asking price too high" },
            { value: "location", text: "Location doesn't meet requirements" },
            { value: "condition", text: "Property condition not satisfactory" },
            { value: "investment", text: "Doesn't meet investment goals" },
            { value: "other", text: "Other reasons" }
        ],
        redirectUrl: '/Pages/application-process-buy.html',
        proceedTitle: "Congratulations! Let's make it yours",
        proceedMessage: "You're ready to start your property purchase application."
    }
};

// ===== INITIALIZATION =====
function initializeApplicationsPage() {
    console.log('🚀 Initializing My Applications...');
    
    // Load all data
    loadUserData();
    loadPropertiesData();
    loadApplicationsData();
    
    // Initialize components
    updateAllApplicationStats();
    renderAllPropertiesGrids();
    initializeEventListeners();
    initializeTabs(); // Initialize tab functionality
    
    console.log('✅ My Applications page loaded successfully');
}

function loadUserData() {
    const userData = localStorage.getItem('domihive_current_user');
    if (userData) {
        currentUser = JSON.parse(userData);
    } else {
        currentUser = {
            id: 'user_1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+2348012345678'
        };
        localStorage.setItem('domihive_current_user', JSON.stringify(currentUser));
    }
    console.log('👤 User data loaded:', currentUser.name);
}

function loadPropertiesData() {
    const savedProperties = localStorage.getItem('domihive_my_applications_properties');
    
    if (savedProperties && JSON.parse(savedProperties).length > 0) {
        allProperties = JSON.parse(savedProperties);
        console.log('🏠 Loaded properties from storage:', allProperties.length);
    } else {
        // Create SIMPLE sample data that will DEFINITELY work
        allProperties = [
            // RENT PROPERTIES - 2 activated, 1 deactivated
            {
                id: 'rent_1',
                title: '3-Bedroom Apartment in Ikoyi',
                price: 15000000,
                location: 'Ikoyi, Lagos',
                image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
                adminActivated: true,
                inspectionDate: '2024-10-23',
                inspectionTime: '10:00',
                propertyType: 'rent',
                bedrooms: 3,
                bathrooms: 2
            },
            {
                id: 'rent_2',
                title: '2-Bedroom Condo in VI',
                price: 12000000,
                location: 'Victoria Island, Lagos',
                image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
                adminActivated: true,
                inspectionDate: '2024-10-24',
                inspectionTime: '14:00',
                propertyType: 'rent',
                bedrooms: 2,
                bathrooms: 2
            },
            {
                id: 'rent_3',
                title: '4-Bedroom Duplex in Lekki',
                price: 25000000,
                location: 'Lekki Phase 1, Lagos',
                image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
                adminActivated: false,
                inspectionDate: '2024-10-25',
                inspectionTime: '11:00',
                propertyType: 'rent',
                bedrooms: 4,
                bathrooms: 3
            },

            // SHORTLET PROPERTIES - 2 activated, 1 deactivated
            {
                id: 'shortlet_1',
                title: 'Luxury Shortlet in VI',
                price: 85000,
                location: 'Victoria Island, Lagos',
                image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
                adminActivated: true,
                inspectionDate: '2024-10-26',
                inspectionTime: '15:00',
                propertyType: 'shortlet',
                bedrooms: 2,
                bathrooms: 2
            },
            {
                id: 'shortlet_2',
                title: 'Beachfront Shortlet',
                price: 120000,
                location: 'Lekki, Lagos',
                image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
                adminActivated: false,
                inspectionDate: '2024-10-27',
                inspectionTime: '12:00',
                propertyType: 'shortlet',
                bedrooms: 3,
                bathrooms: 2
            },
            {
                id: 'shortlet_3',
                title: 'City View Studio',
                price: 45000,
                location: 'Ikeja, Lagos',
                image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
                adminActivated: true,
                inspectionDate: '2024-10-28',
                inspectionTime: '16:00',
                propertyType: 'shortlet',
                bedrooms: 1,
                bathrooms: 1
            },

            // COMMERCIAL PROPERTIES - 2 activated, 1 deactivated
            {
                id: 'commercial_1',
                title: 'Office Space in Ikeja',
                price: 8500000,
                location: 'Ikeja GRA, Lagos',
                image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
                adminActivated: true,
                inspectionDate: '2024-10-29',
                inspectionTime: '09:00',
                propertyType: 'commercial',
                size: '1200 sqft'
            },
            {
                id: 'commercial_2',
                title: 'Retail Space Surulere',
                price: 6500000,
                location: 'Surulere, Lagos',
                image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
                adminActivated: false,
                inspectionDate: '2024-10-30',
                inspectionTime: '11:00',
                propertyType: 'commercial',
                size: '800 sqft'
            },
            {
                id: 'commercial_3',
                title: 'Warehouse Space',
                price: 12000000,
                location: 'Amuwo Odofin, Lagos',
                image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
                adminActivated: true,
                inspectionDate: '2024-10-31',
                inspectionTime: '14:00',
                propertyType: 'commercial',
                size: '5000 sqft'
            },

            // BUY PROPERTIES - 2 activated, 1 deactivated
            {
                id: 'buy_1',
                title: '4-Bedroom House Ajah',
                price: 85000000,
                location: 'Ajah, Lagos',
                image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
                adminActivated: true,
                inspectionDate: '2024-11-01',
                inspectionTime: '10:00',
                propertyType: 'buy',
                bedrooms: 4,
                bathrooms: 3
            },
            {
                id: 'buy_2',
                title: 'Luxury Penthouse',
                price: 250000000,
                location: 'Banana Island, Lagos',
                image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
                adminActivated: false,
                inspectionDate: '2024-11-02',
                inspectionTime: '15:00',
                propertyType: 'buy',
                bedrooms: 5,
                bathrooms: 4
            },
            {
                id: 'buy_3',
                title: '3-Bedroom Terrace',
                price: 65000000,
                location: 'Magodo, Lagos',
                image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
                adminActivated: true,
                inspectionDate: '2024-11-03',
                inspectionTime: '13:00',
                propertyType: 'buy',
                bedrooms: 3,
                bathrooms: 2
            }
        ];
        
        localStorage.setItem('domihive_my_applications_properties', JSON.stringify(allProperties));
        console.log('🏠 Created SIMPLE sample properties:', allProperties.length);
    }
}

function loadApplicationsData() {
    allApplications = JSON.parse(localStorage.getItem('domihive_applications')) || [];
    console.log('📄 Applications data loaded:', allApplications.length);
}

// ===== TAB FUNCTIONALITY =====
function initializeTabs() {
    console.log('🎯 Initializing tab functionality...');
    
    // Add click event listeners to tabs
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
    
    // Update tab counts
    updateTabCounts();
    
    // Set initial active tab from URL hash or default to 'rent'
    const initialTab = window.location.hash.replace('#', '') || 'rent';
    if (PROPERTY_TYPES[initialTab]) {
        switchTab(initialTab);
    } else {
        switchTab('rent');
    }
    
    console.log('✅ Tabs initialized successfully');
}

function switchTab(tabName) {
    console.log('🔄 Switching to tab:', tabName);
    
    if (!PROPERTY_TYPES[tabName]) {
        console.error('❌ Invalid tab name:', tabName);
        return;
    }
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Update sections
    document.querySelectorAll('.properties-section').forEach(section => {
        section.classList.remove('active');
    });
    const activeSection = document.getElementById(`${tabName}Section`);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    // Update URL hash for deep linking
    window.location.hash = tabName;
    
    // Trigger a slight delay to ensure DOM is updated before any potential scrolling
    setTimeout(() => {
        // Scroll to top of the section for better UX
        activeSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    
    console.log(`✅ Switched to ${PROPERTY_TYPES[tabName].name} tab`);
}

function updateTabCounts() {
    Object.keys(PROPERTY_TYPES).forEach(type => {
        const typeProperties = allProperties.filter(prop => prop.propertyType === type);
        const count = typeProperties.length;
        const countElement = document.getElementById(`${type}TabCount`);
        
        if (countElement) {
            countElement.textContent = count;
            
            // Add animation for count updates
            countElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                countElement.style.transform = 'scale(1)';
            }, 300);
        }
    });
    console.log('📊 Tab counts updated');
}

// ===== STATISTICS MANAGEMENT =====
function updateAllApplicationStats() {
    console.log('📊 Updating application statistics...');
    
    // Calculate totals across all property types
    let totalPending = 0;
    let totalActive = 0;
    let totalApproved = 0;
    
    Object.keys(PROPERTY_TYPES).forEach(type => {
        const stats = calculatePropertyTypeStats(type);
        totalPending += stats.pending;
        totalActive += stats.active;
        totalApproved += stats.approved;
        
        // Update individual section stats
        document.getElementById(`${type}PendingCount`).textContent = stats.pending;
        document.getElementById(`${type}ActiveCount`).textContent = stats.active;
        document.getElementById(`${type}ApprovedCount`).textContent = stats.approved;
    });
    
    // Update total stats
    document.getElementById('totalPendingCount').textContent = totalPending;
    document.getElementById('totalActiveCount').textContent = totalActive;
    document.getElementById('totalApprovedCount').textContent = totalApproved;
    
    // Update tab counts as well
    updateTabCounts();
    
    console.log('📈 Statistics updated successfully');
}

function calculatePropertyTypeStats(propertyType) {
    const typeProperties = allProperties.filter(prop => prop.propertyType === propertyType);
    
    const pendingCount = typeProperties.filter(property => !property.adminActivated).length;
    
    const activeCount = allApplications.filter(app => {
        const property = allProperties.find(prop => prop.id === app.propertyId);
        return property && property.propertyType === propertyType && 
               (app.status === 'active' || app.status === 'under_review');
    }).length;
    
    const approvedCount = allApplications.filter(app => {
        const property = allProperties.find(prop => prop.id === app.propertyId);
        return property && property.propertyType === propertyType && app.status === 'approved';
    }).length;
    
    return { pending: pendingCount, active: activeCount, approved: approvedCount };
}

// ===== PROPERTIES GRID RENDERING =====
function renderAllPropertiesGrids() {
    console.log('🎨 Rendering all property grids...');
    
    Object.keys(PROPERTY_TYPES).forEach(type => {
        renderPropertiesGridByType(type);
    });
}

function renderPropertiesGridByType(propertyType) {
    const container = document.getElementById(`${propertyType}PropertiesGrid`);
    if (!container) {
        console.error('❌ Properties grid container not found for:', propertyType);
        return;
    }
    
    const typeProperties = allProperties.filter(prop => prop.propertyType === propertyType);
    console.log(`🔍 Found ${typeProperties.length} ${propertyType} properties`);
    
    if (typeProperties.length === 0) {
        container.innerHTML = createEmptyStateHTML(propertyType);
        console.log(`📭 No ${propertyType} properties to display`);
        return;
    }
    
    let propertiesHTML = '';
    
    typeProperties.forEach(property => {
        const application = allApplications.find(app => app.propertyId === property.id);
        const applicationStatus = application ? application.status : null;
        propertiesHTML += createPropertyCardHTML(property, applicationStatus);
    });
    
    container.innerHTML = propertiesHTML;
    console.log(`✅ ${PROPERTY_TYPES[propertyType].name} grid rendered with ${typeProperties.length} properties`);
}

function createEmptyStateHTML(propertyType) {
    const typeConfig = PROPERTY_TYPES[propertyType];
    return `
        <div class="empty-properties">
            <div class="empty-icon">
                <i class="fas ${typeConfig.icon}"></i>
            </div>
            <h3>No ${typeConfig.name} Properties Available</h3>
            <p>All ${typeConfig.name.toLowerCase()} properties are either pending activation or you've completed applications.</p>
        </div>
    `;
}

function createPropertyCardHTML(property, applicationStatus) {
    const typeConfig = PROPERTY_TYPES[property.propertyType];
    const isActivated = property.adminActivated;
    const badgeType = isActivated ? 'badge-ready' : 'badge-pending';
    const badgeText = isActivated ? 'Ready for Application' : 'Pending Activation';
    
    let buttonHTML = '';
    let statusBadgeHTML = '';
    
    if (isActivated) {
        if (applicationStatus === 'active' || applicationStatus === 'under_review') {
            buttonHTML = `
                <button class="btn-continue" onclick="redirectToApplicationProcess('${property.id}')">
                    <i class="fas fa-external-link-alt"></i>
                    Continue Application
                </button>
            `;
            statusBadgeHTML = `<span class="property-badge badge-active">Application Started</span>`;
        } else if (applicationStatus === 'approved') {
            buttonHTML = `
                <button class="btn-continue" onclick="viewApprovedProperty('${property.id}')">
                    <i class="fas fa-check-circle"></i>
                    Application Approved
                </button>
            `;
            statusBadgeHTML = `<span class="property-badge badge-active">APPROVED</span>`;
        } else {
            buttonHTML = `
                <button class="btn-continue" onclick="openDecisionModal('${property.id}')">
                    <i class="fas fa-play-circle"></i>
                    Continue Application
                </button>
            `;
        }
    } else {
        buttonHTML = `
            <button class="btn-continue" disabled>
                <i class="fas fa-clock"></i>
                Awaiting Activation
            </button>
        `;
    }
    
    const priceSuffix = property.propertyType === 'shortlet' ? '/night' : 
                       property.propertyType === 'buy' ? '' : '/year';
    
    // Create property features based on type
    let featuresHTML = '';
    if (property.propertyType === 'commercial') {
        featuresHTML = `
            <span class="property-feature">
                <i class="fas fa-arrows-alt"></i>
                ${property.size}
            </span>
        `;
    } else {
        featuresHTML = `
            <span class="property-feature">
                <i class="fas fa-bed"></i>
                ${property.bedrooms} Bed
            </span>
            <span class="property-feature">
                <i class="fas fa-bath"></i>
                ${property.bathrooms} Bath
            </span>
        `;
    }
    
    const propertyCardHTML = `
        <div class="property-card ${!isActivated ? 'disabled' : ''}" 
             data-property-id="${property.id}" 
             data-property-type="${property.propertyType}">
            <div class="property-image">
                <img src="${property.image}" alt="${property.title}" onerror="this.src='/ASSECT/placeholder-property.jpg'">
                <div class="property-badges">
                    <span class="property-badge ${badgeType}">${badgeText}</span>
                    ${statusBadgeHTML}
                </div>
            </div>
            
            <div class="property-details">
                <div class="property-price">₦${property.price.toLocaleString()}${priceSuffix}</div>
                <h3 class="property-title">${property.title}</h3>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.location}
                </div>
                
                <div class="property-features">
                    ${featuresHTML}
                    <span class="property-feature">
                        <i class="fas fa-calendar"></i>
                        ${formatInspectionDate(property.inspectionDate)}
                    </span>
                </div>
                
                <div class="inspection-date">
                    <strong>${isActivated ? 'Ready to Apply' : 'Inspection Scheduled'}</strong>
                    <span>${isActivated ? 'Complete your application for this property' : formatDateTime(property.inspectionDate, property.inspectionTime)}</span>
                </div>
                
                <div class="property-actions">
                    ${buttonHTML}
                </div>
            </div>
        </div>
    `;
    
    return propertyCardHTML;
}

// ===== DECISION MODAL LOGIC =====
function openDecisionModal(propertyId) {
    const property = allProperties.find(p => p.id === propertyId);
    if (!property) {
        console.error('❌ Property not found:', propertyId);
        showNotification('Property not found', 'error');
        return;
    }
    
    currentPropertyForDecision = property;
    currentPropertyType = property.propertyType;
    currentQuestionStep = 1;
    userAnswers = {};
    
    const typeConfig = PROPERTY_TYPES[currentPropertyType];
    
    // Update modal content
    document.getElementById('modalPropertyPreview').innerHTML = `
        <div class="preview-header">
            <div class="preview-image">
                <img src="${property.image}" alt="${property.title}" onerror="this.src='/ASSECT/placeholder-property.jpg'">
            </div>
            <div class="preview-info">
                <h4>${property.title}</h4>
                <div class="preview-price">₦${property.price.toLocaleString()}${property.propertyType === 'shortlet' ? '/night' : property.propertyType === 'buy' ? '' : '/year'}</div>
                <div class="preview-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.location}
                </div>
            </div>
        </div>
    `;
    
    // Update modal title
    document.getElementById('modalTitle').textContent = `Continue ${typeConfig.name} Application`;
    
    // Update inspection date
    document.getElementById('scheduledInspectionDate').textContent = 
        formatDateTime(property.inspectionDate, property.inspectionTime);
    
    // Load type-specific questions
    loadTypeSpecificQuestions();
    
    // Reset modal state
    resetDecisionModal();
    
    // Show modal
    const modal = document.getElementById('decisionModal');
    modal.classList.add('active');
    
    console.log('📋 Decision modal opened for:', property.title);
}

function loadTypeSpecificQuestions() {
    const typeConfig = PROPERTY_TYPES[currentPropertyType];
    const questionFlow = document.getElementById('questionFlow');
    
    let questionsHTML = '';
    typeConfig.questions.forEach((question, index) => {
        questionsHTML += `
            <div class="question-step ${index === 0 ? 'active' : ''}" id="step${index + 1}">
                <div class="question-header">
                    <span class="step-indicator">${index + 1}</span>
                    <h4>${question}</h4>
                </div>
                <div class="question-actions">
                    <button class="btn-yes" onclick="handleQuestionAnswer(${index + 1}, true)">
                        <i class="fas fa-check"></i>
                        Yes
                    </button>
                    <button class="btn-no" onclick="handleQuestionAnswer(${index + 1}, false)">
                        <i class="fas fa-times"></i>
                        No
                    </button>
                </div>
            </div>
        `;
    });
    
    questionFlow.innerHTML = questionsHTML;
    
    // Load type-specific feedback options
    loadTypeSpecificFeedbackOptions();
    
    // Update proceed section for property type
    document.getElementById('proceedTitle').textContent = typeConfig.proceedTitle;
    document.getElementById('proceedMessage').textContent = typeConfig.proceedMessage;
}

function loadTypeSpecificFeedbackOptions() {
    const typeConfig = PROPERTY_TYPES[currentPropertyType];
    const feedbackOptions = document.getElementById('feedbackOptions');
    
    let optionsHTML = '';
    typeConfig.feedbackOptions.forEach(option => {
        optionsHTML += `
            <label class="option-item">
                <input type="checkbox" name="rejectionReason" value="${option.value}">
                <span class="checkmark"></span>
                <span class="option-text">${option.text}</span>
            </label>
        `;
    });
    
    feedbackOptions.innerHTML = optionsHTML;
    
    // Update feedback title and note
    document.getElementById('feedbackTitle').textContent = `Help us understand your decision about this ${typeConfig.name.toLowerCase()} property`;
    document.getElementById('feedbackNote').textContent = `You can still consider this ${typeConfig.name.toLowerCase()} property later if it's available`;
}

function closeDecisionModal() {
    const modal = document.getElementById('decisionModal');
    modal.classList.remove('active');
    
    // Reset state
    currentPropertyForDecision = null;
    currentPropertyType = '';
    currentQuestionStep = 1;
    userAnswers = {};
    
    console.log('📋 Decision modal closed');
}

function resetDecisionModal() {
    // Hide all sections
    document.getElementById('inspectionRequiredMessage').style.display = 'none';
    document.getElementById('rejectionFeedback').style.display = 'none';
    document.getElementById('proceedSection').style.display = 'none';
    document.getElementById('finalRejectionMessage').style.display = 'none';
    
    // Clear rejection form
    document.querySelectorAll('input[name="rejectionReason"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById('otherReasonInput').style.display = 'none';
    document.querySelector('#otherReasonInput textarea').value = '';
}

function handleQuestionAnswer(step, answer) {
    if (!currentPropertyForDecision) return;
    
    userAnswers[`question${step}`] = answer;
    
    console.log(`❓ Question ${step} answered:`, answer);
    
    // Handle based on step and answer
    switch(step) {
        case 1:
            handleQuestion1Answer(answer);
            break;
        case 2:
            handleQuestion2Answer(answer);
            break;
        case 3:
            handleQuestion3Answer(answer);
            break;
    }
}

function handleQuestion1Answer(answer) {
    if (!answer) {
        showInspectionRequiredMessage();
    } else {
        moveToNextQuestion(2);
    }
}

function handleQuestion2Answer(answer) {
    if (!answer) {
        showRejectionFeedback();
    } else {
        moveToNextQuestion(3);
    }
}

function handleQuestion3Answer(answer) {
    if (!answer) {
        showRejectionFeedback();
    } else {
        showProceedSection();
    }
}

function moveToNextQuestion(nextStep) {
    document.getElementById(`step${currentQuestionStep}`).classList.remove('active');
    document.getElementById(`step${nextStep}`).classList.add('active');
    currentQuestionStep = nextStep;
}

function showInspectionRequiredMessage() {
    document.querySelectorAll('.question-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('inspectionRequiredMessage').style.display = 'block';
}

function showRejectionFeedback() {
    document.querySelectorAll('.question-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('rejectionFeedback').style.display = 'block';
}

function showProceedSection() {
    document.querySelectorAll('.question-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('proceedSection').style.display = 'block';
}

function submitPropertyRejection() {
    if (!currentPropertyForDecision) return;
    
    const rejectionReasons = Array.from(document.querySelectorAll('input[name="rejectionReason"]:checked'))
        .map(checkbox => checkbox.value);
    
    const otherReason = document.querySelector('#otherReasonInput textarea').value;
    if (otherReason) {
        rejectionReasons.push(`other: ${otherReason}`);
    }
    
    // Create rejection record
    const application = {
        id: 'app_' + Date.now(),
        propertyId: currentPropertyForDecision.id,
        userId: currentUser.id,
        status: 'rejected',
        applicationDate: new Date().toISOString(),
        decisionDate: new Date().toISOString(),
        answers: userAnswers,
        rejectionReasons: rejectionReasons,
        propertyType: currentPropertyType
    };
    
    // Add to applications
    allApplications.push(application);
    localStorage.setItem('domihive_applications', JSON.stringify(allApplications));
    
    // Create notification
    createApplicationNotification('property_rejected', currentPropertyForDecision);
    
    // Show final rejection message
    document.getElementById('rejectionFeedback').style.display = 'none';
    document.getElementById('finalRejectionMessage').style.display = 'block';
    
    // Update stats and UI
    updateAllApplicationStats();
    renderPropertiesGridByType(currentPropertyType);
    
    console.log('❌ Property rejected:', application.id);
    
    // Close modal after delay and refresh
    setTimeout(() => {
        closeDecisionModal();
    }, 2000);
}

function redirectToApplication() {
    if (!currentPropertyForDecision) return;
    
    const typeConfig = PROPERTY_TYPES[currentPropertyType];
    
    // Create application record
    const application = {
        id: 'app_' + Date.now(),
        propertyId: currentPropertyForDecision.id,
        userId: currentUser.id,
        status: 'active',
        applicationDate: new Date().toISOString(),
        decisionDate: new Date().toISOString(),
        answers: userAnswers,
        currentStep: 'application_details',
        propertyTitle: currentPropertyForDecision.title,
        propertyLocation: currentPropertyForDecision.location,
        propertyPrice: currentPropertyForDecision.price,
        propertyType: currentPropertyType
    };
    
    // Add to applications
    allApplications.push(application);
    localStorage.setItem('domihive_applications', JSON.stringify(allApplications));
    
    // Save current application to sessionStorage for the application process
    sessionStorage.setItem('current_rental_application', JSON.stringify(application));
    
    // Create notification
    createApplicationNotification('application_started', currentPropertyForDecision);
    
    // Close modal
    closeDecisionModal();
    
    // Update stats and UI
    updateAllApplicationStats();
    renderPropertiesGridByType(currentPropertyType);
    
    // SPA-COMPATIBLE REDIRECTION
    console.log('🚀 Redirecting to:', typeConfig.redirectUrl);
    showNotification(`Starting your ${typeConfig.name.toLowerCase()} application...`, 'success');
    
    setTimeout(() => {
        navigateToApplicationPage(typeConfig.redirectUrl);
    }, 1500);
}

// Enhanced SPA-compatible redirect for existing applications
function redirectToApplicationProcess(propertyId) {
    const application = allApplications.find(app => app.propertyId === propertyId);
    if (application) {
        const property = allProperties.find(p => p.id === propertyId);
        const typeConfig = PROPERTY_TYPES[property.propertyType];
        
        // Save current application to sessionStorage
        sessionStorage.setItem('current_rental_application', JSON.stringify(application));
        
        console.log('🚀 Redirecting to existing application:', typeConfig.redirectUrl);
        showNotification(`Continuing your ${typeConfig.name.toLowerCase()} application...`, 'success');
        
        setTimeout(() => {
            navigateToApplicationPage(typeConfig.redirectUrl);
        }, 1000);
    } else {
        showNotification('Application not found', 'error');
    }
}

// ===== DIRECT PAGE NAVIGATION =====
function navigateToApplicationPage(url) {
    // FORCE direct navigation to actual HTML files
    console.log('🔗 Force redirecting to separate file:', url);
    
    // Use direct window.location navigation
    window.location.href = url;
    
    // Optional: Force reload if needed
    // window.location.assign(url);
}

// ===== NOTIFICATION SYSTEM =====
function createApplicationNotification(type, property) {
    const notifications = JSON.parse(localStorage.getItem('domihive_notifications')) || [];
    const typeConfig = PROPERTY_TYPES[property.propertyType];
    
    const notificationConfig = {
        'application_started': {
            title: `${typeConfig.name} Application Started`,
            message: `You've started an application for ${property.title}`,
            icon: 'fa-file-signature'
        },
        'property_rejected': {
            title: `${typeConfig.name} Property Feedback Submitted`,
            message: `Thank you for your feedback on ${property.title}`,
            icon: 'fa-comment-dots'
        }
    };
    
    const config = notificationConfig[type] || notificationConfig.application_started;
    
    const notification = {
        id: 'notif_' + Date.now(),
        type: type,
        title: config.title,
        message: config.message,
        icon: config.icon,
        timestamp: new Date().toISOString(),
        read: false,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyType: property.propertyType
    };
    
    notifications.unshift(notification);
    localStorage.setItem('domihive_notifications', JSON.stringify(notifications));
    
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const notifications = JSON.parse(localStorage.getItem('domihive_notifications')) || [];
    const unreadCount = notifications.filter(n => !n.read).length;
    
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = unreadCount > 0 ? unreadCount : '';
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatInspectionDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(date, time) {
    const dateObj = new Date(date + 'T' + time);
    return dateObj.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric' 
    }) + ' at ' + formatTime(time);
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function showNotification(message, type = 'success') {
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
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

function closeDecisionModalAndRefresh() {
    closeDecisionModal();
    // Refresh the current view in SPA
    renderAllPropertiesGrids();
    updateAllApplicationStats();
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Close modal buttons
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeDecisionModal);
    }
    
    // Modal overlay click
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeDecisionModal);
    }
    
    // Rejection reason checkboxes (delegated)
    document.addEventListener('change', function(e) {
        if (e.target.name === 'rejectionReason' && e.target.value === 'other') {
            document.getElementById('otherReasonInput').style.display = e.target.checked ? 'block' : 'none';
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDecisionModal();
        }
    });
    
    // Hash change for tab deep linking
    window.addEventListener('hashchange', function() {
        const tabName = window.location.hash.replace('#', '');
        if (PROPERTY_TYPES[tabName]) {
            switchTab(tabName);
        }
    });
    
    console.log('🎯 Event listeners initialized');
}

// ===== DEMO FUNCTIONS =====
function viewApprovedProperty(propertyId) {
    showNotification('This property application has been approved!', 'success');
    console.log('✅ Viewing approved property:', propertyId);
}

// ===== GLOBAL FUNCTIONS FOR SPA COMPATIBILITY =====
window.initializeApplicationsPage = initializeApplicationsPage;
window.openDecisionModal = openDecisionModal;
window.closeDecisionModal = closeDecisionModal;
window.handleQuestionAnswer = handleQuestionAnswer;
window.submitPropertyRejection = submitPropertyRejection;
window.redirectToApplication = redirectToApplication;
window.redirectToApplicationProcess = redirectToApplicationProcess;
window.viewApprovedProperty = viewApprovedProperty;
window.closeDecisionModalAndRefresh = closeDecisionModalAndRefresh;

// Tab functionality exposed globally
window.switchTab = switchTab;
window.initializeTabs = initializeTabs;

// Auto-initialize when included in SPA
if (document.querySelector('.applications-content')) {
    setTimeout(initializeApplicationsPage, 100);
}

console.log('🎉 My Applications JavaScript Loaded Successfully!');

// Debug logging for containers
console.log('Rent container:', document.getElementById('rentPropertiesGrid'));
console.log('Shortlet container:', document.getElementById('shortletPropertiesGrid')); 
console.log('Commercial container:', document.getElementById('commercialPropertiesGrid'));
console.log('Buy container:', document.getElementById('buyPropertiesGrid'));

// Debug logging for properties
const props = JSON.parse(localStorage.getItem('domihive_my_applications_properties') || '[]');
console.log('Total properties:', props.length);
console.log('Rent properties:', props.filter(p => p.propertyType === 'rent').length);
console.log('Shortlet properties:', props.filter(p => p.propertyType === 'shortlet').length);
console.log('Commercial properties:', props.filter(p => p.propertyType === 'commercial').length);
console.log('Buy properties:', props.filter(p => p.propertyType === 'buy').length);