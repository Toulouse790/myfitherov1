import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { MuscleGroupList } from "./MuscleGroupList";
import { MediaList } from "./MediaList";
import { Exercise } from "@/components/Workouts/exercises/types/exercise";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { muscleGroups } from "../Workouts/workoutConstants";

export const MediaManager = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedGroup, setSelectedGroup] = useState(muscleGroups[0].id);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: exercises, isLoading } = useQuery({
    queryKey: ['exercises', selectedGroup],
    queryFn: async () => {
      console.log('=== MediaManager Debug ===');
      console.log('Selected muscle group:', selectedGroup);

      const { data, error } = await supabase
        .from('unified_exercises')
        .select(`
          *,
          exercise_media (
            media_url,
            media_type
          )
        `)
        .eq('muscle_group', selectedGroup)
        .eq('est_publié', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching exercises:', error);
        throw error;
      }

      console.log('Raw exercises data:', data);

      const mappedExercises = data?.map(dbExercise => {
        const exercise: Exercise = {
          id: dbExercise.id,
          name: dbExercise.name,
          muscleGroup: selectedGroup,
          muscle_group: dbExercise.muscle_group,
          difficulty: Array.isArray(dbExercise.difficulty) ? dbExercise.difficulty : ['beginner'],
          equipment: "",
          location: dbExercise.location || [],
          instructions: [],
          targetMuscles: [],
          objectives: [],
          description: "",
          sets: { beginner: 0, intermediate: 0, advanced: 0 },
          reps: { beginner: 0, intermediate: 0, advanced: 0 },
          restTime: { beginner: 0, intermediate: 0, advanced: 0 },
          calories: 0,
          est_publié: dbExercise.est_publié
        };
        return exercise;
      }) || [];

      console.log('Mapped exercises:', mappedExercises);
      return mappedExercises;
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    setUploadProgress(0);
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulties(prev => {
      if (prev.includes(difficulty)) {
        return prev.filter(d => d !== difficulty);
      }
      return [...prev, difficulty];
    });
  };

  const filteredExercises = exercises || [];
  console.log('Final filtered exercises:', filteredExercises);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Tabs defaultValue={selectedGroup} value={selectedGroup} className="w-full">
        <MuscleGroupList
          selectedGroup={selectedGroup}
          onGroupSelect={setSelectedGroup}
        />
        <MediaList
          exercises={filteredExercises}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
          selectedFile={selectedFile}
          onDifficultyChange={handleDifficultyChange}
          selectedDifficulties={selectedDifficulties}
        />
      </Tabs>
    </div>
  );
};