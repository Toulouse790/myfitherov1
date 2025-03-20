
import { PopularMealSuggestions } from "@/components/Nutrition/MealSuggestions/PopularMealSuggestions";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { UserProgressionWidget } from "@/components/UserProgression/UserProgressionWidget";
import { Card } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import { Link } from "react-router-dom";
import { ActionButtons } from "@/components/Home/ActionButtons";
import { useHomeActions } from "@/hooks/use-home-actions";

const Home = () => {
  const { handleStats } = useHomeActions();
  
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="col-span-1 md:col-span-2 p-4 sm:p-6">
          <UserProgressionWidget />
        </Card>
        
        <Card 
          onClick={handleStats}
          className="w-full h-full p-4 sm:p-6 hover:bg-accent transition-colors cursor-pointer border-2 border-transparent hover:border-primary/20 flex flex-col items-center justify-center"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
            <ChartBar className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold">Statistiques</h3>
          <p className="text-xs sm:text-sm text-center text-muted-foreground mt-1 sm:mt-2">
            Consultez vos performances et progression
          </p>
        </Card>
      </div>
      
      <ActionButtons />
      <WorkoutSuggestions />
      <PopularMealSuggestions />
    </div>
  );
};

export default Home;
