import { BottomNav } from "@/components/Layout/BottomNav";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { Plus, Brain, Activity, ChartBar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { GenerateWorkoutDialog } from "@/components/Dashboard/WorkoutSuggestions/GenerateWorkoutDialog";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);

  const mainActions = [
    {
      icon: <Plus className="w-6 h-6" />,
      label: "Créer ma séance",
      onClick: () => navigate("/workouts")
    },
    {
      icon: <Activity className="w-6 h-6" />,
      label: "Cardio",
      onClick: () => navigate("/workouts/exercise/next-workout")
    },
    {
      icon: <ChartBar className="w-6 h-6" />,
      label: "Statistiques",
      onClick: () => navigate("/stats")
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      label: "Laissez-moi faire",
      onClick: () => setShowDialog(true)
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-7xl mx-auto px-4 pt-8 pb-20">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Bienvenue sur votre espace
          </h1>
          <p className="text-muted-foreground">
            Commencez votre entraînement ou consultez vos statistiques
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {mainActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              className="h-24 flex flex-col items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10"
              onClick={action.onClick}
            >
              {action.icon}
              <span>{action.label}</span>
            </Button>
          ))}
        </div>

        <div className="space-y-8">
          <WorkoutSuggestions />
        </div>

        <GenerateWorkoutDialog
          open={showDialog}
          onOpenChange={setShowDialog}
        />
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;