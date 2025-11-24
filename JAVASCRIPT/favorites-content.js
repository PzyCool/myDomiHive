// favorites-content.js - Complete Favorites Management System - FIXED

// Global variables
let favorites = [];
let currentCategory = 'all';
let currentSort = 'recent';
let searchQuery = '';
let comparisonSelection = new Set();
let currentFavoriteForCategory = null;

// SPA Integration
window.spaFavoritesInit = function() {
    console.log('🎯 SPA: Initializing Favorites Content');
    initializeFavoritesSystem();
};

// Auto-initialize if loaded directly
if (window.location.pathname.includes('favorites-content.html')) {
    document.addEventListener('DOMContentLoaded', initializeFavoritesSystem);
} else {
    // SPA environment - check if we're on the page and initialize
    setTimeout(function() {
        if (document.querySelector('.favorites-content')) {
            console.log('🔍 Detected SPA environment - auto-initializing favorites');
            initializeFavoritesSystem();
        }
    }, 500);
}

function initializeFavoritesSystem() {
    console.log('💖 Initializing Favorites System...');
    
    // Load favorites data
    loadFavoritesData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Render the favorites grid
    renderFavoritesGrid();
    
    // Update statistics
    updateStatistics();
    
    console.log('✅ Favorites system ready');
}

function loadFavoritesData() {
    console.log('📦 Loading favorites data...');
    
    // Try to load from localStorage first
    const storedFavorites = localStorage.getItem('domihive_user_favorites');
    
    if (storedFavorites && JSON.parse(storedFavorites).length > 0) {
        favorites = JSON.parse(storedFavorites);
        console.log('✅ Loaded favorites from storage:', favorites.length);
    } else {
        console.log('📝 No favorites found, creating demo favorites...');
        createDemoFavorites();
    }
}

