import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer } from "./ChartContainer";

interface BarChartProps {
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
  className?: string;
  customTooltip?: (props: any) => JSX.Element;
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
  customTooltip
}: BarChartProps) => {
  // Générer des IDs uniques pour chaque barre
  const dataWithIds = data.map((item, idx) => ({
    ...item,
    uniqueId: `${item[index]}-${idx}`
  }));

  return (
    <ChartContainer className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={dataWithIds} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
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
              // Utiliser l'ID unique comme clé pour chaque rectangle
              id={(entry) => `rectangle-${entry.uniqueId}-${i}`}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};