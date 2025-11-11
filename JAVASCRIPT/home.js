// ===== NAVIGATION AND SCROLL FUNCTIONALITY =====
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('section[id]');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    // Mobile menu toggle
    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinksContainer.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Smooth scroll to section
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                if (navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }

                // Smooth scroll to section
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });

    // Update active nav link on scroll
    function updateActiveNavOnScroll() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        if (currentSection) {
            updateActiveNavLink(currentSection);
        }
    }

    // Update active nav link
    function updateActiveNavLink(sectionId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });
    }

    // Listen for scroll events
    window.addEventListener('scroll', updateActiveNavOnScroll);

    // Initial active section check
    updateActiveNavOnScroll();
}

// ===== PROPERTIES FUNCTIONALITY =====
let allProperties = [];
let filteredProperties = [];
let currentPage = 1;
const propertiesPerPage = 12;

class PropertyStorageSystem {
    constructor() {
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem('domihive_property_interests')) {
            const initialData = {
                viewed_properties: [],
                saved_properties: [],
                recent_searches: []
            };
            localStorage.setItem('domihive_property_interests', JSON.stringify(initialData));
        }
    }

    storePropertyForOverview(property, action = 'viewed') {
        try {
            const storage = this.getStorage();
            const timestamp = new Date().toISOString();
            
            const propertyData = {
                property: property,
                action: action,
                timestamp: timestamp,
                stored_at: new Date().toLocaleString(),
                ready_for_dashboard: true
            };

            storage.viewed_properties.unshift(propertyData);
            
            if (storage.viewed_properties.length > 10) {
                storage.viewed_properties = storage.viewed_properties.slice(0, 10);
            }

            this.saveStorage(storage);
            
            console.log('💾 Property stored for overview:', property.id);
            return true;
            
        } catch (error) {
            console.error('❌ Error storing property:', error);
            return false;
        }
    }

    storeFavoriteProperty(property) {
        return this.storePropertyForOverview(property, 'saved');
    }

    getStorage() {
        return JSON.parse(localStorage.getItem('domihive_property_interests'));
    }

    saveStorage(data) {
        localStorage.setItem('domihive_property_interests', JSON.stringify(data));
    }

    getRecentProperties(limit = 5) {
        const storage = this.getStorage();
        return storage.viewed_properties.slice(0, limit);
    }
}

let propertyStorage;

function initPropertiesGrid() {
    console.log('🏠 Initializing Properties Grid...');
    
    propertyStorage = new PropertyStorageSystem();
    generateSampleProperties();
    initTabFiltering();
    applySavedSearchCriteria();
    displayProperties();
    initPropertiesEventListeners();
    
    console.log(`✅ Loaded ${allProperties.length} properties`);
}

function generateSampleProperties() {
    const propertyTypes = ['apartment', 'house', 'duplex', 'studio', 'shared'];
    const locations = {
        mainland: [
            'Ikeja GRA', 'Yaba', 'Surulere', 'Ojota', 'Oshodi', 'Ilupeju',
            'Egbeda', 'Maryland', 'Ikorodu', 'Agege', 'Festac Town', 'Gbagada',
            'Mushin', 'Mende', 'Ogba', 'Alausa', 'Anthony', 'Palmgroove'
        ],
        island: [
            'Ikoyi', 'Lekki Phase 1', 'Victoria Island', 'Ajah', 'Sangotedo',
            'Chevron', 'Oniru', 'Banana Island', 'Lekki Phase 2', 'VGC'
        ]
    };
    
    const amenitiesList = ['wifi', 'parking', 'security', 'pool', 'gym', 'ac', 'generator', 'water'];
    const propertyImages = [
        'https://images.unsplash.com/photo-1545323157-f6f63c0d66a7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564019471349-34e8a875c5c8?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448078-8b7a9c7b7c7c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop'
    ];
    
    for (let i = 1; i <= 84; i++) {
        const isMainland = Math.random() > 0.5;
        const area = isMainland ? 'mainland' : 'island';
        const locationArray = locations[area];
        const randomLocation = locationArray[Math.floor(Math.random() * locationArray.length)];
        
        let propertyCategory = 'rent';
        if (i > 60) propertyCategory = 'buy';
        else if (i > 45) propertyCategory = 'commercial';
        else if (i > 30) propertyCategory = 'shortlet';
        
        const img1 = propertyImages[Math.floor(Math.random() * propertyImages.length)];
        const img2 = propertyImages[Math.floor(Math.random() * propertyImages.length)];
        const img3 = propertyImages[Math.floor(Math.random() * propertyImages.length)];
        
        const property = {
            id: i,
            title: `${getRandomPropertyType()} in ${randomLocation}`,
            price: getRandomPrice(area, propertyCategory),
            location: randomLocation,
            area: area,
            category: propertyCategory,
            type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
            bedrooms: Math.floor(Math.random() * 4) + 1,
            bathrooms: Math.floor(Math.random() * 3) + 1,
            size: `${Math.floor(Math.random() * 200) + 50} sqm`,
            furnishing: ['furnished', 'semi-furnished', 'unfurnished'][Math.floor(Math.random() * 3)],
            amenities: getRandomAmenities(amenitiesList),
            petsAllowed: Math.random() > 0.7,
            age: ['new', 'modern', 'established'][Math.floor(Math.random() * 3)],
            images: [img1, img2, img3],
            isVerified: Math.random() > 0.2,
            isFeatured: Math.random() > 0.8,
            isNew: i > 60,
            description: `Beautiful ${getRandomPropertyType()} located in the heart of ${randomLocation}. This property offers modern amenities and comfortable living spaces.`,
            dateAdded: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
        };
        
        allProperties.push(property);
    }

    filteredProperties = [...allProperties];
}

