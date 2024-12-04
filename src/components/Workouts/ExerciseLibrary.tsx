import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Plus, ChevronRight, Dumbbell, CheckSquare } from "lucide-react";
import { exercises } from "./exerciseLibrary";
import { muscleGroups } from "./workoutConstants";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddExerciseForm } from "./AddExerciseForm";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { FloatingWorkoutButton } from "./FloatingWorkoutButton";
import { ExerciseSelection } from "./ExerciseSelection";

export const ExerciseLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("");
  const [selectedMuscleExercises, setSelectedMuscleExercises] = useState(exercises);
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredMuscleGroups = muscleGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExerciseAdd = () => {
    toast({
      title: "Exercice ajouté",
      description: "L'exercice a été ajouté avec succès à la bibliothèque",
    });
  };

  const handleMuscleGroupClick = (muscleId: string) => {
    if (muscleId === selectedMuscleGroup) {
      const filteredExercises = exercises.filter(ex => {
        if (muscleId === "fullBody") return true;
        return ex.muscleGroup === muscleId;
      });
      setSelectedMuscleExercises(filteredExercises);
      setShowExerciseSelection(true);
    } else {
      setSelectedMuscleGroup(muscleId);
    }
  };

  const handleExerciseSelectionChange = (selectedIds: string[]) => {
    setSelectedExercises(selectedIds);
    toast({
      title: "Exercices sélectionnés",
      description: `${selectedIds.length} exercices ajoutés à votre séance`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un groupe musculaire"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvel exercice
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel exercice</DialogTitle>
            </DialogHeader>
            <AddExerciseForm onSuccess={handleExerciseAdd} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMuscleGroups.map((muscle) => (
          <Card
            key={muscle.id}
            onClick={() => handleMuscleGroupClick(muscle.id)}
            className="p-4 cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{muscle.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {muscle.selectedExercises}/{muscle.totalExercises} exercices
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            {muscle.selectedExercises > 0 && (
              <Badge 
                className="absolute top-2 right-2 bg-primary"
                variant="secondary"
              >
                <CheckSquare className="h-3 w-3 mr-1" />
                {muscle.selectedExercises}
              </Badge>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={showExerciseSelection} onOpenChange={setShowExerciseSelection}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Sélectionner des exercices</DialogTitle>
          </DialogHeader>
          <ExerciseSelection
            exercises={selectedMuscleExercises}
            selectedExercises={selectedExercises}
            onSelectionChange={handleExerciseSelectionChange}
            onClose={() => setShowExerciseSelection(false)}
          />
        </DialogContent>
      </Dialog>

      <FloatingWorkoutButton 
        selectedCount={selectedExercises.length}
        onClick={() => navigate('/workouts/exercise/next-workout')}
      />
    </div>
  );
};