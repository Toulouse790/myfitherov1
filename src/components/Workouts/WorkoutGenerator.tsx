
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Calendar, Clock, Activity } from "lucide-react";

export const WorkoutGenerator = () => {
  const { t } = useLanguage();
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState(50);

  const handleGenerate = () => {
    console.log("Générer un entraînement avec:", { duration, intensity });
  };

  return (
    <div className="mt-8 border rounded-lg p-5 bg-card">
      <h3 className="text-lg font-semibold mb-4">
        {t("workouts.generateWorkoutTitle")}
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        {t("workouts.aiGeneratedSession")}
      </p>

      <div className="space-y-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {t("workouts.duration")}
            </label>
            <span className="text-sm font-medium">{duration} {t("workouts.min")}</span>
          </div>
          <Slider
            defaultValue={[30]}
            min={15}
            max={90}
            step={5}
            onValueChange={(value) => setDuration(value[0])}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {t("workouts.intensity")}
            </label>
            <span className="text-sm font-medium">{intensity}%</span>
          </div>
          <Slider
            defaultValue={[50]}
            min={10}
            max={100}
            step={10}
            onValueChange={(value) => setIntensity(value[0])}
          />
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{t("workouts.todayDate")}</span>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleGenerate} className="w-full md:w-auto">
          {t("workouts.generateMySession")}
        </Button>
      </div>
    </div>
  );
};
