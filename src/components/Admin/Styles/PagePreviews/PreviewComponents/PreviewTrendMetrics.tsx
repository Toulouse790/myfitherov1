import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export const PreviewTrendMetrics = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5" />
        <h3 className="font-semibold">Tendances</h3>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-primary/20 rounded-full w-3/4" />
        <div className="h-2 bg-primary/20 rounded-full w-1/2" />
        <div className="h-2 bg-primary/20 rounded-full w-2/3" />
      </div>
    </Card>
  );
};