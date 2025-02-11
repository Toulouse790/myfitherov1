
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { usePerformancePredictions } from "@/hooks/use-performance-predictions";

interface PerformanceAnalysisProps {
  sportId: string;
}

export const PerformanceAnalysis: React.FC<PerformanceAnalysisProps> = ({ sportId }) => {
  const { predictions, isLoading } = usePerformancePredictions(sportId);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!predictions) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Prédictions de Performance</h3>
          <p className="text-sm text-muted-foreground">
            Basé sur vos données d'entraînement et de récupération
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Niveau de confiance</span>
              <span className="text-sm text-muted-foreground">
                {predictions.confidence_score.toString()}%
              </span>
            </div>
            <Progress value={predictions.confidence_score} />
          </div>

          <div className="grid gap-4">
            {Object.entries(predictions.prediction_data).map(([metric, value]) => (
              <div key={metric} className="flex justify-between items-center">
                <span className="text-sm capitalize">{metric.replace('_', ' ')}</span>
                <span className="font-medium">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
