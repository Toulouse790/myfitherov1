import { useState } from "react";
import { ExerciseSets } from "../ExerciseSets";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";

interface ExerciseDetailProps {
  exercise: string;
}

export const ExerciseDetail = ({ exercise }: ExerciseDetailProps) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [weight, setWeight] = useState(10);
  const [reps, setReps] = useState(12);
  const [restTimer, setRestTimer] = useState<number | null>(null);

  const handleSetComplete = () => {
    if (currentSet < 3) {
      setCurrentSet(prev => prev + 1);
      setRestTimer(90);
      
      const interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">{exercise}</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Poids (kg)</label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                min={0}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Répétitions</label>
              <Input
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                min={1}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Série {currentSet}/3</h3>
              {restTimer !== null && (
                <div className="flex items-center gap-2 text-primary animate-pulse">
                  <Timer className="h-4 w-4" />
                  <span>{restTimer}s</span>
                </div>
              )}
            </div>

            <Button
              onClick={handleSetComplete}
              className="w-full"
              disabled={restTimer !== null}
            >
              {currentSet === 3 ? "Terminer l'exercice" : "Série terminée"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};