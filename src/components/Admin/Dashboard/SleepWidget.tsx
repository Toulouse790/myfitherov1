import { Card } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";

export const SleepWidget = ({ data, title = "Sommeil" }: { data: any[] | undefined, title?: string }) => {
  return (
    <Card className="p-6 relative">
      <h3 className="font-semibold mb-4">{title}</h3>
      {data && (
        <BarChart
          data={data}
          index="day"
          categories={["sleep_hours"]}
          colors={["#8B5CF6"]}
          valueFormatter={(value: number) => `${value}h`}
        />
      )}
    </Card>
  );
};