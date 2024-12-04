import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Exercise } from "./exerciseLibrary";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface ExerciseSelectionProps {
  exercises: Exercise[];
  selectedExercises: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onClose: () => void;
}

export const ExerciseSelection = ({ 
  exercises, 
  selectedExercises,
  onSelectionChange,
  onClose 
}: ExerciseSelectionProps) => {
  const [workoutName, setWorkoutName] = useState("");
  const { toast } = useToast();

  const handleExerciseToggle = (exerciseId: string) => {
    const newSelection = selectedExercises.includes(exerciseId)
      ? selectedExercises.filter(id => id !== exerciseId)
      : [...selectedExercises, exerciseId];
    
    onSelectionChange(newSelection);
  };

  const handleSaveWorkout = () => {
    if (!workoutName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez donner un nom à votre programme",
        variant: "destructive",
      });
      return;
    }

    if (selectedExercises.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un exercice",
        variant: "destructive",
      });
      return;
    }

    const userPreferences = JSON.parse(localStorage.getItem("userPreferences") || "{}");
    const workoutDuration = userPreferences.workoutDuration || "45";

    const workout = {
      id: Date.now().toString(),
      name: workoutName,
      exercises: selectedExercises,
      duration: parseInt(workoutDuration),
      createdAt: new Date().toISOString(),
    };

    const savedWorkouts = JSON.parse(localStorage.getItem("savedWorkouts") || "[]");
    localStorage.setItem("savedWorkouts", JSON.stringify([...savedWorkouts, workout]));

    toast({
      title: "Programme sauvegardé",
      description: "Votre programme d'entraînement a été sauvegardé avec succès",
    });

    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Input
          placeholder="Nom du programme"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          className="w-full"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {exercises.map((exercise) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={exercise.id}
                      checked={selectedExercises.includes(exercise.id)}
                      onCheckedChange={() => handleExerciseToggle(exercise.id)}
                    />
                    <label
                      htmlFor={exercise.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {exercise.name}
                    </label>
                  </div>
                </CardHeader>
                <CardContent>
                  {exercise.image && (
                    <div className="relative aspect-video mb-2 rounded-md overflow-hidden">
                      <img
                        src={exercise.image}
                        alt={exercise.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">{exercise.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={handleSaveWorkout}>
          Sauvegarder le programme
        </Button>
      </div>
    </div>
  );
};