// browse-content.js - COMPLETE REWRITE - All 4 Tabs Working + SPA Integration
// DomiHive Browse Properties - All Property Types Supported

// ===== GLOBAL VARIABLES =====
let allProperties = [];
let filteredProperties = [];
let currentPage = 1;
const propertiesPerPage = 12;
let userFavorites = new Set();
let currentActiveTab = 'rent'; // Track active tab: 'rent', 'shortlet', 'commercial', 'buy'

// ===== SPA INTEGRATION =====
window.spaBrowseInit = function() {
    console.log('🎯 SPA: Initializing Browse Properties Content');
    initializeBrowseProperties();
};

// Auto-initialize if loaded directly
if (window.location.pathname.includes('browse-content.html')) {
    document.addEventListener('DOMContentLoaded', initializeBrowseProperties);
} else {
    // SPA environment - check if we're on the page and initialize
    setTimeout(function() {
        if (document.querySelector('.browse-content')) {
            console.log('🔍 Detected SPA environment - auto-initializing browse');
            initializeBrowseProperties();
        }
    }, 500);
}

// ===== INITIALIZATION =====
function initializeBrowseProperties() {
    console.log('🏠 Initializing Browse Properties');
    
    loadUserFavorites();
    initializeHeroSearch();
    initializeAdvancedFilters();
    generateAllProperties(); // Generate properties for ALL categories
    filterPropertiesByActiveTab(); // Show only active tab properties
    displayProperties();
    initializeEventListeners();
    
    console.log('✅ Browse Properties initialized');
}

function loadUserFavorites() {
    const favorites = localStorage.getItem('domihive_user_favorites');
    if (favorites) {
        try {
            userFavorites = new Set(JSON.parse(favorites));
        } catch (error) {
            console.error('Error loading favorites:', error);
            userFavorites = new Set();
        }
    }
}

// ===== UPDATED HERO SEARCH FUNCTIONALITY =====
function initializeHeroSearch() {
    // ELEMENTS
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const searchInput = document.getElementById('searchInput');
    const typeSelect = document.getElementById('typeSelect');
    const areaTypeSelect = document.getElementById('areaTypeSelect');
    const locationSelect = document.getElementById('locationSelect');
    const doSearchBtn = document.getElementById('doSearch');

    // PROPERTY OPTIONS FOR ALL 4 TABS
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

    // LAGOS AREAS
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

    // Populate property type dropdown for chosen tab
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

    // Populate locations for chosen area type
    function populateLocations(areaKey) {
        locationSelect.innerHTML = "";
        const placeholder = document.createElement('option');
        placeholder.value = "";
        placeholder.textContent = "Location";
        locationSelect.appendChild(placeholder);

        if (!areaKey || !lagosAreas[areaKey]) return;

        // Sort locations alphabetically
        const sortedLocations = lagosAreas[areaKey].sort();
        
        sortedLocations.forEach(loc => {
            const option = document.createElement('option');
            option.value = loc.toLowerCase().replace(/\s+/g,'-');
            option.textContent = loc;
            locationSelect.appendChild(option);
        });
    }

    // Tab click behavior - UPDATED TO FILTER PROPERTIES
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            
            // Add active class to clicked tab
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            // Update active tab and filter properties
            const selectedType = tab.getAttribute('data-type');
            console.log('🏠 Tab switched to:', selectedType);
            currentActiveTab = selectedType;
            
            // Update property type options
            populateTypeOptions(selectedType);
            
            // Update search placeholder based on tab
            const placeholders = {
                rent: 'Search for rental properties — e.g. "Lekki 3 bedroom"',
                shortlet: 'Search for shortlet properties — e.g. "VI luxury apartment"',
                commercial: 'Search for commercial properties — e.g. "Ikeja office space"',
                buy: 'Search for properties to buy — e.g. "Lekki 4 bedroom house"'
            };
            
            searchInput.placeholder = placeholders[selectedType] || 'Search properties...';
            
            // ✅ FILTER PROPERTIES BY ACTIVE TAB
            filterPropertiesByActiveTab();
        });
    });

    // Area selection behavior
    areaTypeSelect.addEventListener('change', () => {
        const area = areaTypeSelect.value;
        populateLocations(area);
        
        if (area) {
            console.log(`📍 Area type selected: ${area}`);
        }
    });

    // Search handler
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

        // Build search criteria
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

        // Store search for property grid
        sessionStorage.setItem('domihive_search_criteria', JSON.stringify(searchCriteria));
        
        console.log('🔍 Search submitted:', searchCriteria);
        
        // Apply search immediately to properties grid
        applyHeroSearch(searchCriteria);
        
        // Scroll to properties section
        document.querySelector('.properties-section')?.scrollIntoView({ 
            behavior: 'smooth' 
        });
    });

    // Keyboard accessibility - press Enter to search
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            doSearchBtn.click();
        }
    });

    // Initialize
    function initHeroSearch() {
        // Set default property types
        console.log('🎯 Initializing hero search');
        populateTypeOptions('rent');
        populateLocations('mainland');
        
        // Clear any previous search
        searchInput.value = '';
        
        console.log('✅ Hero Search Initialized with 4 tabs');
    }

    // Start initialization
    initHeroSearch();
}

