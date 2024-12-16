import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Layout/Header";
import { Dumbbell, Heart, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const WorkoutTypeSelection = () => {
  const navigate = useNavigate();

  const workoutTypes = [
    {
      id: "strength",
      name: "Musculation",
      description: "Séance de musculation avec poids et machines",
      icon: <Dumbbell className="w-6 h-6 text-primary" />,
    },
    {
      id: "cardio",
      name: "Cardio",
      description: "Séance cardio pour améliorer votre endurance",
      icon: <Heart className="w-6 h-6 text-primary" />,
    },
    {
      id: "mixed",
      name: "Mixte",
      description: "Combinaison de musculation et de cardio",
      icon: <Zap className="w-6 h-6 text-primary" />,
    },
  ];

  const handleTypeSelection = (type: string) => {
    navigate("/workouts/setup", { state: { workoutType: type } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Quel type de séance ?</h1>
          <p className="text-muted-foreground">
            Choisissez le type de séance que vous souhaitez créer
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {workoutTypes.map((type) => (
            <Card
              key={type.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleTypeSelection(type.id)}
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {type.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{type.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
};