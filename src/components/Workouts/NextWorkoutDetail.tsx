import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { exerciseImages } from "./data/exerciseImages";

interface Set {
  id: number;
  reps: number;
  weight: number;
}

const EXERCISES = [
  "Rowing avec Haltères",
  "Tirage à la poulie barre en V",
  "Curl Biceps aux Haltères",
  "Curl Marteau",
  "Développé Militaire",
  "Élévations Latérales",
  "Crunch",
  "Planche"
];

export const NextWorkoutDetail = () => {
  const navigate = useNavigate();
  const [sets, setSets] = useState<Set[]>([
    { id: 1, reps: 12, weight: 10 },
    { id: 2, reps: 12, weight: 10 },
    { id: 3, reps: 12, weight: 10 },
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
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Prochain entraînement</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Timer className="w-4 h-4" />
              <span>61 mins</span>
            </div>
          </div>

          <div className="space-y-8">
            {EXERCISES.map((exercise, index) => (
              <div key={index} className="space-y-4">
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <img 
                    src={exerciseImages[exercise]} 
                    alt={exercise}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h2 className="text-xl font-semibold text-white">{exercise}</h2>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-sm text-gray-400">SET</div>
                  <div className="text-sm text-gray-400">RÉPÉTITIONS</div>
                  <div className="text-sm text-gray-400">KG</div>
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

                <div className="space-y-2">
                  <h3 className="text-white font-medium">Notes</h3>
                  <Textarea
                    placeholder="Aucune note ajoutée..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-[#252B3B] border-0 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <Button 
            className="w-full bg-[#90EE90] hover:bg-[#90EE90]/80 text-black font-semibold py-6"
            onClick={() => navigate('/workouts')}
          >
            COMMENCER L'ENTRAÎNEMENT
          </Button>
        </div>
      </Card>
    </div>
  );
};