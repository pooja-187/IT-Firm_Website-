import React, { useState, useEffect } from 'react';
import type { SectionType } from '../types';

interface HeaderProps {
  currentSection: SectionType;
  onLogout: () => void;
  setMobileActive: (active: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  onLogout,
  setMobileActive
}) => {
  const [timeStr, setTimeStr] = useState('10:11:36 AM');

  // Live ticking clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // '0' becomes '12'
      const hoursStr = String(hours).padStart(2, '0');
      setTimeStr(`${hoursStr}:${minutes}:${seconds} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const titles: Record<SectionType, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard Overview', subtitle: 'Welcome back, Admin!' },
    categories: { title: 'Categories Management', subtitle: 'Organize your portfolio and articles' },
    works: { title: 'Works Management', subtitle: 'Manage your content efficiently' },
    blogs: { title: 'Blogs Management', subtitle: 'Write and publish editorial articles' },
    services: { title: 'Services Offered', subtitle: 'Manage software development and design services' },
    faq: { title: 'FAQ Management', subtitle: 'Manage Frequently Asked Questions' },
    statistics: { title: 'Statistics Accomplishments', subtitle: 'Configure metrics and dashboard figures' },
    partners: { title: 'Partners Directory', subtitle: 'Configure corporate associations' },
    settings: { title: 'Admin Settings', subtitle: 'Manage credentials and storage configurations' }
  };

  const currentMeta = titles[currentSection] || titles.dashboard;

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="sidebar-toggle"
          id="sidebar-toggle"
          aria-label="Toggle sidebar"
          onClick={() => setMobileActive(true)}
          style={{ display: 'none' }} /* controlled via CSS for responsiveness */
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="header-title">
          <h1 id="page-title">{currentMeta.title}</h1>
          <p id="page-subtitle">{currentMeta.subtitle}</p>
        </div>
      </div>
      <div className="header-right">
        {/* Live Clock widget */}
        <div className="header-clock" id="header-clock">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span id="clock-time">{timeStr}</span>
        </div>
        {/* Logout Button */}
        <button className="logout-btn" id="logout-btn" onClick={onLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
