// tenant-maintenance.js - Maintenance Management System

// SPA Integration
window.spaTenantMaintenanceInit = function() {
    console.log('🎯 SPA: Initializing Tenant Maintenance Content');
    initializeMaintenanceManagement();
};

// Auto-initialize if loaded directly
if (window.location.pathname.includes('tenant-maintenance.html')) {
    document.addEventListener('DOMContentLoaded', initializeMaintenanceManagement);
} else {
    // SPA environment - check if we're on the page and initialize
    setTimeout(function() {
        if (document.querySelector('.tenant-maintenance-content')) {
            console.log('🔍 Detected SPA environment - auto-initializing tenant maintenance');
            initializeMaintenanceManagement();
        }
    }, 500);
}

function initializeMaintenanceManagement() {
    console.log('🛠️ Initializing Maintenance Management System...');
    
    // Global variables
    let currentProperty = null;
    let maintenanceRequests = [];
    let currentFilter = 'all';
    let uploadedMedia = [];
    
    // Load property data and maintenance requests
    loadPropertyData();
    loadMaintenanceRequests();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize form handlers
    initializeFormHandlers();
    
    // Render initial content
    renderPropertyOverview();
    updateQuickStats();
    renderActiveRequests();
    renderTrackingData();
    renderMaintenanceHistory();
    
    console.log('✅ Maintenance management system ready');
}

function loadPropertyData() {
    console.log('📦 Loading property data...');
    
    const propertyId = sessionStorage.getItem('currentMaintenancePropertyId');
    
    if (!propertyId) {
        console.log('❌ No property ID found, using demo property...');
        createDemoProperty();
        return;
    }
    
    // Load from user properties
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    currentProperty = userProperties.find(p => p.id === propertyId);
    
    if (!currentProperty) {
        console.log('❌ Property not found, creating demo...');
        createDemoProperty();
    }
    
    console.log('✅ Loaded property:', currentProperty?.title);
}

function createDemoProperty() {
    currentProperty = {
        id: 'demo_prop_1',
        title: 'Luxury 3-Bedroom Apartment',
        location: 'Ikoyi, Lagos',
        price: 15000000,
        image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
        status: 'active'
    };
}

