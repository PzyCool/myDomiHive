// messages-content.js - Complete Messaging System

// SPA Integration
window.spaMessagesInit = function() {
    console.log('🎯 SPA: Initializing Messages Content');
    initializeMessagingSystem();
};

// Auto-initialize if loaded directly
if (window.location.pathname.includes('messages-content.html')) {
    document.addEventListener('DOMContentLoaded', initializeMessagingSystem);
} else {
    // SPA environment - check if we're on the page and initialize
    setTimeout(function() {
        if (document.querySelector('.messages-content')) {
            console.log('🔍 Detected SPA environment - auto-initializing messages');
            initializeMessagingSystem();
        }
    }, 500);
}

function initializeMessagingSystem() {
    console.log('💬 Initializing Messaging System...');
    
    // Global variables
    let conversations = [];
    let activeConversation = null;
    let currentFilter = 'all';
    let currentCategory = 'all';
    let annieSettings = {
        assistanceLevel: 'standard',
        autoCategorize: true,
        suggestResponses: true,
        priorityDetection: true,
        learnFromUsage: false,
        shareTrainingData: false,
        saveMessageHistory: true,
        annieNotifications: true,
        smartReminders: true
    };
    
    // Load data and initialize
    loadConversations();
    initializeEventListeners();
    renderConversationsList();
    initializeAnnieAI();
    
    console.log('✅ Messaging system ready');
}

// ===== DATA MANAGEMENT =====
function loadConversations() {
    console.log('📦 Loading conversations...');
    
    const storedConversations = localStorage.getItem('domihive_conversations');
    
    if (storedConversations && JSON.parse(storedConversations).length > 0) {
        conversations = JSON.parse(storedConversations);
        console.log('✅ Loaded conversations:', conversations.length);
    } else {
        console.log('📝 No conversations found, creating demo data...');
        createDemoConversations();
    }
}

