import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Set {
  id: number;
  reps: number;
  weight: number;
  completed: boolean;
}

interface ExerciseSetsProps {
  exerciseName: string;
  initialSets?: Set[];
}

export const ExerciseSets = ({ exerciseName, initialSets }: ExerciseSetsProps) => {
  const [sets, setSets] = useState<Set[]>(initialSets || [
    { id: 1, reps: 14, weight: 8, completed: false },
    { id: 2, reps: 14, weight: 8, completed: false },
    { id: 3, reps: 14, weight: 8, completed: false },
  ]);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (restTimer !== null && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev === null || prev <= 1) {
            toast({
              title: "Repos terminé !",
              description: "C'est reparti ! Commencez la série suivante.",
            });
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restTimer, toast]);

  const handleSetCompletion = (setId: number) => {
    setSets(prev => prev.map(set => 
      set.id === setId ? { ...set, completed: true } : set
    ));
    setRestTimer(90); // Démarre un timer de repos de 90 secondes
    toast({
      title: "Série complétée !",
      description: "90 secondes de repos avant la prochaine série.",
    });
  };

  const addNewSet = () => {
    const newSet = {
      id: sets.length + 1,
      reps: sets[0].reps,
      weight: sets[0].weight,
      completed: false,
    };
    setSets([...sets, newSet]);
    toast({
      title: "Nouvelle série ajoutée",
      description: `Série ${newSet.id} ajoutée avec succès.`,
    });
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">{exerciseName}</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm font-medium text-center mb-2">
          <div>SÉRIE</div>
          <div>RÉPÉTITIONS PAR BRAS</div>
          <div>KG PAR HALTÈRE</div>
        </div>
        
        {sets.map((set) => (
          <Card key={set.id} className="p-4">
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-center font-bold">{set.id}</div>
              <div className="text-center">{set.reps}</div>
              <div className="text-center">{set.weight}</div>
            </div>
            <Button
              className="w-full mt-2"
              variant={set.completed ? "secondary" : "default"}
              onClick={() => handleSetCompletion(set.id)}
              disabled={set.completed || (restTimer !== null)}
            >
              {set.completed ? "Série complétée" : "Valider la série"}
              {restTimer !== null && !set.completed && (
                <Timer className="ml-2 h-4 w-4 animate-pulse" />
              )}
            </Button>
          </Card>
        ))}

        <Button
          variant="outline"
          className="w-full gap-2 text-[#9BB537]"
          onClick={addNewSet}
        >
          <Plus className="h-4 w-4" />
          Ajouter une série
        </Button>
      </div>

      {restTimer !== null && (
        <div className="fixed bottom-20 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full animate-pulse">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span>{restTimer}s</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="font-medium">Notes</h3>
        <textarea
          className="w-full h-24 p-2 rounded-lg bg-card border resize-none"
          placeholder="Aucune note ajoutée..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button className="w-full bg-[#9BB537] hover:bg-[#9BB537]/90">
        COMMENCER
      </Button>
    </div>
  );
};