function getRandomPropertyType() {
    const types = ['Apartment', 'House', 'Duplex', 'Studio', 'Shared Apartment'];
    return types[Math.floor(Math.random() * types.length)];
}

function getRandomPrice(area, category) {
    let basePrice = 400000;
    
    switch(category) {
        case 'buy':
            basePrice = area === 'island' ? 80000000 : 40000000;
            break;
        case 'shortlet':
            basePrice = area === 'island' ? 1200000 : 600000;
            break;
        case 'commercial':
            basePrice = area === 'island' ? 1500000 : 800000;
            break;
        default:
            basePrice = area === 'island' ? 800000 : 400000;
    }
    
    const variation = Math.random() * (basePrice * 0.5);
    return Math.floor(basePrice + variation);
}

function getRandomAmenities(amenitiesList) {
    const count = Math.floor(Math.random() * 4) + 3;
    const shuffled = [...amenitiesList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function initTabFiltering() {
    const tabs = document.querySelectorAll('.tab[data-type]');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Filter properties by category
            const category = this.getAttribute('data-type');
            filterPropertiesByCategory(category);
        });
    });
}

function filterPropertiesByCategory(category) {
    console.log(`🏠 Filtering properties by category: ${category}`);
    
    if (category === 'rent') {
        filteredProperties = allProperties.filter(property => property.category === 'rent');
    } else if (category === 'shortlet') {
        filteredProperties = allProperties.filter(property => property.category === 'shortlet');
    } else if (category === 'commercial') {
        filteredProperties = allProperties.filter(property => property.category === 'commercial');
    } else if (category === 'buy') {
        filteredProperties = allProperties.filter(property => property.category === 'buy');
    }
    
    currentPage = 1;
    sortProperties();
    displayProperties();
    
    console.log(`📊 Filtered to ${filteredProperties.length} ${category} properties`);
}

function applySavedSearchCriteria() {
    const savedSearch = sessionStorage.getItem('domihive_search_criteria');
    if (savedSearch) {
        try {
            const criteria = JSON.parse(savedSearch);
            console.log('🔍 Applying saved search criteria:', criteria);
            
            if (criteria.action) {
                filteredProperties = allProperties.filter(property => 
                    property.category === criteria.action
                );
            }
            
            applyHeroSearch(criteria);
            sessionStorage.removeItem('domihive_search_criteria');
        } catch (error) {
            console.error('Error applying saved search criteria:', error);
        }
    }
}

function initPropertiesEventListeners() {
    const clearFiltersBtn = document.getElementById('clearFilters');
    const sortSelect = document.getElementById('sortSelect');
    const viewBtns = document.querySelectorAll('.view-btn');
    const loadMoreBtn = document.getElementById('loadMore');

    if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearAllFilters);
    if (sortSelect) sortSelect.addEventListener('change', sortProperties);
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadMoreProperties);
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });
}