function createDemoConversations() {
    conversations = [
        {
            id: 'conv_1',
            partner: {
                name: 'Sarah Johnson',
                role: 'Property Manager - Ikoyi Apartments',
                avatar: 'user-tie',
                status: 'online'
            },
            messages: [
                {
                    id: 'msg_1',
                    type: 'received',
                    content: 'Hello! I wanted to follow up on the maintenance request you submitted for the kitchen plumbing. Our team has reviewed it and we\'ve scheduled a technician to visit tomorrow between 2-4 PM.',
                    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 min ago
                    read: true
                },
                {
                    id: 'msg_2',
                    type: 'sent',
                    content: 'Thank you for the update! Tomorrow between 2-4 PM works perfectly. I\'ll make sure to be available then.',
                    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 min ago
                    read: true
                },
                {
                    id: 'msg_3',
                    type: 'received',
                    content: 'Great! I\'m also sending you the technician\'s details and the work order for your reference.',
                    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min ago
                    read: true,
                    attachment: {
                        name: 'Work_Order_Plumbing_001.pdf',
                        size: '2.4 MB',
                        type: 'pdf'
                    }
                }
            ],
            unreadCount: 3,
            starred: false,
            tags: ['maintenance', 'urgent'],
            category: 'property',
            lastActivity: new Date().toISOString()
        },
        {
            id: 'conv_2',
            partner: {
                name: 'Mike Chen',
                role: 'VI Luxury Condo',
                avatar: 'user',
                status: 'away'
            },
            messages: [
                {
                    id: 'msg_1',
                    type: 'received',
                    content: 'Thanks for confirming my payment. When will the receipt be available?',
                    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
                    read: true
                }
            ],
            unreadCount: 0,
            starred: true,
            tags: ['payment'],
            category: 'payment',
            lastActivity: new Date(Date.now() - 60 * 60 * 1000).toISOString()
        },
        {
            id: 'conv_3',
            partner: {
                name: 'DomiHive Support',
                role: 'Customer Support',
                avatar: 'headset',
                status: 'online'
            },
            messages: [
                {
                    id: 'msg_1',
                    type: 'received',
                    content: 'Your account verification has been completed successfully. You now have full access to all DomiHive features.',
                    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
                    read: false
                }
            ],
            unreadCount: 1,
            starred: false,
            tags: ['support'],
            category: 'support',
            lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'conv_4',
            partner: {
                name: 'Elite Maintenance Services',
                role: 'Maintenance Contractor',
                avatar: 'tools',
                status: 'offline'
            },
            messages: [
                {
                    id: 'msg_1',
                    type: 'received',
                    content: 'We\'ve scheduled the AC repair for tomorrow at 2 PM. Please confirm if this works for you.',
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                    read: true
                }
            ],
            unreadCount: 0,
            starred: false,
            tags: ['maintenance', 'scheduled'],
            category: 'maintenance',
            lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'conv_5',
            partner: {
                name: 'Security Department',
                role: 'Building Security',
                avatar: 'user-shield',
                status: 'online'
            },
            messages: [
                {
                    id: 'msg_1',
                    type: 'received',
                    content: 'Security system maintenance scheduled for this weekend. Brief downtime expected on Saturday 2-4 PM.',
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
                    read: true
                }
            ],
            unreadCount: 0,
            starred: false,
            tags: ['maintenance', 'scheduled'],
            category: 'maintenance',
            lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
    
    saveConversations();
    console.log('✅ Created demo conversations');
}

function saveConversations() {
    localStorage.setItem('domihive_conversations', JSON.stringify(conversations));
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    console.log('🎯 Initializing event listeners...');
    
    // Search functionality
    const searchInput = document.getElementById('messageSearch');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleFilterChange(this.getAttribute('data-filter'), this);
        });
    });
    
    // Category items
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            handleCategoryChange(this.getAttribute('data-category'), this);
        });
    });
    
    // Conversation items
    const conversationItems = document.querySelectorAll('.conversation-item');
    conversationItems.forEach(item => {
        item.addEventListener('click', function() {
            const conversationId = this.getAttribute('data-conversation');
            openConversation(conversationId, this);
        });
    });
    
    // Message input
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('input', handleMessageInputChange);
    }
    
    // Annie settings
    const annieSettingsBtn = document.querySelector('.annie-settings');
    if (annieSettingsBtn) {
        annieSettingsBtn.addEventListener('click', toggleAnnieSettings);
    }
    
    console.log('✅ Event listeners initialized');
}

// ===== CONVERSATION MANAGEMENT =====
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    console.log('🔍 Searching:', searchTerm);
    
    renderConversationsList(searchTerm);
}

function handleFilterChange(filter, button) {
    console.log('🎯 Filter changed:', filter);
    
    currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
    
    renderConversationsList();
}

function handleCategoryChange(category, item) {
    console.log('📁 Category changed:', category);
    
    currentCategory = category;
    
    // Update active category
    document.querySelectorAll('.category-item').forEach(cat => {
        cat.classList.remove('active');
    });
    item.classList.add('active');
    
    renderConversationsList();
}

