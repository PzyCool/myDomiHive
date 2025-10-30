// application-document-shortlet.js - Complete Shortlet Property Document Upload Logic
document.addEventListener('DOMContentLoaded', function() {
    console.log('📁 Initializing Shortlet Document Upload (Step 2)...');
    
    // Initialize the document upload
    initializeShortletDocumentUpload();
});

// Global variables
let currentApplication = null;
let uploadedFiles = {
    primaryGuestId: null,
    additionalGuestsIds: [],
    selfieWithId: null,
    proofOfTravel: null,
    businessDocuments: null,
    stayReferences: null,
    specialRequirementsDocs: null
};

function initializeShortletDocumentUpload() {
    console.log('📁 Initializing Shortlet Document Upload Process...');
    
    // Load application data from Step 1
    loadApplicationData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize file upload handlers
    initializeFileUploads();
    
    // Update shortlet-specific UI
    updateShortletUI();
    
    console.log('✅ Shortlet document upload initialized');
}

function loadApplicationData() {
    try {
        // Get application data from sessionStorage (set in Step 1)
        const applicationData = sessionStorage.getItem('current_shortlet_application');
        
        if (applicationData) {
            currentApplication = JSON.parse(applicationData);
            console.log('📄 Shortlet application data loaded:', currentApplication);
            
            // Update UI with application data
            updateApplicationDisplay();
            
            // Update hidden fields
            document.getElementById('applicationId').value = currentApplication.applicationId;
            document.getElementById('propertyId').value = currentApplication.propertyId;
            document.getElementById('userId').value = currentApplication.userId;
            
        } else {
            console.error('❌ No shortlet application data found');
            showNotification('Error: Shortlet application data not found. Please start from Step 1.', 'error');
            
            // Redirect back to application page after delay
            setTimeout(() => {
                redirectToApplication();
            }, 3000);
            return;
        }
        
    } catch (error) {
        console.error('Error loading application data:', error);
        showNotification('Error loading application data', 'error');
    }
}

function updateApplicationDisplay() {
    if (!currentApplication) return;
    
    // Update property title
    document.getElementById('applicationPropertyTitle').textContent = currentApplication.propertyTitle;
    
    // Update guest details
    document.getElementById('guestName').textContent = currentApplication.guestInfo.primaryGuest.fullName;
    document.getElementById('applicationId').textContent = currentApplication.applicationId;
    
    // Update stay duration
    const checkIn = new Date(currentApplication.bookingInfo.checkInDate);
    const checkOut = new Date(currentApplication.bookingInfo.checkOutDate);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const stayDuration = `${checkIn.toLocaleDateString('en-US', options)} - ${checkOut.toLocaleDateString('en-US', options)} (${currentApplication.bookingInfo.nights} nights)`;
    document.getElementById('stayDuration').textContent = stayDuration;
    
    // Update total guests
    document.getElementById('totalGuests').textContent = currentApplication.guestInfo.totalGuests;
    
    // Update context type
    const contextElement = document.getElementById('applicationContextType');
    if (contextElement) {
        contextElement.textContent = 'Shortlet Application';
    }
}

function updateShortletUI() {
    // Show/hide sections based on booking purpose
    const purposeOfStay = currentApplication.bookingInfo.purposeOfStay;
    const businessSection = document.getElementById('businessDocumentsSection');
    
    if (purposeOfStay === 'business') {
        businessSection.style.display = 'block';
    } else {
        businessSection.style.display = 'none';
    }
    
    // Show additional guest IDs section if there are additional guests
    const additionalGuestsSection = document.getElementById('additionalGuestsIdsSection');
    if (currentApplication.guestInfo.totalGuests > 1) {
        additionalGuestsSection.classList.remove('optional');
        additionalGuestsSection.classList.add('required');
        document.getElementById('additionalGuestsIds').required = true;
    }
    
    console.log('🏨 Shortlet-specific UI updated');
}

