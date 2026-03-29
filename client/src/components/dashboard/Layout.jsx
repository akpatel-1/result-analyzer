import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';

function findItemLabelByTo(items = [], to) {
  for (const item of items) {
    if (item.to === to) return item.label;
    if (item.children?.length) {
      const found = findItemLabelByTo(item.children, to);
      if (found) return found;
    }
  }
  return null;
}

export default function DashboardLayout({
  navItems = [],
  bottomItems = [],
  onLogout,
  children,
}) {
  const location = useLocation();

  const currentRoute = `${location.pathname}${location.search}`;

  const [collapsed, setCollapsed] = useState(false);

  // ── Dark mode: read once from localStorage/system, no flicker ──
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const activeSection =
    (findItemLabelByTo(navItems, currentRoute) && currentRoute) ||
    (findItemLabelByTo(navItems, location.pathname) && location.pathname) ||
    navItems[0]?.to ||
    '';

  // ── Sync dark mode to <html> class + localStorage ──
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
