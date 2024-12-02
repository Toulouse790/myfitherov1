import { Header } from "@/components/Layout/Header";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { WorkoutCard } from "@/components/Workouts/WorkoutCard";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleWorkoutStart = () => {
    toast({
      title: "Séance commencée",
      description: "Bon entraînement ! 💪",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12 space-y-8">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        
        <DashboardStats />
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Séances récentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <WorkoutCard
              title="Full Body"
              duration="45 min"
              exercises={8}
              onClick={handleWorkoutStart}
            />
            <WorkoutCard
              title="Haut du corps"
              duration="30 min"
              exercises={6}
              onClick={handleWorkoutStart}
            />
            <WorkoutCard
              title="Bas du corps"
              duration="40 min"
              exercises={7}
              onClick={handleWorkoutStart}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;