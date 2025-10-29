// inspection-update.js - DomiHive Inspection Management

// ===== INSPECTION MANAGEMENT FUNCTIONS =====
function rescheduleInspection(inspectionId) {
    console.log(`Reschedule inspection: ${inspectionId}`);
    alert(`Reschedule inspection: ${inspectionId}`);
    // Implementation for rescheduling
}

function cancelInspection(inspectionId) {
    if (confirm('Are you sure you want to cancel this inspection?')) {
        console.log(`Cancelled inspection: ${inspectionId}`);
        alert(`Cancelled inspection: ${inspectionId}`);
        // Implementation for cancellation
    }
}

function viewPropertyDetails(propertyId) {
    console.log(`View property details: ${propertyId}`);
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('property-details-rent');
    } else {
        alert(`View property details: ${propertyId}`);
    }
}

function contactAgent(agentId) {
    console.log(`Contact agent: ${agentId}`);
    alert(`Contact agent: ${agentId}`);
    // Implementation for contacting agent
}

function leaveReview(propertyId) {
    console.log(`Leave review for property: ${propertyId}`);
    alert(`Leave review for property: ${propertyId}`);
    // Implementation for review system
}

function rebookInspection(propertyId) {
    console.log(`Rebook inspection for property: ${propertyId}`);
    if (window.spa && typeof window.spa.navigateToSection === 'function') {
        window.spa.navigateToSection('book-inspection');
    } else {
        alert(`Rebook inspection for property: ${propertyId}`);
    }
}

// ===== FLOATING CALL BUTTON =====
function initializeFloatingCallButton() {
    const floatingBtn = document.getElementById('floatingCallBtn');
    let scrollTimer;
    let isScrolling = false;

    function showButton() {
        floatingBtn.classList.add('visible');
        clearTimeout(scrollTimer);
    }

    function hideButton() {
        scrollTimer = setTimeout(() => {
            floatingBtn.classList.remove('visible');
            isScrolling = false;
        }, 30000);
    }

    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            isScrolling = true;
            showButton();
        }
        
        clearTimeout(scrollTimer);
        hideButton();
    });

    floatingBtn.addEventListener('click', function() {
        window.open('tel:+2349010851071');
    });

    console.log('📞 Floating call button initialized');
}

// ===== INITIALIZATION =====
function initializeInspectionUpdate() {
    console.log('🚀 Initializing Inspection Management Page...');
    
    try {
        initializeFloatingCallButton();
        updateInspectionStats();
        console.log('✅ Inspection management page initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing inspection page:', error);
    }
}

function updateInspectionStats() {
    // Update statistics based on actual data
    const totalInspections = document.querySelectorAll('.inspection-card').length;
    const upcomingInspections = document.querySelectorAll('.inspection-badge.pending, .inspection-badge.confirmed').length;
    const completedInspections = document.querySelectorAll('.inspection-badge.completed').length;
    const cancelledInspections = document.querySelectorAll('.inspection-badge.cancelled').length;

    document.getElementById('totalInspections').textContent = totalInspections;
    document.getElementById('upcomingInspections').textContent = upcomingInspections;
    document.getElementById('completedInspections').textContent = completedInspections;
    document.getElementById('cancelledInspections').textContent = cancelledInspections;
}

// ===== SPA INTEGRATION =====
window.inspectionUpdateInit = function() {
    console.log('🔄 SPA: Initializing inspection update page');
    setTimeout(initializeInspectionUpdate, 100);
};

// ===== STANDALONE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.inspection-management-section')) {
        setTimeout(initializeInspectionUpdate, 500);
    }
});

// Make functions globally available
window.rescheduleInspection = rescheduleInspection;
window.cancelInspection = cancelInspection;
window.viewPropertyDetails = viewPropertyDetails;
window.contactAgent = contactAgent;
window.leaveReview = leaveReview;
window.rebookInspection = rebookInspection;

console.log('🎯 DomiHive Inspection Management JavaScript Loaded!');