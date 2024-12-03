import React from 'react';
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  completedSets: number;
  totalSets: number;
}

export const ProgressBar = ({ completedSets, totalSets }: ProgressBarProps) => {
  const progress = (completedSets / totalSets) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Progression</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};