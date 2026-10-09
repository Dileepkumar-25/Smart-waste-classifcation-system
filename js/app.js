/**
 * EcoSort AI - Main Application Coordinator
 * Handles routing, view switching, theme toggle, mobile sidebar, notifications, modals, and directory.
 */

class EcoSortApp {
  constructor() {
    this.currentView = 'home';
    this.theme = localStorage.getItem('ecosort_theme') || 'light';
    this.user = JSON.parse(localStorage.getItem('ecosort_user')) || {
      name: "Alex Green",
      email: "alex.eco@planet.org",
      isLoggedIn: true
    };

    this.initTheme();
    this.initNavigation();
    this.initWasteGuideView();
    this.initDropoffLocator();
    this.initModals();
    this.initUserUI();
  }

  // --- THEME MANAGEMENT ---
  initTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      this.updateThemeButtonIcon(themeToggleBtn);
      themeToggleBtn.addEventListener('click', () => {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('ecosort_theme', this.theme);
        this.updateThemeButtonIcon(themeToggleBtn);
        // Refresh charts on theme switch
        if (window.EcoAnalytics) {
          window.EcoAnalytics.initCharts();
        }
      });
    }
  }

  updateThemeButtonIcon(btn) {
    if (this.theme === 'dark') {
      btn.innerHTML = `<i data-lucide="sun"></i>`;
      btn.title = "Switch to Light Mode";
    } else {
      btn.innerHTML = `<i data-lucide="moon"></i>`;
      btn.title = "Switch to Dark Mode";
    }
    if (window.lucide) window.lucide.createIcons();
  }

  // --- ROUTING & VIEWS ---
  initNavigation() {
    const navLinks = document.querySelectorAll('[data-view-target]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-view-target');
        this.navigateTo(targetView);
      });
    });

    // Mobile sidebar toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('app-sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');

    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        if (sidebarBackdrop) sidebarBackdrop.classList.toggle('open');
      });
    }

    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarBackdrop.classList.remove('open');
      });
    }

    // CTA buttons
    const heroClassifyCta = document.getElementById('hero-cta-classify');
    if (heroClassifyCta) {
      heroClassifyCta.addEventListener('click', () => this.navigateTo('classify'));
    }

    const heroGuideCta = document.getElementById('hero-cta-guide');
    if (heroGuideCta) {
      heroGuideCta.addEventListener('click', () => this.navigateTo('guide'));
    }
  }

  navigateTo(viewId) {
    const views = document.querySelectorAll('.app-view');
    views.forEach(v => v.classList.remove('active'));

    const targetElem = document.getElementById(`view-${viewId}`);
    if (targetElem) {
      targetElem.classList.add('active');
      this.currentView = viewId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav links
    const navLinks = document.querySelectorAll('[data-view-target]');
    navLinks.forEach(link => {
      if (link.getAttribute('data-view-target') === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile menu if open
    const sidebar = document.getElementById('app-sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('open');

    // Re-render icons
    if (window.lucide) window.lucide.createIcons();

    // Trigger chart resize if navigating to analytics
    if (viewId === 'analytics' && window.EcoAnalytics) {
      setTimeout(() => window.EcoAnalytics.initCharts(), 150);
    }
  }

  // --- WASTE ENCYCLOPEDIA GUIDE ---
  initWasteGuideView() {
    this.renderCategoryGrid('all');

    // Filter pills
    const guideFilters = document.querySelectorAll('.guide-filter-btn');
    guideFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        guideFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterVal = btn.dataset.filter;
        this.renderCategoryGrid(filterVal);
      });
    });

    // Guide search
    const searchInput = document.getElementById('guide-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        this.searchWasteGuide(query);
      });
    }
  }

  renderCategoryGrid(filterCategory = 'all') {
    const grid = document.getElementById('waste-guide-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const categories = Object.values(window.WASTE_CATEGORIES);

    const filtered = filterCategory === 'all' 
      ? categories 
      : categories.filter(c => c.id === filterCategory);

    filtered.forEach(cat => {
      const card = document.createElement('div');
      card.className = `guide-card category-border-${cat.id}`;
      card.innerHTML = `
        <div class="guide-card-header">
          <div class="guide-card-icon" style="background-color: ${cat.bgColor}; color: ${cat.color};">
            <i data-lucide="${cat.icon}"></i>
          </div>
          <span class="guide-badge" style="background-color: ${cat.bgColor}; color: ${cat.color}; border: 1px solid ${cat.color};">
            ${cat.badge}
          </span>
        </div>
        <h3 class="guide-card-title">${cat.name}</h3>
        <p class="guide-card-summary">${cat.summary}</p>
        
        <div class="guide-card-meta">
          <div class="meta-item">
            <span class="meta-label">Assigned Bin:</span>
            <span class="meta-val font-semibold">${cat.binName.split('(')[0]}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Lifespan:</span>
            <span class="meta-val">${cat.decomposition}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Resin / Code:</span>
            <span class="meta-val">${cat.resinCode}</span>
          </div>
        </div>

        <button class="btn btn-outline btn-sm w-full mt-3 guide-details-btn" data-category-id="${cat.id}">
          <i data-lucide="info"></i> View Full Protocol
        </button>
      `;

      grid.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();

    // Bind Detail Modal buttons
    const detailBtns = grid.querySelectorAll('.guide-details-btn');
    detailBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.dataset.categoryId;
        this.openCategoryDetailModal(catId);
      });
    });
  }

  searchWasteGuide(query) {
    const grid = document.getElementById('waste-guide-grid');
    if (!grid) return;

    if (!query) {
      this.renderCategoryGrid('all');
      return;
    }

    grid.innerHTML = '';
    const categories = Object.values(window.WASTE_CATEGORIES);
    const matches = categories.filter(cat => {
      const textMatch = cat.name.toLowerCase().includes(query) ||
                        cat.summary.toLowerCase().includes(query) ||
                        cat.resinCode.toLowerCase().includes(query) ||
                        cat.dos.some(d => d.toLowerCase().includes(query)) ||
                        cat.donts.some(d => d.toLowerCase().includes(query));
      return textMatch;
    });

    if (matches.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-10 empty-search-box">
          <p class="text-lg font-medium text-gray-500">No categories found matching "${query}".</p>
          <p class="text-sm text-gray-400 mt-1">Try searching for "plastic", "batteries", "pizza", or "cardboard".</p>
        </div>
      `;
      return;
    }

    matches.forEach(cat => {
      const card = document.createElement('div');
      card.className = `guide-card category-border-${cat.id}`;
      card.innerHTML = `
        <div class="guide-card-header">
          <div class="guide-card-icon" style="background-color: ${cat.bgColor}; color: ${cat.color};">
            <i data-lucide="${cat.icon}"></i>
          </div>
          <span class="guide-badge" style="background-color: ${cat.bgColor}; color: ${cat.color}; border: 1px solid ${cat.color};">
            ${cat.badge}
          </span>
        </div>
        <h3 class="guide-card-title">${cat.name}</h3>
        <p class="guide-card-summary">${cat.summary}</p>
        <button class="btn btn-outline btn-sm w-full mt-3 guide-details-btn" data-category-id="${cat.id}">
          <i data-lucide="info"></i> View Full Protocol
        </button>
      `;
      grid.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();

    const detailBtns = grid.querySelectorAll('.guide-details-btn');
    detailBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.openCategoryDetailModal(btn.dataset.categoryId);
      });
    });
  }

  openCategoryDetailModal(categoryId) {
    const cat = window.WASTE_CATEGORIES[categoryId];
    if (!cat) return;

    const modal = document.getElementById('category-detail-modal');
    const modalContent = document.getElementById('category-modal-body');
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
      <div class="modal-category-header" style="border-left: 5px solid ${cat.color};">
        <div>
          <span class="guide-badge" style="background-color: ${cat.bgColor}; color: ${cat.color}; border: 1px solid ${cat.color};">
            ${cat.badge}
          </span>
          <h2 class="modal-cat-title mt-1">${cat.name}</h2>
          <p class="modal-cat-bin text-emerald-700 font-semibold mt-1">
            <i data-lucide="trash-2"></i> ${cat.binName}
          </p>
        </div>
      </div>

      <div class="modal-metrics-grid mt-4">
        <div class="metric-pill">
          <span class="m-label">Decomposition</span>
          <span class="m-val">${cat.decomposition}</span>
        </div>
        <div class="metric-pill">
          <span class="m-label">Carbon Savings</span>
          <span class="m-val">${cat.carbonSavings}</span>
        </div>
        <div class="metric-pill">
          <span class="m-label">Resin Classification</span>
          <span class="m-val">${cat.resinCode}</span>
        </div>
      </div>

      <div class="modal-section mt-5">
        <h4 class="font-bold flex items-center gap-2 mb-2">
          <i data-lucide="check-square" class="text-emerald-600"></i> Step-by-Step Preparation Checklist:
        </h4>
        <ol class="checklist-steps">
          ${cat.preparationSteps.map((step, i) => `
            <li><span class="circle-idx">${i + 1}</span> <span>${step}</span></li>
          `).join('')}
        </ol>
      </div>

      <div class="dodont-split mt-5">
        <div class="dos-box">
          <h5><i data-lucide="thumbs-up" class="text-emerald-600"></i> Acceptable Items</h5>
          <ul>
            ${cat.dos.map(d => `<li><i data-lucide="check"></i> ${d}</li>`).join('')}
          </ul>
        </div>
        <div class="donts-box">
          <h5><i data-lucide="thumbs-down" class="text-red-500"></i> Contaminants (Avoid!)</h5>
          <ul>
            ${cat.donts.map(d => `<li><i data-lucide="x"></i> ${d}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="upcycle-callout mt-4">
        <strong>💡 Upcycling Inspiration:</strong> ${cat.upcyclingTip}
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  // --- DROPOFF LOCATOR DIRECTORY ---
  initDropoffLocator() {
    const facilities = [
      {
        name: "GreenEarth Central Recovery Hub",
        type: "all",
        address: "742 Evergreen Blvd, Eco District",
        distance: "0.8 miles away",
        hours: "Open Mon-Sat: 7:00 AM - 6:00 PM",
        accepted: ["Plastics #1-7", "Paper & Cardboard", "Glass", "Metals"],
        badge: "Full-Service Facility"
      },
      {
        name: "BioCycle Community Compost Yard",
        type: "organic",
        address: "128 Meadowlane Park, North Gate",
        distance: "1.4 miles away",
        hours: "Open Daily: 8:00 AM - 5:00 PM",
        accepted: ["Food Scraps", "Yard Trimmings", "Coffee Grounds"],
        badge: "Community Compost"
      },
      {
        name: "ElectroSafe Safe E-Waste Kiosk",
        type: "ewaste",
        address: "510 Tech Parkway, Cyber Center",
        distance: "2.1 miles away",
        hours: "Open Mon-Fri: 9:00 AM - 7:00 PM",
        accepted: ["Smartphones", "Batteries", "Laptops", "Circuitry"],
        badge: "Hazardous Certified"
      },
      {
        name: "PureGlass Infinite Recycling Depot",
        type: "glass",
        address: "302 Industrial Quay, Dockside",
        distance: "3.2 miles away",
        hours: "24/7 Drop-off Bins",
        accepted: ["Clear Glass", "Amber Bottles", "Green Glass"],
        badge: "Color-Sorted"
      }
    ];

    const container = document.getElementById('locator-list');
    if (!container) return;

    facilities.forEach(fac => {
      const card = document.createElement('div');
      card.className = 'locator-card';
      card.innerHTML = `
        <div class="locator-header">
          <h4 class="locator-title">${fac.name}</h4>
          <span class="locator-badge">${fac.badge}</span>
        </div>
        <p class="locator-address"><i data-lucide="map-pin"></i> ${fac.address} • <strong class="text-emerald-600">${fac.distance}</strong></p>
        <p class="locator-hours"><i data-lucide="clock"></i> ${fac.hours}</p>
        <div class="locator-tags">
          ${fac.accepted.map(t => `<span class="loc-tag">${t}</span>`).join('')}
        </div>
        <button class="btn btn-outline btn-sm mt-3 w-full" onclick="window.EcoApp.showNotification('Directions opened in navigation map!', 'info')">
          <i data-lucide="navigation"></i> Get Directions
        </button>
      `;
      container.appendChild(card);
    });
  }

  // --- MODALS ---
  initModals() {
    // Category Modal Close
    const catModal = document.getElementById('category-detail-modal');
    const closeCatBtn = document.getElementById('close-cat-modal-btn');
    if (closeCatBtn && catModal) {
      closeCatBtn.addEventListener('click', () => catModal.classList.add('hidden'));
    }

    // Login Modal
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('nav-login-btn');
    const closeLoginBtn = document.getElementById('close-login-btn');
    const loginForm = document.getElementById('login-form');

    if (loginBtn && loginModal) {
      loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.remove('hidden');
      });
    }

    if (closeLoginBtn && loginModal) {
      closeLoginBtn.addEventListener('click', () => loginModal.classList.add('hidden'));
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('login-name-input');
        const emailInput = document.getElementById('login-email-input');
        this.user.name = nameInput.value || "Eco Hero";
        this.user.email = emailInput.value || "hero@ecosort.org";
        this.user.isLoggedIn = true;
        localStorage.setItem('ecosort_user', JSON.stringify(this.user));
        this.initUserUI();
        loginModal.classList.add('hidden');
        this.showNotification(`Welcome back, ${this.user.name}!`, 'success');
      });
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
      if (e.target === catModal) catModal.classList.add('hidden');
      if (e.target === loginModal) loginModal.classList.add('hidden');
    });
  }

  initUserUI() {
    const userNameElem = document.getElementById('sidebar-user-name');
    if (userNameElem) userNameElem.textContent = this.user.name;
  }

  // --- TOAST NOTIFICATIONS ---
  showNotification(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-slide-in`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle-2';
    if (type === 'warning') iconName = 'alert-triangle';
    if (type === 'error') iconName = 'x-circle';

    toast.innerHTML = `
      <i data-lucide="${iconName}"></i>
      <span class="toast-msg">${message}</span>
    `;

    toastContainer.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.EcoApp = new EcoSortApp();
  window.EcoClassifier = new WasteClassifier();
  window.EcoAnalytics = new EcoAnalytics();
  window.EcoQuizInstance = new EcoQuiz();
  if (typeof DustbinMonitor !== 'undefined') {
    window.DustbinMonitor = new DustbinMonitor();
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
});
