import { SleepTracker } from "@/components/Sleep/SleepTracker";
import { ConnectedDevices } from "@/components/Sleep/ConnectedDevices";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, History, Target } from "lucide-react";

const Sleep = () => {
  return (
    <div className="container mx-auto p-4 pb-24 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Moon className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Sommeil</h1>
      </div>

      <Tabs defaultValue="tracker" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="tracker" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <div className="flex items-center gap-2 py-2">
              <Moon className="w-4 h-4" />
              <span>Suivi</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <div className="flex items-center gap-2 py-2">
              <History className="w-4 h-4" />
              <span>Historique</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <div className="flex items-center gap-2 py-2">
              <Target className="w-4 h-4" />
              <span>Objectifs</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-4 col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Moon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Score de sommeil</h3>
              </div>
              <div className="flex items-center justify-center p-8">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold">85</span>
                  </div>
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted/20"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="377"
                      strokeDashoffset="56.55"
                      className="text-primary"
                    />
                  </svg>
                </div>
              </div>
            </Card>
            <ConnectedDevices />
          </div>
          <SleepTracker />
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5" />
              <h3 className="font-semibold">Historique du sommeil</h3>
            </div>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Historique à venir
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5" />
              <h3 className="font-semibold">Objectifs de sommeil</h3>
            </div>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Configuration des objectifs à venir
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sleep;