
import { Header } from "@/components/Layout/Header";
import { WorkoutSession } from "@/components/Workouts/WorkoutSession";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WorkoutSessionPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4">
        <WorkoutSession />
      </div>
    </div>
  );
}
