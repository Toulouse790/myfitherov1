import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Dumbbell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { Header } from "@/components/Layout/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenerateWorkoutDialog } from "@/components/Dashboard/WorkoutSuggestions/GenerateWorkoutDialog";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAIDialog, setShowAIDialog] = useState(false);

  const handleCreateWorkout = () => {
    navigate('/workouts');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <AppSidebar />
        <div className="md:pl-64">
          <div className="container max-w-4xl mx-auto p-4 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Bienvenue sur ton espace</h1>
              <p className="text-muted-foreground">
                Comment souhaites-tu démarrer ton entraînement aujourd'hui ?
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
              <Card 
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                onClick={handleCreateWorkout}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Créer ta séance</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sélectionne tes exercices et compose ton programme sur mesure
                    </p>
                  </div>
                </div>
              </Card>

              <Card 
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                onClick={() => setShowAIDialog(true)}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Laisse-moi t'accompagner</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Notre IA analyse ton profil et te propose un programme adapté
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <GenerateWorkoutDialog 
          open={showAIDialog} 
          onOpenChange={setShowAIDialog}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;