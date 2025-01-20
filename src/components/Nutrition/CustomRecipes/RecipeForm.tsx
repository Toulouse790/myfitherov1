import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export const RecipeForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", amount: "", unit: "g" }]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", unit: "g" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase.from("custom_recipes").insert({
        user_id: user.id,
        name,
        description,
        ingredients: ingredients.filter(ing => ing.name && ing.amount),
        instructions: instructions.filter(inst => inst),
        is_public: false,
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La recette a été enregistrée",
      });

      // Reset form
      setName("");
      setDescription("");
      setIngredients([{ name: "", amount: "", unit: "g" }]);
      setInstructions([""]);
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la recette",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nom de la recette</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Salade de quinoa aux légumes"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez votre recette en quelques mots"
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium">Ingrédients</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                placeholder="Ingrédient"
                className="flex-1"
              />
              <Input
                type="number"
                value={ingredient.amount}
                onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                placeholder="Quantité"
                className="w-24"
              />
              <Input
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                placeholder="Unité"
                className="w-20"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveIngredient(index)}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddIngredient}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un ingrédient
          </Button>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium">Instructions</label>
          {instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                placeholder={`Étape ${index + 1}`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveInstruction(index)}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddInstruction}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une instruction
          </Button>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer la recette"}
        </Button>
      </form>
    </Card>
  );
};