function createDemoFavorites() {
    console.log('🏗️ Creating demo favorites for all categories...');
    
    const demoFavorites = [
        // TOP PICKS (4 properties)
        {
            id: 'fav_1',
            propertyId: 'prop_1',
            title: 'Luxury 3-Bedroom Apartment in Ikoyi',
            location: 'Ikoyi, Lagos Island',
            price: 4500000,
            pricePeriod: 'year',
            image: '/ASSECT/3d-rendering-modern-dining-room-living-room-with-luxury-decor (1).jpg',
            bedrooms: 3,
            bathrooms: 3,
            size: '180 sqm',
            type: 'Apartment',
            addedDate: new Date('2024-01-15').toISOString(),
            features: ['Swimming Pool', '24/7 Security', 'Modern Kitchen', 'Balcony'],
            description: 'Stunning 3-bedroom apartment with luxurious finishes in the heart of Ikoyi.'
        },
        {
            id: 'fav_2',
            propertyId: 'prop_2',
            title: 'Modern 4-Bedroom Duplex',
            location: 'Victoria Island, Lagos',
            price: 28000000,
            pricePeriod: 'year',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
            bedrooms: 4,
            bathrooms: 4,
            size: '320 sqm',
            type: 'Duplex',
            addedDate: new Date('2024-01-10').toISOString(),
            features: ['Private Garden', 'Smart Home', '3 Car Parking', 'Maid Room'],
            description: 'Spacious modern duplex with premium amenities and excellent location.'
        },
        {
            id: 'fav_3',
            propertyId: 'prop_3',
            title: 'Executive Penthouse with City View',
            location: 'Lekki Phase 1, Lagos',
            price: 65000000,
            pricePeriod: 'year',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
            bedrooms: 3,
            bathrooms: 3,
            size: '280 sqm',
            type: 'Penthouse',
            addedDate: new Date('2024-01-08').toISOString(),
            features: ['Panoramic Views', 'Private Elevator', 'Roof Terrace', 'Wine Cellar'],
            description: 'Luxurious penthouse offering breathtaking city views and exclusive amenities.'
        },
        {
            id: 'fav_4',
            propertyId: 'prop_4',
            title: 'Contemporary 2-Bedroom Condo',
            location: 'Yaba, Lagos',
            price: 1800000,
            pricePeriod: 'year',
            image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop',
            bedrooms: 2,
            bathrooms: 2,
            size: '120 sqm',
            type: 'Condo',
            category: 'top-picks',
            addedDate: new Date('2024-01-05').toISOString(),
            features: ['Gym', 'Concierge', 'Secure Parking', 'High-Speed Internet'],
            description: 'Modern condo perfect for young professionals in a vibrant neighborhood.'
        },

        // MAYBE CATEGORY (3 properties)
        {
            id: 'fav_5',
            propertyId: 'prop_5',
            title: 'Cozy Studio Apartment',
            location: 'Surulere, Lagos',
            price: 800000,
            pricePeriod: 'year',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
            bedrooms: 1,
            bathrooms: 1,
            size: '45 sqm',
            type: 'Studio',
            category: 'maybe',
            addedDate: new Date('2024-01-12').toISOString(),
            features: ['Fully Furnished', '24/7 Security', 'Near Market', 'Affordable'],
            description: 'Compact and affordable studio apartment in a convenient location.'
        },
        {
            id: 'fav_6',
            propertyId: 'prop_6',
            title: 'Spacious Family House',
            location: 'Ikeja GRA, Lagos',
            price: 35000000,
            pricePeriod: 'year',
            image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop',
            bedrooms: 5,
            bathrooms: 4,
            size: '450 sqm',
            type: 'Detached House',
            category: 'maybe',
            addedDate: new Date('2024-01-07').toISOString(),
            features: ['Large Garden', 'Children Playground', '4 Car Parking', 'Quiet Street'],
            description: 'Perfect family home with ample space and privacy in a premium neighborhood.'
        },
        {
            id: 'fav_7',
            propertyId: 'prop_7',
            title: 'Modern Townhouse',
            location: 'Lekki Phase 2, Lagos',
            price: 22000000,
            pricePeriod: 'year',
            image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop',
            bedrooms: 3,
            bathrooms: 3,
            size: '200 sqm',
            type: 'Townhouse',
            category: 'maybe',
            addedDate: new Date('2024-01-03').toISOString(),
            features: ['Private Entrance', 'Small Garden', '2 Car Parking', 'Modern Design'],
            description: 'Contemporary townhouse offering modern living in a developing area.'
        },

        // DREAM HOMES CATEGORY (3 properties)
        {
            id: 'fav_8',
            propertyId: 'prop_8',
            title: 'Luxury Waterfront Villa',
            location: 'Banana Island, Lagos',
            price: 120000000,
            pricePeriod: 'year',
            image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&h=400&fit=crop',
            bedrooms: 6,
            bathrooms: 6,
            size: '800 sqm',
            type: 'Villa',
            category: 'dream-homes',
            addedDate: new Date('2024-01-01').toISOString(),
            features: ['Private Beach', 'Infinity Pool', 'Home Theater', 'Helipad'],
            description: 'Ultra-luxurious waterfront villa with exclusive amenities and privacy.'
        },
        {
            id: 'fav_9',
            propertyId: 'prop_9',
            title: 'Historic Colonial Mansion',
            location: 'Ikoyi, Lagos',
            price: 85000000,
            pricePeriod: 'year',
            image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=600&h=400&fit=crop',
            bedrooms: 5,
            bathrooms: 5,
            size: '600 sqm',
            type: 'Mansion',
            category: 'dream-homes',
            addedDate: new Date('2024-01-02').toISOString(),
            features: ['Historical Architecture', 'Large Grounds', 'Staff Quarters', 'Classic Design'],
            description: 'Beautifully preserved colonial mansion with character and grandeur.'
        },
        {
            id: 'fav_10',
            propertyId: 'prop_10',
            title: 'Modern Architectural Masterpiece',
            location: 'Victoria Island, Lagos',
            price: 95000000,
            pricePeriod: 'year',
            image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop',
            bedrooms: 4,
            bathrooms: 4,
            size: '550 sqm',
            type: 'Architectural',
            category: 'dream-homes',
            addedDate: new Date('2024-01-04').toISOString(),
            features: ['Smart Home System', 'Rooftop Terrace', 'Home Gym', 'Wine Storage'],
            description: 'Architectural marvel featuring cutting-edge design and technology.'
        }
    ];

    favorites = demoFavorites;
    saveFavorites();
    console.log('✅ Created', demoFavorites.length, 'demo favorites across all categories');
}

