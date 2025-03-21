
import { SleepTracker } from "@/components/Sleep/SleepTracker";
import { SleepScore } from "@/components/Sleep/SleepScore";
import { SleepHistory } from "@/components/Sleep/SleepHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, History, Target, TrendingUp, BarChart } from "lucide-react";
import { Header } from "@/components/Layout/Header";

const Sleep = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-4 pb-24 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Moon className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Sommeil</h1>
        </div>

        <Tabs defaultValue="tracker" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="tracker" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span>Suivi</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>Historique</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Analyses</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracker" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="col-span-2">
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
                <h3 className="text-lg font-medium">Tendances de sommeil</h3>
                <div className="flex-1 bg-card border rounded-lg p-4 flex items-center justify-center">
                  <div className="text-muted-foreground flex flex-col items-center">
                    <BarChart className="h-16 w-16 mb-2 opacity-50" />
                    <p>Graphiques de tendances à venir</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-medium">Corrélations</h3>
                <div className="flex-1 bg-card border rounded-lg p-4 flex items-center justify-center">
                  <div className="text-muted-foreground flex flex-col items-center">
                    <Target className="h-16 w-16 mb-2 opacity-50" />
                    <p>Impact de l'exercice et de la nutrition sur votre sommeil</p>
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
