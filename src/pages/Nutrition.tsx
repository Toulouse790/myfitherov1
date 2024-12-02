import { NutritionGoals } from "@/components/Nutrition/NutritionGoals";
import { NutritionChart } from "@/components/Nutrition/NutritionChart";
import { FoodJournal } from "@/components/Nutrition/FoodJournal";
import { MealPlanGenerator } from "@/components/Nutrition/MealPlanGenerator";

const Nutrition = () => {
  // Ces valeurs devraient venir du questionnaire initial
  const mockUserData = {
    workoutsPerWeek: 4,
    goal: "muscle_gain" as const,
    weight: 75,
    height: 175,
    age: 30,
    allergies: [],
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Nutrition</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <NutritionGoals />
        <NutritionChart />
      </div>
      <MealPlanGenerator {...mockUserData} />
      <FoodJournal />
    </div>
  );
};

export default Nutrition;