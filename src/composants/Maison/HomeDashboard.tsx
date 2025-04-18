
import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";  
import { WelcomeHeader } from "./WelcomeHeader";
import { TodaySummary } from "./TodaySummary";
import { TrendingStats } from "./TrendingStats";
import { ActionButtons } from "./ActionButtons";

export function HomeDashboard() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* En‑tête d'accueil */}
      <WelcomeHeader />

      {/* Onglets pour Sport / Nutrition / Sommeil */}
      <Tabs defaultValue="sport" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="sport">Sport</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="sleep">Sommeil</TabsTrigger>
        </TabsList>

        {/* Onglet Sport */}
        <TabsContent value="sport" className="space-y-4">
          {/* Boutons d'action rapide */}
          <ActionButtons />

          {/* Résumé du jour */}
          <TodaySummary />

          {/* Statistiques tendances */}
          <TrendingStats />
        </TabsContent>

        {/* Onglet Nutrition */}
        <TabsContent value="nutrition">
          {/* Tu pourras remplacer par un NutritionOverview dédié */}
          <TodaySummary />
        </TabsContent>

        {/* Onglet Sommeil */}
        <TabsContent value="sleep">
          {/* Tu pourras remplacer par un SleepOverview dédié */}
          <TodaySummary />
        </TabsContent>
      </Tabs>
    </div>
  );
}
