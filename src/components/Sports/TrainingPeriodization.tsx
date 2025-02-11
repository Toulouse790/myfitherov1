
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTrainingPeriodization } from "@/hooks/use-training-periodization";

export const TrainingPeriodization = () => {
  const { currentCycle, isLoading, createCycle } = useTrainingPeriodization();

  const handleCreateCycle = async () => {
    await createCycle.mutateAsync({
      cycle_type: 'mesocycle',
      phase: 'preparation',
      start_date: new Date(),
      end_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 jours
      objectives: {
        strength: "increase",
        endurance: "maintain",
        technique: "improve"
      },
      sport_id: currentCycle?.sport_id || ''
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Cycle d'Entraînement Actuel</h3>
          {currentCycle ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Phase</span>
                  <p className="font-medium capitalize">{String(currentCycle.phase)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Type</span>
                  <p className="font-medium capitalize">{String(currentCycle.cycle_type)}</p>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Objectifs</span>
                <div className="mt-2 space-y-2">
                  {Object.entries(currentCycle.objectives).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key}</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Aucun cycle d'entraînement actif
              </p>
              <Button onClick={handleCreateCycle}>
                Créer un nouveau cycle
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
