import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Layout/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { ExerciseSelection } from "./ExerciseSelection";
import { useState } from "react";

export const WorkoutCustomization = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workoutType, duration, equipment } = location.state || {};
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const handleExerciseSelection = (exercises: string[]) => {
    setSelectedExercises(exercises);
  };

  const handleNext = () => {
    navigate("/workouts/summary", {
      state: {
        workoutType,
        duration,
        equipment,
        exercises: selectedExercises,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Personnalisation de la séance</h1>
          <p className="text-muted-foreground">
            Sélectionnez et personnalisez vos exercices
          </p>
        </div>

        <Card className="p-6">
          <ExerciseSelection
            selectedExercises={selectedExercises}
            onSelectionChange={handleExerciseSelection}
            onClose={() => {}}
          />
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Retour
          </Button>
          <Button onClick={handleNext} disabled={selectedExercises.length === 0}>
            Continuer
          </Button>
        </div>
      </div>
    </div>
  );
};