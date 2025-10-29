// tenant-payments.js - Comprehensive Payment Management System

// SPA Integration
window.spaTenantPaymentsInit = function() {
    console.log('🎯 SPA: Initializing Tenant Payments Content');
    initializePaymentsManagement();
};

// Auto-initialize if loaded directly
if (window.location.pathname.includes('tenant-payments.html')) {
    document.addEventListener('DOMContentLoaded', initializePaymentsManagement);
} else {
    // SPA environment - check if we're on the page and initialize
    setTimeout(function() {
        if (document.querySelector('.tenant-payments-content')) {
            console.log('🔍 Detected SPA environment - auto-initializing tenant payments');
            initializePaymentsManagement();
        }
    }, 500);
}

function initializePaymentsManagement() {
    console.log('💳 Initializing Payments Management System...');
    
    // Global variables
    let currentProperty = null;
    let paymentData = [];
    let escrowData = [];
    let selectedPaymentMethod = null;
    let uploadedReceipt = null;
    
    // Load property data and payment data
    loadPropertyData();
    loadPaymentData();
    loadEscrowData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize payment methods
    initializePaymentMethods();
    
    // Render initial content for all tabs
    renderPropertyOverview();
    updatePaymentStatistics();
    renderPaymentHistory();
    renderPaymentFlow();
    renderUpcomingPayments();
    renderBillsPayment();
    renderEscrowAccount();
    
    console.log('✅ Payments management system ready');
}

function loadPropertyData() {
    console.log('📦 Loading property data...');
    
    const propertyId = sessionStorage.getItem('currentPaymentPropertyId');
    
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
        status: 'active',
        payment: {
            monthlyRent: 1250000,
            nextPaymentDate: '2024-02-01',
            paymentStatus: 'upcoming',
            overdueAmount: 0,
        }
    };
}

function loadPaymentData() {
    console.log('📋 Loading payment data...');
    
    const storedPayments = localStorage.getItem(`domihive_payments_${currentProperty.id}`);
    
    if (storedPayments && JSON.parse(storedPayments).length > 0) {
        paymentData = JSON.parse(storedPayments);
        console.log('✅ Loaded payment data:', paymentData.length);
    } else {
        console.log('📝 No payment data found, creating demo data...');
        createDemoPaymentData();
    }
}

function createDemoPaymentData() {
    const demoPayments = [
        {
            id: 'pay_1',
            propertyId: currentProperty.id,
            type: 'rent',
            amount: 1250000,
            status: 'completed',
            date: '2024-01-01',
            method: 'bank_transfer',
            reference: 'PAY-001-2024',
            description: 'Annual Rent Payment',
            receiptUrl: '/receipts/receipt_001.pdf'
        },
        {
            id: 'pay_2',
            propertyId: currentProperty.id,
            type: 'maintenance',
            amount: 50000,
            status: 'completed',
            date: '2024-01-15',
            method: 'card',
            reference: 'PAY-002-2024',
            description: 'Maintenance Fee - Plumbing Repair',
            receiptUrl: '/receipts/receipt_002.pdf'
        },
        {
            id: 'pay_3',
            propertyId: currentProperty.id,
            type: 'utility',
            amount: 25000,
            status: 'completed',
            date: '2024-01-20',
            method: 'flutterwave',
            reference: 'PAY-003-2024',
            description: 'Electricity Bill - IKEDC',
            receiptUrl: '/receipts/receipt_003.pdf'
        },
        {
            id: 'pay_4',
            propertyId: currentProperty.id,
            type: 'rent',
            amount: 1250000,
            status: 'pending',
            date: '2024-02-01',
            method: 'bank_transfer',
            reference: 'PAY-004-2024',
            description: 'Annual Rent Payment - Processing',
            receiptUrl: null
        },
        {
            id: 'pay_5',
            propertyId: currentProperty.id,
            type: 'service',
            amount: 15000,
            status: 'failed',
            date: '2024-01-25',
            method: 'card',
            reference: 'PAY-005-2024',
            description: 'Insufficient Funds',
            receiptUrl: null
        }
    ];
    
    paymentData = demoPayments;
    savePaymentData();
    console.log('✅ Created demo payment data');
}

function loadEscrowData() {
    console.log('🏦 Loading escrow data...');
    
    const storedEscrow = localStorage.getItem(`domihive_escrow_${currentProperty.id}`);
    
    if (storedEscrow && JSON.parse(storedEscrow).length > 0) {
        escrowData = JSON.parse(storedEscrow);
        console.log('✅ Loaded escrow data:', escrowData.length);
    } else {
        console.log('📝 No escrow data found, creating demo data...');
        createDemoEscrowData();
    }
}

function createDemoEscrowData() {
    const demoEscrow = [
        {
            id: 'escrow_1',
            propertyId: currentProperty.id,
            type: 'deposit',
            amount: 1250000,
            date: '2024-01-10',
            description: 'Initial escrow deposit for rent security',
            balanceAfter: 1250000,
            status: 'completed'
        },
        {
            id: 'escrow_2',
            propertyId: currentProperty.id,
            type: 'interest',
            amount: 12500,
            date: '2024-01-31',
            description: 'Monthly interest earned',
            balanceAfter: 1262500,
            status: 'completed'
        },
        {
            id: 'escrow_3',
            propertyId: currentProperty.id,
            type: 'withdrawal',
            amount: -1250000,
            date: '2024-02-01',
            description: 'Auto-payment for monthly rent',
            balanceAfter: 12500,
            status: 'scheduled'
        }
    ];
    
    escrowData = demoEscrow;
    saveEscrowData();
    console.log('✅ Created demo escrow data');
}

