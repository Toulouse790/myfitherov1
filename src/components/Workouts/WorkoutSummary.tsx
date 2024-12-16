import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Layout/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const WorkoutSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workoutType, duration, equipment, exercises } = location.state || {};
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour sauvegarder une séance",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: session, error } = await supabase
        .from("workout_sessions")
        .insert([
          {
            user_id: user.id,
            type: workoutType,
            exercises: exercises,
            target_duration_minutes: duration,
            equipment_used: [equipment],
            planned_start_time: selectedDate,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre séance a été enregistrée avec succès",
      });

      if (session) {
        navigate(`/workout/${session.id}`);
      }
    } catch (error) {
      console.error("Error saving workout:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la séance",
        variant: "destructive",
      });
    }
  };

  const handleStartNow = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour commencer une séance",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: session, error } = await supabase
        .from("workout_sessions")
        .insert([
          {
            user_id: user.id,
            type: workoutType,
            exercises: exercises,
            target_duration_minutes: duration,
            equipment_used: [equipment],
            status: "in_progress",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (session) {
        navigate(`/workout/${session.id}`);
      }
    } catch (error) {
      console.error("Error starting workout:", error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la séance",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Résumé de la séance</h1>
          <p className="text-muted-foreground">
            Vérifiez les détails et planifiez votre séance
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="grid gap-4">
            <div>
              <h3 className="font-semibold">Type de séance</h3>
              <p className="text-muted-foreground capitalize">{workoutType}</p>
            </div>
            <div>
              <h3 className="font-semibold">Durée prévue</h3>
              <p className="text-muted-foreground">{duration} minutes</p>
            </div>
            <div>
              <h3 className="font-semibold">Équipement</h3>
              <p className="text-muted-foreground capitalize">{equipment}</p>
            </div>
            <div>
              <h3 className="font-semibold">Exercices ({exercises?.length})</h3>
              <div className="space-y-2">
                {exercises?.map((exercise: string, index: number) => (
                  <p key={index} className="text-muted-foreground">
                    {exercise}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Planifier pour plus tard</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="w-full sm:w-auto">
            Retour
          </Button>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleSave} className="w-full sm:w-auto">
              Planifier
            </Button>
            <Button onClick={handleStartNow} className="w-full sm:w-auto">
              Commencer maintenant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};