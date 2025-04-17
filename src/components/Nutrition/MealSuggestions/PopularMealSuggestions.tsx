
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { Skeleton } from "@/components/ui/skeleton";
import { MealSuggestionCard } from "./MealSuggestionCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealSuggestion {
  id: string;
  name: string;
  description: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  image_url?: string;
  meal_type: string;
  popularity: number;
}

export const PopularMealSuggestions = () => {
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedMealType, setSelectedMealType] = useState<string>("all");

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        debugLogger.log("PopularMealSuggestions", "Fetching meal suggestions");
        
        const { data, error } = await supabase
          .from("meal_suggestions")
          .select("*")
          .order("popularity", { ascending: false })
          .limit(12);
          
        if (error) throw error;
        
        setSuggestions(data || []);
        debugLogger.log("PopularMealSuggestions", `Fetched ${data?.length || 0} suggestions`);
      } catch (error) {
        debugLogger.error("PopularMealSuggestions", "Failed to fetch meal suggestions", error);
        toast({
          title: t("common.error"),
          description: t("nutrition.failedToFetchSuggestions", { fallback: "Impossible de récupérer les suggestions de repas" }),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [toast, t]);

  const mealTypes = [
    { value: "all", label: t("common.all") },
    { value: "breakfast", label: t("nutrition.mealTypes.breakfast") },
    { value: "lunch", label: t("nutrition.mealTypes.lunch") },
    { value: "dinner", label: t("nutrition.mealTypes.dinner") },
    { value: "snack", label: t("nutrition.mealTypes.morning_snack", { fallback: "Collation" }) }
  ];

  const filteredSuggestions = selectedMealType === "all" 
    ? suggestions 
    : suggestions.filter(s => s.meal_type === selectedMealType);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("nutrition.suggestions")}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {mealTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedMealType === type.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMealType(type.value)}
              className="text-xs sm:text-sm"
            >
              {type.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video w-full">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSuggestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuggestions.map((suggestion) => (
              <MealSuggestionCard 
                key={suggestion.id} 
                suggestion={suggestion} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {t("nutrition.noSuggestionsFound", { fallback: "Aucune suggestion trouvée pour cette catégorie" })}
            </p>
            <Button onClick={() => setSelectedMealType("all")}>
              {t("nutrition.showAllSuggestions", { fallback: "Afficher toutes les suggestions" })}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
