
import { Header } from "@/components/Layout/Header";
import { ExerciseList } from "./ExerciseList";
import { useLanguage } from "@/contexts/LanguageContext";

export const WorkoutSession = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div>
        <ExerciseList />
      </div>
    </div>
  );
};
