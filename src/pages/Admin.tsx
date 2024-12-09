import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDashboard } from "@/components/Admin/AdminDashboard";
import { ExerciseTable } from "@/components/Admin/ExerciseTable";

const Admin = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="exercises" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="exercises">Exercices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <AdminDashboard />
        </TabsContent>
        
        <TabsContent value="exercises">
          <ExerciseTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;