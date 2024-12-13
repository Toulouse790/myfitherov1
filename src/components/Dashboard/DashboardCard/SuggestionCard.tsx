import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface SuggestionCardProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  isPrimary?: boolean;
}

const MotionCard = motion(Card);

export const SuggestionCard = ({ 
  to, 
  icon: Icon, 
  title, 
  description, 
  isPrimary 
}: SuggestionCardProps) => {
  return (
    <MotionCard 
      className={`p-3 sm:p-4 hover:shadow-lg transition-all cursor-pointer ${
        isPrimary ? 'bg-gradient-to-br from-primary/5 to-background' : ''
      }`}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <Link to={to} className="block">
        <div className="flex flex-col items-center gap-3">
          <div className={isPrimary ? "relative" : ""}>
            {isPrimary && <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm" />}
            <Icon className={`w-6 h-6 sm:w-8 sm:h-8 text-primary ${isPrimary ? "relative" : ""}`} />
          </div>
          <div className="text-center">
            <h2 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">{title}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </Link>
    </MotionCard>
  );
};