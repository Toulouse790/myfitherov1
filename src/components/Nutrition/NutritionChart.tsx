import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts/BarChart";
import { useDailyTargets } from "@/hooks/use-daily-targets";

export const NutritionChart = () => {
  const { dailyTargets, consumedNutrients } = useDailyTargets();
  
  const data = [
    { name: "Lun", target: dailyTargets.calories, actual: consumedNutrients.calories },
    { name: "Mar", target: dailyTargets.calories, actual: consumedNutrients.calories },
    { name: "Mer", target: dailyTargets.calories, actual: consumedNutrients.calories },
    { name: "Jeu", target: dailyTargets.calories, actual: consumedNutrients.calories },
    { name: "Ven", target: dailyTargets.calories, actual: consumedNutrients.calories },
    { name: "Sam", target: dailyTargets.calories, actual: consumedNutrients.calories },
    { name: "Dim", target: dailyTargets.calories, actual: consumedNutrients.calories },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="p-4">
        <CardTitle className="text-base font-medium">
          Suivi hebdomadaire
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