function saveFavorites() {
    localStorage.setItem('domihive_user_favorites', JSON.stringify(favorites));
}

function initializeEventListeners() {
    console.log('🎯 Initializing event listeners...');
    
    // Category filter buttons
    document.querySelectorAll('.category-filter').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            setActiveCategory(category, this);
        });
    });
    
    // Search input
    const searchInput = document.getElementById('favoritesSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchQuery = this.value.toLowerCase();
            renderFavoritesGrid();
            updateStatistics();
        });
    }
    
    // Sort dropdown
    const sortSelect = document.getElementById('sortFavorites');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            renderFavoritesGrid();
        });
    }
    
    // Comparison bar actions
    const clearSelectionBtn = document.getElementById('clearSelection');
    const comparePropertiesBtn = document.getElementById('compareProperties');
    
    if (clearSelectionBtn) {
        clearSelectionBtn.addEventListener('click', clearComparisonSelection);
    }
    
    if (comparePropertiesBtn) {
        comparePropertiesBtn.addEventListener('click', openComparisonModal);
    }
    
    // Modal close buttons
    const closeComparisonModal = document.getElementById('closeComparisonModal');
    const closeCategoryModal = document.getElementById('closeCategoryModal');
    
    if (closeComparisonModal) {
        closeComparisonModal.addEventListener('click', closeModals);
    }
    
    if (closeCategoryModal) {
        closeCategoryModal.addEventListener('click', closeModals);
    }
    
    // Category options
    document.querySelectorAll('.category-option').forEach(option => {
        option.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            changePropertyCategory(category);
        });
    });
    
    // Close modals when clicking outside
    document.addEventListener('click', function(event) {
        const comparisonModal = document.getElementById('comparisonModal');
        const categoryModal = document.getElementById('categoryModal');
        
        if (comparisonModal && comparisonModal.classList.contains('active') && 
            event.target === comparisonModal) {
            closeModals();
        }
        
        if (categoryModal && categoryModal.classList.contains('active') && 
            event.target === categoryModal) {
            closeModals();
        }
    });
    
    console.log('✅ Event listeners initialized');
}

function setActiveCategory(category, clickedButton) {
    console.log('🔍 Setting active category:', category);
    
    currentCategory = category;
    
    // Update active category button
    document.querySelectorAll('.category-filter').forEach(btn => {
        btn.classList.remove('active');
    });
    clickedButton.classList.add('active');
    
    // Re-render favorites grid
    renderFavoritesGrid();
    updateStatistics();
}

