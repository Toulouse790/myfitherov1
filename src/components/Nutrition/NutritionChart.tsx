import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts/BarChart";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format } from "date-fns";
import { fr } from "date-fns/locale";

export const NutritionChart = () => {
  const { dailyTargets } = useDailyTargets();
  
  const { data: weeklyData } = useQuery({
    queryKey: ['food-journal-weekly'],
    queryFn: async () => {
      const today = startOfDay(new Date());
      const sevenDaysAgo = subDays(today, 6);

      const { data: entries, error } = await supabase
        .from('food_journal_entries')
        .select('calories, created_at')
        .gte('created_at', sevenDaysAgo.toISOString())
        .lte('created_at', today.toISOString());

      if (error) {
        console.error('Error fetching food journal entries:', error);
        return [];
      }

      // Group entries by day
      const dailyCalories = entries.reduce((acc, entry) => {
        const day = startOfDay(new Date(entry.created_at)).toISOString();
        acc[day] = (acc[day] || 0) + entry.calories;
        return acc;
      }, {});

      // Create array for last 7 days
      return Array.from({ length: 7 }, (_, i) => {
        const date = subDays(today, 6 - i);
        const dayStr = date.toISOString();
        return {
          name: format(date, 'EEE', { locale: fr }),
          target: dailyTargets.calories,
          actual: dailyCalories[dayStr] || 0
        };
      });
    }
  });

  const data = weeklyData || Array(7).fill({ target: dailyTargets.calories, actual: 0 });

  return (
    <Card className="w-full">
      <CardHeader className="p-4">
        <CardTitle className="text-base font-medium">
          Suivi des 7 derniers jours
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="h-[300px] w-full">
          <BarChart
            data={data}
            index="name"
            categories={[
              "target",
              "actual"
            ]}
            colors={["#8B5CF6", "#A78BFA"]}
            valueFormatter={(value: number) => `${value} kcal`}
            yAxisWidth={48}
            showLegend={true}
            showGridLines={false}
            startEndOnly={false}
            showAnimation={true}
            customTooltip={(props: any) => (
              <div className="bg-white p-2 rounded-lg border shadow-sm">
                <p className="text-sm font-medium">{props.payload[0]?.payload.name}</p>
                <div className="space-y-1">
                  <p className="text-purple-500">
                    Calories: {props.payload[1]?.value} / {props.payload[0]?.value} kcal
                  </p>
                </div>
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};