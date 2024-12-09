import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDashboard } from "@/components/Admin/AdminDashboard";
import { ExerciseTable } from "@/components/Admin/ExerciseTable";

const Admin = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="unpublished" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="unpublished">Exercices à publier</TabsTrigger>
          <TabsTrigger value="published">Exercices publiés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <AdminDashboard />
        </TabsContent>
        
        <TabsContent value="unpublished">
          <ExerciseTable isPublished={false} />
        </TabsContent>

        <TabsContent value="published">
          <ExerciseTable isPublished={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;