
import { PopularMealSuggestions } from "@/components/Nutrition/MealSuggestions/PopularMealSuggestions";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { UserProgressionWidget } from "@/components/UserProgression/UserProgressionWidget";
import { Card } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import { Link } from "react-router-dom";
import { ActionButtons } from "@/components/Home/ActionButtons";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-2 p-6">
          <UserProgressionWidget />
        </Card>
        
        <Link to="/stats" className="flex h-full">
          <Card className="w-full h-full p-6 hover:bg-accent transition-colors cursor-pointer border-2 border-transparent hover:border-primary/20 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ChartBar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Statistiques</h3>
            <p className="text-sm text-center text-muted-foreground mt-2">
              Consultez vos performances et progression
            </p>
          </Card>
        </Link>
      </div>
      
      <ActionButtons />
      <WorkoutSuggestions />
      <PopularMealSuggestions />
    </div>
  );
};

export default Home;
