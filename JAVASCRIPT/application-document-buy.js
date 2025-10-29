// application-document-buy.js - Complete Property Purchase Document Upload Logic
document.addEventListener('DOMContentLoaded', function() {
    console.log('📁 Initializing Purchase Document Upload (Step 2)...');
    
    // Initialize the document upload
    initializePurchaseDocumentUpload();
});

// Global variables
let currentApplication = null;
let uploadedFiles = {
    governmentId: null,
    passportPhoto: null,
    proofOfFunds: [],
    taxClearance: null,
    proofOfIncome: null,
    utilityBill: null,
    referenceLetters: [],
    additionalLegalDocs: []
};

function initializePurchaseDocumentUpload() {
    console.log('📁 Initializing Purchase Document Upload Process...');
    
    // Load application data from Step 1
    loadApplicationData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize file upload handlers
    initializeFileUploads();
    
    // Update purchase-specific UI
    updatePurchaseUI();
    
    console.log('✅ Purchase document upload initialized');
}

function loadApplicationData() {
    try {
        // Get application data from sessionStorage (set in Step 1)
        const applicationData = sessionStorage.getItem('current_purchase_application');
        
        if (applicationData) {
            currentApplication = JSON.parse(applicationData);
            console.log('📄 Purchase application data loaded:', currentApplication);
            
            // Update UI with application data
            updateApplicationDisplay();
            
            // Update hidden fields
            document.getElementById('applicationId').value = currentApplication.applicationId;
            document.getElementById('propertyId').value = currentApplication.propertyId;
            document.getElementById('userId').value = currentApplication.userId;
            
        } else {
            console.error('❌ No purchase application data found');
            showNotification('Error: Purchase application data not found. Please start from Step 1.', 'error');
            
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
    
    // Update purchase type
    const purchaseTypeElement = document.getElementById('purchaseType');
    if (purchaseTypeElement) {
        const financingMethod = currentApplication.purchaseInfo.financingMethod;
        const typeMap = {
            'cash': 'Cash Purchase',
            'mortgage': 'Mortgage Purchase',
            'installment': 'Installment Plan'
        };
        purchaseTypeElement.textContent = typeMap[financingMethod] || 'Property Purchase';
    }
    
    // Update context type
    const contextElement = document.getElementById('applicationContextType');
    if (contextElement) {
        contextElement.textContent = 'Property Purchase Application';
    }
}

function updatePurchaseUI() {
    // Update any purchase-specific UI elements
    console.log('💰 Purchase-specific UI updated');
}

function initializeEventListeners() {
    // Form submission
    document.getElementById('purchaseDocumentUploadForm').addEventListener('submit', handleFormSubmission);
    
    // Back buttons
    document.getElementById('backToApplication').addEventListener('click', redirectToApplication);
    document.getElementById('backToApplicationBtn').addEventListener('click', redirectToApplication);
    
    // Terms checkboxes validation
    document.getElementById('agreeDocumentTerms').addEventListener('change', validateForm);
    document.getElementById('agreePrivacy').addEventListener('change', validateForm);
    document.getElementById('agreeLegalVerification').addEventListener('change', validateForm);
    document.getElementById('agreeFIRSVerification').addEventListener('change', validateForm);
}

function initializeFileUploads() {
    // Government ID upload
    const governmentIdInput = document.getElementById('governmentId');
    const governmentIdArea = document.getElementById('governmentIdArea');
    governmentIdInput.addEventListener('change', (e) => handleFileUpload(e, 'governmentId'));
    setupDragAndDrop(governmentIdArea, governmentIdInput, 'governmentId');
    
    // Passport Photo upload
    const passportPhotoInput = document.getElementById('passportPhoto');
    const passportPhotoArea = document.getElementById('passportPhotoArea');
    passportPhotoInput.addEventListener('change', (e) => handleFileUpload(e, 'passportPhoto'));
    setupDragAndDrop(passportPhotoArea, passportPhotoInput, 'passportPhoto');
    
    // Proof of Funds upload (multiple files)
    const proofOfFundsInput = document.getElementById('proofOfFunds');
    const proofOfFundsArea = document.getElementById('proofOfFundsArea');
    proofOfFundsInput.addEventListener('change', (e) => handleMultipleFileUpload(e, 'proofOfFunds'));
    setupDragAndDrop(proofOfFundsArea, proofOfFundsInput, 'proofOfFundsMultiple');
    
    // Tax Clearance upload
    const taxClearanceInput = document.getElementById('taxClearance');
    const taxClearanceArea = document.getElementById('taxClearanceArea');
    taxClearanceInput.addEventListener('change', (e) => handleFileUpload(e, 'taxClearance'));
    setupDragAndDrop(taxClearanceArea, taxClearanceInput, 'taxClearance');
    
    // Proof of Income upload
    const proofOfIncomeInput = document.getElementById('proofOfIncome');
    const proofOfIncomeArea = document.getElementById('proofOfIncomeArea');
    proofOfIncomeInput.addEventListener('change', (e) => handleFileUpload(e, 'proofOfIncome'));
    setupDragAndDrop(proofOfIncomeArea, proofOfIncomeInput, 'proofOfIncome');
    
    // Utility Bill upload
    const utilityBillInput = document.getElementById('utilityBill');
    const utilityBillArea = document.getElementById('utilityBillArea');
    utilityBillInput.addEventListener('change', (e) => handleFileUpload(e, 'utilityBill'));
    setupDragAndDrop(utilityBillArea, utilityBillInput, 'utilityBill');
    
    // Reference Letters upload (multiple, optional)
    const referenceLettersInput = document.getElementById('referenceLetters');
    const referenceLettersArea = document.getElementById('referenceLettersArea');
    referenceLettersInput.addEventListener('change', (e) => handleMultipleFileUpload(e, 'referenceLetters'));
    setupDragAndDrop(referenceLettersArea, referenceLettersInput, 'referenceLettersMultiple');
    
    // Additional Legal Documents upload (multiple, optional)
    const additionalLegalDocsInput = document.getElementById('additionalLegalDocs');
    const additionalLegalDocsArea = document.getElementById('additionalLegalDocsArea');
    additionalLegalDocsInput.addEventListener('change', (e) => handleMultipleFileUpload(e, 'additionalLegalDocs'));
    setupDragAndDrop(additionalLegalDocsArea, additionalLegalDocsInput, 'additionalLegalDocsMultiple');
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
                    case 'governmentId':
                        handleFileUpload(event, 'governmentId');
                        break;
                    case 'passportPhoto':
                        handleFileUpload(event, 'passportPhoto');
                        break;
                    case 'taxClearance':
                        handleFileUpload(event, 'taxClearance');
                        break;
                    case 'proofOfIncome':
                        handleFileUpload(event, 'proofOfIncome');
                        break;
                    case 'utilityBill':
                        handleFileUpload(event, 'utilityBill');
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
    const validation = validatePurchaseFile(file, fileType);
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
    
    showNotification(`${formatFileTypeName(fileType)} uploaded successfully`, 'success');
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
        const validation = validatePurchaseFile(file, fileType);
        if (!validation.isValid) {
            showNotification(`Skipped invalid file: ${file.name} - ${validation.message}`, 'error');
            return;
        }
        
        // Check total size for multiple files
        totalSize += file.size;
        const maxTotalSize = fileType === 'proofOfFunds' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
        
        if (totalSize > maxTotalSize) {
            showNotification(`Total file size exceeds ${maxTotalSize / (1024 * 1024)}MB limit for ${formatFileTypeName(fileType)}`, 'error');
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
        showNotification(`${validFilesCount} ${formatFileTypeName(fileType)} file(s) uploaded`, 'success');
    } else {
        updateUploadStatus(statusElement, 'none', 'No files');
    }
    
    // Validate form
    validateForm();
}

function validatePurchaseFile(file, fileType) {
    const maxSizes = {
        governmentId: 5 * 1024 * 1024,
        passportPhoto: 2 * 1024 * 1024,
        proofOfFunds: 10 * 1024 * 1024,
        taxClearance: 5 * 1024 * 1024,
        proofOfIncome: 5 * 1024 * 1024,
        utilityBill: 5 * 1024 * 1024,
        referenceLetters: 5 * 1024 * 1024,
        additionalLegalDocs: 5 * 1024 * 1024
    };
    
    const allowedTypes = {
        governmentId: ['.pdf', '.jpg', '.jpeg', '.png'],
        passportPhoto: ['.jpg', '.jpeg', '.png'],
        proofOfFunds: ['.pdf', '.jpg', '.jpeg', '.png'],
        taxClearance: ['.pdf', '.jpg', '.jpeg', '.png'],
        proofOfIncome: ['.pdf', '.jpg', '.jpeg', '.png'],
        utilityBill: ['.pdf', '.jpg', '.jpeg', '.png'],
        referenceLetters: ['.pdf', '.doc', '.docx'],
        additionalLegalDocs: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
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
    
    // Special validation for passport photo
    if (fileType === 'passportPhoto') {
        if (!file.type.startsWith('image/')) {
            return { isValid: false, message: 'Passport photo must be an image file' };
        }
    }
    
    return { isValid: true, message: 'File is valid' };
}

function formatFileTypeName(fileType) {
    const nameMap = {
        governmentId: 'Government ID',
        passportPhoto: 'Passport Photo',
        proofOfFunds: 'Proof of Funds',
        taxClearance: 'Tax Clearance',
        proofOfIncome: 'Proof of Income',
        utilityBill: 'Utility Bill',
        referenceLetters: 'Reference Letter',
        additionalLegalDocs: 'Legal Document'
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
        'governmentId',
        'passportPhoto',
        'proofOfFunds',
        'taxClearance',
        'proofOfIncome',
        'utilityBill'
    ];
    
    requiredFiles.forEach(fileType => {
        if (Array.isArray(uploadedFiles[fileType])) {
            if (uploadedFiles[fileType].length === 0) {
                showFieldError(document.getElementById(fileType + 'Area'), `${formatFileTypeName(fileType)} is required`);
                isValid = false;
            }
        } else {
            if (!uploadedFiles[fileType]) {
                showFieldError(document.getElementById(fileType + 'Area'), `${formatFileTypeName(fileType)} is required`);
                isValid = false;
            }
        }
    });
    
    // Validate terms agreements
    const requiredCheckboxes = [
        'agreeDocumentTerms',
        'agreePrivacy', 
        'agreeLegalVerification',
        'agreeFIRSVerification'
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
        console.log('✅ Purchase document form validation passed');
    } else {
        proceedBtn.disabled = true;
        console.log('❌ Purchase document form validation failed');
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
    console.log('📝 Purchase document upload form submission started...');
    
    if (validateForm()) {
        processDocumentUpload();
    }
}

function processDocumentUpload() {
    console.log('🔄 Processing purchase document upload...');
    
    // Show upload progress modal
    const progressModal = document.getElementById('uploadProgressModal');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressModal.classList.add('active');
    
    // Simulate upload process
    let progress = 0;
    const uploadInterval = setInterval(() => {
        progress += 8;
        progressFill.style.width = progress + '%';
        
        if (progress <= 16) {
            progressText.textContent = 'Validating identification documents...';
            updateUploadItem('governmentId', 'processing');
            updateUploadItem('passportPhoto', 'processing');
        } 
        else if (progress <= 32) {
            progressText.textContent = 'Processing financial documents...';
            updateUploadItem('governmentId', 'completed');
            updateUploadItem('passportPhoto', 'completed');
            updateUploadItem('proofOfFunds', 'processing');
            updateUploadItem('proofOfIncome', 'processing');
        } 
        else if (progress <= 48) {
            progressText.textContent = 'Verifying tax clearance...';
            updateUploadItem('proofOfFunds', 'completed');
            updateUploadItem('proofOfIncome', 'completed');
            updateUploadItem('taxClearance', 'processing');
        }
        else if (progress <= 64) {
            progressText.textContent = 'Checking utility bill...';
            updateUploadItem('taxClearance', 'completed');
            updateUploadItem('utilityBill', 'processing');
        }
        else if (progress <= 80) {
            progressText.textContent = 'Processing additional documents...';
            updateUploadItem('utilityBill', 'completed');
            updateUploadItem('referenceLetters', 'processing');
            updateUploadItem('additionalLegalDocs', 'processing');
        }
        else {
            progressText.textContent = 'Finalizing document verification...';
            updateUploadItem('referenceLetters', 'completed');
            updateUploadItem('additionalLegalDocs', 'completed');
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
    console.log('✅ Purchase document upload completed');
    
    // Save document data
    saveDocumentData();
    
    // Show success message
    setTimeout(() => {
        const progressModal = document.getElementById('uploadProgressModal');
        progressModal.classList.remove('active');
        
        showNotification('Purchase documents uploaded successfully! Redirecting to payment & legal review...', 'success');
        
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
            passportPhoto: uploadedFiles.passportPhoto ? {
                name: uploadedFiles.passportPhoto.name,
                size: uploadedFiles.passportPhoto.size,
                type: uploadedFiles.passportPhoto.type
            } : null,
            proofOfFunds: uploadedFiles.proofOfFunds.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            taxClearance: uploadedFiles.taxClearance ? {
                name: uploadedFiles.taxClearance.name,
                size: uploadedFiles.taxClearance.size,
                type: uploadedFiles.taxClearance.type
            } : null,
            proofOfIncome: uploadedFiles.proofOfIncome ? {
                name: uploadedFiles.proofOfIncome.name,
                size: uploadedFiles.proofOfIncome.size,
                type: uploadedFiles.proofOfIncome.type
            } : null,
            utilityBill: uploadedFiles.utilityBill ? {
                name: uploadedFiles.utilityBill.name,
                size: uploadedFiles.utilityBill.size,
                type: uploadedFiles.utilityBill.type
            } : null,
            referenceLetters: uploadedFiles.referenceLetters.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            additionalLegalDocs: uploadedFiles.additionalLegalDocs.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            uploadDate: new Date().toISOString()
        },
        termsAgreed: {
            documentTerms: document.getElementById('agreeDocumentTerms').checked,
            privacy: document.getElementById('agreePrivacy').checked,
            legalVerification: document.getElementById('agreeLegalVerification').checked,
            firsVerification: document.getElementById('agreeFIRSVerification').checked
        }
    };
    
    // Update application data in sessionStorage
    currentApplication.step2 = documentData;
    currentApplication.currentStep = 'document_upload_completed';
    sessionStorage.setItem('current_purchase_application', JSON.stringify(currentApplication));
    
    // Save to localStorage for persistence
    let applications = JSON.parse(localStorage.getItem('domihive_purchase_applications')) || [];
    const appIndex = applications.findIndex(app => app.applicationId === currentApplication.applicationId);
    
    if (appIndex !== -1) {
        applications[appIndex] = currentApplication;
    } else {
        applications.push(currentApplication);
    }
    
    localStorage.setItem('domihive_purchase_applications', JSON.stringify(applications));
    
    console.log('💾 Purchase document data saved:', documentData);
}

function redirectToApplication() {
    console.log('↩️ Redirecting to purchase application page...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('application-process-buy');
    } else {
        // Fallback to direct navigation
        window.location.href = '/Pages/application-process-buy.html';
    }
}

function redirectToPayment() {
    console.log('💳 Redirecting to purchase payment page...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('application-payment-buy');
    } else {
        // Fallback to direct navigation
        window.location.href = '/Pages/application-payment-buy.html';
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

console.log('🎉 Purchase Document Upload JavaScript Loaded Successfully!');