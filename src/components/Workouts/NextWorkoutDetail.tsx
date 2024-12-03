import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MetricComparison } from "./NextWorkoutDetail/MetricComparison";

export const NextWorkoutDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>

      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dos, Biceps, Épaules</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Timer className="w-4 h-4" />
            <span>61 mins</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricComparison
            planned={8}
            actual={8}
            unit="exercices"
            icon={Timer}
          />
          <MetricComparison
            planned={24}
            actual={24}
            unit="séries"
            icon={Timer}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Exercices</h2>
          <div className="grid gap-4">
            {[
              "Rowing avec Haltères",
              "Tirage à la poulie barre en V",
              "Curl Biceps aux Haltères",
              "Curl Marteau",
              "Développé Militaire",
              "Élévations Latérales",
              "Crunch",
              "Planche"
            ].map((exercise, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <span>{exercise}</span>
                  <span className="text-sm text-muted-foreground">3 × 12</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Annuler
          </Button>
          <Button onClick={() => navigate('/workouts')}>
            Commencer l'entraînement
          </Button>
        </div>
      </Card>
    </div>
  );
};