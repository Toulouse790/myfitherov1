
import { Card } from "@/components/ui/card";
import { muscleGroups } from "./workoutConstants";
import { MuscleGroupCard } from "./components/MuscleGroupCard";
import { motion } from "framer-motion";

interface MuscleGroupSelectionProps {
  onSelectMuscleGroup: (muscleId: string) => void;
}

export const MuscleGroupSelection = ({ onSelectMuscleGroup }: MuscleGroupSelectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <h2 className="text-xl font-bold text-center mb-6">
        Sélectionnez les groupes musculaires à travailler
      </h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {muscleGroups.map((muscle) => (
          <MuscleGroupCard
            key={muscle.id}
            id={muscle.id}
            name={muscle.name}
            isSelected={false}
            onClick={() => onSelectMuscleGroup(muscle.id)}
          />
        ))}
      </div>
    </motion.div>
  );
};