function loadMaintenanceRequests() {
    console.log('📋 Loading maintenance requests...');
    
    const storedRequests = localStorage.getItem(`domihive_maintenance_${currentProperty.id}`);
    
    if (storedRequests && JSON.parse(storedRequests).length > 0) {
        maintenanceRequests = JSON.parse(storedRequests);
        console.log('✅ Loaded maintenance requests:', maintenanceRequests.length);
    } else {
        console.log('📝 No maintenance requests found, creating demo data...');
        createDemoMaintenanceRequests();
    }
    
    // Sort by creation date (newest first)
    maintenanceRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function createDemoMaintenanceRequests() {
    const demoRequests = [
        {
            id: 'mreq_1',
            propertyId: currentProperty.id,
            title: 'Leaking Kitchen Faucet',
            category: 'plumbing',
            urgency: 'high',
            description: 'The kitchen faucet has been leaking consistently for 2 days. Water drips about once per second. Tried tightening but it continues.',
            status: 'completed',
            createdAt: '2024-01-18T10:00:00Z',
            updatedAt: '2024-01-20T14:30:00Z',
            completedAt: '2024-01-20T14:30:00Z',
            assignedTo: 'John Plumbing Services',
            estimatedCost: 15000,
            actualCost: 12000,
            photos: [],
            videos: [],
            chat: [
                {
                    id: 'chat_1',
                    sender: 'tenant',
                    message: 'The faucet started leaking yesterday evening',
                    timestamp: '2024-01-18T10:00:00Z'
                },
                {
                    id: 'chat_2',
                    sender: 'staff',
                    message: 'We have assigned a plumber. They will contact you within 2 hours.',
                    timestamp: '2024-01-18T11:30:00Z'
                },
                {
                    id: 'chat_3',
                    sender: 'staff',
                    message: 'Repair completed. The washer has been replaced.',
                    timestamp: '2024-01-20T14:30:00Z'
                }
            ]
        },
        {
            id: 'mreq_2',
            propertyId: currentProperty.id,
            title: 'AC Not Cooling Properly',
            category: 'hvac',
            urgency: 'medium',
            description: 'The living room AC unit blows air but doesn\'t cool the room. Filter was cleaned last month.',
            status: 'progress',
            createdAt: '2024-01-22T09:15:00Z',
            updatedAt: '2024-01-22T16:45:00Z',
            assignedTo: 'CoolTech HVAC Services',
            estimatedCost: 25000,
            photos: [],
            videos: [],
            chat: [
                {
                    id: 'chat_4',
                    sender: 'tenant',
                    message: 'AC stopped cooling properly this morning',
                    timestamp: '2024-01-22T09:15:00Z'
                },
                {
                    id: 'chat_5',
                    sender: 'staff',
                    message: 'Technician scheduled for tomorrow morning 9 AM',
                    timestamp: '2024-01-22T16:45:00Z'
                }
            ]
        },
        {
            id: 'mreq_3',
            propertyId: currentProperty.id,
            title: 'Balcony Door Sticking',
            category: 'structural',
            urgency: 'low',
            description: 'The sliding door to the balcony has become difficult to open and close. It seems to be rubbing against the frame.',
            status: 'pending',
            createdAt: '2024-01-23T14:20:00Z',
            updatedAt: '2024-01-23T14:20:00Z',
            photos: [],
            videos: [],
            chat: [
                {
                    id: 'chat_6',
                    sender: 'tenant',
                    message: 'Balcony door has been sticking for a week now',
                    timestamp: '2024-01-23T14:20:00Z'
                }
            ]
        },
        {
            id: 'mreq_4',
            propertyId: currentProperty.id,
            title: 'Electrical Outlet Not Working',
            category: 'electrical',
            urgency: 'high',
            description: 'The outlet in the master bedroom has stopped working. No power to any devices plugged in.',
            status: 'progress',
            createdAt: '2024-01-24T08:45:00Z',
            updatedAt: '2024-01-24T12:00:00Z',
            assignedTo: 'Safe Electric Services',
            estimatedCost: 8000,
            photos: [],
            videos: [],
            chat: [
                {
                    id: 'chat_7',
                    sender: 'tenant',
                    message: 'Emergency: Bedroom outlet not working',
                    timestamp: '2024-01-24T08:45:00Z'
                },
                {
                    id: 'chat_8',
                    sender: 'staff',
                    message: 'Electrician dispatched. Emergency priority.',
                    timestamp: '2024-01-24T09:30:00Z'
                },
                {
                    id: 'chat_9',
                    sender: 'staff',
                    message: 'Electrician on site. Diagnosing the issue.',
                    timestamp: '2024-01-24T12:00:00Z'
                }
            ]
        }
    ];
    
    maintenanceRequests = demoRequests;
    saveMaintenanceRequests();
    console.log('✅ Created demo maintenance requests');
}

function saveMaintenanceRequests() {
    localStorage.setItem(`domihive_maintenance_${currentProperty.id}`, JSON.stringify(maintenanceRequests));
}

function initializeEventListeners() {
    console.log('🎯 Initializing event listeners...');
    
    // Tab navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab, this);
        });
    });
    
    // Request filter buttons
    const filterButtons = document.querySelectorAll('.requests-filter .filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setActiveRequestFilter(filter, this);
        });
    });
    
    // Media upload handlers
    initializeMediaUpload();
    
    console.log('✅ Event listeners initialized');
}

