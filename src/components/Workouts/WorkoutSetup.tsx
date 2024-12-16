import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Layout/Header";
import { Clock, Dumbbell } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const WorkoutSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workoutType } = location.state || { workoutType: "strength" };

  const durations = [
    { value: 30, label: "30 minutes" },
    { value: 45, label: "45 minutes" },
    { value: 60, label: "1 heure" },
    { value: 90, label: "1h30" },
  ];

  const equipments = [
    { id: "gym", name: "Salle de sport", description: "Accès à tout le matériel" },
    { id: "home", name: "À domicile", description: "Matériel limité" },
    { id: "minimal", name: "Minimal", description: "Poids du corps uniquement" },
  ];

  const handleSetup = (duration: number, equipment: string) => {
    navigate("/workouts/customize", {
      state: {
        workoutType,
        duration,
        equipment,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Configuration de la séance</h1>
          <p className="text-muted-foreground">
            Choisissez la durée et le matériel disponible
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Durée souhaitée</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {durations.map((duration) => (
                <Card
                  key={duration.value}
                  className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleSetup(duration.value, "gym")}
                >
                  <div className="space-y-2 text-center">
                    <Clock className="w-6 h-6 mx-auto text-primary" />
                    <div className="font-medium">{duration.label}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Matériel disponible</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {equipments.map((equipment) => (
                <Card
                  key={equipment.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleSetup(45, equipment.id)}
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{equipment.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {equipment.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
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