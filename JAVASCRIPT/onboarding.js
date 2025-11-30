// ===== ONBOARDING JAVASCRIPT =====
// DomiHive User Onboarding Flow

class DomiHiveOnboarding {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.userPreferences = {
            goal: null,
            questions: {}
        };
        this.videoPlayed = false;
        this.init();
    }

    // ===== INITIALIZATION =====
    init() {
        console.log('🚀 DomiHive Onboarding Initialized');
        this.initializeVideo();
        this.initializeGoalSelection();
        this.initializeEventListeners();
        this.loadUserProgress();
        
        // Auto-start on first load
        this.showStep(1);
    }

    // ===== STEP MANAGEMENT =====
    showStep(stepNumber) {
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
                this.handleQuestionsStep();
                break;
            case 4:
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
            });

            this.video.addEventListener('ended', () => {
                this.markVideoCompleted();
            });

            // Play button click
            if (this.playButton) {
                this.playButton.addEventListener('click', () => {
                    this.playVideo();
                });
            }

            // Video overlay click
            if (this.videoOverlay) {
                this.videoOverlay.addEventListener('click', () => {
                    this.playVideo();
                });
            }
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
        
        // Enable continue button if it was disabled
        const continueBtn = document.querySelector('#step1 .btn-primary');
        if (continueBtn) {
            continueBtn.disabled = false;
        }
    }

    // ===== STEP 2: GOAL SELECTION =====
    initializeGoalSelection() {
        const goalOptions = document.querySelectorAll('.goal-option');
        
        goalOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectGoal(option);
            });
        });
    }

    selectGoal(selectedOption) {
        // Remove selection from all options
        document.querySelectorAll('.goal-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selection to clicked option
        selectedOption.classList.add('selected');
        
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
            }
        }
    }

    // ===== STEP 3: DYNAMIC QUESTIONS =====
    handleQuestionsStep() {
        if (!this.userPreferences.goal) {
            this.showNotification('Please select a goal first', 'error');
            this.showStep(2);
            return;
        }

        this.loadQuestionsForGoal(this.userPreferences.goal);
    }

    loadQuestionsForGoal(goal) {
        const questionsContainer = document.getElementById('questionsContainer');
        if (!questionsContainer) return;

        // Clear previous questions
        questionsContainer.innerHTML = '';

        // Get questions for the selected goal
        const questions = this.getQuestionsByGoal(goal);
        
        // Update step title based on goal
        this.updateQuestionsStepTitle(goal);

        // Render questions
        questions.forEach((question, index) => {
            const questionElement = this.createQuestionElement(question, index);
            questionsContainer.appendChild(questionElement);
        });

        // Load saved answers if any
        this.loadSavedAnswers();
    }

    getQuestionsByGoal(goal) {
        const questions = {
            rent: [
                {
                    id: 'property_type',
                    type: 'single',
                    question: 'What type of property are you looking to rent?',
                    options: [
                        'Self-contain / Studio',
                        '1 Bedroom',
                        '2 Bedroom',
                        '3+ Bedrooms',
                        'Shared apartment'
                    ]
                },
                {
                    id: 'budget_range',
                    type: 'single',
                    question: 'What is your preferred budget range?',
                    options: [
                        '₦50,000 - ₦100,000/year',
                        '₦100,000 - ₦300,000/year',
                        '₦300,000 - ₦500,000/year',
                        '₦500,000 - ₦1,000,000/year',
                        '₦1,000,000+/year'
                    ]
                },
                {
                    id: 'location',
                    type: 'multi',
                    question: 'Which location(s) are you targeting?',
                    options: [
                        'Lagos Mainland',
                        'Lagos Island',
                        'Ikeja',
                        'Lekki',
                        'Victoria Island',
                        'Surulere',
                        'Yaba'
                    ]
                },
                {
                    id: 'move_in',
                    type: 'single',
                    question: 'When do you want to move in?',
                    options: [
                        'Immediately',
                        'In 1–3 months',
                        '3+ months'
                    ]
                },
                {
                    id: 'features',
                    type: 'multi',
                    question: 'Any specific features?',
                    options: [
                        'Parking',
                        'Constant light',
                        'Fully furnished',
                        'Gated estate',
                        'Pet-friendly',
                        'Security'
                    ]
                }
            ],
            buy: [
                {
                    id: 'property_type',
                    type: 'single',
                    question: 'What type of property are you looking to buy?',
                    options: [
                        'Land',
                        'Apartment',
                        'Duplex',
                        'Bungalow',
                        'Commercial building'
                    ]
                },
                {
                    id: 'purpose',
                    type: 'single',
                    question: 'Is this for investment or personal use?',
                    options: [
                        'Investment',
                        'Personal use',
                        'Both'
                    ]
                },
                {
                    id: 'budget_range',
                    type: 'single',
                    question: 'What is your budget range?',
                    options: [
                        '₦5M - ₦10M',
                        '₦10M - ₦20M',
                        '₦20M - ₦50M',
                        '₦50M - ₦100M',
                        '₦100M+'
                    ]
                },
                {
                    id: 'location',
                    type: 'multi',
                    question: 'Preferred location(s)?',
                    options: [
                        'Lagos Mainland',
                        'Lagos Island',
                        'Ikeja GRA',
                        'Lekki Phase 1',
                        'Victoria Island',
                        'Banana Island'
                    ]
                },
                {
                    id: 'property_status',
                    type: 'single',
                    question: 'Do you want off-plan or ready-to-move-in property?',
                    options: [
                        'Off-plan',
                        'Ready-to-move-in',
                        'Either'
                    ]
                }
            ],
            shortlet: [
                {
                    id: 'duration',
                    type: 'single',
                    question: 'How long do you want to stay?',
                    options: [
                        '1–7 days',
                        '1–3 weeks',
                        '1–6 months'
                    ]
                },
                {
                    id: 'apartment_type',
                    type: 'single',
                    question: 'What type of apartment?',
                    options: [
                        'Studio',
                        '1 Bedroom',
                        '2 Bedroom',
                        'Luxury apartment'
                    ]
                },
                {
                    id: 'purpose',
                    type: 'single',
                    question: 'Purpose of stay?',
                    options: [
                        'Vacation',
                        'Work trip',
                        'Celebration',
                        'Medical stay'
                    ]
                },
                {
                    id: 'location',
                    type: 'multi',
                    question: 'Preferred location?',
                    options: [
                        'Lagos Island',
                        'Lagos Mainland',
                        'Victoria Island',
                        'Lekki',
                        'Ikeja'
                    ]
                },
                {
                    id: 'features',
                    type: 'multi',
                    question: 'Do you need special features?',
                    options: [
                        'Pool',
                        'WiFi',
                        'Parking',
                        'Generator',
                        'Housekeeping'
                    ]
                }
            ],
            commercial: [
                {
                    id: 'space_type',
                    type: 'single',
                    question: 'What type of commercial space do you need?',
                    options: [
                        'Office',
                        'Shop',
                        'Warehouse',
                        'Restaurant space',
                        'Event hall',
                        'Co-working space'
                    ]
                },
                {
                    id: 'budget_range',
                    type: 'single',
                    question: 'What is your budget range?',
                    options: [
                        '₦500,000 - ₦1M/year',
                        '₦1M - ₦2M/year',
                        '₦2M - ₦5M/year',
                        '₦5M+/year'
                    ]
                },
                {
                    id: 'location',
                    type: 'multi',
                    question: 'Preferred location(s)?',
                    options: [
                        'Lagos Island',
                        'Lagos Mainland',
                        'Ikeja',
                        'Victoria Island',
                        'Lekki'
                    ]
                },
                {
                    id: 'arrangement',
                    type: 'single',
                    question: 'Duration / type of arrangement?',
                    options: [
                        'Lease',
                        'Rent',
                        'Buy'
                    ]
                },
                {
                    id: 'features',
                    type: 'multi',
                    question: 'Required features?',
                    options: [
                        'Parking',
                        'High foot traffic',
                        'Road visibility',
                        'Security',
                        'Large floor space'
                    ]
                }
            ]
        };

        return questions[goal] || [];
    }

    updateQuestionsStepTitle(goal) {
        const titleElement = document.getElementById('dynamicQuestionTitle');
        const subtitleElement = document.getElementById('dynamicQuestionSubtitle');
        
        if (titleElement && subtitleElement) {
            const titles = {
                rent: 'Tell us about your rental needs',
                buy: 'Help us find your perfect property to buy',
                shortlet: 'Customize your shortlet experience',
                commercial: 'Tell us about your commercial space requirements'
            };
            
            titleElement.textContent = titles[goal] || 'Tell us more about your needs';
            subtitleElement.textContent = 'This helps us find the perfect properties for you';
        }
    }

    createQuestionElement(question, index) {
        const questionGroup = document.createElement('div');
        questionGroup.className = 'question-group';
        questionGroup.style.animationDelay = `${index * 0.1}s`;

        let optionsHTML = '';
        
        if (question.type === 'single') {
            optionsHTML = this.createSingleSelectOptions(question);
        } else if (question.type === 'multi') {
            optionsHTML = this.createMultiSelectOptions(question);
        }

        questionGroup.innerHTML = `
            <div class="question-title">
                <span>${index + 1}.</span>
                ${question.question}
            </div>
            <div class="question-options">
                ${optionsHTML}
            </div>
        `;

        return questionGroup;
    }

    createSingleSelectOptions(question) {
        return question.options.map(option => `
            <button type="button" class="option-button" 
                    data-question="${question.id}" 
                    data-value="${option}">
                ${option}
            </button>
        `).join('');
    }

    createMultiSelectOptions(question) {
        return `
            <div class="multi-select-options">
                ${question.options.map(option => `
                    <div class="multi-option" 
                         data-question="${question.id}" 
                         data-value="${option}">
                        ${option}
                    </div>
                `).join('')}
            </div>
        `;
    }

    loadSavedAnswers() {
        // Add event listeners to options
        const singleOptions = document.querySelectorAll('.option-button');
        const multiOptions = document.querySelectorAll('.multi-option');

        singleOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                this.handleSingleSelect(e.target);
            });
        });

        multiOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                this.handleMultiSelect(e.target);
            });
        });

        // Load previously saved answers
        if (this.userPreferences.questions) {
            Object.keys(this.userPreferences.questions).forEach(questionId => {
                const answer = this.userPreferences.questions[questionId];
                this.applySavedAnswer(questionId, answer);
            });
        }
    }

    handleSingleSelect(selectedOption) {
        const questionId = selectedOption.getAttribute('data-question');
        const value = selectedOption.getAttribute('data-value');
        
        // Remove selection from other options in same question
        const allOptions = selectedOption.parentElement.querySelectorAll('.option-button');
        allOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selection to clicked option
        selectedOption.classList.add('selected');
        
        // Save answer
        this.saveAnswer(questionId, value);
    }

    handleMultiSelect(selectedOption) {
        const questionId = selectedOption.getAttribute('data-question');
        const value = selectedOption.getAttribute('data-value');
        
        // Toggle selection
        selectedOption.classList.toggle('selected');
        
        // Get all selected values for this question
        const selectedValues = Array.from(
            selectedOption.parentElement.querySelectorAll('.multi-option.selected')
        ).map(option => option.getAttribute('data-value'));
        
        // Save answer
        this.saveAnswer(questionId, selectedValues);
    }

    applySavedAnswer(questionId, savedAnswer) {
        if (Array.isArray(savedAnswer)) {
            // Multi-select
            savedAnswer.forEach(value => {
                const option = document.querySelector(
                    `.multi-option[data-question="${questionId}"][data-value="${value}"]`
                );
                if (option) {
                    option.classList.add('selected');
                }
            });
        } else {
            // Single select
            const option = document.querySelector(
                `.option-button[data-question="${questionId}"][data-value="${savedAnswer}"]`
            );
            if (option) {
                option.classList.add('selected');
            }
        }
    }

    saveAnswer(questionId, answer) {
        if (!this.userPreferences.questions) {
            this.userPreferences.questions = {};
        }
        
        this.userPreferences.questions[questionId] = answer;
        this.saveUserProgress();
        
        console.log('💾 Saved answer:', questionId, answer);
    }

    // ===== STEP 4: FINAL STEP =====
    handleFinalStep() {
        // Save all preferences to localStorage for dashboard use
        this.savePreferencesToStorage();
        
        // Add any final step animations or logic
        console.log('🎉 Onboarding completed with preferences:', this.userPreferences);
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
            }
        }
    }

    savePreferencesToStorage() {
        // Save to user profile in localStorage
        const userData = JSON.parse(localStorage.getItem('domihive_current_user') || '{}');
        userData.preferences = this.userPreferences;
        userData.onboardingCompleted = true;
        userData.onboardingCompletedAt = new Date().toISOString();
        
        localStorage.setItem('domihive_current_user', JSON.stringify(userData));
        
        // Also save separately for easy access
        localStorage.setItem('domihive_user_preferences', JSON.stringify(this.userPreferences));
        
        console.log('💾 Preferences saved to user profile');
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
        
        // Redirect to dashboard
        setTimeout(() => {
            this.redirectToDashboard();
        }, 1500);
    }

    redirectToDashboard() {
        // Get any saved redirect context
        const redirectContext = sessionStorage.getItem('domihive_redirect_section');
        const finalSection = redirectContext || 'overview';
        
        // Clear redirect context
        sessionStorage.removeItem('domihive_redirect_section');
        
        // Redirect to SPA with user preferences
        window.location.href = `/Pages/spa.html?section=${finalSection}&onboarding=completed`;
    }

    // ===== SKIP FUNCTIONALITY =====
    skipOnboarding() {
        this.showSkipModal();
    }

    showSkipModal() {
        const modal = document.getElementById('skipModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeSkipModal() {
        const modal = document.getElementById('skipModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    confirmSkipOnboarding() {
        // Set default preferences
        this.userPreferences = {
            goal: 'rent',
            questions: {
                property_type: '2 Bedroom',
                budget_range: '₦100,000 - ₦300,000/year',
                location: ['Lagos Mainland'],
                move_in: 'In 1–3 months'
            }
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
            <i class="fas ${this.getNotificationIcon(type)}"></i>
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

    // ===== EVENT LISTENERS =====
    initializeEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSkipModal();
            }
        });

        // Add CSS animations
        this.addPageAnimations();
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
            
            .question-group {
                animation: fadeInUp 0.5s ease both;
            }
        `;
        document.head.appendChild(style);
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

console.log('🎉 DomiHive Onboarding System Loaded!');

// ===== UPDATE SIGNUP.JS REDIRECT =====
// Add this to your signup.js to redirect to onboarding instead of dashboard:

/*
// In signup.js, replace the redirectToSPA function with:
redirectToOnboarding() {
    // Clear any previous onboarding progress
    localStorage.removeItem('domihive_onboarding_progress');
    
    // Redirect to onboarding
    window.location.href = '/Pages/onboarding.html';
}

// And update both social and phone signup completions to use:
this.redirectToOnboarding();
*/