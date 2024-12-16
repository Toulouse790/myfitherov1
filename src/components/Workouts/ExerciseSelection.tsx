import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface ExerciseSelectionProps {
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
        console.log("Fetching exercises for muscle group:", muscleGroup);

        let query = supabase
          .from('unified_exercises')
          .select('*')
          .eq('is_published', true);

        if (muscleGroup) {
          query = query.eq('muscle_group', muscleGroup.toLowerCase());
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        console.log("Fetched exercises:", data);
        setExercises(data || []);
      } catch (error) {
        console.error('Error fetching exercises:', error);
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

  const handleExerciseToggle = (exerciseName: string) => {
    const newSelection = selectedExercises.includes(exerciseName)
      ? selectedExercises.filter(name => name !== exerciseName)
      : [...selectedExercises, exerciseName];
    
    onSelectionChange(newSelection);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Exercices disponibles ({exercises.length})
        </h2>
        <Button onClick={onClose}>Fermer</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {exercises.map((exercise) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedExercises.includes(exercise.name) ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleExerciseToggle(exercise.name)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{exercise.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {exercise.muscle_group}
                  </p>
                </div>
                {selectedExercises.includes(exercise.name) && (
                  <div className="text-primary">✓</div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};