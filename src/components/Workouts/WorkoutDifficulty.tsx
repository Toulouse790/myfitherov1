
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";

interface WorkoutDifficultyProps {
  difficulty: string;
  setDifficulty: (value: string) => void;
}

export const WorkoutDifficulty = ({
  difficulty,
  setDifficulty,
}: WorkoutDifficultyProps) => {
  const { t } = useLanguage();
  
  debugLogger.log("WorkoutDifficulty", `Difficulté actuelle: ${difficulty}`);
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t("workouts.difficultySetting") || "Difficulté perçue"}</label>
      <Select value={difficulty} onValueChange={setDifficulty}>
        <SelectTrigger>
          <SelectValue placeholder={t("workouts.chooseDifficulty") || "Choisir la difficulté"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="easy">{t("workouts.easy") || "Facile"}</SelectItem>
          <SelectItem value="moderate">{t("workouts.medium") || "Modérée"}</SelectItem>
          <SelectItem value="hard">{t("workouts.hard") || "Difficile"}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
