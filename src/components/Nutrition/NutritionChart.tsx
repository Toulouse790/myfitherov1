import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts/BarChart";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";

export const NutritionChart = () => {
  const { dailyTargets, consumedNutrients } = useDailyTargets();
  const { toast } = useToast();
  const hasShownToastRef = useRef(false);
  
  const { data: weeklyData } = useQuery({
    queryKey: ['food-journal-weekly'],
    queryFn: async () => {
      const today = startOfDay(new Date());
      const sevenDaysAgo = subDays(today, 6);

      const { data: entries, error } = await supabase
        .from('food_journal_entries')
        .select('calories, carbs, fats, created_at')
        .gte('created_at', sevenDaysAgo.toISOString())
        .lte('created_at', today.toISOString());

      if (error) {
        console.error('Error fetching food journal entries:', error);
        return [];
      }

      // Group entries by day
      const dailyNutrients = entries.reduce((acc, entry) => {
        const day = startOfDay(new Date(entry.created_at)).toISOString();
        if (!acc[day]) {
          acc[day] = { calories: 0, carbs: 0, fats: 0 };
        }
        acc[day].calories += entry.calories;
        acc[day].carbs += entry.carbs;
        acc[day].fats += entry.fats;
        return acc;
      }, {});

      // Create array for last 7 days
      return Array.from({ length: 7 }, (_, i) => {
        const date = subDays(today, 6 - i);
        const dayStr = date.toISOString();
        const dayData = dailyNutrients[dayStr] || { calories: 0, carbs: 0, fats: 0 };
        
        // Determine color based on whether it's today and if targets are met
        const isToday = i === 6;
        const isExceeded = isToday && (
          dayData.calories > dailyTargets.calories ||
          dayData.carbs > dailyTargets.carbs ||
          dayData.fats > dailyTargets.fats
        );
        const isTooLow = isToday && (
          dayData.calories < dailyTargets.calories * 0.9
        );

        return {
          name: format(date, 'EEE', { locale: fr }),
          target: dailyTargets.calories,
          actual: dayData.calories,
          color: isExceeded || isTooLow ? "#ea384c" : "#1EAEDB"
        };
      });
    }
  });

  // Effect to check nutrition goals and show toast
  useEffect(() => {
    if (consumedNutrients && !hasShownToastRef.current) {
      const isCaloriesExceeded = consumedNutrients.calories > dailyTargets.calories;
      const isCaloriesTooLow = consumedNutrients.calories < dailyTargets.calories * 0.9;
      const isCarbsExceeded = consumedNutrients.carbs > dailyTargets.carbs;
      const isFatsExceeded = consumedNutrients.fats > dailyTargets.fats;

      // Prioritize notifications and add delays
      if (isCaloriesExceeded || isCarbsExceeded || isFatsExceeded) {
        hasShownToastRef.current = true;
        setTimeout(() => {
          toast({
            title: "Attention",
            description: "Vous avez dépassé vos objectifs nutritionnels journaliers",
            variant: "destructive",
            duration: 5000,
          });
        }, 500);
      } else if (isCaloriesTooLow) {
        hasShownToastRef.current = true;
        setTimeout(() => {
          toast({
            title: "Attention",
            description: "Vous n'avez pas atteint vos objectifs caloriques journaliers",
            variant: "destructive",
            duration: 5000,
          });
        }, 500);
      } else if (consumedNutrients.calories >= dailyTargets.calories * 0.9 && 
                 consumedNutrients.calories <= dailyTargets.calories) {
        hasShownToastRef.current = true;
        setTimeout(() => {
          toast({
            title: "Félicitations !",
            description: "Vous avez atteint vos objectifs nutritionnels de manière équilibrée",
            duration: 5000,
          });
        }, 500);
      }
    }
  }, [consumedNutrients, dailyTargets, toast]);

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
            colors={["#9b87f5", "#1EAEDB"]}
            valueFormatter={(value: number) => `${value} kcal`}
            yAxisWidth={48}
            showLegend={true}
            showGridLines={false}
            startEndOnly={false}
            showAnimation={true}
            customTooltip={(props: any) => {
              const targetValue = props.payload[0]?.value || 0;
              const actualValue = props.payload[1]?.value || 0;
              const isGood = actualValue >= targetValue * 0.9 && actualValue <= targetValue;
              const textColor = isGood ? "text-green-500" : 
                              actualValue < targetValue * 0.9 ? "text-red-500" : 
                              actualValue > targetValue ? "text-red-500" : "text-blue-500";

              return (
                <div className="bg-white p-2 rounded-lg border shadow-sm">
                  <p className="text-sm font-medium">{props.payload[0]?.payload.name}</p>
                  <div className="space-y-1">
                    <p className={textColor}>
                      Calories: {actualValue} / {targetValue} kcal
                    </p>
                  </div>
                </div>
              );
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};