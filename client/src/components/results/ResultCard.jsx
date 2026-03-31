// ResultCard.jsx
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function wrapSubjectLabel(label, maxCharsPerLine = 12) {
  if (!label) return [''];

  const words = String(label).split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach((word) => {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      currentLine = candidate;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}

function SubjectTick({ x, y, payload }) {
  const lines = wrapSubjectLabel(payload?.value, 12);

  return (
    <text
      x={x}
      y={y + 12}
      textAnchor="middle"
      fill="var(--text-muted)"
      fontSize={14}
    >
      {lines.map((line, index) => (
        <tspan key={`${line}-${index}`} x={x} dy={index === 0 ? 0 : 14}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export default function ResultCard({ data }) {
  if (!data) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <p className="text-sm text-text-primary">
          Result data is not available.
        </p>
      </div>
    );
  }

  const {
    semester,
    exam_type,
    attempt_no,
    view_type,
    spi,
    status,
    max_marks,
    obt_marks,
    subjects = [],
    subject_results = [],
  } = data;

  const allSubjects = subject_results.length ? subject_results : subjects;

  const chartData = allSubjects
    .filter((item) => Number(item.max_ese ?? 0) === 100)
    .map((item) => ({
      subject: item.subject,
      max_ese: Number(item.max_ese ?? 0),
      obt_ese: Number(item.obt_ese ?? 0),
    }));

  const eseSubjects = allSubjects.filter(
    (item) => Number(item.max_ese ?? 0) === 100
  );

  const sumBy = (key, list = allSubjects) =>
    list.reduce((total, item) => total + Number(item[key] ?? 0), 0);

  const overallMax = Number(max_marks ?? 0);
  const overallObt = Number(obt_marks ?? 0);
  const totalMaxEse = sumBy('max_ese', eseSubjects);
  const totalObtEse = sumBy('obt_ese', eseSubjects);
  const totalMaxCt = sumBy('max_ct');
  const totalObtCt = sumBy('obt_ct');
  const totalMaxTa = sumBy('max_ta');
  const totalObtTa = sumBy('obt_ta');

  const pieConfigs = [
    {
      title: 'Overall Marks',
      data: [
        { name: 'Max', value: overallMax },
        { name: 'Obt', value: overallObt },
      ],
    },
    {
      title: 'All ESE',
      data: [
        { name: 'Max ESE', value: totalMaxEse },
        { name: 'Obt ESE', value: totalObtEse },
      ],
    },
    {
      title: 'All CT',
      data: [
        { name: 'Max CT', value: totalMaxCt },
        { name: 'Obt CT', value: totalObtCt },
      ],
    },
    {
      title: 'All TA',
      data: [
        { name: 'Max TA', value: totalMaxTa },
        { name: 'Obt TA', value: totalObtTa },
      ],
    },
  ];

  const pieColors = ['#60a5fa', '#22c55e'];

  const tooltipStyle = {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    color: 'var(--text-primary)',
  };

  const yAxisMax = Math.max(
    0,
    ...chartData.map((item) => Math.max(item.max_ese, item.obt_ese))
  );

  return (
    <div className="p-6 space-y-6">
      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: 'Semester', value: `Sem ${semester}` },
          { label: 'Exam Type', value: exam_type },
          { label: 'Attempt', value: attempt_no },
          { label: 'view Type', value: view_type },
          { label: 'SPI', value: spi },
          { label: 'Overall Status', value: status },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-surface-raised border border-border rounded-xl p-4"
          >
            <p className="text-xs text-text-muted mb-1">{s.label}</p>
            <p
              className={`text-xl font-semibold ${
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

      {/* AGGREGATE PIE CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {pieConfigs.map((config) => (
          <div
            key={config.title}
            className="bg-surface-raised border border-border rounded-xl p-4"
          >
            <h4 className="text-sm font-semibold text-text-primary mb-3">
              {config.title}
            </h4>

            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={config.data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    label={({ value }) => value}
                  >
                    {config.data.map((entry, index) => (
                      <Cell
                        key={`${config.title}-${entry.name}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* SUBJECT BAR CHART: OBTAINED ESE */}
      <div className="bg-surface-raised border border-border rounded-xl p-4 md:p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Subject-wise Obtained Marks
        </h3>

        {chartData.length > 0 ? (
          <div className="h-108 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 50 }}
              >
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="subject"
                  interval={0}
                  height={70}
                  tick={<SubjectTick />}
                />
                <YAxis
                  domain={[0, yAxisMax || 100]}
                  tick={{ fill: 'var(--text-muted)', fontSize: 14 }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="obt_ese" fill="#22c55e" barSize={70} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-text-muted">
            No subjects found with max ESE of 100.
          </p>
        )}
      </div>
    </div>
  );
}
