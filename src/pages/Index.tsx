import { WidgetGrid } from "@/components/Widgets/WidgetGrid";
import { PersonalizedRecommendations } from "@/components/Recommendations/PersonalizedRecommendations";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { NextWorkoutCard } from "@/components/Workouts/NextWorkoutCard";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  useEffect(() => {
    toast({
      title: "Comment accéder à l'URL de l'application",
      description: "Cliquez sur l'icône du globe (Publish) en haut à droite pour obtenir l'URL de votre application.",
    });
  }, []);

  return (
    <div className="container max-w-full p-3 space-y-6 bg-[#1A1F2C]">
      <NextWorkoutCard />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full">
          <DashboardStats />
        </div>
        
        <div className="w-full">
          <WidgetGrid />
        </div>
      </div>
      
      <div className="w-full">
        <PersonalizedRecommendations />
      </div>
    </div>
  );
};

export default Index;