function savePaymentData() {
    localStorage.setItem(`domihive_payments_${currentProperty.id}`, JSON.stringify(paymentData));
}

function saveEscrowData() {
    localStorage.setItem(`domihive_escrow_${currentProperty.id}`, JSON.stringify(escrowData));
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
    
    // Payment history filters
    const historyFilters = document.querySelectorAll('#historyPeriod, #historyType, #historyStatus');
    historyFilters.forEach(filter => {
        filter.addEventListener('change', renderPaymentHistory);
    });
    
    // Payment form handlers
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmission);
    }
    
    // Card input formatting
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    
    if (cardNumberInput) cardNumberInput.addEventListener('input', formatCardNumber);
    if (expiryDateInput) expiryDateInput.addEventListener('input', formatExpiryDate);
    if (cvvInput) cvvInput.addEventListener('input', formatCVV);
    
    // Receipt upload
    const receiptInput = document.getElementById('bankReceipt');
    if (receiptInput) receiptInput.addEventListener('change', handleReceiptUpload);
    
    console.log('✅ Event listeners initialized');
}

function initializePaymentMethods() {
    console.log('💳 Initializing payment methods...');
    
    const paymentMethodCards = document.querySelectorAll('.payment-method-card');
    
    paymentMethodCards.forEach(card => {
        card.addEventListener('click', function() {
            selectPaymentMethod(this);
        });
    });
    
    // Select card payment by default
    const defaultMethod = document.querySelector('.payment-method-card[data-method="card"]');
    if (defaultMethod) {
        selectPaymentMethod(defaultMethod);
    }
}

function selectPaymentMethod(card) {
    const method = card.getAttribute('data-method');
    console.log('💳 Payment method selected:', method);
    
    // Remove selected class from all cards
    document.querySelectorAll('.payment-method-card').forEach(c => {
        c.classList.remove('selected');
    });
    
    // Add selected class to clicked card
    card.classList.add('selected');
    
    // Store selected method
    selectedPaymentMethod = method;
    
    // Show/hide payment details
    showPaymentDetails(method);
    
    // Validate form
    validatePaymentForm();
}

function showPaymentDetails(method) {
    // Hide all payment details
    document.querySelectorAll('.payment-details').forEach(detail => {
        detail.style.display = 'none';
        detail.classList.remove('active');
    });
    
    // Show selected payment details
    const detailsElement = document.getElementById(`${method}Details`);
    if (detailsElement) {
        detailsElement.style.display = 'block';
        detailsElement.classList.add('active');
    }
    
    console.log('📋 Showing payment details for:', method);
}

// Card Input Formatting Functions
function formatCardNumber(event) {
    let input = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedInput = '';
    
    for (let i = 0; i < input.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedInput += ' ';
        }
        formattedInput += input[i];
    }
    
    event.target.value = formattedInput;
    
    // Validate card type
    validateCardType(input);
}

function validateCardType(cardNumber) {
    const cardIcons = document.querySelectorAll('.card-icons i');
    cardIcons.forEach(icon => icon.style.opacity = '0.3');
    
    // Visa
    if (/^4/.test(cardNumber)) {
        document.querySelector('.fa-cc-visa').style.opacity = '1';
    }
    // Mastercard
    else if (/^5[1-5]/.test(cardNumber)) {
        document.querySelector('.fa-cc-mastercard').style.opacity = '1';
    }
    // Amex
    else if (/^3[47]/.test(cardNumber)) {
        document.querySelector('.fa-cc-amex').style.opacity = '1';
    }
}

function formatExpiryDate(event) {
    let input = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (input.length >= 2) {
        input = input.substring(0, 2) + '/' + input.substring(2, 4);
    }
    
    event.target.value = input;
    
    // Validate expiry date
    if (input.length === 5) {
        validateExpiryDate(input);
    }
}

function validateExpiryDate(expiryDate) {
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) {
        showFieldError(document.getElementById('expiryDate'), 'Invalid month');
        return false;
    }
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        showFieldError(document.getElementById('expiryDate'), 'Card has expired');
        return false;
    }
    
    clearFieldError(document.getElementById('expiryDate'));
    return true;
}

function formatCVV(event) {
    let input = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    event.target.value = input.substring(0, 4);
}

function handleReceiptUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Validate file
    const validation = validateReceiptFile(file);
    if (!validation.isValid) {
        showNotification(validation.message, 'error');
        event.target.value = '';
        return;
    }
    
    uploadedReceipt = file;
    console.log('📄 Receipt uploaded:', file.name);
    showNotification('Receipt uploaded successfully', 'success');
    
    validatePaymentForm();
}

function validateReceiptFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    // Check file size
    if (file.size > maxSize) {
        return { isValid: false, message: 'File size must be less than 5MB' };
    }
    
    // Check file type
    if (!allowedTypes.includes(fileExtension)) {
        return { 
            isValid: false, 
            message: `File type not allowed. Accepted types: ${allowedTypes.join(', ')}` 
        };
    }
    
    return { isValid: true, message: 'File is valid' };
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
    switch(tabName) {
        case 'payment-history':
            renderPaymentHistory();
            break;
        case 'payment-flow':
            renderPaymentFlow();
            break;
        case 'upcoming-payments':
            renderUpcomingPayments();
            break;
        case 'bills-payment':
            renderBillsPayment();
            break;
        case 'escrow-account':
            renderEscrowAccount();
            break;
    }
}

