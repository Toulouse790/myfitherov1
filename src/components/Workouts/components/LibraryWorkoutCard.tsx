
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dumbbell, Clock } from "lucide-react";

interface LibraryWorkoutCardProps {
  template: any;
}

export const LibraryWorkoutCard = ({ template }: LibraryWorkoutCardProps) => {
  const navigate = useNavigate();
  const { t, getNestedTranslation } = useLanguage();
  const muscleGroups = getNestedTranslation("muscleGroups");
  
  const handleStartWorkout = () => {
    navigate(`/workouts/start/${template.id}`);
  };
  
  // Obtenir les groupes musculaires traduits
  const getMuscleGroupName = (key: string) => {
    return muscleGroups[key] || key;
  };
  
  // Trouver les groupes musculaires uniques dans le template
  const getUniqueMuscleGroups = () => {
    if (!template.exercise_data || !Array.isArray(template.exercise_data)) {
      return [];
    }
    
    const groups = template.exercise_data
      .map((ex: any) => ex.muscle_group)
      .filter((group: string) => !!group);
      
    return [...new Set(groups)];
  };
  
  const uniqueMuscleGroups = getUniqueMuscleGroups();
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-primary" />
            <h3 className="font-medium line-clamp-1">{template.name}</h3>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground gap-2">
            <Clock className="h-3 w-3" />
            <span>{template.duration || "30"} {t("workouts.min")}</span>
            <span>•</span>
            <span>{template.exercise_data?.length || 0} {t("workouts.exercises")}</span>
          </div>
          
          {uniqueMuscleGroups.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {uniqueMuscleGroups.slice(0, 3).map((group: string, index: number) => (
                <span key={index} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {getMuscleGroupName(group)}
                </span>
              ))}
              {uniqueMuscleGroups.length > 3 && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  +{uniqueMuscleGroups.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-2">
        <Button 
          onClick={handleStartWorkout} 
          className="w-full"
        >
          {t("workouts.startWorkout")}
        </Button>
      </CardFooter>
    </Card>
  );
};
