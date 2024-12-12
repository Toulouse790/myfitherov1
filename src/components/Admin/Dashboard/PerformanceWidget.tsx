import { Card } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";

export const PerformanceWidget = ({ data, title = "Performance" }: { data: any[] | undefined, title?: string }) => {
  return (
    <Card className="p-6 relative">
      <h3 className="font-semibold mb-4">{title}</h3>
      {data && (
        <BarChart
          data={data}
          index="metric"
          categories={["value"]}
          colors={["#EC4899"]}
          valueFormatter={(value: number) => `${value}%`}
        />
      )}
    </Card>
  );
};