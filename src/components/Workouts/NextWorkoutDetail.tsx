import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Timer, Dumbbell, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SAMPLE_EXERCISES = [
  {
    name: "Rowing avec Haltères",
    sets: 3,
    reps: "12-15",
    rest: 60,
    image: "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png"
  },
  {
    name: "Tirage à la poulie barre en V",
    sets: 4,
    reps: "10-12",
    rest: 90,
    image: "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png"
  },
  {
    name: "Curl Biceps aux Haltères",
    sets: 3,
    reps: "12",
    rest: 60,
    image: "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png"
  },
  {
    name: "Développé Militaire",
    sets: 4,
    reps: "8-10",
    rest: 90,
    image: "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png"
  }
];

export const NextWorkoutDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 space-y-6">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Prochain Entraînement (IA)
          </h1>
          <p className="text-muted-foreground mt-2">
            Dos, Biceps, Épaules
          </p>
        </div>

        <div className="flex justify-center gap-6 flex-wrap">
          <Card className="p-4 flex items-center gap-2 bg-primary/5">
            <Timer className="h-5 w-5 text-primary" />
            <span>61 mins</span>
          </Card>
          <Card className="p-4 flex items-center gap-2 bg-primary/5">
            <Dumbbell className="h-5 w-5 text-primary" />
            <span>8 exercices</span>
          </Card>
          <Card className="p-4 flex items-center gap-2 bg-primary/5">
            <Flame className="h-5 w-5 text-primary" />
            <span>450 kcal</span>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {SAMPLE_EXERCISES.map((exercise, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video">
                <img 
                  src={exercise.image} 
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-4">
                <h3 className="font-semibold text-lg">{exercise.name}</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-2 bg-secondary/10 rounded-lg">
                    <div className="font-medium">{exercise.sets}</div>
                    <div className="text-muted-foreground">Séries</div>
                  </div>
                  <div className="text-center p-2 bg-secondary/10 rounded-lg">
                    <div className="font-medium">{exercise.reps}</div>
                    <div className="text-muted-foreground">Reps</div>
                  </div>
                  <div className="text-center p-2 bg-secondary/10 rounded-lg">
                    <div className="font-medium">{exercise.rest}s</div>
                    <div className="text-muted-foreground">Repos</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pt-6">
          <Button size="lg" className="w-full max-w-md">
            Commencer l'entraînement
          </Button>
        </div>
      </div>
    </div>
  );
};