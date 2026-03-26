import { MdContactSupport } from 'react-icons/md';
import {
  RiArrowRightUpLine,
  RiBuildingLine,
  RiGraduationCapLine,
  RiUserLine,
} from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const LOGIN_OPTIONS = [
  {
    key: 'admin',
    label: 'Admin',
    description: 'System-wide access and user management',
    icon: RiUserLine,
    to: '/admin/login',
    iconBg: 'bg-indigo-50 dark:bg-indigo-500/10',
    iconColor: 'text-indigo-500',
  },
  {
    key: 'department',
    label: 'Department',
    description: 'Faculty access to manage academic records',
    icon: RiBuildingLine,
    to: '/dept/login',
    iconBg: 'bg-orange-50 dark:bg-orange-500/10',
    iconColor: 'text-orange-500',
  },
  {
    key: 'student',
    label: 'Student',
    description: 'View results and academic progress',
    icon: RiGraduationCapLine,
    to: '/student/login',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    iconColor: 'text-emerald-500',
  },
];

export default function LoginSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas px-4">
      {/* Brand */}
      <div className="text-center mb-10">
        <span className="text-text-primary font-bold text-3xl tracking-tight select-none">
          Insight<span className="text-red-500">.</span>
        </span>
        <p className="text-sm text-text-muted mt-2">
          Select how you want to continue
        </p>
      </div>

      {/* 3-column login cards */}
      <div className="grid grid-cols-3 gap-3.5 w-full max-w-xl mb-3.5">
        {LOGIN_OPTIONS.map(
          ({ key, label, description, to, iconBg, iconColor }) => (
            <button
              key={key}
              onClick={() => navigate(to)}
              className="
              group relative flex flex-col gap-4 text-left
              bg-surface border border-border rounded-xl p-5
              hover:border-slate-300 dark:hover:border-slate-600
              active:scale-[0.98] transition-[border-color,transform] duration-100
            "
            >
              {/* Arrow — top right */}
              <div
                className="
              absolute top-3.5 right-3.5
              w-5 h-5 rounded-full border border-border
              flex items-center justify-center text-text-muted
              group-hover:bg-surface-raised group-hover:text-text-primary
              transition-colors duration-100
            "
              >
                <RiArrowRightUpLine size={11} />
              </div>

              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}
              >
                <Icon size={18} className={iconColor} />
              </div>

              {/* Text */}
              <div>
                <p className="text-sm font-medium text-text-primary">{label}</p>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  {description}
                </p>
              </div>
            </button>
          )
        )}
      </div>

      {/* Support strip — full width, visually separate */}
      <button
        className="
          w-full max-w-xl
          flex items-center gap-3
          bg-surface border border-border rounded-xl
          px-4 py-3
          hover:border-slate-300 dark:hover:border-slate-600
          active:scale-[0.99] transition-[border-color,transform] duration-100
        "
      >
        <div className="w-8 h-8 rounded-lg bg-surface-raised flex items-center justify-center shrink-0">
          <MdContactSupport size={16} className="text-text-muted" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-medium text-text-primary">
            Having trouble logging in?
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            Contact support if you can't access your account
          </p>
        </div>
        <span className="text-xs font-medium text-accent shrink-0">
          Get help →
        </span>
      </button>

      {/* Footer */}
      <p className="text-xs text-text-muted mt-8">
        Insight &nbsp;·&nbsp; Academic Management System
      </p>
    </div>
  );
}
