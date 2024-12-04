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
  ticks?: number[]
  showLegend?: boolean
  showGridLines?: boolean
  startEndOnly?: boolean
  showAnimation?: boolean
  className?: string
  customTooltip?: (props: any) => React.ReactElement
}

export const BarChart = ({
  data,
  index,
  categories,
  colors = ["#0ea5e9"],
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 56,
  ticks,
  showLegend = true,
  showGridLines = true,
  startEndOnly = false,
  showAnimation = false,
  className,
  customTooltip,
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
      <RechartsPrimitive.ResponsiveContainer>
        <RechartsPrimitive.BarChart data={data} className={className}>
          <RechartsPrimitive.XAxis
            dataKey={index}
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            scale="point"
            padding={{ left: 10, right: 10 }}
          />
          <RechartsPrimitive.YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={yAxisWidth}
            tickFormatter={valueFormatter}
            ticks={ticks}
            scale="linear"
            padding={{ top: 10, bottom: 10 }}
          />
          {showGridLines && (
            <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
          )}
          {customTooltip ? (
            <RechartsPrimitive.Tooltip content={customTooltip} />
          ) : (
            <RechartsPrimitive.Tooltip />
          )}
          {showLegend && <RechartsPrimitive.Legend />}
          {categories.map((category, i) => (
            <RechartsPrimitive.Bar
              key={category}
              dataKey={category}
              fill={colors[i % colors.length]}
              radius={[4, 4, 0, 0]}
              animationDuration={showAnimation ? 1000 : 0}
            />
          ))}
        </RechartsPrimitive.BarChart>
      </RechartsPrimitive.ResponsiveContainer>
    </ChartContainer>
  )
}