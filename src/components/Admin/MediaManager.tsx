import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { MuscleGroupList } from "./MuscleGroupList";
import { MediaList } from "./MediaList";
import { Exercise } from "@/components/Workouts/exercises/types/exercise";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

      if (error) throw error;
      return data as Exercise[];
    }
  });

  const filteredExercises = exercises?.filter(
    (exercise) => exercise.muscleGroup === selectedGroup
  ) || [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Tabs defaultValue={selectedGroup} className="w-full">
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
