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
    <Card className="w-full sm:w-auto">
      <CardHeader className="p-3">
        <CardTitle className="text-sm sm:text-base">Suivi hebdomadaire</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="h-[250px]">
          <BarChart
            data={data}
            index="name"
            categories={["calories"]}
            colors={["#8B5CF6"]}
            valueFormatter={(value: number) => `${value} kcal`}
            yAxisWidth={48}
            ticks={[0, 500, 1000, 1500, 2000, 2500, 3000]}
          />
        </div>
      </CardContent>
    </Card>
  );
};