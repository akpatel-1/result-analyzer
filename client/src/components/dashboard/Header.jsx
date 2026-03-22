import {
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiNotification3Line,
  RiSearchLine,
} from 'react-icons/ri';

export default function Header({ collapsed, setCollapsed }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white sticky top-0 z-30">
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
        <span className="font-bold text-lg tracking-tight text-slate-800">
          i<span className="text-indigo-500">nsight</span>
        </span>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2 w-64">
        <RiSearchLine className="text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400 w-full"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-500 transition-all">
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
