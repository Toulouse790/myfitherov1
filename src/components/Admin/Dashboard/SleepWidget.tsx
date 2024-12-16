import { Card } from "@/components/ui/card";

interface SleepWidgetProps {
  data: any[];
  title: string;
}

export const SleepWidget = ({ data, title }: SleepWidgetProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p>Données de sommeil: {data?.length || 0} enregistrements</p>
    </Card>
  );
};