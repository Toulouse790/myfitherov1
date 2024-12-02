import { ThemeSelector } from "@/components/Theme/ThemeSelector";
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
    <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Tableau de bord</h1>
        <ThemeSelector />
      </div>
      
      <div className="w-full overflow-x-hidden">
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