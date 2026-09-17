import React from 'react';
import type { SectionType } from '../types';
import { useData } from '../context/DataContext';

interface SidebarProps {
  currentSection: SectionType;
  setSection: (section: SectionType) => void;
  mobileActive: boolean;
  setMobileActive: (active: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  setSection,
  mobileActive,
  setMobileActive
}) => {
  const { categories, works, blogs, partners, services, faqs, statistics } = useData();

  const handleNavClick = (section: SectionType) => {
    setSection(section);
    setMobileActive(false);
    window.location.hash = section;
  };

  return (
    <aside className={`sidebar ${mobileActive ? 'mobile-active' : ''}`} id="sidebar">
      <div className="sidebar-logo">
        <div className="logo-dot">M</div>
        <span className="logo-text">Manzio Admin</span>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-label">Main</span>
        <button
          onClick={() => handleNavClick('dashboard')}
          className={`nav-item item-dashboard ${currentSection === 'dashboard' ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="9" rx="1"></rect><rect x="14" y="3" width="7" height="5" rx="1"></rect><rect x="14" y="12" width="7" height="9" rx="1"></rect><rect x="3" y="16" width="7" height="5" rx="1"></rect></svg>
          </span>
          <span className="nav-text">Dashboard</span>
        </button>

        <span className="nav-label">Content</span>
        <button
          onClick={() => handleNavClick('categories')}
          className={`nav-item item-categories ${currentSection === 'categories' ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2H2v10l9.29 9.29c.39.39 1.02.39 1.41 0l7.59-7.59c.39-.39.39-1.02 0-1.41L12 2z"></path><path d="M7 7h.01"></path></svg>
          </span>
          <span className="nav-text">Categories</span>
          <span className="nav-badge">{categories.length}</span>
        </button>

        <button
          onClick={() => handleNavClick('works')}
          className={`nav-item item-works ${currentSection === 'works' ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </span>
          <span className="nav-text">Works</span>
          <span className="nav-badge">{works.length}</span>
        </button>

        <button
          onClick={() => handleNavClick('blogs')}
          className={`nav-item item-blogs ${currentSection === 'blogs' ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>
          </span>
          <span className="nav-text">Blogs</span>
          <span className="nav-badge">{blogs.length}</span>
        </button>

        <button
          onClick={() => handleNavClick('services')}
          className={`nav-item item-services ${currentSection === 'services' ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          </span>
          <span className="nav-text">Services</span>
          <span className="nav-badge">{services.length}</span>
        </button>

        <button
          onClick={() => handleNavClick('faq')}
          className={`nav-item item-faq ${currentSection === 'faq' ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </span>
          <span className="nav-text">FAQ</span>
          <span className="nav-badge">{faqs.length}</span>
        </button>

        <button
          onClick={() => handleNavClick('statistics')}
          className={`nav-item item-statistics ${currentSection === 'statistics' ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          </span>
          <span className="nav-text">Statistics</span>
          <span className="nav-badge">{statistics.length}</span>
        </button>

        <button
          onClick={() => handleNavClick('partners')}
          className={`nav-item item-partners ${currentSection === 'partners' ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </span>
          <span className="nav-text">Partners</span>
          <span className="nav-badge">{partners.length}</span>
        </button>

        <span className="nav-label">System</span>
        <button
          onClick={() => handleNavClick('settings')}
          className={`nav-item item-settings ${currentSection === 'settings' ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </span>
          <span className="nav-text">Settings</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="secure-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>Secure Admin Area</span>
        </div>
      </div>
    </aside>
  );
};
