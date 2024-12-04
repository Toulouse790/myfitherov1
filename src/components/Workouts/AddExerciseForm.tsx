import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { muscleGroups } from "./workoutConstants";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddExerciseFormProps {
  onSuccess: () => void;
}

export const AddExerciseForm = ({ onSuccess }: AddExerciseFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    muscleGroup: "",
    image: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('exercise-media')
          .upload(filePath, formData.image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('exercise-media')
          .getPublicUrl(filePath);

        await supabase.from('exercise_media').insert({
          exercise_name: formData.name,
          media_type: 'image',
          media_url: publicUrl
        });
      }

      onSuccess();
      toast({
        title: "Exercice ajouté avec succès",
        description: "Votre nouvel exercice a été ajouté à la bibliothèque d'exercices",
      });
    } catch (error) {
      toast({
        title: "Erreur lors de l'ajout",
        description: "Une erreur est survenue lors de l'ajout de l'exercice. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom complet de l'exercice</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Exemple: Développé couché avec haltères"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description détaillée de l'exercice</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Décrivez les étapes d'exécution de l'exercice et les points importants à respecter"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="muscleGroup">Groupe musculaire principal ciblé</Label>
        <Select
          value={formData.muscleGroup}
          onValueChange={(value) => setFormData(prev => ({ ...prev, muscleGroup: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez le groupe musculaire principal" />
          </SelectTrigger>
          <SelectContent>
            {muscleGroups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image démonstrative de l'exercice</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
        />
        <p className="text-sm text-muted-foreground">
          Ajoutez une image claire montrant la position correcte pour cet exercice
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Ajout de l'exercice en cours..." : "Ajouter cet exercice"}
      </Button>
    </form>
  );
};