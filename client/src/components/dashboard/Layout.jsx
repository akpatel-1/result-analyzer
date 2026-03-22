import { useState } from 'react';
import { useLocation } from 'react-router-dom';

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

function MainContent({ children }) {
  return (
    <main className="flex-1 overflow-y-auto p-6 bg-white">{children}</main>
  );
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
  const activeSection =
    (findItemLabelByTo(navItems, currentRoute) && currentRoute) ||
    (findItemLabelByTo(navItems, location.pathname) && location.pathname) ||
    navItems[0]?.to ||
    '';

  return (
    <div className="flex flex-col h-screen bg-white font-sans">
      {/* HEADER */}
      <Header collapsed={collapsed} setCollapsed={setCollapsed} />

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
        />

        {/* MAIN CONTENT */}
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}
