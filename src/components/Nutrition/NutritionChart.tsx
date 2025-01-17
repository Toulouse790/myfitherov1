import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts/BarChart";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { useMetricData } from "@/components/Workouts/TrendMetrics/useMetricData";
import { useState } from "react";

export const NutritionChart = () => {
  const { dailyTargets, consumedNutrients } = useDailyTargets();
  const { data: metricData } = useMetricData(7);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Format data for the chart
  const chartData = metricData?.daily.map(day => ({
    name: day.date,
    target: dailyTargets.calories,
    actual: day.value
  })) || Array(7).fill({ target: dailyTargets.calories, actual: 0 });

  const InfoCard = ({ targetValue, actualValue, date }: { targetValue: number, actualValue: number, date: string }) => {
    const isGood = actualValue >= targetValue * 0.9 && actualValue <= targetValue;
    const textColor = isGood ? "text-green-500" : 
                    actualValue < targetValue * 0.9 ? "text-red-500" : 
                    actualValue > targetValue ? "text-red-500" : "text-blue-500";

    return (
      <div className="absolute left-0 right-0 bottom-full mb-2 px-4">
        <Card className="w-full bg-white shadow-lg">
          <CardContent className="p-4">
            <p className="text-sm font-medium">{date}</p>
            <p className={`${textColor} font-semibold`}>
              Calories: {actualValue} / {targetValue} kcal
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
          Suivi des 7 derniers jours
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="h-[300px] w-full relative">
          <BarChart
            data={chartData}
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
            onValueClick={(props: any) => {
              if (props?.payload?.name) {
                setSelectedDay(props.payload.name);
              }
            }}
          />
          {selectedDay && (
            <InfoCard 
              date={selectedDay}
              targetValue={chartData.find(d => d.name === selectedDay)?.target || 0}
              actualValue={chartData.find(d => d.name === selectedDay)?.actual || 0}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};