function initializeFormHandlers() {
    console.log('📝 Initializing form handlers...');
    
    const maintenanceForm = document.getElementById('maintenanceForm');
    if (maintenanceForm) {
        maintenanceForm.addEventListener('submit', handleMaintenanceSubmit);
    }
    
    // Initialize date picker with min date (today)
    const preferredDateInput = document.getElementById('preferredDate');
    if (preferredDateInput) {
        const today = new Date().toISOString().split('T')[0];
        preferredDateInput.min = today;
    }
    
    console.log('✅ Form handlers initialized');
}

function initializeMediaUpload() {
    console.log('📸 Initializing media upload...');
    
    const photoUpload = document.getElementById('photoUpload');
    const videoUpload = document.getElementById('videoUpload');
    
    if (photoUpload) {
        photoUpload.addEventListener('change', handlePhotoUpload);
    }
    
    if (videoUpload) {
        videoUpload.addEventListener('change', handleVideoUpload);
    }
    
    // Drag and drop functionality
    const uploadAreas = document.querySelectorAll('.upload-area');
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', handleDragOver);
        area.addEventListener('drop', handleDrop);
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = 'var(--accent-color)';
    e.currentTarget.style.background = 'rgba(159, 117, 57, 0.1)';
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = 'var(--gray-light)';
    e.currentTarget.style.background = 'var(--light-gray)';
    
    const files = e.dataTransfer.files;
    const isPhotoArea = e.currentTarget.id === 'photoUploadArea';
    
    if (isPhotoArea) {
        handleMediaFiles(files, 'photo');
    } else {
        handleMediaFiles(files, 'video');
    }
}

function handlePhotoUpload(e) {
    handleMediaFiles(e.target.files, 'photo');
}

function handleVideoUpload(e) {
    handleMediaFiles(e.target.files, 'video');
}

function handleMediaFiles(files, type) {
    console.log(`📁 Handling ${files.length} ${type} files...`);
    
    for (let file of files) {
        // Validate file type and size
        if (type === 'photo' && !file.type.startsWith('image/')) {
            showNotification('Please upload only image files for photos', 'error');
            continue;
        }
        
        if (type === 'video' && !file.type.startsWith('video/')) {
            showNotification('Please upload only video files', 'error');
            continue;
        }
        
        const maxSize = type === 'photo' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for photos, 50MB for videos
        if (file.size > maxSize) {
            showNotification(`File too large. Maximum size for ${type}s is ${maxSize / (1024 * 1024)}MB`, 'error');
            continue;
        }
        
        // Create preview and store file
        const mediaItem = {
            id: 'media_' + Date.now() + Math.random(),
            file: file,
            type: type,
            url: URL.createObjectURL(file)
        };
        
        uploadedMedia.push(mediaItem);
        renderMediaPreview();
    }
}