function applyFilters() {
    console.log('🎯 Applying filters...');
    
    const filters = getCurrentFilters();
    filteredProperties = allProperties.filter(property => {
        return matchesAllFilters(property, filters);
    });
    
    currentPage = 1;
    sortProperties();
    displayProperties();
    
    console.log(`📊 Filtered to ${filteredProperties.length} properties`);
}

function getCurrentFilters() {
    const minPriceValue = parseInt(document.getElementById('minPrice').value) || 0;
    const maxPriceValue = parseInt(document.getElementById('maxPrice').value) || 100000000;
    
    const filters = {
        priceRange: {
            min: minPriceValue,
            max: maxPriceValue
        },
        bedrooms: getCheckedValues('bedrooms'),
        bathrooms: getCheckedValues('bathrooms'),
        propertyType: getCheckedValues('propertyType'),
        furnishing: getCheckedValues('furnishing'),
        amenities: getCheckedValues('amenities'),
        area: getCheckedValues('area'),
        pets: getCheckedValues('pets'),
        age: getCheckedValues('age')
    };
    
    return filters;
}

function getCheckedValues(name) {
    const checked = document.querySelectorAll(`#advancedFiltersModal input[name="${name}"]:checked`);
    return Array.from(checked).map(input => input.value);
}

function matchesAllFilters(property, filters) {
    // Price range
    if (property.price < filters.priceRange.min || property.price > filters.priceRange.max) {
        return false;
    }
    
    // Bedrooms
    if (filters.bedrooms.length > 0) {
        const bedroomValue = property.bedrooms >= 4 ? '4' : property.bedrooms.toString();
        if (!filters.bedrooms.includes(bedroomValue)) return false;
    }
    
    // Bathrooms
    if (filters.bathrooms.length > 0) {
        const bathroomValue = property.bathrooms >= 3 ? '3' : property.bathrooms.toString();
        if (!filters.bathrooms.includes(bathroomValue)) return false;
    }
    
    // Property type
    if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.type)) {
        return false;
    }
    
    // Furnishing
    if (filters.furnishing.length > 0 && !filters.furnishing.includes(property.furnishing)) {
        return false;
    }
    
    // Amenities
    if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
            property.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
    }
    
    // Area
    if (filters.area.length > 0 && !filters.area.includes(property.area)) {
        return false;
    }
    
    // Pets
    if (filters.pets.length > 0) {
        if (filters.pets.includes('allowed') && !property.petsAllowed) return false;
        if (filters.pets.includes('not-allowed') && property.petsAllowed) return false;
    }
    
    // Age
    if (filters.age.length > 0 && !filters.age.includes(property.age)) {
        return false;
    }
    
    return true;
}

function sortProperties() {
    const sortBy = document.getElementById('sortSelect').value;
    
    filteredProperties.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'newest':
                return new Date(b.dateAdded) - new Date(a.dateAdded);
            case 'popular':
                return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
            case 'verified':
                return (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0);
            default:
                return 0;
        }
    });
    
    displayProperties();
}

function displayProperties() {
    const propertiesGrid = document.getElementById('propertiesGrid');
    const resultsCount = document.getElementById('results-count');
    const loadMoreBtn = document.getElementById('loadMore');
    
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const propertiesToShow = filteredProperties.slice(0, endIndex);
    
    propertiesGrid.innerHTML = '';
    
    if (propertiesToShow.length === 0) {
        showNoResultsMessage();
    } else {
        propertiesToShow.forEach(property => {
            const propertyCard = createPropertyCard(property);
            propertiesGrid.appendChild(propertyCard);
        });
    }
    
    if (resultsCount) {
        resultsCount.textContent = filteredProperties.length + '+';
    }
    
    const totalDisplayed = Math.min(endIndex, filteredProperties.length);
    const hasMoreProperties = totalDisplayed < filteredProperties.length;
    
    if (loadMoreBtn) {
        loadMoreBtn.style.display = hasMoreProperties ? 'flex' : 'none';
        
        if (hasMoreProperties) {
            const remaining = filteredProperties.length - totalDisplayed;
            const nextBatch = Math.min(remaining, propertiesPerPage);
            loadMoreBtn.innerHTML = `<i class="fas fa-arrow-down"></i> Load ${nextBatch} More Properties`;
        } else if (filteredProperties.length > 0) {
            loadMoreBtn.innerHTML = `<i class="fas fa-check"></i> All ${filteredProperties.length} Properties Loaded`;
        }
    }
    
    console.log(`📄 Displaying ${totalDisplayed} of ${filteredProperties.length} properties (Page ${currentPage})`);
}

