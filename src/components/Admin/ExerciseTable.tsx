import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseRow } from "./ExerciseRow";
import { AdminHeader } from "./AdminHeader";
import { FilterDialog } from "./FilterDialog";
import { reverseTranslateMuscleGroup } from "@/utils/muscleGroupTranslations";

interface ExerciseTableProps {
  isPublished: boolean;
}

export const ExerciseTable = ({ isPublished }: ExerciseTableProps) => {
  const { toast } = useToast();
  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
  }, [selectedMuscleGroup, isPublished]);

  const fetchExercises = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('exercises')
        .select(`
          *,
          exercise_media (*)
        `)
        .eq('is_published', isPublished);

      if (selectedMuscleGroup) {
        const englishMuscleGroup = reverseTranslateMuscleGroup(selectedMuscleGroup);
        console.log('Filtering by muscle group:', englishMuscleGroup);
        query = query.eq('muscle_group', englishMuscleGroup.toLowerCase());
      }

      const { data, error } = await query;

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
    setShowFilterDialog(true);
  };

  const handleFilterApply = (muscleGroup: string) => {
    console.log('Applying filter for muscle group:', muscleGroup);
    setSelectedMuscleGroup(muscleGroup);
    setShowFilterDialog(false);
    toast({
      title: "Filtre appliqué",
      description: `Affichage des exercices pour : ${muscleGroup}`,
    });
  };

  const handleFilterReset = () => {
    setSelectedMuscleGroup(null);
    toast({
      title: "Filtres réinitialisés",
      description: "Affichage de tous les exercices",
    });
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
        selectedExercises={selectedExercises}
        onExercisesDeleted={fetchExercises}
        onFilterClick={handleFilterClick}
        onFilterReset={handleFilterReset}
        hasActiveFilter={!!selectedMuscleGroup}
        showPublishButton={!isPublished}
      />
      <FilterDialog 
        open={showFilterDialog} 
        onOpenChange={setShowFilterDialog}
        onFilterApply={handleFilterApply}
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