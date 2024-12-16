import { Card } from "@/components/ui/card";

interface MuscleGroupsWidgetProps {
  data: any[];
  title: string;
}

export const MuscleGroupsWidget = ({ data, title }: MuscleGroupsWidgetProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p>Groupes musculaires: {data?.length || 0}</p>
    </Card>
  );
};