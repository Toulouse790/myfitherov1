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
      console.log('Fetching exercises with isPublished:', isPublished);
      
      const { data, error } = await supabase
        .from('exercises')
        .select(`
          *,
          exercise_media (*)
        `)
        .eq('is_published', isPublished);

      if (error) throw error;

      // Remove duplicates based on exercise ID
      const uniqueExercises = data?.reduce((acc: any[], current: any) => {
        const exists = acc.find(item => item.id === current.id);
        if (!exists) {
          acc.push(current);
        } else {
          console.log('Found duplicate exercise:', current.name, 'with ID:', current.id);
        }
        return acc;
      }, []) || [];

      console.log('Total exercises before deduplication:', data?.length);
      console.log('Total exercises after deduplication:', uniqueExercises.length);

      setExercises(uniqueExercises);
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
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
      />
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