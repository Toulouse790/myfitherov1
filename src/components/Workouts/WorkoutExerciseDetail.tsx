import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Set {
  id: number;
  reps: number;
  weight: number;
}

export const WorkoutExerciseDetail = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [sets, setSets] = useState<Set[]>([
    { id: 1, reps: 14, weight: 8 },
    { id: 2, reps: 14, weight: 8 },
    { id: 3, reps: 14, weight: 8 },
  ]);
  const [notes, setNotes] = useState("");

  const handleAddSet = () => {
    const newSet = {
      id: sets.length + 1,
      reps: sets[0].reps,
      weight: sets[0].weight,
    };
    setSets([...sets, newSet]);
  };

  const handleStart = () => {
    // TODO: Implement start workout logic
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>

      <Card className="bg-[#1E2330]">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Rowing avec Haltères</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Ensembles efficaces</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-sm text-gray-400">SET</div>
              <div className="text-sm text-gray-400">RÉPÉTITIONS PAR BRAS</div>
              <div className="text-sm text-gray-400">KG PAR HALTÈRE</div>
            </div>

            {sets.map((set) => (
              <div key={set.id} className="grid grid-cols-3 gap-4 bg-[#252B3B] p-4 rounded-lg">
                <div className="text-white">{set.id}</div>
                <div className="text-white">{set.reps}</div>
                <div className="text-white">{set.weight}</div>
              </div>
            ))}

            <Button
              variant="ghost"
              className="w-full flex items-center gap-2 text-[#90EE90] hover:text-[#90EE90]/80"
              onClick={handleAddSet}
            >
              <Plus className="w-4 h-4" />
              Ajouter une série
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-white font-medium">Notes</h3>
            <Textarea
              placeholder="Aucune note ajoutée..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-[#252B3B] border-0 text-white placeholder:text-gray-500"
            />
          </div>

          <Button 
            className="w-full bg-[#90EE90] hover:bg-[#90EE90]/80 text-black font-semibold py-6"
            onClick={handleStart}
          >
            COMMENCER
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};