// ===== ADVANCED FILTERS =====
function initializeAdvancedFilters() {
    const filterToggle = document.getElementById('filterToggle');
    const advancedFilters = document.getElementById('advancedFilters');
    
    if (filterToggle && advancedFilters) {
        filterToggle.addEventListener('click', function() {
            advancedFilters.classList.toggle('active');
            filterToggle.classList.toggle('active');
            
            const isExpanded = advancedFilters.classList.contains('active');
            filterToggle.setAttribute('aria-expanded', isExpanded);
            
            // Update toggle text
            const toggleText = filterToggle.querySelector('.toggle-text');
            if (toggleText) {
                toggleText.textContent = isExpanded ? 'Hide Filters' : 'Advanced Filters';
            }
        });
    }
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearAllFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    // Apply filters button
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    // Real-time filtering for checkboxes
    const filterInputs = document.querySelectorAll('#advancedFilters input[type="checkbox"]');
    filterInputs.forEach(input => {
        input.addEventListener('change', debounce(applyFilters, 300));
    });
}

function applyFilters() {
    console.log('🎯 Applying filters...');
    
    const filters = getCurrentFilters();
    filteredProperties = allProperties.filter(property => {
        return matchesAllFilters(property, filters);
    });
    
    // ✅ APPLY ACTIVE TAB FILTER AFTER OTHER FILTERS
    filteredProperties = filteredProperties.filter(property => 
        property.category === currentActiveTab
    );
    
    currentPage = 1;
    sortProperties();
    displayProperties();
    
    console.log(`📊 Filtered to ${filteredProperties.length} properties for ${currentActiveTab}`);
}

function getCurrentFilters() {
    const filters = {
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
    const checked = document.querySelectorAll(`#advancedFilters input[name="${name}"]:checked`);
    return Array.from(checked).map(input => input.value);
}

function matchesAllFilters(property, filters) {
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
    if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.propertyType)) {
        return false;
    }
    
    // Furnishing
    if (filters.furnishing.length > 0 && !filters.furnishing.includes(property.furnishing)) {
        return false;
    }
    
    // Amenities (all selected amenities must be present)
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

