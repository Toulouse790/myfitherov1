import { Header } from "@/components/Layout/Header";
import { GenerateWorkoutDialog } from "@/components/Dashboard/WorkoutSuggestions/GenerateWorkoutDialog";

export default function WorkoutGenerate() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4">
        <GenerateWorkoutDialog 
          open={true} 
          onOpenChange={() => {}} 
        />
      </div>
    </div>
  );
}