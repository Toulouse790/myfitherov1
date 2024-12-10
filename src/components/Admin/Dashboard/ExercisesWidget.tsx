import { Card } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";

export const ExercisesWidget = ({ data }: { data: any[] | undefined }) => {
  return (
    <Card className="p-6 relative">
      <h3 className="font-semibold mb-4">Exercices publiés</h3>
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