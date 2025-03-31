
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const DebugExercises = () => {
  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('unified_exercises')
        .select('*')
        .limit(100);

      if (error) throw error;

      setExercises(data || []);
      console.log("Exercices dans la base de données:", data);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des exercices:", err);
      setError(err.message || "Erreur lors du chargement des exercices");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 my-4">
      <h2 className="text-lg font-semibold mb-4">Débogage des exercices</h2>
      <Button onClick={fetchExercises} disabled={isLoading}>
        {isLoading ? "Chargement..." : "Voir les exercices disponibles"}
      </Button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      {exercises.length > 0 && (
        <div className="mt-4">
          <p className="font-medium">Nombre d'exercices trouvés: {exercises.length}</p>
          <div className="mt-2 max-h-60 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Nom</th>
                  <th className="text-left p-2">Groupe Musculaire</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map((ex, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{ex.id}</td>
                    <td className="p-2">{ex.name}</td>
                    <td className="p-2">{ex.muscle_group}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  );
};
