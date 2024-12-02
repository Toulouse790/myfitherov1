import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { WorkoutList } from "@/components/Workouts/WorkoutList";
import { useToast } from "@/hooks/use-toast";

const Workouts = () => {
  const { toast } = useToast();

  const handleCreateWorkout = () => {
    toast({
      title: "Création d'une séance",
      description: "Cette fonctionnalité sera bientôt disponible",
    });
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Entraînements</h1>
        <Button onClick={handleCreateWorkout} className="gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle séance
        </Button>
      </div>

      <WorkoutList />
    </div>
  );
};

export default Workouts;