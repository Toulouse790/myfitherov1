import { useState, useEffect } from "react";
import { exerciseImages } from "../data/exerciseImages";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExerciseMedia } from "@/types/exercise-media";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Check, Dumbbell } from "lucide-react";

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
          .select('*')
          .in('exercise_name', exercises)
          .eq('media_type', 'image');

        if (error) throw error;

        const mediaMap = (data as ExerciseMedia[]).reduce((acc, { exercise_name, media_url }) => ({
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
    <div className="space-y-2">
      <h3 className="font-medium text-lg mb-4">Programme</h3>
      {exercises.map((exercise, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div 
            onClick={() => isWorkoutStarted && onExerciseClick(index)}
            className={`
              p-3 rounded-lg transition-all duration-300 cursor-pointer
              hover:bg-accent
              ${currentExerciseIndex === index ? 'ring-2 ring-primary bg-primary/5' : 'bg-card'}
              ${!isWorkoutStarted && 'opacity-50 cursor-not-allowed'}
            `}
          >
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                {exerciseMedia[exercise] ? (
                  <img 
                    src={exerciseMedia[exercise]} 
                    alt={exercise}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Dumbbell className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{exercise}</p>
                  {index < currentExerciseIndex && (
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  3 séries • 12 répétitions
                </p>
              </div>
              {currentExerciseIndex === index && (
                <Badge variant="secondary" className="flex-shrink-0">
                  En cours
                </Badge>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};