function renderMediaPreview() {
    const previewContainer = document.getElementById('mediaPreview');
    
    if (!previewContainer) return;
    
    if (uploadedMedia.length === 0) {
        previewContainer.innerHTML = '<p class="no-media">No media uploaded yet</p>';
        return;
    }
    
    const previewHTML = uploadedMedia.map(media => `
        <div class="media-item">
            ${media.type === 'photo' ? 
                `<img src="${media.url}" alt="Uploaded photo">` :
                `<video controls>
                    <source src="${media.url}" type="${media.file.type}">
                    Your browser does not support the video tag.
                </video>`
            }
            <button class="media-remove" onclick="removeMedia('${media.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    previewContainer.innerHTML = previewHTML;
}

window.removeMedia = function(mediaId) {
    uploadedMedia = uploadedMedia.filter(media => media.id !== mediaId);
    renderMediaPreview();
    console.log('🗑️ Removed media item:', mediaId);
};

function handleMaintenanceSubmit(e) {
    e.preventDefault();
    console.log('📤 Submitting maintenance request...');
    
    const formData = new FormData(e.target);
    const formElements = e.target.elements;
    
    // Basic validation
    if (!formElements.issueTitle.value.trim()) {
        showNotification('Please enter an issue title', 'error');
        return;
    }
    
    if (!formElements.issueCategory.value) {
        showNotification('Please select a category', 'error');
        return;
    }
    
    if (!formElements.issueDescription.value.trim()) {
        showNotification('Please describe the issue', 'error');
        return;
    }
    
    // Create new maintenance request
    const newRequest = {
        id: 'mreq_' + Date.now(),
        propertyId: currentProperty.id,
        title: formElements.issueTitle.value,
        category: formElements.issueCategory.value,
        urgency: formElements.urgencyLevel.value,
        description: formElements.issueDescription.value,
        preferredDate: formElements.preferredDate.value || null,
        contactPhone: formElements.contactPhone.value || '',
        bestTime: formElements.bestTime.value || '',
        permissionToEnter: formElements.permissionToEnter.checked,
        emergencyContact: formElements.emergencyContact.checked,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        photos: uploadedMedia.filter(m => m.type === 'photo').map(m => ({
            name: m.file.name,
            url: m.url,
            type: m.file.type
        })),
        videos: uploadedMedia.filter(m => m.type === 'video').map(m => ({
            name: m.file.name,
            url: m.url,
            type: m.file.type
        })),
        chat: [
            {
                id: 'chat_' + Date.now(),
                sender: 'tenant',
                message: formElements.issueDescription.value,
                timestamp: new Date().toISOString()
            }
        ]
    };
    
    // Add to requests array
    maintenanceRequests.unshift(newRequest);
    saveMaintenanceRequests();
    
    // Clear form and media
    clearForm();
    uploadedMedia = [];
    renderMediaPreview();
    
    // Update UI
    updateQuickStats();
    renderActiveRequests();
    renderTrackingData();
    renderMaintenanceHistory();
    
    // Show success and switch to active requests tab
    showNotification('Maintenance request submitted successfully!', 'success');
    switchTab('active-requests');
    
    console.log('✅ New maintenance request created:', newRequest.id);
}

function clearForm() {
    const form = document.getElementById('maintenanceForm');
    if (form) {
        form.reset();
    }
}

window.clearForm = clearForm;

function renderPropertyOverview() {
    const overviewElement = document.getElementById('propertyOverview');
    const pageTitle = document.getElementById('maintenancePageTitle');
    const pageSubtitle = document.getElementById('maintenancePageSubtitle');
    
    if (!currentProperty) return;
    
    if (overviewElement) {
        overviewElement.innerHTML = `
            <div class="property-overview-image">
                <img src="${currentProperty.image}" alt="${currentProperty.title}" onerror="this.src='/ASSECT/placeholder-property.jpg'">
            </div>
            <div class="property-overview-info">
                <h2>${currentProperty.title}</h2>
                <div class="property-overview-price">₦${currentProperty.price?.toLocaleString() || '0'}/year</div>
                <div class="property-overview-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${currentProperty.location}
                </div>
            </div>
        `;
    }
    
    if (pageTitle) {
        pageTitle.innerHTML = `<i class="fas fa-tools"></i>Maintenance - ${currentProperty.title}`;
    }
    
    if (pageSubtitle) {
        pageSubtitle.textContent = `Managing maintenance requests for ${currentProperty.location}`;
    }
}

function updateQuickStats() {
    console.log('📊 Updating quick stats...');
    
    const pending = maintenanceRequests.filter(req => req.status === 'pending').length;
    const progress = maintenanceRequests.filter(req => req.status === 'progress').length;
    const completed = maintenanceRequests.filter(req => req.status === 'completed').length;
    const urgent = maintenanceRequests.filter(req => req.urgency === 'high' || req.urgency === 'emergency').length;
    
    // Update DOM elements
    const pendingEl = document.getElementById('propertyPendingRequests');
    const progressEl = document.getElementById('propertyInProgressRequests');
    const completedEl = document.getElementById('propertyCompletedRequests');
    const urgentEl = document.getElementById('propertyUrgentRequests');
    
    if (pendingEl) pendingEl.textContent = pending;
    if (progressEl) progressEl.textContent = progress;
    if (completedEl) completedEl.textContent = completed;
    if (urgentEl) urgentEl.textContent = urgent;
    
    console.log('✅ Quick stats updated');
}

function renderActiveRequests() {
    console.log('📋 Rendering active requests...');
    
    const container = document.getElementById('activeRequestsList');
    
    if (!container) return;
    
    // Filter requests based on current filter
    let filteredRequests = maintenanceRequests;
    
    switch(currentFilter) {
        case 'pending':
            filteredRequests = maintenanceRequests.filter(req => req.status === 'pending');
            break;
        case 'progress':
            filteredRequests = maintenanceRequests.filter(req => req.status === 'progress');
            break;
        case 'urgent':
            filteredRequests = maintenanceRequests.filter(req => req.urgency === 'high' || req.urgency === 'emergency');
            break;
        case 'all':
        default:
            filteredRequests = maintenanceRequests.filter(req => req.status !== 'completed');
    }
    
    if (filteredRequests.length === 0) {
        container.innerHTML = `
            <div class="empty-requests">
                <i class="fas fa-tools"></i>
                <h4>No Active Requests</h4>
                <p>You don't have any active maintenance requests</p>
                <button class="btn-primary" onclick="switchToTab('new-request')">
                    <i class="fas fa-plus"></i>
                    Submit New Request
                </button>
            </div>
        `;
        return;
    }
    
    const requestsHTML = filteredRequests.map(request => `
        <div class="request-card">
            <div class="request-header">
                <div>
                    <div class="request-title">${request.title}</div>
                    <div class="request-meta">
                        <span>${formatCategory(request.category)}</span>
                        <span>•</span>
                        <span>${formatDate(request.createdAt)}</span>
                        <span>•</span>
                        <span>${formatUrgency(request.urgency)}</span>
                    </div>
                </div>
                <div class="request-status status-${request.status}">
                    ${formatStatus(request.status)}
                </div>
            </div>
            <div class="request-description">
                ${request.description}
            </div>
            <div class="request-actions">
                <button class="btn-secondary btn-sm" onclick="viewRequestDetails('${request.id}')">
                    <i class="fas fa-eye"></i>
                    View Details
                </button>
                <button class="btn-primary btn-sm" onclick="openMaintenanceChat('${request.id}')">
                    <i class="fas fa-comments"></i>
                    Chat
                </button>
                ${request.status !== 'completed' ? `
                    <button class="btn-danger btn-sm" onclick="cancelRequest('${request.id}')">
                        <i class="fas fa-times"></i>
                        Cancel
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = requestsHTML;
    console.log('✅ Rendered', filteredRequests.length, 'active requests');
}

function renderTrackingData() {
    console.log('📈 Rendering tracking data...');
    
    // Calculate statistics
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const requestsThisMonth = maintenanceRequests.filter(req => {
        const reqDate = new Date(req.createdAt);
        return reqDate.getMonth() === thisMonth && reqDate.getFullYear() === thisYear;
    }).length;
    
    const completedRequests = maintenanceRequests.filter(req => req.status === 'completed');
    const totalResolutionTime = completedRequests.reduce((total, req) => {
        const created = new Date(req.createdAt);
        const completed = new Date(req.completedAt || req.updatedAt);
        return total + (completed - created);
    }, 0);
    
    const avgResolutionTime = completedRequests.length > 0 ? 
        Math.round(totalResolutionTime / completedRequests.length / (1000 * 60 * 60 * 24)) : 0;
    
    const satisfactionRate = completedRequests.length > 0 ? '95%' : '0%';
    
    // Update progress stats
    const progressNumbers = document.querySelectorAll('.progress-number');
    if (progressNumbers.length >= 3) {
        progressNumbers[0].textContent = requestsThisMonth;
        progressNumbers[1].textContent = avgResolutionTime > 0 ? `${avgResolutionTime} days` : 'N/A';
        progressNumbers[2].textContent = satisfactionRate;
    }
    
    // Update flow steps based on latest request
    const latestRequest = maintenanceRequests[0];
    if (latestRequest) {
        updateFlowSteps(latestRequest);
    }
    
    console.log('✅ Tracking data rendered');
}

function updateFlowSteps(request) {
    const flowSteps = document.querySelectorAll('.flow-step');
    
    // Reset all steps
    flowSteps.forEach(step => {
        step.classList.remove('active');
        const statusElement = step.querySelector('.step-status');
        if (statusElement) {
            statusElement.textContent = 'Pending';
            statusElement.style.background = 'var(--light-gray)';
            statusElement.style.color = 'var(--gray)';
        }
    });
    
    // Activate steps based on request status
    let activeStepIndex = 0;
    
    switch(request.status) {
        case 'pending':
            activeStepIndex = 0; // Request Submitted
            break;
        case 'progress':
            activeStepIndex = request.assignedTo ? 2 : 1; // Technician Assigned or Under Review
            break;
        case 'completed':
            activeStepIndex = 4; // Completed
            break;
    }
    
    // Activate steps up to current status
    for (let i = 0; i <= activeStepIndex; i++) {
        if (flowSteps[i]) {
            flowSteps[i].classList.add('active');
            const statusElement = flowSteps[i].querySelector('.step-status');
            if (statusElement) {
                statusElement.textContent = i === activeStepIndex ? 'Current' : 'Completed';
                statusElement.style.background = i === activeStepIndex ? 'var(--accent-color)' : 'var(--success)';
                statusElement.style.color = 'var(--white)';
            }
        }
    }
}

function renderMaintenanceHistory() {
    console.log('📝 Rendering maintenance history...');
    
    const container = document.getElementById('maintenanceHistory');
    
    if (!container) return;
    
    const completedRequests = maintenanceRequests.filter(req => req.status === 'completed');
    const cancelledRequests = maintenanceRequests.filter(req => req.status === 'cancelled');
    const allHistory = [...completedRequests, ...cancelledRequests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (allHistory.length === 0) {
        container.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-history"></i>
                <h4>No Maintenance History</h4>
                <p>Your maintenance history will appear here</p>
            </div>
        `;
        return;
    }
    
    const historyHTML = allHistory.map(request => `
        <div class="request-card">
            <div class="request-header">
                <div>
                    <div class="request-title">${request.title}</div>
                    <div class="request-meta">
                        <span>${formatCategory(request.category)}</span>
                        <span>•</span>
                        <span>${formatDate(request.createdAt)}</span>
                        <span>•</span>
                        <span>${request.actualCost ? `₦${request.actualCost.toLocaleString()}` : 'No Cost'}</span>
                    </div>
                </div>
                <div class="request-status status-${request.status}">
                    ${formatStatus(request.status)}
                </div>
            </div>
            <div class="request-description">
                ${request.description}
            </div>
            <div class="request-meta">
                <strong>Completed:</strong> ${request.completedAt ? formatDate(request.completedAt) : 'N/A'}
                ${request.assignedTo ? `<span>•</span><strong>Technician:</strong> ${request.assignedTo}` : ''}
            </div>
            <div class="request-actions">
                <button class="btn-secondary btn-sm" onclick="viewRequestDetails('${request.id}')">
                    <i class="fas fa-eye"></i>
                    View Details
                </button>
                <button class="btn-primary btn-sm" onclick="openMaintenanceChat('${request.id}')">
                    <i class="fas fa-comments"></i>
                    View Chat
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = historyHTML;
    console.log('✅ Rendered', allHistory.length, 'history items');
}

// Tab Management
function switchTab(tabName, clickedButton = null) {
    console.log('🔄 Switching to tab:', tabName);
    
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (clickedButton) {
        clickedButton.classList.add('active');
    } else {
        const targetButton = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
        if (targetButton) targetButton.classList.add('active');
    }
    
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show target tab content
    const targetContent = document.getElementById(`${tabName}-content`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Refresh tab content if needed
    if (tabName === 'active-requests') {
        renderActiveRequests();
    } else if (tabName === 'tracking') {
        renderTrackingData();
    } else if (tabName === 'history') {
        renderMaintenanceHistory();
    }
}

window.switchToTab = switchTab;

function setActiveRequestFilter(filter, clickedButton) {
    console.log('🔍 Setting active request filter:', filter);
    
    currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.requests-filter .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    clickedButton.classList.add('active');
    
    // Re-render active requests
    renderActiveRequests();
}

// Request Management Functions
window.viewRequestDetails = function(requestId) {
    console.log('👀 Viewing request details:', requestId);
    
    const request = maintenanceRequests.find(req => req.id === requestId);
    if (!request) return;
    
    const modalContent = document.getElementById('requestDetailsContent');
    const modalTitle = document.getElementById('requestModalTitle');
    
    if (modalContent && modalTitle) {
        modalTitle.textContent = request.title;
        
        modalContent.innerHTML = `
            <div class="request-detail-section">
                <h4>Issue Details</h4>
                <p><strong>Description:</strong> ${request.description}</p>
                <p><strong>Category:</strong> ${formatCategory(request.category)}</p>
                <p><strong>Urgency:</strong> ${formatUrgency(request.urgency)}</p>
                <p><strong>Status:</strong> <span class="request-status status-${request.status}">${formatStatus(request.status)}</span></p>
            </div>
            
            <div class="request-detail-section">
                <h4>Timeline</h4>
                <p><strong>Submitted:</strong> ${formatDateTime(request.createdAt)}</p>
                <p><strong>Last Updated:</strong> ${formatDateTime(request.updatedAt)}</p>
                ${request.completedAt ? `<p><strong>Completed:</strong> ${formatDateTime(request.completedAt)}</p>` : ''}
            </div>
            
            ${request.assignedTo ? `
            <div class="request-detail-section">
                <h4>Assignment</h4>
                <p><strong>Assigned To:</strong> ${request.assignedTo}</p>
                ${request.estimatedCost ? `<p><strong>Estimated Cost:</strong> ₦${request.estimatedCost.toLocaleString()}</p>` : ''}
                ${request.actualCost ? `<p><strong>Actual Cost:</strong> ₦${request.actualCost.toLocaleString()}</p>` : ''}
            </div>
            ` : ''}
            
            ${request.photos.length > 0 || request.videos.length > 0 ? `
            <div class="request-detail-section">
                <h4>Media Evidence</h4>
                <div class="media-preview">
                    ${request.photos.map(photo => `
                        <div class="media-item">
                            <img src="${photo.url}" alt="Issue photo">
                        </div>
                    `).join('')}
                    ${request.videos.map(video => `
                        <div class="media-item">
                            <video controls>
                                <source src="${video.url}" type="${video.type}">
                            </video>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        `;
        
        document.getElementById('requestDetailsModal').classList.add('active');
    }
};

window.openMaintenanceChat = function(requestId) {
    console.log('💬 Opening maintenance chat:', requestId);
    
    const request = maintenanceRequests.find(req => req.id === requestId);
    if (!request) return;
    
    const chatContainer = document.getElementById('chatContainer');
    const chatTitle = document.getElementById('chatModalTitle');
    
    if (chatContainer && chatTitle) {
        chatTitle.textContent = `Chat - ${request.title}`;
        
        // Store current request ID for sending messages
        chatContainer.dataset.requestId = requestId;
        
        // Render chat messages
        const chatHTML = request.chat.map(message => `
            <div class="chat-message ${message.sender}">
                <div class="message-content">${message.message}</div>
                <div class="message-time">${formatTime(message.timestamp)}</div>
            </div>
        `).join('');
        
        chatContainer.innerHTML = chatHTML;
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        document.getElementById('maintenanceChatModal').classList.add('active');
    }
};

window.sendChatMessage = function() {
    const messageInput = document.getElementById('chatMessageInput');
    const chatContainer = document.getElementById('chatContainer');
    const requestId = chatContainer?.dataset.requestId;
    
    if (!messageInput || !messageInput.value.trim() || !requestId) return;
    
    const request = maintenanceRequests.find(req => req.id === requestId);
    if (!request) return;
    
    // Add new message
    const newMessage = {
        id: 'chat_' + Date.now(),
        sender: 'tenant',
        message: messageInput.value.trim(),
        timestamp: new Date().toISOString()
    };
    
    request.chat.push(newMessage);
    request.updatedAt = new Date().toISOString();
    
    // Save and update UI
    saveMaintenanceRequests();
    
    // Re-render chat
    openMaintenanceChat(requestId);
    
    // Clear input
    messageInput.value = '';
    
    console.log('💬 Sent chat message for request:', requestId);
};

window.cancelRequest = function(requestId) {
    if (!confirm('Are you sure you want to cancel this maintenance request?')) return;
    
    const request = maintenanceRequests.find(req => req.id === requestId);
    if (request) {
        request.status = 'cancelled';
        request.updatedAt = new Date().toISOString();
        
        // Add cancellation message to chat
        request.chat.push({
            id: 'chat_' + Date.now(),
            sender: 'system',
            message: 'Maintenance request cancelled by tenant',
            timestamp: new Date().toISOString()
        });
        
        saveMaintenanceRequests();
        updateQuickStats();
        renderActiveRequests();
        renderTrackingData();
        renderMaintenanceHistory();
        
        showNotification('Maintenance request cancelled', 'success');
        console.log('❌ Cancelled request:', requestId);
    }
};

window.closeMaintenanceChat = function() {
    document.getElementById('maintenanceChatModal').classList.remove('active');
};

window.closeRequestDetails = function() {
    document.getElementById('requestDetailsModal').classList.remove('active');
};

// Navigation Functions
window.goBackToMaintenance = function() {
    console.log('🔙 Returning to maintenance properties...');
    
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('maintenance');
    } else {
        window.location.href = '/Pages/maintenance-content.html';
    }
};

// Utility Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatCategory(category) {
    const categories = {
        'plumbing': 'Plumbing',
        'electrical': 'Electrical',
        'hvac': 'HVAC',
        'appliance': 'Appliance',
        'structural': 'Structural',
        'pest': 'Pest Control',
        'emergency': 'Emergency',
        'other': 'Other'
    };
    return categories[category] || category;
}

function formatUrgency(urgency) {
    const urgencies = {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High',
        'emergency': 'Emergency'
    };
    return urgencies[urgency] || urgency;
}

function formatStatus(status) {
    const statuses = {
        'pending': 'Pending',
        'progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    return statuses[status] || status;
}

// Utility function for showing notifications
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

// Add CSS animations for notifications if not already present
if (!document.querySelector('#notification-animations')) {
    const style = document.createElement('style');
    style.id = 'notification-animations';
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
        
        .no-media {
            text-align: center;
            color: var(--gray);
            font-style: italic;
            padding: 2rem;
        }
        
        .request-detail-section {
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--gray-light);
        }
        
        .request-detail-section:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        
        .request-detail-section h4 {
            color: var(--primary-color);
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }
        
        .message-content {
            margin-bottom: 0.3rem;
        }
        
        .message-time {
            font-size: 0.8rem;
            color: var(--gray);
        }
    `;
    document.head.appendChild(style);
}

console.log('🎉 Tenant Maintenance Management JavaScript Loaded!');