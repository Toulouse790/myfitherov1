import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts/BarChart";
import { useDailyTargets } from "@/hooks/use-daily-targets";

export const NutritionChart = () => {
  const { dailyTargets } = useDailyTargets();
  
  const data = [
    { name: "Lun", calories: 1800, proteins: 140, target: dailyTargets?.calories || 2000 },
    { name: "Mar", calories: 2100, proteins: 160, target: dailyTargets?.calories || 2000 },
    { name: "Mer", calories: 1950, proteins: 145, target: dailyTargets?.calories || 2000 },
    { name: "Jeu", calories: 2000, proteins: 150, target: dailyTargets?.calories || 2000 },
    { name: "Ven", calories: 2200, proteins: 170, target: dailyTargets?.calories || 2000 },
    { name: "Sam", calories: 1900, proteins: 145, target: dailyTargets?.calories || 2000 },
    { name: "Dim", calories: 1850, proteins: 140, target: dailyTargets?.calories || 2000 },
  ];

  return (
    <Card className="w-full bg-white">
      <CardHeader className="p-4 border-b">
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
          Suivi hebdomadaire
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="h-[250px] sm:h-[300px] w-full">
          <BarChart
            data={data}
            index="name"
            categories={["calories", "proteins", "target"]}
            colors={["#8B5CF6", "#10B981", "#6B7280"]}
            valueFormatter={(value: number, category: string) => {
              if (category === "calories") return `${value} kcal`;
              if (category === "proteins") return `${value}g`;
              return `${value} kcal`;
            }}
            yAxisWidth={48}
            showLegend={true}
            showGridLines={false}
            startEndOnly={false}
            showAnimation={true}
            className="[&_.recharts-cartesian-grid-horizontal_line]:stroke-gray-200 [&_.recharts-cartesian-axis-tick-value]:fill-gray-600 [&_.recharts-cartesian-axis-tick-value]:text-xs sm:text-sm"
            customTooltip={(props: any) => (
              <div className="bg-white p-2 rounded-lg border shadow-xl">
                <p className="text-gray-900 font-medium">{props.payload[0]?.payload.name}</p>
                {props.payload.map((entry: any, index: number) => (
                  <p 
                    key={index} 
                    className={
                      entry.dataKey === "calories" 
                        ? "text-purple-500"
                        : entry.dataKey === "proteins"
                          ? "text-emerald-500"
                          : "text-gray-500"
                    }
                  >
                    {entry.dataKey === "calories" && `${entry.value} kcal`}
                    {entry.dataKey === "proteins" && `${entry.value}g protéines`}
                    {entry.dataKey === "target" && `Objectif: ${entry.value} kcal`}
                  </p>
                ))}
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};