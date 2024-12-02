import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { ChartContainer } from "./ChartContainer"

interface BarChartProps {
  data: any[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
}

export const BarChart = ({
  data,
  index,
  categories,
  colors = ["#0ea5e9"],
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 56,
}: BarChartProps) => {
  return (
    <ChartContainer
      config={{
        ...Object.fromEntries(
          categories.map((category, i) => [
            category,
            { color: colors[i % colors.length] },
          ])
        ),
      }}
    >
      <RechartsPrimitive.BarChart data={data}>
        <RechartsPrimitive.XAxis
          dataKey={index}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <RechartsPrimitive.YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={yAxisWidth}
          tickFormatter={valueFormatter}
        />
        <RechartsPrimitive.Tooltip />
        {categories.map((category, i) => (
          <RechartsPrimitive.Bar
            key={category}
            dataKey={category}
            fill={colors[i % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsPrimitive.BarChart>
    </ChartContainer>
  )
}