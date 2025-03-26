
import { SleepDataPoint } from "./types";

export const formatDuration = (value: number) => {
  const hours = Math.floor(value);
  const minutes = Math.round((value - hours) * 60);
  return `${hours}h ${minutes}min`;
};

export const generateSleepData = (days = 7): SleepDataPoint[] => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    
    return {
      date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
      sommeilTotal: 6 + Math.random() * 3,
      sommeilProfond: 1 + Math.random() * 1.5,
      sommeilParadoxal: 1 + Math.random() * 1,
      sommeilLéger: 3 + Math.random() * 1.5,
      score: 60 + Math.floor(Math.random() * 40)
    };
  });
};
