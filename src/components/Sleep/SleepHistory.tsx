
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/charts/ChartContainer";
import { BarChart, Area, AreaChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, BarChart2, LineChart } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

// Sample data - would be replaced with real data from API
const generateSleepData = (days = 7) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    
    return {
      date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
      sommeilTotal: 6 + Math.random() * 3,
      sommeilProfond: 1 + Math.random() * 1.5,
      sommeilParadoxal: 1 + Math.random() * 1,
      sommeilLéger: 3 + Math.random() * 1.5,
      score: 60 + Math.floor(Math.random() * 40)
    };
  });
};

export const SleepHistory = () => {
  const [viewMode, setViewMode] = useState<'bar' | 'area'>('bar');
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [data, setData] = useState(generateSleepData(7));
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  const handleRangeChange = (range: 'week' | 'month') => {
    setTimeRange(range);
    setData(generateSleepData(range === 'week' ? 7 : 30));
  };

  const formatDuration = (value: number) => {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return `${hours}h ${minutes}min`;
  };

  const chartColors = {
    sommeilTotal: '#3B82F6', // blue-500
    sommeilProfond: '#4F46E5', // indigo-600
    sommeilParadoxal: '#8B5CF6', // violet-500
    sommeilLéger: '#06B6D4', // cyan-500
    score: '#F59E0B' // amber-500
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white to-blue-50 dark:from-blue-950/20 dark:to-blue-900/10 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4">
          <CardTitle>{t("sleep.sleepHistory")}</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 text-white hover:bg-white/20"
              onClick={() => handleRangeChange('week')}
              disabled={timeRange === 'week'}
            >
              {t("sleep.week")}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 text-white hover:bg-white/20"
              onClick={() => handleRangeChange('month')}
              disabled={timeRange === 'month'}
            >
              {t("sleep.month")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t("sleep.previous")}
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Calendar className="h-4 w-4 mr-1" />
                {t("sleep.today")}
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                {t("sleep.next")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant={viewMode === 'bar' ? "default" : "outline"} 
                size="sm" 
                className="h-8"
                onClick={() => setViewMode('bar')}
              >
                <BarChart2 className="h-4 w-4 mr-1" />
                {t("sleep.bars")}
              </Button>
              <Button 
                variant={viewMode === 'area' ? "default" : "outline"} 
                size="sm" 
                className="h-8"
                onClick={() => setViewMode('area')}
              >
                <LineChart className="h-4 w-4 mr-1" />
                {t("sleep.areas")}
              </Button>
            </div>
          </div>

          <div className="h-[300px] md:h-[400px] mt-6">
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
