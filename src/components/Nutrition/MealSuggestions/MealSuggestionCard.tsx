import { Card } from "@/components/ui/card";
import { Clock, ChefHat, Users, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MealSuggestionCardProps {
  name: string;
  calories: number;
  proteins: number;
  cookingTime: number;
  difficulty: string;
  servings: number;
  rating?: number;
  tags?: string[];
}

export const MealSuggestionCard = ({
  name,
  calories,
  proteins,
  cookingTime,
  difficulty,
  servings,
  rating,
  tags
}: MealSuggestionCardProps) => {
  const difficultyColor = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800"
  }[difficulty] || "bg-gray-100 text-gray-800";

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className={difficultyColor}>
            {difficulty}
          </Badge>
        </div>
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
          <div className="flex items-center gap-2">
            <ChefHat className="w-4 h-4" />
            {calories} kcal
          </div>
        </div>

        {rating && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Card>
  );
};