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
    <div className="fixed top-20 right-4 bg-primary/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2 text-primary">
      <Timer className="h-5 w-5" />
      <span className="font-mono font-medium">{formatTime(seconds)}</span>
    </div>
  );
};