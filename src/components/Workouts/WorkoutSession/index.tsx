
import { Header } from "@/components/Layout/Header";
import { ExerciseList } from "./ExerciseList";
import { useLanguage } from "@/contexts/LanguageContext";

export const WorkoutSession = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-6">{t("workouts.todayProgram")}</h1>
        <ExerciseList />
      </div>
    </div>
  );
};
