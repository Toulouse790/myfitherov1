import { Header } from "@/components/Layout/Header";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Dumbbell, Activity, BarChart, User } from "lucide-react";

export default function Index() {
  return (
    <Header>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Entraînements */}
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/workouts" className="block">
              <div className="flex flex-col items-center gap-3">
                <Dumbbell className="w-8 h-8 text-primary" />
                <h2 className="text-lg font-semibold">Entraînements</h2>
                <p className="text-sm text-muted-foreground text-center">
                  Accédez à vos séances et suivez vos progrès
                </p>
              </div>
            </Link>
          </Card>

          {/* Cardio */}
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/cardio" className="block">
              <div className="flex flex-col items-center gap-3">
                <Activity className="w-8 h-8 text-primary" />
                <h2 className="text-lg font-semibold">Cardio</h2>
                <p className="text-sm text-muted-foreground text-center">
                  Gérez vos séances de cardio et votre endurance
                </p>
              </div>
            </Link>
          </Card>

          {/* Statistiques */}
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/stats" className="block">
              <div className="flex flex-col items-center gap-3">
                <BarChart className="w-8 h-8 text-primary" />
                <h2 className="text-lg font-semibold">Statistiques</h2>
                <p className="text-sm text-muted-foreground text-center">
                  Visualisez vos progrès et performances
                </p>
              </div>
            </Link>
          </Card>

          {/* Profil */}
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/profile" className="block">
              <div className="flex flex-col items-center gap-3">
                <User className="w-8 h-8 text-primary" />
                <h2 className="text-lg font-semibold">Profil</h2>
                <p className="text-sm text-muted-foreground text-center">
                  Gérez vos informations personnelles
                </p>
              </div>
            </Link>
          </Card>
        </div>

        <div className="mt-6">
          <WorkoutSuggestions />
        </div>
      </div>
    </Header>
  );
}