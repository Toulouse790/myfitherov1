import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { ExerciseLibrary } from "@/components/Workouts/ExerciseLibrary";
import { CreateWorkoutDialog } from "@/components/Workouts/CreateWorkoutDialog";
import { SportPrograms } from "@/components/Workouts/SportPrograms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Workouts = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white dark:from-[#1A1F2C] dark:to-[#2A2F3F]">
      <Header />
      
      <main className="container max-w-6xl mx-auto px-4 pt-20 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Exercices</h1>
          <CreateWorkoutDialog />
        </div>

        <Tabs defaultValue="exercises" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="exercises">Bibliothèque d'exercices</TabsTrigger>
            <TabsTrigger value="programs">Programmes sportifs</TabsTrigger>
          </TabsList>

          <TabsContent value="exercises" className="space-y-6">
            <ExerciseLibrary />
          </TabsContent>

          <TabsContent value="programs" className="space-y-6">
            <SportPrograms />
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default Workouts;