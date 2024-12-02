import { WidgetGrid } from "@/components/Widgets/WidgetGrid";
import { PersonalizedRecommendations } from "@/components/Recommendations/PersonalizedRecommendations";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
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
    <div className="container max-w-full p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center sm:text-left">Tableau de bord</h1>
      
      <div className="w-full -mx-3 sm:mx-0 px-3 sm:px-0">
        <DashboardStats />
      </div>
      
      <div className="w-full">
        <WidgetGrid />
      </div>
      
      <div className="w-full">
        <PersonalizedRecommendations />
      </div>
    </div>
  );
};

export default Index;