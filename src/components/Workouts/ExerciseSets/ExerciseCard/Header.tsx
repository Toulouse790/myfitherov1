import React from 'react';

interface HeaderProps {
  exerciseName: string;
  completedSets: number;
  totalSets: number;
  onToggleExpand: () => void;
}

export const Header = ({ exerciseName, completedSets, totalSets, onToggleExpand }: HeaderProps) => {
  return (
    <div 
      className="p-4 cursor-pointer flex items-center justify-between bg-muted/10"
      onClick={onToggleExpand}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">{exerciseName}</h3>
        <span className="text-sm text-muted-foreground">
          {completedSets}/{totalSets} séries
        </span>
      </div>
    </div>
  );
};