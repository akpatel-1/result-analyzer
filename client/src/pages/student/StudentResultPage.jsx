import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { studentApi } from '../../api/student.api';
import ResultCard from '../../components/results/ResultCard';

export default function StudentSemesterResult() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchParams] = useSearchParams();

  const semParam = searchParams.get('sem');
  const semester = semParam ? Number(semParam) : 1;

  const loadResult = useCallback(async (semValue) => {
    let isMounted = true;

    try {
      setIsLoading(true);
      setError('');

      const response = await studentApi.semesterResult(semValue);

      if (isMounted) {
        setResult(response?.data?.result || null);
      }
    } catch (err) {
      if (isMounted) {
        setError(
          err?.response?.data?.message ||
            `Unable to fetch result for Semester ${semValue}.`
        );
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);
  
  useEffect(() => {
    loadResult(semester);
  }, [semester, loadResult]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-sm text-text-muted">
          Loading Semester {semester} result...
        </p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <p className="text-sm text-text-primary">
          {error || `No results found for Semester ${semester}.`}
        </p>
        <button
          type="button"
          className="btn-primary mt-4"
          onClick={() => loadResult(semester)} 
        >
          Retry
        </button>
      </div>
    );
  }

  return <ResultCard data={result} />;
}