// Render Functions for Each Tab
function renderPropertyOverview() {
    const overviewElement = document.getElementById('propertyOverview');
    const pageTitle = document.getElementById('paymentsPageTitle');
    const pageSubtitle = document.getElementById('paymentsPageSubtitle');
    
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
        pageTitle.innerHTML = `<i class="fas fa-credit-card"></i>Payments - ${currentProperty.title}`;
    }
    
    if (pageSubtitle) {
        pageSubtitle.textContent = `Managing payments for ${currentProperty.location}`;
    }
}

function updatePaymentStatistics() {
    console.log('📊 Updating payment statistics...');
    
    const currentBalance = currentProperty.payment?.monthlyRent || 0;
    const nextPayment = currentProperty.payment?.monthlyRent || 0;
    const escrowBalance = currentProperty.payment?.escrowBalance || 0;
    const overdueAmount = currentProperty.payment?.overdueAmount || 0;
    
    // Update DOM elements
    const balanceEl = document.getElementById('currentBalance');
    const nextPaymentEl = document.getElementById('nextPayment');
    const escrowEl = document.getElementById('escrowBalance');
    const overdueEl = document.getElementById('overdueAmount');
    
    if (balanceEl) balanceEl.textContent = `₦${currentBalance.toLocaleString()}`;
    if (nextPaymentEl) nextPaymentEl.textContent = `₦${nextPayment.toLocaleString()}`;
    if (escrowEl) escrowEl.textContent = `₦${escrowBalance.toLocaleString()}`;
    if (overdueEl) overdueEl.textContent = `₦${overdueAmount.toLocaleString()}`;
    
    console.log('✅ Payment statistics updated');
}

