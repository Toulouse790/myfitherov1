import { Check, X, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealContentProps } from "./types";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

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
    <div className="space-y-4 p-4">
      {mealEntries.length > 0 ? (
        mealEntries.map((entry) => (
          <Card key={entry.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{entry.name}</h3>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {entry.calories} kcal | {entry.proteins}g protéines
                  </p>
                  {entry.carbs !== undefined && entry.fats !== undefined && (
                    <p className="text-sm text-muted-foreground">
                      {entry.carbs}g glucides | {entry.fats}g lipides
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
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
          </Card>
        ))
      ) : generatedMeal ? (
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {generatedMeal.calories} kcal | {generatedMeal.proteins}g protéines
              </p>
              {generatedMeal.carbs !== undefined && generatedMeal.fats !== undefined && (
                <p className="text-sm text-muted-foreground">
                  {generatedMeal.carbs}g glucides | {generatedMeal.fats}g lipides
                </p>
              )}
              {generatedMeal.quantities && generatedMeal.quantities.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-1">Ingrédients :</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {generatedMeal.quantities.map((item, index) => (
                      <li key={index}>
                        {item.item}: {item.amount}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500"
                >
                  <Edit className="h-4 w-4" />
                </Button>
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
          <div className="flex gap-2 justify-end mt-4">
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
        </Card>
      ) : (
        <div className="text-center text-gray-500">
          Aucun repas suggéré
        </div>
      )}
    </div>
  );
};