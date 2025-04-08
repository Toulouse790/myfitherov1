
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MealSuggestionCard } from "./MealSuggestionCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { VerifyDbConnection } from "./VerifyDbConnection";

export const PopularMealSuggestions = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    dietTypes: [] as string[],
    mealType: null as string | null
  });
  const { t } = useLanguage();
  
  const { data: suggestions, isLoading, error } = useQuery({
    queryKey: ['popular-meal-suggestions', filters],
    queryFn: async () => {
      console.log("Fetching meal suggestions with filters:", filters);
      let query = supabase
        .from('meal_suggestions')
        .select('*');
      
      // Filtrer par type de régime si des filtres sont sélectionnés
      if (filters.dietTypes.length > 0) {
        query = query.contains('diet_types', filters.dietTypes);
      }
      
      // Filtrer par type de repas si sélectionné
      if (filters.mealType) {
        query = query.eq('meal_type', filters.mealType);
      }
      
      const { data, error } = await query.order('rating', { ascending: false });

      if (error) {
        console.error("Erreur lors du chargement des suggestions:", error);
        throw error;
      }
      
      console.log("Suggestions loaded:", data?.length || 0);
      return data;
    }
  });

  const handleAddToMealPlan = async (suggestion: any) => {
    try {
      // Ici, nous pourrions implémenter l'ajout au plan de repas
      toast({
        title: "Recette ajoutée",
        description: `${suggestion.name} a été ajouté à votre plan de repas`,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout au plan:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter cette recette à votre plan",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (key: 'dietTypes' | 'mealType', value: string) => {
    if (key === 'dietTypes') {
      setFilters(prev => {
        const exists = prev.dietTypes.includes(value);
        return {
          ...prev,
          dietTypes: exists 
            ? prev.dietTypes.filter(t => t !== value)
            : [...prev.dietTypes, value]
        };
      });
    } else {
      setFilters(prev => ({
        ...prev,
        mealType: prev.mealType === value ? null : value
      }));
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="p-4 text-center text-red-500 bg-red-50 border border-red-200 rounded">
          Une erreur est survenue lors du chargement des suggestions.
          <pre className="mt-2 text-xs bg-white p-2 rounded">{String(error)}</pre>
        </div>
        <VerifyDbConnection />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Suggestions populaires</h2>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Régimes alimentaires</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['vegetarian', 'vegan', 'pescatarian', 'omnivore'].map(diet => (
                <DropdownMenuCheckboxItem
                  key={diet}
                  checked={filters.dietTypes.includes(diet)}
                  onCheckedChange={() => handleFilterChange('dietTypes', diet)}
                >
                  {diet === 'vegetarian' ? 'Végétarien' : 
                   diet === 'vegan' ? 'Végétalien' : 
                   diet === 'pescatarian' ? 'Pescatérien' : 'Omnivore'}
                </DropdownMenuCheckboxItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Type de repas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => (
                <DropdownMenuCheckboxItem
                  key={mealType}
                  checked={filters.mealType === mealType}
                  onCheckedChange={() => handleFilterChange('mealType', mealType)}
                >
                  {mealType === 'breakfast' ? 'Petit déjeuner' : 
                   mealType === 'lunch' ? 'Déjeuner' : 
                   mealType === 'dinner' ? 'Dîner' : 'Collation'}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Afficher les filtres actifs */}
      {(filters.dietTypes.length > 0 || filters.mealType) && (
        <div className="flex flex-wrap gap-2">
          {filters.dietTypes.map(diet => (
            <Badge 
              key={diet} 
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleFilterChange('dietTypes', diet)}
            >
              {diet === 'vegetarian' ? 'Végétarien' : 
               diet === 'vegan' ? 'Végétalien' : 
               diet === 'pescatarian' ? 'Pescatérien' : 'Omnivore'} ×
            </Badge>
          ))}
          {filters.mealType && (
            <Badge 
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleFilterChange('mealType', filters.mealType!)}
            >
              {filters.mealType === 'breakfast' ? 'Petit déjeuner' : 
               filters.mealType === 'lunch' ? 'Déjeuner' : 
               filters.mealType === 'dinner' ? 'Dîner' : 'Collation'} ×
            </Badge>
          )}
          
          <Badge 
            variant="outline"
            className="cursor-pointer"
            onClick={() => setFilters({ dietTypes: [], mealType: null })}
          >
            Effacer tous les filtres
          </Badge>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[400px] bg-muted rounded-lg" />
          ))}
        </div>
      ) : suggestions?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {suggestions.map((suggestion) => (
            <MealSuggestionCard
              key={suggestion.id}
              name={suggestion.name}
              calories={suggestion.calories}
              proteins={suggestion.proteins}
              carbs={suggestion.carbs}
              fats={suggestion.fats}
              cookingTime={suggestion.cooking_time_minutes}
              difficulty={suggestion.difficulty_level}
              servings={suggestion.servings}
              rating={suggestion.rating}
              tags={suggestion.tags}
              imageUrl={suggestion.image_url}
              actionButton={
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleAddToMealPlan(suggestion)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ajouter au plan
                </Button>
              }
            />
          ))}
        </div>
      ) : (
        <div>
          <div className="col-span-full text-center p-8 border rounded-lg bg-gray-50">
            Aucune suggestion ne correspond à vos critères. Essayez de modifier les filtres.
          </div>
          <div className="mt-8">
            <VerifyDbConnection />
          </div>
        </div>
      )}
    </div>
  );
};
