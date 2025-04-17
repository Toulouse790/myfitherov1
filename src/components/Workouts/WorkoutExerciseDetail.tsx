
import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Timer } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { debugLogger } from "@/utils/debug-logger";

interface Set {
  id: number;
  reps: number;
  weight: number;
  completed?: boolean;
}

export const WorkoutExerciseDetail = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const defaultState = {
    exerciseName: "Rowing avec Haltères",
    sets: [
      { id: 1, reps: 12, weight: 10, completed: false },
      { id: 2, reps: 12, weight: 10, completed: false },
      { id: 3, reps: 12, weight: 10, completed: false },
    ],
    videoUrl: null
  };

  const { exerciseName, sets: initialSets, videoUrl } = location.state || defaultState;

  const [sets, setSets] = useState<Set[]>(initialSets || defaultState.sets);
  const [notes, setNotes] = useState("");
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [totalCalories, setTotalCalories] = useState(0);

  const handleAddSet = () => {
    const newSet = {
      id: sets.length + 1,
      reps: sets[0].reps,
      weight: sets[0].weight,
      completed: false
    };
    setSets([...sets, newSet]);
  };

  const startRestTimer = () => {
    setRestTimer(90);
    const interval = setInterval(() => {
      setRestTimer((current) => {
        if (current === null || current <= 1) {
          clearInterval(interval);
          toast({
            title: "Repos terminé !",
            description: "C'est reparti ! Commencez la série suivante.",
          });
          return null;
        }
        return current - 1;
      });
    }, 1000);
  };

  // Calcul plus précis des calories en fonction du poids et des répétitions
  const calculateCalories = (reps: number, weight: number) => {
    // Formule améliorée: 0.05 * poids (kg) * reps * intensité (1.2)
    // Cette formule est une approximation plus réaliste
    const intensity = 1.2; // Intensité modérée
    const calories = Math.round(0.05 * weight * reps * intensity);
    
    debugLogger.log("WorkoutExerciseDetail", "Calcul des calories:", {
      reps, 
      weight, 
      intensity,
      calculatedCalories: calories
    });
    
    return calories;
  };

  const handleSetComplete = (setId: number) => {
    const completedSet = sets.find(set => set.id === setId);
    
    if (!completedSet) return;
    
    // Calculer les calories pour cette série
    const setCalories = calculateCalories(completedSet.reps, completedSet.weight);
    
    // Mettre à jour le total des calories
    setTotalCalories(prev => prev + setCalories);
    
    setSets(sets.map(set => 
      set.id === setId ? { ...set, completed: true } : set
    ));
    
    startRestTimer();
    
    toast({
      title: "Série complétée !",
      description: `${setCalories} calories brûlées. 90 secondes de repos.`,
    });
    
    // Enregistrer ces données pour la session
    debugLogger.log("WorkoutExerciseDetail", "Série complétée:", {
      exerciseName,
      setId,
      weight: completedSet.weight,
      reps: completedSet.reps,
      calories: setCalories,
      totalCaloriesSoFar: totalCalories + setCalories
    });
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <Button
          variant="ghost"
          className="flex items-center gap-2 text-primary hover:text-primary/80"
          onClick={handleAddSet}
        >
          <Plus className="w-4 h-4" />
          Ajouter une série
        </Button>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900">{exerciseName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {videoUrl && (
            <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
              <img 
                src={videoUrl} 
                alt={exerciseName}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Séries</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-sm text-gray-500">SÉRIE</div>
              <div className="text-sm text-gray-500">RÉPÉTITIONS</div>
              <div className="text-sm text-gray-500">KG</div>
            </div>

            {sets.map((set) => (
              <div key={set.id} className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-900">{set.id}</div>
                <div className="text-gray-900">{set.reps}</div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">{set.weight}</span>
                  {!set.completed && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetComplete(set.id)}
                      disabled={restTimer !== null}
                    >
                      Valider
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {restTimer !== null && (
              <div className="fixed bottom-20 right-4 bg-primary text-primary-foreground px-6 py-3 rounded-full animate-pulse">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  <span className="font-medium">Repos: {restTimer}s</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-900 font-medium">Notes</h3>
            <Textarea
              placeholder="Aucune note ajoutée..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-white border text-gray-900 placeholder:text-gray-500"
            />
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900">Résumé</h3>
            <p className="text-sm text-gray-600">
              Sets complétés: {sets.filter(s => s.completed).length}/{sets.length}
            </p>
            <p className="text-sm text-gray-600">
              Calories totales brûlées: {totalCalories}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
