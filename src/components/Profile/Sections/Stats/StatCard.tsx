
import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  value: number | string;
  label: string;
}

export const StatCard = ({ icon, value, label }: StatCardProps) => {
  return (
    <div className="text-center">
      <div className="w-6 h-6 mx-auto mb-2 text-primary">
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};
