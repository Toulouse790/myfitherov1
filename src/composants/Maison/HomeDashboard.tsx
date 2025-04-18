
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WelcomeHeader } from "@/components/Home/WelcomeHeader";
import { TodaySummary } from "@/components/Home/TodaySummary";
import { TrendingStats } from "@/components/Home/TrendingStats";

export function HomeDashboard() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <WelcomeHeader />

      <Tabs defaultValue="sport" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="sport">Sport</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="sleep">Sommeil</TabsTrigger>
        </TabsList>

        <TabsContent value="sport" className="space-y-4">
          <TodaySummary />
          <TrendingStats />
        </TabsContent>

        <TabsContent value="nutrition">
          <TodaySummary />
        </TabsContent>

        <TabsContent value="sleep">
          <TodaySummary />
        </TabsContent>
      </Tabs>
    </div>
  );
}
