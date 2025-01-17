import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer } from "./ChartContainer";

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
  minValue?: number;
  maxValue?: number;
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
  minValue,
  maxValue,
  onValueClick
}: BarChartProps) => {
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
          data={data} 
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          onClick={(data) => onValueClick?.(data)}
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
            tickFormatter={valueFormatter}
            domain={[minValue || 'auto', maxValue || 'auto']}
          />
          <Tooltip 
            cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
            formatter={valueFormatter}
            labelStyle={{ color: "#000" }}
            contentStyle={{ 
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "8px"
            }}
          />
          {showLegend && (
            <Legend 
              verticalAlign="top"
              height={36}
              iconType="circle"
            />
          )}
          {categories.map((category, i) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[i % colors.length]}
              radius={[4, 4, 0, 0]}
              isAnimationActive={showAnimation}
              onClick={(props) => onValueClick?.(props)}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};