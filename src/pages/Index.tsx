import { Header } from "@/components/Layout/Header";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { WorkoutCard } from "@/components/Workouts/WorkoutCard";
import { useToast } from "@/hooks/use-toast";
import { WorkoutData } from "@/components/Workouts/workoutConstants";

const Index = () => {
  const { toast } = useToast();

  const handleWorkoutStart = () => {
    toast({
      title: "Séance commencée",
      description: "Bon entraînement ! 💪",
    });
  };

  const sampleWorkouts: WorkoutData[] = [
    {
      id: "dashboard-1",
      title: "Full Body",
      description: "Séance complète pour tout le corps",
      muscleGroup: "fullBody",
      difficulty: "beginner",
      duration: 45,
      exercises: 8,
      equipment: "Haltères, Tapis",
      location: "home",
    },
    {
      id: "dashboard-2",
      title: "Haut du corps",
      description: "Focus sur le haut du corps",
      muscleGroup: "chest",
      difficulty: "intermediate",
      duration: 30,
      exercises: 6,
      equipment: "Banc, Haltères",
      location: "gym",
    },
    {
      id: "dashboard-3",
      title: "Bas du corps",
      description: "Focus sur le bas du corps",
      muscleGroup: "legs",
      difficulty: "intermediate",
      duration: 40,
      exercises: 7,
      equipment: "Squat rack, Haltères",
      location: "gym",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12 space-y-8">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        
        <DashboardStats />
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Séances récentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;