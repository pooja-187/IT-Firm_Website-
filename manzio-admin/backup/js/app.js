function closeModal() {
  const modal = document.getElementById('modal-overlay');
  modal.classList.remove('active');
}

const App = {
  currentSection: 'dashboard',

  init() {
    DataStore.init();

    // Check auth
    if (Auth.isAuthenticated()) {
      this.showDashboard();
    } else {
      this.showLogin();
    }

    // Login form handler
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      const errorEl = document.getElementById('login-error');
      if (Auth.login(username, password)) {
        errorEl.classList.remove('show');
        App.showDashboard();
      } else {
        errorEl.textContent = 'Invalid username or password';
        errorEl.classList.add('show');
      }
    });

    // Hash routing
    window.addEventListener('hashchange', () => this.route());

    // Logout button
    document.getElementById('logout-btn').addEventListener('click', () => {
      Auth.logout();
      this.showLogin();
    });

    // Sidebar toggle (mobile)
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('mobile-active');
      });
    }

    // Close modal on overlay click
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') closeModal();
    });
  },

  startClock() {
    const clockEl = document.getElementById('clock-time');
    if (!clockEl) return;
    
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const hoursStr = String(hours).padStart(2, '0');
      clockEl.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>${hoursStr}:${minutes}:${seconds} ${ampm}</span>
      `;
    };
    
    updateTime();
    if (this.clockInterval) clearInterval(this.clockInterval);
    this.clockInterval = setInterval(updateTime, 1000);
  },

  stopClock() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  },

  showLogin() {
    this.stopClock();
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('dashboard').classList.remove('active');
    window.location.hash = '';
  },

  showDashboard() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard').classList.add('active');
    if (!window.location.hash || window.location.hash === '#') {
      window.location.hash = '#dashboard';
    }
    this.route();
    this.startClock();
  },

  route() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    this.currentSection = hash;

    // Close mobile sidebar if open
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('mobile-active');

    // Update active nav
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.section === hash);
    });

    // Update header
    const titles = {
      dashboard: { title: 'Dashboard', subtitle: 'Welcome back, Admin!' },
      categories: { title: 'Categories', subtitle: 'Manage your categories' },
      works: { title: 'Works', subtitle: 'Manage your portfolio works' },
      blogs: { title: 'Blogs', subtitle: 'Manage your blog posts' },
      partners: { title: 'Partners', subtitle: 'Manage your partners' },
      settings: { title: 'Settings', subtitle: 'Configure your dashboard' }
    };
    const titleInfo = titles[hash] || titles.dashboard;
    document.getElementById('page-title').textContent = titleInfo.title;
    document.getElementById('page-subtitle').textContent = titleInfo.subtitle;

    // Show correct section
    document.querySelectorAll('.content-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === `${hash}-content`);
    });

    // Render section content
    switch (hash) {
      case 'dashboard': Dashboard.render(); break;
      case 'categories': Categories.render(); break;
      case 'works': Works.render(); break;
      case 'blogs': Blogs.render(); break;
      case 'partners': Partners.render(); break;
      case 'settings': Settings.render(); break;
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
