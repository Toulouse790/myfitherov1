import { Header } from "@/components/Layout/Header";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { Brain, Activity, BarChart3, Dumbbell } from "lucide-react";
import { SuggestionCard } from "@/components/Dashboard/DashboardCard/SuggestionCard";

const suggestions = [
  {
    to: "/workouts/generate",
    icon: Brain,
    title: "Créer ma séance",
    description: "Construisez votre séance personnalisée en choisissant parmi notre bibliothèque d'exercices",
    isPrimary: true
  },
  {
    to: "/workouts",
    icon: Dumbbell,
    title: "Laisse-moi faire",
    description: "Générez automatiquement une séance adaptée à votre historique d'entraînement"
  },
  {
    to: "/cardio",
    icon: Activity,
    title: "Cardio",
    description: "Choisissez parmi différents types d'exercices cardio pour votre entraînement"
  },
  {
    to: "/stats",
    icon: BarChart3,
    title: "Statistiques",
    description: "Suivez vos progrès et analysez vos performances d'entraînement"
  }
];

export default function Index() {
  return (
    <Header>
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {suggestions.map((suggestion, index) => (
            <SuggestionCard
              key={suggestion.to}
              {...suggestion}
            />
          ))}
        </div>

        <div className="mt-4 sm:mt-6">
          <WorkoutSuggestions />
        </div>
      </div>
    </Header>
  );
}