function clearAllFilters() {
    // Uncheck all checkboxes in advanced filters
    document.querySelectorAll('#advancedFilters input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    applyFilters();
    console.log('🧹 All filters cleared');
}

// ===== PROPERTY GENERATION - ALL 4 CATEGORIES =====
function generateAllProperties() {
    allProperties = [];
    
    // Generate properties for ALL categories
    for (let i = 1; i <= 60; i++) {
        if (i <= 20) { // 20 rent properties
            generateRentProperty(i);
        } else if (i <= 35) { // 15 shortlet properties
            generateShortletProperty(i - 20);
        } else if (i <= 45) { // 10 commercial properties
            generateCommercialProperty(i - 35);
        } else { // 15 buy properties
            generateBuyProperty(i - 45);
        }
    }
    
    console.log(`🏘️ Generated ${allProperties.length} total properties:`);
    console.log(`- 🏠 Rent: ${allProperties.filter(p => p.category === 'rent').length}`);
    console.log(`- 🏨 Shortlet: ${allProperties.filter(p => p.category === 'shortlet').length}`);
    console.log(`- 🏢 Commercial: ${allProperties.filter(p => p.category === 'commercial').length}`);
    console.log(`- 💰 Buy: ${allProperties.filter(p => p.category === 'buy').length}`);
}

function generateRentProperty(id) {
    const propertyImages = [
        'https://images.unsplash.com/photo-1545323157-f6f63c0d66a7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564019471349-34e8a875c5c8?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448078-8b7a9c7b7c7c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
    ];
    
    const isMainland = Math.random() > 0.5;
    const area = isMainland ? 'mainland' : 'island';
    const locations = isMainland ? 
        ['Ikeja', 'Yaba', 'Surulere', 'Festac', 'Gbagada', 'Ogba'] : 
        ['Ikoyi', 'Lekki', 'Victoria Island', 'Ajah', 'VGC', 'Oniru'];
    
    const property = {
        id: `rent_${id}`,
        category: 'rent',
        title: `Luxury ${getRandomBedrooms()} Bedroom in ${locations[Math.floor(Math.random() * locations.length)]}`,
        price: area === 'island' ? 800000 + Math.random() * 1200000 : 400000 + Math.random() * 600000,
        priceType: 'year',
        location: locations[Math.floor(Math.random() * locations.length)],
        area: area,
        propertyType: ['apartment', 'self-contain', 'mini-flat', 'duplex'][Math.floor(Math.random() * 4)],
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        size: `${Math.floor(Math.random() * 200) + 50} sqm`,
        furnishing: ['furnished', 'semi-furnished', 'unfurnished'][Math.floor(Math.random() * 3)],
        images: [propertyImages[Math.floor(Math.random() * propertyImages.length)]],
        isVerified: Math.random() > 0.2,
        isFeatured: Math.random() > 0.8,
        isNew: id > 15,
        petsAllowed: Math.random() > 0.7,
        age: ['new', 'modern', 'established'][Math.floor(Math.random() * 3)],
        amenities: getRandomAmenities(['wifi', 'parking', 'security', 'generator', 'water', 'ac']),
        description: `Beautiful ${getRandomBedrooms()} bedroom property in prime ${area} location. Perfect for families and professionals seeking long-term accommodation.`,
        dateAdded: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
    };
    
    allProperties.push(property);
}

function generateShortletProperty(id) {
    const propertyImages = [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop'
    ];
    
    const isMainland = Math.random() > 0.3;
    const area = isMainland ? 'mainland' : 'island';
    const locations = isMainland ? 
        ['Ikeja', 'Victoria Island', 'Lekki', 'Ikoyi'] : 
        ['Ikoyi', 'Lekki', 'Victoria Island', 'Ajah', 'VGC'];
    
    const property = {
        id: `shortlet_${id}`,
        category: 'shortlet',
        title: `Luxury ${getRandomBedrooms()} Bedroom Shortlet in ${locations[Math.floor(Math.random() * locations.length)]}`,
        price: area === 'island' ? 15000 + Math.random() * 35000 : 8000 + Math.random() * 12000,
        priceType: 'night',
        location: locations[Math.floor(Math.random() * locations.length)],
        area: area,
        propertyType: ['apartment', 'serviced-apartment', 'studio', 'executive-suite'][Math.floor(Math.random() * 4)],
        bedrooms: Math.floor(Math.random() * 3) + 1,
        bathrooms: Math.floor(Math.random() * 2) + 1,
        size: `${Math.floor(Math.random() * 150) + 30} sqm`,
        furnishing: 'furnished',
        images: [propertyImages[Math.floor(Math.random() * propertyImages.length)]],
        isVerified: Math.random() > 0.1,
        isFeatured: Math.random() > 0.7,
        isNew: id > 10,
        petsAllowed: Math.random() > 0.8,
        age: ['new', 'modern'][Math.floor(Math.random() * 2)],
        amenities: getRandomAmenities(['wifi', 'parking', 'security', 'ac', 'tv', 'kitchen', 'pool']),
        description: `Beautiful ${getRandomBedrooms()} bedroom shortlet in ${area} location. Perfect for vacations, business trips, or short stays with all amenities included.`,
        dateAdded: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
    };
    
    allProperties.push(property);
}

function generateCommercialProperty(id) {
    const propertyImages = [
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493916665398-143bdeabea49?w=800&h=600&fit=crop'
    ];
    
    const isMainland = Math.random() > 0.4;
    const area = isMainland ? 'mainland' : 'island';
    const locations = isMainland ? 
        ['Ikeja', 'Victoria Island', 'Lekki', 'Ilupeju'] : 
        ['Ikoyi', 'Victoria Island', 'Lekki', 'Ajah'];
    
    const propertyTypes = ['office-space', 'shop', 'warehouse', 'commercial-building', 'co-working-space', 'retail-space'];
    const typeNames = {
        'office-space': 'Office Space',
        'shop': 'Shop',
        'warehouse': 'Warehouse', 
        'commercial-building': 'Commercial Building',
        'co-working-space': 'Co-working Space',
        'retail-space': 'Retail Space'
    };
    
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    
    const property = {
        id: `commercial_${id}`,
        category: 'commercial',
        title: `${typeNames[propertyType]} in ${locations[Math.floor(Math.random() * locations.length)]}`,
        price: area === 'island' ? 1200000 + Math.random() * 3000000 : 600000 + Math.random() * 1200000,
        priceType: 'year',
        location: locations[Math.floor(Math.random() * locations.length)],
        area: area,
        propertyType: propertyType,
        bedrooms: 0,
        bathrooms: Math.floor(Math.random() * 4) + 1,
        size: `${Math.floor(Math.random() * 500) + 100} sqm`,
        furnishing: ['furnished', 'semi-furnished', 'unfurnished'][Math.floor(Math.random() * 3)],
        images: [propertyImages[Math.floor(Math.random() * propertyImages.length)]],
        isVerified: Math.random() > 0.1,
        isFeatured: Math.random() > 0.7,
        isNew: id > 5,
        petsAllowed: true,
        age: ['new', 'modern', 'established'][Math.floor(Math.random() * 3)],
        amenities: getRandomAmenities(['wifi', 'parking', 'security', 'ac', 'elevator', 'conference-room']),
        description: `Prime ${typeNames[propertyType].toLowerCase()} in ${area} location. Ideal for businesses seeking professional commercial space with excellent amenities.`,
        dateAdded: new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000)
    };
    
    allProperties.push(property);
}

