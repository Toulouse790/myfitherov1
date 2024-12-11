import { Card } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";

export const WorkoutsWidget = ({ data, title = "Séances d'entraînement" }: { data: any[] | undefined, title?: string }) => {
  return (
    <Card className="p-6 relative">
      <h3 className="font-semibold mb-4">{title}</h3>
      {data && (
        <BarChart
          data={data}
          index="day"
          categories={["workouts"]}
          colors={["#10B981"]}
          valueFormatter={(value: number) => `${value} séances`}
        />
      )}
    </Card>
  );
};