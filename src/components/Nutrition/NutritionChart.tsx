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
    <Card className="w-full sm:w-auto bg-[#1E2330] border-none shadow-lg">
      <CardHeader className="p-4 border-b border-gray-800">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          Suivi hebdomadaire
          <span className="text-sm font-normal text-gray-400">(calories)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[300px] w-full">
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
            className="[&_.recharts-cartesian-grid-horizontal_line]:stroke-gray-800 [&_.recharts-cartesian-axis-tick-value]:fill-gray-400"
            customTooltip={(props: any) => (
              <div className="bg-[#2A2F3F] p-2 rounded-lg border border-gray-700 shadow-xl">
                <p className="text-white font-medium">{props.payload[0]?.payload.name}</p>
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