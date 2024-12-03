import { useState, useEffect } from "react";
import { exerciseImages } from "../data/exerciseImages";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ExerciseListProps {
  exercises: string[];
  currentExerciseIndex: number | null;
  isWorkoutStarted: boolean;
  onExerciseClick: (index: number) => void;
}

export const ExerciseList = ({ 
  exercises, 
  currentExerciseIndex, 
  isWorkoutStarted,
  onExerciseClick 
}: ExerciseListProps) => {
  const [exerciseMedia, setExerciseMedia] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchExerciseMedia = async () => {
      try {
        const { data, error } = await supabase
          .from('exercise_media')
          .select('exercise_name, media_url')
          .in('exercise_name', exercises)
          .eq('media_type', 'image');

        if (error) throw error;

        const mediaMap = data.reduce((acc, { exercise_name, media_url }) => ({
          ...acc,
          [exercise_name]: media_url
        }), {});

        setExerciseMedia(mediaMap);
      } catch (error) {
        console.error('Error fetching exercise media:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les images des exercices",
          variant: "destructive",
        });
      }
    };

    if (exercises.length > 0) {
      fetchExerciseMedia();
    }
  }, [exercises]);

  return (
    <div className="space-y-4">
      {exercises.map((exercise, index) => (
        <div 
          key={index} 
          onClick={() => isWorkoutStarted && onExerciseClick(index)}
          className={`
            p-4 rounded-lg transition-all duration-300 cursor-pointer
            ${currentExerciseIndex === index ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-[#252B3B]'}
            ${!isWorkoutStarted && 'opacity-50 cursor-not-allowed'}
          `}
        >
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
              <img 
                src={exerciseMedia[exercise] || exerciseImages[exercise]} 
                alt={exercise}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-white">{exercise}</h3>
              <p className="text-sm text-gray-400">3 séries • 12 répétitions</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};