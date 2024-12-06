import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface ExerciseSelectionProps {
  exercises: any[];
  selectedExercises: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onClose: () => void;
  muscleGroup?: string;
}

export const ExerciseSelection = ({ 
  selectedExercises,
  onSelectionChange,
  onClose,
  muscleGroup 
}: ExerciseSelectionProps) => {
  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching exercises for muscle group:', muscleGroup);

        const { data, error } = await supabase
          .from('exercises')
          .select(`
            id,
            name,
            muscle_group,
            exercise_media (
              media_url
            )
          `)
          .eq('is_published', true);

        if (error) {
          console.error('Error fetching exercises:', error);
          throw error;
        }

        console.log('Raw exercises data:', data);

        // Filter exercises based on muscle group if specified
        let filteredExercises = data;
        if (muscleGroup) {
          filteredExercises = data.filter(exercise => {
            const normalizedMuscleGroup = exercise.muscle_group.toLowerCase();
            const searchTerm = muscleGroup.toLowerCase();
            return normalizedMuscleGroup.includes(searchTerm);
          });
        }

        console.log('Filtered exercises:', filteredExercises);

        if (!filteredExercises || filteredExercises.length === 0) {
          toast({
            title: "Aucun exercice trouvé",
            description: "Aucun exercice n'est disponible pour ce groupe musculaire pour le moment.",
            variant: "destructive",
          });
        }

        // Transform the data to include the media URL
        const exercisesWithMedia = filteredExercises.map(exercise => ({
          id: exercise.id,
          name: exercise.name,
          media_url: exercise.exercise_media?.[0]?.media_url || null
        }));

        setExercises(exercisesWithMedia);
      } catch (error) {
        console.error('Error in fetchExercises:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les exercices",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [muscleGroup, toast]);

  const handleExerciseToggle = (exerciseId: string) => {
    const newSelection = selectedExercises.includes(exerciseId)
      ? selectedExercises.filter(id => id !== exerciseId)
      : [...selectedExercises, exerciseId];
    
    onSelectionChange(newSelection);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun exercice n'est disponible pour ce groupe musculaire pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {exercises.map((exercise) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden hover:shadow-md transition-shadow bg-card">
              <CardHeader className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={exercise.id}
                    checked={selectedExercises.includes(exercise.id)}
                    onCheckedChange={() => handleExerciseToggle(exercise.id)}
                  />
                  <label
                    htmlFor={exercise.id}
                    className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {exercise.name}
                  </label>
                </div>
              </CardHeader>
              <CardContent>
                {exercise.media_url && (
                  <div className="relative aspect-video mb-2 rounded-md overflow-hidden">
                    <img
                      src={exercise.media_url}
                      alt={`Démonstration de l'exercice ${exercise.name}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={onClose}>
          Valider la sélection
        </Button>
      </div>
    </div>
  );
};