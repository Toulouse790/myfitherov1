import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GenerateWorkoutDialog } from "@/components/Dashboard/WorkoutSuggestions/GenerateWorkoutDialog";

export default function WorkoutGenerate() {
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleWorkoutGenerated = async (workout: any) => {
    try {
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert([
          { 
            exercises: workout.exercises.map((ex: any) => ex.name),
            type: 'strength',
            status: 'in_progress'
          }
        ])
        .select()
        .single();

      if (error) throw error;

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">Génération d'entraînement</h1>
        
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Programme personnalisé</h2>
            <p className="text-muted-foreground">
              Générez un programme d'entraînement adapté à vos objectifs et à votre niveau.
            </p>
            <Button 
              onClick={() => setShowGenerateDialog(true)}
              className="w-full sm:w-auto"
            >
              Générer un programme
            </Button>
          </div>
        </Card>

        <GenerateWorkoutDialog
          open={showGenerateDialog}
          onOpenChange={setShowGenerateDialog}
          onWorkoutGenerated={handleWorkoutGenerated}
        />
      </div>
    </div>
  );
}