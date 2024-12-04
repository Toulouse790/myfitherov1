import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDashboard } from "@/components/Admin/AdminDashboard";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { AdminStats } from "@/components/Admin/AdminStats";
import { MediaManager } from "@/components/Admin/MediaManager";
import { ExerciseTable } from "@/components/Admin/ExerciseTable";
import { useState } from "react";

const Admin = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <AdminHeader 
        isEditing={isEditing} 
        onEditingChange={setIsEditing}
      />
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