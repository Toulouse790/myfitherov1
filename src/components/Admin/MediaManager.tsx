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
  const [selectedGroup, setSelectedGroup] = useState(muscleGroups[0].name);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: exercises } = useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercises')
        .select('*');

      if (error) {
        console.error('Error fetching exercises:', error);
        throw error;
      }
      console.log('Raw exercises data:', data);
      // Transform the data to match the Exercise type
      return data?.map(exercise => ({
        ...exercise,
        muscleGroup: exercise.muscle_group
      })) as Exercise[];
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

  const filteredExercises = exercises?.filter(
    (exercise) => {
      console.log('Filtering exercise:', exercise);
      console.log('Selected group:', selectedGroup);
      return exercise.muscleGroup === selectedGroup;
    }
  ) || [];

  console.log('Filtered exercises:', filteredExercises);
  console.log('Selected group:', selectedGroup);

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