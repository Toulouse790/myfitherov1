
import React from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { WelcomeHeader } from "@/components/Home/WelcomeHeader";
import { TodaySummary } from "@/components/Home/TodaySummary";
import { TrendingStats } from "@/components/Home/TrendingStats";
import { Dumbbell, Running } from "lucide-react";

export function HomeDashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <WelcomeHeader />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Button 
          size="lg"
          className="h-24 text-lg font-bold"
          onClick={() => navigate('/workouts/generate')}
        >
          <Dumbbell className="w-6 h-6 mr-2" />
          Nouvelle séance de musculation
        </Button>
        
        <Button 
          size="lg"
          className="h-24 text-lg font-bold"
          onClick={() => navigate('/cardio')}
        >
          <Running className="w-6 h-6 mr-2" />
          Nouvelle séance de cardio
        </Button>
      </div>

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
