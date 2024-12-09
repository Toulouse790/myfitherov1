import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseRow } from "./ExerciseRow";
import { AdminHeader } from "./AdminHeader";

export const ExerciseTable = () => {
  const { toast } = useToast();
  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('exercises')
        .select(`
          *,
          exercise_media (*)
        `)
        .order('muscle_group', { ascending: true });

      if (error) throw error;

      console.log('Fetched exercises:', data);
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

  const handleFilterClick = () => {
    toast({
      title: "Filtres",
      description: "Ouverture des filtres",
    });
    // Ici nous pouvons ajouter la logique de filtrage plus tard
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AdminHeader 
        isEditing={isEditing}
        onEditingChange={setIsEditing}
        selectedExercises={selectedExercises}
        onExercisesDeleted={fetchExercises}
        onFilterClick={handleFilterClick}
      />
      <Card className="p-6">
        <div className="space-y-4">
          {exercises.map((exercise) => (
            <ExerciseRow 
              key={exercise.id}
              exercise={exercise}
              onUpdate={fetchExercises}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};