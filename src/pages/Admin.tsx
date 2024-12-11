import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDashboard } from "@/components/Admin/AdminDashboard";
import { ExerciseTable } from "@/components/Admin/ExerciseTable";
import { FoodSuggestionsTable } from "@/components/Admin/FoodSuggestions/FoodSuggestionsTable";
import { StylesManager } from "@/components/Admin/Styles/StylesManager";
import { UserDashboard } from "@/components/Admin/UserDashboard";

const Admin = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="user-dashboard">Tableau utilisateur</TabsTrigger>
          <TabsTrigger value="exercises">Gestion des exercices</TabsTrigger>
          <TabsTrigger value="food-suggestions">Suggestions d'aliments</TabsTrigger>
          <TabsTrigger value="styles">Styles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <AdminDashboard />
        </TabsContent>

        <TabsContent value="user-dashboard">
          <UserDashboard />
        </TabsContent>
        
        <TabsContent value="exercises">
          <ExerciseTable />
        </TabsContent>

        <TabsContent value="food-suggestions">
          <FoodSuggestionsTable />
        </TabsContent>

        <TabsContent value="styles">
          <StylesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;