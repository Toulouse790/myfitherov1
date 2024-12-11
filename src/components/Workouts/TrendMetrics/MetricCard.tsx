import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  previousValue?: string;
  isRecord?: boolean;
  onClick?: () => void;
}

export const MetricCard = ({
  label,
  value,
  previousValue,
  isRecord,
  onClick,
}: MetricCardProps) => {
  const improvement = previousValue ? Number(value) - Number(previousValue) : 0;
  const hasImprovement = improvement > 0;

  return (
    <Card
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
        isRecord ? 'border-yellow-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          {isRecord && <Trophy className="w-4 h-4 text-yellow-500" />}
        </div>
        
        <div className="text-2xl font-bold">{value}</div>
        
        {previousValue && (
          <div className={`flex items-center text-sm ${
            hasImprovement ? 'text-green-500' : 'text-red-500'
          }`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${
              !hasImprovement && 'rotate-180'
            }`} />
            {hasImprovement ? '+' : ''}{improvement}
          </div>
        )}
      </div>
    </Card>
  );
};