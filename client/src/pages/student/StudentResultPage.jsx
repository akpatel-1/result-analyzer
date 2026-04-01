import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ResultCard from '../../components/results/ResultCard';
import { useResultStore } from '../../store/student.result.store';

export default function StudentSemesterResult() {
  const { semesterResults, fetchSemesterResult } = useResultStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchParams] = useSearchParams();

  const semParam = searchParams.get('sem');
  const parsedSemester = Number(semParam);
  const semester =
    semParam && Number.isInteger(parsedSemester) && parsedSemester > 0
      ? parsedSemester
      : 1;
  const semesterPayload = semesterResults[semester] || null;
  const result = semesterPayload?.result || semesterPayload || null;

  const loadResult = useCallback(
    async (semValue) => {
      try {
        setIsLoading(true);
        setError('');
        await fetchSemesterResult(semValue);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            `Unable to fetch result for Semester ${semValue}.`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [fetchSemesterResult]
  );

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
