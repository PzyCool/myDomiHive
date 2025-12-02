// ===== ONBOARDING JAVASCRIPT =====
// DomiHive User Onboarding - 3 Step Flow

class DomiHiveOnboarding {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.userPreferences = {
            goal: null
        };
        this.videoPlayed = false;
        this.init();
    }

    // ===== INITIALIZATION =====
    init() {
        console.log('🚀 DomiHive Onboarding Initialized - 3 Step Flow');
        this.initializeVideo();
        this.initializeGoalSelection();
        this.initializeEventListeners();
        this.loadUserProgress();
        
        // Auto-start on first load
        this.showStep(1);
    }

    // ===== STEP MANAGEMENT =====
    showStep(stepNumber) {
        // Validate step number
        if (stepNumber < 1 || stepNumber > this.totalSteps) {
            console.error('Invalid step number:', stepNumber);
            return;
        }
        
        // Hide all steps
        document.querySelectorAll('.onboarding-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show target step
        const targetStep = document.getElementById(`step${stepNumber}`);
        if (targetStep) {
            targetStep.classList.add('active');
            this.currentStep = stepNumber;
            this.updateProgressIndicator();
            this.saveUserProgress();
            
            // Special handling for each step
            this.handleStepActivation(stepNumber);
        }
    }

    handleStepActivation(stepNumber) {
        switch(stepNumber) {
            case 1:
                this.handleVideoStep();
                break;
            case 2:
                this.handleGoalStep();
                break;
            case 3:
                this.handleFinalStep();
                break;
        }
    }

    updateProgressIndicator() {
        // Update step numbers
        document.querySelectorAll('.step-number').forEach((step, index) => {
            const stepNum = index + 1;
            if (stepNum <= this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update progress text
        const currentStepElement = document.getElementById('currentStep');
        if (currentStepElement) {
            currentStepElement.textContent = this.currentStep;
        }
    }

    // ===== STEP 1: VIDEO HANDLING =====
    initializeVideo() {
        this.video = document.getElementById('onboardingVideo');
        this.videoOverlay = document.getElementById('videoOverlay');
        this.videoLoading = document.getElementById('videoLoading');
        this.playButton = document.getElementById('playButton');

        if (this.video) {
            // Video event listeners
            this.video.addEventListener('loadeddata', () => {
                this.hideVideoLoading();
                console.log('✅ Video loaded successfully');
            });

            this.video.addEventListener('waiting', () => {
                this.showVideoLoading();
            });

            this.video.addEventListener('canplay', () => {
                this.hideVideoLoading();
            });

            this.video.addEventListener('play', () => {
                this.hideVideoOverlay();
                this.videoPlayed = true;
                this.saveUserProgress();
                console.log('▶️ Video playing');
            });

            this.video.addEventListener('ended', () => {
                this.markVideoCompleted();
                console.log('✅ Video completed');
            });

            this.video.addEventListener('error', (e) => {
                console.error('❌ Video error:', e);
                this.showNotification('Unable to load video. Please try again later.', 'error');
                this.hideVideoLoading();
            });

            // Play button click
            if (this.playButton) {
                this.playButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.playVideo();
                });
            }

            // Video overlay click
            if (this.videoOverlay) {
                this.videoOverlay.addEventListener('click', () => {
                    this.playVideo();
                });
            }
            
            // Try to preload video
            this.video.load();
        }
    }

    handleVideoStep() {
        // Reset video state when returning to step 1
        if (this.video && this.video.currentTime > 0 && !this.videoPlayed) {
            this.showVideoOverlay();
        }
    }

    playVideo() {
        if (this.video) {
            this.video.play().catch(error => {
                console.error('Video play failed:', error);
                this.showNotification('Unable to play video. Please click the play button.', 'error');
            });
        }
    }

    showVideoOverlay() {
        if (this.videoOverlay) {
            this.videoOverlay.style.display = 'flex';
        }
    }

    hideVideoOverlay() {
        if (this.videoOverlay) {
            this.videoOverlay.style.display = 'none';
        }
    }

    showVideoLoading() {
        if (this.videoLoading) {
            this.videoLoading.classList.add('active');
        }
    }

    hideVideoLoading() {
        if (this.videoLoading) {
            this.videoLoading.classList.remove('active');
        }
    }

    markVideoCompleted() {
        this.videoPlayed = true;
        this.saveUserProgress();
        console.log('✅ Video marked as completed');
    }

    // ===== STEP 2: GOAL SELECTION =====
    initializeGoalSelection() {
        const goalOptions = document.querySelectorAll('.goal-option');
        
        goalOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectGoal(option);
            });
            
            // Add keyboard support
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectGoal(option);
                }
            });
            
            // Make focusable
            option.setAttribute('tabindex', '0');
            option.setAttribute('role', 'button');
        });
    }

    selectGoal(selectedOption) {
        // Remove selection from all options
        document.querySelectorAll('.goal-option').forEach(option => {
            option.classList.remove('selected');
            option.setAttribute('aria-selected', 'false');
        });
        
        // Add selection to clicked option
        selectedOption.classList.add('selected');
        selectedOption.setAttribute('aria-selected', 'true');
        selectedOption.focus();
        
        // Store the selected goal
        const goal = selectedOption.getAttribute('data-goal');
        this.userPreferences.goal = goal;
        
        // Enable continue button
        const continueBtn = document.getElementById('continueFromGoal');
        if (continueBtn) {
            continueBtn.disabled = false;
        }
        
        console.log('🎯 Selected goal:', goal);
        this.saveUserProgress();
    }

    handleGoalStep() {
        // Re-enable continue button if goal is already selected
        const continueBtn = document.getElementById('continueFromGoal');
        if (continueBtn && this.userPreferences.goal) {
            continueBtn.disabled = false;
            
            // Re-select the goal visually
            const selectedOption = document.querySelector(`.goal-option[data-goal="${this.userPreferences.goal}"]`);
            if (selectedOption) {
                selectedOption.classList.add('selected');
                selectedOption.setAttribute('aria-selected', 'true');
            }
        }
    }

    // ===== STEP 3: FINAL STEP =====
    handleFinalStep() {
        // Save all preferences to localStorage for dashboard use
        this.savePreferencesToStorage();
        
        // Log completion
        console.log('🎉 Onboarding completed with goal:', this.userPreferences.goal);
        
        // Add any final animations
        this.animateSuccessIcon();
    }

    animateSuccessIcon() {
        const successIcon = document.querySelector('.success-icon');
        if (successIcon) {
            successIcon.style.animation = 'bounceIn 0.6s ease';
        }
    }

    // ===== PROGRESS SAVING =====
    saveUserProgress() {
        const progress = {
            currentStep: this.currentStep,
            userPreferences: this.userPreferences,
            videoPlayed: this.videoPlayed,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('domihive_onboarding_progress', JSON.stringify(progress));
        console.log('💾 Saved progress for step:', this.currentStep);
    }

    loadUserProgress() {
        const savedProgress = localStorage.getItem('domihive_onboarding_progress');
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                this.currentStep = progress.currentStep || 1;
                this.userPreferences = progress.userPreferences || {};
                this.videoPlayed = progress.videoPlayed || false;
                
                console.log('📁 Loaded saved progress:', progress);
            } catch (error) {
                console.error('Error loading saved progress:', error);
                this.clearSavedProgress();
            }
        }
    }

    clearSavedProgress() {
        localStorage.removeItem('domihive_onboarding_progress');
        console.log('🧹 Cleared saved progress');
    }

    savePreferencesToStorage() {
        // Get existing user data or create new
        const userData = JSON.parse(localStorage.getItem('domihive_current_user') || '{}');
        
        // Update with onboarding preferences
        userData.preferences = this.userPreferences;
        userData.onboardingCompleted = true;
        userData.onboardingCompletedAt = new Date().toISOString();
        userData.goal = this.userPreferences.goal;
        
        // Save back to localStorage
        localStorage.setItem('domihive_current_user', JSON.stringify(userData));
        
        // Also save separately for easy access
        localStorage.setItem('domihive_user_preferences', JSON.stringify(this.userPreferences));
        localStorage.setItem('domihive_user_goal', this.userPreferences.goal || 'rent');
        
        console.log('💾 Preferences saved to user profile');
        console.log('📊 User goal:', this.userPreferences.goal);
    }

    // ===== NAVIGATION FUNCTIONS =====
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.showStep(this.currentStep + 1);
        } else {
            this.completeOnboarding();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }

    completeOnboarding() {
        // Final save
        this.savePreferencesToStorage();
        
        // Show completion notification
        this.showNotification('Welcome to DomiHive! Your dashboard is ready.', 'success');
        
        // Add a slight delay for better UX
        setTimeout(() => {
            this.redirectToDashboard();
        }, 1500);
    }

    redirectToDashboard() {
        // Get any saved redirect context
        const redirectContext = sessionStorage.getItem('domihive_redirect_section') || 
                               sessionStorage.getItem('domihive_onboarding_redirect') || 
                               'overview';
        
        // Get favorite property if any
        const favoriteProperty = sessionStorage.getItem('domihive_onboarding_favorite');
        
        // Clear all onboarding context
        sessionStorage.removeItem('domihive_redirect_section');
        sessionStorage.removeItem('domihive_onboarding_redirect');
        sessionStorage.removeItem('domihive_onboarding_favorite');
        
        // Build dashboard URL with context
        let dashboardUrl = `/Pages/spa.html?section=${redirectContext}&onboarding=completed`;
        
        if (favoriteProperty) {
            dashboardUrl += `&favorite=${favoriteProperty}`;
        }
        
        if (this.userPreferences.goal) {
            dashboardUrl += `&goal=${this.userPreferences.goal}`;
        }
        
        console.log('🔗 Redirecting to dashboard:', dashboardUrl);
        window.location.href = dashboardUrl;
    }

    // ===== SKIP FUNCTIONALITY =====
    skipOnboarding() {
        this.showSkipModal();
    }

    showSkipModal() {
        const modal = document.getElementById('skipModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus on first button for accessibility
            setTimeout(() => {
                const firstBtn = modal.querySelector('button');
                if (firstBtn) firstBtn.focus();
            }, 100);
        }
    }

    closeSkipModal() {
        const modal = document.getElementById('skipModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Return focus to skip button
            const skipBtn = document.querySelector('.btn-skip');
            if (skipBtn) skipBtn.focus();
        }
    }

    confirmSkipOnboarding() {
        // Set default preferences
        this.userPreferences = {
            goal: 'rent'
        };
        
        // Save and redirect
        this.savePreferencesToStorage();
        this.closeSkipModal();
        
        this.showNotification('Taking you to your dashboard...', 'info');
        
        setTimeout(() => {
            this.redirectToDashboard();
        }, 1000);
    }

    // ===== NOTIFICATION SYSTEM =====
    showNotification(message, type = 'success') {
        const existingNotification = document.querySelector('.onboarding-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `onboarding-notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
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
        `;
        
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}" aria-hidden="true"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);

        // Auto-remove after delay
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
        
        // Also log to console for debugging
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-triangle',
            warning: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // ===== EVENT LISTENERS & KEYBOARD NAVIGATION =====
    initializeEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape key closes modal
            if (e.key === 'Escape') {
                this.closeSkipModal();
            }
            
            // Arrow keys for goal selection
            if (this.currentStep === 2 && !e.target.closest('.modal-overlay')) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.navigateGoals(1);
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateGoals(-1);
                }
            }
        });

        // Add CSS animations
        this.addPageAnimations();
    }

    navigateGoals(direction) {
        const goals = Array.from(document.querySelectorAll('.goal-option'));
        if (goals.length === 0) return;
        
        const currentIndex = goals.findIndex(g => g.classList.contains('selected'));
        let newIndex = currentIndex + direction;
        
        // Wrap around
        if (newIndex < 0) newIndex = goals.length - 1;
        if (newIndex >= goals.length) newIndex = 0;
        
        // Select new goal
        this.selectGoal(goals[newIndex]);
    }

    addPageAnimations() {
        const style = document.createElement('style');
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
            
            .goal-option {
                transition: all 0.3s ease;
            }
            
            .onboarding-step {
                transition: opacity 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== ACCESSIBILITY HELPERS =====
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// ===== GLOBAL INITIALIZATION =====
const domiHiveOnboarding = new DomiHiveOnboarding();

// ===== GLOBAL FUNCTIONS FOR HTML ONCLICK =====
function nextStep() {
    domiHiveOnboarding.nextStep();
}

function previousStep() {
    domiHiveOnboarding.previousStep();
}

function skipOnboarding() {
    domiHiveOnboarding.skipOnboarding();
}

function closeSkipModal() {
    domiHiveOnboarding.closeSkipModal();
}

function confirmSkipOnboarding() {
    domiHiveOnboarding.confirmSkipOnboarding();
}

function completeOnboarding() {
    domiHiveOnboarding.completeOnboarding();
}

// Make onboarding instance globally available
window.domiHiveOnboarding = domiHiveOnboarding;

console.log('🎉 DomiHive Onboarding System Loaded - 3 Step Flow!');

// ===== PAGE LOAD COMPLETION =====
document.addEventListener('DOMContentLoaded', function() {
    // Set page title based on step
    const updatePageTitle = () => {
        const step = domiHiveOnboarding.currentStep;
        const titles = {
            1: 'Watch Tutorial - DomiHive',
            2: 'Choose Goal - DomiHive', 
            3: 'Get Started - DomiHive'
        };
        document.title = titles[step] || 'DomiHive Onboarding';
    };
    
    // Initial title
    updatePageTitle();
    
    // Update on step change
    const originalShowStep = domiHiveOnboarding.showStep.bind(domiHiveOnboarding);
    domiHiveOnboarding.showStep = function(stepNumber) {
        originalShowStep(stepNumber);
        updatePageTitle();
    };
});