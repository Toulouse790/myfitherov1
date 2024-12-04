import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Layout/Header";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ExerciseLibrary } from "@/components/Workouts/ExerciseLibrary";
import { ExerciseSelection } from "@/components/Workouts/ExerciseSelection";
import { exercises } from "@/components/Workouts/exerciseLibrary";
import { useToast } from "@/hooks/use-toast";

export const Workouts = () => {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showSelection, setShowSelection] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExerciseSelection = (exerciseIds: string[]) => {
    setSelectedExercises(exerciseIds);
    setShowSelection(false);
    
    toast({
      title: "Groupe musculaire ajouté",
      description: "Veux-tu entraîner un autre groupe musculaire ?",
      action: (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSelection(false)}
          >
            Non
          </Button>
          <Button 
            size="sm"
            onClick={() => setShowSelection(true)}
          >
            Oui
          </Button>
        </div>
      ),
    });
  };

  const handleStartWorkout = () => {
    if (selectedExercises.length === 0) {
      toast({
        title: "Aucun exercice sélectionné",
        description: "Veuillez sélectionner au moins un exercice",
        variant: "destructive",
      });
      return;
    }
    
    navigate('/workouts/exercise/next-workout');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <AppSidebar />
        <div className="md:pl-64">
          <div className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-xl sm:text-2xl font-bold">Bibliothèque d'exercices</h1>
              {selectedExercises.length > 0 && (
                <Button onClick={handleStartWorkout} className="w-full sm:w-auto">
                  C'est parti ! ({selectedExercises.length})
                </Button>
              )}
            </div>

            {showSelection ? (
              <ExerciseSelection
                exercises={exercises}
                selectedExercises={selectedExercises}
                onSelectionChange={handleExerciseSelection}
                onClose={() => setShowSelection(false)}
              />
            ) : (
              <ExerciseLibrary />
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Workouts;