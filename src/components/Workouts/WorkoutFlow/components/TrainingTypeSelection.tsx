
import { Card } from "@/components/ui/card";
import { Activity, Dumbbell } from "lucide-react";
import { motion } from "framer-motion";

interface TrainingTypeSelectionProps {
  onSelectTrainingType: (type: "muscle" | "sport") => void;
}

export const TrainingTypeSelection = ({ onSelectTrainingType }: TrainingTypeSelectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <h2 className="text-xl font-bold text-center mb-6">
        Choisissez votre type d'entraînement
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <Card
          onClick={() => onSelectTrainingType("muscle")}
          className="p-6 cursor-pointer hover:shadow-md transition-all hover:border-primary"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Dumbbell className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Par groupe musculaire</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Sélectionnez les groupes musculaires que vous souhaitez travailler
              </p>
            </div>
          </div>
        </Card>

        <Card
          onClick={() => onSelectTrainingType("sport")}
          className="p-6 cursor-pointer hover:shadow-md transition-all hover:border-primary"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Spécifique au sport</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Sélectionnez votre sport et votre poste pour des exercices adaptés
              </p>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};
