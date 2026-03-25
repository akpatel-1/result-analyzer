import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { adminApi } from '../../api/admin.api';
import Header from './Header';
import Sidebar from './Sidebar';

function findItemLabelByTo(items = [], to) {
  for (const item of items) {
    if (item.to === to) return item.label;
    if (item.children?.length) {
      const childLabel = findItemLabelByTo(item.children, to);
      if (childLabel) return childLabel;
    }
  }
  return null;
}

function MainContent({ children, darkMode }) {
  return (
    <main
      className={`flex-1 overflow-y-auto p-6 ${
        darkMode ? 'bg-slate-900' : 'bg-white'
      }`}
    >
      {children}
    </main>
  );
}

export default function DashboardLayout({
  navItems = [],
  bottomItems = [],
  onLogout,
  children,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const didVerifyRef = useRef(false);
  const currentRoute = `${location.pathname}${location.search}`;
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const activeSection =
    (findItemLabelByTo(navItems, currentRoute) && currentRoute) ||
    (findItemLabelByTo(navItems, location.pathname) && location.pathname) ||
    navItems[0]?.to ||
    '';

  useEffect(() => {
    if (didVerifyRef.current) return;
    didVerifyRef.current = true;

    let cancelled = false;

    adminApi
      .me()
      .then((res) => {
        const role = res?.data?.user?.role;
        if (!cancelled && role !== 'admin') {
          navigate('/error/403', { replace: true });
        }
      })
      .catch(() => {
        if (!cancelled) {
          navigate('/admin/login', { replace: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      return;
    }

    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, [darkMode]);

  return (
    <div
      className={`flex flex-col h-screen font-sans ${
        darkMode ? 'bg-slate-900' : 'bg-white'
      }`}
    >
      {/* HEADER */}
      <Header
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* BODY = SIDEBAR + MAIN */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar
          collapsed={collapsed}
          activeSection={activeSection}
          setActiveSection={() => {}}
          navItems={navItems}
          bottomItems={bottomItems}
          onLogout={onLogout}
          darkMode={darkMode}
        />

        {/* MAIN CONTENT */}
        <MainContent darkMode={darkMode}>{children}</MainContent>
      </div>
    </div>
  );
}
