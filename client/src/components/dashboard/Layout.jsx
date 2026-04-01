import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout({
  navItems = [],
  bottomItems = [],
  onLogout,
  role = '',
  children,
}) {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Simplified: use pathname as activeSection; findItemLabelByTo returns the actual route
  const activeSection = location.pathname;

  useEffect(() => {
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
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        role={role}
      />

      <div className="flex flex-1 overflow-hidden transition-colors duration-200">
        <Sidebar
          collapsed={collapsed}
          activeSection={activeSection}
          setActiveSection={() => {}} 
          navItems={navItems}
          bottomItems={bottomItems}
          onLogout={onLogout}
          darkMode={darkMode}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-canvas transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
