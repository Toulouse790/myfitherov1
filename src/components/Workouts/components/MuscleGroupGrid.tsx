import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, ChevronRight } from "lucide-react";
import { muscleGroups } from "../workoutConstants";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { reverseTranslateMuscleGroup } from "@/utils/muscleGroupTranslations";

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
        const { data, error } = await supabase
          .from('exercises')
          .select('muscle_group, id')
          .eq('is_published', true);

        if (error) throw error;

        // Créer un objet pour stocker les comptes
        const counts: {[key: string]: number} = {};
        
        // Compter les exercices pour chaque groupe musculaire
        if (data) {
          data.forEach(exercise => {
            const muscleGroup = exercise.muscle_group.toLowerCase();
            counts[muscleGroup] = (counts[muscleGroup] || 0) + 1;
          });
        }

        console.log('Exercise counts:', counts);
        setExerciseCounts(counts);
      } catch (error) {
        console.error('Error fetching exercise counts:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les exercices",
          variant: "destructive",
        });
      }
    };

    fetchExerciseCounts();
  }, [toast]);

  const filteredMuscleGroups = muscleGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClick = (muscleId: string) => {
    setSelectedId(muscleId);
    onMuscleGroupClick(muscleId);
  };

  const getMuscleGroupCount = (muscleId: string): number => {
    const englishName = reverseTranslateMuscleGroup(muscleGroups.find(group => group.id === muscleId)?.name || '');
    return exerciseCounts[englishName.toLowerCase()] || 0;
  };

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