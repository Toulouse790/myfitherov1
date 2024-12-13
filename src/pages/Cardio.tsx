import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface CardioExercise {
  id: string;
  name: string;
  type: string;
  parameters: any;
  calories_formula: string;
}

export default function Cardio() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedExercise, setSelectedExercise] = useState<CardioExercise | null>(null);

  const { data: exercises, isLoading } = useQuery({
    queryKey: ['cardio-exercises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cardio_exercises')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching cardio exercises:', error);
        throw error;
      }

      return data;
    }
  });

  const handleStartExercise = async () => {
    if (!selectedExercise || !user) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un exercice",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert([
          {
            user_id: user.id,
            type: 'cardio',
            status: 'in_progress',
            exercises: [selectedExercise.name]
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (session) {
        navigate(`/workout/${session.id}`);
      }
    } catch (error) {
      console.error('Error creating cardio session:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la séance",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Header>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Header>
    );
  }

  return (
    <Header>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Exercices Cardio</h1>
          {selectedExercise && (
            <Button onClick={handleStartExercise} className="bg-primary">
              <Timer className="mr-2 h-4 w-4" />
              C'est parti !
            </Button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exercises?.map((exercise) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedExercise?.id === exercise.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedExercise(exercise)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{exercise.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {exercise.type}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Header>
  );
}