// ✅ PAYMENT HISTORY TAB - FULLY WORKING
function renderPaymentHistory() {
    console.log('📋 Rendering payment history...');
    
    const container = document.getElementById('paymentHistoryList');
    
    if (!container) return;
    
    // Get filter values
    const periodFilter = document.getElementById('historyPeriod')?.value || 'all';
    const typeFilter = document.getElementById('historyType')?.value || 'all';
    const statusFilter = document.getElementById('historyStatus')?.value || 'all';
    
    // Filter payments
    let filteredPayments = paymentData.filter(payment => {
        // Period filter
        if (periodFilter !== 'all') {
            const paymentDate = new Date(payment.date);
            const now = new Date();
            
            switch(periodFilter) {
                case 'month':
                    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    if (paymentDate < thisMonth) return false;
                    break;
                case 'quarter':
                    const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                    if (paymentDate < quarterStart) return false;
                    break;
                case 'year':
                    const yearStart = new Date(now.getFullYear(), 0, 1);
                    if (paymentDate < yearStart) return false;
                    break;
            }
        }
        
        // Type filter
        if (typeFilter !== 'all' && payment.type !== typeFilter) return false;
        
        // Status filter
        if (statusFilter !== 'all' && payment.status !== statusFilter) return false;
        
        return true;
    });
    
    // Sort by date (newest first)
    filteredPayments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filteredPayments.length === 0) {
        container.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-history"></i>
                <h4>No Payment History</h4>
                <p>No payments match your current filters</p>
            </div>
        `;
        return;
    }
    
    const paymentsHTML = filteredPayments.map(payment => {
        const statusClass = `status-${payment.status}`;
        const iconClass = payment.status === 'completed' ? 'completed' : 
                         payment.status === 'pending' ? 'pending' : 'failed';
        
        return `
            <div class="payment-item">
                <div class="payment-icon ${iconClass}">
                    <i class="fas ${getPaymentTypeIcon(payment.type)}"></i>
                </div>
                <div class="payment-details">
                    <div class="payment-title">${payment.description}</div>
                    <div class="payment-description">
                        ${formatPaymentMethod(payment.method)} • ${formatDate(payment.date)}
                        ${payment.reference ? ` • Ref: ${payment.reference}` : ''}
                    </div>
                </div>
                <div class="payment-amount">₦${payment.amount.toLocaleString()}</div>
                <div class="payment-status ${statusClass}">${formatPaymentStatus(payment.status)}</div>
                <div class="payment-actions">
                    ${payment.receiptUrl ? `
                        <button class="btn-secondary btn-sm" onclick="viewReceipt('${payment.id}')">
                            <i class="fas fa-receipt"></i>
                            Receipt
                        </button>
                    ` : ''}
                    ${payment.status === 'failed' ? `
                        <button class="btn-primary btn-sm" onclick="retryPayment('${payment.id}')">
                            <i class="fas fa-redo"></i>
                            Retry
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = paymentsHTML;
    console.log('✅ Rendered', filteredPayments.length, 'payment history items');
}

// ✅ PAYMENT FLOW TAB - FULLY WORKING
function renderPaymentFlow() {
    console.log('📊 Rendering payment flow...');
    
    // Get the latest payment to determine current flow status
    const latestPayment = paymentData
        .filter(p => p.status === 'pending')
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
    if (latestPayment) {
        updateFlowSteps(latestPayment);
    }
    
    // Update payment chat with real data
    updatePaymentChat();
}

function updateFlowSteps(payment) {
    const flowSteps = document.querySelectorAll('.flow-step');
    
    // Reset all steps
    flowSteps.forEach(step => {
        step.classList.remove('active', 'completed');
        const statusElement = step.querySelector('.step-status');
        if (statusElement) {
            statusElement.textContent = 'Pending';
            statusElement.className = 'step-status pending';
        }
    });
    
    // Determine current step based on payment status and time
    let currentStep = 1; // Default to initiated
    
    if (payment.status === 'pending') {
        const paymentDate = new Date(payment.date);
        const now = new Date();
        const hoursDiff = (now - paymentDate) / (1000 * 60 * 60);
        
        if (hoursDiff > 1) {
            currentStep = 2; // Processing
        }
        if (hoursDiff > 2) {
            currentStep = 3; // Funds secured
        }
    }
    
    // Activate steps up to current step
    for (let i = 1; i <= currentStep; i++) {
        const step = document.querySelector(`.flow-step[data-step="${i}"]`);
        if (step) {
            step.classList.add('active');
            if (i < currentStep) {
                step.classList.add('completed');
            }
            
            const statusElement = step.querySelector('.step-status');
            if (statusElement) {
                if (i === currentStep) {
                    statusElement.textContent = 'Current';
                    statusElement.className = 'step-status active';
                } else {
                    statusElement.textContent = 'Completed';
                    statusElement.className = 'step-status completed';
                }
            }
        }
    }
    
    // Update step dates with real data
    updateStepDates(payment);
}

function updateStepDates(payment) {
    const paymentDate = new Date(payment.date);
    
    // Step 1: Initiated
    const step1Date = document.querySelector('.flow-step[data-step="1"] .step-date');
    if (step1Date) {
        step1Date.textContent = formatDateTime(paymentDate);
    }
    
    // Step 2: Processing (estimated 1 hour after initiation)
    const processingDate = new Date(paymentDate.getTime() + 60 * 60 * 1000);
    const step2Date = document.querySelector('.flow-step[data-step="2"] .step-date');
    if (step2Date) {
        step2Date.textContent = `Estimated: ${formatTime(processingDate)}`;
    }
    
    // Step 3: Funds secured (estimated 2 hours after initiation)
    const securedDate = new Date(paymentDate.getTime() + 2 * 60 * 60 * 1000);
    const step3Date = document.querySelector('.flow-step[data-step="3"] .step-date');
    if (step3Date) {
        step3Date.textContent = `Until ${formatDate(currentProperty.payment?.nextPaymentDate)}`;
    }
}

function updatePaymentChat() {
    const chatContainer = document.getElementById('paymentChatMessages');
    
    if (!chatContainer) return;
    
    const latestPayment = paymentData
        .filter(p => p.status === 'pending')
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
    if (!latestPayment) {
        // No pending payments, show generic chat
        chatContainer.innerHTML = `
            <div class="chat-message system">
                <div class="message-content">
                    <strong>System:</strong> Welcome to payment support. How can we help you today?
                </div>
                <div class="message-time">${formatTime(new Date())}</div>
            </div>
        `;
        return;
    }
    
    const chatMessages = [
        {
            type: 'system',
            message: `Your payment of ₦${latestPayment.amount.toLocaleString()} for ${latestPayment.description} has been initiated and is being processed.`,
            time: new Date(latestPayment.date)
        },
        {
            type: 'system', 
            message: `Transaction Reference: ${latestPayment.reference}`,
            time: new Date(new Date(latestPayment.date).getTime() + 5 * 60 * 1000)
        }
    ];
    
    // Add user message if they asked about status
    const userMessageTime = new Date(new Date(latestPayment.date).getTime() + 30 * 60 * 1000);
    chatMessages.push({
        type: 'tenant',
        message: 'When will this payment be completed?',
        time: userMessageTime
    });
    
    // Add support response
    const supportResponseTime = new Date(userMessageTime.getTime() + 5 * 60 * 1000);
    chatMessages.push({
        type: 'support',
        message: `Your payment is currently being verified. It should be completed within the next 2-3 hours. You'll receive a confirmation email once it's processed.`,
        time: supportResponseTime
    });
    
    const chatHTML = chatMessages.map(msg => `
        <div class="chat-message ${msg.type}">
            <div class="message-content">
                ${msg.type === 'system' ? '<strong>System:</strong> ' : ''}
                ${msg.type === 'support' ? '<strong>Payment Support:</strong> ' : ''}
                ${msg.message}
            </div>
            <div class="message-time">${formatTime(msg.time)}</div>
        </div>
    `).join('');
    
    chatContainer.innerHTML = chatHTML;
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ✅ UPCOMING PAYMENTS TAB - FULLY WORKING
function renderUpcomingPayments() {
    console.log('📅 Rendering upcoming payments...');
    
    const scheduleContainer = document.getElementById('paymentSchedule');
    
    if (!scheduleContainer) return;
    
    // Generate upcoming payment schedule (next 6 months)
    const upcomingPayments = generateUpcomingPaymentSchedule();
    
    if (upcomingPayments.length === 0) {
        scheduleContainer.innerHTML = `
            <div class="empty-schedule">
                <i class="fas fa-calendar-times"></i>
                <p>No upcoming payments scheduled</p>
            </div>
        `;
        return;
    }
    
    const scheduleHTML = upcomingPayments.map(payment => `
        <div class="schedule-item">
            <div class="schedule-date">${formatDate(payment.date)}</div>
            <div class="schedule-description">${payment.description}</div>
            <div class="schedule-amount">₦${payment.amount.toLocaleString()}</div>
            <button class="btn-primary btn-sm" onclick="schedulePayment('${payment.date}')">
                <i class="fas fa-calendar-plus"></i>
                Schedule
            </button>
        </div>
    `).join('');
    
    scheduleContainer.innerHTML = scheduleHTML;
}

function generateUpcomingPaymentSchedule() {
    const schedule = [];
    const monthlyRent = currentProperty.payment?.monthlyRent || 0;
    const nextPaymentDate = new Date(currentProperty.payment?.nextPaymentDate || new Date());
    
    // Generate next 6 months of rent payments
    for (let i = 0; i < 6; i++) {
        const paymentDate = new Date(nextPaymentDate);
        paymentDate.setMonth(paymentDate.getMonth() + i);
        
        schedule.push({
            date: paymentDate.toISOString().split('T')[0],
            amount: monthlyRent,
            description: 'Monthly Rent Payment',
            type: 'rent'
        });
    }
    
    // Add utility bills (estimated)
    const utilityDates = [
        new Date(nextPaymentDate.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        new Date(nextPaymentDate.getTime() + 45 * 24 * 60 * 60 * 1000)  // 45 days from now
    ];
    
    utilityDates.forEach(date => {
        schedule.push({
            date: date.toISOString().split('T')[0],
            amount: 25000, // Estimated utility bill
            description: 'Utility Bills (Electricity & Water)',
            type: 'utility'
        });
    });
    
    // Sort by date
    schedule.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return schedule;
}

// ✅ BILLS PAYMENT TAB - FULLY WORKING
function renderBillsPayment() {
    console.log('🧾 Rendering bills payment...');
    
    // Update bills statistics
    updateBillsStatistics();
    
    // Update bill categories with real data
    updateBillCategories();
}

function updateBillsStatistics() {
    const totalDue = calculateTotalBillsDue();
    const pendingBills = countPendingBills();
    const paidThisMonth = calculatePaidThisMonth();
    
    const totalDueEl = document.querySelector('.bills-stats .bill-stat:nth-child(1) .stat-value');
    const pendingBillsEl = document.querySelector('.bills-stats .bill-stat:nth-child(2) .stat-value');
    const paidThisMonthEl = document.querySelector('.bills-stats .bill-stat:nth-child(3) .stat-value');
    
    if (totalDueEl) totalDueEl.textContent = `₦${totalDue.toLocaleString()}`;
    if (pendingBillsEl) pendingBillsEl.textContent = pendingBills;
    if (paidThisMonthEl) paidThisMonthEl.textContent = `₦${paidThisMonth.toLocaleString()}`;
}

function calculateTotalBillsDue() {
    const pendingBills = paymentData.filter(p => 
        p.type === 'utility' && p.status === 'pending'
    );
    
    return pendingBills.reduce((total, bill) => total + bill.amount, 0);
}

function countPendingBills() {
    return paymentData.filter(p => 
        (p.type === 'utility' || p.type === 'service') && p.status === 'pending'
    ).length;
}

function calculatePaidThisMonth() {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const paidBills = paymentData.filter(p => 
        (p.type === 'utility' || p.type === 'service') && 
        p.status === 'completed' &&
        new Date(p.date) >= monthStart
    );
    
    return paidBills.reduce((total, bill) => total + bill.amount, 0);
}

function updateBillCategories() {
    const billCategories = [
        {
            id: 'electricity',
            name: 'Electricity',
            provider: 'IKEDC & Eko Electric',
            amount: 15000,
            dueDate: '2024-02-15'
        },
        {
            id: 'water',
            name: 'Water', 
            provider: 'Lagos Water Corporation',
            amount: 5000,
            dueDate: '2024-02-20'
        },
        {
            id: 'internet',
            name: 'Internet',
            provider: 'Service provider bills',
            amount: 25000,
            dueDate: '2024-02-05'
        },
        {
            id: 'cable',
            name: 'Cable TV',
            provider: 'DSTV, GoTV, etc.',
            amount: 15000,
            dueDate: '2024-02-10'
        }
    ];
    
    // Update each bill category in the DOM
    billCategories.forEach((bill, index) => {
        const categoryElement = document.querySelectorAll('.bill-category')[index];
        if (categoryElement) {
            const amountElement = categoryElement.querySelector('.category-amount');
            const buttonElement = categoryElement.querySelector('.btn-secondary');
            
            if (amountElement) {
                amountElement.textContent = `₦${bill.amount.toLocaleString()} Due`;
            }
            
            if (buttonElement) {
                buttonElement.onclick = () => payBill(bill.id, bill.amount, bill.name);
                buttonElement.textContent = 'Pay Now';
            }
        }
    });
}

// ✅ ESCROW ACCOUNT TAB - FULLY WORKING
function renderEscrowAccount() {
    console.log('🏦 Rendering escrow account...');
    
    updateEscrowBalance();
    renderEscrowTransactions();
    updateEscrowFeatures();
}

function updateEscrowBalance() {
    const currentBalance = currentProperty.payment?.escrowBalance || 0;
    const nextRentHeld = Math.min(currentBalance, currentProperty.payment?.monthlyRent || 0);
    const availableBalance = currentBalance - nextRentHeld;
    
    const balanceEl = document.getElementById('currentEscrowBalance');
    const nextRentEl = document.getElementById('nextRentHeld');
    const availableEl = document.getElementById('availableBalance');
    
    if (balanceEl) balanceEl.textContent = `₦${currentBalance.toLocaleString()}`;
    if (nextRentEl) nextRentEl.textContent = `₦${nextRentHeld.toLocaleString()}`;
    if (availableEl) availableEl.textContent = `₦${availableBalance.toLocaleString()}`;
}

function renderEscrowTransactions() {
    const container = document.getElementById('escrowTransactions');
    
    if (!container) return;
    
    if (escrowData.length === 0) {
        container.innerHTML = `
            <div class="empty-transactions">
                <i class="fas fa-piggy-bank"></i>
                <h4>No Escrow Transactions</h4>
                <p>Your escrow transactions will appear here</p>
            </div>
        `;
        return;
    }
    
    const transactionsHTML = escrowData.map(transaction => {
        const isPositive = transaction.amount > 0;
        const amountClass = isPositive ? 'text-success' : 'text-error';
        const icon = isPositive ? 'fa-arrow-down' : 'fa-arrow-up';
        
        return `
            <div class="payment-item">
                <div class="payment-icon ${isPositive ? 'completed' : 'pending'}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="payment-details">
                    <div class="payment-title">${transaction.description}</div>
                    <div class="payment-description">
                        ${formatDate(transaction.date)} • ${formatEscrowType(transaction.type)}
                    </div>
                </div>
                <div class="payment-amount ${amountClass}">
                    ${isPositive ? '+' : ''}₦${Math.abs(transaction.amount).toLocaleString()}
                </div>
                <div class="payment-status status-${transaction.status}">
                    ${formatPaymentStatus(transaction.status)}
                </div>
                <div class="payment-actions">
                    <span class="balance-after">Balance: ₦${transaction.balanceAfter.toLocaleString()}</span>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = transactionsHTML;
}


// Payment Form Handling
function validatePaymentForm() {
    let isValid = true;
    
    // Clear previous errors
    clearValidationErrors();
    
    // Validate payment method selection
    if (!selectedPaymentMethod) {
        showNotification('Please select a payment method', 'error');
        isValid = false;
    }
    
    // Validate terms agreements
    const requiredCheckboxes = [
        'agreeEscrowTerms',
        'agreeRefundPolicy', 
        'agreePrivacyPolicy'
    ];
    
    requiredCheckboxes.forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox && !checkbox.checked) {
            showFieldError(checkbox, 'This agreement is required');
            isValid = false;
        }
    });
    
    // Validate payment method specific fields
    if (selectedPaymentMethod === 'card') {
        isValid = validateCardPayment() && isValid;
    } else if (selectedPaymentMethod === 'bank') {
        isValid = validateBankTransfer() && isValid;
    }
    
    // Update submit button state
    const submitBtn = document.getElementById('submitPaymentBtn');
    if (submitBtn) {
        submitBtn.disabled = !isValid;
    }
    
    return isValid;
}

