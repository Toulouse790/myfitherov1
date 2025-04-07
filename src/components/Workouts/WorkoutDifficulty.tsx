
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkoutDifficultyProps {
  difficulty: string;
  setDifficulty: (value: string) => void;
}

export const WorkoutDifficulty = ({ difficulty, setDifficulty }: WorkoutDifficultyProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{t("workouts.difficulty") || "Difficulté"}</Label>
      <RadioGroup
        value={difficulty}
        onValueChange={setDifficulty}
        className="flex space-x-2"
      >
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="easy" id="easy" />
          <Label htmlFor="easy" className="text-sm">
            {t("workouts.easy") || "Facile"}
          </Label>
        </div>
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="moderate" id="moderate" />
          <Label htmlFor="moderate" className="text-sm">
            {t("workouts.moderate") || "Modéré"}
          </Label>
        </div>
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="hard" id="hard" />
          <Label htmlFor="hard" className="text-sm">
            {t("workouts.hard") || "Difficile"}
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
