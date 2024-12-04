import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { Header } from "@/components/Layout/Header";
import { SidebarProvider } from "@/components/ui/sidebar";

const SAMPLE_EXERCISES = [
  {
    name: "Développé couché",
    sets: 4,
    reps: 12,
    muscleGroup: "Pectoraux"
  },
  {
    name: "Rowing barre",
    sets: 4,
    reps: 12,
    muscleGroup: "Dos"
  },
  {
    name: "Squat",
    sets: 4,
    reps: 12,
    muscleGroup: "Jambes"
  },
  {
    name: "Développé militaire",
    sets: 4,
    reps: 10,
    muscleGroup: "Épaules"
  },
  {
    name: "Curl Biceps",
    sets: 3,
    reps: 12,
    muscleGroup: "Biceps"
  },
  {
    name: "Extensions Triceps",
    sets: 3,
    reps: 12,
    muscleGroup: "Triceps"
  },
  {
    name: "Élévations latérales",
    sets: 3,
    reps: 15,
    muscleGroup: "Épaules"
  },
  {
    name: "Crunch",
    sets: 3,
    reps: 20,
    muscleGroup: "Abdominaux"
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      createWorkoutSession();
    }
  }, [user]);

  const createWorkoutSession = async () => {
    try {
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert([
          { user_id: user?.id }
        ])
        .select()
        .single();

      if (error) throw error;
      setSessionId(session.id);
    } catch (error) {
      console.error('Error creating workout session:', error);
    }
  };

  const startExercise = (index: number) => {
    if (sessionId) {
      navigate(`/workouts/exercise/next-workout?session=${sessionId}`);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <AppSidebar />
        <div className="md:pl-64">
          <div className="container max-w-4xl mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold">Programme d'aujourd'hui</h1>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {SAMPLE_EXERCISES.map((exercise, index) => (
                <Card 
                  key={index}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => startExercise(index)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {exercise.muscleGroup} • {exercise.sets} séries • {exercise.reps} répétitions
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="fixed bottom-8 left-0 right-0 px-4">
              <Button 
                className="w-full max-w-2xl mx-auto"
                onClick={() => startExercise(0)}
              >
                Commencer l'entraînement
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;