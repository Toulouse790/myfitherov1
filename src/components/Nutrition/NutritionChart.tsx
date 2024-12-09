import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts/BarChart";
import { useDailyTargets } from "@/hooks/use-daily-targets";

export const NutritionChart = () => {
  const { dailyTargets } = useDailyTargets();
  
  const data = [
    { name: "Lun", calories: 1800, proteins: 140 },
    { name: "Mar", calories: 2100, proteins: 160 },
    { name: "Mer", calories: 1950, proteins: 145 },
    { name: "Jeu", calories: 2000, proteins: 150 },
    { name: "Ven", calories: 2200, proteins: 170 },
    { name: "Sam", calories: 1900, proteins: 145 },
    { name: "Dim", calories: 1850, proteins: 140 },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="p-4">
        <CardTitle className="text-base font-medium">
          Suivi hebdomadaire
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="h-[200px] w-full">
          <BarChart
            data={data}
            index="name"
            categories={["calories", "proteins"]}
            colors={["#8B5CF6", "#10B981"]}
            valueFormatter={(value: number, category?: string) => {
              if (category === "proteins") return `${value}g`;
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
                {props.payload.map((entry: any, index: number) => (
                  <p 
                    key={index} 
                    className={entry.dataKey === "calories" ? "text-purple-500" : "text-emerald-500"}
                  >
                    {entry.dataKey === "calories" 
                      ? `${entry.value} kcal` 
                      : `${entry.value}g protéines`
                    }
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