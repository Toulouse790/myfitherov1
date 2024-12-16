import { Header } from "@/components/Layout/Header";
import { DashboardCard } from "@/components/Dashboard/DashboardCard";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { PersonalizedRecommendations } from "@/components/Recommendations/PersonalizedRecommendations";
import { Target, Dumbbell, Trophy, Star } from "lucide-react";

export default function Index() {
  return (
    <Header>
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-sm text-muted-foreground">
            Suivez vos progrès et atteignez vos objectifs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DashboardCard
            title="Objectif du jour"
            value="2000"
            target="2500"
            icon={<Target className="w-4 h-4" />}
          />
          <DashboardCard
            title="Séances complétées"
            value="3"
            target="5"
            icon={<Dumbbell className="w-4 h-4" />}
          />
          <DashboardCard
            title="Niveau actuel"
            value="5"
            target="6"
            icon={<Trophy className="w-4 h-4" />}
          />
          <DashboardCard
            title="Points gagnés"
            value="1250"
            target="2000"
            icon={<Star className="w-4 h-4" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WorkoutSuggestions />
          <PersonalizedRecommendations />
        </div>
      </div>
    </Header>
  );
}