
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSleepTracking } from "@/hooks/use-sleep-tracking";
import { useLanguage } from "@/contexts/LanguageContext";

export const SleepScore = () => {
  const { sleepScore, sleepDuration } = useSleepTracking();
  const { t } = useLanguage();
  
  // Formater la durée de sommeil
  const formattedHours = Math.floor(sleepDuration / 60);
  const formattedMinutes = sleepDuration % 60;
  const formattedDuration = `${formattedHours}${t('sleep.sleepValueHours')} ${formattedMinutes}${t('sleep.sleepValueMinutes')}`;
  
  // Calculer la régularité (exemple simple)
  const regularityScore = 7;
  
  return (
    <Card className="overflow-hidden h-full border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white to-blue-50 dark:from-blue-950/20 dark:to-blue-900/10 shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col items-center mb-6">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">
            {t('sleep.scoreTitle')}
          </h3>
          <div className="w-36 h-36">
            <CircularProgressbar
              value={sleepScore}
              text={String(sleepScore)}
              strokeWidth={12}
              styles={buildStyles({
                textSize: '24px',
                textColor: 'var(--blue-600)',
                pathColor: `rgba(59, 130, 246, ${sleepScore / 100})`,
                trailColor: '#E2E8F0'
              })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('sleep.sleepDuration')}</span>
              <span className="font-semibold text-blue-600">{formattedDuration}</span>
            </div>
            <Progress value={sleepDuration / (8 * 60) * 100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('sleep.regularityScore')}</span>
              <span className="font-semibold text-blue-600">{regularityScore}/10</span>
            </div>
            <Progress value={regularityScore * 10} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
