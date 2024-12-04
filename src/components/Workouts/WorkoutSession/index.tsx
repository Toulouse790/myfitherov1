import { AppSidebar } from "@/components/Layout/AppSidebar";
import { Header } from "@/components/Layout/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ExerciseList } from "./ExerciseList";

export const WorkoutSession = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <AppSidebar />
        <div className="md:pl-64">
          <ExerciseList />
        </div>
      </div>
    </SidebarProvider>
  );
};