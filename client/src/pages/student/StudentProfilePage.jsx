import { useCallback, useEffect, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

import StudentProfile from '../../components/analytics/StudentProfile';
import { useAuthStore } from '../../store/user.auth.store';

export default function StudentProfilePage() {
  const {
    profile,
    backlogs,
    cgpa,
    isLoading: isAuthLoading,
    isProfileLoading,
    profileError,
    fetchProfile,
  } = useAuthStore();

  const [hasTriedLoad, setHasTriedLoad] = useState(false);

  const loadProfile = useCallback(
    async ({ force = false } = {}) => {
      try {
        await fetchProfile({ force });
      } catch {
        // Error state is managed in zustand store.
      } finally {
        setHasTriedLoad(true);
      }
    },
    [fetchProfile]
  );

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const isLoading = (isAuthLoading || isProfileLoading) && !hasTriedLoad;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-sm text-text-muted">Loading profile...</p>
      </div>
    );
  }

  if (profileError && !profile) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <p className="text-sm text-text-primary">{profileError}</p>
        <button
          type="button"
          className="btn-primary mt-4"
          onClick={() => loadProfile({ force: true })}
        >
          <FiRefreshCw size={14} />
          <span className="ml-2">Retry</span>
        </button>
      </div>
    );
  }

  return (
    <section className="mx-auto animate-fade-up">
      <StudentProfile profileData={{ profile, backlogs, cgpa }} />
    </section>
  );
}
