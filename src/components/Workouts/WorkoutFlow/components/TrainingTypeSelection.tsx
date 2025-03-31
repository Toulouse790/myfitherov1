
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dumbbell, Footprints } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";

interface TrainingTypeSelectionProps {
  onSelectTrainingType: (type: "muscle" | "sport") => void;
}

export const TrainingTypeSelection = ({ onSelectTrainingType }: TrainingTypeSelectionProps) => {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<"muscle" | "sport" | null>(null);

  const handleSelect = (type: "muscle" | "sport") => {
    setSelectedType(type);
    onSelectTrainingType(type);
    debugLogger.log("TrainingTypeSelection", "Type d'entraînement sélectionné:", type);
  };

  return (
    <div className="w-full max-w-3xl">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {t("workouts.chooseWorkoutType") || "Choisissez votre type d'entraînement"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            onClick={() => handleSelect("muscle")}
            className={`p-6 cursor-pointer hover:shadow-md transition-all hover:border-primary ${
              selectedType === "muscle" ? "border-2 border-primary bg-primary/5" : ""
            }`}
            role="button"
            aria-pressed={selectedType === "muscle"}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect("muscle");
              }
            }}
          >
            <div className="flex flex-col items-center text-center gap-4 p-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Dumbbell className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {t("workouts.muscleGroups") || "Groupes Musculaires"}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {t("workouts.muscleGroupsDescription") || "Entraînez-vous par groupes musculaires ciblés"}
                </p>
              </div>
            </div>
          </Card>
        
          <Card 
            onClick={() => handleSelect("sport")}
            className={`p-6 cursor-pointer hover:shadow-md transition-all hover:border-primary ${
              selectedType === "sport" ? "border-2 border-primary bg-primary/5" : ""
            }`}
            role="button"
            aria-pressed={selectedType === "sport"}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect("sport");
              }
            }}
          >
            <div className="flex flex-col items-center text-center gap-4 p-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Footprints className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {t("workouts.sportSpecific") || "Spécifique au Sport"}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {t("workouts.sportSpecificDescription") || "Entraînement adapté à votre sport et position"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};