function generateBuyProperty(id) {
    const propertyImages = [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop'
    ];
    
    const isMainland = Math.random() > 0.4;
    const area = isMainland ? 'mainland' : 'island';
    const locations = isMainland ? 
        ['Ikeja GRA', 'Magodo', 'Omole', 'Gbagada', 'Lekki'] : 
        ['Ikoyi', 'Banana Island', 'Victoria Island', 'Lekki Phase 1', 'VGC'];
    
    const basePrice = area === 'island' ? 50000000 : 25000000;
    
    const property = {
        id: `buy_${id}`,
        category: 'buy',
        title: `Luxury ${getRandomBedrooms()} Bedroom For Sale in ${locations[Math.floor(Math.random() * locations.length)]}`,
        price: basePrice + Math.random() * basePrice * 2,
        priceType: 'once',
        location: locations[Math.floor(Math.random() * locations.length)],
        area: area,
        propertyType: ['apartment', 'duplex', 'detached-house', 'bungalow', 'semi-detached'][Math.floor(Math.random() * 5)],
        bedrooms: Math.floor(Math.random() * 5) + 2,
        bathrooms: Math.floor(Math.random() * 4) + 2,
        size: `${Math.floor(Math.random() * 400) + 100} sqm`,
        furnishing: ['furnished', 'semi-furnished', 'unfurnished'][Math.floor(Math.random() * 3)],
        images: [propertyImages[Math.floor(Math.random() * propertyImages.length)]],
        isVerified: Math.random() > 0.1,
        isFeatured: Math.random() > 0.7,
        isNew: Math.random() > 0.5,
        petsAllowed: true,
        age: ['new', 'modern', 'established'][Math.floor(Math.random() * 3)],
        amenities: getRandomAmenities(['wifi', 'parking', 'security', 'pool', 'gym', 'garden', 'cctv']),
        description: `Beautiful ${getRandomBedrooms()} bedroom property for sale in prime ${area} location. Perfect investment opportunity with great potential for appreciation.`,
        dateAdded: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
    };
    
    allProperties.push(property);
}

function getRandomBedrooms() {
    const sizes = ['One', 'Two', 'Three', 'Four', 'Five'];
    return sizes[Math.floor(Math.random() * sizes.length)];
}

