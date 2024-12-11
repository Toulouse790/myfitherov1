import { Card } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";

export const ExercisesWidget = ({ data, title = "Exercices publiés" }: { data: any[] | undefined, title?: string }) => {
  return (
    <Card className="p-6 relative">
      <h3 className="font-semibold mb-4">{title}</h3>
      {data && (
        <BarChart
          data={data}
          index="day"
          categories={["exercises"]}
          colors={["#F59E0B"]}
          valueFormatter={(value: number) => `${value} exercices publiés`}
        />
      )}
    </Card>
  );
};