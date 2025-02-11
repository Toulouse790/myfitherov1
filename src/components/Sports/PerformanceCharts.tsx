
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface PerformanceData {
  id: string;
  metric_type: string;
  value: number;
  recorded_at: string;
  training_cycle_id: string;
}

interface ChartData {
  date: string;
  [key: string]: string | number;
}

export const PerformanceCharts = ({ sportId }: { sportId: string }) => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const { data: performanceData, isLoading } = useQuery({
    queryKey: ['performance-metrics', sportId, selectedPeriod],
    queryFn: async () => {
      if (!user) return null;

      const timeFilter = {
        week: '7 days',
        month: '30 days',
        year: '365 days'
      }[selectedPeriod];

      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', user.id)
        .gte('recorded_at', new Date(Date.now() - parseInt(timeFilter) * 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: true });

      if (error) throw error;
      return data as PerformanceData[];
    },
    enabled: !!user && !!sportId
  });

  const chartData: ChartData[] = React.useMemo(() => {
    if (!performanceData) return [];

    const groupedByDate = performanceData.reduce((acc, curr) => {
      const date = format(new Date(curr.recorded_at), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = { date };
      }
      acc[date][curr.metric_type] = curr.value;
      return acc;
    }, {} as Record<string, ChartData>);

    return Object.values(groupedByDate);
  }, [performanceData]);

  const metrics = React.useMemo(() => {
    if (!performanceData) return [];
    return Array.from(new Set(performanceData.map(d => d.metric_type)));
  }, [performanceData]);

  const colors = ['#2563eb', '#db2777', '#84cc16', '#eab308', '#ec4899'];

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-[300px] bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Évolution des Performances</h3>
          <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as typeof selectedPeriod)}>
            <TabsList>
              <TabsTrigger value="week">7 jours</TabsTrigger>
              <TabsTrigger value="month">30 jours</TabsTrigger>
              <TabsTrigger value="year">1 an</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'd MMM', { locale: fr })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => format(new Date(date), 'dd MMMM yyyy', { locale: fr })}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
              />
              <Legend />
              {metrics.map((metric, index) => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  name={metric.replace('_', ' ')}
                  stroke={colors[index % colors.length]}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
