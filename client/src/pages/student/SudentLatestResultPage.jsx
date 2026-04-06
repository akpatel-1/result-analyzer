import { useCallback, useEffect, useState } from 'react';

import ResultCard from '../../components/results/ResultCard';
import { useResultStore } from '../../store/student.result.store';

export default function StudentLatestResult() {
  const { latestResult, fetchLatestResult } = useResultStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const result = latestResult?.result || latestResult || null;

  const loadLatestResult = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      await fetchLatestResult();
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Unable to fetch latest result.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetchLatestResult]);

  useEffect(() => {
    loadLatestResult();
  }, [loadLatestResult]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-center sm:p-10">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-sm text-text-muted">Loading latest result...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-center sm:p-10">
        <p className="text-sm text-text-primary">
          {error || 'No latest result found.'}
        </p>
        <button
          type="button"
          className="btn-primary mt-4"
          onClick={loadLatestResult}
        >
          Retry
        </button>
      </div>
    );
  }

  return <ResultCard data={result} />;
}
