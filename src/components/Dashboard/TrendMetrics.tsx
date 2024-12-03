import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

const metrics = [
  { label: "Entraînements", value: "4", color: "text-blue-400" },
  { label: "Volume", value: "31 209 kg", color: "text-cyan-400" },
  { label: "Calories", value: "1 506", color: "text-pink-400" },
  { label: "Séries", value: "91", color: "text-purple-400" }
];

export const TrendMetrics = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Tendances</h2>
        <button className="text-gray-400 flex items-center gap-1 text-sm">
          7 derniers jours
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-[#1E2330] p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                </span>
                <p className="text-gray-400">{metric.label}</p>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};