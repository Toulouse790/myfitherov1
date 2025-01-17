import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface ExerciseTimelineProps {
  exercises: string[];
  currentExerciseIndex: number;
}

const getCardioTips = (exercise: string): string[] => {
  switch (exercise) {
    case "Course à pied":
      return [
        "Commencez doucement pour vous échauffer",
        "Gardez une respiration régulière",
        "Maintenez une posture droite",
        "Regardez devant vous, pas vos pieds"
      ];
    case "Vélo stationnaire":
      return [
        "Ajustez la hauteur de la selle",
        "Gardez un rythme constant",
        "Alternez entre position assise et debout",
        "Surveillez votre fréquence cardiaque"
      ];
    case "Rameur":
      return [
        "Commencez par les jambes, puis le dos, enfin les bras",
        "Gardez le dos droit",
        "Tirez jusqu'à la poitrine",
        "Contrôlez le retour"
      ];
    case "Corde à sauter":
      return [
        "Sautez sur la plante des pieds",
        "Gardez les coudes près du corps",
        "Faites de petits sauts",
        "Regardez droit devant vous"
      ];
    default:
      return ["Chargement des conseils..."];
  }
};

export const ExerciseTimeline = ({ exercises, currentExerciseIndex }: ExerciseTimelineProps) => {
  const [selectedExercise, setSelectedExercise] = useState<string>(exercises[0] || "");

  const handleCardioSelection = (exercise: string) => {
    setSelectedExercise(exercise);
  };

  // Vérifier si c'est une séance cardio
  const isCardioSession = exercises[0] === "Course à pied" || 
                         exercises[0] === "Vélo stationnaire" || 
                         exercises[0] === "Rameur" || 
                         exercises[0] === "Corde à sauter";

  if (isCardioSession) {
    return (
      <div className="space-y-4">
        {selectedExercise && (
          <h2 className="text-2xl font-semibold mb-6">{selectedExercise}</h2>
        )}
        
        <h3 className="text-lg font-medium mb-4">Sélectionnez votre exercice cardio</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {exercises.map((exercise, index) => (
            <Card 
              key={index}
              className={`p-4 cursor-pointer transition-all ${
                selectedExercise === exercise 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-primary/10'
              }`}
              onClick={() => handleCardioSelection(exercise)}
            >
              <div className="flex items-center justify-between">
                <span>{exercise}</span>
                {selectedExercise === exercise && (
                  <Check className="h-4 w-4" />
                )}
              </div>
            </Card>
          ))}
        </div>
        
        {selectedExercise && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Conseils pour {selectedExercise} :</h4>
            <div className="space-y-3">
              <div className="bg-primary/10 p-4 rounded-lg">
                <ul className="list-disc list-inside text-sm space-y-1">
                  {getCardioTips(selectedExercise).map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-primary/80">{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Pour les séances non-cardio
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        {exercises.map((exercise, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-colors ${
              index === currentExerciseIndex
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
          >
            <h3 className="font-medium">{exercise}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};