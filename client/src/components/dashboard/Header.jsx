import {
  RiLogoutBoxLine,
  RiLogoutCircleRLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiMoonClearLine,
  RiSearchLine,
  RiSunLine,
  RiUser3Line,
} from 'react-icons/ri';

export default function Header({
  collapsed,
  setCollapsed,
  isMobile,
  isMobileMenuOpen,
  onToggleMobileMenu,
  darkMode,
  setDarkMode,
  onLogout,
  role,
  userName,
}) {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-surface sticky top-0 z-30 shrink-0 transition-colors duration-200">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (isMobile) {
              onToggleMobileMenu?.();
            } else {
              setCollapsed(!collapsed);
            }
          }}
          className="icon-btn text-blue-500 hover:text-blue-600"
          title={isMobile ? 'Toggle Menu' : 'Toggle Sidebar'}
        >
          {isMobile ? (
            isMobileMenuOpen ? (
              <RiMenuFoldLine size={18} />
            ) : (
              <RiMenuUnfoldLine size={18} />
            )
          ) : collapsed ? (
            <RiMenuUnfoldLine size={18} />
          ) : (
            <RiMenuFoldLine size={18} />
          )}
        </button>
        <span
          className={`font-sans font-extrabold text-[22px] sm:text-[25px] tracking-[-0.02em] select-none transition-colors duration-200 ${
            darkMode ? 'text-white' : 'text-black'
          }`}
        >
          Insight<span className="text-red-500">.</span>
        </span>
      </div>

      {/* Center: Search - Conditional for 'admin' */}
      {role === 'admin' && (
        <div className="hidden lg:flex items-center gap-2 bg-surface-raised border border-border rounded-lg px-3 py-1.5 w-80 transition-colors duration-200">
          <RiSearchLine size={14} className="text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-full text-text-primary placeholder:text-text-muted"
          />
        </div>
      )}

      {/* Right */}
      <div className="flex items-center gap-1">
        <button
          className="icon-btn"
          title={darkMode ? 'Light mode' : 'Dark mode'}
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {darkMode ? <RiSunLine size={18} /> : <RiMoonClearLine size={18} />}
        </button>

        <button
          type="button"
          className="icon-btn"
          title="Logout"
          onClick={() => onLogout?.()}
        >
          {isMobile ? (
            <RiLogoutCircleRLine size={18} color="red" />
          ) : (
            <RiLogoutBoxLine size={18} color="red" />
          )}
        </button>

        {userName ? (
          <span
            className="hidden sm:inline-flex items-center gap-1.5 ml-1 rounded-md border border-border bg-surface-raised px-2.5 py-1.5 text-xs font-semibold text-text-primary max-w-40 md:max-w-48"
            title={userName}
          >
            <RiUser3Line size={13} className="shrink-0 text-text-muted" />
            <span className="truncate">{userName}</span>
          </span>
        ) : null}
      </div>
    </header>
  );
}