function renderConversationsList(searchTerm = '') {
    console.log('🔄 Rendering conversations list...');
    
    const container = document.querySelector('.conversations-list');
    if (!container) return;
    
    // Filter conversations
    let filteredConversations = conversations.filter(conv => {
        // Search filter
        if (searchTerm) {
            const searchMatch = conv.partner.name.toLowerCase().includes(searchTerm) ||
                              conv.messages.some(msg => msg.content.toLowerCase().includes(searchTerm));
            if (!searchMatch) return false;
        }
        
        // Category filter
        if (currentCategory !== 'all' && conv.category !== currentCategory) {
            return false;
        }
        
        // Status filter
        switch(currentFilter) {
            case 'unread':
                return conv.unreadCount > 0;
            case 'starred':
                return conv.starred;
            default:
                return true;
        }
    });
    
    // Sort by last activity (newest first)
    filteredConversations.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
    
    if (filteredConversations.length === 0) {
        container.innerHTML = `
            <div class="empty-conversations">
                <i class="fas fa-comments"></i>
                <p>No conversations found</p>
                <small>Try adjusting your search or filters</small>
            </div>
        `;
        return;
    }
    
    const conversationsHTML = filteredConversations.map(conv => {
        const lastMessage = conv.messages[conv.messages.length - 1];
        const isActive = activeConversation && activeConversation.id === conv.id;
        
        return `
            <div class="conversation-item ${isActive ? 'active' : ''}" data-conversation="${conv.id}">
                <div class="conversation-avatar">
                    <div class="avatar-placeholder">
                        <i class="fas fa-${conv.partner.avatar}"></i>
                    </div>
                    <div class="status-indicator ${conv.partner.status}"></div>
                </div>
                <div class="conversation-info">
                    <div class="conversation-header">
                        <h4>${conv.partner.name} - ${conv.partner.role}</h4>
                        <span class="message-time">${formatTimeAgo(conv.lastActivity)}</span>
                    </div>
                    <p class="message-preview">${lastMessage.content}</p>
                    <div class="conversation-tags">
                        ${conv.tags.map(tag => `<span class="tag ${tag}">${formatTagName(tag)}</span>`).join('')}
                    </div>
                </div>
                <div class="conversation-meta">
                    ${conv.unreadCount > 0 ? `<div class="unread-count">${conv.unreadCount}</div>` : ''}
                    <button class="star-btn ${conv.starred ? 'starred' : ''}" onclick="toggleStar('${conv.id}', this)">
                        <i class="${conv.starred ? 'fas' : 'far'} fa-star"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = conversationsHTML;
    
    // Re-attach event listeners to new conversation items
    const newConversationItems = container.querySelectorAll('.conversation-item');
    newConversationItems.forEach(item => {
        item.addEventListener('click', function() {
            const conversationId = this.getAttribute('data-conversation');
            openConversation(conversationId, this);
        });
    });
    
    console.log('✅ Rendered', filteredConversations.length, 'conversations');
}

function openConversation(conversationId, element) {
    console.log('💬 Opening conversation:', conversationId);
    
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation) return;
    
    activeConversation = conversation;
    
    // Update UI state
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    if (element) element.classList.add('active');
    
    // Hide no conversation state, show active conversation
    document.getElementById('noConversation').style.display = 'none';
    document.getElementById('activeConversation').style.display = 'flex';
    
    // Update conversation header
    document.getElementById('conversationPartnerName').textContent = conversation.partner.name;
    document.getElementById('conversationPartnerRole').textContent = conversation.partner.role;
    
    // Render messages
    renderMessages();
    
    // Mark as read
    markConversationAsRead(conversationId);
    
    // Update Annie suggestions
    updateAnnieSuggestions();
    
    console.log('✅ Conversation opened:', conversation.partner.name);
}

function renderMessages() {
    if (!activeConversation) return;
    
    const container = document.getElementById('messagesContainer');
    if (!container) return;
    
    let messagesHTML = '';
    
    // Group messages by date
    const messagesByDate = groupMessagesByDate(activeConversation.messages);
    
    Object.keys(messagesByDate).forEach(date => {
        messagesHTML += `
            <div class="message-date-separator">
                <span>${date}</span>
            </div>
        `;
        
        messagesByDate[date].forEach(message => {
            const isAnnie = message.type === 'annie';
            const isSent = message.type === 'sent';
            const isReceived = message.type === 'received';
            
            if (isAnnie) {
                messagesHTML += `
                    <div class="message annie-suggestion">
                        <div class="message-avatar annie-avatar">
                            <div class="annie-badge">AI</div>
                            <div class="avatar-placeholder">
                                <i class="fas fa-robot"></i>
                            </div>
                        </div>
                        <div class="message-content">
                            <div class="annie-header">
                                <strong>Annie</strong>
                                <span class="annie-subtitle">Your DomiHive AI Assistant</span>
                            </div>
                            <div class="message-bubble annie-bubble">
                                <p>${message.content}</p>
                                ${message.suggestions ? `
                                    <div class="annie-suggestions">
                                        ${message.suggestions.map(suggestion => `
                                            <button class="suggestion-btn" onclick="useSuggestion('${suggestion.replace(/'/g, "\\'")}')">
                                                ${suggestion}
                                            </button>
                                        `).join('')}
                                    </div>
                                ` : ''}
                                <div class="message-time">
                                    ${formatTime(message.timestamp)}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (isSent || isReceived) {
                messagesHTML += `
                    <div class="message ${isSent ? 'sent' : 'received'}">
                        ${isReceived ? `
                            <div class="message-avatar">
                                <div class="avatar-placeholder">
                                    <i class="fas fa-${activeConversation.partner.avatar}"></i>
                                </div>
                            </div>
                        ` : ''}
                        <div class="message-content">
                            <div class="message-bubble">
                                <p>${message.content}</p>
                                ${message.attachment ? `
                                    <div class="message-attachment">
                                        <div class="attachment-icon">
                                            <i class="fas fa-file-${message.attachment.type}"></i>
                                        </div>
                                        <div class="attachment-info">
                                            <div class="attachment-name">${message.attachment.name}</div>
                                            <div class="attachment-size">${message.attachment.size}</div>
                                        </div>
                                        <button class="attachment-download" onclick="downloadAttachment('${message.attachment.name}')">
                                            <i class="fas fa-download"></i>
                                        </button>
                                    </div>
                                ` : ''}
                                <div class="message-time">
                                    ${isReceived && message.read ? '<i class="fas fa-check-double read"></i>' : ''}
                                    ${formatTime(message.timestamp)}
                                </div>
                            </div>
                        </div>
                        ${isSent ? `
                            <div class="message-avatar">
                                <div class="avatar-placeholder">
                                    <i class="fas fa-user"></i>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `;
            }
        });
    });
    
    container.innerHTML = messagesHTML;
    container.scrollTop = container.scrollHeight;
    
    console.log('✅ Rendered', activeConversation.messages.length, 'messages');
}

function groupMessagesByDate(messages) {
    const groups = {};
    
    messages.forEach(message => {
        const date = new Date(message.timestamp).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const today = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        let displayDate = date;
        if (date === today) displayDate = 'Today';
        if (date === yesterday) displayDate = 'Yesterday';
        
        if (!groups[displayDate]) {
            groups[displayDate] = [];
        }
        groups[displayDate].push(message);
    });
    
    return groups;
}

// ===== MESSAGE SENDING =====
function handleMessageInputChange(event) {
    const sendButton = document.getElementById('sendButton');
    if (sendButton) {
        sendButton.disabled = !event.target.value.trim();
    }
}

function handleMessageInput(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
    
    // Auto-resize textarea
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageContent = messageInput.value.trim();
    
    if (!messageContent || !activeConversation) return;
    
    console.log('📤 Sending message:', messageContent);
    
    // Create new message
    const newMessage = {
        id: 'msg_' + Date.now(),
        type: 'sent',
        content: messageContent,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    // Add to conversation
    activeConversation.messages.push(newMessage);
    activeConversation.lastActivity = new Date().toISOString();
    activeConversation.unreadCount = 0; // Reset unread count when user sends message
    
    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // Update send button
    const sendButton = document.getElementById('sendButton');
    if (sendButton) sendButton.disabled = true;
    
    // Re-render messages
    renderMessages();
    
    // Save conversations
    saveConversations();
    
    // Update conversations list
    renderConversationsList();
    
    // Simulate response after delay
    simulateResponse();
    
    console.log('✅ Message sent');
}

function simulateResponse() {
    if (!activeConversation) return;
    
    setTimeout(() => {
        const responses = {
            'conv_1': [
                "Perfect! The technician will arrive between 2-4 PM tomorrow. Please ensure someone is available to let them in.",
                "I'll send you a confirmation reminder 30 minutes before the scheduled time.",
                "The estimated completion time for this repair is 2-3 hours."
            ],
            'conv_2': [
                "Your receipt will be available in your account within 24 hours.",
                "I've expedited the receipt processing for you.",
                "The receipt has been generated and is now available for download."
            ],
            'conv_3': [
                "Is there anything else I can help you with today?",
                "Don't hesitate to reach out if you have any questions about the new features.",
                "We're here to help 24/7 if you need any assistance."
            ],
            'conv_4': [
                "Please confirm if the 2 PM schedule works for you.",
                "We can reschedule if this time doesn't work for you.",
                "The technician will call you 30 minutes before arrival."
            ],
            'conv_5': [
                "The security system will be fully operational by 4:30 PM.",
                "We apologize for any inconvenience this may cause.",
                "Emergency services will remain active during the maintenance window."
            ]
        };
        
        const convResponses = responses[activeConversation.id] || ["Thank you for your message. I'll get back to you shortly."];
        const randomResponse = convResponses[Math.floor(Math.random() * convResponses.length)];
        
        const responseMessage = {
            id: 'msg_' + Date.now(),
            type: 'received',
            content: randomResponse,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        activeConversation.messages.push(responseMessage);
        activeConversation.lastActivity = new Date().toISOString();
        activeConversation.unreadCount = (activeConversation.unreadCount || 0) + 1;
        
        renderMessages();
        saveConversations();
        renderConversationsList();
        
        // Update Annie suggestions after response
        updateAnnieSuggestions();
        
    }, 2000 + Math.random() * 3000); // Random delay between 2-5 seconds
}

// ===== ANNIE AI FUNCTIONALITY =====
function initializeAnnieAI() {
    console.log('🤖 Initializing Annie AI...');
    
    // Load Annie settings
    const storedSettings = localStorage.getItem('domihive_annie_settings');
    if (storedSettings) {
        annieSettings = { ...annieSettings, ...JSON.parse(storedSettings) };
    }
    
    // Apply settings to UI
    applyAnnieSettingsToUI();
    
    console.log('✅ Annie AI initialized');
}

function updateAnnieSuggestions() {
    if (!activeConversation || !annieSettings.suggestResponses) return;
    
    const lastMessage = activeConversation.messages[activeConversation.messages.length - 1];
    if (!lastMessage || lastMessage.type !== 'received') return;
    
    // Remove existing Annie suggestions
    activeConversation.messages = activeConversation.messages.filter(msg => msg.type !== 'annie');
    
    // Generate new suggestions based on conversation context
    const suggestions = generateAnnieSuggestions(activeConversation);
    
    if (suggestions.length > 0) {
        const annieMessage = {
            id: 'annie_' + Date.now(),
            type: 'annie',
            content: "I notice this conversation might need a quick response. Here are some suggestions:",
            suggestions: suggestions,
            timestamp: new Date().toISOString()
        };
        
        activeConversation.messages.push(annieMessage);
        renderMessages();
        saveConversations();
    }
}

function generateAnnieSuggestions(conversation) {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const messageContent = lastMessage.content.toLowerCase();
    
    let suggestions = [];
    
    // Maintenance-related suggestions
    if (messageContent.includes('maintenance') || messageContent.includes('repair') || messageContent.includes('technician')) {
        suggestions = [
            "Thanks for the update. I'll make sure to be available.",
            "Could you please provide the technician's contact information?",
            "Is there anything I need to prepare before the technician arrives?",
            "What's the estimated completion time for this repair?"
        ];
    }
    // Payment-related suggestions
    else if (messageContent.includes('payment') || messageContent.includes('receipt') || messageContent.includes('bill')) {
        suggestions = [
            "Thanks for confirming the payment.",
            "When will the receipt be available for download?",
            "Could you please send the payment confirmation?",
            "Is there any additional documentation needed?"
        ];
    }
    // General inquiries
    else if (messageContent.includes('question') || messageContent.includes('help') || messageContent.includes('support')) {
        suggestions = [
            "Thanks for your help with this matter.",
            "Could you please provide more details?",
            "I appreciate your assistance with this.",
            "When can I expect an update on this?"
        ];
    }
    // Emergency/urgent
    else if (messageContent.includes('urgent') || messageContent.includes('emergency') || messageContent.includes('asap')) {
        suggestions = [
            "This is urgent - please prioritize this request.",
            "I need immediate assistance with this issue.",
            "Please escalate this to the appropriate team.",
            "When can I expect someone to address this?"
        ];
    }
    // Default suggestions
    else {
        suggestions = [
            "Thanks for getting back to me.",
            "I appreciate the update.",
            "Could you please clarify this for me?",
            "When should I expect the next update?"
        ];
    }
    
    return suggestions.slice(0, 3); // Return max 3 suggestions
}

function useSuggestion(suggestion) {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.value = suggestion;
        messageInput.focus();
        
        // Enable send button
        const sendButton = document.getElementById('sendButton');
        if (sendButton) sendButton.disabled = false;
        
        // Remove the Annie suggestion message
        if (activeConversation) {
            activeConversation.messages = activeConversation.messages.filter(msg => msg.type !== 'annie');
            renderMessages();
            saveConversations();
        }
    }
}

function requestAnnieHelp() {
    if (!activeConversation) return;
    
    showNotification("Annie is analyzing your conversation...", "info");
    
    setTimeout(() => {
        updateAnnieSuggestions();
        showNotification("Annie has provided some response suggestions!", "success");
    }, 1000);
}

// ===== SETTINGS & PREFERENCES =====
function toggleAnnieSettings() {
    console.log('⚙️ Opening Annie settings...');
    document.getElementById('annieSettingsModal').classList.add('active');
}

function closeAnnieSettingsModal() {
    document.getElementById('annieSettingsModal').classList.remove('active');
}

function applyAnnieSettingsToUI() {
    // Assistance level
    document.querySelector(`input[name="assistanceLevel"][value="${annieSettings.assistanceLevel}"]`).checked = true;
    
    // Checkboxes
    document.getElementById('autoCategorize').checked = annieSettings.autoCategorize;
    document.getElementById('suggestResponses').checked = annieSettings.suggestResponses;
    document.getElementById('priorityDetection').checked = annieSettings.priorityDetection;
    document.getElementById('learnFromUsage').checked = annieSettings.learnFromUsage;
    document.getElementById('shareTrainingData').checked = annieSettings.shareTrainingData;
    document.getElementById('saveMessageHistory').checked = annieSettings.saveMessageHistory;
    document.getElementById('annieNotifications').checked = annieSettings.annieNotifications;
    document.getElementById('smartReminders').checked = annieSettings.smartReminders;
}

function saveAnnieSettings() {
    console.log('💾 Saving Annie settings...');
    
    // Get assistance level
    const assistanceLevel = document.querySelector('input[name="assistanceLevel"]:checked').value;
    annieSettings.assistanceLevel = assistanceLevel;
    
    // Get checkboxes
    annieSettings.autoCategorize = document.getElementById('autoCategorize').checked;
    annieSettings.suggestResponses = document.getElementById('suggestResponses').checked;
    annieSettings.priorityDetection = document.getElementById('priorityDetection').checked;
    annieSettings.learnFromUsage = document.getElementById('learnFromUsage').checked;
    annieSettings.shareTrainingData = document.getElementById('shareTrainingData').checked;
    annieSettings.saveMessageHistory = document.getElementById('saveMessageHistory').checked;
    annieSettings.annieNotifications = document.getElementById('annieNotifications').checked;
    annieSettings.smartReminders = document.getElementById('smartReminders').checked;
    
    // Save to localStorage
    localStorage.setItem('domihive_annie_settings', JSON.stringify(annieSettings));
    
    closeAnnieSettingsModal();
    showNotification("Annie settings saved successfully!", "success");
    
    // Apply settings immediately
    if (!annieSettings.suggestResponses && activeConversation) {
        // Remove Annie suggestions if disabled
        activeConversation.messages = activeConversation.messages.filter(msg => msg.type !== 'annie');
        renderMessages();
        saveConversations();
    }
}

function resetAnnieSettings() {
    if (confirm("Are you sure you want to reset Annie settings to defaults?")) {
        annieSettings = {
            assistanceLevel: 'standard',
            autoCategorize: true,
            suggestResponses: true,
            priorityDetection: true,
            learnFromUsage: false,
            shareTrainingData: false,
            saveMessageHistory: true,
            annieNotifications: true,
            smartReminders: true
        };
        
        applyAnnieSettingsToUI();
        showNotification("Annie settings reset to defaults", "info");
    }
}

// ===== CONVERSATION ACTIONS =====
function toggleStar(conversationId, button) {
    event.stopPropagation();
    
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation) return;
    
    conversation.starred = !conversation.starred;
    
    // Update button appearance
    const icon = button.querySelector('i');
    if (conversation.starred) {
        button.classList.add('starred');
        icon.className = 'fas fa-star';
    } else {
        button.classList.remove('starred');
        icon.className = 'far fa-star';
    }
    
    saveConversations();
    renderConversationsList();
    
    console.log('⭐ Star toggled for:', conversation.partner.name);
}

function markConversationAsRead(conversationId) {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation && conversation.unreadCount > 0) {
        conversation.unreadCount = 0;
        saveConversations();
        renderConversationsList();
    }
}

// ===== NEW CONVERSATION =====
function startNewConversation() {
    console.log('🆕 Starting new conversation...');
    document.getElementById('newConversationModal').classList.add('active');
}

function closeNewConversationModal() {
    document.getElementById('newConversationModal').classList.remove('active');
}

function createNewConversation() {
    const recipientSelect = document.getElementById('recipientSelect');
    const subjectInput = document.getElementById('conversationSubject');
    const categorySelect = document.getElementById('conversationCategory');
    const initialMessage = document.getElementById('initialMessage');
    const urgentCheckbox = document.getElementById('urgentMessage');
    
    if (!recipientSelect.value || recipientSelect.value === 'new_contact') {
        showNotification("Please select a recipient", "error");
        return;
    }
    
    if (!subjectInput.value.trim()) {
        showNotification("Please enter a subject", "error");
        return;
    }
    
    if (!initialMessage.value.trim()) {
        showNotification("Please enter an initial message", "error");
        return;
    }
    
    // Create new conversation
    const newConversation = {
        id: 'conv_' + Date.now(),
        partner: getRecipientInfo(recipientSelect.value),
        messages: [
            {
                id: 'msg_' + Date.now(),
                type: 'sent',
                content: initialMessage.value.trim(),
                timestamp: new Date().toISOString(),
                read: false
            }
        ],
        unreadCount: 0,
        starred: false,
        tags: [categorySelect.value].concat(urgentCheckbox.checked ? ['urgent'] : []),
        category: categorySelect.value,
        lastActivity: new Date().toISOString(),
        subject: subjectInput.value.trim()
    };
    
    conversations.unshift(newConversation);
    saveConversations();
    
    // Close modal and reset form
    closeNewConversationModal();
    document.querySelector('.new-conversation-form').reset();
    
    // Open the new conversation
    openConversation(newConversation.id);
    
    // Update conversations list
    renderConversationsList();
    
    showNotification("New conversation started!", "success");
    console.log('✅ New conversation created:', newConversation.partner.name);
}

function getRecipientInfo(recipientId) {
    const recipients = {
        'manager_1': {
            name: 'Sarah Johnson',
            role: 'Property Manager - Ikoyi Apartments',
            avatar: 'user-tie',
            status: 'online'
        },
        'support_1': {
            name: 'DomiHive Support',
            role: 'Customer Support',
            avatar: 'headset',
            status: 'online'
        },
        'maintenance_1': {
            name: 'Elite Maintenance Services',
            role: 'Maintenance Contractor',
            avatar: 'tools',
            status: 'offline'
        },
        'security_1': {
            name: 'Security Department',
            role: 'Building Security',
            avatar: 'user-shield',
            status: 'online'
        }
    };
    
    return recipients[recipientId] || {
        name: 'New Contact',
        role: 'Unknown',
        avatar: 'user',
        status: 'offline'
    };
}

// ===== ATTACHMENT HANDLING =====
function toggleAttachmentMenu() {
    const menu = document.getElementById('attachmentMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function attachFile(type) {
    showNotification(`Opening ${type} attachment dialog...`, "info");
    
    // Simulate file attachment
    setTimeout(() => {
        if (activeConversation) {
            const attachment = {
                name: `${type}_${Date.now()}.${type === 'image' ? 'jpg' : type === 'document' ? 'pdf' : 'file'}`,
                size: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)} MB`,
                type: type === 'image' ? 'image' : type === 'document' ? 'pdf' : 'file'
            };
            
            const messageWithAttachment = {
                id: 'msg_' + Date.now(),
                type: 'sent',
                content: `I'm attaching a ${type} file for your reference.`,
                timestamp: new Date().toISOString(),
                read: false,
                attachment: attachment
            };
            
            activeConversation.messages.push(messageWithAttachment);
            activeConversation.lastActivity = new Date().toISOString();
            
            renderMessages();
            saveConversations();
            
            // Hide attachment menu
            toggleAttachmentMenu();
            
            showNotification("File attached successfully!", "success");
        }
    }, 1000);
}

