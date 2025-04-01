
import { PopularMealSuggestions } from "@/components/Nutrition/MealSuggestions/PopularMealSuggestions";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { UserProgressionWidget } from "@/components/UserProgression/UserProgressionWidget";
import { ActionButtons } from "@/components/Home/ActionButtons";
import { useHomeActions } from "@/hooks/use-home-actions";
import { WelcomeHeader } from "@/components/Home/WelcomeHeader";
import { TodaySummary } from "@/components/Home/TodaySummary";
import { TrendingStats } from "@/components/Home/TrendingStats";
import { useAuth } from "@/hooks/use-auth";
import { SpecialOfferCountdown } from "@/components/Subscription/SpecialOfferCountdown";

const Home = () => {
  const { handleStats } = useHomeActions();
  const { user } = useAuth();
  
  // Date cible 30 jours à partir de maintenant
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);
  
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 pb-20">
      <WelcomeHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="col-span-1 md:col-span-2">
          <TodaySummary />
        </div>
        
        <TrendingStats />
      </div>
      
      <ActionButtons />
      
      {/* Afficher l'offre spéciale */}
      <SpecialOfferCountdown targetDate={targetDate} />
      
      <WorkoutSuggestions />
      <PopularMealSuggestions />
    </div>
  );
};

export default Home;
