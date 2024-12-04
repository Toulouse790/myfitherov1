import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface WorkoutCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
}

export const WorkoutCard = ({ title, description, icon, onClick }: WorkoutCardProps) => {
  return (
    <Card 
      className="bg-[#2A2F3F] p-3 cursor-pointer"
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className="rounded-full bg-[#1E2330] w-10 h-10 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-white font-medium text-sm sm:text-base">{title}</h3>
        <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">{description}</p>
      </div>
    </Card>
  );
};