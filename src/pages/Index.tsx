import { ThemeSelector } from "@/components/Theme/ThemeSelector";
import { WidgetGrid } from "@/components/Widgets/WidgetGrid";
import { PersonalizedRecommendations } from "@/components/Recommendations/PersonalizedRecommendations";

const Index = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <ThemeSelector />
      </div>
      
      <WidgetGrid />
      
      <PersonalizedRecommendations />
    </div>
  );
};

export default Index;