function showNoResultsMessage() {
    const propertiesGrid = document.getElementById('propertiesGrid');
    propertiesGrid.innerHTML = `
        <div class="no-results">
            <i class="fas fa-search"></i>
            <h3>No properties found</h3>
            <p>Try adjusting your filters to see more results, or let us know what you're looking for.</p>
            <button class="btn-view-details" onclick="clearAllFilters()" style="margin-top: 1rem; display: inline-block;">Clear All Filters</button>
        </div>
    `;
}

function createPropertyCard(property) {
    const isListView = document.getElementById('propertiesGrid').classList.contains('list-view');
    
    const card = document.createElement('div');
    card.className = `property-card ${isListView ? 'list-view' : ''}`;
    card.innerHTML = `
        <div class="property-image">
            <div class="property-carousel" data-property-id="${property.id}">
                ${property.images.map((img, index) => `
                    <div class="carousel-slide ${index === 0 ? 'active' : ''}" 
                         style="background-image: url('${img}')"></div>
                `).join('')}
            </div>
            
            <div class="carousel-controls">
                <button class="carousel-btn prev-btn" onclick="navCarousel(${property.id}, -1)">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-btn next-btn" onclick="navCarousel(${property.id}, 1)">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            
            <div class="carousel-dots">
                ${property.images.map((_, index) => `
                    <span class="carousel-dot ${index === 0 ? 'active' : ''}" 
                          onclick="goToSlide(${property.id}, ${index})"></span>
                `).join('')}
            </div>
            
            <div class="property-badges">
                ${property.isVerified ? '<span class="property-badge badge-verified">Verified</span>' : ''}
                ${property.isFeatured ? '<span class="property-badge badge-featured">Featured</span>' : ''}
                ${property.isNew ? '<span class="property-badge badge-new">New</span>' : ''}
                <span class="property-badge badge-category">${property.category.toUpperCase()}</span>
            </div>
            
            <button class="favorite-btn" onclick="handleFavoriteClick(${property.id}, this)">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        
        <div class="property-details">
            <div class="property-price">₦${property.price.toLocaleString()}/year</div>
            <h3 class="property-title">${property.title}</h3>
            <div class="property-location">
                <i class="fas fa-map-marker-alt"></i>
                ${property.location}
            </div>
            
            <div class="property-features">
                <span class="property-feature">
                    <i class="fas fa-bed"></i> ${property.bedrooms} bed
                </span>
                <span class="property-feature">
                    <i class="fas fa-bath"></i> ${property.bathrooms} bath
                </span>
                <span class="property-feature">
                    <i class="fas fa-ruler-combined"></i> ${property.size}
                </span>
            </div>
            
            <p class="property-description">${property.description}</p>
            
            <div class="property-actions">
                <button class="btn-view-details" onclick="window.handleViewDetailsClick(${property.id}, '${property.category}')">
                    View Details
                </button>
                <button class="btn-save" onclick="handleFavoriteClick(${property.id}, this)">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}
function loadMoreProperties() {
    currentPage++;
    displayProperties();
    
    setTimeout(() => {
        const newProperties = document.getElementById('propertiesGrid').children;
        if (newProperties.length > 0) {
            const lastNewProperty = newProperties[newProperties.length - 1];
            lastNewProperty.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 100);
    
    console.log(`📄 Loaded page ${currentPage}, showing ${Math.min(currentPage * propertiesPerPage, filteredProperties.length)} properties`);
}

function switchView(view) {
    const viewBtns = document.querySelectorAll('.view-btn');
    const propertiesGrid = document.getElementById('propertiesGrid');
    
    viewBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (view === 'list') {
        propertiesGrid.classList.add('list-view');
    } else {
        propertiesGrid.classList.remove('list-view');
    }
    
    displayProperties();
}

function clearAllFilters() {
    document.querySelectorAll('#advancedFiltersModal input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    if (minPriceInput) minPriceInput.value = '';
    if (maxPriceInput) maxPriceInput.value = '';
    
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.value = 5000000;
    }
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'newest';
    
    applyFilters();
    console.log('🧹 All filters cleared');
}

// ===== HERO SEARCH FUNCTIONALITY =====
function initHeroSearch() {
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const searchInput = document.getElementById('searchInput');
    const typeSelect = document.getElementById('typeSelect');
    const areaTypeSelect = document.getElementById('areaTypeSelect');
    const locationSelect = document.getElementById('locationSelect');
    const doSearchBtn = document.getElementById('doSearch');

    const propertyOptions = {
        rent: [
            "Apartment", 
            "Self Contain", 
            "Mini Flat", 
            "Duplex", 
            "Bungalow",
            "Terrace House",
            "Detached House",
            "Shared Apartment"
        ],
        shortlet: [
            "Studio Apartment",
            "1 Bedroom Shortlet", 
            "2 Bedroom Shortlet", 
            "3 Bedroom Shortlet",
            "Luxury Apartment", 
            "Serviced Apartment",
            "Executive Suite"
        ],
        commercial: [
            "Office Space",
            "Shop", 
            "Warehouse",
            "Commercial Building",
            "Co-working Space",
            "Retail Space",
            "Industrial Property"
        ],
        buy: [
            "Residential Apartment",
            "Detached House",
            "Semi-Detached House", 
            "Terrace House",
            "Duplex",
            "Bungalow",
            "Land/Plot",
            "Commercial Property"
        ]
    };

    const lagosAreas = {
        mainland: [
            "Ikeja", "Ikeja GRA", "Yaba", "Surulere", "Ojota", "Oshodi", "Ilupeju",
            "Egbeda", "Maryland", "Ikorodu", "Agege", "Festac Town", "Gbagada",
            "Mushin", "Mende", "Ogba", "Alausa", "Anthony", "Palmgroove", "Somolu",
            "Bariga", "Ketu", "Magodo", "Omole", "Isolo", "Ejigbo", "Amuwo Odofin",
            "Satellite Town", "Apapa", "Mile 2", "Alaba", "Ojo", "Badagry", "Agbara"
        ],
        island: [
            "Ikoyi", "Lekki Phase 1", "Victoria Island", "Ajah", "Sangotedo",
            "Chevron", "Oniru", "Epe", "Banana Island", "Lekki Phase 2", 
            "Victoria Garden City (VGC)", "Lekki Scheme 2", "Osapa London",
            "Jakande", "Awoyaya", "Abraham Adesanya", "Lakowe", "Ibeju Lekki",
            "Marina", "Dolphin Estate", "1004 Estate", "Parkview Estate"
        ]
    };

    function populateTypeOptions(type) {
        console.log('🔄 Populating property types for:', type);
        typeSelect.innerHTML = "";
        const placeholder = document.createElement('option');
        placeholder.value = "";
        placeholder.textContent = "Property Type";
        typeSelect.appendChild(placeholder);

        const options = propertyOptions[type] || [];
        console.log('📋 Available options:', options);
        
        options.forEach(optText => {
            const opt = document.createElement('option');
            opt.value = optText.toLowerCase().replace(/\s+/g,'-');
            opt.textContent = optText;
            typeSelect.appendChild(opt);
        });
        
        console.log(`✅ Loaded ${options.length} property types for ${type}`);
    }

    function populateLocations(areaKey) {
        locationSelect.innerHTML = "";
        const placeholder = document.createElement('option');
        placeholder.value = "";
        placeholder.textContent = "Location";
        locationSelect.appendChild(placeholder);

        if (!areaKey || !lagosAreas[areaKey]) return;

        const sortedLocations = lagosAreas[areaKey].sort();
        
        sortedLocations.forEach(loc => {
            const option = document.createElement('option');
            option.value = loc.toLowerCase().replace(/\s+/g,'-');
            option.textContent = loc;
            locationSelect.appendChild(option);
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            const selectedType = tab.getAttribute('data-type');
            console.log('🏠 Tab switched to:', selectedType);
            populateTypeOptions(selectedType);
            
            const placeholders = {
                rent: 'Search for rental properties — e.g. "Lekki 3 bedroom"',
                shortlet: 'Search for shortlet properties — e.g. "VI luxury apartment"',
                commercial: 'Search for commercial properties — e.g. "Ikeja office space"',
                buy: 'Search for properties to buy — e.g. "Lekki 4 bedroom house"'
            };
            
            searchInput.placeholder = placeholders[selectedType] || 'Search properties...';
        });
    });

    areaTypeSelect.addEventListener('change', () => {
        const area = areaTypeSelect.value;
        populateLocations(area);
        
        if (area) {
            console.log(`📍 Area type selected: ${area}`);
        }
    });

    doSearchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const activeTab = document.querySelector('.tab.active')?.getAttribute('data-type') || 'rent';
        const query = searchInput.value.trim();
        const areaType = areaTypeSelect.value;
        const location = locationSelect.value;
        const propType = typeSelect.value;
        const bedrooms = document.getElementById('bedroomsSelect').value;
        const minPrice = document.getElementById('minPriceSelect').value;
        const maxPrice = document.getElementById('maxPriceSelect').value;

        const searchCriteria = {
            action: activeTab,
            query: query,
            areaType: areaType,
            location: location,
            propertyType: propType,
            bedrooms: bedrooms,
            minPrice: minPrice,
            maxPrice: maxPrice,
            timestamp: new Date().toISOString()
        };

        sessionStorage.setItem('domihive_search_criteria', JSON.stringify(searchCriteria));
        
        console.log('🔍 Search submitted:', searchCriteria);
        
        applyHeroSearch(searchCriteria);
        
        document.querySelector('.properties-section')?.scrollIntoView({ 
            behavior: 'smooth' 
        });
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            doSearchBtn.click();
        }
    });

    function initHeroSearch() {
        console.log('🎯 Initializing hero search');
        populateTypeOptions('rent');
        populateLocations('mainland');
        
        searchInput.value = '';
        
        console.log('✅ Hero Search Initialized with 4 tabs');
    }

    initHeroSearch();
}

function applyHeroSearch(searchCriteria) {
    console.log('🎯 Applying hero search criteria:', searchCriteria);
    
    clearAllFilters();
    
    if (searchCriteria.action) {
        filteredProperties = allProperties.filter(property => 
            property.category === searchCriteria.action
        );
    }
    
    if (searchCriteria.areaType) {
        const areaCheckbox = document.querySelector(`#advancedFiltersModal input[name="area"][value="${searchCriteria.areaType}"]`);
        if (areaCheckbox) areaCheckbox.checked = true;
    }
    
    if (searchCriteria.propertyType) {
        const typeCheckbox = document.querySelector(`#advancedFiltersModal input[name="propertyType"][value="${searchCriteria.propertyType}"]`);
        if (typeCheckbox) typeCheckbox.checked = true;
    }
    
    if (searchCriteria.bedrooms) {
        const bedroomCheckbox = document.querySelector(`#advancedFiltersModal input[name="bedrooms"][value="${searchCriteria.bedrooms}"]`);
        if (bedroomCheckbox) bedroomCheckbox.checked = true;
    }
    
    if (searchCriteria.minPrice) {
        const minPriceInput = document.getElementById('minPrice');
        if (minPriceInput) minPriceInput.value = searchCriteria.minPrice;
    }
    
    if (searchCriteria.maxPrice) {
        const maxPriceInput = document.getElementById('maxPrice');
        if (maxPriceInput) maxPriceInput.value = searchCriteria.maxPrice;
    }
    
    setTimeout(() => {
        applyFilters();
        console.log('✅ Hero search filters applied successfully');
    }, 100);
}

