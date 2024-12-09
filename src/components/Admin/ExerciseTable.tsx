import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseRow } from "./ExerciseRow";
import { AdminHeader } from "./AdminHeader";
import { SearchBar } from "@/components/Workouts/components/SearchBar";

interface ExerciseTableProps {
  isPublished: boolean;
}

export const ExerciseTable = ({ isPublished }: ExerciseTableProps) => {
  const { toast } = useToast();
  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchExercises();
  }, [isPublished]);

  const fetchExercises = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('exercises')
        .select(`
          *,
          exercise_media (*)
        `);

      if (isPublished) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;

      if (error) throw error;

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

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        selectedExercises={[]}
        onExercisesDeleted={fetchExercises}
        hasActiveFilter={false}
        showPublishButton={!isPublished}
      />
      <div className="flex justify-between items-center">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>
      <Card className="p-6">
        <div className="space-y-4">
          {filteredExercises.map((exercise) => (
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