// spa.js - COMPLETE REWRITE WITH THREE-STATE SIDEBAR - ALL FUNCTIONALITY PRESERVED
// NOTIFICATION PANEL UPDATE: Loads notification.html as centered slide-down panel

class DomiHiveEnterpriseSPA {
  constructor() {
    this.currentSection = "overview";
    this.isInitialized = false;
    this.registeredPages = new Map();
    this.userPermissions = new Set();
    this.notificationCount = 0;
    this.sidebarState = "expanded"; // 'expanded', 'collapsed', 'hidden'
    
    // NEW: Notification panel variables
    this.isNotificationPanelOpen = false;
    this.notificationPanelLoaded = false;
  }

  // ===== ENTERPRISE INITIALIZATION =====
  async init() {
    if (this.isInitialized) return;

    console.log("🚀 Initializing DomiHive Enterprise SPA with Three-State Sidebar...");

    try {
      // Initialize core systems
      await this.initializeUserSession();
      this.initializeNavigation();
      this.initializeSidebarThreeStateSystem();
      this.initializeNotifications();

      // Register ALL pages
      this.registerAllPages();

      // Initialize UI components
      this.initializeUI();

      // Setup notification panel
      this.setupNotificationPanel();

      // Load initial section
      await this.loadInitialSection();

      this.isInitialized = true;
      console.log("✅ DomiHive Enterprise SPA Ready for Production");
    } catch (error) {
      console.error("❌ SPA Initialization Failed:", error);
      this.handleCriticalError(error);
    }
  }

