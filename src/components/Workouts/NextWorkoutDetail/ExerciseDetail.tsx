import { ExerciseSets } from "../ExerciseSets";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ExerciseDetailProps {
  exercise: string;
}

export const ExerciseDetail = ({ exercise }: ExerciseDetailProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">{exercise}</h2>
        <ExerciseSets exercises={[exercise]} />
      </Card>
    </motion.div>
  );
};