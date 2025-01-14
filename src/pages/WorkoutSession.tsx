import { Header } from "@/components/Layout/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Timer, Play, Pause, SkipForward, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export default function WorkoutSession() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [restTime, setRestTime] = useState(90);
  const [isResting, setIsResting] = useState(false);
  const [timer, setTimer] = useState(90);
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      name: "Squats",
      sets: 4,
      reps: 12,
      weight: 60,
      completed: false
    },
    {
      name: "Bench Press",
      sets: 4,
      reps: 10,
      weight: 80,
      completed: false
    }
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResting(false);
      toast({
        title: "Repos terminé !",
        description: "C'est reparti ! 💪",
      });
    }
    return () => clearInterval(interval);
  }, [isResting, timer, toast]);

  const adjustRestTime = (adjustment: number) => {
    const newTime = restTime + adjustment;
    if (newTime >= 15 && newTime <= 300) {
      setRestTime(newTime);
      setTimer(newTime);
    }
  };

  const startRest = () => {
    setIsResting(true);
    setTimer(restTime);
  };

  const skipRest = () => {
    setIsResting(false);
    setTimer(restTime);
  };

  const completeExercise = () => {
    const updatedExercises = [...exercises];
    updatedExercises[currentExerciseIndex].completed = true;
    setExercises(updatedExercises);

    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      startRest();
    } else {
      // Workout completed
      toast({
        title: "Séance terminée !",
        description: "Félicitations pour votre séance ! 🎉",
      });
      navigate("/workout-summary");
    }
  };

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <Header>
      <div className="container mx-auto px-4 py-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Current Exercise Card */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">{currentExercise.name}</h2>
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Séries</p>
                <p className="text-xl font-semibold">{currentExercise.sets}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Répétitions</p>
                <p className="text-xl font-semibold">{currentExercise.reps}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Poids (kg)</p>
                <p className="text-xl font-semibold">{currentExercise.weight}</p>
              </div>
            </div>
            
            <Button 
              onClick={completeExercise}
              className="w-full gap-2"
              size="lg"
            >
              <CheckCircle className="w-5 h-5" />
              Valider l'exercice
            </Button>
          </Card>

          {/* Rest Timer Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Temps de repos</h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustRestTime(-15)}
                  disabled={restTime <= 15}
                >
                  -15s
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustRestTime(15)}
                  disabled={restTime >= 300}
                >
                  +15s
                </Button>
              </div>
            </div>

            <div className="text-center mb-4">
              <p className="text-3xl font-bold">
                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1 gap-2"
                onClick={() => setIsResting(!isResting)}
              >
                {isResting ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Démarrer
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={skipRest}
              >
                <SkipForward className="w-5 h-5" />
                Passer
              </Button>
            </div>
          </Card>

          {/* Exercise Progress */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Progression</h3>
            <div className="space-y-2">
              {exercises.map((exercise, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md flex items-center justify-between ${
                    index === currentExerciseIndex
                      ? 'bg-primary/10 border border-primary'
                      : exercise.completed
                      ? 'bg-muted/50'
                      : 'bg-muted'
                  }`}
                >
                  <span className={exercise.completed ? 'line-through' : ''}>
                    {exercise.name}
                  </span>
                  {exercise.completed && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </Header>
  );
}