import React, { useState, useEffect } from 'react';
import type { SectionType, ToastMessage } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { StatsGrid } from './components/StatsGrid';
import { Login } from './views/Login';
import { Dashboard } from './views/Dashboard';
import { Categories } from './views/Categories';
import { Works } from './views/Works';
import { Blogs } from './views/Blogs';
import { Partners } from './views/Partners';
import { Services } from './views/Services';
import { FAQView as FAQ } from './views/FAQ';
import { Statistics } from './views/Statistics';
import { Settings } from './views/Settings';
import { DataProvider } from './context/DataContext';
import { apiService } from './utils/api';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('manzio_react_token') !== null;
  });

  const [currentSection, setSection] = useState<SectionType>(() => {
    const hash = window.location.hash.replace('#', '') as SectionType;
    return ['dashboard', 'categories', 'works', 'blogs', 'services', 'faq', 'statistics', 'partners', 'settings'].includes(hash)
      ? hash
      : 'dashboard';
  });

  const [mobileActive, setMobileActive] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Synchronize state with Hash Routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as SectionType;
      if (['dashboard', 'categories', 'works', 'blogs', 'services', 'faq', 'statistics', 'partners', 'settings'].includes(hash)) {
        setSection(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLoginSuccess = (token: string, username: string) => {
    sessionStorage.setItem('manzio_react_token', token);
    sessionStorage.setItem('manzio_react_user', username);
    setIsAuthenticated(true);
    window.location.hash = 'dashboard';
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      await apiService.auth.logout();
    } catch (e) {
      console.error('Logout request failed:', e);
    }
    sessionStorage.clear();
    setIsAuthenticated(false);
    window.location.hash = '';
    window.location.reload();
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'categories':
        return <Categories showToast={showToast} />;
      case 'works':
        return <Works showToast={showToast} />;
      case 'blogs':
        return <Blogs showToast={showToast} />;
      case 'services':
        return <Services showToast={showToast} />;
      case 'faq':
        return <FAQ showToast={showToast} />;
      case 'statistics':
        return <Statistics showToast={showToast} />;
      case 'partners':
        return <Partners showToast={showToast} />;
      case 'settings':
        return <Settings showToast={showToast} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <div className="dashboard active" id="dashboard">
        <Sidebar
          currentSection={currentSection}
          setSection={setSection}
          mobileActive={mobileActive}
          setMobileActive={setMobileActive}
        />
        
        {/* Mobile menu glass overlay */}
        {mobileActive && (
          <div 
            className="modal-overlay active" 
            style={{ zIndex: 99, background: 'rgba(0,0,0,0.15)' }} 
            onClick={() => setMobileActive(false)}
          />
        )}

        <div className="main-content">
          <Header
            currentSection={currentSection}
            onLogout={handleLogout}
            setMobileActive={setMobileActive}
          />
          <main className="content-area">
            <StatsGrid />
            <div className="content-section active" style={{ animation: 'none', display: 'block' }}>
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      {/* Floating Notifications Toaster */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            toast={toast} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </DataProvider>
  );
};
export default App;
