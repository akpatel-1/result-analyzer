import { useEffect, useState } from 'react';

import { studentApi } from '../../api/student.api';
import ResultCard from '../../components/results/ResultCard';

export default function StudentLatestResult() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLatestResult = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await studentApi.latestResult();
      setResult(response?.data?.result || null);
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Unable to fetch latest result.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLatestResult();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-sm text-text-muted">Loading latest result...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
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