function initializeEventListeners() {
    // Form submission
    document.getElementById('shortletDocumentUploadForm').addEventListener('submit', handleFormSubmission);
    
    // Back buttons
    document.getElementById('backToApplication').addEventListener('click', redirectToApplication);
    document.getElementById('backToApplicationBtn').addEventListener('click', redirectToApplication);
    
    // Terms checkboxes validation
    document.getElementById('agreeDocumentTerms').addEventListener('change', validateForm);
    document.getElementById('agreePrivacy').addEventListener('change', validateForm);
    document.getElementById('agreeGuestVerification').addEventListener('change', validateForm);
    document.getElementById('agreeHouseRules').addEventListener('change', validateForm);
    document.getElementById('agreeAgeVerification').addEventListener('change', validateForm);
}

function initializeFileUploads() {
    // Primary Guest ID upload
    const primaryGuestIdInput = document.getElementById('primaryGuestId');
    const primaryGuestIdArea = document.getElementById('primaryGuestIdArea');
    primaryGuestIdInput.addEventListener('change', (e) => handleFileUpload(e, 'primaryGuestId'));
    setupDragAndDrop(primaryGuestIdArea, primaryGuestIdInput, 'primaryGuestId');
    
    // Additional Guest IDs upload (multiple files)
    const additionalGuestsIdsInput = document.getElementById('additionalGuestsIds');
    const additionalGuestsIdsArea = document.getElementById('additionalGuestsIdsArea');
    additionalGuestsIdsInput.addEventListener('change', (e) => handleMultipleFileUpload(e, 'additionalGuestsIds'));
    setupDragAndDrop(additionalGuestsIdsArea, additionalGuestsIdsInput, 'additionalGuestsIdsMultiple');
    
    // Selfie with ID upload
    const selfieWithIdInput = document.getElementById('selfieWithId');
    const selfieWithIdArea = document.getElementById('selfieWithIdArea');
    selfieWithIdInput.addEventListener('change', (e) => handleFileUpload(e, 'selfieWithId'));
    setupDragAndDrop(selfieWithIdArea, selfieWithIdInput, 'selfieWithId');
    
    // Proof of Travel upload (optional)
    const proofOfTravelInput = document.getElementById('proofOfTravel');
    const proofOfTravelArea = document.getElementById('proofOfTravelArea');
    proofOfTravelInput.addEventListener('change', (e) => handleFileUpload(e, 'proofOfTravel'));
    setupDragAndDrop(proofOfTravelArea, proofOfTravelInput, 'proofOfTravel');
    
    // Business Documents upload (optional)
    const businessDocumentsInput = document.getElementById('businessDocuments');
    const businessDocumentsArea = document.getElementById('businessDocumentsArea');
    businessDocumentsInput.addEventListener('change', (e) => handleFileUpload(e, 'businessDocuments'));
    setupDragAndDrop(businessDocumentsArea, businessDocumentsInput, 'businessDocuments');
    
    // Stay References upload (optional)
    const stayReferencesInput = document.getElementById('stayReferences');
    const stayReferencesArea = document.getElementById('stayReferencesArea');
    stayReferencesInput.addEventListener('change', (e) => handleFileUpload(e, 'stayReferences'));
    setupDragAndDrop(stayReferencesArea, stayReferencesInput, 'stayReferences');
    
    // Special Requirements Docs upload (optional)
    const specialRequirementsDocsInput = document.getElementById('specialRequirementsDocs');
    const specialRequirementsDocsArea = document.getElementById('specialRequirementsDocsArea');
    specialRequirementsDocsInput.addEventListener('change', (e) => handleFileUpload(e, 'specialRequirementsDocs'));
    setupDragAndDrop(specialRequirementsDocsArea, specialRequirementsDocsInput, 'specialRequirementsDocs');
}