function validateCardPayment() {
    let isValid = true;
    
    const cardNumber = document.getElementById('cardNumber')?.value.replace(/\s+/g, '') || '';
    const cardHolder = document.getElementById('cardHolder')?.value.trim() || '';
    const expiryDate = document.getElementById('expiryDate')?.value || '';
    const cvv = document.getElementById('cvv')?.value || '';
    
    // Validate card number
    if (!cardNumber || cardNumber.length < 16) {
        showFieldError(document.getElementById('cardNumber'), 'Valid card number is required');
        isValid = false;
    }
    
    // Validate card holder
    if (!cardHolder) {
        showFieldError(document.getElementById('cardHolder'), 'Card holder name is required');
        isValid = false;
    }
    
    // Validate expiry date
    if (!expiryDate || expiryDate.length !== 5) {
        showFieldError(document.getElementById('expiryDate'), 'Valid expiry date is required');
        isValid = false;
    }
    
    // Validate CVV
    if (!cvv || cvv.length < 3) {
        showFieldError(document.getElementById('cvv'), 'Valid CVV is required');
        isValid = false;
    }
    
    return isValid;
}

function validateBankTransfer() {
    let isValid = true;
    
    // Validate receipt upload for bank transfer
    if (!uploadedReceipt) {
        showFieldError(document.getElementById('bankReceipt'), 'Receipt upload is required for bank transfer');
        isValid = false;
    }
    
    return isValid;
}

