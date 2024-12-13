import { Badge } from "@/components/ui/badge";

interface LocationBadgesProps {
  locations: string[];
  onLocationChange?: (location: string, checked: boolean) => void;
  selectedLocations: string[];
}

const locationTranslations: { [key: string]: string } = {
  "home": "maison",
  "gym": "salle",
  "outdoor": "extérieur"
};

export const LocationBadges = ({
  locations,
  onLocationChange,
  selectedLocations,
}: LocationBadgesProps) => {
  const handleClick = (location: string) => {
    const isSelected = selectedLocations.includes(location);
    onLocationChange?.(location, !isSelected);
  };

  return (
    <div className="flex gap-2 flex-wrap flex-1">
      {locations.map((location) => (
        <Badge
          key={location}
          variant={selectedLocations.includes(location) ? "default" : "outline"}
          className={`cursor-pointer ${
            selectedLocations.includes(location)
              ? "bg-[#9b87f5] hover:bg-[#7E69AB]"
              : "border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-white"
          }`}
          onClick={() => handleClick(location)}
        >
          {locationTranslations[location] || location}
        </Badge>
      ))}
    </div>
  );
};