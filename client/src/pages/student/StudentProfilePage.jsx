import { useCallback, useEffect, useState } from 'react';
import {
  FiAward,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiCopy,
  FiCreditCard,
  FiHash,
  FiMail,
  FiRefreshCw,
  FiUser,
} from 'react-icons/fi';

import { studentApi } from '../../api/student.api';
import { useAuthStore } from '../../store/user.auth.store';

const FIELD_ICONS = {
  Email: FiMail,
  'Roll Number': FiHash,
  'Course / Branch': FiBookOpen,
  'Enrollment ID': FiCreditCard,
  'ABC ID': FiAward,
  Batch: FiCalendar,
};

function Field({ label, value, copyable = false }) {
  const [copied, setCopied] = useState(false);
  const displayValue = value || '—';
  const Icon = FIELD_ICONS[label] || FiHash;

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="group relative flex items-start gap-3 rounded-xl border border-border bg-surface-raised p-4 transition-all duration-200 hover:border-accent/40 hover:shadow-sm">
      {/* Icon badge */}
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <Icon size={15} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          {label}
        </p>
        <p className="mt-1 break-all text-sm font-semibold text-text-primary leading-snug">
          {displayValue}
        </p>
      </div>

      {copyable && value && (
        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-3 top-3 rounded-md p-1.5 text-text-muted opacity-0 transition-all duration-150 hover:bg-accent/10 hover:text-accent group-hover:opacity-100"
          title={`Copy ${label}`}
        >
          {copied ? (
            <FiCheckCircle size={13} className="text-green-500" />
          ) : (
            <FiCopy size={13} />
          )}
        </button>
      )}
    </div>
  );
}

function CgpaRing({ value }) {
  const max = 10;
  const pct = Math.min((value / max) * 100, 100);
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  const color =
    value >= 8
      ? '#22c55e'
      : value >= 6.5
        ? '#3b82f6'
        : value >= 5
          ? '#f59e0b'
          : '#ef4444';

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90">
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            className="text-border"
          />
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold text-text-primary leading-none">
            {value}
          </span>
          <span className="text-[9px] font-medium uppercase tracking-widest text-text-muted">
            CGPA
          </span>
        </div>
      </div>
      <div />
    </div>
  );
}

export default function StudentProfilePage() {
  const { student, isLoading: isAuthLoading, fetchMe } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [backlogs, setBacklogs] = useState([]);
  const [cgpa, setCgpa] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [error, setError] = useState('');

  const studentData = student?.user || student;

  const loadProfile = useCallback(async () => {
    const baseProfile = {
      name: studentData?.name,
      email: studentData?.email,
      roll_no: studentData?.roll_no,
      branch: studentData?.branch,
      enroll_id: studentData?.enroll_id,
      abc_id: studentData?.abc_id,
      batch: studentData?.batch,
    };

    try {
      setIsProfileLoading(true);
      setError('');
      const response = await studentApi.profile();
      const payload = response?.data?.profile || {};
      setProfile(payload?.profile || baseProfile || null);
      setBacklogs(Array.isArray(payload?.backlogs) ? payload.backlogs : []);
      setCgpa(payload?.cgpa || null);
    } catch (err) {
      setProfile((prev) => prev || baseProfile || null);
      setError(err?.response?.data?.message || 'Unable to fetch profile data.');
    } finally {
      setIsProfileLoading(false);
    }
  }, [studentData]);

  useEffect(() => {
    if (!student) {
      fetchMe();
    }
  }, [student, fetchMe]);

  useEffect(() => {
    loadProfile();
  }, [student, loadProfile]);

  const isLoading = isAuthLoading || isProfileLoading;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-sm text-text-muted">Loading profile...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <p className="text-sm text-text-primary">{error}</p>
        <button
          type="button"
          className="btn-primary mt-4"
          onClick={loadProfile}
        >
          <FiRefreshCw size={14} />
          <span className="ml-2">Retry</span>
        </button>
      </div>
    );
  }

  const initials = profile?.name
    ?.split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const hasBacklogs = backlogs.length > 0;
  const cgpaSemesters = Array.isArray(cgpa?.semesters) ? cgpa.semesters : [];

  return (
    <section className="mx-auto animate-fade-up space-y-4">
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-xl font-extrabold text-accent">
              {initials || <FiUser size={24} />}
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-text-primary">
                {profile?.name}
              </h1>
              <p className="mt-0.5 max-w-xs text-xs text-text-muted leading-relaxed">
                Shri Shankaracharya Institute Of Professional Management &amp;
                Technology, Raipur
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
              <FiBookOpen size={11} />
              SSIPMT, Raipur
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                hasBacklogs
                  ? ' text-red-600  dark:text-red-400'
                  : 'border-accent/30 bg-accent/10 text-accent dark:border-accent/40 dark:bg-accent/20 dark:text-accent'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${hasBacklogs ? 'bg-red-500' : 'bg-green-500'}`}
              />
              {hasBacklogs
                ? `${backlogs.length} Backlog${backlogs.length > 1 ? 's' : ''}`
                : 'No Backlogs'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Email" value={profile?.email} copyable />
        <Field label="Roll Number" value={profile?.roll_no} copyable />
        <Field label="Course / Branch" value={profile?.branch} />
        <Field label="Enrollment ID" value={profile?.enroll_id} copyable />
        <Field label="ABC ID" value={profile?.abc_id} copyable />
        <Field
          label="Batch"
          value={profile?.batch ? String(profile.batch) : ''}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface-raised p-5">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
            Cumulative GPA
          </p>
          <div className="flex items-center gap-5">
            {cgpa?.value != null ? (
              <CgpaRing value={cgpa.value} />
            ) : (
              <span className="text-2xl font-extrabold text-text-primary">
                -
              </span>
            )}
            <div className="space-y-1">
              <p className="text-xs text-text-muted">Based on semesters</p>
              <div className="flex flex-wrap gap-1.5">
                {cgpaSemesters.length ? (
                  cgpaSemesters.map((sem) => (
                    <span
                      key={sem}
                      className="rounded-md border border-border bg-surface px-2 py-0.5 text-xs font-semibold text-text-secondary"
                    >
                      Sem {sem}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-text-muted">Not available</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface-raised p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
            Backlog Status
          </p>

          {hasBacklogs ? (
            <div className="space-y-2">
              {backlogs.map((item, index) => (
                <p
                  key={`${item?.semester}-${item?.subject_name}-${index}`}
                  className="text-sm font-semibold text-red-600 dark:text-red-400"
                >
                  {item?.subject_name || 'Subject not available'}
                </p>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FiCheckCircle size={18} className="text-green-500" />
              <p className="text-lg font-bold text-green-700 dark:text-green-400">
                All clear - no backlogs!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
