import { Card } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";

export const AchievementsWidget = ({ data, title = "Récompenses" }: { data: any[] | undefined, title?: string }) => {
  return (
    <Card className="p-6 relative">
      <h3 className="font-semibold mb-4">{title}</h3>
      {data && (
        <BarChart
          data={data}
          index="achievement"
          categories={["count"]}
          colors={["#F59E0B"]}
          valueFormatter={(value: number) => `${value} utilisateurs`}
        />
      )}
    </Card>
  );
};