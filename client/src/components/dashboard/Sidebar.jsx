import { useEffect, useState } from 'react';
import { RiArrowDownSLine, RiLogoutBoxLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

function isRouteMatch(activeSection = '', route = '') {
  if (!activeSection || !route) return false;

  const cleanActive = String(activeSection).split('#')[0];
  const cleanRoute = String(route).split('#')[0];

  return (
    cleanActive === cleanRoute ||
    cleanActive.startsWith(`${cleanRoute}/`) ||
    cleanActive.startsWith(`${cleanRoute}?`)
  );
}

function findActiveChildColor(children = [], activeSection = '') {
  for (const child of children) {
    if (isRouteMatch(activeSection, child.to)) return child.color;
    if (child.children?.length) {
      const nestedColor = findActiveChildColor(child.children, activeSection);
      if (nestedColor) return nestedColor;
    }
  }
  return null;
}

function NavButton({
  item,
  activeSection,
  setActiveSection,
  collapsed,
  navigate,
  depth = 0,
}) {
  const { label, icon: Icon, to, color, children } = item;

  const hasChildren = children && children.length > 0;
  const activeChildColor = hasChildren
    ? findActiveChildColor(children, activeSection)
    : null;
  const isDirectActive = isRouteMatch(activeSection, to);
  const isActive = isDirectActive || Boolean(activeChildColor);
  const resolvedActiveColor = activeChildColor || color;

  const [open, setOpen] = useState(Boolean(activeChildColor));

  useEffect(() => {
    if (hasChildren && activeChildColor) {
      setOpen(true);
    }
  }, [hasChildren, activeChildColor]);

  function handleClick() {
    if (hasChildren) {
      if (!collapsed) setOpen((prev) => !prev);
      if (to) {
        setActiveSection(to);
        navigate(to);
      }
    } else {
      setActiveSection(to);
      if (to) navigate(to);
    }
  }

  return (
    <div>
      {/* Main button */}
      <button
        onClick={handleClick}
        title={collapsed ? label : ''}
        style={isActive ? { color: resolvedActiveColor } : {}}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
          ${depth > 0 ? 'pl-8' : ''}
          ${
            isActive
              ? 'bg-indigo-50'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
          }
        `}
      >
        {/* Icon — colored when active, uses item color */}
        <Icon
          size={20}
          className="shrink-0"
          style={{ color: isActive ? resolvedActiveColor : undefined }}
        />

        {/* Label — hidden when collapsed */}
        {!collapsed && <span className="flex-1 text-left">{label}</span>}

        {/* Chevron for items with children */}
        {!collapsed && hasChildren && (
          <RiArrowDownSLine
            size={16}
            className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        )}

        {/* Active dot for leaf items */}
        {!collapsed && !hasChildren && isActive && (
          <span
            className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: resolvedActiveColor }}
          />
        )}
      </button>

      {/* Children (submenu) — shown when open and not collapsed */}
      {hasChildren && open && !collapsed && (
        <div className="mt-1 flex flex-col gap-1">
          {children.map((child) => (
            <NavButton
              key={child.to}
              item={child}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              collapsed={collapsed}
              navigate={navigate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({
  collapsed,
  activeSection,
  setActiveSection,
  navItems = [],
  bottomItems = [],
  onLogout,
}) {
  const navigate = useNavigate();

  return (
    <aside
      className={`
        ${collapsed ? 'w-16' : 'w-60'}
        flex flex-col h-full bg-white border-r border-slate-200
        transition-all duration-300 ease-in-out shrink-0
      `}
    >
      {/* ── Main Nav Items ── */}
      <nav className="flex-1 py-6 flex flex-col gap-1 px-2 overflow-y-auto">
        {!collapsed && (
          <p className="text-xs font-semibold text-slate-400 uppercase px-3 mb-2 tracking-widest">
            Menu
          </p>
        )}

        {navItems.map((item) => (
          <NavButton
            key={item.to}
            item={item}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            collapsed={collapsed}
            navigate={navigate}
          />
        ))}
      </nav>

      {/* ── Bottom Items + Logout ── */}
      <div className="py-4 px-2 border-t border-slate-200 flex flex-col gap-1">
        {bottomItems.map((item) => (
          <NavButton
            key={item.to}
            item={item}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            collapsed={collapsed}
            navigate={navigate}
          />
        ))}

        {/* Logout — always at the bottom */}
        <button
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-200 hover:text-red-500 transition-all"
          title={collapsed ? 'Logout' : ''}
          onClick={onLogout}
        >
          <RiLogoutBoxLine size={20} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
