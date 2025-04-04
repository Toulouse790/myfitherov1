
import { Card } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { fr, enUS, de, es } from "date-fns/locale";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  calories: number;
}

interface WorkoutCardProps {
  workout: {
    title: string;
    muscleGroup: string;
    exercises: Exercise[];
    totalCalories: number;
  };
}

export const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  const { t, language } = useLanguage();
  
  // Sélectionner la locale appropriée selon la langue actuelle
  const getDateLocale = () => {
    switch (language) {
      case "fr": return fr;
      case "en": return enUS;
      case "de": return de;
      case "es": return es;
      default: return fr;
    }
  };

  // Formater la date selon la langue actuelle
  const formattedDate = format(new Date(), 'PPP', { locale: getDateLocale() });
  
  return (
    <Card 
      className="bg-[#2A2F3F] p-3 transition-all duration-200 hover:bg-[#343B4F] hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="space-y-2">
        <div className="rounded-full bg-[#1E2330] w-10 h-10 flex items-center justify-center">
          <Dumbbell className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-white font-medium text-sm sm:text-base">
          {t("workouts.trainingOf")} {formattedDate}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
          {workout.muscleGroup} • {workout.exercises.length} {t("workouts.exercises")} • {workout.totalCalories} {t("workouts.kcal")}
        </p>
      </div>
    </Card>
  );
};