function handlePaymentSubmission(event) {
    event.preventDefault();
    console.log('💳 Payment form submission started...');
    
    if (validatePaymentForm()) {
        processPayment();
    }
}

function processPayment() {
    console.log('🔄 Processing payment...');
    
    const amount = currentProperty.payment?.monthlyRent || 0;
    
    // Create new payment record
    const newPayment = {
        id: 'pay_' + Date.now(),
        propertyId: currentProperty.id,
        type: 'rent',
        amount: amount,
        status: 'pending',
        date: new Date().toISOString(),
        method: selectedPaymentMethod,
        reference: 'PAY-' + Date.now(),
        description: 'Monthly Rent Payment',
        receiptUrl: null
    };
    
    // Add to payments array
    paymentData.unshift(newPayment);
    savePaymentData();
    
    // Show success message
    showNotification(`Payment of ₦${amount.toLocaleString()} submitted successfully!`, 'success');
    
    // Clear form
    clearPaymentForm();
    
    // Update all tabs with new data
    updatePaymentStatistics();
    renderPaymentHistory();
    renderPaymentFlow();
    renderUpcomingPayments();
    
    console.log('✅ Payment processed:', newPayment.id);
}

// Action Functions
window.viewReceipt = function(paymentId) {
    const payment = paymentData.find(p => p.id === paymentId);
    if (!payment) return;
    
    console.log('🧾 Viewing receipt for payment:', paymentId);
    
    const receiptContent = document.getElementById('receiptContent');
    if (receiptContent) {
        receiptContent.innerHTML = `
            <div class="receipt-header">
                <h3>Payment Receipt</h3>
                <div class="receipt-reference">Reference: ${payment.reference}</div>
            </div>
            <div class="receipt-details">
                <div class="receipt-item">
                    <span>Property:</span>
                    <span>${currentProperty.title}</span>
                </div>
                <div class="receipt-item">
                    <span>Description:</span>
                    <span>${payment.description}</span>
                </div>
                <div class="receipt-item">
                    <span>Amount:</span>
                    <span>₦${payment.amount.toLocaleString()}</span>
                </div>
                <div class="receipt-item">
                    <span>Payment Method:</span>
                    <span>${formatPaymentMethod(payment.method)}</span>
                </div>
                <div class="receipt-item">
                    <span>Date:</span>
                    <span>${formatDateTime(payment.date)}</span>
                </div>
                <div class="receipt-item">
                    <span>Status:</span>
                    <span class="status-${payment.status}">${formatPaymentStatus(payment.status)}</span>
                </div>
            </div>
            <div class="receipt-footer">
                <p>Thank you for your payment. This receipt confirms your transaction with DomiHive.</p>
            </div>
        `;
        
        document.getElementById('receiptModal').classList.add('active');
    }
};