function setupDragAndDrop(uploadArea, fileInput, fileType) {
    // Drag enter
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    // Drag leave
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
    });
    
    // Drop
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            if (fileType.includes('Multiple')) {
                const baseType = fileType.replace('Multiple', '');
                handleMultipleFileUpload({ target: { files: files } }, baseType);
            } else {
                const event = new Event('change');
                Object.defineProperty(event, 'target', { value: { files: [files[0]] } });
                
                switch (fileType) {
                    case 'primaryGuestId':
                        handleFileUpload(event, 'primaryGuestId');
                        break;
                    case 'selfieWithId':
                        handleFileUpload(event, 'selfieWithId');
                        break;
                    case 'proofOfTravel':
                        handleFileUpload(event, 'proofOfTravel');
                        break;
                    case 'businessDocuments':
                        handleFileUpload(event, 'businessDocuments');
                        break;
                    case 'stayReferences':
                        handleFileUpload(event, 'stayReferences');
                        break;
                    case 'specialRequirementsDocs':
                        handleFileUpload(event, 'specialRequirementsDocs');
                        break;
                }
            }
        }
    });
}

function handleFileUpload(event, fileType) {
    const file = event.target.files[0];
    const statusElement = document.getElementById(fileType + 'Status');
    const previewContainer = document.getElementById(fileType + 'Preview');
    
    if (!file) return;
    
    console.log('📄 File selected for', fileType, ':', file.name);
    
    // Validate file
    const validation = validateShortletFile(file, fileType);
    if (!validation.isValid) {
        showNotification(validation.message, 'error');
        event.target.value = '';
        updateUploadStatus(statusElement, 'error', validation.message);
        return;
    }
    
    // Store file reference
    uploadedFiles[fileType] = file;
    
    // Create preview
    createFilePreview(file, previewContainer, fileType);
    
    // Update status
    updateUploadStatus(statusElement, 'uploaded', 'Uploaded');
    
    // Validate form
    validateForm();
    
    showNotification(`${formatShortletFileTypeName(fileType)} uploaded successfully`, 'success');
}

function handleMultipleFileUpload(event, fileType) {
    const files = Array.from(event.target.files);
    const statusElement = document.getElementById(fileType + 'Status');
    const previewContainer = document.getElementById(fileType + 'Preview');
    
    console.log('📁 Multiple files selected for', fileType, ':', files.length);
    
    // Clear existing files for this type
    uploadedFiles[fileType] = [];
    previewContainer.innerHTML = '';
    
    let validFilesCount = 0;
    let totalSize = 0;
    
    files.forEach(file => {
        // Validate file
        const validation = validateShortletFile(file, fileType);
        if (!validation.isValid) {
            showNotification(`Skipped invalid file: ${file.name} - ${validation.message}`, 'error');
            return;
        }
        
        // Check total size for multiple files
        totalSize += file.size;
        const maxTotalSize = 10 * 1024 * 1024; // 10MB for multiple guest IDs
        
        if (totalSize > maxTotalSize) {
            showNotification(`Total file size exceeds ${maxTotalSize / (1024 * 1024)}MB limit for ${formatShortletFileTypeName(fileType)}`, 'error');
            return;
        }
        
        // Store file reference
        uploadedFiles[fileType].push(file);
        validFilesCount++;
        
        // Create preview
        createFilePreview(file, previewContainer, fileType);
    });
    
    // Update status
    if (validFilesCount > 0) {
        updateUploadStatus(statusElement, 'uploaded', `${validFilesCount} file(s) uploaded`);
        showNotification(`${validFilesCount} ${formatShortletFileTypeName(fileType)} file(s) uploaded`, 'success');
    } else {
        updateUploadStatus(statusElement, 'none', 'No files');
    }
    
    // Validate form
    validateForm();
}

