import { Header } from "@/components/Layout/Header";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Dumbbell, Activity, Apple, Moon, BarChart, User } from "lucide-react";

export default function Index() {
  return (
    <Header>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Entraînements */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/workouts" className="block">
              <div className="flex flex-col items-center gap-4">
                <Dumbbell className="w-12 h-12 text-primary" />
                <h2 className="text-xl font-semibold">Entraînements</h2>
                <p className="text-muted-foreground text-center">
                  Accédez à vos séances et suivez vos progrès
                </p>
              </div>
            </Link>
          </Card>

          {/* Cardio */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/cardio" className="block">
              <div className="flex flex-col items-center gap-4">
                <Activity className="w-12 h-12 text-primary" />
                <h2 className="text-xl font-semibold">Cardio</h2>
                <p className="text-muted-foreground text-center">
                  Gérez vos séances de cardio et votre endurance
                </p>
              </div>
            </Link>
          </Card>

          {/* Nutrition */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/nutrition" className="block">
              <div className="flex flex-col items-center gap-4">
                <Apple className="w-12 h-12 text-primary" />
                <h2 className="text-xl font-semibold">Nutrition</h2>
                <p className="text-muted-foreground text-center">
                  Suivez votre alimentation et vos objectifs
                </p>
              </div>
            </Link>
          </Card>

          {/* Sommeil */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/sleep" className="block">
              <div className="flex flex-col items-center gap-4">
                <Moon className="w-12 h-12 text-primary" />
                <h2 className="text-xl font-semibold">Sommeil</h2>
                <p className="text-muted-foreground text-center">
                  Analysez la qualité de votre sommeil
                </p>
              </div>
            </Link>
          </Card>

          {/* Statistiques */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/stats" className="block">
              <div className="flex flex-col items-center gap-4">
                <BarChart className="w-12 h-12 text-primary" />
                <h2 className="text-xl font-semibold">Statistiques</h2>
                <p className="text-muted-foreground text-center">
                  Visualisez vos progrès et performances
                </p>
              </div>
            </Link>
          </Card>

          {/* Profil */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/profile" className="block">
              <div className="flex flex-col items-center gap-4">
                <User className="w-12 h-12 text-primary" />
                <h2 className="text-xl font-semibold">Profil</h2>
                <p className="text-muted-foreground text-center">
                  Gérez vos informations personnelles
                </p>
              </div>
            </Link>
          </Card>
        </div>

        <div className="mt-8">
          <WorkoutSuggestions />
        </div>
      </div>
    </Header>
  );
}