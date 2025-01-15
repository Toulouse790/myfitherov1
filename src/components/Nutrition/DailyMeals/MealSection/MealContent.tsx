import { Edit } from "lucide-react";
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
                    {entry.calories}cal | {entry.proteins}g
                  </p>
                  {entry.carbs !== undefined && entry.fats !== undefined && (
                    <p className="text-sm text-muted-foreground">
                      {entry.carbs}g gluc. | {entry.fats}g lip.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))
      ) : generatedMeal ? (
        <Card className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {generatedMeal.calories}cal | {generatedMeal.proteins}g
                </p>
                {generatedMeal.carbs !== undefined && generatedMeal.fats !== undefined && (
                  <p className="text-sm text-muted-foreground">
                    {generatedMeal.carbs}g gluc. | {generatedMeal.fats}g lip.
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
            </div>
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