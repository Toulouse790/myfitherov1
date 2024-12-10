import { Card } from "@/components/ui/card";
import { Dumbbell, ChevronRight } from "lucide-react";
import { muscleGroups } from "../workoutConstants";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { translateMuscleGroup } from "@/utils/muscleGroupTranslations";

interface MuscleGroupGridProps {
  searchQuery: string;
  onMuscleGroupClick: (muscleId: string) => void;
}

export const MuscleGroupGrid = ({ searchQuery, onMuscleGroupClick }: MuscleGroupGridProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exerciseCounts, setExerciseCounts] = useState<{[key: string]: number}>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchExerciseCounts = async () => {
      try {
        console.log('Starting exercise count...');
        const { data: exercises, error } = await supabase
          .from('unified_exercises')
          .select('id, name, muscle_group')
          .eq('is_published', true);

        if (error) {
          console.error('Error fetching exercises:', error);
          throw error;
        }

        const counts: {[key: string]: number} = {};
        
        if (exercises) {
          exercises.forEach(exercise => {
            if (!exercise.muscle_group) {
              console.warn(`Exercise without muscle group:`, exercise);
              return;
            }
            const translatedGroup = translateMuscleGroup(exercise.muscle_group).toLowerCase();
            counts[translatedGroup] = (counts[translatedGroup] || 0) + 1;
          });
        }

        console.log('Final exercise count by group:', counts);
        setExerciseCounts(counts);
      } catch (error) {
        console.error('Error counting exercises:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les exercices",
          variant: "destructive",
        });
      }
    };

    fetchExerciseCounts();
  }, [toast]);

  const handleClick = (muscleId: string) => {
    console.log('Muscle group clicked:', muscleId);
    setSelectedId(muscleId);
    onMuscleGroupClick(muscleId);
  };

  const getMuscleGroupCount = (muscleId: string): number => {
    const translatedGroup = translateMuscleGroup(muscleId);
    return exerciseCounts[translatedGroup.toLowerCase()] || 0;
  };

  const filteredMuscleGroups = muscleGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {filteredMuscleGroups.map((muscle) => (
        <Card
          key={muscle.id}
          onClick={() => handleClick(muscle.id)}
          className={`p-4 cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden
            ${selectedId === muscle.id ? 'ring-2 ring-primary' : ''}`}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Dumbbell className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm sm:text-base truncate">{muscle.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {getMuscleGroupCount(muscle.id)} exercices
              </p>
            </div>
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
          </div>
        </Card>
      ))}
    </div>
  );
};