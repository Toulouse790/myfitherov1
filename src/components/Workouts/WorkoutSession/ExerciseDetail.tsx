
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { WorkoutDifficulty } from "../WorkoutDifficulty";
import { ExerciseNotes } from "../ExerciseNotes";
import { debugLogger } from "@/utils/debug-logger";

interface ExerciseDetailProps {
  exerciseName: string;
  onComplete: (exerciseName: string, totalSets: number) => void;
  onBack: () => void;
  initialSets?: number;
}

export const ExerciseDetail = ({ exerciseName, onComplete, onBack, initialSets = 3 }: ExerciseDetailProps) => {
  const [sets, setSets] = useState(initialSets);
  const [weight, setWeight] = useState(50);
  const [reps, setReps] = useState(10);
  const [isCompleted, setIsCompleted] = useState(false);
  const [restTimers, setRestTimers] = useState<{ [key: string]: number | null }>({});
  const [isExerciseTransition, setIsExerciseTransition] = useState(false);
  const [difficulty, setDifficulty] = useState("moderate");
  const [notes, setNotes] = useState("");
  const [calories, setCalories] = useState(0);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Calcul simple des calories (à ajuster selon vos besoins)
    const calculatedCalories = Math.round(weight * reps * sets * 0.1);
    setCalories(calculatedCalories);
    
    debugLogger.log("ExerciseDetail", 
      `Exercice: ${exerciseName}, Calories: ${calculatedCalories}, Poids: ${weight}, Répétitions: ${reps}, Séries: ${sets}`
    );
  }, [weight, reps, sets, exerciseName]);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete(exerciseName, sets);
    toast({
      title: t("workouts.exerciseCompleted") || "Exercice terminé",
      description: t("workouts.wellDone") || "Bien joué !",
    });
    
    debugLogger.log("ExerciseDetail", `Exercice ${exerciseName} terminé avec ${sets} séries`);
  };

  // Fonction de gestion pour le Checkbox avec type correct
  const handleCheckboxChange = (checked: boolean) => {
    setIsCompleted(checked);
    debugLogger.log("ExerciseDetail", `État d'achèvement changé à: ${checked}`);
  };

  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{exerciseName}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sets">{t("workouts.sets") || "Séries"}</Label>
            <Input
              id="sets"
              type="number"
              min="1"
              max="10"
              value={sets.toString()}
              onChange={(e) => setSets(parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="weight">{t("workouts.weight") || "Poids (kg)"}</Label>
            <Input
              id="weight"
              type="number"
              min="0"
              max="300"
              value={weight.toString()}
              onChange={(e) => setWeight(parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="reps">{t("workouts.repetitions") || "Répétitions"}</Label>
            <Input
              id="reps"
              type="number"
              min="1"
              max="50"
              value={reps.toString()}
              onChange={(e) => setReps(parseInt(e.target.value))}
            />
          </div>
        </div>

        <WorkoutDifficulty difficulty={difficulty} setDifficulty={setDifficulty} />
        <ExerciseNotes notes={notes} setNotes={setNotes} />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="completed"
            checked={isCompleted}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="completed">{t("workouts.completed") || "Terminé"}</Label>
        </div>
        <Separator />
        <div>
          <p>Calories estimées: {calories} kcal</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          {t("common.back") || "Retour"}
        </Button>
        <Button onClick={handleComplete} disabled={!isCompleted}>
          {t("workouts.completeExercise") || "Terminer l'exercice"}
        </Button>
      </CardFooter>
    </Card>
  );
};
