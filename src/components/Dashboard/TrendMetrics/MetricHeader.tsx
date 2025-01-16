import { ChevronDown } from "lucide-react";

export const MetricHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">Tendances</h2>
      <button className="text-gray-400 flex items-center gap-1 text-xs">
        7 derniers jours
        <ChevronDown className="w-3 h-3" />
      </button>
    </div>
  );
};