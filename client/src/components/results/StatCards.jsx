// StatCards.jsx
export default function StatCards({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-surface-raised border border-border rounded-xl p-4"
        >
          <p className="text-xs text-text-muted mb-1">{s.label}</p>
          <p
            className={`text-lg font-semibold sm:text-xl ${
              s.value === 'Pass'
                ? 'text-green-600'
                : s.value === 'Fail'
                  ? 'text-red-500'
                  : 'text-text-primary'
            }`}
          >
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
