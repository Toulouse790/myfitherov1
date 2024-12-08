import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts/BarChart";

export const NutritionChart = () => {
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
    <Card className="w-full bg-white">
      <CardHeader className="p-4 border-b">
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
          Suivi hebdomadaire
          <span className="text-xs sm:text-sm font-normal text-gray-500">(calories)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="h-[250px] sm:h-[300px] w-full">
          <BarChart
            data={data}
            index="name"
            categories={["calories"]}
            colors={["#8B5CF6"]}
            valueFormatter={(value: number) => `${value} kcal`}
            yAxisWidth={48}
            showLegend={false}
            showGridLines={false}
            startEndOnly={false}
            showAnimation={true}
            className="[&_.recharts-cartesian-grid-horizontal_line]:stroke-gray-200 [&_.recharts-cartesian-axis-tick-value]:fill-gray-600 [&_.recharts-cartesian-axis-tick-value]:text-xs sm:text-sm"
            customTooltip={(props: any) => (
              <div className="bg-white p-2 rounded-lg border shadow-xl">
                <p className="text-gray-900 font-medium">{props.payload[0]?.payload.name}</p>
                <p className="text-primary">
                  {props.payload[0]?.value} kcal
                </p>
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};