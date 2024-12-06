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

  const handleCreateWorkout = () => {
    toast({
      title: "Création d'un entraînement",
      description: "Cette fonctionnalité sera bientôt disponible !",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-lg mx-auto px-4 pt-8 pb-20">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Bienvenue sur votre espace
          </h1>
          <p className="text-muted-foreground">
            Commencez votre entraînement ou consultez vos statistiques
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-24 min-w-[200px] flex flex-col items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10"
            onClick={handleCreateWorkout}
          >
            <Plus className="w-6 h-6" />
            <span>Créer</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-24 min-w-[200px] flex flex-col items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10"
            onClick={() => navigate("/workouts/exercise/next-workout")}
          >
            <Activity className="w-6 h-6" />
            <span>Cardio</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-24 min-w-[200px] flex flex-col items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10"
            onClick={() => navigate("/stats")}
          >
            <ChartBar className="w-6 h-6" />
            <span>Statistiques</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-24 min-w-[200px] flex flex-col items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10"
            onClick={() => setShowDialog(true)}
          >
            <Sparkles className="w-6 h-6" />
            <span>Laissez-moi faire</span>
          </Button>
        </div>

        <WorkoutSuggestions />

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