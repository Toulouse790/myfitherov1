import { useState, useEffect } from "react";
import { exerciseImages } from "../data/exerciseImages";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExerciseMedia } from "@/types/exercise-media";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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
    <div className="space-y-4">
      {exercises.map((exercise, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div 
            onClick={() => isWorkoutStarted && onExerciseClick(index)}
            className={`
              p-4 rounded-lg transition-all duration-300 cursor-pointer
              bg-card hover:bg-accent
              ${currentExerciseIndex === index ? 'ring-2 ring-primary shadow-lg' : ''}
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
                {currentExerciseIndex === index && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      En cours
                    </Badge>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{exercise}</h3>
                <p className="text-sm text-muted-foreground">3 séries • 12 répétitions</p>
                {currentExerciseIndex === index && (
                  <Badge variant="outline" className="mt-2">
                    Exercice actuel
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};