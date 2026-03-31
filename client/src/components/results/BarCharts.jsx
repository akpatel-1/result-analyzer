import {
  Bar,
  BarChart,
  CartesianGrid,
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

export default function BarChartComponent({
  chartData,
  yAxisMax,
  tooltipStyle,
  barKey = 'obt_ese',
  maxKey = 'max_ese',
  title = 'Subject-wise Obtained Marks',
}) {
  // Pick color based on barKey
  const barColor = barKey === 'obt_ct' ? '#f59e42' : '#22c55e';
  const maxBarColor = barKey === 'obt_ct' ? '#f3e8ff' : '#60a5fa';
  return (
    <div className="bg-surface-raised border border-border rounded-xl p-4 md:p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>
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
              {/* Show both obtained and max bars for context */}
              <Bar
                dataKey={maxKey}
                fill={maxBarColor}
                barSize={70}
                opacity={0.3}
              />
              <Bar dataKey={barKey} fill={barColor} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-text-muted">No data found for this chart.</p>
      )}
    </div>
  );
}
