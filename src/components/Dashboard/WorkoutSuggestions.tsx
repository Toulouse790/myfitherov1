import { Card } from "@/components/ui/card";
import { Sparkles, Activity, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  age: number;
  weight: number;
  height: number;
  goal: "weight_loss" | "muscle_gain" | "maintenance";
  workoutsPerWeek: number;
  dailyCalories: number;
  recoveryCapacity: "low" | "medium" | "high";
}

const generateWorkoutPlan = (profile: UserProfile) => {
  // Calcul de l'intensité en fonction de l'âge et de la capacité de récupération
  const getIntensity = () => {
    const baseIntensity = profile.recoveryCapacity === "high" ? 0.8 : 
                         profile.recoveryCapacity === "medium" ? 0.7 : 0.6;
    return profile.age > 50 ? baseIntensity * 0.8 : baseIntensity;
  };

  // Calcul du volume en fonction des calories et des jours d'entraînement
  const getVolume = () => {
    const baseVolume = Math.floor(profile.dailyCalories / 200); // ~1 set pour 200 calories
    const weeklyAdjustment = 1 + (profile.workoutsPerWeek / 10);
    return Math.floor(baseVolume * weeklyAdjustment);
  };

  // Sélection des exercices en fonction de l'objectif
  const getExerciseTypes = () => {
    switch(profile.goal) {
      case "weight_loss":
        return {
          compound: 0.7, // 70% exercices composés
          isolation: 0.3, // 30% exercices d'isolation
          cardio: true
        };
      case "muscle_gain":
        return {
          compound: 0.6,
          isolation: 0.4,
          cardio: false
        };
      default:
        return {
          compound: 0.5,
          isolation: 0.5,
          cardio: true
        };
    }
  };

  const intensity = getIntensity();
  const volume = getVolume();
  const exerciseTypes = getExerciseTypes();

  return {
    intensity,
    volume,
    exerciseTypes,
    recommendedRest: profile.recoveryCapacity === "high" ? 60 : 
                    profile.recoveryCapacity === "medium" ? 90 : 120,
  };
};

const mockUserProfile: UserProfile = {
  age: 30,
  weight: 75,
  height: 175,
  goal: "muscle_gain",
  workoutsPerWeek: 4,
  dailyCalories: 2500,
  recoveryCapacity: "medium"
};

export const WorkoutSuggestions = () => {
  const { toast } = useToast();

  const handleGenerateWorkout = () => {
    const plan = generateWorkoutPlan(mockUserProfile);
    
    toast({
      title: "Programme généré avec succès",
      description: `Un programme adapté à votre profil a été créé avec ${plan.volume} séries au total, une intensité de ${Math.round(plan.intensity * 100)}% et ${plan.recommendedRest}s de repos entre les séries.`,
    });
  };

  const suggestions = [
    {
      title: "Personnalisé",
      description: "Laissez notre IA vous aider à créer un entraînement",
      icon: <Sparkles className="w-6 h-6 text-white" />,
      bgColor: "bg-[#2A2F3F]",
      onClick: handleGenerateWorkout
    },
    {
      title: "Cardio",
      description: "Enregistrer une séance de cardio",
      icon: <Activity className="w-6 h-6 text-white" />,
      bgColor: "bg-[#2A2F3F]"
    },
    {
      title: "Favoris",
      description: "Choisi parmi vos entraînements sauvegardés",
      icon: <Bookmark className="w-6 h-6 text-white" />,
      bgColor: "bg-[#2A2F3F]"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Envie de quelque chose de différent?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {suggestions.map((suggestion, index) => (
          <Card 
            key={index}
            className={`${suggestion.bgColor} p-4 cursor-pointer hover:opacity-90 transition-opacity`}
            onClick={suggestion.onClick}
          >
            <div className="space-y-2">
              <div className="rounded-full bg-[#1E2330] w-12 h-12 flex items-center justify-center">
                {suggestion.icon}
              </div>
              <h3 className="text-white font-medium">{suggestion.title}</h3>
              <p className="text-gray-400 text-sm">{suggestion.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};