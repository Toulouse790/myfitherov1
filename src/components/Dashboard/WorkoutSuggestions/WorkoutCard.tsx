
import { Bookmark, Dumbbell, Clock, Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export interface WorkoutCardProps {
  title: string;
  description: string;
  sessionId: string;
  duration?: number | null;
  difficulty?: string | null;
  muscleGroups?: string[];
  onSelect: () => void;
  lastUsed?: string | null;
}

export const WorkoutCard = ({
  title,
  description,
  sessionId,
  duration,
  difficulty,
  muscleGroups,
  onSelect,
  lastUsed
}: WorkoutCardProps) => {
  const { t } = useLanguage();
  
  const getDifficultyColor = (difficulty: string | null) => {
    if (!difficulty) return "bg-gray-100";
    switch (difficulty.toLowerCase()) {
      case "easy": case "facile": return "bg-green-100 text-green-800";
      case "moderate": case "modéré": return "bg-blue-100 text-blue-800";
      case "challenging": case "difficile": return "bg-orange-100 text-orange-800";
      case "intense": return "bg-red-100 text-red-800";
      case "adaptive": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100";
    }
  };

  const getDifficultyTranslation = (difficulty: string | null) => {
    if (!difficulty) return "";
    const key = `difficulty.${difficulty.toLowerCase()}`;
    const translation = t(key);
    return translation === key ? difficulty : translation;
  };

  // Render appropriate icon based on workout title or type
  const getIcon = () => {
    if (title.toLowerCase().includes("favorite") || title.toLowerCase().includes("favori")) {
      return <Bookmark className="h-5 w-5 text-primary" />;
    }
    return <Dumbbell className="h-5 w-5 text-primary" />;
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {getIcon()}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="p-3 pt-0 pb-0 space-y-3">
        {duration && (
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{t("workouts.durationMinutes", { duration })}</span>
          </div>
        )}
        
        {difficulty && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${getDifficultyColor(difficulty)} text-xs`}>
              {getDifficultyTranslation(difficulty)}
            </Badge>
          </div>
        )}
        
        {muscleGroups && muscleGroups.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {muscleGroups.map((group, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {t(`muscleGroups.${group}`, { fallback: group })}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 pt-3">
        <Button 
          onClick={onSelect} 
          className="w-full"
          variant="default"
          size="sm"
        >
          {t("workouts.selectWorkout")}
        </Button>
      </CardFooter>
    </Card>
  );
};
