import { Card } from "@/components/ui/card";
import { PieChart } from "@/components/ui/chart";

export const NutritionWidget = ({ data, title = "Nutrition" }: { data: any[] | undefined, title?: string }) => {
  return (
    <Card className="p-6 relative">
      <h3 className="font-semibold mb-4">{title}</h3>
      {data && (
        <PieChart
          data={data}
          index="category"
          categories={["proteins", "carbs", "fats"]}
          colors={["#F59E0B", "#10B981", "#6366F1"]}
          valueFormatter={(value: number) => `${value}g`}
        />
      )}
    </Card>
  );
};