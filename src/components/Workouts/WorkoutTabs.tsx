
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { HomeTab } from "./Tabs/HomeTab";
import { ProgressTab } from "./Tabs/ProgressTab";
import { HistoryTab } from "./Tabs/HistoryTab";
import { Home, LineChart, Clock, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

interface WorkoutTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function WorkoutTabs({ activeTab, setActiveTab }: WorkoutTabsProps) {
  const { t } = useLanguage();

  const fadeInAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl shadow-lg border border-border/30 overflow-hidden">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="p-4 pb-0">
          <TabsList className="grid grid-cols-3 w-full bg-background/50 rounded-lg">
            <TabsTrigger value="home" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <Home className="h-4 w-4 mr-2" />
              {t("workouts.home")}
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <BarChart3 className="h-4 w-4 mr-2" />
              {t("workouts.progress")}
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <Clock className="h-4 w-4 mr-2" />
              {t("workouts.history")}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="p-4">
          <TabsContent value="home" className="mt-0">
            <motion.div
              key="home"
              {...fadeInAnimation}
            >
              <HomeTab />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="progress" className="mt-0">
            <motion.div
              key="progress"
              {...fadeInAnimation}
            >
              <ProgressTab />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <motion.div
              key="history"
              {...fadeInAnimation}
            >
              <HistoryTab />
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
