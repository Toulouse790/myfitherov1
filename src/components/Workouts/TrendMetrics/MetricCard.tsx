import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

interface MetricCardProps {
  value: string;
  label: string;
  color: string;
  onClick: () => void;
}

export const MetricCard = ({ value, label, color, onClick }: MetricCardProps) => {
  return (
    <Card 
      className="bg-[#1E2330] p-3 cursor-pointer hover:bg-[#252B3B] transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className={`text-lg font-bold ${color}`}>
            {value}
          </span>
          <p className="text-xs text-gray-400">{label}</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>
    </Card>
  );
};