import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts/BarChart";
import { useDailyTargets } from "@/hooks/use-daily-targets";

export const NutritionChart = () => {
  const { dailyTargets, consumedNutrients } = useDailyTargets();
  
  const data = [
    { name: "Lun", target_calories: 2100, actual_calories: 1800, target_proteins: 160, actual_proteins: 140 },
    { name: "Mar", target_calories: 2100, actual_calories: 2100, target_proteins: 160, actual_proteins: 160 },
    { name: "Mer", target_calories: 2100, actual_calories: 1950, target_proteins: 160, actual_proteins: 145 },
    { name: "Jeu", target_calories: 2100, actual_calories: 2000, target_proteins: 160, actual_proteins: 150 },
    { name: "Ven", target_calories: 2100, actual_calories: 2200, target_proteins: 160, actual_proteins: 170 },
    { name: "Sam", target_calories: 2100, actual_calories: 1900, target_proteins: 160, actual_proteins: 145 },
    { name: "Dim", target_calories: 2100, actual_calories: 1850, target_proteins: 160, actual_proteins: 140 },
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
              "target_calories",
              "actual_calories",
              "target_proteins",
              "actual_proteins"
            ]}
            colors={["#8B5CF6", "#A78BFA", "#10B981", "#34D399"]}
            valueFormatter={(value: number, category?: string) => {
              if (category?.includes("proteins")) return `${value}g`;
              return `${value} kcal`;
            }}
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
                  <p className="text-emerald-500">
                    Protéines: {props.payload[3]?.value} / {props.payload[2]?.value}g
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