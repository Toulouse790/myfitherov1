import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        console.log('Début du comptage des exercices...');
        const { data: exercises, error } = await supabase
          .from('exercises')
          .select('id, name, muscle_group')
          .eq('is_published', true);

        if (error) {
          console.error('Erreur lors de la récupération des exercices:', error);
          throw error;
        }

        const counts: {[key: string]: number} = {};
        
        if (exercises) {
          console.log(`Nombre total d'exercices récupérés:`, exercises.length);
          exercises.forEach(exercise => {
            if (!exercise.muscle_group) {
              console.warn(`Exercice sans groupe musculaire:`, exercise);
              return;
            }
            const translatedGroup = translateMuscleGroup(exercise.muscle_group).toLowerCase();
            counts[translatedGroup] = (counts[translatedGroup] || 0) + 1;
          });
        }

        console.log('Comptage final des exercices par groupe:', counts);
        setExerciseCounts(counts);
      } catch (error) {
        console.error('Erreur lors du comptage des exercices:', error);
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
    console.log('Groupe musculaire cliqué:', muscleId);
    setSelectedId(muscleId);
    onMuscleGroupClick(muscleId);
  };

  const getMuscleGroupCount = (muscleId: string): number => {
    const translatedGroup = translateMuscleGroup(muscleId);
    console.log(`Récupération du compte pour: ${muscleId}, traduit en: ${translatedGroup}`);
    const count = exerciseCounts[translatedGroup.toLowerCase()] || 0;
    console.log(`Nombre d'exercices trouvés: ${count}`);
    return count;
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