function renderFavoritesGrid() {
    console.log('🎨 Rendering favorites grid...');
    
    const container = document.getElementById('propertiesGrid');
    const emptyState = document.getElementById('emptyState');
    const noResultsState = document.getElementById('noResultsState');
    
    if (!container) {
        console.error('❌ Properties grid container not found!');
        return;
    }
    
    // Filter favorites based on current category and search
    let filteredFavorites = filterFavorites();
    
    // Sort favorites
    filteredFavorites = sortFavorites(filteredFavorites);
    
    // Show/hide empty states
    if (filteredFavorites.length === 0) {
        if (searchQuery || currentCategory !== 'all') {
            // No results for search/filter
            emptyState.classList.remove('visible');
            noResultsState.classList.add('visible');
            container.innerHTML = '';
        } else {
            // No favorites at all
            emptyState.classList.add('visible');
            noResultsState.classList.remove('visible');
            container.innerHTML = '';
        }
        console.log('📭 No favorites to display');
        return;
    }
    
    // Hide empty states
    emptyState.classList.remove('visible');
    noResultsState.classList.remove('visible');
    
    // Create property cards
    const propertiesHTML = filteredFavorites.map(favorite => {
        const isSelected = comparisonSelection.has(favorite.id);
        const badgeClass = getCategoryBadgeClass(favorite.category);
        const badgeText = getCategoryBadgeText(favorite.category);
        
        return `
            <div class="property-card ${isSelected ? 'selected' : ''}" data-favorite-id="${favorite.id}">
                <div class="property-image">
                    <img src="${favorite.image}" alt="${favorite.title}" onerror="this.src='/ASSECT/placeholder-property.jpg'">
                    <div class="property-badges">
                        <span class="property-badge ${badgeClass}">${badgeText}</span>
                        ${isSelected ? '<span class="property-badge badge-selected"><i class="fas fa-check"></i> Selected</span>' : ''}
                    </div>
                    <button class="favorite-toggle" onclick="removeFromFavorites('${favorite.id}')">
                        <i class="fas fa-heart"></i>
                    </button>
                    <div class="compare-checkbox">
                        <input type="checkbox" ${isSelected ? 'checked' : ''} 
                               onchange="toggleComparisonSelection('${favorite.id}', this.checked, event)">
                    </div>
                </div>
                
                <div class="property-details">
                    <h3 class="property-title">${favorite.title}</h3>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${favorite.location}
                    </div>
                    
                    <div class="property-price">
                        ₦${favorite.price.toLocaleString()}/${favorite.pricePeriod}
                    </div>
                    
                    <div class="property-features">
                        <div class="feature">
                            <i class="fas fa-bed"></i>
                            <span>${favorite.bedrooms} Bedrooms</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-bath"></i>
                            <span>${favorite.bathrooms} Bathrooms</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-ruler-combined"></i>
                            <span>${favorite.size}</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-layer-group"></i>
                            <span>${favorite.type}</span>
                        </div>
                    </div>

                    <div class="property-actions">
                        <button class="btn-view-details" onclick="viewPropertyDetails('${favorite.propertyId}')">
                            <i class="fas fa-eye"></i>
                            View Details
                        </button>
                        <button class="btn-category" onclick="openCategoryModal('${favorite.id}')">
                            <i class="fas fa-tag"></i>
                            Category
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = propertiesHTML;
    console.log('✅ Rendered', filteredFavorites.length, 'favorite properties');
}

function filterFavorites() {
    let filtered = favorites;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(fav => fav.category === currentCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
        filtered = filtered.filter(fav => 
            fav.title.toLowerCase().includes(searchQuery) ||
            fav.location.toLowerCase().includes(searchQuery) ||
            fav.description.toLowerCase().includes(searchQuery)
        );
    }
    
    return filtered;
}

function sortFavorites(favoritesList) {
    switch(currentSort) {
        case 'price-low':
            return [...favoritesList].sort((a, b) => a.price - b.price);
        case 'price-high':
            return [...favoritesList].sort((a, b) => b.price - a.price);
        case 'size':
            return [...favoritesList].sort((a, b) => {
                const sizeA = parseInt(a.size);
                const sizeB = parseInt(b.size);
                return sizeB - sizeA;
            });
        case 'recent':
        default:
            return [...favoritesList].sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
    }
}

function getCategoryBadgeClass(category) {
    const classes = {
        'top-picks': 'badge-top-picks',
        'maybe': 'badge-maybe',
        'dream-homes': 'badge-dream-homes'
    };
    return classes[category] || 'badge-category';
}

function getCategoryBadgeText(category) {
    const texts = {
        'top-picks': 'Top Pick',
        'maybe': 'Maybe',
        'dream-homes': 'Dream Home'
    };
    return texts[category] || 'Favorite';
}

function updateStatistics() {
    console.log('📊 Updating statistics...');
    
    const totalFavorites = document.getElementById('totalFavorites');
    const topPicksCount = document.getElementById('topPicksCount');
    const comparisonCount = document.getElementById('comparisonCount');
    
    if (totalFavorites) totalFavorites.textContent = favorites.length;
    if (topPicksCount) {
        const topPicks = favorites.filter(fav => fav.category === 'top-picks').length;
        topPicksCount.textContent = topPicks;
    }
    if (comparisonCount) comparisonCount.textContent = comparisonSelection.size;
    
    updateComparisonUI();
}

// FIX 1: Fixed checkbox functionality
window.toggleComparisonSelection = function(favoriteId, isSelected, event) {
    if (event) {
        event.stopPropagation(); // Prevent event bubbling
    }
    
    console.log('⚖️ Toggle comparison selection:', favoriteId, isSelected);
    
    if (isSelected) {
        if (comparisonSelection.size >= 5) {
            showNotification('Maximum 5 properties can be compared', 'error');
            // Uncheck the checkbox
            if (event && event.target) {
                event.target.checked = false;
            }
            return false;
        }
        comparisonSelection.add(favoriteId);
        showNotification('Property added to comparison', 'success');
    } else {
        comparisonSelection.delete(favoriteId);
        showNotification('Property removed from comparison', 'info');
    }
    
    // Update the UI
    updateComparisonUI();
    renderFavoritesGrid(); // Re-render to update visual states
    return true;
};

function updateComparisonUI() {
    const comparisonBar = document.getElementById('comparisonBar');
    const compareBtn = document.getElementById('compareProperties');
    const selectedCount = document.getElementById('selectedCount');
    
    if (selectedCount) selectedCount.textContent = comparisonSelection.size;
    
    // Update comparison bar visibility and button state
    if (comparisonBar) {
        if (comparisonSelection.size > 0) {
            comparisonBar.classList.add('visible');
        } else {
            comparisonBar.classList.remove('visible');
        }
    }
    
    if (compareBtn) {
        compareBtn.disabled = comparisonSelection.size < 2 || comparisonSelection.size > 5;
        compareBtn.textContent = `Compare Properties (${comparisonSelection.size}/5)`;
    }
}

// FIX 2: Category management for users
window.openCategoryModal = function(favoriteId) {
    console.log('🏷️ Opening category modal for:', favoriteId);
    
    currentFavoriteForCategory = favoriteId;
    const modal = document.getElementById('categoryModal');
    if (modal) {
        modal.classList.add('active');
    }
};

function changePropertyCategory(category) {
    if (!currentFavoriteForCategory) return;
    
    const favorite = favorites.find(fav => fav.id === currentFavoriteForCategory);
    if (favorite) {
        const oldCategory = favorite.category;
        favorite.category = category;
        saveFavorites();
        renderFavoritesGrid();
        updateStatistics();
        
        const categoryNames = {
            'top-picks': 'Top Picks',
            'maybe': 'Maybe', 
            'dream-homes': 'Dream Homes'
        };
        
        showNotification(`Moved to ${categoryNames[category]}`, 'success');
    }
    
    closeModals();
}

// Global functions for HTML onclick events
window.removeFromFavorites = function(favoriteId) {
    console.log('💔 Removing from favorites:', favoriteId);
    
    favorites = favorites.filter(fav => fav.id !== favoriteId);
    comparisonSelection.delete(favoriteId);
    
    saveFavorites();
    renderFavoritesGrid();
    updateStatistics();
    
    showNotification('Property removed from favorites', 'success');
};

window.viewPropertyDetails = function(propertyId) {
    console.log('👀 Viewing property details:', propertyId);
    
    if (window.spa && typeof window.spa.showPropertyDetails === 'function') {
        window.spa.showPropertyDetails(propertyId);
    } else {
        // Fallback for direct navigation
        window.location.href = `/Pages/property-details-rent.html?id=${propertyId}`;
    }
};

function clearComparisonSelection() {
    console.log('🧹 Clearing comparison selection');
    
    comparisonSelection.clear();
    renderFavoritesGrid();
    updateStatistics();
    showNotification('Comparison selection cleared', 'info');
}

function openComparisonModal() {
    console.log('⚖️ Opening comparison modal');
    
    if (comparisonSelection.size < 2 || comparisonSelection.size > 5) {
        showNotification('Please select 2-5 properties to compare', 'error');
        return;
    }
    
    const modal = document.getElementById('comparisonModal');
    const container = document.getElementById('comparisonContainer');
    
    if (modal && container) {
        // Get selected favorites
        const selectedFavorites = favorites.filter(fav => comparisonSelection.has(fav.id));
        
        // Generate comparison content
        container.innerHTML = generateComparisonContent(selectedFavorites);
        
        modal.classList.add('active');
    }
}

function generateComparisonContent(selectedFavorites) {
    if (selectedFavorites.length === 0) return '';
    
    return `
        <div class="comparison-grid">
            <div class="comparison-properties">
                ${selectedFavorites.map(fav => `
                    <div class="comparison-property">
                        <div class="comparison-property-header">
                            <div class="comparison-property-title">${fav.title}</div>
                            <div class="comparison-property-price">₦${fav.price.toLocaleString()}/${fav.pricePeriod}</div>
                        </div>
                        <div class="property-image" style="height: 200px;">
                            <img src="${fav.image}" alt="${fav.title}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="comparison-details">
                <!-- Basic Details -->
                <div class="comparison-section">
                    <h4><i class="fas fa-info-circle"></i> Basic Details</h4>
                    <div class="comparison-features">
                        ${generateComparisonFeature('Location', selectedFavorites.map(fav => fav.location))}
                        ${generateComparisonFeature('Property Type', selectedFavorites.map(fav => fav.type))}
                        ${generateComparisonFeature('Size', selectedFavorites.map(fav => fav.size))}
                        ${generateComparisonFeature('Bedrooms', selectedFavorites.map(fav => fav.bedrooms))}
                        ${generateComparisonFeature('Bathrooms', selectedFavorites.map(fav => fav.bathrooms))}
                    </div>
                </div>
                
                <!-- Pricing -->
                <div class="comparison-section">
                    <h4><i class="fas fa-tag"></i> Pricing</h4>
                    <div class="comparison-features">
                        ${generateComparisonFeature('Annual Rent', selectedFavorites.map(fav => `₦${fav.price.toLocaleString()}`))}
                        ${generateComparisonFeature('Monthly Equivalent', selectedFavorites.map(fav => `₦${Math.round(fav.price / 12).toLocaleString()}`))}
                    </div>
                </div>
                
                <!-- Features -->
                <div class="comparison-section">
                    <h4><i class="fas fa-star"></i> Key Features</h4>
                    <div class="comparison-features">
                        ${selectedFavorites[0].features.map((_, index) => 
                            generateComparisonFeature(
                                `Feature ${index + 1}`,
                                selectedFavorites.map(fav => fav.features[index] || 'Not Available')
                            )
                        ).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateComparisonFeature(label, values) {
    return `
        <div class="comparison-feature">
            <span class="feature-label">${label}</span>
            <div class="feature-values">
                ${values.map(value => `<span class="feature-value">${value}</span>`).join(' vs ')}
            </div>
        </div>
    `;
}

function closeModals() {
    document.querySelectorAll('.comparison-modal, .category-modal').forEach(modal => {
        modal.classList.remove('active');
    });
    currentFavoriteForCategory = null;
}

function clearFilters() {
    searchQuery = '';
    currentCategory = 'all';
    
    const searchInput = document.getElementById('favoritesSearch');
    const categoryButtons = document.querySelectorAll('.category-filter');
    
    if (searchInput) searchInput.value = '';
    
    categoryButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === 'all') {
            btn.classList.add('active');
        }
    });
    
    renderFavoritesGrid();
    updateStatistics();
}

// Utility function for showing notifications
function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.global-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `global-notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

console.log('💖 Favorites Content JavaScript Loaded!');