  // ===== NEW: NOTIFICATION PANEL SYSTEM =====
  setupNotificationPanel() {
    console.log("🔔 Setting up Notification Panel...");
    
    // Get notification button
    const notificationsBtn = document.getElementById("notificationsBtn");
    if (notificationsBtn) {
      // Remove any existing click handlers
      const newBtn = notificationsBtn.cloneNode(true);
      notificationsBtn.parentNode.replaceChild(newBtn, notificationsBtn);
      
      // Add new click handler for panel
      document.getElementById("notificationsBtn").addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleNotificationPanel();
      });
    }
    
    // Close panel with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isNotificationPanelOpen) {
        this.closeNotificationPanel();
      }
    });
    
    console.log("✅ Notification Panel setup complete");
  }

  async toggleNotificationPanel() {
    if (this.isNotificationPanelOpen) {
      this.closeNotificationPanel();
    } else {
      await this.openNotificationPanel();
    }
  }

  async openNotificationPanel() {
    console.log("🔔 Opening notification panel...");
    
    const panel = document.getElementById('notificationPanelContainer');
    
    if (!panel) {
      console.error("❌ Notification panel container not found");
      return;
    }
    
    // Create backdrop if it doesn't exist
    let backdrop = document.querySelector('.notification-panel-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'notification-panel-backdrop';
      document.body.appendChild(backdrop);
      
      // Click backdrop to close
      backdrop.addEventListener('click', () => {
        this.closeNotificationPanel();
      });
    }
    
    // Load content if not already loaded
    if (!this.notificationPanelLoaded) {
      await this.loadNotificationPanelContent();
    }
    
    // Show panel and backdrop
    panel.classList.add('active');
    backdrop.classList.add('active');
    this.isNotificationPanelOpen = true;
    
    // Prevent body scrolling when panel is open
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Notification panel opened');
  }

  closeNotificationPanel() {
    console.log("🔔 Closing notification panel...");
    
    const panel = document.getElementById('notificationPanelContainer');
    const backdrop = document.querySelector('.notification-panel-backdrop');
    
    if (panel) panel.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    
    this.isNotificationPanelOpen = false;
    
    // Restore body scrolling
    document.body.style.overflow = '';
    
    console.log('✅ Notification panel closed');
  }

  async loadNotificationPanelContent() {
    console.log("📥 Loading notification panel content...");
    
    const panel = document.getElementById('notificationPanelContainer');
    if (!panel) return;
    
    try {
      // Fetch the notification.html content
      const response = await fetch('/Pages/notification.html');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const htmlContent = await response.text();
      
      // Create temporary div to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Get the main content container
      const notificationContent = tempDiv.querySelector('.notifications-container');
      
      if (notificationContent) {
        // Clear panel and add content
        panel.innerHTML = '';
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-panel-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.title = 'Close notifications';
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.closeNotificationPanel();
        });
        
        panel.appendChild(closeBtn);
        panel.appendChild(notificationContent.cloneNode(true));
        
        // Load notification.css if not already loaded
        await this.loadNotificationPanelStyles();
        
        // Execute notification.js
        await this.executeNotificationScripts();
        
        this.notificationPanelLoaded = true;
        console.log('✅ Notification panel content loaded successfully');
      }
      
    } catch (error) {
      console.error('❌ Failed to load notification panel content:', error);
      panel.innerHTML = `
        <div style="padding: 3rem 2rem; text-align: center; color: var(--gray);">
          <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: var(--error);"></i>
          <h3 style="color: var(--dark-gray); margin-bottom: 0.5rem;">Failed to load notifications</h3>
          <p style="margin-bottom: 1.5rem;">Please try again later</p>
          <button style="padding: 0.75rem 1.5rem; background: var(--accent-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;"
                  onclick="spa.loadNotificationPanelContent()">
            <i class="fas fa-redo"></i> Retry
          </button>
        </div>
      `;
    }
  }

  async loadNotificationPanelStyles() {
    // Check if notification.css is already loaded
    if (document.querySelector('link[href*="notification.css"]')) {
      return;
    }
    
    // Load notification.css
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/CSS/notification.css';
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  async executeNotificationScripts() {
    const panel = document.getElementById('notificationPanelContainer');
    if (!panel) return;
    
    // Find and execute scripts in the panel content
    const scripts = panel.querySelectorAll('script');
    
    for (const script of scripts) {
      try {
        if (script.src) {
          // Load external script
          await new Promise((resolve, reject) => {
            const newScript = document.createElement('script');
            newScript.src = script.src;
            newScript.onload = resolve;
            newScript.onerror = reject;
            document.head.appendChild(newScript);
          });
        } else {
          // Execute inline script
          new Function(script.textContent)();
        }
        script.remove(); // Remove the original script tag
      } catch (error) {
        console.error('❌ Failed to load notification script:', error);
      }
    }
  }

  // ===== EXISTING THREE-STATE SIDEBAR SYSTEM =====
  initializeSidebarThreeStateSystem() {
    console.log("🔄 Initializing Three-State Sidebar System...");
    
    const sidebar = document.getElementById("dashboardSidebar");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const desktopToggleBtn = document.getElementById("desktopToggleBtn");
    const sidebarToggle = document.getElementById("sidebarToggle");
    
    // Load saved state
    this.loadSidebarState();
    
    // Mobile Menu Button (for mobile view)
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleSidebarState();
      });
    }
    
    // Desktop Toggle Button (for desktop view - hidden state)
    if (desktopToggleBtn) {
      desktopToggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleSidebarState();
      });
    }
    
    // Sidebar Toggle Button (inside sidebar - for collapsed state)
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleSidebarState();
      });
    }
    
    console.log("✅ Three-State Sidebar System Initialized");
  }

  toggleSidebarState() {
    const sidebar = document.getElementById("dashboardSidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const logoImg = document.querySelector(".sidebar-logo-img");
    
    if (!sidebar || !logoImg) return;
    
    // Cycle through states: expanded → collapsed → hidden → expanded
    if (this.sidebarState === "expanded") {
      // Expanded → Collapsed
      this.sidebarState = "collapsed";
      sidebar.classList.remove("hidden");
      sidebar.classList.add("collapsed");
      
      // Change logo to icon version
      logoImg.src = "/ASSECT/domihive-logo 2.png";
      logoImg.alt = "DomiHive Icon";
      logoImg.style.width = "32px"; // Adjust size for icon
      
      if (sidebarToggle) {
        sidebarToggle.innerHTML = '<i class="fas fa-chevron-right"></i>';
        sidebarToggle.title = "Expand sidebar";
      }
    } else if (this.sidebarState === "collapsed") {
      // Collapsed → Hidden
      this.sidebarState = "hidden";
      sidebar.classList.remove("collapsed");
      sidebar.classList.add("hidden");
      
      if (sidebarToggle) {
        sidebarToggle.style.display = "none";
      }
    } else {
      // Hidden → Expanded
      this.sidebarState = "expanded";
      sidebar.classList.remove("hidden", "collapsed");
      
      // Change logo back to full version
      logoImg.src = "/ASSECT/Logo Design_ DomiHive saas 2.png";
      logoImg.alt = "DomiHive";
      logoImg.style.width = "auto"; // Reset to original size
      
      if (sidebarToggle) {
        sidebarToggle.style.display = "flex";
        sidebarToggle.innerHTML = '<i class="fas fa-chevron-left"></i>';
        sidebarToggle.title = "Collapse sidebar";
      }
    }
    
    // Save state to localStorage
    this.saveSidebarState();
    console.log(`🔄 Sidebar state changed to: ${this.sidebarState}`);
  }

  loadSidebarState() {
    const savedState = localStorage.getItem("domihive_sidebar_state");
    const sidebar = document.getElementById("dashboardSidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    
    if (!sidebar) return;
    
    if (savedState) {
      this.sidebarState = savedState;
      
      // Apply the saved state
      sidebar.classList.remove("hidden", "collapsed");
      if (savedState === "collapsed") {
        sidebar.classList.add("collapsed");
        if (sidebarToggle) {
          sidebarToggle.innerHTML = '<i class="fas fa-chevron-right"></i>';
          sidebarToggle.title = "Expand sidebar";
        }
      } else if (savedState === "hidden") {
        sidebar.classList.add("hidden");
        if (sidebarToggle) {
          sidebarToggle.style.display = "none";
        }
      } else {
        // Expanded state
        if (sidebarToggle) {
          sidebarToggle.innerHTML = '<i class="fas fa-chevron-left"></i>';
          sidebarToggle.title = "Collapse sidebar";
        }
      }
    } else {
      // Default state
      this.sidebarState = "expanded";
      if (sidebarToggle) {
        sidebarToggle.innerHTML = '<i class="fas fa-chevron-left"></i>';
        sidebarToggle.title = "Collapse sidebar";
      }
    }
    
    // Ensure mobile menu button shows correct icon
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    if (mobileMenuBtn && window.innerWidth <= 900) {
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
  }

  saveSidebarState() {
    localStorage.setItem("domihive_sidebar_state", this.sidebarState);
  }

  // ===== EXISTING: REGISTER ALL PAGES =====
  registerAllPages() {
    console.log("📄 Registering all pages...");

    // Register ALL sidebar sections
    this.registerPage("overview", "/Pages/overview-content.html");
    this.registerPage("browse", "/Pages/browse-content.html");
    this.registerPage("applications", "/Pages/applications-content.html");
    this.registerPage("tenant-property", "/Pages/tenant-property.html");
    this.registerPage("tenant-property-shortlet", "/Pages/tenant-property-shortlet.html");
    this.registerPage("tenant-property-commercial", "/Pages/tenant-property-commercial.html");
    this.registerPage("tenant-property-buy", "/Pages/tenant-property-buy.html");
    this.registerPage("my-properties", "/Pages/my-properties-content.html");
    this.registerPage("tenant-maintenance", "/Pages/tenant-maintenance.html");
    this.registerPage("maintenance", "/Pages/maintenance-content.html");
    this.registerPage("payments", "/Pages/payments-content.html");
    this.registerPage("tenant-payments", "/Pages/tenant-payments.html");
    this.registerPage("favorites", "/Pages/favorites-content.html");
    this.registerPage("messages", "/Pages/messages-content.html");
    this.registerPage("settings", "/Pages/settings-content.html");
    this.registerPage("property-details-buy", "/Pages/property-details-buy.html");
    this.registerPage("property-details-commercial", "/Pages/property-details-commercial.html"); 
    this.registerPage("property-details-shortlet", "/Pages/property-details-shortlet.html");
    this.registerPage("property-details-rent", "/Pages/property-details-rent.html");
    this.registerPage("book-inspection", "/Pages/book-inspection.html");

    console.log("✅ Registered all pages for navigation");
  }

  // ===== EXISTING: PROPERTY NAVIGATION METHODS =====
  showPropertyDetails(propertyId) {
    console.log("🏠 Navigating to property details:", propertyId);
    localStorage.setItem("current_property_id", propertyId);
    this.navigateToSection("property-details-rent");
  }

  showBookInspection(propertyId) {
    console.log("📅 Navigating to book inspection:", propertyId);
    localStorage.setItem("inspection_property_id", propertyId);
    this.navigateToSection("book-inspection");
  }

  // ===== EXISTING: GLOBAL NAVIGATION ACCESS =====
  navigateToSection(sectionId, clickedLink = null) {
    if (!this.isValidSection(sectionId)) {
      console.warn(`Invalid section: ${sectionId}`);
      this.showBlankContent();
      return;
    }

    console.log(`🔄 Global navigation to: ${sectionId}`);

    this.currentSection = sectionId;
    this.updateActiveNavLink(clickedLink);
    this.updateBreadcrumb(sectionId);
    this.updateURL(sectionId);
    
    // Auto-scroll to the active navigation item
    this.scrollToActiveNavItem(sectionId);

    this.loadSectionContent(sectionId);
  }

  // ===== EXISTING: AUTO-SCROLL TO ACTIVE NAV ITEM =====
  scrollToActiveNavItem(sectionId) {
    const sidebarNav = document.getElementById("sidebarNav");
    const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
    
    if (!sidebarNav || !activeLink) return;
    
    // Add highlight class for visual feedback
    activeLink.classList.add("scroll-highlight");
    
    // Calculate position for scrolling
    const navRect = sidebarNav.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const linkTopRelativeToNav = linkRect.top - navRect.top;
    const navMiddle = navRect.height / 2;
    
    // Calculate scroll position to center the active item
    const targetScrollTop = sidebarNav.scrollTop + linkTopRelativeToNav - navMiddle + (linkRect.height / 2);
    
    // Smooth scroll to position
    sidebarNav.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
    
    // Remove highlight after animation
    setTimeout(() => {
      activeLink.classList.remove("scroll-highlight");
    }, 1500);
  }

  // ===== EXISTING: USER SESSION MANAGEMENT =====
  async initializeUserSession() {
    console.log("🔐 Checking user session...");

    this.showAuthenticationLoading();

    const userData = localStorage.getItem("domihive_current_user");

    if (!userData) {
      console.log("❌ No user data found");
      this.redirectToLogin();
      return;
    }

    try {
      this.currentUser = JSON.parse(userData);
      this.updateUserInterface();
      console.log("✅ User session loaded successfully");
    } catch (error) {
      console.error("Session loading failed:", error);
      this.redirectToLogin();
    }
  }

  // ===== EXISTING: FIXED NAVIGATION SYSTEM =====
  initializeNavigation() {
    console.log("🔧 Initializing navigation...");

    // Sidebar navigation
    document.querySelectorAll(".nav-link[data-section]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const section = link.getAttribute("data-section");
        console.log("🖱️ Navigation clicked:", section);
        
        // On mobile, close sidebar after navigation
        if (window.innerWidth <= 900) {
          const sidebar = document.getElementById("dashboardSidebar");
          if (sidebar) {
            sidebar.classList.remove("mobile-open");
          }
        }
        
        this.navigateToSection(section, link);
      });
    });

    // User dropdown navigation
    document.querySelectorAll(".user-dropdown-item[data-section]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const section = link.getAttribute("data-section");
        console.log("👤 User dropdown clicked:", section);
        this.navigateToSection(section);
      });
    });

    console.log("✅ Navigation initialized");
  }

  // ===== EXISTING: FIXED NOTIFICATION SYSTEM =====
  async initializeNotifications() {
    await this.updateNotificationCount();
    this.updateApplicationsBadge();
    
    // Setup notification panel (replaces redirect)
    this.setupNotificationPanel();
  }

  // ===== EXISTING: FIXED: Applications Badge =====
  updateApplicationsBadge() {
    const applicationsBadge = document.getElementById("applicationsBadge");
    if (!applicationsBadge) return;

    const userApplications = JSON.parse(
      localStorage.getItem("domihive_user_applications") || "[]"
    );
    const applicationCount = userApplications.length;

    if (applicationCount > 0) {
      applicationsBadge.textContent =
        applicationCount > 99 ? "99+" : applicationCount;
      applicationsBadge.style.display = "flex";
    } else {
      applicationsBadge.style.display = "none";
    }
  }

  async updateNotificationCount() {
    try {
      const notifications = JSON.parse(
        localStorage.getItem("domihive_notifications") || "[]"
      );
      const unreadCount = notifications.filter((n) => !n.read).length;

      this.notificationCount = Math.min(unreadCount, 99);
      this.updateNotificationBadge();
    } catch (error) {
      console.error("Notification count update failed:", error);
    }
  }

  updateNotificationBadge() {
    const badge = document.getElementById("headerNotificationBadge");
    if (badge) {
      badge.textContent =
        this.notificationCount > 0
          ? this.notificationCount > 99
            ? "99+"
            : this.notificationCount
          : "0";
      badge.style.display = this.notificationCount > 0 ? "flex" : "none";
    }
  }

  // ===== EXISTING: PAGE REGISTRATION =====
  registerPage(sectionId, contentUrl) {
    this.registeredPages.set(sectionId, {
      url: contentUrl,
      loaded: false,
      content: null,
    });
  }

  // ===== EXISTING: IMPROVED CONTENT LOADING =====
  async loadSectionContent(sectionId) {
    const contentArea = document.getElementById("contentArea");
    const pageConfig = this.registeredPages.get(sectionId);

    if (!pageConfig) {
      this.showBlankContent();
      return;
    }

    console.log(`📥 Loading section: ${sectionId}`);

    // Show loading state first
    this.showBlankContent();

    try {
      const content = await this.fetchContent(pageConfig.url);

      // Update content area
      contentArea.innerHTML = content;
      contentArea.classList.add("content-loaded");

      // ✅ CRITICAL FIX: Wait for DOM to be ready before executing scripts
      await this.waitForDOMReady();
      
      // ✅ EXECUTE ALL SCRIPTS - THIS MAKES JAVASCRIPT WORK
      await this.executeScriptsInContent(contentArea);

      // ✅ INITIALIZE SPA-SPECIFIC CONTENT
      await this.initializeSPAContent(sectionId);

      console.log(`✅ Successfully loaded and executed: ${sectionId}`);
    } catch (error) {
      console.error(`❌ Failed to load ${sectionId}:`, error);
      this.showErrorContent(sectionId);
    }
  }

  // ✅ EXISTING: Wait for DOM to be ready
  waitForDOMReady() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }

  // ✅ EXISTING: Initialize all Tenant Property Sections
  async initializeTenantPropertyContent() {
    console.log('🎯 SPA: Initializing Tenant Property Content');
    await this.waitForDOMReady();
    
    if (typeof window.spaTenantPropertyInit === 'function') {
      console.log('🔄 Calling spaTenantPropertyInit');
      window.spaTenantPropertyInit();
    } else if (typeof window.initializeTenantProperty === 'function') {
      console.log('🔄 Calling initializeTenantProperty');
      window.initializeTenantProperty();
    } else if (typeof initializeTenantProperty === 'function') {
      console.log('🔄 Calling initializeTenantProperty directly');
      initializeTenantProperty();
    } else {
      console.log('⚠️ No tenant property init function found');
    }
  }

  async initializeTenantPropertyShortletContent() {
    console.log('🎯 SPA: Initializing Tenant Property Shortlet Content');
    await this.waitForDOMReady();
    
    if (typeof window.spaTenantPropertyShortletInit === 'function') {
      console.log('🔄 Calling spaTenantPropertyShortletInit');
      window.spaTenantPropertyShortletInit();
    } else if (typeof window.initializeTenantPropertyShortlet === 'function') {
      console.log('🔄 Calling initializeTenantPropertyShortlet');
      window.initializeTenantPropertyShortlet();
    } else if (typeof initializeTenantPropertyShortlet === 'function') {
      console.log('🔄 Calling initializeTenantPropertyShortlet directly');
      initializeTenantPropertyShortlet();
    } else {
      console.log('⚠️ No tenant property shortlet init function found');
    }
  }

  async initializeTenantPropertyCommercialContent() {
    console.log('🎯 SPA: Initializing Tenant Property Commercial Content');
    await this.waitForDOMReady();
    
    if (typeof window.spaTenantPropertyCommercialInit === 'function') {
      console.log('🔄 Calling spaTenantPropertyCommercialInit');
      window.spaTenantPropertyCommercialInit();
    } else if (typeof window.initializeTenantPropertyCommercial === 'function') {
      console.log('🔄 Calling initializeTenantPropertyCommercial');
      window.initializeTenantPropertyCommercial();
    } else if (typeof initializeTenantPropertyCommercial === 'function') {
      console.log('🔄 Calling initializeTenantPropertyCommercial directly');
      initializeTenantPropertyCommercial();
    } else {
      console.log('⚠️ No tenant property commercial init function found');
    }
  }

  async initializeTenantPropertyBuyContent() {
    console.log('🎯 SPA: Initializing Tenant Property Buy Content');
    await this.waitForDOMReady();
    
    if (typeof window.spaTenantPropertyBuyInit === 'function') {
      console.log('🔄 Calling spaTenantPropertyBuyInit');
      window.spaTenantPropertyBuyInit();
    } else if (typeof window.initializeTenantPropertyBuy === 'function') {
      console.log('🔄 Calling initializeTenantPropertyBuy');
      window.initializeTenantPropertyBuy();
    } else if (typeof initializeTenantPropertyBuy === 'function') {
      console.log('🔄 Calling initializeTenantPropertyBuy directly');
      initializeTenantPropertyBuy();
    } else {
      console.log('⚠️ No tenant property buy init function found');
    }
  }

  // ✅ EXISTING: Initialize SPA-specific content
  async initializeSPAContent(sectionId) {
    console.log(`🎯 Initializing SPA content for: ${sectionId}`);
    
    switch(sectionId) {
      case 'overview':
        await this.initializeOverviewContent();
        break;
      case 'tenant-property':
        await this.initializeTenantPropertyContent();
        break;
      case 'tenant-property-shortlet':
        await this.initializeTenantPropertyShortletContent();
        break;
      case 'tenant-property-commercial':
        await this.initializeTenantPropertyCommercialContent();
        break;
      case 'tenant-property-buy':
        await this.initializeTenantPropertyBuyContent();
        break;
      case 'property-details-rent':
        await this.initializePropertyDetailsContent();
        break;
      case 'property-details-shortlet':
        await this.initializePropertyDetailsShortletContent();
        break;
      case 'property-details-commercial':
        await this.initializePropertyDetailsCommercialContent();
        break;
      case 'property-details-buy':
        await this.initializePropertyDetailsBuyContent();
        break;
      // Add other sections as needed
    }
  }

  // ✅ EXISTING: Initialize Overview Content specifically
  async initializeOverviewContent() {
    console.log('🎯 SPA: Initializing Overview Content');
    
    // Wait a bit for the DOM to be fully ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Try multiple initialization methods
    if (typeof window.spaOverviewInit === 'function') {
      console.log('🔄 Calling spaOverviewInit');
      window.spaOverviewInit();
    } else if (typeof window.initializeOverview === 'function') {
      console.log('🔄 Calling initializeOverview');
      window.initializeOverview();
    } else {
      console.log('⚠️ No overview init function found, trying global scope');
      // Last resort: check for the function in global scope
      await new Promise(resolve => setTimeout(resolve, 500));
      if (typeof initializeOverview === 'function') {
        initializeOverview();
      }
    }
  }

  // ✅ EXISTING: Initialize Property Details Content
  async initializePropertyDetailsContent() {
    console.log('🎯 SPA: Initializing Property Details Content');
    
    // Wait for DOM to be ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Try multiple initialization methods
    if (typeof window.initializePropertyDetails === 'function') {
      console.log('🔄 Calling initializePropertyDetails');
      window.initializePropertyDetails();
    } else if (typeof initializePropertyDetailsPage === 'function') {
      console.log('🔄 Calling initializePropertyDetailsPage directly');
      initializePropertyDetailsPage();
    } else {
      console.log('⚠️ No property details init function found');
    }
  }

  // ✅ EXISTING: Initialize Property Details Shortlet Content
  async initializePropertyDetailsShortletContent() {
    console.log('🎯 SPA: Initializing Property Details Shortlet Content');
    
    // Wait for DOM to be ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Try multiple initialization methods
    if (typeof window.initializePropertyDetailsShortlet === 'function') {
      console.log('🔄 Calling initializePropertyDetailsShortlet');
      window.initializePropertyDetailsShortlet();
    } else if (typeof initializePropertyDetailsPage === 'function') {
      console.log('🔄 Calling initializePropertyDetailsPage directly');
      initializePropertyDetailsPage();
    } else {
      console.log('⚠️ No shortlet property details init function found');
    }
  }

  // ✅ EXISTING: Initialize Property Details Commercial Content
  async initializePropertyDetailsCommercialContent() {
    console.log('🎯 SPA: Initializing Property Details Commercial Content');
    
    // Wait for DOM to be ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Try multiple initialization methods
    if (typeof window.initializePropertyDetailsCommercial === 'function') {
      console.log('🔄 Calling initializePropertyDetailsCommercial');
      window.initializePropertyDetailsCommercial();
    } else if (typeof initializePropertyDetailsPage === 'function') {
      console.log('🔄 Calling initializePropertyDetailsPage directly');
      initializePropertyDetailsPage();
    } else {
      console.log('⚠️ No commercial property details init function found');
    }
  }

  // ✅ EXISTING: Initialize Property Details Buy Content
  async initializePropertyDetailsBuyContent() {
    console.log('🎯 SPA: Initializing Property Details Buy Content');
    
    // Wait for DOM to be ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Try multiple initialization methods
    if (typeof window.initializePropertyDetailsBuy === 'function') {
      console.log('🔄 Calling initializePropertyDetailsBuy');
      window.initializePropertyDetailsBuy();
    } else if (typeof initializePropertyDetailsPage === 'function') {
      console.log('🔄 Calling initializePropertyDetailsPage directly');
      initializePropertyDetailsPage();
    } else {
      console.log('⚠️ No buy property details init function found');
    }
  }

  // ✅ EXISTING: EXECUTE SCRIPTS IN LOADED CONTENT
  async executeScriptsInContent(contentElement) {
    const scripts = contentElement.querySelectorAll("script");
    console.log(`📜 Found ${scripts.length} scripts to execute`);

    for (const script of scripts) {
      try {
        if (script.src) {
          console.log(`📦 Loading external script: ${script.src}`);
          await this.loadExternalScript(script.src);
        } else {
          console.log(`📝 Executing inline script`);
          // Use Function constructor for better security
          new Function(script.innerHTML)();
        }
      } catch (error) {
        console.error("❌ Script execution failed:", error);
      }
    }
  }

  // ✅ EXISTING: LOAD EXTERNAL SCRIPTS
  loadExternalScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        console.log(`✅ Loaded script: ${src}`);
        resolve();
      };
      script.onerror = (error) => {
        console.error(`❌ Failed to load script: ${src}`, error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  }

  // ✅ EXISTING: FETCH CONTENT
  async fetchContent(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.text();
  }

  // ✅ EXISTING: PROPERTY DETAILS CHECKBOX FIX
  initializePropertyDetailsCheckbox() {
    console.log("🔧 Initializing property details checkbox...");

    const likeCheckbox = document.getElementById("likeCheckbox");
    const proceedButtonContainer = document.getElementById("proceedButtonContainer");

    if (likeCheckbox && proceedButtonContainer) {
      console.log("✅ Found checkbox and button container");

      // Set initial state - HIDDEN
      proceedButtonContainer.style.display = "none";
      proceedButtonContainer.style.opacity = "0";
      proceedButtonContainer.style.transition = "all 0.3s ease-in-out";

      // Remove any existing event listeners by cloning
      const newCheckbox = likeCheckbox.cloneNode(true);
      likeCheckbox.parentNode.replaceChild(newCheckbox, likeCheckbox);

      // Add new event listener
      newCheckbox.addEventListener("change", function () {
        console.log("🔘 Checkbox changed:", this.checked);
        if (this.checked) {
          proceedButtonContainer.style.display = "block";
          setTimeout(() => {
            proceedButtonContainer.style.opacity = "1";
          }, 10);
        } else {
          proceedButtonContainer.style.opacity = "0";
          setTimeout(() => {
            proceedButtonContainer.style.display = "none";
          }, 300);
        }
      });

      console.log("🎯 Property details checkbox initialized");
    }

    // Initialize book inspection button
    const bookInspectionBtn = document.getElementById("bookInspectionBtn");
    if (bookInspectionBtn) {
      const newButton = bookInspectionBtn.cloneNode(true);
      bookInspectionBtn.parentNode.replaceChild(newButton, bookInspectionBtn);

      newButton.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("📅 Book inspection clicked");

        // Get property data
        const propertyData = {
          id: document.getElementById("propertyId")?.textContent || "rent_123",
          title: document.getElementById("propertyTitle")?.textContent || "Property",
          price: document.getElementById("propertyPrice")?.textContent || "₦0/year",
          location: document.getElementById("propertyLocation")?.textContent || "Location",
        };

        localStorage.setItem("domihive_selected_property", JSON.stringify(propertyData));
        this.showNotification("Property saved! Redirecting...", "success");

        setTimeout(() => {
          this.navigateToSection("book-inspection");
        }, 1500);
      });
    }
  }

  // ===== EXISTING: COMPLETELY BLANK CONTENT =====
  showBlankContent() {
    const contentArea = document.getElementById("contentArea");
    contentArea.innerHTML = "";
    contentArea.classList.add("content-loaded");
  }

  // ===== EXISTING: ERROR CONTENT =====
  showErrorContent(sectionId) {
    const contentArea = document.getElementById("contentArea");
    contentArea.innerHTML = `
      <div class="error-section">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h2>Failed to Load Content</h2>
        <p>Could not load the ${sectionId} section. Please try again.</p>
        <button class="btn-retry" onclick="spa.navigateToSection('${sectionId}')">
          <i class="fas fa-redo"></i>
          Retry
        </button>
      </div>
    `;
  }

  // ===== EXISTING: UI COMPONENTS =====
  initializeUI() {
    const userMenuBtn = document.getElementById("userMenuBtn");
    const userDropdown = document.getElementById("userDropdown");

    if (userMenuBtn && userDropdown) {
      userMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle("show");
      });

      document.addEventListener("click", () => {
        userDropdown.classList.remove("show");
      });
    }

    // Handle mobile responsiveness for sidebar
    this.handleMobileResponsiveSidebar();
  }

  // EXISTING: Handle mobile sidebar behavior
  handleMobileResponsiveSidebar() {
    const sidebar = document.getElementById("dashboardSidebar");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    
    if (!sidebar || !mobileMenuBtn) return;
    
    // Check initial screen width
    this.updateMobileSidebarState();
    
    // Update on window resize
    window.addEventListener('resize', () => {
      this.updateMobileSidebarState();
    });
  }
  
  updateMobileSidebarState() {
    const sidebar = document.getElementById("dashboardSidebar");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    
    if (window.innerWidth <= 900) {
      // Mobile view
      sidebar.classList.remove("collapsed", "hidden");
      sidebar.classList.add("hidden"); // Start hidden on mobile
      this.sidebarState = "hidden";
      if (mobileMenuBtn) {
        mobileMenuBtn.style.display = "flex";
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    } else {
      // Desktop view - restore saved state
      this.loadSidebarState();
      if (mobileMenuBtn) {
        mobileMenuBtn.style.display = "none";
      }
    }
  }

  updateUserInterface() {
    const elements = [
      { id: "sidebarUserName", text: this.currentUser?.name },
      { id: "headerUserName", text: this.currentUser?.name },
    ];

    elements.forEach(({ id, text }) => {
      const element = document.getElementById(id);
      if (element && text) element.textContent = text;
    });

    const avatarSrc =
      this.currentUser?.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        this.currentUser?.name || "User"
      )}&background=9f7539&color=fff`;
    document.querySelectorAll("#userAvatarImg, #headerAvatarImg").forEach((img) => {
      img.src = avatarSrc;
    });
  }

  // ===== EXISTING: UTILITIES =====
  async loadInitialSection() {
    const urlParams = new URLSearchParams(window.location.search);
    const sectionFromURL = urlParams.get("section");

    const redirectSection = sessionStorage.getItem("domihive_redirect_section");

    let initialSection = "overview";

    if (sectionFromURL && this.isValidSection(sectionFromURL)) {
      initialSection = sectionFromURL;
    } else if (redirectSection && this.isValidSection(redirectSection)) {
      initialSection = redirectSection;
      sessionStorage.removeItem("domihive_redirect_section");
    }

    await this.navigateToSection(initialSection);
  }

  isValidSection(sectionId) {
    return this.registeredPages.has(sectionId);
  }

  updateActiveNavLink(clickedLink) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
    });

    if (clickedLink) {
      clickedLink.classList.add("active");
    } else {
      const currentLink = document.querySelector(
        `.nav-link[data-section="${this.currentSection}"]`
      );
      if (currentLink) currentLink.classList.add("active");
    }
  }

  updateBreadcrumb(sectionId) {
    const breadcrumbActive = document.getElementById("breadcrumbActive");
    if (!breadcrumbActive) return;

    const sectionNames = {
      overview: "Overview",
      browse: "Browse Properties",
      applications: "My Applications",
      "my-properties": "My Properties",
      maintenance: "Maintenance",
      payments: "Payments",
      favorites: "Favorites",
      messages: "Messages",
      settings: "Settings",
      "property-details-rent": "Property Details",
      "book-inspection": "Book Inspection",
    };

    breadcrumbActive.textContent =
      sectionNames[sectionId] || this.formatSectionName(sectionId);
  }

  formatSectionName(sectionId) {
    return sectionId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  updateURL(sectionId) {
    const newURL = `${window.location.pathname}?section=${sectionId}`;
    window.history.pushState({ section: sectionId }, "", newURL);
  }

  // ===== EXISTING: LOADING STATES =====
  showAuthenticationLoading() {
    const contentArea = document.getElementById("contentArea");
    if (contentArea) {
      contentArea.innerHTML = `
        <div class="auth-loading-section">
          <div class="auth-loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
          </div>
          <h2>Loading Your Dashboard</h2>
          <p>Please wait...</p>
        </div>
      `;
    }
  }

  // ===== EXISTING: NOTIFICATION SYSTEM =====
  showNotification(message, type = "success") {
    const existingNotification = document.querySelector(".global-notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.className = `global-notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas ${
        type === "success"
          ? "fa-check-circle"
          : type === "error"
          ? "fa-exclamation-triangle"
          : "fa-info-circle"
      }"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 4000);
  }

  // ===== EXISTING: ERROR HANDLING =====
  handleCriticalError(error) {
    console.error("CRITICAL ERROR:", error);
    this.showNotification("System error occurred", "error");
  }

  redirectToLogin() {
    const currentUrl = window.location.href;
    sessionStorage.setItem("domihive_login_redirect", currentUrl);
    window.location.href = "/Pages/login.html";
  }

  // ===== EXISTING: LOGOUT =====
  handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("domihive_current_user");
      localStorage.removeItem("domihive_user_avatar");
      localStorage.removeItem("domihive_remembered_phone");
      sessionStorage.clear();
      window.location.href = "/index.html";
    }
  }
}

