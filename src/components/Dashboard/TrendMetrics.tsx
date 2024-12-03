import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { MetricHistoryDialog } from "./MetricHistoryDialog";

// Données mockées pour l'historique - à remplacer par des données réelles
const mockHistory = {
  daily: Array.from({ length: 7 }, (_, i) => ({
    date: `J-${6-i}`,
    value: Math.floor(Math.random() * 100),
  })),
  weekly: Array.from({ length: 4 }, (_, i) => ({
    date: `S-${3-i}`,
    value: Math.floor(Math.random() * 400),
  })),
  monthly: Array.from({ length: 6 }, (_, i) => ({
    date: `M-${5-i}`,
    value: Math.floor(Math.random() * 1200),
  })),
};

const metrics = [
  { 
    label: "Entraînements", 
    value: "4", 
    color: "text-blue-400",
    history: mockHistory
  },
  { 
    label: "Volume", 
    value: "31 209 kg", 
    color: "text-cyan-400",
    history: mockHistory
  },
  { 
    label: "Calories", 
    value: "1 506", 
    color: "text-pink-400",
    history: mockHistory
  },
  { 
    label: "Séries", 
    value: "91", 
    color: "text-purple-400",
    history: mockHistory
  }
];

export const TrendMetrics = () => {
  const [selectedMetric, setSelectedMetric] = useState<typeof metrics[0] | null>(null);

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
          <Card 
            key={index} 
            className="bg-[#1E2330] p-4 cursor-pointer hover:bg-[#252B3B] transition-all duration-300"
            onClick={() => setSelectedMetric(metric)}
          >
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

      <MetricHistoryDialog
        open={selectedMetric !== null}
        onOpenChange={(open) => !open && setSelectedMetric(null)}
        metric={selectedMetric || metrics[0]}
      />
    </div>
  );
};