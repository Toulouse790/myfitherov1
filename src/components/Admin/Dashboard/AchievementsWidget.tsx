import { Card } from "@/components/ui/card";

interface AchievementsWidgetProps {
  data: any[];
  title: string;
}

export const AchievementsWidget = ({ data, title }: AchievementsWidgetProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p>Nombre de succès: {data?.length || 0}</p>
    </Card>
  );
};