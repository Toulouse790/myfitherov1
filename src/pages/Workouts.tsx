
import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { WorkoutLibrary, WorkoutHistory, SmartWorkoutGenerator } from "@/components/Workouts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { WorkoutFlowManager } from "@/components/Workouts/WorkoutFlow/WorkoutFlowManager";
import { DebugExercises } from "@/components/Workouts/components/DebugExercises";

export default function Workouts() {
  const { t } = useLanguage();
  const [showDebug, setShowDebug] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-7xl mx-auto p-4 pt-40 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {t("workouts.title") || "Entraînements"}
          </h1>
          <button 
            onClick={() => setShowDebug(!showDebug)}
            className="text-xs text-muted-foreground hover:underline"
          >
            {showDebug ? "Masquer débogage" : "Afficher débogage"}
          </button>
        </div>
        
        {showDebug && <DebugExercises />}
        
        <Tabs defaultValue="workout">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="workout">
              {t("workouts.startWorkout") || "Démarrer une séance"}
            </TabsTrigger>
            <TabsTrigger value="library">
              {t("workouts.library") || "Bibliothèque"}
            </TabsTrigger>
            <TabsTrigger value="history">
              {t("workouts.history") || "Historique"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="workout" className="space-y-8">
            <div className="bg-muted/20 p-3 rounded-md text-sm text-muted-foreground mb-4">
              <p>Pour une séance efficace, nous recommandons:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>20-30 min: 2-3 exercices</li>
                <li>45 min: 4-5 exercices</li>
                <li>60+ min: 5-7 exercices</li>
              </ul>
            </div>
            <SmartWorkoutGenerator />
          </TabsContent>
          
          <TabsContent value="library">
            <WorkoutLibrary />
          </TabsContent>
          
          <TabsContent value="history">
            <WorkoutHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
