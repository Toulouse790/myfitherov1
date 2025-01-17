import { Card } from "@/components/ui/card";
import { Bookmark, Dumbbell, Target, Zap, User, Heart, Scale, Beef } from "lucide-react";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      {suggestions.map((suggestion) => {
        const IconComponent = iconMap[suggestion.icon_name as keyof typeof iconMap];
        return (
          <Card
            key={suggestion.id}
            className="p-3 cursor-pointer hover:bg-muted/50 transition-colors min-h-[64px]"
            onClick={() => onSuggestionClick(suggestion.type)}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-primary shrink-0">
                {IconComponent && <IconComponent className="w-5 h-5 text-primary-foreground" />}
              </div>
              <div className="space-y-1">
                <h3 className="text-[14px] font-medium leading-none">{suggestion.title}</h3>
                <p className="text-[12px] text-muted-foreground">
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