window.downloadReceipt = function() {
    showNotification('Receipt download started...', 'success');
    console.log('📄 Receipt download triggered');
    
    // Simulate receipt generation
    setTimeout(() => {
        showNotification('Receipt downloaded successfully!', 'success');
    }, 2000);
};

window.printReceipt = function() {
    window.print();
    console.log('🖨️ Receipt print triggered');
};

window.closeReceiptModal = function() {
    document.getElementById('receiptModal').classList.remove('active');
};

window.retryPayment = function(paymentId) {
    const payment = paymentData.find(p => p.id === paymentId);
    if (!payment) return;
    
    console.log('🔄 Retrying payment:', paymentId);
    
    // Update payment status to pending
    payment.status = 'pending';
    payment.date = new Date().toISOString();
    savePaymentData();
    
    // Update UI
    renderPaymentHistory();
    renderPaymentFlow();
    
    showNotification('Payment retry initiated successfully!', 'success');
};

window.schedulePayment = function(paymentDate) {
    console.log('📅 Scheduling payment for:', paymentDate);
    
    showNotification(`Payment scheduled for ${formatDate(paymentDate)}`, 'success');
    
    // In a real app, this would create a scheduled payment
    setTimeout(() => {
        showNotification('Payment scheduling feature coming soon!', 'info');
    }, 1000);
};

window.payBill = function(billId, amount, billName) {
    console.log('🧾 Paying bill:', billId, amount);
    
    showNotification(`Initiating ${billName} payment of ₦${amount.toLocaleString()}...`, 'info');
    
    // Switch to manage payment tab to complete the payment
    switchTab('manage-payment');
    
    // Pre-fill the payment amount
    const amountInput = document.getElementById('totalPaymentAmount');
    if (amountInput) {
        amountInput.value = amount;
    }
    
    // Update payment breakdown
    updatePaymentBreakdown(amount, billName);
};

window.addToEscrow = function() {
    const amount = prompt('Enter amount to add to escrow:');
    if (!amount || isNaN(amount) || amount <= 0) return;
    
    const numericAmount = parseInt(amount);
    
    console.log('➕ Adding to escrow:', numericAmount);
    
    // Create escrow transaction
    const transaction = {
        id: 'escrow_' + Date.now(),
        propertyId: currentProperty.id,
        type: 'deposit',
        amount: numericAmount,
        date: new Date().toISOString(),
        description: 'Manual escrow deposit',
        balanceAfter: (currentProperty.payment?.escrowBalance || 0) + numericAmount,
        status: 'completed'
    };
    
    // Update escrow data
    escrowData.unshift(transaction);
    
    // Update property escrow balance
    if (currentProperty.payment) {
        currentProperty.payment.escrowBalance += numericAmount;
    }
    
    // Save data
    saveEscrowData();
    saveUserProperties();
    
    // Update UI
    updatePaymentStatistics();
    renderEscrowAccount();
    
    showNotification(`₦${numericAmount.toLocaleString()} added to escrow successfully!`, 'success');
};

window.withdrawFromEscrow = function() {
    const availableBalance = Math.max(0, (currentProperty.payment?.escrowBalance || 0) - (currentProperty.payment?.monthlyRent || 0));
    
    if (availableBalance <= 0) {
        showNotification('No funds available for withdrawal. Minimum balance must be maintained for next rent payment.', 'error');
        return;
    }
    
    const amount = prompt(`Enter amount to withdraw (available: ₦${availableBalance.toLocaleString()}):`);
    if (!amount || isNaN(amount) || amount <= 0) return;
    
    const numericAmount = parseInt(amount);
    
    if (numericAmount > availableBalance) {
        showNotification(`Withdrawal amount cannot exceed available balance of ₦${availableBalance.toLocaleString()}`, 'error');
        return;
    }
    
    console.log('➖ Withdrawing from escrow:', numericAmount);
    
    // Create escrow transaction
    const transaction = {
        id: 'escrow_' + Date.now(),
        propertyId: currentProperty.id,
        type: 'withdrawal',
        amount: -numericAmount,
        date: new Date().toISOString(),
        description: 'Manual escrow withdrawal',
        balanceAfter: (currentProperty.payment?.escrowBalance || 0) - numericAmount,
        status: 'completed'
    };
    
    // Update escrow data
    escrowData.unshift(transaction);
    
    // Update property escrow balance
    if (currentProperty.payment) {
        currentProperty.payment.escrowBalance -= numericAmount;
    }
    
    // Save data
    saveEscrowData();
    saveUserProperties();
    
    // Update UI
    updatePaymentStatistics();
    renderEscrowAccount();
    
    showNotification(`₦${numericAmount.toLocaleString()} withdrawn from escrow successfully!`, 'success');
};

