import {
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiMoonClearLine,
  RiNotification3Line,
  RiSearchLine,
  RiSunLine,
} from 'react-icons/ri';

export default function Header({
  collapsed,
  setCollapsed,
  darkMode,
  setDarkMode,
}) {
  return (
    <header
      className={`h-16 flex items-center justify-between px-6 border-b sticky top-0 z-30 ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      {/* Left: Toggle + Brand */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-all"
          title="Toggle Sidebar"
        >
          {collapsed ? (
            <RiMenuUnfoldLine size={20} />
          ) : (
            <RiMenuFoldLine size={20} />
          )}
        </button>
        <span
          className={`font-bold text-lg tracking-tight ${
            darkMode ? 'text-slate-100' : 'text-slate-800'
          }`}
        >
          i<span className="text-indigo-500">nsight</span>
        </span>
      </div>

      {/* Center: Search */}
      <div
        className={`hidden md:flex items-center gap-2 rounded-xl px-4 py-2 w-64 ${
          darkMode ? 'bg-slate-800' : 'bg-slate-100'
        }`}
      >
        <RiSearchLine
          className={darkMode ? 'text-slate-500' : 'text-slate-400'}
          size={16}
        />
        <input
          type="text"
          placeholder="Search anything..."
          className={`bg-transparent outline-none text-sm w-full ${
            darkMode
              ? 'text-slate-200 placeholder-slate-500'
              : 'text-slate-600 placeholder-slate-400'
          }`}
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button
          className={`p-2 rounded-lg hover:text-indigo-500 transition-all ${
            darkMode
              ? 'text-slate-300 hover:bg-slate-800'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {darkMode ? <RiSunLine size={20} /> : <RiMoonClearLine size={20} />}
        </button>

        {/* Notifications */}
        <button
          className={`relative p-2 rounded-lg hover:text-indigo-500 transition-all ${
            darkMode
              ? 'text-slate-300 hover:bg-slate-800'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <RiNotification3Line size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}
