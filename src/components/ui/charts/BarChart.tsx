import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer } from "./ChartContainer";

interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number, category?: string) => string;
  yAxisWidth?: number;
  showLegend?: boolean;
  showGridLines?: boolean;
  startEndOnly?: boolean;
  showAnimation?: boolean;
  className?: string;
  customTooltip?: (props: any) => JSX.Element;
  onValueClick?: (props: any) => void;
}

export const BarChart = ({
  data,
  index,
  categories,
  colors = ["#0EA5E9"],
  valueFormatter = (value: number) => `${value}`,
  yAxisWidth = 40,
  showLegend = false,
  showGridLines = true,
  startEndOnly = false,
  showAnimation = true,
  className,
  customTooltip,
  onValueClick
}: BarChartProps) => {
  const dataWithIds = data.map((item, idx) => ({
    ...item,
    uniqueId: `${item[index]}-${idx}`
  }));

  const chartConfig = Object.fromEntries(
    categories.map((category, i) => [
      category,
      { color: colors[i % colors.length] },
    ])
  );

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart 
          data={dataWithIds} 
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          onClick={(data) => onValueClick?.(data.activePayload?.[0]?.payload)}
        >
          <XAxis
            dataKey={index}
            axisLine={false}
            tickLine={false}
            fontSize={12}
            tickMargin={8}
            interval={startEndOnly ? "preserveStartEnd" : 0}
          />
          <YAxis
            width={yAxisWidth}
            axisLine={false}
            tickLine={false}
            fontSize={12}
            tickMargin={8}
            tickFormatter={value => valueFormatter(value)}
          />
          <Tooltip
            content={customTooltip}
            cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
          />
          {categories.map((category, i) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[i % colors.length]}
              radius={[4, 4, 0, 0]}
              isAnimationActive={showAnimation}
              name={category}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};