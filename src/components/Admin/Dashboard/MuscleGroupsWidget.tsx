import { Card } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";

export const MuscleGroupsWidget = ({ data, title = "Groupes musculaires" }: { data: any[] | undefined, title?: string }) => {
  return (
    <Card className="p-6 relative">
      <h3 className="font-semibold mb-4">{title}</h3>
      {data && (
        <BarChart
          data={data}
          index="muscle"
          categories={["frequency"]}
          colors={["#3B82F6"]}
          valueFormatter={(value: number) => `${value}%`}
        />
      )}
    </Card>
  );
};