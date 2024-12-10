import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FoodSuggestion {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  category: string;
  status: string;
}

// Valeurs nutritionnelles de référence (pour 100g)
const NUTRITIONAL_RANGES = {
  proteins: { min: 0, max: 100, warning: 50 }, // g
  carbs: { min: 0, max: 100, warning: 75 }, // g
  fats: { min: 0, max: 100, warning: 40 }, // g
  calories: { min: 0, max: 900, warning: 500 }, // kcal
};

export const FoodSuggestionsTable = () => {
  const [suggestions, setSuggestions] = useState<FoodSuggestion[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadSuggestions = async () => {
      const { data, error } = await supabase
        .from('user_suggested_foods')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading suggestions:', error);
        return;
      }

      setSuggestions(data);
    };

    loadSuggestions();
  }, []);

  const handleApprove = async (suggestion: FoodSuggestion) => {
    try {
      // Ajouter à la table common_foods
      const { error: insertError } = await supabase
        .from('common_foods')
        .insert([{
          name: suggestion.name,
          calories: suggestion.calories,
          proteins: suggestion.proteins,
          carbs: suggestion.carbs,
          fats: suggestion.fats,
          food_category: suggestion.category,
        }]);

      if (insertError) throw insertError;

      // Mettre à jour le statut dans user_suggested_foods
      const { error: updateError } = await supabase
        .from('user_suggested_foods')
        .update({ status: 'approved' })
        .eq('id', suggestion.id);

      if (updateError) throw updateError;

      toast({
        title: "Suggestion approuvée",
        description: `${suggestion.name} a été ajouté à la base de données`,
      });

      setSuggestions(prev => 
        prev.map(s => 
          s.id === suggestion.id ? { ...s, status: 'approved' } : s
        )
      );
    } catch (error) {
      console.error('Error approving suggestion:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'approuver la suggestion",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_suggested_foods')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Suggestion rejetée",
        description: "La suggestion a été rejetée",
      });

      setSuggestions(prev => 
        prev.map(s => 
          s.id === id ? { ...s, status: 'rejected' } : s
        )
      );
    } catch (error) {
      console.error('Error rejecting suggestion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la suggestion",
        variant: "destructive",
      });
    }
  };

  const isValueSuspicious = (value: number, type: keyof typeof NUTRITIONAL_RANGES) => {
    const range = NUTRITIONAL_RANGES[type];
    return value < range.min || value > range.warning;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Suggestions d'aliments</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Calories</TableHead>
            <TableHead>Protéines</TableHead>
            <TableHead>Glucides</TableHead>
            <TableHead>Lipides</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suggestions.map((suggestion) => (
            <TableRow key={suggestion.id}>
              <TableCell>{suggestion.name}</TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      {suggestion.calories}
                      {isValueSuspicious(suggestion.calories, 'calories') && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Valeurs typiques: 0-500 kcal/100g</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      {suggestion.proteins}g
                      {isValueSuspicious(suggestion.proteins, 'proteins') && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Valeurs typiques: 0-50g/100g</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      {suggestion.carbs}g
                      {isValueSuspicious(suggestion.carbs, 'carbs') && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Valeurs typiques: 0-75g/100g</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      {suggestion.fats}g
                      {isValueSuspicious(suggestion.fats, 'fats') && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Valeurs typiques: 0-40g/100g</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{suggestion.category}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleApprove(suggestion)}
                  className="text-green-600 hover:text-green-700"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleReject(suggestion.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {suggestions.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                Aucune suggestion en attente
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};