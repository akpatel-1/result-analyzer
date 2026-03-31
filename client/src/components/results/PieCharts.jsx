import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function PieCharts({ pieConfigs, pieColors, tooltipStyle }) {
  return (
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
  );
}
