
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dumbbell, Calendar, Clock, Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";

export const WorkoutGenerator = () => {
  const { t } = useLanguage();
  const [duration, setDuration] = useState([30]);
  const [intensity, setIntensity] = useState([50]);
  const [isGenerating, setIsGenerating] = useState(false);
  const isMobile = useIsMobile();

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simuler un délai de génération
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("workouts.generator") || "Générateur d'entraînement"}</CardTitle>
          <CardDescription>
            {t("workouts.generatorDescription") || "Créez un entraînement personnalisé en fonction de vos préférences"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">
                {t("workouts.duration") || "Durée"}: {duration[0]} min
              </label>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <Slider
              defaultValue={duration}
              onValueChange={setDuration}
              min={15}
              max={90}
              step={5}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">
                {t("workouts.intensity") || "Intensité"}: {intensity[0]}%
              </label>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </div>
            <Slider
              defaultValue={intensity}
              onValueChange={setIntensity}
              min={10}
              max={100}
              step={10}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 my-4">
            <div className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-lg">
              <Calendar className="h-5 w-5 mb-2 text-primary" />
              <span className="text-sm font-medium">{t("workouts.todayDate") || new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-lg">
              <Dumbbell className="h-5 w-5 mb-2 text-primary" />
              <span className="text-sm font-medium">{t("workouts.estimatedCalories") || "~250 kcal"}</span>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full"
            size={isMobile ? "lg" : "default"}
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin mr-2" />
                <span className="truncate">{t("workouts.generating") || "Génération en cours..."}</span>
              </>
            ) : (
              <>
                <Dumbbell className="h-4 w-4 mr-2" />
                <span className="truncate">{t("workouts.generateWorkout") || "Générer un entraînement"}</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
