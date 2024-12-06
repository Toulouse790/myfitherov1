import { Card } from "@/components/ui/card";
import { Timer, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface Exercise {
  name: string;
  defaultSets: number;
  defaultReps: number;
}

export const NextWorkoutCard = () => {
  const navigate = useNavigate();
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseSets, setExerciseSets] = useState<number[][]>([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data, error } = await supabase
          .from('exercises')
          .select('name')
          .limit(4);

        if (error) {
          console.error('Error fetching exercises:', error);
          return;
        }

        if (data) {
          console.log('Fetched exercises:', data);
          const formattedExercises = data.map(ex => ({
            name: ex.name,
            defaultSets: 3,
            defaultReps: 12
          }));
          setExercises(formattedExercises);
          setExerciseSets(
            formattedExercises.map(ex => Array(ex.defaultSets).fill(ex.defaultReps))
          );
        }
      } catch (error) {
        console.error('Error in fetchExercises:', error);
      }
    };

    fetchExercises();
  }, []);

  const handleExerciseClick = (index: number) => {
    setSelectedExercise(selectedExercise === index ? null : index);
  };

  const handleRepsChange = (exerciseIndex: number, setIndex: number, value: string) => {
    const newValue = parseInt(value) || 0;
    const newExerciseSets = [...exerciseSets];
    newExerciseSets[exerciseIndex][setIndex] = newValue;
    setExerciseSets(newExerciseSets);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-background border-border">
      <div className="bg-primary/10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <Timer className="h-4 w-4" />
          <span>Prochain entraînement</span>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-bold text-foreground">
          Dos, Biceps, Épaules
        </h2>
        
        <div className="space-y-2">
          {exercises.map((exercise, index) => (
            <div key={index} className="space-y-2">
              <div 
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer"
                onClick={() => handleExerciseClick(index)}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground">{exercise.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {exercise.defaultSets} séries • {exercise.defaultReps} répétitions
                  </p>
                </div>
              </div>

              {selectedExercise === index && (
                <div className="pl-11 space-y-2 animate-fade-down">
                  {Array.from({ length: exercise.defaultSets }).map((_, setIndex) => (
                    <div key={setIndex} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-16">Série {setIndex + 1}</span>
                      <Input
                        type="number"
                        value={exerciseSets[index][setIndex]}
                        onChange={(e) => handleRepsChange(index, setIndex, e.target.value)}
                        className="w-20 h-8 text-sm bg-background border-input text-foreground"
                        min="1"
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                      <span className="text-xs text-muted-foreground">reps</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};