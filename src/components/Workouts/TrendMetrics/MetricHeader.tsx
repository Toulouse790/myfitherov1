import { ChevronDown } from "lucide-react";

interface MetricHeaderProps {
  title: string;
  period: string;
}

export const MetricHeader = ({ title, period }: MetricHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <button className="text-gray-400 flex items-center gap-1 text-xs">
        {period}
        <ChevronDown className="w-3 h-3" />
      </button>
    </div>
  );
};