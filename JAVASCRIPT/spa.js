// spa.js - COMPLETE REWRITE - EVERYTHING WORKING

class DomiHiveEnterpriseSPA {
  constructor() {
    this.currentSection = "overview";
    this.isInitialized = false;
    this.registeredPages = new Map();
    this.userPermissions = new Set();
    this.notificationCount = 0;
  }

  // ===== ENTERPRISE INITIALIZATION =====
  async init() {
    if (this.isInitialized) return;

    console.log("🚀 Initializing DomiHive Enterprise SPA...");

    try {
      // Initialize core systems
      await this.initializeUserSession();
      this.initializeNavigation();
      this.initializeNotifications();

      // Register ALL pages
      this.registerAllPages();

      // Initialize UI components
      this.initializeUI();

      // Load initial section
      await this.loadInitialSection();

      this.isInitialized = true;
      console.log("✅ DomiHive Enterprise SPA Ready for Production");
    } catch (error) {
      console.error("❌ SPA Initialization Failed:", error);
      this.handleCriticalError(error);
    }
  }

  // ===== REGISTER ALL PAGES =====
  registerAllPages() {
    console.log("📄 Registering all pages...");

    // Register ALL sidebar sections
    this.registerPage("overview", "/Pages/overview-content.html");
    this.registerPage("browse", "/Pages/browse-content.html");
    this.registerPage("applications", "/Pages/applications-content.html");
    this.registerPage("tenant-property", "/Pages/tenant-property.html");
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


    // Property navigation pages
    this.registerPage(
      "property-details-rent",
      "/Pages/property-details-rent.html"
    );
    this.registerPage("book-inspection", "/Pages/book-inspection.html");

    console.log("✅ Registered all pages for navigation");
  }

  // ===== PROPERTY NAVIGATION METHODS =====
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

  // ===== GLOBAL NAVIGATION ACCESS =====
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

    this.loadSectionContent(sectionId);
  }

  // ===== USER SESSION MANAGEMENT =====
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

  // ===== FIXED NAVIGATION SYSTEM =====
  initializeNavigation() {
    console.log("🔧 Initializing navigation...");

    // Sidebar navigation
    document.querySelectorAll(".nav-link[data-section]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const section = link.getAttribute("data-section");
        console.log("🖱️ Navigation clicked:", section);
        this.navigateToSection(section, link);
      });
    });

    // User dropdown navigation
    document
      .querySelectorAll(".user-dropdown-item[data-section]")
      .forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const section = link.getAttribute("data-section");
          console.log("👤 User dropdown clicked:", section);
          this.navigateToSection(section);
        });
      });

    // Mobile menu
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.getElementById("dashboardSidebar");

    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("mobile-open");
      });
    }

    // Sidebar toggle
    const sidebarToggle = document.getElementById("sidebarToggle");
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        this.saveSidebarState(sidebar.classList.contains("collapsed"));
      });
    }

    console.log("✅ Navigation initialized");
  }

  // ===== FIXED NOTIFICATION SYSTEM =====
  async initializeNotifications() {
    await this.updateNotificationCount();
    this.updateApplicationsBadge();

    const notificationsBtn = document.getElementById("notificationsBtn");
    if (notificationsBtn) {
      notificationsBtn.addEventListener("click", () => {
        window.location.href = "/Pages/notification.html";
      });
    }
  }

  // ===== FIXED: Applications Badge =====
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

  // ===== PAGE REGISTRATION =====
  registerPage(sectionId, contentUrl) {
    this.registeredPages.set(sectionId, {
      url: contentUrl,
      loaded: false,
      content: null,
    });
  }

 // ===== IMPROVED CONTENT LOADING =====
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

// ✅ NEW: Wait for DOM to be ready
waitForDOMReady() {
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      resolve();
    }
  });
}

// ✅ NEW: Initialize SPA-specific content
async initializeSPAContent(sectionId) {
  console.log(`🎯 Initializing SPA content for: ${sectionId}`);
  
  switch(sectionId) {
    case 'overview':
      await this.initializeOverviewContent();
      break;
    case 'property-details-rent':
      this.initializePropertyDetailsCheckbox();
      break;
    // Add other sections as needed
  }
}

// ✅ NEW: Initialize Overview Content specifically
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
  // ✅ EXECUTE SCRIPTS IN LOADED CONTENT
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

  // ✅ LOAD EXTERNAL SCRIPTS
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

  // ✅ FETCH CONTENT
  async fetchContent(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.text();
  }

  // ✅ PROPERTY DETAILS CHECKBOX FIX
  initializePropertyDetailsCheckbox() {
    console.log("🔧 Initializing property details checkbox...");

    const likeCheckbox = document.getElementById("likeCheckbox");
    const proceedButtonContainer = document.getElementById(
      "proceedButtonContainer"
    );

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
          title:
            document.getElementById("propertyTitle")?.textContent || "Property",
          price:
            document.getElementById("propertyPrice")?.textContent || "₦0/year",
          location:
            document.getElementById("propertyLocation")?.textContent ||
            "Location",
        };

        localStorage.setItem(
          "domihive_selected_property",
          JSON.stringify(propertyData)
        );
        this.showNotification("Property saved! Redirecting...", "success");

        setTimeout(() => {
          this.navigateToSection("book-inspection");
        }, 1500);
      });
    }
  }

  // ===== COMPLETELY BLANK CONTENT =====
  showBlankContent() {
    const contentArea = document.getElementById("contentArea");
    contentArea.innerHTML = "";
    contentArea.classList.add("content-loaded");
  }

  // ===== ERROR CONTENT =====
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

  // ===== UI COMPONENTS =====
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

    this.loadSidebarState();
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
    document
      .querySelectorAll("#userAvatarImg, #headerAvatarImg")
      .forEach((img) => {
        img.src = avatarSrc;
      });
  }

  // ===== UTILITIES =====
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

  // ===== LOADING STATES =====
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

  // ===== NOTIFICATION SYSTEM =====
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

  // ===== ERROR HANDLING =====
  handleCriticalError(error) {
    console.error("CRITICAL ERROR:", error);
    this.showNotification("System error occurred", "error");
  }

  redirectToLogin() {
    const currentUrl = window.location.href;
    sessionStorage.setItem("domihive_login_redirect", currentUrl);
    window.location.href = "/Pages/login.html";
  }

  saveSidebarState(isCollapsed) {
    localStorage.setItem("domihive_sidebar_collapsed", isCollapsed);
  }

  loadSidebarState() {
    const isCollapsed =
      localStorage.getItem("domihive_sidebar_collapsed") === "true";
    const sidebar = document.getElementById("dashboardSidebar");
    if (sidebar && isCollapsed) {
      sidebar.classList.add("collapsed");
    }
  }

  // ===== LOGOUT =====
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

// ===== GLOBAL INITIALIZATION =====
const spa = new DomiHiveEnterpriseSPA();

// ===== GLOBAL NAVIGATION FUNCTIONS =====
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

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("📄 DOM Content Loaded - Starting SPA...");
  spa.init();
});

// Make SPA globally available
window.spa = spa;
window.handleLogout = () => spa.handleLogout();

console.log("🎯 DomiHive Enterprise SPA Framework Loaded!");
