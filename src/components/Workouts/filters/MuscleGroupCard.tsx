import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface MuscleGroupCardProps {
  id: string;
  name: string;
  image: string;
  isSelected: boolean;
  onClick: () => void;
}

export const MuscleGroupCard = ({ id, name, image, isSelected, onClick }: MuscleGroupCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-colors hover:bg-accent overflow-hidden ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <AspectRatio ratio={3/2}>
          <img 
            src={image} 
            alt={name}
            className="object-cover w-full h-full brightness-75"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs sm:text-sm font-medium text-white drop-shadow-lg">
              {name}
            </p>
          </div>
        </AspectRatio>
      </CardContent>
    </Card>
  );
};