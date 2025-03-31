
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dumbbell, History, LineChart } from "lucide-react";
import { HomeTab } from "./Tabs/HomeTab";
import { ProgressTab } from "./Tabs/ProgressTab";
import { HistoryTab } from "./Tabs/HistoryTab";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkoutTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function WorkoutTabs({ activeTab, setActiveTab }: WorkoutTabsProps) {
  const { t } = useLanguage();
  
  return (
    <Tabs defaultValue="home" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="home">
          <Dumbbell className="h-4 w-4 mr-2" />
          {t("workouts.home")}
        </TabsTrigger>
        <TabsTrigger value="progress">
          <LineChart className="h-4 w-4 mr-2" />
          {t("workouts.progress")}
        </TabsTrigger>
        <TabsTrigger value="history">
          <History className="h-4 w-4 mr-2" />
          {t("workouts.history")}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="home" className="space-y-6">
        <HomeTab />
      </TabsContent>
      
      <TabsContent value="progress" className="space-y-6">
        <ProgressTab />
      </TabsContent>
      
      <TabsContent value="history" className="space-y-6">
        <HistoryTab />
      </TabsContent>
    </Tabs>
  );
}
