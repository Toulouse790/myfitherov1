import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SuggestionCardProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  isPrimary?: boolean;
}

export const SuggestionCard = ({
  to,
  icon: Icon,
  title,
  description,
  isPrimary = false
}: SuggestionCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Navigating to:", to);
    navigate(to);
  };

  return (
    <Card
      className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
        isPrimary ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-accent'
      }`}
      onClick={handleClick}
    >
      <div className="space-y-4">
        <div className={`w-12 h-12 rounded-full ${isPrimary ? 'bg-primary-foreground/10' : 'bg-primary/10'} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${isPrimary ? 'text-primary-foreground' : 'text-primary'}`} />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className={`text-sm ${isPrimary ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};