function downloadAttachment(filename) {
    showNotification(`Downloading ${filename}...`, "info");
    console.log('📥 Downloading attachment:', filename);
    
    // Simulate download
    setTimeout(() => {
        showNotification("Download completed!", "success");
    }, 1500);
}

// ===== QUICK ACTIONS =====
function quickAction(action) {
    const templates = {
        payment: "Hi, I have a question about my recent payment. Could you please provide more details?",
        maintenance: "I'd like to request maintenance service for the following issue: [please describe the issue]",
        document: "Could you please share the following document with me: [specify document name]"
    };
    
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.value = templates[action] || "I have a question regarding...";
        messageInput.focus();
        
        // Enable send button
        const sendButton = document.getElementById('sendButton');
        if (sendButton) sendButton.disabled = false;
        
        showNotification(`Quick action template inserted for ${action}`, "info");
    }
}

function insertQuickTemplate() {
    const templates = [
        "Thanks for your help with this matter.",
        "I appreciate the quick response.",
        "Could you please provide more information?",
        "When can I expect an update on this?",
        "Please let me know if you need any additional details from my side."
    ];
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const messageInput = document.getElementById('messageInput');
    
    if (messageInput) {
        messageInput.value = randomTemplate;
        messageInput.focus();
        
        const sendButton = document.getElementById('sendButton');
        if (sendButton) sendButton.disabled = false;
        
        showNotification("Quick template inserted!", "info");
    }
}