// ===== EXISTING: GLOBAL INITIALIZATION =====
const spa = new DomiHiveEnterpriseSPA();

// ===== EXISTING: GLOBAL NAVIGATION FUNCTIONS =====
window.showPropertyDetails = function (propertyId) {
  console.log("🌐 Global: Showing property details for:", propertyId);
  if (window.spa) {
    window.spa.showPropertyDetails(propertyId);
  }
};

window.showBookInspection = function (propertyId) {
  console.log("🌐 Global: Booking inspection for:", propertyId);
  if (window.spa) {
    window.spa.showBookInspection(propertyId);
  }
};

window.navigateToSection = function (sectionId) {
  if (window.spa) {
    window.spa.navigateToSection(sectionId);
  }
};

// EXISTING: Global function to toggle sidebar state
window.toggleSidebar = function () {
  if (window.spa) {
    window.spa.toggleSidebarState();
  }
};

// NEW: Global function to close notification panel (for use in notification.js)
window.closeNotificationPanel = function() {
  if (window.spa) {
    window.spa.closeNotificationPanel();
  }
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("📄 DOM Content Loaded - Starting SPA...");
  spa.init();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
  if (event.state && event.state.section) {
    spa.navigateToSection(event.state.section);
  }
});

// Make SPA globally available
window.spa = spa;
window.handleLogout = () => spa.handleLogout();

console.log("🎯 DomiHive Enterprise SPA Framework Loaded with Three-State Sidebar and Notification Panel!");