
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
      <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 md:mb-8">
        <TabsTrigger 
          value="home" 
          className={`text-[10px] xs:text-xs sm:text-sm truncate ${isMobile ? 'py-1 px-0.5 sm:py-1.5 sm:px-1' : ''}`}
        >
          {t("workouts.startWorkout")}
        </TabsTrigger>
        <TabsTrigger 
          value="library" 
          className={`text-[10px] xs:text-xs sm:text-sm truncate ${isMobile ? 'py-1 px-0.5 sm:py-1.5 sm:px-1' : ''}`}
        >
          {t("workouts.library")}
        </TabsTrigger>
        <TabsTrigger 
          value="history" 
          className={`text-[10px] xs:text-xs sm:text-sm truncate ${isMobile ? 'py-1 px-0.5 sm:py-1.5 sm:px-1' : ''}`}
        >
          {t("workouts.history")}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="home" className="space-y-3 sm:space-y-4 md:space-y-6">
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
