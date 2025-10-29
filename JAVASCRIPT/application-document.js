// application-document.js - Complete with Employment Logic & File Upload
document.addEventListener('DOMContentLoaded', function() {
    console.log('📁 Initializing Document Upload (Step 2)...');
    
    // Initialize the document upload
    initializeDocumentUpload();
});

// Global variables
let currentApplication = null;
let uploadedFiles = {
    governmentId: null,
    proofOfIncome: null,
    additionalDocuments: []
};

function initializeDocumentUpload() {
    console.log('📁 Initializing Document Upload Process...');
    
    // Load application data from Step 1
    loadApplicationData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize file upload handlers
    initializeFileUploads();
    
    // Check employment status and adjust UI
    checkEmploymentStatus();
    
    console.log('✅ Document upload initialized');
}

function loadApplicationData() {
    try {
        // Get application data from sessionStorage (set in Step 1)
        const applicationData = sessionStorage.getItem('current_rental_application');
        
        if (applicationData) {
            currentApplication = JSON.parse(applicationData);
            console.log('📄 Application data loaded:', currentApplication);
            
            // Update UI with application data
            updateApplicationDisplay();
            
            // Update hidden fields
            document.getElementById('applicationId').value = currentApplication.applicationId;
            document.getElementById('propertyId').value = currentApplication.propertyId;
            document.getElementById('userId').value = currentApplication.userId;
            
        } else {
            console.error('❌ No application data found');
            showNotification('Error: Application data not found. Please start from Step 1.', 'error');
            
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
    
    // Update applicant details
    document.getElementById('applicantName').textContent = currentApplication.personalInfo.fullName;
    document.getElementById('applicationId').textContent = currentApplication.applicationId;
    document.getElementById('applicantOccupation').textContent = currentApplication.personalInfo.occupation || 'Not specified';
    
    // Update context type
    const contextElement = document.getElementById('applicationContextType');
    if (contextElement) {
        contextElement.textContent = 'Rental Application';
    }
}

function checkEmploymentStatus() {
    if (!currentApplication) return;
    
    const isEmployed = currentApplication.employmentInfo.isEmployed;
    console.log('💼 Employment status from application:', isEmployed);
    
    // Show/hide proof of income section based on employment status
    const proofOfIncomeSection = document.querySelector('.upload-group.required:nth-child(2)');
    
    if (proofOfIncomeSection) {
        if (isEmployed) {
            proofOfIncomeSection.style.display = 'block';
            console.log('📊 Proof of income section: VISIBLE (user is employed)');
        } else {
            proofOfIncomeSection.style.display = 'none';
            console.log('📊 Proof of income section: HIDDEN (user is not employed)');
        }
    }
}

function initializeEventListeners() {
    // Form submission
    document.getElementById('documentUploadForm').addEventListener('submit', handleFormSubmission);
    
    // Back buttons
    document.getElementById('backToApplication').addEventListener('click', redirectToApplication);
    document.getElementById('backToApplicationBtn').addEventListener('click', redirectToApplication);
    
    // Terms checkboxes validation
    document.getElementById('agreeDocumentTerms').addEventListener('change', validateForm);
    document.getElementById('agreePrivacy').addEventListener('change', validateForm);
    document.getElementById('agreeVerification').addEventListener('change', validateForm);
}

function initializeFileUploads() {
    // Government ID upload
    const governmentIdInput = document.getElementById('governmentId');
    const governmentIdArea = document.getElementById('governmentIdArea');
    
    governmentIdInput.addEventListener('change', (e) => handleFileUpload(e, 'governmentId'));
    setupDragAndDrop(governmentIdArea, governmentIdInput, 'governmentId');
    
    // Proof of Income upload (only if user is employed)
    if (currentApplication?.employmentInfo?.isEmployed) {
        const proofOfIncomeInput = document.getElementById('proofOfIncome');
        const proofOfIncomeArea = document.getElementById('proofOfIncomeArea');
        
        proofOfIncomeInput.addEventListener('change', (e) => handleFileUpload(e, 'proofOfIncome'));
        setupDragAndDrop(proofOfIncomeArea, proofOfIncomeInput, 'proofOfIncome');
    }
    
    // Additional documents upload
    const additionalDocsInput = document.getElementById('additionalDocuments');
    const additionalDocsArea = document.getElementById('additionalDocumentsArea');
    
    additionalDocsInput.addEventListener('change', (e) => handleAdditionalDocuments(e));
    setupDragAndDrop(additionalDocsArea, additionalDocsInput, 'additional');
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
            if (fileType === 'additional') {
                handleAdditionalDocuments({ target: { files: files } });
            } else {
                const event = new Event('change');
                Object.defineProperty(event, 'target', { value: { files: files } });
                if (fileType === 'governmentId') {
                    handleFileUpload(event, 'governmentId');
                } else if (fileType === 'proofOfIncome') {
                    handleFileUpload(event, 'proofOfIncome');
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
    const validation = validateFile(file, fileType);
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
    
    showNotification(`${fileType.replace(/([A-Z])/g, ' $1')} uploaded successfully`, 'success');
}

function handleAdditionalDocuments(event) {
    const files = Array.from(event.target.files);
    const statusElement = document.getElementById('additionalDocumentsStatus');
    const previewContainer = document.getElementById('additionalDocumentsPreview');
    
    console.log('📁 Additional documents selected:', files.length);
    
    // Clear existing additional documents
    uploadedFiles.additionalDocuments = [];
    previewContainer.innerHTML = '';
    
    let validFilesCount = 0;
    
    files.forEach(file => {
        // Validate file
        const validation = validateFile(file, 'additional');
        if (!validation.isValid) {
            showNotification(`Skipped invalid file: ${file.name} - ${validation.message}`, 'error');
            return;
        }
        
        // Store file reference
        uploadedFiles.additionalDocuments.push(file);
        validFilesCount++;
        
        // Create preview
        createFilePreview(file, previewContainer, 'additional');
    });
    
    // Update status
    if (validFilesCount > 0) {
        updateUploadStatus(statusElement, 'uploaded', `${validFilesCount} file(s) uploaded`);
        showNotification(`${validFilesCount} additional document(s) uploaded`, 'success');
    } else {
        updateUploadStatus(statusElement, 'none', 'No files');
    }
    
    // Validate form
    validateForm();
}

function validateFile(file, fileType) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = {
        governmentId: ['.pdf', '.jpg', '.jpeg', '.png'],
        proofOfIncome: ['.pdf', '.jpg', '.jpeg', '.png'],
        additional: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
    };
    
    // Check file size
    if (file.size > maxSize) {
        return { isValid: false, message: 'File size must be less than 5MB' };
    }
    
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes[fileType].includes(fileExtension)) {
        return { 
            isValid: false, 
            message: `File type not allowed. Accepted types: ${allowedTypes[fileType].join(', ')}` 
        };
    }
    
    return { isValid: true, message: 'File is valid' };
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
    
    if (fileType === 'governmentId') {
        uploadedFiles.governmentId = null;
        document.getElementById('governmentId').value = '';
        document.getElementById('governmentIdPreview').innerHTML = '';
        updateUploadStatus(document.getElementById('governmentIdStatus'), 'none', 'Not uploaded');
    } 
    else if (fileType === 'proofOfIncome') {
        uploadedFiles.proofOfIncome = null;
        document.getElementById('proofOfIncome').value = '';
        document.getElementById('proofOfIncomePreview').innerHTML = '';
        updateUploadStatus(document.getElementById('proofOfIncomeStatus'), 'none', 'Not uploaded');
    } 
    else if (fileType === 'additional') {
        uploadedFiles.additionalDocuments = uploadedFiles.additionalDocuments.filter(
            file => file.name !== filename
        );
        
        // Re-render additional documents preview
        const previewContainer = document.getElementById('additionalDocumentsPreview');
        previewContainer.innerHTML = '';
        uploadedFiles.additionalDocuments.forEach(file => {
            createFilePreview(file, previewContainer, 'additional');
        });
        
        // Update status
        const statusText = uploadedFiles.additionalDocuments.length > 0 
            ? `${uploadedFiles.additionalDocuments.length} file(s) uploaded` 
            : 'No files';
        updateUploadStatus(document.getElementById('additionalDocumentsStatus'), 
                         uploadedFiles.additionalDocuments.length > 0 ? 'uploaded' : 'none', 
                         statusText);
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
    if (!uploadedFiles.governmentId) {
        showFieldError(document.getElementById('governmentIdArea'), 'Government ID is required');
        isValid = false;
    }
    
    // Validate proof of income only if user is employed
    if (currentApplication?.employmentInfo?.isEmployed && !uploadedFiles.proofOfIncome) {
        showFieldError(document.getElementById('proofOfIncomeArea'), 'Proof of income is required');
        isValid = false;
    }
    
    // Validate terms agreements
    const requiredCheckboxes = [
        'agreeDocumentTerms',
        'agreePrivacy', 
        'agreeVerification'
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
        console.log('✅ Form validation passed');
    } else {
        proceedBtn.disabled = true;
        console.log('❌ Form validation failed');
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
    console.log('📝 Document upload form submission started...');
    
    if (validateForm()) {
        processDocumentUpload();
    }
}

function processDocumentUpload() {
    console.log('🔄 Processing document upload...');
    
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
        
        if (progress <= 30) {
            progressText.textContent = 'Validating documents...';
            updateUploadItem('governmentId', 'processing');
        } 
        else if (progress <= 60) {
            progressText.textContent = 'Uploading files...';
            updateUploadItem('governmentId', 'completed');
            
            if (currentApplication?.employmentInfo?.isEmployed) {
                updateUploadItem('proofOfIncome', 'processing');
            }
        } 
        else if (progress <= 90) {
            progressText.textContent = 'Processing additional documents...';
            if (currentApplication?.employmentInfo?.isEmployed) {
                updateUploadItem('proofOfIncome', 'completed');
            }
            updateUploadItem('additionalDocs', 'processing');
        } 
        else {
            progressText.textContent = 'Finalizing upload...';
            updateUploadItem('additionalDocs', 'completed');
        }
        
        if (progress >= 100) {
            clearInterval(uploadInterval);
            completeDocumentUpload();
        }
    }, 200);
}

function updateUploadItem(itemId, status) {
    const item = document.getElementById('upload' + capitalizeFirst(itemId));
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
    console.log('✅ Document upload completed');
    
    // Save document data
    saveDocumentData();
    
    // Show success message
    setTimeout(() => {
        const progressModal = document.getElementById('uploadProgressModal');
        progressModal.classList.remove('active');
        
        showNotification('Documents uploaded successfully! Redirecting to payment...', 'success');
        
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
            governmentId: uploadedFiles.governmentId ? {
                name: uploadedFiles.governmentId.name,
                size: uploadedFiles.governmentId.size,
                type: uploadedFiles.governmentId.type
            } : null,
            proofOfIncome: uploadedFiles.proofOfIncome ? {
                name: uploadedFiles.proofOfIncome.name,
                size: uploadedFiles.proofOfIncome.size,
                type: uploadedFiles.proofOfIncome.type
            } : null,
            additionalDocuments: uploadedFiles.additionalDocuments.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            uploadDate: new Date().toISOString()
        },
        termsAgreed: {
            documentTerms: document.getElementById('agreeDocumentTerms').checked,
            privacy: document.getElementById('agreePrivacy').checked,
            verification: document.getElementById('agreeVerification').checked
        }
    };
    
    // Update application data in sessionStorage
    currentApplication.step2 = documentData;
    currentApplication.currentStep = 'document_upload_completed';
    sessionStorage.setItem('current_rental_application', JSON.stringify(currentApplication));
    
    // Save to localStorage for persistence
    let applications = JSON.parse(localStorage.getItem('domihive_rental_applications')) || [];
    const appIndex = applications.findIndex(app => app.applicationId === currentApplication.applicationId);
    
    if (appIndex !== -1) {
        applications[appIndex] = currentApplication;
    } else {
        applications.push(currentApplication);
    }
    
    localStorage.setItem('domihive_rental_applications', JSON.stringify(applications));
    
    console.log('💾 Document data saved:', documentData);
}

function redirectToApplication() {
    console.log('↩️ Redirecting to application page...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('application-process');
    } else {
        // Fallback to direct navigation
        window.location.href = '/Pages/application-process.html';
    }
}

function redirectToPayment() {
    console.log('💳 Redirecting to payment page...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('application-payment');
    } else {
        // Fallback to direct navigation
        window.location.href = '/Pages/application-payment.html';
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

console.log('🎉 Document Upload JavaScript Loaded Successfully!');