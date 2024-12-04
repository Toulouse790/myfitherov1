import { Card } from "@/components/ui/card";
import { Timer, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const SAMPLE_EXERCISES = [
  {
    name: "Rowing avec Haltères",
    defaultSets: 3,
    defaultReps: 12
  },
  {
    name: "Tirage à la poulie barre en V",
    defaultSets: 3,
    defaultReps: 12
  },
  {
    name: "Curl Biceps aux Haltères",
    defaultSets: 3,
    defaultReps: 12
  },
  {
    name: "Développé Militaire",
    defaultSets: 4,
    defaultReps: 10
  }
];

export const NextWorkoutCard = () => {
  const navigate = useNavigate();
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [exerciseSets, setExerciseSets] = useState(
    SAMPLE_EXERCISES.map(ex => Array(ex.defaultSets).fill(ex.defaultReps))
  );

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
    <Card className="w-full max-w-2xl mx-auto bg-[#1E2330] border-[#2A2F3F]">
      <div className="bg-primary/10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Timer className="h-4 w-4" />
          <span>Prochain entraînement</span>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-bold text-white">
          Dos, Biceps, Épaules
        </h2>
        
        <div className="space-y-2">
          {SAMPLE_EXERCISES.map((exercise, index) => (
            <div key={index} className="space-y-2">
              <div 
                className="flex items-center gap-3 p-3 rounded-lg bg-[#252B3B]"
                onClick={() => handleExerciseClick(index)}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-white">{exercise.name}</p>
                  <p className="text-xs text-gray-400">
                    {exercise.defaultSets} séries • {exercise.defaultReps} répétitions
                  </p>
                </div>
              </div>

              {selectedExercise === index && (
                <div className="pl-11 space-y-2 animate-fade-down">
                  {Array.from({ length: exercise.defaultSets }).map((_, setIndex) => (
                    <div key={setIndex} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-16">Série {setIndex + 1}</span>
                      <Input
                        type="number"
                        value={exerciseSets[index][setIndex]}
                        onChange={(e) => handleRepsChange(index, setIndex, e.target.value)}
                        className="w-20 h-8 text-sm bg-[#2A2F3F] border-[#353B4B] text-white"
                        min="1"
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                      <span className="text-xs text-gray-400">reps</span>
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