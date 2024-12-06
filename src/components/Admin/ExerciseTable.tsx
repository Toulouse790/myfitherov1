import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseTableContent } from "./ExerciseTableContent";
import { AdminHeader } from "./AdminHeader";

const locations = [
  { id: "gym", name: "Salle" },
  { id: "home", name: "Maison" },
  { id: "outdoor", name: "Extérieur" }
];

const difficulties = [
  { id: "beginner", name: "Débutant" },
  { id: "intermediate", name: "Intermédiaire" },
  { id: "advanced", name: "Avancé" }
];

export const ExerciseTable = () => {
  const { toast } = useToast();
  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
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

  const handleLocationChange = async (exerciseId: string, location: string, checked: boolean) => {
    try {
      const exercise = exercises.find(e => e.id === exerciseId);
      if (!exercise) return;

      const newLocations = checked 
        ? [...(exercise.location || []), location]
        : (exercise.location || []).filter((l: string) => l !== location);

      console.log('Updating exercise locations:', {
        exerciseId,
        newLocations,
        checked
      });

      const { error } = await supabase
        .from('exercises')
        .update({ location: newLocations })
        .eq('id', exerciseId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setExercises(exercises.map(e => 
        e.id === exerciseId ? { ...e, location: newLocations } : e
      ));

      toast({
        title: "Mise à jour réussie",
        description: "Les lieux d'entraînement ont été mis à jour",
      });
    } catch (error) {
      console.error('Error updating exercise locations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les lieux d'entraînement",
        variant: "destructive",
      });
    }
  };

  const handleDifficultyChange = async (exerciseId: string, difficulty: string, checked: boolean) => {
    try {
      const exercise = exercises.find(e => e.id === exerciseId);
      if (!exercise) return;

      const newDifficulties = checked
        ? [...(exercise.difficulty || []), difficulty]
        : (exercise.difficulty || []).filter((d: string) => d !== difficulty);

      console.log('Updating exercise difficulties:', {
        exerciseId,
        newDifficulties,
        checked
      });

      const { error } = await supabase
        .from('exercises')
        .update({ difficulty: newDifficulties })
        .eq('id', exerciseId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setExercises(exercises.map(e =>
        e.id === exerciseId ? { ...e, difficulty: newDifficulties } : e
      ));

      toast({
        title: "Mise à jour réussie",
        description: "Les niveaux de difficulté ont été mis à jour",
      });
    } catch (error) {
      console.error('Error updating exercise difficulties:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les niveaux de difficulté",
        variant: "destructive",
      });
    }
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedExercises(selectedIds);
    console.log('Selected exercises:', selectedIds);
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
      />
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Liste des exercices ({exercises.length})</h3>
          <div className="overflow-x-auto">
            <ExerciseTableContent
              exercises={exercises}
              locations={locations}
              difficulties={difficulties}
              onLocationChange={handleLocationChange}
              onDifficultyChange={handleDifficultyChange}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};