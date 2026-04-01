import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  title = 'Theory Obtained Marks',
  subjectStatuses = {},
}) {
  const labelMap = {
    obt_ese: 'Theory (ESE)',
    max_ese: 'Max marks',
    obt_ct: 'Class Test (CT)',
    max_ct: 'Max marks',
    obt_ta: 'TA',
    max_ta: 'Max marks',
  };

  // Pick color based on barKey
  const barColorMap = {
    obt_ese: '#22c55e',
    obt_ct: '#f97316',
    obt_ta: '#06b6d4',
  };
  const maxBarColorMap = {
    max_ese: '#3b82f6',
    max_ct: '#64748b',
    max_ta: '#64748b',
  };
  const barColor = barColorMap[barKey] || '#22c55e';
  const maxBarColor = maxBarColorMap[maxKey] || '#93c5fd';

  const tooltipFormatter = (value, name, item) => {
    const isObtainedSeries = name === barKey;
    const subjectName = item?.payload?.subject;
    const isFail = subjectStatuses?.[subjectName] === 'Fail';
    const valueColor = isObtainedSeries
      ? isFail
        ? '#ef4444'
        : barColor
      : maxBarColor;

    return [
      <span style={{ color: valueColor, fontWeight: 700 }}>{value}</span>,
      labelMap[name] ?? name,
    ];
  };

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
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={tooltipFormatter}
                itemStyle={{ color: 'var(--text-primary)' }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
              />
              {/* Show both obtained and max bars for context */}
              <Bar
                dataKey={maxKey}
                fill={maxBarColor}
                barSize={70}
                opacity={0.6}
              />
              <Bar dataKey={barKey} barSize={40}>
                {chartData.map((entry, index) => {
                  const isFail = subjectStatuses[entry.subject] === 'Fail';
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isFail ? '#ef4444' : barColor}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-text-muted">No data found for this chart.</p>
      )}
    </div>
  );
}
