import { FaGithub } from 'react-icons/fa';
import {
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiMoonClearLine,
  RiSearchLine,
  RiSunLine,
} from 'react-icons/ri';

export default function Header({
  collapsed,
  setCollapsed,
  darkMode,
  setDarkMode,
  role,
}) {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-surface sticky top-0 z-30 shrink-0 transition-colors duration-200">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="icon-btn text-blue-500 hover:text-blue-600"
          title="Toggle Sidebar"
        >
          {collapsed ? (
            <RiMenuUnfoldLine size={18} />
          ) : (
            <RiMenuFoldLine size={18} />
          )}
        </button>
        <span
          className={`font-sans font-extrabold text-[25px] tracking-[-0.02em] select-none transition-colors duration-200 ${
            darkMode ? 'text-white' : 'text-black'
          }`}
        >
          Insight<span className="text-red-500">.</span>
        </span>
      </div>

      {/* Center: Search - Conditional for 'admin' */}
      {role === 'admin' && (
        <div className="hidden md:flex items-center gap-2 bg-surface-raised border border-border rounded-lg px-3 py-1.5 w-86 transition-colors duration-200">
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

        {/* GitHub Link replacing Notification icon */}
        <a
          href="https://github.com/akpatel-1/result-analyzer"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn"
          title="View GitHub Repository"
        >
          <FaGithub size={18} />
        </a>
      </div>
    </header>
  );
}