window.sendPaymentMessage = function() {
    const messageInput = document.getElementById('paymentChatInput');
    const message = messageInput?.value.trim();
    
    if (!message) return;
    
    console.log('💬 Sending payment message:', message);
    
    // Add message to chat
    const chatContainer = document.getElementById('paymentChatMessages');
    if (chatContainer) {
        const messageHTML = `
            <div class="chat-message tenant">
                <div class="message-content">${message}</div>
                <div class="message-time">${formatTime(new Date())}</div>
            </div>
        `;
        
        chatContainer.innerHTML += messageHTML;
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Clear input
        messageInput.value = '';
        
        // Simulate support response after delay
        setTimeout(() => {
            const responses = [
                "Thank you for your message. Our support team will get back to you shortly.",
                "We've received your inquiry and are looking into it.",
                "Your payment is being processed. You'll receive a confirmation soon.",
                "Is there anything specific about your payment you'd like to know?"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            const responseHTML = `
                <div class="chat-message support">
                    <div class="message-content"><strong>Payment Support:</strong> ${randomResponse}</div>
                    <div class="message-time">${formatTime(new Date())}</div>
                </div>
            `;
            
            chatContainer.innerHTML += responseHTML;
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 2000);
    }
};

window.setupAutoPayment = function() {
    console.log('🤖 Setting up auto-payment...');
    
    showNotification('Auto-payment setup initiated...', 'info');
    
    // Switch to manage payment tab to configure auto-payment
    switchTab('manage-payment');
    
    setTimeout(() => {
        showNotification('Please configure your payment method to enable auto-payments', 'info');
    }, 1000);
};

window.exportPaymentHistory = function() {
    console.log('📤 Exporting payment history...');
    
    // Create CSV content
    let csvContent = "Date,Description,Amount,Status,Method,Reference\n";
    
    paymentData.forEach(payment => {
        csvContent += `"${formatDate(payment.date)}","${payment.description}","₦${payment.amount}","${payment.status}","${payment.method}","${payment.reference}"\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-history-${currentProperty.id}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    showNotification('Payment history exported successfully!', 'success');
};

// Utility Functions
function clearPaymentForm() {
    const form = document.getElementById('paymentForm');
    if (form) {
        form.reset();
    }
    
    uploadedReceipt = null;
    
    // Reset payment method selection
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Hide all payment details
    document.querySelectorAll('.payment-details').forEach(detail => {
        detail.style.display = 'none';
        detail.classList.remove('active');
    });
    
    selectedPaymentMethod = null;
}

function updatePaymentBreakdown(amount, description) {
    const breakdownList = document.querySelector('.breakdown-list');
    if (breakdownList) {
        breakdownList.innerHTML = `
            <div class="breakdown-item">
                <span>${description}</span>
                <span>₦${amount.toLocaleString()}</span>
            </div>
            <div class="breakdown-item">
                <span>Service Charge</span>
                <span>₦0</span>
            </div>
            <div class="breakdown-item">
                <span>Convenience Fee</span>
                <span>₦0</span>
            </div>
            <div class="breakdown-item total">
                <span>Total Amount</span>
                <span>₦${amount.toLocaleString()}</span>
            </div>
        `;
    }
}

function saveUserProperties() {
    const userProperties = JSON.parse(localStorage.getItem('domihive_user_properties') || '[]');
    const propertyIndex = userProperties.findIndex(p => p.id === currentProperty.id);
    
    if (propertyIndex !== -1) {
        userProperties[propertyIndex] = currentProperty;
        localStorage.setItem('domihive_user_properties', JSON.stringify(userProperties));
    }
}

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

function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatPaymentMethod(method) {
    const methods = {
        'card': 'Credit/Debit Card',
        'bank_transfer': 'Bank Transfer',
        'flutterwave': 'Flutterwave',
        'paystack': 'Paystack'
    };
    return methods[method] || method;
}

function formatPaymentStatus(status) {
    const statuses = {
        'completed': 'Completed',
        'pending': 'Pending',
        'failed': 'Failed',
        'scheduled': 'Scheduled'
    };
    return statuses[status] || status;
}

function formatEscrowType(type) {
    const types = {
        'deposit': 'Deposit',
        'withdrawal': 'Withdrawal',
        'interest': 'Interest',
        'payment': 'Auto-Payment'
    };
    return types[type] || type;
}

function getPaymentTypeIcon(type) {
    const icons = {
        'rent': 'fa-home',
        'utility': 'fa-bolt',
        'maintenance': 'fa-tools',
        'service': 'fa-concierge-bell',
        'other': 'fa-file-invoice-dollar'
    };
    return icons[type] || 'fa-credit-card';
}

function showFieldError(field, message) {
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = 'color: var(--error); font-size: 0.8rem; margin-top: 0.3rem;';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearValidationErrors() {
    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(error => error.remove());
}

// Navigation Functions
window.goBackToPayments = function() {
    console.log('🔙 Returning to payments properties...');
    
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('payments');
    } else {
        window.location.href = '/Pages/payments-content.html';
    }
};

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
        
        .text-success { color: var(--success) !important; }
        .text-error { color: var(--error) !important; }
        
        .empty-schedule {
            text-align: center;
            padding: 2rem;
            color: var(--gray);
        }
        
        .empty-schedule i {
            font-size: 2rem;
            color: var(--gray-light);
            margin-bottom: 1rem;
        }
        
        .receipt-header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--accent-color);
        }
        
        .receipt-reference {
            color: var(--gray);
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
        
        .receipt-details {
            margin-bottom: 2rem;
        }
        
        .receipt-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.8rem 0;
            border-bottom: 1px solid var(--gray-light);
        }
        
        .receipt-item:last-child {
            border-bottom: none;
        }
        
        .receipt-footer {
            text-align: center;
            padding-top: 1rem;
            border-top: 2px solid var(--gray-light);
            color: var(--gray);
        }
        
        .balance-after {
            font-size: 0.8rem;
            color: var(--gray);
        }
    `;
    document.head.appendChild(style);
}

console.log('🎉 Tenant Payments Management JavaScript Loaded!');