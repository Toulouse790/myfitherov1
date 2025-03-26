
import { BarChart, Area, AreaChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { SleepDataPoint } from "./types";
import { formatDuration } from "./utils";

interface SleepChartProps {
  data: SleepDataPoint[];
  viewMode: 'bar' | 'area';
  isMobile: boolean;
}

export const SleepChart = ({ data, viewMode, isMobile }: SleepChartProps) => {
  const chartColors = {
    sommeilTotal: '#3B82F6', // blue-500
    sommeilProfond: '#4F46E5', // indigo-600
    sommeilParadoxal: '#8B5CF6', // violet-500
    sommeilLéger: '#06B6D4', // cyan-500
    score: '#F59E0B' // amber-500
  };

  return (
    <>
      {viewMode === 'bar' ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: isMobile ? 0 : 30,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: isMobile ? 10 : 12 }}
            />
            <YAxis 
              yAxisId="left"
              tickFormatter={formatDuration}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 50 : 60}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[0, 100]}
              tickFormatter={(value) => `${value}`}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 40 : 50}
            />
            <Tooltip 
              formatter={(value: any, name: string) => {
                if (name === 'score') return [`${value}`, 'Score'];
                return [formatDuration(value as number), name.replace(/([A-Z])/g, ' $1').trim()];
              }}
            />
            <Legend formatter={(value) => value.replace(/([A-Z])/g, ' $1').trim()} />
            <Bar yAxisId="left" dataKey="sommeilProfond" stackId="a" fill={chartColors.sommeilProfond} name="Sommeil Profond" />
            <Bar yAxisId="left" dataKey="sommeilParadoxal" stackId="a" fill={chartColors.sommeilParadoxal} name="Sommeil Paradoxal" />
            <Bar yAxisId="left" dataKey="sommeilLéger" stackId="a" fill={chartColors.sommeilLéger} name="Sommeil Léger" />
            <Bar yAxisId="right" dataKey="score" fill={chartColors.score} name="Score" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: isMobile ? 0 : 30,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: isMobile ? 10 : 12 }}
            />
            <YAxis 
              tickFormatter={formatDuration}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 50 : 60}
            />
            <Tooltip 
              formatter={(value: any, name: string) => {
                return [formatDuration(value as number), name.replace(/([A-Z])/g, ' $1').trim()];
              }}
            />
            <Legend formatter={(value) => value.replace(/([A-Z])/g, ' $1').trim()} />
            <Area type="monotone" dataKey="sommeilTotal" stroke={chartColors.sommeilTotal} fill={chartColors.sommeilTotal} name="Sommeil Total" fillOpacity={0.3} />
            <Area type="monotone" dataKey="sommeilProfond" stroke={chartColors.sommeilProfond} fill={chartColors.sommeilProfond} name="Sommeil Profond" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </>
  );
};