function validateShortletFile(file, fileType) {
    const maxSizes = {
        primaryGuestId: 5 * 1024 * 1024,
        additionalGuestsIds: 5 * 1024 * 1024,
        selfieWithId: 3 * 1024 * 1024,
        proofOfTravel: 5 * 1024 * 1024,
        businessDocuments: 5 * 1024 * 1024,
        stayReferences: 5 * 1024 * 1024,
        specialRequirementsDocs: 5 * 1024 * 1024
    };
    
    const allowedTypes = {
        primaryGuestId: ['.pdf', '.jpg', '.jpeg', '.png'],
        additionalGuestsIds: ['.pdf', '.jpg', '.jpeg', '.png'],
        selfieWithId: ['.jpg', '.jpeg', '.png'],
        proofOfTravel: ['.pdf', '.jpg', '.jpeg', '.png'],
        businessDocuments: ['.pdf', '.jpg', '.jpeg', '.png'],
        stayReferences: ['.pdf', '.jpg', '.jpeg', '.png'],
        specialRequirementsDocs: ['.pdf', '.jpg', '.jpeg', '.png']
    };
    
    // Check file size
    if (file.size > maxSizes[fileType]) {
        return { 
            isValid: false, 
            message: `File size must be less than ${maxSizes[fileType] / (1024 * 1024)}MB` 
        };
    }
    
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes[fileType].includes(fileExtension)) {
        return { 
            isValid: false, 
            message: `File type not allowed. Accepted types: ${allowedTypes[fileType].join(', ')}` 
        };
    }
    
    // Special validation for selfie (must be image)
    if (fileType === 'selfieWithId' && !file.type.startsWith('image/')) {
        return { isValid: false, message: 'Selfie must be an image file (JPG, PNG)' };
    }
    
    return { isValid: true, message: 'File is valid' };
}

function formatShortletFileTypeName(fileType) {
    const nameMap = {
        primaryGuestId: 'Primary Guest ID',
        additionalGuestsIds: 'Additional Guest ID',
        selfieWithId: 'Selfie with ID',
        proofOfTravel: 'Proof of Travel',
        businessDocuments: 'Business Document',
        stayReferences: 'Stay Reference',
        specialRequirementsDocs: 'Special Requirements Document'
    };
    
    return nameMap[fileType] || fileType;
}