function scheduleMessage() {
    showNotification("Message scheduling feature coming soon!", "info");
}

// ===== UTILITY FUNCTIONS =====
function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function formatTagName(tag) {
    return tag.charAt(0).toUpperCase() + tag.slice(1);
}

function showNotification(message, type = 'info') {
    // Remove existing notification
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

// ===== GLOBAL FUNCTIONS =====
window.toggleAnnieHelp = function() {
    showNotification("Annie AI help is already active! Try asking Annie for suggestions.", "info");
};

window.trainAnnie = function() {
    showNotification("Annie training interface will be available in the admin dashboard", "info");
};

window.viewAnnieInsights = function() {
    showNotification("Annie insights and analytics coming soon!", "info");
};

window.viewPropertyDetails = function() {
    showNotification("Opening property details...", "info");
};

window.scheduleMaintenance = function() {
    showNotification("Opening maintenance scheduling...", "info");
};

window.requestDocument = function() {
    showNotification("Opening document request form...", "info");
};

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
        
        .empty-conversations {
            text-align: center;
            padding: 3rem 2rem;
            color: var(--gray);
        }
        
        .empty-conversations i {
            font-size: 2.5rem;
            color: var(--gray-light);
            margin-bottom: 1rem;
        }
        
        .empty-conversations p {
            color: var(--primary-color);
            margin-bottom: 0.5rem;
            font-weight: 600;
        }
        
        .empty-conversations small {
            font-size: 0.8rem;
        }
    `;
    document.head.appendChild(style);
}

console.log('🎉 Messages Content JavaScript Loaded!');