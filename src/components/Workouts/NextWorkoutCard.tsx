import { Card } from "@/components/ui/card";
import { SkipForward, RotateCcw, Send, Timer, Plus, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { exerciseImages } from "./data/exerciseImages";
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
  },
  {
    name: "Élévations Latérales",
    defaultSets: 3,
    defaultReps: 15
  },
  {
    name: "Crunch",
    defaultSets: 3,
    defaultReps: 20
  },
  {
    name: "Planche",
    defaultSets: 3,
    defaultReps: 30
  }
];

export const NextWorkoutCard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [exerciseSets, setExerciseSets] = useState(
    SAMPLE_EXERCISES.map(ex => Array(ex.defaultSets).fill(ex.defaultReps))
  );

  const handleCardClick = () => {
    navigate('/workouts/exercise/next-workout');
  };

  const handleCreateManual = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/workouts');
    toast({
      title: "Création manuelle",
      description: "Créez votre propre séance d'entraînement",
    });
  };

  const handleExerciseClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedExercise(selectedExercise === index ? null : index);
  };

  const handleRepsChange = (exerciseIndex: number, setIndex: number, value: string) => {
    const newValue = parseInt(value) || 0;
    const newExerciseSets = [...exerciseSets];
    newExerciseSets[exerciseIndex][setIndex] = newValue;
    setExerciseSets(newExerciseSets);
  };

  return (
    <Card 
      className="w-full max-w-2xl mx-auto bg-gradient-to-br from-[#1E2330] to-[#252B3B] border-[#2A2F3F] overflow-hidden animate-fade-up cursor-pointer relative group"
      onClick={handleCardClick}
    >
      <div className="bg-gradient-to-r from-primary to-secondary text-white px-2 py-1 text-xs sm:text-sm font-medium flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Timer className="h-3 w-3 animate-pulse" />
          <span>Prochain entraînement (IA)</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-5 w-5 bg-background/50 backdrop-blur-sm"
          onClick={handleCreateManual}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="p-4 space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white">
          Dos, Biceps, Épaules, Abdos
        </h2>
        
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
          <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
            <Timer className="w-3 h-3" />
            <span>61 mins</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-500" />
          <div className="bg-white/5 px-2 py-0.5 rounded-full">
            {SAMPLE_EXERCISES.length} exercices
          </div>
        </div>
        
        <div className="space-y-2">
          {SAMPLE_EXERCISES.map((exercise, index) => (
            <div key={index}>
              <div 
                className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
                onClick={(e) => handleExerciseClick(index, e)}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
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
                <div className="mt-2 pl-11 space-y-2 animate-fade-down">
                  {Array.from({ length: exercise.defaultSets }).map((_, setIndex) => (
                    <div key={setIndex} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-16">Série {setIndex + 1}</span>
                      <Input
                        type="number"
                        value={exerciseSets[index][setIndex]}
                        onChange={(e) => handleRepsChange(index, setIndex, e.target.value)}
                        className="w-20 h-8 text-sm bg-white/10 border-white/20 text-white"
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
        
        <div className="flex justify-start gap-2 sm:gap-3">
          {[
            { icon: SkipForward },
            { icon: RotateCcw },
            { icon: Send }
          ].map(({ icon: Icon }, index) => (
            <button 
              key={index}
              className="text-gray-400"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};