function createFilePreview(file, container, fileType) {
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';
    
    const fileIcon = getFileIcon(file.name);
    const fileSize = formatFileSize(file.size);
    
    previewItem.innerHTML = `
        <i class="fas ${fileIcon} file-icon"></i>
        <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${fileSize}</div>
        </div>
        <button type="button" class="remove-file" onclick="removeFile('${fileType}', '${file.name}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(previewItem);
}

function getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    switch (extension) {
        case 'pdf':
            return 'fa-file-pdf';
        case 'jpg':
        case 'jpeg':
        case 'png':
            return 'fa-file-image';
        case 'doc':
        case 'docx':
            return 'fa-file-word';
        default:
            return 'fa-file';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateUploadStatus(statusElement, status, text) {
    statusElement.textContent = text;
    statusElement.className = 'upload-status';
    
    switch (status) {
        case 'uploaded':
            statusElement.classList.add('uploaded');
            break;
        case 'error':
            statusElement.classList.add('error');
            break;
        default:
            // Keep default styling
            break;
    }
}

function removeFile(fileType, filename) {
    console.log('🗑️ Removing file:', fileType, filename);
    
    if (Array.isArray(uploadedFiles[fileType])) {
        // Multiple files array
        uploadedFiles[fileType] = uploadedFiles[fileType].filter(file => file.name !== filename);
        
        // Re-render preview
        const previewContainer = document.getElementById(fileType + 'Preview');
        previewContainer.innerHTML = '';
        uploadedFiles[fileType].forEach(file => {
            createFilePreview(file, previewContainer, fileType);
        });
        
        // Update status
        const statusText = uploadedFiles[fileType].length > 0 
            ? `${uploadedFiles[fileType].length} file(s) uploaded` 
            : 'No files';
        updateUploadStatus(document.getElementById(fileType + 'Status'), 
                         uploadedFiles[fileType].length > 0 ? 'uploaded' : 'none', 
                         statusText);
    } else {
        // Single file
        uploadedFiles[fileType] = null;
        document.getElementById(fileType).value = '';
        document.getElementById(fileType + 'Preview').innerHTML = '';
        updateUploadStatus(document.getElementById(fileType + 'Status'), 'none', 'Not uploaded');
    }
    
    // Re-validate form
    validateForm();
    
    showNotification('File removed', 'info');
}

// Form Validation and Submission
function validateForm() {
    let isValid = true;
    
    // Clear previous errors
    clearValidationErrors();
    
    // Validate required files
    const requiredFiles = [
        'primaryGuestId',
        'selfieWithId'
    ];
    
    requiredFiles.forEach(fileType => {
        if (!uploadedFiles[fileType]) {
            showFieldError(document.getElementById(fileType + 'Area'), `${formatShortletFileTypeName(fileType)} is required`);
            isValid = false;
        }
    });
    
    // Validate additional guest IDs if there are additional guests
    if (currentApplication.guestInfo.totalGuests > 1) {
        if (uploadedFiles.additionalGuestsIds.length === 0) {
            showFieldError(document.getElementById('additionalGuestsIdsArea'), 'Additional guest IDs are required');
            isValid = false;
        } else if (uploadedFiles.additionalGuestsIds.length < currentApplication.guestInfo.totalGuests - 1) {
            showFieldError(document.getElementById('additionalGuestsIdsArea'), `Please upload IDs for all ${currentApplication.guestInfo.totalGuests - 1} additional guests`);
            isValid = false;
        }
    }
    
    // Validate terms agreements
    const requiredCheckboxes = [
        'agreeDocumentTerms',
        'agreePrivacy', 
        'agreeGuestVerification',
        'agreeHouseRules',
        'agreeAgeVerification'
    ];
    
    requiredCheckboxes.forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        if (!checkbox.checked) {
            showFieldError(checkbox, 'This agreement is required');
            isValid = false;
        }
    });
    
    // Update proceed button state
    const proceedBtn = document.getElementById('proceedToPaymentBtn');
    if (isValid) {
        proceedBtn.disabled = false;
        console.log('✅ Shortlet document form validation passed');
    } else {
        proceedBtn.disabled = true;
        console.log('❌ Shortlet document form validation failed');
    }
    
    return isValid;
}

function showFieldError(field, message) {
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearValidationErrors() {
    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(error => error.remove());
}

function handleFormSubmission(event) {
    event.preventDefault();
    console.log('📝 Shortlet document upload form submission started...');
    
    if (validateForm()) {
        processDocumentUpload();
    }
}

function processDocumentUpload() {
    console.log('🔄 Processing shortlet document upload...');
    
    // Show upload progress modal
    const progressModal = document.getElementById('uploadProgressModal');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressModal.classList.add('active');
    
    // Simulate upload process
    let progress = 0;
    const uploadInterval = setInterval(() => {
        progress += 10;
        progressFill.style.width = progress + '%';
        
        if (progress <= 20) {
            progressText.textContent = 'Validating primary guest identification...';
            updateUploadItem('primaryGuestId', 'processing');
        } 
        else if (progress <= 40) {
            progressText.textContent = 'Processing additional guest IDs...';
            updateUploadItem('primaryGuestId', 'completed');
            updateUploadItem('additionalGuestsIds', 'processing');
        } 
        else if (progress <= 60) {
            progressText.textContent = 'Verifying selfie with ID...';
            updateUploadItem('additionalGuestsIds', 'completed');
            updateUploadItem('selfieWithId', 'processing');
        }
        else if (progress <= 80) {
            progressText.textContent = 'Checking supporting documents...';
            updateUploadItem('selfieWithId', 'completed');
            updateUploadItem('proofOfTravel', 'processing');
            updateUploadItem('businessDocuments', 'processing');
        }
        else {
            progressText.textContent = 'Finalizing guest verification...';
            updateUploadItem('proofOfTravel', 'completed');
            updateUploadItem('businessDocuments', 'completed');
        }
        
        if (progress >= 100) {
            clearInterval(uploadInterval);
            completeDocumentUpload();
        }
    }, 300);
}

function updateUploadItem(itemId, status) {
    const item = document.getElementById('upload' + capitalizeFirst(itemId));
    if (!item) return;
    
    const statusIcon = item.querySelector('.status-icon');
    
    statusIcon.className = 'fas status-icon';
    
    switch (status) {
        case 'processing':
            statusIcon.classList.add('fa-spinner', 'fa-spin');
            break;
        case 'completed':
            statusIcon.classList.add('fa-check', 'fa-beat');
            statusIcon.style.color = '#10b981';
            break;
        case 'error':
            statusIcon.classList.add('fa-times');
            statusIcon.style.color = '#ef4444';
            break;
    }
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function completeDocumentUpload() {
    console.log('✅ Shortlet document upload completed');
    
    // Save document data
    saveDocumentData();
    
    // Show success message
    setTimeout(() => {
        const progressModal = document.getElementById('uploadProgressModal');
        progressModal.classList.remove('active');
        
        showNotification('Shortlet documents uploaded successfully! Redirecting to payment...', 'success');
        
        // Redirect to payment page after delay
        setTimeout(() => {
            redirectToPayment();
        }, 2000);
    }, 1000);
}

function saveDocumentData() {
    const documentData = {
        applicationId: currentApplication.applicationId,
        step: 2,
        documents: {
            primaryGuestId: uploadedFiles.primaryGuestId ? {
                name: uploadedFiles.primaryGuestId.name,
                size: uploadedFiles.primaryGuestId.size,
                type: uploadedFiles.primaryGuestId.type
            } : null,
            additionalGuestsIds: uploadedFiles.additionalGuestsIds.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            selfieWithId: uploadedFiles.selfieWithId ? {
                name: uploadedFiles.selfieWithId.name,
                size: uploadedFiles.selfieWithId.size,
                type: uploadedFiles.selfieWithId.type
            } : null,
            proofOfTravel: uploadedFiles.proofOfTravel ? {
                name: uploadedFiles.proofOfTravel.name,
                size: uploadedFiles.proofOfTravel.size,
                type: uploadedFiles.proofOfTravel.type
            } : null,
            businessDocuments: uploadedFiles.businessDocuments ? {
                name: uploadedFiles.businessDocuments.name,
                size: uploadedFiles.businessDocuments.size,
                type: uploadedFiles.businessDocuments.type
            } : null,
            stayReferences: uploadedFiles.stayReferences ? {
                name: uploadedFiles.stayReferences.name,
                size: uploadedFiles.stayReferences.size,
                type: uploadedFiles.stayReferences.type
            } : null,
            specialRequirementsDocs: uploadedFiles.specialRequirementsDocs ? {
                name: uploadedFiles.specialRequirementsDocs.name,
                size: uploadedFiles.specialRequirementsDocs.size,
                type: uploadedFiles.specialRequirementsDocs.type
            } : null,
            uploadDate: new Date().toISOString()
        },
        termsAgreed: {
            documentTerms: document.getElementById('agreeDocumentTerms').checked,
            privacy: document.getElementById('agreePrivacy').checked,
            guestVerification: document.getElementById('agreeGuestVerification').checked,
            houseRules: document.getElementById('agreeHouseRules').checked,
            ageVerification: document.getElementById('agreeAgeVerification').checked
        }
    };
    
    // Update application data in sessionStorage
    currentApplication.step2 = documentData;
    currentApplication.currentStep = 'document_upload_completed';
    sessionStorage.setItem('current_shortlet_application', JSON.stringify(currentApplication));
    
    // Save to localStorage for persistence
    let applications = JSON.parse(localStorage.getItem('domihive_shortlet_applications')) || [];
    const appIndex = applications.findIndex(app => app.applicationId === currentApplication.applicationId);
    
    if (appIndex !== -1) {
        applications[appIndex] = currentApplication;
    } else {
        applications.push(currentApplication);
    }
    
    localStorage.setItem('domihive_shortlet_applications', JSON.stringify(applications));
    
    console.log('💾 Shortlet document data saved:', documentData);
}

function redirectToApplication() {
    console.log('↩️ Redirecting to shortlet application page...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('application-process-shortlet');
    } else {
        // Fallback to direct navigation
        window.location.href = '/Pages/application-process-shortlet.html';
    }
}

function redirectToPayment() {
    console.log('💳 Redirecting to shortlet payment page...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('application-payment-shortlet');
    } else {
        // Fallback to direct navigation
        window.location.href = '/Pages/application-payment-shortlet.html';
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
window.removeFile = removeFile;

console.log('🎉 Shortlet Document Upload JavaScript Loaded Successfully!');