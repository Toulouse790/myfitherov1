import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WorkoutList } from "@/components/Workouts/WorkoutList";
import { useToast } from "@/components/ui/use-toast";
import { exercises } from "@/components/Workouts/exerciseLibrary";
import { muscleGroups } from "@/components/Workouts/workoutConstants";

const Workouts = () => {
  const { toast } = useToast();
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  const generateWorkout = (muscleGroup: string) => {
    // Filtrer les exercices par groupe musculaire
    const muscleExercises = exercises.filter(ex => ex.muscleGroup === muscleGroup);
    
    // Sélectionner aléatoirement 4-6 exercices
    const numExercises = Math.floor(Math.random() * 3) + 4; // 4-6 exercices
    const selectedExercises = muscleExercises
      .sort(() => Math.random() - 0.5)
      .slice(0, numExercises)
      .map(exercise => ({
        ...exercise,
        sets: 3,
        reps: 12,
        calories: 0 // Sera calculé plus tard
      }));

    const workout = {
      id: Date.now().toString(),
      title: `Séance ${muscleGroup}`,
      exercises: selectedExercises,
      totalCalories: 0, // Sera calculé plus tard
    };

    setSelectedWorkout(workout);
    toast({
      title: "Séance générée",
      description: "Une nouvelle séance a été générée pour vous.",
    });
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 space-y-8">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Séances proposées</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {muscleGroups.map((group) => (
            <Button
              key={group.id}
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => generateWorkout(group.id)}
            >
              <span className="text-sm font-medium">{group.name}</span>
            </Button>
          ))}
        </div>

        {selectedWorkout && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold">{selectedWorkout.title}</h2>
            <div className="grid gap-4">
              {selectedWorkout.exercises.map((exercise: any, index: number) => (
                <div key={index} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{exercise.name}</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const newWorkout = {...selectedWorkout};
                            newWorkout.exercises[index].sets = Math.max(1, exercise.sets - 1);
                            setSelectedWorkout(newWorkout);
                          }}
                        >
                          -
                        </Button>
                        <span>{exercise.sets} séries</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const newWorkout = {...selectedWorkout};
                            newWorkout.exercises[index].sets = exercise.sets + 1;
                            setSelectedWorkout(newWorkout);
                          }}
                        >
                          +
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const newWorkout = {...selectedWorkout};
                            newWorkout.exercises[index].reps = Math.max(1, exercise.reps - 1);
                            setSelectedWorkout(newWorkout);
                          }}
                        >
                          -
                        </Button>
                        <span>{exercise.reps} répétitions</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const newWorkout = {...selectedWorkout};
                            newWorkout.exercises[index].reps = exercise.reps + 1;
                            setSelectedWorkout(newWorkout);
                          }}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              className="w-full"
              onClick={() => {
                // Calculer les calories approximatives (exemple simple)
                const newWorkout = {...selectedWorkout};
                newWorkout.exercises = newWorkout.exercises.map(ex => ({
                  ...ex,
                  calories: Math.round(ex.sets * ex.reps * 0.5) // Estimation très basique
                }));
                newWorkout.totalCalories = newWorkout.exercises.reduce((acc, ex) => acc + ex.calories, 0);
                
                // Sauvegarder dans le localStorage
                const savedWorkouts = JSON.parse(localStorage.getItem("savedWorkouts") || "[]");
                localStorage.setItem("savedWorkouts", JSON.stringify([...savedWorkouts, newWorkout]));
                
                toast({
                  title: "Séance sauvegardée",
                  description: `Dépense calorique estimée : ${newWorkout.totalCalories} kcal`,
                });
              }}
            >
              Sauvegarder la séance
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;