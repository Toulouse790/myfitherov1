import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ExerciseTimelineProps {
  exercises: string[];
  currentExerciseIndex: number;
}

const getCardioTips = (exerciseName: string): string[] => {
  const tips: Record<string, string[]> = {
    "Course à pied": [
      "Posture droite",
      "Respiration régulière",
      "Foulée naturelle"
    ],
    "Vélo stationnaire": [
      "Régler la selle",
      "Garder le dos droit",
      "Pédaler fluide"
    ],
    "Rameur": [
      "Pousser avec les jambes",
      "Tirer avec le dos",
      "Rythme constant"
    ],
    "Corde à sauter": [
      "Sauts légers",
      "Poignets souples",
      "Regard horizontal"
    ],
    "Burpees": [
      "Explosif à la montée",
      "Gainage au sol",
      "Respirer régulièrement"
    ],
    "Mountain climbers": [
      "Gainage stable",
      "Genoux vers poitrine",
      "Rythme soutenu"
    ],
    "Jumping jacks": [
      "Coordination bras-jambes",
      "Atterrissage souple",
      "Amplitude complète"
    ],
    "High knees": [
      "Genoux hauts",
      "Bras dynamiques",
      "Rester sur l'avant du pied"
    ]
  };

  return tips[exerciseName] || [
    "Respiration régulière",
    "Maintenir l'effort",
    "Garder le rythme"
  ];
};

export const ExerciseTimeline = ({ exercises, currentExerciseIndex }: ExerciseTimelineProps) => {
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [selectedCardioExercises, setSelectedCardioExercises] = useState<string[]>([]);

  const handleExerciseClick = (index: number) => {
    setSelectedExercise(selectedExercise === index ? null : index);
  };

  const handleCardioSelection = (exercise: string) => {
    setSelectedCardioExercises([exercise]); // Directement remplacer par le nouvel exercice
  };

  // Si c'est une séance cardio (vérifié par le premier exercice)
  const isCardioSession = exercises[0] === "Course à pied" || 
                         exercises[0] === "Vélo stationnaire" || 
                         exercises[0] === "Rameur" || 
                         exercises[0] === "Corde à sauter";

  if (isCardioSession) {
    return (
      <div className="space-y-4">
        {selectedCardioExercises.length > 0 && (
          <h2 className="text-2xl font-semibold mb-6">{selectedCardioExercises[0]}</h2>
        )}
        <h3 className="text-lg font-medium mb-4">Sélectionnez votre exercice cardio</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {exercises.map((exercise, index) => (
            <Card 
              key={index}
              className={`p-4 cursor-pointer transition-all ${
                selectedCardioExercises[0] === exercise 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-primary/10'
              }`}
              onClick={() => handleCardioSelection(exercise)}
            >
              <div className="flex items-center justify-between">
                <span>{exercise}</span>
                {selectedCardioExercises[0] === exercise && (
                  <Check className="h-4 w-4" />
                )}
              </div>
            </Card>
          ))}
        </div>
        
        {selectedCardioExercises.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Conseils pour {selectedCardioExercises[0]} :</h4>
            <div className="space-y-3">
              <div className="bg-primary/10 p-4 rounded-lg">
                <ul className="list-disc list-inside text-sm space-y-1">
                  {getCardioTips(selectedCardioExercises[0]).map((tip, tipIndex) => (
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

  // Pour les autres types de séances, garder le comportement existant
  return (
    <div className="space-y-2">
      {exercises.map((exercise, index) => (
        <div key={index} className="flex items-center justify-between">
          <span>{exercise}</span>
          {currentExerciseIndex === index && <ChevronUp className="h-4 w-4" />}
          {currentExerciseIndex !== index && <ChevronDown className="h-4 w-4" />}
        </div>
      ))}
    </div>
  );
};