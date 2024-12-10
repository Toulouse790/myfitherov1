import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Flame } from "lucide-react";

interface WorkoutSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: {
    duration: number;
    totalWeight: number;
    totalCalories: number;
  };
  onConfirm: (difficulty: string, duration: number, muscleGroups: string[]) => void;
}

export const WorkoutSummaryDialog = ({
  open,
  onOpenChange,
  stats,
  onConfirm,
}: WorkoutSummaryDialogProps) => {
  const [difficulty, setDifficulty] = useState("medium");
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);

  const muscleGroups = [
    { id: "chest", label: "Pectoraux" },
    { id: "back", label: "Dos" },
    { id: "legs", label: "Jambes" },
    { id: "shoulders", label: "Épaules" },
    { id: "arms", label: "Bras" },
    { id: "abs", label: "Abdominaux" },
  ];

  const handleConfirm = () => {
    onConfirm(difficulty, stats.duration, selectedMuscleGroups);
  };

  const toggleMuscleGroup = (groupId: string) => {
    setSelectedMuscleGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Résumé de la séance</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-secondary/10 rounded-lg">
              <div className="text-2xl font-bold">{stats.duration}</div>
              <div className="text-sm text-muted-foreground">minutes</div>
            </div>
            <div className="text-center p-4 bg-secondary/10 rounded-lg flex flex-col items-center">
              <div className="text-2xl font-bold flex items-center gap-2">
                {stats.totalCalories}
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div className="text-sm text-muted-foreground">calories</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Groupes musculaires travaillés</Label>
            <div className="grid grid-cols-2 gap-2">
              {muscleGroups.map((group) => (
                <Button
                  key={group.id}
                  variant={selectedMuscleGroups.includes(group.id) ? "default" : "outline"}
                  onClick={() => toggleMuscleGroup(group.id)}
                  className="w-full"
                >
                  {group.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Difficulté ressentie</Label>
            <RadioGroup
              value={difficulty}
              onValueChange={setDifficulty}
              className="flex justify-between"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="easy" id="easy" />
                <Label htmlFor="easy">Facile</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Moyen</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hard" id="hard" />
                <Label htmlFor="hard">Difficile</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button onClick={handleConfirm} className="w-full">
          Terminer la séance
        </Button>
      </DialogContent>
    </Dialog>
  );
};