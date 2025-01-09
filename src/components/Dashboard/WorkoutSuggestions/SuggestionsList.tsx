import { Card } from "@/components/ui/card";
import { Bookmark, Dumbbell, Target, Zap, User, Heart, Scale, Beef } from "lucide-react";

interface SuggestionProps {
  suggestion: {
    id: number | string;
    title: string;
    description: string;
    icon_name: string;
    type: string;
  };
  onClick: (type: string) => void;
}

const iconMap = {
  'Bookmark': Bookmark,
  'Target': Target,
  'Zap': Zap,
  'Dumbbell': Dumbbell,
  'User': User,
  'Heart': Heart,
  'Scale': Scale,
  'Beef': Beef
};

export const SuggestionsList = ({ suggestions, onSuggestionClick }: { 
  suggestions: Array<any>,
  onSuggestionClick: (type: string) => void 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {suggestions.map((suggestion) => {
        const IconComponent = iconMap[suggestion.icon_name as keyof typeof iconMap];
        return (
          <Card
            key={suggestion.id}
            className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => onSuggestionClick(suggestion.type)}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary">
                {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h3 className="font-medium">{suggestion.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {suggestion.description}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};