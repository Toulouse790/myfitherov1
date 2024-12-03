import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WorkoutList } from "@/components/Workouts/WorkoutList";
import { useToast } from "@/components/ui/use-toast";
import { exercises } from "@/components/Workouts/exerciseLibrary";
import { muscleGroups } from "@/components/Workouts/workoutConstants";
import { SportPrograms } from "@/components/Workouts/SportPrograms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutExerciseDetail } from "@/components/Workouts/WorkoutExerciseDetail";

const Workouts = () => {
  const { toast } = useToast();
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [showExerciseDetail, setShowExerciseDetail] = useState(false);

  const generateWorkout = (muscleGroup: string) => {
    const muscleExercises = exercises.filter(ex => ex.muscleGroup === muscleGroup);
    const numExercises = Math.floor(Math.random() * 3) + 4;
    const selectedExercises = muscleExercises
      .sort(() => Math.random() - 0.5)
      .slice(0, numExercises)
      .map(exercise => ({
        ...exercise,
        sets: 3,
        reps: 12,
        calories: 0
      }));

    const workout = {
      id: Date.now().toString(),
      title: `Séance ${muscleGroup}`,
      exercises: selectedExercises,
      totalCalories: 0,
    };

    setSelectedWorkout(workout);
    toast({
      title: "Séance générée",
      description: "Une nouvelle séance a été générée pour vous.",
    });
  };

  if (showExerciseDetail) {
    return <WorkoutExerciseDetail onBack={() => setShowExerciseDetail(false)} />;
  }

  return (
    <div className="container mx-auto px-4 pt-20 pb-12 space-y-6">
      <Tabs defaultValue="custom" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="custom" className="flex-1 text-sm sm:text-base">
            Séances personnalisées
          </TabsTrigger>
          <TabsTrigger value="programs" className="flex-1 text-sm sm:text-base">
            Programmes sportifs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="custom" className="space-y-6 animate-fade-in">
          <h1 className="text-xl sm:text-2xl font-bold">Séances personnalisées</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {muscleGroups.map((group) => (
              <Button
                key={group.id}
                variant="outline"
                className="h-auto py-3 flex flex-col gap-2 hover:scale-[1.02] transition-transform duration-300"
                onClick={() => generateWorkout(group.id)}
              >
                <span className="text-xs sm:text-sm font-medium">{group.name}</span>
              </Button>
            ))}
          </div>

          {selectedWorkout && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg sm:text-xl font-semibold">{selectedWorkout.title}</h2>
              <div className="grid gap-3">
                {selectedWorkout.exercises.map((exercise: any, index: number) => (
                  <div key={index} className="p-3 rounded-lg border hover:border-primary/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h3 className="font-medium text-sm sm:text-base">{exercise.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              const newWorkout = {...selectedWorkout};
                              newWorkout.exercises[index].sets = Math.max(1, exercise.sets - 1);
                              setSelectedWorkout(newWorkout);
                            }}
                          >
                            -
                          </Button>
                          <span className="text-sm w-20 text-center">{exercise.sets} séries</span>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
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
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              const newWorkout = {...selectedWorkout};
                              newWorkout.exercises[index].reps = Math.max(1, exercise.reps - 1);
                              setSelectedWorkout(newWorkout);
                            }}
                          >
                            -
                          </Button>
                          <span className="text-sm w-24 text-center">{exercise.reps} répétitions</span>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              const newWorkout = {...selectedWorkout};
                              newWorkout.exercises[index].reps = exercise.reps + 1;
                              setSelectedWorkout(newWorkout);
                            }}
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => setShowExerciseDetail(true)}
                        >
                          Commencer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full sm:w-auto"
                onClick={() => {
                  const newWorkout = {...selectedWorkout};
                  newWorkout.exercises = newWorkout.exercises.map(ex => ({
                    ...ex,
                    calories: Math.round(ex.sets * ex.reps * 0.5)
                  }));
                  newWorkout.totalCalories = newWorkout.exercises.reduce((acc, ex) => acc + ex.calories, 0);
                  
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
        </TabsContent>

        <TabsContent value="programs" className="space-y-6 animate-fade-in">
          <h1 className="text-xl sm:text-2xl font-bold">Programmes sportifs</h1>
          <SportPrograms />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Workouts;