import { useState } from 'react';

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

function MainContent({ activeSection, navItems }) {
  const title = findItemLabelByTo(navItems, activeSection) || activeSection;

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-white">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      </div>
    </main>
  );
}

export default function DashboardLayout({
  navItems = [],
  bottomItems = [],
  onLogout,
}) {
  const [activeSection, setActiveSection] = useState(
    () => navItems[0]?.to ?? ''
  );
  const [collapsed, setCollapsed] = useState(false);

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
          setActiveSection={setActiveSection}
          navItems={navItems}
          bottomItems={bottomItems}
          onLogout={onLogout}
        />

        {/* MAIN CONTENT */}
        <MainContent activeSection={activeSection} navItems={navItems} />
      </div>
    </div>
  );
}
