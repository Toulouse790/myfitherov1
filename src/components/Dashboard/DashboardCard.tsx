import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

export const DashboardCard = ({ title, value, icon, className }: DashboardCardProps) => {
  return (
    <Card className={cn("p-3 sm:p-4 md:p-6 animate-fade-up", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold">{value}</p>
        </div>
        <div className="text-primary">{icon}</div>
      </div>
    </Card>
  );
};