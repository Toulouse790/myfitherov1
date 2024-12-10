import { Badge } from "@/components/ui/badge";

interface ExerciseBadgesProps {
  difficulties: string[];
  locations: string[];
}

export const ExerciseBadges = ({ difficulties, locations }: ExerciseBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {difficulties.map((difficulty) => (
        <Badge key={difficulty} variant="secondary" className="capitalize">
          {difficulty}
        </Badge>
      ))}
      {locations?.map((location) => (
        <Badge key={location} variant="outline" className="capitalize">
          {location}
        </Badge>
      ))}
    </div>
  );
};