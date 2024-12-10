import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NutritionalCell } from "./NutritionalCell";
import { ActionButtons } from "./ActionButtons";

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
                <NutritionalCell 
                  value={suggestion.calories} 
                  type="calories" 
                  unit="kcal" 
                />
              </TableCell>
              <TableCell>
                <NutritionalCell 
                  value={suggestion.proteins} 
                  type="proteins" 
                />
              </TableCell>
              <TableCell>
                <NutritionalCell 
                  value={suggestion.carbs} 
                  type="carbs" 
                />
              </TableCell>
              <TableCell>
                <NutritionalCell 
                  value={suggestion.fats} 
                  type="fats" 
                />
              </TableCell>
              <TableCell>{suggestion.category}</TableCell>
              <TableCell className="space-x-2">
                <ActionButtons
                  onApprove={() => handleApprove(suggestion)}
                  onReject={() => handleReject(suggestion.id)}
                />
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