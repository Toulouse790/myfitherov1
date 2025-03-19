
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Minus, Timer, Info, BarChart3, ChevronDown, ChevronUp, Check } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Set {
  id: number;
  reps: number;
  weight: number;
  completed: boolean;
}

interface ExerciseSetManagerProps {
  exerciseName: string;
  onComplete?: () => void;
  initialSets?: Set[];
  timer?: number;
}

export const ExerciseSetManager = ({
  exerciseName,
  onComplete,
  initialSets = [
    { id: 1, reps: 10, weight: 2.5, completed: false },
    { id: 2, reps: 6, weight: 6, completed: false },
    { id: 3, reps: 2, weight: 8, completed: false },
  ],
  timer = 75,
}: ExerciseSetManagerProps) => {
  const [sets, setSets] = useState<Set[]>(initialSets);
  const [warmupSets, setWarmupSets] = useState<Set[]>([
    { id: 1, reps: 12, weight: 1.5, completed: false },
    { id: 2, reps: 10, weight: 2, completed: false },
  ]);
  const [isWarmupVisible, setIsWarmupVisible] = useState(true);
  
  // Formater le timer en minutes:secondes
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSetComplete = (setId: number, isWarmup: boolean = false) => {
    if (isWarmup) {
      setWarmupSets(warmupSets.map(set => 
        set.id === setId ? { ...set, completed: true } : set
      ));
    } else {
      setSets(sets.map(set => 
        set.id === setId ? { ...set, completed: true } : set
      ));
    }
  };

  const handleUpdateReps = (setId: number, value: number, isWarmup: boolean = false) => {
    if (isWarmup) {
      setWarmupSets(warmupSets.map(set => 
        set.id === setId ? { ...set, reps: value } : set
      ));
    } else {
      setSets(sets.map(set => 
        set.id === setId ? { ...set, reps: value } : set
      ));
    }
  };

  const handleUpdateWeight = (setId: number, value: number, isWarmup: boolean = false) => {
    if (isWarmup) {
      setWarmupSets(warmupSets.map(set => 
        set.id === setId ? { ...set, weight: value } : set
      ));
    } else {
      setSets(sets.map(set => 
        set.id === setId ? { ...set, weight: value } : set
      ));
    }
  };

  const addSet = (isWarmup: boolean = false) => {
    if (isWarmup) {
      const newId = warmupSets.length > 0 ? Math.max(...warmupSets.map(s => s.id)) + 1 : 1;
      setWarmupSets([...warmupSets, { id: newId, reps: 12, weight: 1.5, completed: false }]);
    } else {
      const newId = sets.length > 0 ? Math.max(...sets.map(s => s.id)) + 1 : 1;
      setSets([...sets, { id: newId, reps: sets[sets.length - 1]?.reps || 10, weight: sets[sets.length - 1]?.weight || 2.5, completed: false }]);
    }
  };

  const removeSet = (setId: number, isWarmup: boolean = false) => {
    if (isWarmup) {
      if (warmupSets.length > 1) {
        setWarmupSets(warmupSets.filter(set => set.id !== setId));
      }
    } else {
      if (sets.length > 1) {
        setSets(sets.filter(set => set.id !== setId));
      }
    }
  };

  const allSetsCompleted = sets.every(set => set.completed);

  return (
    <Card className="bg-background border-border w-full max-w-3xl mx-auto">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{exerciseName}</h2>
          <div className="flex gap-3">
            <Button variant="outline" size="icon">
              <Timer className="h-5 w-5" />
              <span className="sr-only">Timer</span>
            </Button>
            <Button variant="outline" size="icon">
              <Info className="h-5 w-5" />
              <span className="sr-only">Instructions</span>
            </Button>
            <Button variant="outline" size="icon">
              <BarChart3 className="h-5 w-5" />
              <span className="sr-only">Analyses</span>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Collapsible open={isWarmupVisible} onOpenChange={setIsWarmupVisible}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Séries de préchauffe</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost">
                  {isWarmupVisible ? (
                    <>
                      Masquer
                      <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Afficher
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent>
              <div className="bg-muted/40 rounded-lg p-4 mt-2 space-y-4">
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 font-medium text-sm text-muted-foreground">
                  <div>SET</div>
                  <div>RÉPÉTITIONS PAR BRAS</div>
                  <div>KG PAR HALTÈRE</div>
                  <div></div>
                </div>
                
                {warmupSets.map(set => (
                  <div key={set.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center">
                    <div className="font-medium">{set.id}</div>
                    <Input
                      type="number"
                      value={set.reps}
                      onChange={(e) => handleUpdateReps(set.id, parseInt(e.target.value), true)}
                      className="w-full"
                      disabled={set.completed}
                    />
                    <Input
                      type="number"
                      value={set.weight}
                      onChange={(e) => handleUpdateWeight(set.id, parseFloat(e.target.value), true)}
                      className="w-full"
                      step="0.5"
                      disabled={set.completed}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeSet(set.id, true)}
                        disabled={set.completed || warmupSets.length <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      {!set.completed ? (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleSetComplete(set.id, true)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => addSet(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une série
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="bg-background rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 font-medium text-sm text-muted-foreground">
              <div>SET</div>
              <div>RÉPÉTITIONS PAR BRAS</div>
              <div>KG PAR HALTÈRE</div>
              <div></div>
            </div>
            
            {sets.map(set => (
              <div key={set.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center">
                <div className="font-medium">{set.id}</div>
                <Input
                  type="number"
                  value={set.reps}
                  onChange={(e) => handleUpdateReps(set.id, parseInt(e.target.value))}
                  className="w-full"
                  disabled={set.completed}
                />
                <Input
                  type="number"
                  value={set.weight}
                  onChange={(e) => handleUpdateWeight(set.id, parseFloat(e.target.value))}
                  className="w-full"
                  step="0.5"
                  disabled={set.completed}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeSet(set.id)}
                    disabled={set.completed || sets.length <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  {!set.completed ? (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleSetComplete(set.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => addSet()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une série
            </Button>
          </div>
        </div>

        {allSetsCompleted && (
          <div className="pt-4">
            <Button 
              className="w-full" 
              onClick={onComplete}
            >
              Exercice terminé
              <Check className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
