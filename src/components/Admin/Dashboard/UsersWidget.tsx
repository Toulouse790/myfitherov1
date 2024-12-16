import { Card } from "@/components/ui/card";

interface UsersWidgetProps {
  data: any[];
  title: string;
}

export const UsersWidget = ({ data, title }: UsersWidgetProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p>Nombre d'utilisateurs: {data?.length || 0}</p>
    </Card>
  );
};