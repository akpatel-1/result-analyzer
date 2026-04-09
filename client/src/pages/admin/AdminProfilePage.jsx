import { useCallback, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { adminApi } from '../../api/admin.api';
import ProfileSelector from '../../components/analytics/ProfileSelector';
import StudentProfile from '../../components/analytics/StudentProfile';
import DashboardLayout from '../../components/dashboard/Layout';
import { adminNavigationLinks } from '../../utils/dashboard.navigation';

export default function AdminProfilePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [lastPayload, setLastPayload] = useState(null);

  const handleLogout = async () => {
    await adminApi.logout();
    navigate('/admin/login', { replace: true });
  };

  const handleSearch = useCallback(async (payload) => {
    setIsLoading(true);
    setError('');
    setLastPayload(payload);

    try {
      const response = await adminApi.profile(payload);
      const data = response?.data?.profile || response?.data || null;

      if (!data) {
        setProfileData(null);
        setError('No profile found for the provided details.');
        return;
      }

      setProfileData(data);
    } catch (err) {
      setProfileData(null);
      setError(
        err?.response?.data?.message ||
          'Unable to fetch profile. Please verify details and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="rounded-2xl border border-border bg-surface p-6 text-center sm:p-10">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-sm text-text-muted">Loading student profile...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-2xl border border-border bg-surface p-6 text-center sm:p-10">
          <p className="text-sm text-text-primary">{error}</p>
          {lastPayload && (
            <button
              type="button"
              className="btn-primary mt-4"
              onClick={() => handleSearch(lastPayload)}
            >
              <FiRefreshCw size={14} />
              <span className="ml-2">Retry</span>
            </button>
          )}
        </div>
      );
    }

    return <StudentProfile profileData={profileData} />;
  };

  return (
    <DashboardLayout
      navItems={adminNavigationLinks}
      onLogout={handleLogout}
      role="admin"
    >
      <section className="space-y-4 sm:space-y-5 md:space-y-6">
        <ProfileSelector onSearch={handleSearch} isLoading={isLoading} />
        {renderContent()}
      </section>
    </DashboardLayout>
  );
}
