// application-document-commercial.js - Complete Commercial Property Document Upload Logic
document.addEventListener('DOMContentLoaded', function() {
    console.log('📁 Initializing Commercial Document Upload (Step 2)...');
    
    // Initialize the document upload
    initializeCommercialDocumentUpload();
});

// Global variables
let currentApplication = null;
let uploadedFiles = {
    certificateOfIncorporation: null,
    articlesOfAssociation: null,
    bankStatements: [],
    taxClearance: null,
    financialStatements: [],
    directorIds: [],
    proofOfAddress: null,
    businessPlan: null,
    tradeReferences: [],
    licensesPermits: []
};

function initializeCommercialDocumentUpload() {
    console.log('📁 Initializing Commercial Document Upload Process...');
    
    // Load application data from Step 1
    loadApplicationData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize file upload handlers
    initializeFileUploads();
    
    // Update commercial-specific UI
    updateCommercialUI();
    
    console.log('✅ Commercial document upload initialized');
}

function loadApplicationData() {
    try {
        // Get application data from sessionStorage (set in Step 1)
        const applicationData = sessionStorage.getItem('current_commercial_application');
        
        if (applicationData) {
            currentApplication = JSON.parse(applicationData);
            console.log('📄 Commercial application data loaded:', currentApplication);
            
            // Update UI with application data
            updateApplicationDisplay();
            
            // Update hidden fields
            document.getElementById('applicationId').value = currentApplication.applicationId;
            document.getElementById('propertyId').value = currentApplication.propertyId;
            document.getElementById('userId').value = currentApplication.userId;
            
        } else {
            console.error('❌ No commercial application data found');
            showNotification('Error: Commercial application data not found. Please start from Step 1.', 'error');
            
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
    
    // Update business details
    document.getElementById('businessName').textContent = currentApplication.businessInfo.businessName;
    document.getElementById('applicationId').textContent = currentApplication.applicationId;
    document.getElementById('contactPerson').textContent = `${currentApplication.contactInfo.fullName} (${currentApplication.contactInfo.position})`;
    
    // Update context type
    const contextElement = document.getElementById('applicationContextType');
    if (contextElement) {
        contextElement.textContent = 'Commercial Property Application';
    }
}

function updateCommercialUI() {
    // Update any commercial-specific UI elements
    console.log('💼 Commercial-specific UI updated');
}

function initializeEventListeners() {
    // Form submission
    document.getElementById('commercialDocumentUploadForm').addEventListener('submit', handleFormSubmission);
    
    // Back buttons
    document.getElementById('backToApplication').addEventListener('click', redirectToApplication);
    document.getElementById('backToApplicationBtn').addEventListener('click', redirectToApplication);
    
    // Terms checkboxes validation
    document.getElementById('agreeDocumentTerms').addEventListener('change', validateForm);
    document.getElementById('agreePrivacy').addEventListener('change', validateForm);
    document.getElementById('agreeBusinessVerification').addEventListener('change', validateForm);
    document.getElementById('agreeCACVerification').addEventListener('change', validateForm);
    document.getElementById('agreeFIRSVerification').addEventListener('change', validateForm);
}

function initializeFileUploads() {
    // Certificate of Incorporation upload
    const incorporationInput = document.getElementById('certificateOfIncorporation');
    const incorporationArea = document.getElementById('certificateOfIncorporationArea');
    incorporationInput.addEventListener('change', (e) => handleFileUpload(e, 'certificateOfIncorporation'));
    setupDragAndDrop(incorporationArea, incorporationInput, 'certificateOfIncorporation');
    
    // Articles of Association upload
    const articlesInput = document.getElementById('articlesOfAssociation');
    const articlesArea = document.getElementById('articlesOfAssociationArea');
    articlesInput.addEventListener('change', (e) => handleFileUpload(e, 'articlesOfAssociation'));
    setupDragAndDrop(articlesArea, articlesInput, 'articlesOfAssociation');
    
    // Bank Statements upload (multiple files)
    const bankStatementsInput = document.getElementById('bankStatements');
    const bankStatementsArea = document.getElementById('bankStatementsArea');
    bankStatementsInput.addEventListener('change', (e) => handleMultipleFileUpload(e, 'bankStatements'));
    setupDragAndDrop(bankStatementsArea, bankStatementsInput, 'bankStatementsMultiple');
    
    // Tax Clearance upload
    const taxClearanceInput = document.getElementById('taxClearance');
    const taxClearanceArea = document.getElementById('taxClearanceArea');
    taxClearanceInput.addEventListener('change', (e) => handleFileUpload(e, 'taxClearance'));
    setupDragAndDrop(taxClearanceArea, taxClearanceInput, 'taxClearance');
    
    // Financial Statements upload (multiple files)
    const financialStatementsInput = document.getElementById('financialStatements');
    const financialStatementsArea = document.getElementById('financialStatementsArea');
    financialStatementsInput.addEventListener('change', (e) => handleMultipleFileUpload(e, 'financialStatements'));
    setupDragAndDrop(financialStatementsArea, financialStatementsInput, 'financialStatementsMultiple');
    
    // Director IDs upload (multiple files)
    const directorIdsInput = document.getElementById('directorIds');
    const directorIdsArea = document.getElementById('directorIdsArea');
    directorIdsInput.addEventListener('change', (e) => handleMultipleFileUpload(e, 'directorIds'));
    setupDragAndDrop(directorIdsArea, directorIdsInput, 'directorIdsMultiple');
    
    // Proof of Address upload
    const proofOfAddressInput = document.getElementById('proofOfAddress');
    const proofOfAddressArea = document.getElementById('proofOfAddressArea');
    proofOfAddressInput.addEventListener('change', (e) => handleFileUpload(e, 'proofOfAddress'));
    setupDragAndDrop(proofOfAddressArea, proofOfAddressInput, 'proofOfAddress');
    
    // Business Plan upload (optional)
    const businessPlanInput = document.getElementById('businessPlan');
    const businessPlanArea = document.getElementById('businessPlanArea');
    businessPlanInput.addEventListener('change', (e) => handleFileUpload(e, 'businessPlan'));
    setupDragAndDrop(businessPlanArea, businessPlanInput, 'businessPlan');
    
    // Trade References upload (multiple, optional)
    const tradeReferencesInput = document.getElementById('tradeReferences');
    const tradeReferencesArea = document.getElementById('tradeReferencesArea');
    tradeReferencesInput.addEventListener('change', (e) => handleMultipleFileUpload(e, 'tradeReferences'));
    setupDragAndDrop(tradeReferencesArea, tradeReferencesInput, 'tradeReferencesMultiple');
    
    // Licenses & Permits upload (multiple, optional)
    const licensesPermitsInput = document.getElementById('licensesPermits');
    const licensesPermitsArea = document.getElementById('licensesPermitsArea');
    licensesPermitsInput.addEventListener('change', (e) => handleMultipleFileUpload(e, 'licensesPermits'));
    setupDragAndDrop(licensesPermitsArea, licensesPermitsInput, 'licensesPermitsMultiple');
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
                    case 'certificateOfIncorporation':
                        handleFileUpload(event, 'certificateOfIncorporation');
                        break;
                    case 'articlesOfAssociation':
                        handleFileUpload(event, 'articlesOfAssociation');
                        break;
                    case 'taxClearance':
                        handleFileUpload(event, 'taxClearance');
                        break;
                    case 'proofOfAddress':
                        handleFileUpload(event, 'proofOfAddress');
                        break;
                    case 'businessPlan':
                        handleFileUpload(event, 'businessPlan');
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
    const validation = validateCommercialFile(file, fileType);
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
    
    showNotification(`${formatCommercialFileTypeName(fileType)} uploaded successfully`, 'success');
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
        const validation = validateCommercialFile(file, fileType);
        if (!validation.isValid) {
            showNotification(`Skipped invalid file: ${file.name} - ${validation.message}`, 'error');
            return;
        }
        
        // Check total size for multiple files
        totalSize += file.size;
        const maxTotalSize = fileType === 'bankStatements' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
        
        if (totalSize > maxTotalSize) {
            showNotification(`Total file size exceeds ${maxTotalSize / (1024 * 1024)}MB limit for ${formatCommercialFileTypeName(fileType)}`, 'error');
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
        showNotification(`${validFilesCount} ${formatCommercialFileTypeName(fileType)} file(s) uploaded`, 'success');
    } else {
        updateUploadStatus(statusElement, 'none', 'No files');
    }
    
    // Validate form
    validateForm();
}

function validateCommercialFile(file, fileType) {
    const maxSizes = {
        certificateOfIncorporation: 5 * 1024 * 1024,
        articlesOfAssociation: 5 * 1024 * 1024,
        bankStatements: 10 * 1024 * 1024,
        taxClearance: 5 * 1024 * 1024,
        financialStatements: 5 * 1024 * 1024,
        directorIds: 5 * 1024 * 1024,
        proofOfAddress: 5 * 1024 * 1024,
        businessPlan: 5 * 1024 * 1024,
        tradeReferences: 5 * 1024 * 1024,
        licensesPermits: 5 * 1024 * 1024
    };
    
    const allowedTypes = {
        certificateOfIncorporation: ['.pdf', '.jpg', '.jpeg', '.png'],
        articlesOfAssociation: ['.pdf'],
        bankStatements: ['.pdf', '.jpg', '.jpeg', '.png'],
        taxClearance: ['.pdf', '.jpg', '.jpeg', '.png'],
        financialStatements: ['.pdf'],
        directorIds: ['.pdf', '.jpg', '.jpeg', '.png'],
        proofOfAddress: ['.pdf', '.jpg', '.jpeg', '.png'],
        businessPlan: ['.pdf', '.doc', '.docx'],
        tradeReferences: ['.pdf', '.jpg', '.jpeg', '.png'],
        licensesPermits: ['.pdf', '.jpg', '.jpeg', '.png']
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
    
    // Special validation for Articles of Association (must be PDF)
    if (fileType === 'articlesOfAssociation' && !file.type.includes('pdf')) {
        return { isValid: false, message: 'Articles of Association must be in PDF format' };
    }
    
    // Special validation for Financial Statements (must be PDF)
    if (fileType === 'financialStatements' && !file.type.includes('pdf')) {
        return { isValid: false, message: 'Financial Statements must be in PDF format' };
    }
    
    return { isValid: true, message: 'File is valid' };
}

function formatCommercialFileTypeName(fileType) {
    const nameMap = {
        certificateOfIncorporation: 'Certificate of Incorporation',
        articlesOfAssociation: 'Articles of Association',
        bankStatements: 'Bank Statement',
        taxClearance: 'Tax Clearance',
        financialStatements: 'Financial Statement',
        directorIds: 'Director ID',
        proofOfAddress: 'Proof of Address',
        businessPlan: 'Business Plan',
        tradeReferences: 'Trade Reference',
        licensesPermits: 'License/Permit'
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
        'certificateOfIncorporation',
        'articlesOfAssociation',
        'bankStatements',
        'taxClearance',
        'financialStatements',
        'directorIds',
        'proofOfAddress'
    ];
    
    requiredFiles.forEach(fileType => {
        if (Array.isArray(uploadedFiles[fileType])) {
            if (uploadedFiles[fileType].length === 0) {
                showFieldError(document.getElementById(fileType + 'Area'), `${formatCommercialFileTypeName(fileType)} is required`);
                isValid = false;
            }
        } else {
            if (!uploadedFiles[fileType]) {
                showFieldError(document.getElementById(fileType + 'Area'), `${formatCommercialFileTypeName(fileType)} is required`);
                isValid = false;
            }
        }
    });
    
    // Validate terms agreements
    const requiredCheckboxes = [
        'agreeDocumentTerms',
        'agreePrivacy', 
        'agreeBusinessVerification',
        'agreeCACVerification',
        'agreeFIRSVerification'
    ];
    
    requiredCheckboxes.forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        if (!checkbox.checked) {
            showFieldError(checkbox, 'This commercial agreement is required');
            isValid = false;
        }
    });
    
    // Update proceed button state
    const proceedBtn = document.getElementById('proceedToPaymentBtn');
    if (isValid) {
        proceedBtn.disabled = false;
        console.log('✅ Commercial document form validation passed');
    } else {
        proceedBtn.disabled = true;
        console.log('❌ Commercial document form validation failed');
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
    console.log('📝 Commercial document upload form submission started...');
    
    if (validateForm()) {
        processDocumentUpload();
    }
}

function processDocumentUpload() {
    console.log('🔄 Processing commercial document upload...');
    
    // Show upload progress modal
    const progressModal = document.getElementById('uploadProgressModal');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressModal.classList.add('active');
    
    // Simulate upload process
    let progress = 0;
    const uploadInterval = setInterval(() => {
        progress += 6;
        progressFill.style.width = progress + '%';
        
        if (progress <= 12) {
            progressText.textContent = 'Validating business registration documents...';
            updateUploadItem('certificateOfIncorporation', 'processing');
            updateUploadItem('articlesOfAssociation', 'processing');
        } 
        else if (progress <= 24) {
            progressText.textContent = 'Processing financial documents...';
            updateUploadItem('certificateOfIncorporation', 'completed');
            updateUploadItem('articlesOfAssociation', 'completed');
            updateUploadItem('bankStatements', 'processing');
            updateUploadItem('financialStatements', 'processing');
        } 
        else if (progress <= 36) {
            progressText.textContent = 'Verifying tax clearance...';
            updateUploadItem('bankStatements', 'completed');
            updateUploadItem('financialStatements', 'completed');
            updateUploadItem('taxClearance', 'processing');
        }
        else if (progress <= 48) {
            progressText.textContent = 'Checking director identification...';
            updateUploadItem('taxClearance', 'completed');
            updateUploadItem('directorIds', 'processing');
        }
        else if (progress <= 60) {
            progressText.textContent = 'Validating business address...';
            updateUploadItem('directorIds', 'completed');
            updateUploadItem('proofOfAddress', 'processing');
        }
        else if (progress <= 72) {
            progressText.textContent = 'Processing additional documents...';
            updateUploadItem('proofOfAddress', 'completed');
            updateUploadItem('businessPlan', 'processing');
            updateUploadItem('tradeReferences', 'processing');
            updateUploadItem('licensesPermits', 'processing');
        }
        else {
            progressText.textContent = 'Finalizing commercial verification...';
            updateUploadItem('businessPlan', 'completed');
            updateUploadItem('tradeReferences', 'completed');
            updateUploadItem('licensesPermits', 'completed');
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
    console.log('✅ Commercial document upload completed');
    
    // Save document data
    saveDocumentData();
    
    // Show success message
    setTimeout(() => {
        const progressModal = document.getElementById('uploadProgressModal');
        progressModal.classList.remove('active');
        
        showNotification('Commercial documents uploaded successfully! Redirecting to payment...', 'success');
        
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
            certificateOfIncorporation: uploadedFiles.certificateOfIncorporation ? {
                name: uploadedFiles.certificateOfIncorporation.name,
                size: uploadedFiles.certificateOfIncorporation.size,
                type: uploadedFiles.certificateOfIncorporation.type
            } : null,
            articlesOfAssociation: uploadedFiles.articlesOfAssociation ? {
                name: uploadedFiles.articlesOfAssociation.name,
                size: uploadedFiles.articlesOfAssociation.size,
                type: uploadedFiles.articlesOfAssociation.type
            } : null,
            bankStatements: uploadedFiles.bankStatements.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            taxClearance: uploadedFiles.taxClearance ? {
                name: uploadedFiles.taxClearance.name,
                size: uploadedFiles.taxClearance.size,
                type: uploadedFiles.taxClearance.type
            } : null,
            financialStatements: uploadedFiles.financialStatements.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            directorIds: uploadedFiles.directorIds.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            proofOfAddress: uploadedFiles.proofOfAddress ? {
                name: uploadedFiles.proofOfAddress.name,
                size: uploadedFiles.proofOfAddress.size,
                type: uploadedFiles.proofOfAddress.type
            } : null,
            businessPlan: uploadedFiles.businessPlan ? {
                name: uploadedFiles.businessPlan.name,
                size: uploadedFiles.businessPlan.size,
                type: uploadedFiles.businessPlan.type
            } : null,
            tradeReferences: uploadedFiles.tradeReferences.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            licensesPermits: uploadedFiles.licensesPermits.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            uploadDate: new Date().toISOString()
        },
        termsAgreed: {
            documentTerms: document.getElementById('agreeDocumentTerms').checked,
            privacy: document.getElementById('agreePrivacy').checked,
            businessVerification: document.getElementById('agreeBusinessVerification').checked,
            cacVerification: document.getElementById('agreeCACVerification').checked,
            firsVerification: document.getElementById('agreeFIRSVerification').checked
        }
    };
    
    // Update application data in sessionStorage
    currentApplication.step2 = documentData;
    currentApplication.currentStep = 'document_upload_completed';
    sessionStorage.setItem('current_commercial_application', JSON.stringify(currentApplication));
    
    // Save to localStorage for persistence
    let applications = JSON.parse(localStorage.getItem('domihive_commercial_applications')) || [];
    const appIndex = applications.findIndex(app => app.applicationId === currentApplication.applicationId);
    
    if (appIndex !== -1) {
        applications[appIndex] = currentApplication;
    } else {
        applications.push(currentApplication);
    }
    
    localStorage.setItem('domihive_commercial_applications', JSON.stringify(applications));
    
    console.log('💾 Commercial document data saved:', documentData);
}

function redirectToApplication() {
    console.log('↩️ Redirecting to commercial application page...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('application-process-commercial');
    } else {
        // Fallback to direct navigation
        window.location.href = '/Pages/application-process-commercial.html';
    }
}

function redirectToPayment() {
    console.log('💳 Redirecting to commercial payment page...');
    
    // Use SPA navigation if available
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('application-payment-commercial');
    } else {
        // Fallback to direct navigation
        window.location.href = '/Pages/application-payment-commercial.html';
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

console.log('🎉 Commercial Document Upload JavaScript Loaded Successfully!');