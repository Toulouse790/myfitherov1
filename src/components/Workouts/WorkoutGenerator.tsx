
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dumbbell, Calendar, Clock, Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";

export function WorkoutGenerator() {
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
          <CardTitle className="text-xl sm:text-2xl">{t("workouts.generator")}</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {t("workouts.generatorDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs sm:text-sm font-medium">
                {t("workouts.duration")}: {duration[0]} {t("common.min")}
              </label>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
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
              <label className="text-xs sm:text-sm font-medium">
                {t("workouts.intensity")}: {intensity[0]}%
              </label>
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
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

          <div className="grid grid-cols-2 gap-3 sm:gap-4 my-3 sm:my-4">
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-muted/20 rounded-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-2 text-primary" />
              <span className="text-xs sm:text-sm font-medium">{t("workouts.todayDate")}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-muted/20 rounded-lg">
              <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-2 text-primary" />
              <span className="text-xs sm:text-sm font-medium">~250 kcal</span>
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
                <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-current border-t-transparent animate-spin mr-2" />
                <span className="text-xs sm:text-sm truncate">{t("workouts.generationLoading")}</span>
              </>
            ) : (
              <>
                <Dumbbell className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="text-xs sm:text-sm truncate">{t("workouts.generateWorkout")}</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
