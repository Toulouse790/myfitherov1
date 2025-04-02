
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WorkoutGenerator } from "./WorkoutGenerator";
import { WorkoutLibrary } from "./WorkoutLibrary";
import { WorkoutHistory } from "./WorkoutHistory";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface WorkoutTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function WorkoutTabs({ activeTab, setActiveTab }: WorkoutTabsProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8">
        <TabsTrigger 
          value="home" 
          className={`text-xs sm:text-sm ${isMobile ? 'py-1.5 px-1' : ''}`}
        >
          {t("workouts.startWorkout")}
        </TabsTrigger>
        <TabsTrigger 
          value="library" 
          className={`text-xs sm:text-sm ${isMobile ? 'py-1.5 px-1' : ''}`}
        >
          {t("workouts.library")}
        </TabsTrigger>
        <TabsTrigger 
          value="history" 
          className={`text-xs sm:text-sm ${isMobile ? 'py-1.5 px-1' : ''}`}
        >
          {t("workouts.history")}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="home" className="space-y-4 sm:space-y-6">
        <WorkoutGenerator />
      </TabsContent>
      
      <TabsContent value="library">
        <WorkoutLibrary />
      </TabsContent>
      
      <TabsContent value="history">
        <WorkoutHistory />
      </TabsContent>
    </Tabs>
  );
}
