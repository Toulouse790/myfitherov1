import { Badge } from "@/components/ui/badge";

interface LocationBadgesProps {
  locations: string[];
  selectedLocations: string[];
  onLocationChange?: (location: string, checked: boolean) => void;
}

export const LocationBadges = ({
  locations,
  selectedLocations,
  onLocationChange,
}: LocationBadgesProps) => {
  return (
    <div className="flex gap-2">
      {locations.map((location) => (
        <Badge
          key={location}
          variant={selectedLocations.includes(location) ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onLocationChange?.(location, !selectedLocations.includes(location))}
        >
          {location}
        </Badge>
      ))}
    </div>
  );
};