// ===== MODAL FILTERS FUNCTIONALITY =====
function initModalFilters() {
    const filterToggle = document.getElementById('filterToggle');
    const modal = document.getElementById('advancedFiltersModal');
    const modalClose = document.getElementById('modalClose');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const loadingIndicator = document.getElementById('loadingIndicator');

    if (filterToggle && modal) {
        filterToggle.addEventListener('click', function() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            if (loadingIndicator) {
                loadingIndicator.classList.add('active');
            }
            
            setTimeout(() => {
                applyFilters();
                
                if (loadingIndicator) {
                    loadingIndicator.classList.remove('active');
                }
                
                modal.classList.remove('active');
                document.body.style.overflow = '';
                
                showSimpleNotification('Filters applied successfully!', 'success');
            }, 1500);
        });
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            clearAllFilters();
            showSimpleNotification('All filters cleared!', 'success');
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== PROPERTY INTERACTION HANDLERS =====
function handleViewDetailsClick(propertyId, category) {
    console.log(`👀 View details clicked for ${category} property ${propertyId}`);
    
    const property = allProperties.find(p => p.id === propertyId);
    if (!property) {
        console.error('❌ Property not found:', propertyId);
        return;
    }

    propertyStorage.storePropertyForOverview(property, 'viewed');
    
    localStorage.setItem('current_property_view', JSON.stringify(property));
    
    // Determine the correct details page based on category
    let detailsPage = '';
    switch(category) {
        case 'shortlet':
            detailsPage = '/Pages/property-details-shortlet.html';
            break;
        case 'commercial':
            detailsPage = '/Pages/property-details-commercial.html';
            break;
        case 'buy':
            detailsPage = '/Pages/property-details-buy.html';
            break;
        default:
            detailsPage = '/Pages/property-details-rent.html';
    }
    
    console.log(`🔗 Redirecting to: ${detailsPage}`);
    window.location.href = detailsPage;
}

function handleFavoriteClick(propertyId, buttonElement) {
    console.log(`💖 Favorite clicked for property ${propertyId}`);
    
    const property = allProperties.find(p => p.id === propertyId);
    if (!property) {
        console.error('❌ Property not found:', propertyId);
        return;
    }

    const success = propertyStorage.storePropertyForOverview(property, 'saved');
    
    if (success) {
        sessionStorage.setItem('domihive_redirect_after_login', 'dashboard-overview');
        sessionStorage.setItem('domihive_favorite_property_id', propertyId);
        sessionStorage.setItem('domihive_previous_page', 'index.html');
        
        buttonElement.classList.toggle('active');
        
        updateFavoritesCount();
        
        showSimpleNotification(`Added to favorites! We'll save it for your dashboard.`);
        
        setTimeout(() => {
            window.location.href = './signup.html';
        }, 1000);
    } else {
        buttonElement.classList.toggle('active');
        updateFavoritesCount();
        showSimpleNotification('Added to favorites!', 'success');
        setTimeout(() => {
            window.location.href = './signup.html';
        }, 500);
    }
}

// ===== CAROUSEL FUNCTIONS =====
function navCarousel(propertyId, direction) {
    const carousel = document.querySelector(`.property-carousel[data-property-id="${propertyId}"]`);
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.parentElement.querySelectorAll('.carousel-dot');
    
    let currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
    let newIndex = (currentIndex + direction + slides.length) % slides.length;
    
    slides[currentIndex].classList.remove('active');
    slides[newIndex].classList.add('active');
    
    dots[currentIndex].classList.remove('active');
    dots[newIndex].classList.add('active');
}

function goToSlide(propertyId, slideIndex) {
    const carousel = document.querySelector(`.property-carousel[data-property-id="${propertyId}"]`);
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.parentElement.querySelectorAll('.carousel-dot');
    
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === slideIndex);
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === slideIndex);
    });
}

// ===== UTILITY FUNCTIONS =====
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function showSimpleNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.simple-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `simple-notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
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
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

function updateFavoritesCount() {
    const favoriteBadge = document.querySelector('.favorite-badge');
    if (favoriteBadge) {
        const currentCount = parseInt(favoriteBadge.textContent) || 0;
        favoriteBadge.textContent = currentCount + 1;
        favoriteBadge.style.display = 'flex';
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing DomiHive Homepage');
    
    initNavigation();
    initHeroSearch();
    initPropertiesGrid();
    initModalFilters();
    
    console.log('✅ All homepage functionalities initialized successfully');
});

// ===== GLOBAL FUNCTIONS =====
window.navCarousel = navCarousel;
window.goToSlide = goToSlide;
window.handleViewDetailsClick = handleViewDetailsClick;
window.handleFavoriteClick = handleFavoriteClick;
window.clearAllFilters = clearAllFilters;
window.scrollToSection = scrollToSection;

// Make property storage globally available
window.propertyStorage = propertyStorage;

console.log('🎉 DomiHive Homepage Ready! All functionalities loaded.');