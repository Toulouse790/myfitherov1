import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

export const WorkoutTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-16 right-4 bg-primary/10 backdrop-blur-sm rounded-lg p-2 flex items-center gap-1.5 text-primary text-sm">
      <Timer className="h-4 w-4" />
      <span className="font-mono text-sm">{formatTime(seconds)}</span>
    </div>
  );
};