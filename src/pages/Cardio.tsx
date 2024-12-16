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
      console.log('Fetching cardio exercises...');
      const { data, error } = await supabase
        .from('cardio_exercises')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching cardio exercises:', error);
        throw error;
      }

      console.log('Fetched cardio exercises:', data);
      return data;
    }
  });

  const handleStartExercise = async () => {
    if (!selectedExercise) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner un exercice avant de commencer",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour créer une séance",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Creating workout session for exercise:', selectedExercise);
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert([
          {
            user_id: user.id,
            type: 'cardio',
            status: 'in_progress',
            exercises: [selectedExercise.name],
            workout_type: 'cardio'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      console.log('Created workout session:', session);
      if (session) {
        navigate(`/cardio-session/${session.id}`);
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
          <Button 
            onClick={handleStartExercise} 
            className={`bg-primary transition-all duration-300 ${
              !selectedExercise ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
            disabled={!selectedExercise}
          >
            <Timer className="mr-2 h-4 w-4" />
            {selectedExercise ? "C'est parti !" : "Sélectionnez un exercice"}
          </Button>
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