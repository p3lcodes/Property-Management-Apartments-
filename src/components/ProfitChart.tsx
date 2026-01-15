import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

interface ChartDataPoint {
  month: string;
  profit: number;
}

interface ProfitChartProps {
  data: ChartDataPoint[];
  title: string;
}

const ProfitChart = ({ data, title }: ProfitChartProps) => {
  return (
    <div className="kpi-card">
      <h3 className="text-lg font-bold tracking-tight text-foreground mb-6 pl-1 border-l-4 border-secondary">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(220, 10%, 50%)' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(220, 10%, 50%)' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(220, 15%, 88%)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`KES ${value.toLocaleString()}`, 'Profit']}
            />
            <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.profit >= 0 ? 'hsl(142, 70%, 40%)' : 'hsl(0, 75%, 50%)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfitChart;
