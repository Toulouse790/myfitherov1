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
  const { toast } = useToast();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        let query = supabase
          .from('exercise_media')
          .select('*')
          .eq('media_type', 'image');

        // Map muscle group IDs to search terms
        const searchTermMap: { [key: string]: string } = {
          chest: 'poitrine',
          back: 'dos',
          legs: 'jambes',
          shoulders: 'épaules',
          biceps: 'biceps',
          triceps: 'triceps',
          abs: 'abdominaux'
        };

        if (muscleGroup && searchTermMap[muscleGroup]) {
          query = query.ilike('exercise_name', `%${searchTermMap[muscleGroup]}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        console.log('Fetched exercises:', data);
        setExercises(data || []);

        if (!data || data.length === 0) {
          toast({
            title: "Aucun exercice trouvé",
            description: "Aucun exercice n'est disponible pour ce groupe musculaire pour le moment.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les exercices",
          variant: "destructive",
        });
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
                    {exercise.exercise_name}
                  </label>
                </div>
              </CardHeader>
              <CardContent>
                {exercise.media_url && (
                  <div className="relative aspect-video mb-2 rounded-md overflow-hidden">
                    <img
                      src={exercise.media_url}
                      alt={`Démonstration de l'exercice ${exercise.exercise_name}`}
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