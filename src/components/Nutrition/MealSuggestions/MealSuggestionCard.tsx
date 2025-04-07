
import { Card } from "@/components/ui/card";
import { Clock, ChefHat, Users, Star, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MealSuggestionCardProps {
  name: string;
  calories: number;
  proteins: number;
  cookingTime: number;
  difficulty: string;
  servings: number;
  rating?: number;
  tags?: string[];
  imageUrl?: string;
  actionButton?: React.ReactNode;
  carbs?: number;
  fats?: number;
}

export const MealSuggestionCard = ({
  name,
  calories,
  proteins,
  cookingTime,
  difficulty,
  servings,
  rating,
  tags,
  imageUrl,
  actionButton,
  carbs,
  fats
}: MealSuggestionCardProps) => {
  const difficultyColor = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800"
  }[difficulty] || "bg-gray-100 text-gray-800";

  const defaultImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl || defaultImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className={difficultyColor}>
            {difficulty}
          </Badge>
        </div>
        {rating && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {cookingTime} min
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {servings} pers.
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <ChefHat className="w-4 h-4" />
                  {calories} kcal
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p>Protéines: {proteins}g</p>
                  {carbs !== undefined && <p>Glucides: {carbs}g</p>}
                  {fats !== undefined && <p>Lipides: {fats}g</p>}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center gap-2">
            <span className="font-medium">P:</span> {proteins}g
          </div>
        </div>

        {actionButton && (
          <div className="mt-2">
            {actionButton}
          </div>
        )}
      </div>
    </Card>
  );
};
