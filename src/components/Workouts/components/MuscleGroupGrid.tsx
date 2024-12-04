import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, ChevronRight, CheckSquare } from "lucide-react";
import { muscleGroups } from "../workoutConstants";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
          .from('exercise_media')
          .select('exercise_name')
          .eq('media_type', 'image');

        if (error) throw error;

        const counts: {[key: string]: number} = {};
        muscleGroups.forEach(group => {
          counts[group.id] = data.filter(ex => {
            if (group.id === "biceps" || group.id === "triceps") {
              return ex.exercise_name.toLowerCase().includes("biceps") || 
                     ex.exercise_name.toLowerCase().includes("triceps");
            }
            return ex.exercise_name.toLowerCase().includes(group.name.toLowerCase());
          }).length;
        });

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
                {exerciseCounts[muscle.id] || 0} exercices
              </p>
            </div>
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
          </div>
          {exerciseCounts[muscle.id] > 0 && (
            <Badge 
              className="absolute top-2 right-2 bg-primary text-xs"
              variant="secondary"
            >
              <CheckSquare className="h-3 w-3 mr-1" />
              {exerciseCounts[muscle.id]}
            </Badge>
          )}
        </Card>
      ))}
    </div>
  );
};