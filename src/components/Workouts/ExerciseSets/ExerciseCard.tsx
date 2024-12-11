import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { RestTimer } from "./RestTimer";
import { SetButton } from "./SetButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ExerciseCardProps {
  exerciseName: string;
  weight: number;
  reps: number;
  completedSets: number;
  restTimer: number | null;
  onWeightChange: (value: number) => void;
  onRepsChange: (value: number) => void;
  onSetComplete: (difficulty: string, notes: string) => void;
  isTransitioning?: boolean;
}

export const ExerciseCard = ({
  exerciseName,
  weight,
  reps,
  completedSets,
  restTimer,
  onWeightChange,
  onRepsChange,
  onSetComplete,
  isTransitioning = false
}: ExerciseCardProps) => {
  const [difficulty, setDifficulty] = useState("moderate");
  const [notes, setNotes] = useState("");

  const handleRestTimeChange = (adjustment: number) => {
    if (adjustment !== 0) {
      onSetComplete(difficulty, notes);
    }
  };

  const handleSetComplete = () => {
    onSetComplete(difficulty, notes);
    setDifficulty("moderate");
    setNotes("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`p-6 ${isTransitioning ? 'bg-primary/5' : ''}`}>
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">{exerciseName}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Poids (kg)</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onWeightChange(weight - 2.5)}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => onWeightChange(Number(e.target.value))}
                  className="text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onWeightChange(weight + 2.5)}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Répétitions</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onRepsChange(reps - 1)}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={reps}
                  onChange={(e) => onRepsChange(Number(e.target.value))}
                  className="text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onRepsChange(reps + 1)}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulté perçue</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir la difficulté" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Facile</SelectItem>
                  <SelectItem value="moderate">Modérée</SelectItem>
                  <SelectItem value="hard">Difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                placeholder="Ajouter des notes sur cette série..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
                rows={2}
              />
            </div>

            <RestTimer 
              restTimer={restTimer} 
              onRestTimeChange={handleRestTimeChange}
            />
            
            <SetButton
              isResting={restTimer !== null}
              currentSet={completedSets + 1}
              maxSets={3}
              onComplete={handleSetComplete}
              restTime={restTimer || 0}
              isTransitioning={isTransitioning}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};