import { Card } from "@/components/ui/card";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  showLegend?: boolean;
  showGridLines?: boolean;
  startEndOnly?: boolean;
  showAnimation?: boolean;
  onValueClick?: (props: any) => void;
}

export const BarChart = ({
  data,
  index,
  categories,
  colors = ["#0ea5e9"],
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 40,
  showLegend = false,
  showGridLines = true,
  startEndOnly = false,
  showAnimation = true,
  onValueClick
}: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} onClick={(props) => onValueClick?.(props)}>
        <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={10}
          height={20}
        />
        <YAxis
          width={yAxisWidth}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter}
        />
        {categories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={colors[i % colors.length]}
            radius={[4, 4, 0, 0]}
            onClick={(props) => onValueClick?.(props)}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};