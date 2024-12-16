import { Card } from "@/components/ui/card";

interface ExercisesWidgetProps {
  data: any[];
  title: string;
}

export const ExercisesWidget = ({ data, title }: ExercisesWidgetProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p>Nombre d'exercices: {data?.length || 0}</p>
    </Card>
  );
};