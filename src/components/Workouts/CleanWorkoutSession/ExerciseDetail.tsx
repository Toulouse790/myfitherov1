
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronUp, ChevronDown, Timer, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExerciseDetailProps {
  exerciseName: string;
  onComplete: (exerciseName: string, totalSets: number) => void;
  onBack: () => void;
  initialSets: number;
}

export const ExerciseDetail = ({ exerciseName, onComplete, onBack, initialSets }: ExerciseDetailProps) => {
  const { toast } = useToast();
  const [sets, setSets] = useState(Array(initialSets).fill(0).map((_, i) => ({
    id: i + 1,
    reps: 12,
    weight: 20,
    completed: false
  })));
  const [currentSet, setCurrentSet] = useState(1);
  const [restTimer, setRestTimer] = useState<number | null>(null);

  // Gestion du temps de repos
  useState(() => {
    if (restTimer === null) return;
    
    const interval = setInterval(() => {
      setRestTimer(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  });

  const handleSetComplete = () => {
    // Marquer la série comme complétée
    const updatedSets = sets.map(set => 
      set.id === currentSet ? { ...set, completed: true } : set
    );
    setSets(updatedSets);
    
    // Vérifier si c'est la dernière série
    if (currentSet < sets.length) {
      setCurrentSet(prev => prev + 1);
      setRestTimer(90); // 90 secondes de repos
      
      toast({
        title: "Série complétée",
        description: "90 secondes de repos avant la prochaine série",
      });
    } else {
      // Toutes les séries sont terminées
      toast({
        title: "Exercice terminé",
        description: "Toutes les séries ont été complétées",
      });
      
      // Notifier le parent que l'exercice est terminé
      onComplete(exerciseName, sets.length);
    }
  };

  const handleRepsChange = (setId: number, value: number) => {
    setSets(sets.map(set => 
      set.id === setId ? { ...set, reps: Math.max(1, value) } : set
    ));
  };

  const handleWeightChange = (setId: number, value: number) => {
    setSets(sets.map(set => 
      set.id === setId ? { ...set, weight: Math.max(0, value) } : set
    ));
  };

  const handleSkipRest = () => {
    setRestTimer(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-semibold ml-2">{exerciseName}</h2>
      </div>
      
      {sets.map((set) => (
        <Card key={set.id} className={`p-4 ${
          set.id === currentSet ? 'border-primary' : ''
        } ${
          set.completed ? 'bg-gray-50' : ''
        }`}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Série {set.id}</h3>
              {set.completed && <Check className="text-green-500 h-5 w-5" />}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-500">Poids (kg)</label>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleWeightChange(set.id, set.weight - 2.5)}
                    disabled={set.completed || set.id !== currentSet}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Input 
                    type="number" 
                    value={set.weight} 
                    onChange={(e) => handleWeightChange(set.id, parseFloat(e.target.value))}
                    className="mx-2 text-center"
                    disabled={set.completed || set.id !== currentSet}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleWeightChange(set.id, set.weight + 2.5)}
                    disabled={set.completed || set.id !== currentSet}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-500">Répétitions</label>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleRepsChange(set.id, set.reps - 1)}
                    disabled={set.completed || set.id !== currentSet}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Input 
                    type="number" 
                    value={set.reps} 
                    onChange={(e) => handleRepsChange(set.id, parseInt(e.target.value))}
                    className="mx-2 text-center"
                    disabled={set.completed || set.id !== currentSet}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleRepsChange(set.id, set.reps + 1)}
                    disabled={set.completed || set.id !== currentSet}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
      
      {restTimer ? (
        <div className="fixed bottom-20 right-0 left-0 mx-auto w-max">
          <Card className="p-4 bg-primary text-primary-foreground">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center">
                <Timer className="mr-2 h-5 w-5" />
                <span className="text-xl font-semibold">{restTimer}s</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSkipRest}>
                Passer
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <Button 
          className="w-full" 
          size="lg"
          onClick={handleSetComplete}
          disabled={currentSet > sets.length || sets[currentSet - 1]?.completed}
        >
          {sets.every(set => set.completed) 
            ? "Exercice terminé" 
            : `Valider la série ${currentSet}`
          }
        </Button>
      )}
    </div>
  );
};
