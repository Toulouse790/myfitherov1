import { PopularMealSuggestions } from "@/components/Nutrition/MealSuggestions/PopularMealSuggestions";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <WorkoutSuggestions />
      <PopularMealSuggestions />
    </div>
  );
};

export default Home;