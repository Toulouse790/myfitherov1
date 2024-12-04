import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Location {
  id: string;
  name: string;
}

interface Difficulty {
  id: string;
  name: string;
}

const locations: Location[] = [
  { id: "gym", name: "Salle" },
  { id: "home", name: "Maison" },
  { id: "outdoor", name: "Extérieur" }
];

const difficulties: Difficulty[] = [
  { id: "beginner", name: "Débutant" },
  { id: "intermediate", name: "Intermédiaire" },
  { id: "advanced", name: "Avancé" }
];

export const ExerciseTable = () => {
  const { toast } = useToast();
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);

  const handleLocationChange = async (exerciseId: string, location: string, checked: boolean) => {
    try {
      const exercise = exercises.find(e => e.id === exerciseId);
      if (!exercise) return;

      const newLocations = checked 
        ? [...(exercise.location || []), location]
        : (exercise.location || []).filter((l: string) => l !== location);

      const { error } = await supabase
        .from('exercises')
        .update({ location: newLocations })
        .eq('id', exerciseId);

      if (error) throw error;

      setExercises(exercises.map(e => 
        e.id === exerciseId ? { ...e, location: newLocations } : e
      ));

      toast({
        title: "Mise à jour réussie",
        description: "Les lieux d'entraînement ont été mis à jour",
      });
    } catch (error) {
      console.error('Error updating exercise locations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les lieux d'entraînement",
        variant: "destructive",
      });
    }
  };

  const handleDifficultyChange = async (exerciseId: string, difficulty: string, checked: boolean) => {
    try {
      const exercise = exercises.find(e => e.id === exerciseId);
      if (!exercise) return;

      const newDifficulties = checked
        ? [...(exercise.difficulty || []), difficulty]
        : (exercise.difficulty || []).filter((d: string) => d !== difficulty);

      const { error } = await supabase
        .from('exercises')
        .update({ difficulty: newDifficulties })
        .eq('id', exerciseId);

      if (error) throw error;

      setExercises(exercises.map(e =>
        e.id === exerciseId ? { ...e, difficulty: newDifficulties } : e
      ));

      toast({
        title: "Mise à jour réussie",
        description: "Les niveaux de difficulté ont été mis à jour",
      });
    } catch (error) {
      console.error('Error updating exercise difficulties:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les niveaux de difficulté",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Liste des exercices</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Nom</th>
                  <th className="text-left p-2">Groupe musculaire</th>
                  <th className="text-left p-2">Lieux d'entraînement</th>
                  <th className="text-left p-2">Niveaux de difficulté</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map((exercise) => (
                  <tr key={exercise.id} className="border-b">
                    <td className="p-2">{exercise.name}</td>
                    <td className="p-2">{exercise.muscle_group}</td>
                    <td className="p-2">
                      <div className="flex gap-4">
                        {locations.map((location) => (
                          <div key={location.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${exercise.id}-${location.id}`}
                              checked={(exercise.location || []).includes(location.id)}
                              onCheckedChange={(checked) => 
                                handleLocationChange(exercise.id, location.id, checked as boolean)
                              }
                            />
                            <Label htmlFor={`${exercise.id}-${location.id}`}>
                              {location.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-4">
                        {difficulties.map((difficulty) => (
                          <div key={difficulty.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${exercise.id}-${difficulty.id}`}
                              checked={(exercise.difficulty || []).includes(difficulty.id)}
                              onCheckedChange={(checked) =>
                                handleDifficultyChange(exercise.id, difficulty.id, checked as boolean)
                              }
                            />
                            <Label htmlFor={`${exercise.id}-${difficulty.id}`}>
                              {difficulty.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};