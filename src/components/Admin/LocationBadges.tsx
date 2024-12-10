import { Badge } from "@/components/ui/badge";
import { MapPin, Home, Building2, TreePine } from "lucide-react";

interface LocationBadgesProps {
  locations: string[];
  selectedLocations: string[];
  onLocationChange?: (location: string, checked: boolean) => void;
}

const locationTranslations: { [key: string]: string } = {
  "home": "maison",
  "gym": "salle",
  "outdoor": "extérieur"
};

const locationIcons: { [key: string]: React.ReactNode } = {
  "home": <Home className="w-3 h-3 mr-1" />,
  "gym": <Building2 className="w-3 h-3 mr-1" />,
  "outdoor": <TreePine className="w-3 h-3 mr-1" />
};

export const LocationBadges = ({
  locations,
  selectedLocations,
  onLocationChange,
}: LocationBadgesProps) => {
  const handleClick = (location: string) => {
    const isSelected = selectedLocations.includes(location);
    console.log('Location badge clicked:', {
      location,
      isSelected,
      currentSelection: selectedLocations
    });
    onLocationChange?.(location, !isSelected);
  };

  return (
    <div className="flex gap-2 flex-wrap flex-1">
      {locations.map((location) => (
        <Badge
          key={location}
          variant={selectedLocations.includes(location) ? "default" : "outline"}
          className={`cursor-pointer flex items-center ${
            selectedLocations.includes(location)
              ? "bg-[#0EA5E9] hover:bg-[#0284C7]"
              : "border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white"
          }`}
          onClick={() => handleClick(location)}
        >
          {locationIcons[location]}
          {locationTranslations[location] || location}
        </Badge>
      ))}
    </div>
  );
};