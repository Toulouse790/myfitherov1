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
              <div>
                <h3 className="font-semibold text-lg">{entry.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {entry.calories}cal | {entry.proteins}g protéines
                </p>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center text-gray-500">
          Aucun aliment ajouté
        </div>
      )}
    </div>
  );
};