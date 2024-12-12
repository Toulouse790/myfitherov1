import { ResponsiveContainer, PieChart as RechartsChart, Pie, Cell, Legend, Tooltip } from "recharts";

interface PieChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter: (value: number) => string;
}

export const PieChart = ({ data, index, categories, colors, valueFormatter }: PieChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsChart>
        <Pie
          data={data}
          dataKey={categories[0]}
          nameKey={index}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill={colors[0]}
          label
        >
          {data?.map((_: any, index: number) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={valueFormatter} />
        <Legend />
      </RechartsChart>
    </ResponsiveContainer>
  );
};