import { Header } from "@/components/Layout/Header";
import { DashboardCard } from "@/components/Dashboard/DashboardCard";
import { FoodJournal } from "@/components/Nutrition/FoodJournal";
import { NutritionChart } from "@/components/Nutrition/NutritionChart";
import { Flame, Beef, Droplets } from "lucide-react";

const Nutrition = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12 space-y-8">
        <h1 className="text-3xl font-bold">Nutrition</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Calories journalières"
            value="2000 kcal"
            icon={<Flame className="w-8 h-8" />}
          />
          <DashboardCard
            title="Protéines"
            value="150g"
            icon={<Beef className="w-8 h-8" />}
          />
          <DashboardCard
            title="Eau"
            value="2.5L"
            icon={<Droplets className="w-8 h-8" />}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <NutritionChart />
          <FoodJournal />
        </div>
      </main>
    </div>
  );
};

export default Nutrition;