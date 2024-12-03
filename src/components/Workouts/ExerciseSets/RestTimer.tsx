import React from 'react';
import { Timer } from "lucide-react";

interface RestTimerProps {
  restTimer: number | null;
}

export const RestTimer = ({ restTimer }: RestTimerProps) => {
  if (restTimer === null) return null;

  return (
    <div className="fixed bottom-20 right-4 bg-primary text-primary-foreground px-6 py-3 rounded-full animate-pulse shadow-lg">
      <div className="flex items-center gap-2">
        <Timer className="h-5 w-5" />
        <span className="font-medium">{restTimer}s</span>
      </div>
    </div>
  );
};