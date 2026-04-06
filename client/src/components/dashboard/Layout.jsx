import { useCallback, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout({
  navItems = [],
  bottomItems = [],
  onLogout,
  role = '',
  userName = '',
  children,
}) {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    if (document.documentElement.classList.contains('dark')) return true;
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const activeSection = `${location.pathname}${location.search}`;

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');

    const handleMediaChange = (event) => {
      setIsMobile(event.matches);
      if (!event.matches) {
        setMobileMenuOpen(false);
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useLayoutEffect(() => {
    if (!isMobile) return;

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, mobileMenuOpen]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="flex flex-col h-screen bg-surface font-sans transition-colors duration-200">
      <Header
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        isMobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        role={role}
        userName={userName}
      />

      <div className="flex flex-1 overflow-hidden transition-colors duration-200">
        {isMobile && mobileMenuOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={closeMobileMenu}
          />
        )}

        <Sidebar
          collapsed={collapsed}
          activeSection={activeSection}
          setActiveSection={() => {}}
          navItems={navItems}
          bottomItems={bottomItems}
          onLogout={onLogout}
          darkMode={darkMode}
          isMobile={isMobile}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={closeMobileMenu}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-canvas p-3 sm:p-4 md:p-6 transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