function getRandomAmenities(amenitiesList) {
    const count = Math.floor(Math.random() * 3) + 2;
    const shuffled = [...amenitiesList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// ===== TAB FILTERING =====
function filterPropertiesByActiveTab() {
    console.log(`🔍 Filtering properties for tab: ${currentActiveTab}`);
    
    filteredProperties = allProperties.filter(property => 
        property.category === currentActiveTab
    );
    
    currentPage = 1;
    displayProperties();
    
    console.log(`📊 Showing ${filteredProperties.length} ${currentActiveTab} properties`);
}

// ===== PROPERTY DISPLAY =====
function displayProperties() {
    const propertiesGrid = document.getElementById('propertiesGrid');
    const resultsCount = document.getElementById('resultsCount');
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
    
    // Update results count with tab-specific text
    if (resultsCount) {
        const tabNames = {
            rent: 'Rental Properties',
            shortlet: 'Shortlet Properties', 
            commercial: 'Commercial Properties',
            buy: 'Properties For Sale'
        };
        
        resultsCount.textContent = `${filteredProperties.length}+ ${tabNames[currentActiveTab] || 'Properties'}`;
    }
    
    // Show/hide load more button
    const totalDisplayed = Math.min(endIndex, filteredProperties.length);
    const hasMoreProperties = totalDisplayed < filteredProperties.length;
    
    if (loadMoreBtn) {
        loadMoreBtn.style.display = hasMoreProperties ? 'flex' : 'none';
        
        if (hasMoreProperties) {
            const remaining = filteredProperties.length - totalDisplayed;
            const nextBatch = Math.min(remaining, propertiesPerPage);
            loadMoreBtn.innerHTML = `<i class="fas fa-arrow-down"></i> Load ${nextBatch} More Properties`;
        }
    }
    
    console.log(`📄 Displaying ${totalDisplayed} of ${filteredProperties.length} ${currentActiveTab} properties (Page ${currentPage})`);
}

function createPropertyCard(property) {
    const isFavorite = userFavorites.has(property.id);
    
    // ✅ DYNAMIC BADGE BASED ON CATEGORY
    const categoryBadges = {
        rent: '<span class="property-badge" style="background: #0e1f42;">For Rent</span>',
        shortlet: '<span class="property-badge" style="background: #8b5cf6;">Shortlet</span>',
        commercial: '<span class="property-badge" style="background: #059669;">Commercial</span>',
        buy: '<span class="property-badge" style="background: #dc2626;">For Sale</span>'
    };
    
    const card = document.createElement('div');
    card.className = 'property-card';
    card.innerHTML = `
        <div class="property-image">
            <div class="property-carousel" data-property-id="${property.id}">
                <div class="carousel-slide active" style="background-image: url('${property.images[0]}')"></div>
            </div>
            
            <div class="property-badges">
                ${property.isVerified ? '<span class="property-badge badge-verified">Verified</span>' : ''}
                ${property.isFeatured ? '<span class="property-badge badge-featured">Featured</span>' : ''}
                ${property.isNew ? '<span class="property-badge badge-new">New</span>' : ''}
                ${categoryBadges[property.category] || ''}
            </div>
            
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="handleFavoriteClick('${property.id}', this)">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        
        <div class="property-details">
            <div class="property-price">
                ₦${property.price.toLocaleString()}/${property.priceType}
            </div>
            <h3 class="property-title">${property.title}</h3>
            <div class="property-location">
                <i class="fas fa-map-marker-alt"></i>
                ${property.location}, ${property.area === 'island' ? 'Lagos Island' : 'Lagos Mainland'}
            </div>
            
            <div class="property-features">
                ${property.bedrooms > 0 ? `<span class="property-feature">
                    <i class="fas fa-bed"></i> ${property.bedrooms} bed
                </span>` : ''}
                <span class="property-feature">
                    <i class="fas fa-bath"></i> ${property.bathrooms} bath
                </span>
                <span class="property-feature">
                    <i class="fas fa-ruler-combined"></i> ${property.size}
                </span>
            </div>
            
            <p class="property-description">${property.description}</p>
            
            <div class="property-actions">
                <button class="btn-view-details" onclick="handleViewDetailsClick('${property.id}')">
                    View Details
                </button>
                <button class="btn-save ${isFavorite ? 'active' : ''}" onclick="handleFavoriteClick('${property.id}', this)">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ===== PROPERTY INTERACTIONS =====
function handleViewDetailsClick(propertyId) {
    console.log(`👀 View details clicked for property ${propertyId}`);
    
    const property = allProperties.find(p => p.id === propertyId);
    if (property) {
        // Store property data for the next page
        localStorage.setItem('current_property_view', JSON.stringify(property));
        
        // ✅ UPDATED: ROUTE TO CORRECT PAGE BASED ON PROPERTY CATEGORY
        const pageRoutes = {
            rent: 'property-details-rent',
            shortlet: 'property-details-shortlet', 
            commercial: 'property-details-commercial',
            buy: 'property-details-buy'
        };
        
        const targetPage = pageRoutes[property.category] || 'property-details-rent';
        
        if (window.spa && typeof window.spa.navigateToSection === 'function') {
            console.log(`🚀 SPA Navigation to: ${targetPage}`);
            window.spa.navigateToSection(targetPage);
        } else {
            // Fallback to direct navigation
            console.log(`🌐 Direct navigation to: ${targetPage}`);
            window.location.href = `/Pages/${targetPage}.html?id=${propertyId}`;
        }
    }
}

function handleFavoriteClick(propertyId, buttonElement) {
    console.log(`💖 Favorite clicked for property ${propertyId}`);
    
    if (userFavorites.has(propertyId)) {
        userFavorites.delete(propertyId);
        buttonElement.classList.remove('active');
        showNotification('Property removed from favorites', 'success');
    } else {
        userFavorites.add(propertyId);
        buttonElement.classList.add('active');
        showNotification('Property added to favorites!', 'success');
    }
    
    saveUserFavorites();
}

function saveUserFavorites() {
    localStorage.setItem('domihive_user_favorites', JSON.stringify([...userFavorites]));
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
}

// ===== SORTING =====
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

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortProperties);
    }
    
    // Load more button
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProperties);
    }
    
    // View options
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            switchView(this.getAttribute('data-view'));
        });
    });
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

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'success') {
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
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
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
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
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

function showNoResultsMessage() {
    const propertiesGrid = document.getElementById('propertiesGrid');
    const tabNames = {
        rent: 'rental',
        shortlet: 'shortlet',
        commercial: 'commercial', 
        buy: 'buy'
    };
    
    propertiesGrid.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
            <i class="fas fa-search" style="font-size: 4rem; color: var(--gray-light); margin-bottom: 1.5rem;"></i>
            <h3 style="color: var(--primary-color); margin-bottom: 1rem;">No ${tabNames[currentActiveTab] || ''} properties found</h3>
            <p style="color: var(--gray); margin-bottom: 2rem;">Try adjusting your filters or search criteria to see more results.</p>
            <button class="btn-view-details" onclick="clearAllFilters()" style="margin-top: 1rem; display: inline-block;">
                Clear All Filters
            </button>
        </div>
    `;
}

// ===== HERO SEARCH HELPER FUNCTIONS =====
function applyHeroSearch(searchCriteria) {
    console.log('🎯 Applying hero search criteria:', searchCriteria);
    
    // Clear existing filters first
    clearAllFilters();
    
    // Filter by category first
    if (searchCriteria.action) {
        currentActiveTab = searchCriteria.action;
        filterPropertiesByActiveTab();
    }
    
    // Apply hero search filters to advanced sidebar
    if (searchCriteria.areaType) {
        const areaCheckbox = document.querySelector(`input[name="area"][value="${searchCriteria.areaType}"]`);
        if (areaCheckbox) areaCheckbox.checked = true;
    }
    
    if (searchCriteria.propertyType) {
        const typeCheckbox = document.querySelector(`input[name="propertyType"][value="${searchCriteria.propertyType}"]`);
        if (typeCheckbox) typeCheckbox.checked = true;
    }
    
    if (searchCriteria.bedrooms) {
        const bedroomCheckbox = document.querySelector(`input[name="bedrooms"][value="${searchCriteria.bedrooms}"]`);
        if (bedroomCheckbox) bedroomCheckbox.checked = true;
    }
    
    // Apply the filters
    setTimeout(() => {
        applyFilters();
        console.log('✅ Hero search filters applied successfully');
    }, 100);
}

// ===== GLOBAL FUNCTIONS =====
window.handleViewDetailsClick = handleViewDetailsClick;
window.handleFavoriteClick = handleFavoriteClick;
window.clearAllFilters = clearAllFilters;
window.loadMoreProperties = loadMoreProperties;
window.navCarousel = function(propertyId, direction) {
    const carousel = document.querySelector(`.property-carousel[data-property-id="${propertyId}"]`);
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.parentElement.querySelectorAll('.carousel-dot');
    
    let currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
    let newIndex = (currentIndex + direction + slides.length) % slides.length;
    
    slides[currentIndex].classList.remove('active');
    slides[newIndex].classList.add('active');
    
    if (dots.length > 0) {
        dots[currentIndex].classList.remove('active');
        dots[newIndex].classList.add('active');
    }
};

window.goToSlide = function(propertyId, slideIndex) {
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
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBrowseProperties);
} else {
    initializeBrowseProperties();
}

// Make initialization function globally available
window.initializeBrowseProperties = initializeBrowseProperties;

console.log('🎉 DomiHive Browse Properties Module Loaded - All 4 Tabs Active!');