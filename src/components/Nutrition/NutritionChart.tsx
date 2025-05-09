import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts/BarChart";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { useMetricData } from "@/components/Workouts/TrendMetrics/useMetricData";
import { useState } from "react";

export const NutritionChart = () => {
  const { dailyTargets, consumedNutrients } = useDailyTargets();
  const { data: metricData } = useMetricData(7);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Format data for the chart - using consumed nutrients for actual values
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i)); // Start from 6 days ago to today
    const dayName = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(date);
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    
    return {
      name: capitalizedDay,
      prévu: dailyTargets.calories,
      réalisé: i === 6 ? consumedNutrients.calories : 0 // Only today (last day) has real data
    };
  });

  const InfoCard = ({ targetValue, actualValue, date }: { targetValue: number, actualValue: number, date: string }) => {
    const percentage = (actualValue / targetValue) * 100;
    const isGood = percentage >= 90 && percentage <= 100;
    const textColor = isGood ? "text-green-500" : 
                    percentage < 90 ? "text-red-500" : 
                    percentage > 100 ? "text-red-500" : "text-blue-500";

    return (
      <div className="absolute left-0 right-0 bottom-full mb-2 px-4">
        <Card className="w-full bg-white shadow-lg">
          <CardContent className="p-4">
            <p className="text-sm font-medium">{date}</p>
            <p className={`${textColor} font-semibold`}>
              {actualValue} / {targetValue} kcal ({Math.round(percentage)}%)
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-4">
        <CardTitle className="text-base font-medium">
          Suivi des calories des 7 derniers jours
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="h-[400px] w-full relative"> {/* Increased height for better visibility */}
          <BarChart
            data={chartData}
            index="name"
            categories={[
              "prévu",
              "réalisé"
            ]}
            colors={["#9b87f5", "#1EAEDB"]} // Using our custom color palette
            valueFormatter={(value: number) => `${value} kcal`}
            yAxisWidth={48}
            showLegend={true}
            showGridLines={false}
            startEndOnly={false}
            showAnimation={true}
            minValue={0}
            maxValue={Math.max(dailyTargets.calories * 1.2, consumedNutrients.calories * 1.2)} // Add 20% padding
            onValueClick={(props: any) => {
              if (props?.payload?.name) {
                setSelectedDay(props.payload.name);
              }
            }}
          />
          {selectedDay && (
            <InfoCard 
              date={selectedDay}
              targetValue={chartData.find(d => d.name === selectedDay)?.prévu || 0}
              actualValue={chartData.find(d => d.name === selectedDay)?.réalisé || 0}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};