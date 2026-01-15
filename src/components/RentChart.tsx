import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ChartDataPoint {
  month: string;
  rent: number;
  expenses: number;
}

interface RentChartProps {
  data: ChartDataPoint[];
  title: string;
}

const RentChart = ({ data, title }: RentChartProps) => {
  return (
    <div className="kpi-card">
      <h3 className="text-lg font-bold tracking-tight text-foreground mb-6 pl-1 border-l-4 border-secondary">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="rentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(175, 35%, 42%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(175, 35%, 42%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 75%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 75%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              formatter={(value: number) => [`KES ${value.toLocaleString()}`, '']}
            />
            <Area
              type="monotone"
              dataKey="rent"
              stroke="hsl(175, 35%, 42%)"
              strokeWidth={2}
              fill="url(#rentGradient)"
              name="Rent"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="hsl(0, 75%, 50%)"
              strokeWidth={2}
              fill="url(#expenseGradient)"
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary" />
          <span className="text-xs text-muted-foreground">Rent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-xs text-muted-foreground">Expenses</span>
        </div>
      </div>
    </div>
  );
};

export default RentChart;
