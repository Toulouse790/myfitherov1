import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDashboard } from "@/components/Admin/AdminDashboard";
import { AdminStats } from "@/components/Admin/AdminStats";
import { MediaManager } from "@/components/Admin/MediaManager";
import { ExerciseTable } from "@/components/Admin/ExerciseTable";
import { useState } from "react";

const Admin = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const handleExercisesDeleted = () => {
    setSelectedExercises([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="finances" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="media">Médias</TabsTrigger>
          <TabsTrigger value="exercises">Exercices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="finances" className="space-y-6">
          <AdminStats />
          <AdminDashboard />
        </TabsContent>
        
        <TabsContent value="media">
          <MediaManager />
        </TabsContent>

        <TabsContent value="exercises">
          <ExerciseTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;