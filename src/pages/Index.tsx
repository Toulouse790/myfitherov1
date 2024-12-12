import { Header } from "@/components/Layout/Header";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { Button } from "@/components/ui/button";
import { Plus, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreateWorkoutDialog } from "@/components/Workouts/CreateWorkoutDialog";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { StrengthScore } from "@/components/Dashboard/StrengthScore";
import { TrendMetrics } from "@/components/Dashboard/TrendMetrics";
import { WorkoutSummary } from "@/components/Dashboard/WorkoutSummary";

export default function Index() {
  const navigate = useNavigate();

  return (
    <Header>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Mes entraînements</h2>
          <div className="flex gap-2">
            <CreateWorkoutDialog />
            <Button 
              variant="outline"
              onClick={() => navigate('/workouts')}
              className="gap-2"
            >
              <Dumbbell className="w-4 h-4" />
              Bibliothèque d'exercices
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardStats />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <StrengthScore />
          <TrendMetrics />
        </div>

        <WorkoutSummary />
        
        <div className="space-y-6">
          <WorkoutSuggestions />
        </div>
      </div>
    </Header>
  );
}