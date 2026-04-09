import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { adminApi } from '../../api/admin.api';
import ResultSelector from '../../components/analytics/ResultSelector';
import DashboardLayout from '../../components/dashboard/Layout';
import ResultCard from '../../components/results/ResultCard';
import { adminNavigationLinks } from '../../utils/dashboard.navigation';

export default function AdminResultPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
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
      const response = await adminApi.result(payload);
      const resultData = response?.data?.result || response?.data || null;

      if (!resultData) {
        setResult(null);
        setError('No result found for the provided details.');
        return;
      }

      setResult(resultData);
    } catch (err) {
      setResult(null);
      setError(
        err?.response?.data?.message ||
          'Unable to fetch result. Please verify details and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <DashboardLayout
      navItems={adminNavigationLinks}
      onLogout={handleLogout}
      role="admin"
    >
      <section className="space-y-4 sm:space-y-5 md:space-y-6">
        <ResultSelector onSearch={handleSearch} isLoading={isLoading} />

        {isLoading && (
          <div className="rounded-2xl border border-border bg-surface p-6 text-center sm:p-10">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="text-sm text-text-muted">
              Fetching student result...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl border border-border bg-surface p-6 text-center sm:p-10">
            <p className="text-sm text-text-primary">{error}</p>
            {lastPayload && (
              <button
                type="button"
                className="btn-primary mt-4"
                onClick={() => handleSearch(lastPayload)}
              >
                Retry
              </button>
            )}
          </div>
        )}

        {!isLoading && !error && result && (
          <>
            {result.name && (
              <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 md:p-6">
                <p className="text-sm text-text-secondary">Student Name</p>
                <h3 className="text-lg font-semibold text-text-primary md:text-xl">
                  {result.name}
                </h3>
              </div>
            )}
            <ResultCard data={result} />
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
