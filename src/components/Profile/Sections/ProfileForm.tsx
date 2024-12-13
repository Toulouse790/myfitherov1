import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileFormProps {
  initialData: {
    birth_date?: string;
    gender?: string;
    height_cm?: number;
    weight_kg?: number;
  };
  onUpdate: () => void;
}

export const ProfileForm = ({ initialData, onUpdate }: ProfileFormProps) => {
  const [birthDate, setBirthDate] = useState(initialData.birth_date || "");
  const [gender, setGender] = useState(initialData.gender || "");
  const [height, setHeight] = useState(initialData.height_cm?.toString() || "");
  const [weight, setWeight] = useState(initialData.weight_kg?.toString() || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        birth_date: birthDate || null,
        gender: gender || null,
        height_cm: height ? parseFloat(height) : null,
        weight_kg: weight ? parseFloat(weight) : null,
      })
      .eq('id', (await supabase.auth.getUser()).data.user?.id);

    setIsLoading(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Profil mis à jour avec succès",
    });
    
    onUpdate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="birthDate">Date de naissance</Label>
        <Input
          id="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Genre</Label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez votre genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Homme</SelectItem>
            <SelectItem value="female">Femme</SelectItem>
            <SelectItem value="other">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="height">Taille (cm)</Label>
        <Input
          id="height"
          type="number"
          min="0"
          max="300"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Entrez votre taille en cm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="weight">Poids (kg)</Label>
        <Input
          id="weight"
          type="number"
          min="0"
          max="500"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Entrez votre poids en kg"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Mise à jour..." : "Mettre à jour le profil"}
      </Button>
    </form>
  );
};