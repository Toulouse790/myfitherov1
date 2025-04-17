
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Dumbbell, Timer, Minus, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/use-auth";
import { useExerciseWeights } from "@/hooks/use-exercise-weights";
import { useExerciseReps } from "@/hooks/use-exercise-reps";
import { debugLogger } from "@/utils/debug-logger";

interface ExerciseDetailProps {
  exerciseName: string;
  onComplete: (exerciseName: string, sets: number) => void;
  onBack: () => void;
  initialSets?: number;
}

export const ExerciseDetail = ({ 
  exerciseName, 
  onComplete, 
  onBack,
  initialSets = 3
}: ExerciseDetailProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [sets, setSets] = useState(initialSets);
  const [currentSet, setCurrentSet] = useState(1);
  const [restTime, setRestTime] = useState(90); // Temps de repos en secondes
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [setsCompleted, setSetsCompleted] = useState(0);
  
  // Utilisation du hook pour les poids
  const { exerciseWeight, updateWeight } = useExerciseWeights(exerciseName);
  const [weight, setWeight] = useState(20); // Valeur par défaut
  
  // Utilisation du hook pour les répétitions
  const { reps, updateReps } = useExerciseReps(exerciseName);
  
  // Récupérer le poids de l'exercice depuis le cache ou la base de données
  useEffect(() => {
    if (exerciseWeight) {
      debugLogger.log("ExerciseDetail", "Poids récupéré:", exerciseWeight.weight);
      setWeight(exerciseWeight.weight);
    }
  }, [exerciseWeight]);
  
  // Timer pour le temps de repos
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isResting && restTimeLeft > 0) {
      timer = setInterval(() => {
        setRestTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isResting && restTimeLeft === 0) {
      setIsResting(false);
    }
    
    return () => clearInterval(timer);
  }, [isResting, restTimeLeft]);
  
  // Formater le temps de repos (mm:ss)
  const formatRestTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Gérer le changement de poids
  const handleWeightChange = (amount: number) => {
    const newWeight = Math.max(0, weight + amount);
    setWeight(newWeight);
    // Ne pas mettre à jour immédiatement dans la BDD pour éviter trop de requêtes
  };
  
  // Gérer le changement de répétitions
  const handleRepsChange = (amount: number) => {
    const newReps = Math.max(1, reps + amount);
    updateReps(newReps);
  };
  
  // Gérer le changement de temps de repos
  const handleRestTimeChange = (amount: number) => {
    const newRestTime = Math.max(0, restTime + amount);
    setRestTime(newRestTime);
  };
  
  // Valider une série
  const handleSetComplete = () => {
    // Mettre à jour le poids dans la base de données
    updateWeight(weight);
    
    setSetsCompleted(prev => prev + 1);
    
    if (currentSet < sets) {
      // Passer à la série suivante
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setRestTimeLeft(restTime);
    } else {
      // Toutes les séries sont complétées
      onComplete(exerciseName, sets);
    }
  };
  
  // Sauter le temps de repos
  const handleSkipRest = () => {
    setIsResting(false);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl">{exerciseName}</CardTitle>
        </div>
        <div className="flex justify-between items-center mt-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Dumbbell className="h-3 w-3" />
            <span>{t("workouts.set") || "Série"} {currentSet}/{sets}</span>
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1">
            <Timer className="h-3 w-3" />
            <span>{setsCompleted} {t("workouts.completedSets") || "séries complétées"}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {isResting ? (
          <div className="space-y-4 text-center py-6">
            <h3 className="text-xl font-bold">{t("workouts.restTime") || "Temps de repos"}</h3>
            <div className="font-mono text-4xl">{formatRestTime(restTimeLeft)}</div>
            <p className="text-muted-foreground">
              {t("workouts.restBeforeNextSet") || "Reposez-vous avant la prochaine série."}
            </p>
            <Button onClick={handleSkipRest}>
              {t("workouts.skipRest") || "Passer le repos"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Contrôle du poids */}
            <div className="space-y-2">
              <Label htmlFor="weight">{t("workouts.weight") || "Poids"} ({t("workouts.weightUnit") || "kg"})</Label>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleWeightChange(-2.5)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="mx-4 text-center min-w-[60px]">
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    className="text-center"
                    onChange={(e) => setWeight(Number(e.target.value))}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleWeightChange(2.5)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Contrôle des répétitions */}
            <div className="space-y-2">
              <Label htmlFor="reps">{t("workouts.reps") || "Répétitions"}</Label>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleRepsChange(-1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="mx-4 text-center min-w-[60px]">
                  <Input
                    id="reps"
                    type="number"
                    value={reps}
                    className="text-center"
                    onChange={(e) => updateReps(Number(e.target.value))}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleRepsChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Contrôle du temps de repos */}
            <div className="space-y-2">
              <Label htmlFor="restTime">{t("workouts.restTime") || "Temps de repos"} (s)</Label>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleRestTimeChange(-15)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="mx-4 text-center min-w-[60px]">
                  <Input
                    id="restTime"
                    type="number"
                    value={restTime}
                    className="text-center"
                    onChange={(e) => setRestTime(Number(e.target.value))}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleRestTimeChange(15)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Contrôle du nombre de séries */}
            <div className="space-y-2">
              <Label htmlFor="sets">{t("workouts.numberOfSets") || "Nombre de séries"}</Label>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setSets(Math.max(1, sets - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="mx-4 text-center min-w-[60px]">
                  <Input
                    id="sets"
                    type="number"
                    value={sets}
                    className="text-center"
                    onChange={(e) => setSets(Number(e.target.value))}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setSets(sets + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <Separator />
      
      <CardFooter className="pt-4">
        {!isResting && (
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSetComplete}
          >
            {currentSet < sets ? 
              (t("workouts.validateSet") || "Valider la série") : 
              (t("workouts.completeExercise") || "Terminer l'exercice")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
