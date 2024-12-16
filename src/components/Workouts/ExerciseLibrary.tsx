import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MuscleGroupGrid } from "./components/MuscleGroupGrid";
import { ExerciseSelection } from "./ExerciseSelection";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

export const ExerciseLibrary = () => {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showSelection, setShowSelection] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("");
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExerciseSelection = async (exerciseIds: string[]) => {
    // Remplacer directement par les nouveaux exercices sélectionnés
    setSelectedExercises(exerciseIds);
  };

  const handleStartWorkout = async () => {
    if (selectedExercises.length === 0) {
      toast({
        title: "Aucun exercice sélectionné",
        description: "Veuillez sélectionner au moins un exercice",
        variant: "destructive",
      });
      return;
    }

    setShowSummary(true);
  };

  const handleConfirmWorkout = async () => {
    try {
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert([
          { 
            exercises: selectedExercises,
            type: 'strength',
            status: 'in_progress',
            target_duration_minutes: 45
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating workout:', error);
        throw error;
      }

      if (session) {
        navigate(`/workout/${session.id}`);
      }
    } catch (error) {
      console.error('Error creating workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la séance",
        variant: "destructive",
      });
    }
  };

  const handleMuscleGroupSelect = (muscleGroup: string) => {
    setSelectedMuscleGroup(muscleGroup);
    setShowSelection(true);
  };

  const handleCloseSelection = () => {
    setShowSelection(false);
    if (selectedExercises.length > 0) {
      toast({
        title: "Exercices ajoutés",
        description: "Voulez-vous entraîner un autre groupe musculaire ?",
        action: (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowSelection(false);
                handleStartWorkout();
              }}
            >
              Non, commencer
            </Button>
            <Button 
              size="sm"
              onClick={() => {
                setSelectedMuscleGroup("");
                setShowSelection(true);
              }}
            >
              Oui
            </Button>
          </div>
        ),
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {selectedExercises.length > 0 && (
          <div className="flex justify-end mb-6">
            <Button onClick={handleStartWorkout} className="w-full sm:w-auto">
              C'est parti ! ({selectedExercises.length} exercices)
            </Button>
          </div>
        )}

        {showSelection ? (
          <ExerciseSelection
            selectedExercises={selectedExercises}
            onSelectionChange={handleExerciseSelection}
            onClose={handleCloseSelection}
            muscleGroup={selectedMuscleGroup}
          />
        ) : (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-center">
              Sélectionnez les groupes musculaires à travailler
            </h1>
            <MuscleGroupGrid onSelect={handleMuscleGroupSelect} />
          </div>
        )}

        <Dialog open={showSummary} onOpenChange={setShowSummary}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Récapitulatif de la séance</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 my-4">
              {selectedExercises.map((exercise, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">{exercise}</h3>
                    <div className="text-sm text-muted-foreground">
                      3 séries • 12 répétitions
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSummary(false)}>
                Retour
              </Button>
              <Button onClick={handleConfirmWorkout}>
                Commencer la séance
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ExerciseLibrary;