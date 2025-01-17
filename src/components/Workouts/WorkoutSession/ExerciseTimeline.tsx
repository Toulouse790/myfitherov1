import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ExerciseTimelineProps {
  exercises: string[];
  currentExerciseIndex: number;
}

const getExerciseTips = (exerciseName: string): string[] => {
  const tips: Record<string, string[]> = {
    "Développé couché": [
      "Gardez vos coudes à 45 degrés par rapport à votre corps",
      "Expirez en poussant, inspirez en descendant",
      "Maintenez vos pieds bien ancrés et les fessiers contractés",
      "Descendez la barre jusqu'à ce qu'elle effleure votre poitrine",
      "Concentrez-vous sur la contraction des pectoraux"
    ],
    "Squat": [
      "Gardez le regard droit devant vous",
      "Descendez comme si vous alliez vous asseoir sur une chaise",
      "Les genoux ne doivent pas dépasser la pointe des pieds",
      "Engagez vos abdominaux pendant tout le mouvement",
      "Poussez à travers vos talons pour remonter"
    ],
    "Tractions": [
      "Commencez avec une prise légèrement plus large que les épaules",
      "Rétractez vos omoplates avant de tirer",
      "Gardez vos coudes près du corps pendant le mouvement",
      "Concentrez-vous sur l'engagement du dos plutôt que des bras",
      "Contrôlez la descente pour maximiser le travail musculaire"
    ],
    "Curl biceps": [
      "Gardez vos coudes collés au corps sans bouger",
      "Montez le poids en contractant activement vos biceps",
      "Faites une pause d'une seconde en haut du mouvement",
      "Contrôlez la phase négative (descente)",
      "Évitez tout balancement du corps"
    ],
    "Soulevé de terre": [
      "Gardez la barre proche du corps tout au long du mouvement",
      "Commencez avec les hanches plus basses que les épaules",
      "Engagez votre latis avant de soulever",
      "Poussez avec vos jambes en gardant le dos droit",
      "Verrouillez vos hanches et vos genoux au sommet"
    ],
    "Développé épaules": [
      "Gardez vos poignets alignés avec vos avant-bras",
      "Évitez d'arquer votre dos pendant le mouvement",
      "Expirez en poussant vers le haut",
      "Maintenez vos abdominaux engagés",
      "Descendez jusqu'à ce que vos bras soient parallèles au sol"
    ],
    "Rowing barre": [
      "Gardez votre dos droit et votre poitrine haute",
      "Tirez la barre vers votre nombril",
      "Serrez vos omoplates à la fin du mouvement",
      "Contrôlez la descente du poids",
      "Évitez de balancer votre corps"
    ],
    "Extensions triceps": [
      "Gardez vos coudes près de votre tête",
      "Ne laissez pas vos coudes s'écarter pendant le mouvement",
      "Concentrez-vous sur la contraction des triceps",
      "Faites une pause en position haute",
      "Descendez jusqu'à ce que vos avant-bras touchent vos biceps"
    ]
  };

  // Si l'exercice n'est pas dans la liste, retourner des conseils généraux mais toujours utiles
  return tips[exerciseName] || [
    "Maintenez une respiration régulière et contrôlée",
    "Concentrez-vous sur la qualité plutôt que la quantité",
    "Gardez une bonne posture pendant tout l'exercice",
    "Écoutez votre corps et respectez ses limites",
    "Restez concentré sur les muscles ciblés"
  ];
};

export const ExerciseTimeline = ({ exercises, currentExerciseIndex }: ExerciseTimelineProps) => {
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);

  const handleExerciseClick = (index: number) => {
    setSelectedExercise(selectedExercise === index ? null : index);
  };

  return (
    <div className="space-y-2">
      {exercises.map((exercise, index) => (
        <div key={index} className="space-y-2">
          <div
            onClick={() => handleExerciseClick(index)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-lg cursor-pointer transition-all
              ${index === currentExerciseIndex
                ? 'bg-primary text-primary-foreground'
                : index < currentExerciseIndex
                ? 'bg-primary/20 text-primary'
                : 'bg-primary/10 text-primary/80'
              }
              hover:opacity-90
            `}
          >
            <div className="flex items-center justify-between">
              <span>{exercise}</span>
              {selectedExercise === index ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>

          <AnimatePresence>
            {selectedExercise === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-primary/5 backdrop-blur-sm rounded-lg p-4 border border-primary/10 shadow-sm"
              >
                <div className="space-y-2">
                  <h4 className="font-medium text-primary">Conseils techniques pour {exercise}</h4>
                  <ul className="list-disc list-inside text-sm text-primary/70 space-y-1">
                    {getExerciseTips(exercise).map((tip, tipIndex) => (
                      <li key={tipIndex} className="leading-relaxed">{tip}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};