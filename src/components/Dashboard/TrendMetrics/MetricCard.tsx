
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  color: string;
  icon: React.ReactElement;
  onClick?: () => void;
}

export const MetricCard = ({
  label,
  value,
  unit,
  color,
  icon,
  onClick
}: MetricCardProps) => {
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-md",
        "hover:scale-[1.02] hover:bg-accent/50"
      )}
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className={color}>{icon}</div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
    </Card>
  );
};
