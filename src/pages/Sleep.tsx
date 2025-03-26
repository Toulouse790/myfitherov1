
import { SleepTracker } from "@/components/Sleep/SleepTracker";
import { SleepScore } from "@/components/Sleep/SleepScore";
import { SleepHistory } from "@/components/Sleep/SleepHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, History, Target, TrendingUp, BarChart } from "lucide-react";
import { Header } from "@/components/Layout/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

const Sleep = () => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-4 pb-24 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Moon className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">{t("sleep.title")}</h1>
        </div>

        <Tabs defaultValue="tracker" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger 
              value="tracker" 
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-primary-foreground"
            >
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span>{t("sleep.tracking")}</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-primary-foreground"
            >
              <div className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>{t("sleep.history")}</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-primary-foreground"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>{t("sleep.analysis")}</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracker" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className={isMobile ? "col-span-1" : "col-span-2"}>
                <SleepScore />
              </div>
              <div className="md:col-span-1">
                <SleepTracker />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <SleepHistory />
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-medium text-blue-500">{t("sleep.trends")}</h3>
                <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/30 rounded-lg p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="text-muted-foreground flex flex-col items-center">
                    <BarChart className="h-16 w-16 mb-2 opacity-50 text-blue-400" />
                    <p>{t("sleep.trendChartsComing")}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-medium text-blue-500">{t("sleep.correlations")}</h3>
                <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/30 rounded-lg p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="text-muted-foreground flex flex-col items-center">
                    <Target className="h-16 w-16 mb-2 opacity-50 text-blue-400" />
                    <p>{t("sleep.exerciseImpact")}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Sleep;
