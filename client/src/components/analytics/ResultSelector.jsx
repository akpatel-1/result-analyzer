import { useState } from 'react';

export default function ResultSelector({ onSearch, isLoading = false }) {
  const batchOptions = ['2023'];

  const [formData, setFormData] = useState({
    batch: '2023',
    roll_no: '',
    semester: '1',
  });
  const [formError, setFormError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormError('');
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    const normalizedRollNo = formData.roll_no.trim();
    if (!normalizedRollNo) {
      setFormError('Roll number is required.');
      return;
    }

    await onSearch({
      batch: formData.batch,
      roll_no: normalizedRollNo,
      semester: Number(formData.semester),
    });
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5 md:p-6">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-text-primary sm:text-lg">
          Find Student Result
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Select batch, enter roll number and choose semester to fetch result.
        </p>
      </div>

      <form className="grid gap-3 md:grid-cols-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1.5 text-sm text-text-secondary">
          Batch
          <select
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary outline-none focus:border-accent"
          >
            {batchOptions.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-text-secondary">
          Roll No
          <input
            type="text"
            name="roll_no"
            value={formData.roll_no}
            onChange={handleChange}
            placeholder="e.g. 22BCE000"
            className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-text-secondary">
          Semester
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary outline-none focus:border-accent"
          >
            {Array.from({ length: 8 }, (_, index) => index + 1).map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary h-10 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {formError && (
        <p className="mt-3 text-sm text-red-500" role="alert">
          {formError}
        </p>
      )}
    </section>
  );
}
