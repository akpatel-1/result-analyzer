import BarChartComponent from './BarCharts';
import PieCharts from './PieCharts';
import StatCards from './StatCards';

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

  const subjectStatuses = Object.fromEntries(
    allSubjects.map((item) => [item.subject, item.status])
  );
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

  const statCards = [
    { label: 'Semester', value: `Semester ${semester}` },
    { label: 'Exam Type', value: exam_type },
    { label: 'Attempt', value: attempt_no },
    { label: 'View Type', value: view_type },
    { label: 'SPI', value: spi },
    { label: 'Overall Status', value: status },
  ];

  // Prepare CT chart data (where max_ct is 20)
  const ctChartData = allSubjects
    .filter((item) => Number(item.max_ct ?? 0) === 20)
    .map((item) => ({
      subject: item.subject,
      max_ct: Number(item.max_ct ?? 0),
      obt_ct: Number(item.obt_ct ?? 0),
    }));

  const yAxisMaxCt = Math.max(
    0,
    ...ctChartData.map((item) => Math.max(item.max_ct, item.obt_ct))
  );

  const taChartData = allSubjects
    .filter((item) => Number(item.max_ta ?? 0) === 30)
    .map((item) => ({
      subject: item.subject,
      max_ta: Number(item.max_ta ?? 0),
      obt_ta: Number(item.obt_ta ?? 0),
    }));

  const yAxisMaxTa = Math.max(
    0,
    ...taChartData.map((item) => Math.max(item.max_ta, item.obt_ta))
  );

  return (
    <div className="space-y-4 p-3 sm:space-y-5 sm:p-4 md:space-y-6 md:p-6">
      <StatCards stats={statCards} />
      <BarChartComponent
        chartData={chartData}
        yAxisMax={yAxisMax}
        tooltipStyle={tooltipStyle}
        subjectStatuses={subjectStatuses}
      />

      {/* CT MARKS BAR CHART: OBTAINED CT WHERE MAX_CT IS 20 */}
      {ctChartData.length > 0 && (
        <BarChartComponent
          chartData={ctChartData.map(({ subject, max_ct, obt_ct }) => ({
            subject,
            max_ct,
            obt_ct,
          }))}
          yAxisMax={yAxisMaxCt}
          tooltipStyle={tooltipStyle}
          barKey="obt_ct"
          maxKey="max_ct"
          title="CT Obtained Marks"
        />
      )}

      {taChartData.length > 0 && (
        <BarChartComponent
          chartData={taChartData.map(({ subject, max_ta, obt_ta }) => ({
            subject,
            max_ta,
            obt_ta,
          }))}
          yAxisMax={yAxisMaxTa}
          tooltipStyle={tooltipStyle}
          barKey="obt_ta"
          maxKey="max_ta"
          title="TA Obtained Marks"
        />
      )}

      <PieCharts
        pieConfigs={pieConfigs}
        pieColors={pieColors}
        tooltipStyle={tooltipStyle}
      />
    </div>
  );
}
