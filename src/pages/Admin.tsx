import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDashboard } from "@/components/Admin/AdminDashboard";
import { ExerciseTable } from "@/components/Admin/ExerciseTable";
import { FoodSuggestionsTable } from "@/components/Admin/FoodSuggestions/FoodSuggestionsTable";

const Admin = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="exercises">Gestion des exercices</TabsTrigger>
          <TabsTrigger value="food-suggestions">Suggestions d'aliments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <AdminDashboard />
        </TabsContent>
        
        <TabsContent value="exercises">
          <ExerciseTable />
        </TabsContent>

        <TabsContent value="food-suggestions">
          <FoodSuggestionsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;