import { Check, X, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealContentProps } from "./types";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const MealContent = ({ mealEntries, generatedMeal, onMealStatus, type }: MealContentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMeal, setEditedMeal] = useState(generatedMeal);
  const { toast } = useToast();

  const handleSaveMeal = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('meal_plans')
        .update({
          [`plan_data:${type}`]: editedMeal
        })
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      toast({
        title: "Repas modifié",
        description: "Le repas a été mis à jour avec succès",
      });

      // Instead of using refetchMealPlan, we'll reload the page
      window.location.reload();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving meal:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le repas",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMeal = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('meal_plans')
        .update({
          [`plan_data:${type}`]: null
        })
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      toast({
        title: "Repas supprimé",
        description: "Le repas a été supprimé avec succès",
      });

      // Instead of using refetchMealPlan, we'll reload the page
      window.location.reload();
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le repas",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="pl-4 pr-2 py-2">
      {mealEntries.length > 0 ? (
        mealEntries.map((entry) => (
          <div
            key={entry.id}
            className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100/50 transition-colors"
          >
            <div className="font-medium text-gray-800">{entry.name}</div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onMealStatus('skipped')}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onMealStatus('taken')}
                className="text-green-500 hover:text-green-600 hover:bg-green-50"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
            {entry.notes && (
              <p className="mt-2 text-sm text-muted-foreground italic">
                {entry.notes}
              </p>
            )}
          </div>
        ))
      ) : generatedMeal ? (
        <div>
          <div className="p-3 rounded-lg bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="font-medium">{generatedMeal.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {generatedMeal.calories} kcal | {generatedMeal.proteins}g protéines
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-500">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Modifier le repas</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Nom du repas</Label>
                        <Input 
                          value={editedMeal?.name || ''} 
                          onChange={(e) => setEditedMeal(prev => ({...prev!, name: e.target.value}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Calories (kcal)</Label>
                        <Input 
                          type="number"
                          value={editedMeal?.calories || 0}
                          onChange={(e) => setEditedMeal(prev => ({...prev!, calories: parseInt(e.target.value)}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Protéines (g)</Label>
                        <Input 
                          type="number"
                          value={editedMeal?.proteins || 0}
                          onChange={(e) => setEditedMeal(prev => ({...prev!, proteins: parseInt(e.target.value)}))}
                        />
                      </div>
                      <Button onClick={handleSaveMeal} className="w-full">
                        Sauvegarder
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteMeal}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {generatedMeal.quantities && generatedMeal.quantities.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-sm font-medium text-gray-700">Ingrédients :</p>
                <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                  {generatedMeal.quantities.map((item, index) => (
                    <li key={index}>
                      {item.item}: {item.amount}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMealStatus('skipped')}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMealStatus('taken')}
              className="text-green-500 hover:text-green-600 hover:bg-green-50"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-2">
          Aucun repas suggéré
        </div>
      )}
    </div>
  );
};