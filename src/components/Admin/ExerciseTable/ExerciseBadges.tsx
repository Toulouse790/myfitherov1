import { Badge } from "@/components/ui/badge";

interface ExerciseBadgesProps {
  difficulties: string[];
  locations: string[];
}

const difficultyTranslations: { [key: string]: string } = {
  "beginner": "débutant",
  "intermediate": "intermédiaire",
  "advanced": "avancé"
};

const locationTranslations: { [key: string]: string } = {
  "home": "maison",
  "gym": "salle",
  "outdoor": "extérieur"
};

export const ExerciseBadges = ({ difficulties, locations }: ExerciseBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {difficulties.map((difficulty) => (
        <Badge key={difficulty} variant="secondary" className="capitalize">
          {difficultyTranslations[difficulty] || difficulty}
        </Badge>
      ))}
      {locations?.map((location) => (
        <Badge key={location} variant="outline" className="capitalize">
          {locationTranslations[location] || location}
        </Badge>
      ))}
    </div>
  );
};