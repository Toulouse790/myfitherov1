
import { Card, CardContent } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSleepTracking } from "@/hooks/use-sleep-tracking";
import { useMemo } from "react";
import { calculateSleepScore } from "@/utils/wellness/sleep-score-calculator";

export const SleepScore = () => {
  const { t } = useLanguage();
  const { sleepSessions, sleepStats } = useSleepTracking();
  
  // Calculer le score de sommeil basé sur les données récentes
  const sleepScore = useMemo(() => {
    if (sleepSessions && sleepSessions.length > 0) {
      return calculateSleepScore(sleepSessions);
    } else if (sleepStats && sleepStats.average_score) {
      return sleepStats.average_score;
    }
    return 75; // Score par défaut si aucune donnée n'est disponible
  }, [sleepSessions, sleepStats]);
  
  // Déterminer la couleur en fonction du score
  const scoreColor = useMemo(() => {
    if (sleepScore >= 80) return "#4ade80"; // Vert
    if (sleepScore >= 60) return "#facc15"; // Jaune
    return "#f87171"; // Rouge
  }, [sleepScore]);
  
  // Animation variants
  const scoreVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100, delay: 0.2 }
    }
  };
  
  const textVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };
  
  const itemVariant = {
    hidden: { y: -10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Card className="overflow-hidden border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white to-blue-50 dark:from-blue-950/20 dark:to-blue-900/10 shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <motion.h2 
            className="text-2xl font-semibold text-blue-600"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {t("sleep.sleepScore")}
          </motion.h2>
          
          <motion.div 
            className="w-36 h-36 md:w-44 md:h-44"
            variants={scoreVariants}
            initial="hidden"
            animate="visible"
          >
            <CircularProgressbar
              value={sleepScore}
              text={`${Math.round(sleepScore)}`}
              strokeWidth={10}
              styles={buildStyles({
                textSize: '28px',
                textColor: 'var(--colors-primary)',
                pathColor: scoreColor,
                trailColor: 'rgba(190, 205, 233, 0.3)',
                pathTransitionDuration: 1.5
              })}
            />
          </motion.div>
          
          <motion.div 
            className="space-y-3 w-full"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            {sleepStats && (
              <div className="grid grid-cols-2 gap-3">
                <motion.div 
                  variants={itemVariant} 
                  className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg"
                >
                  <p className="text-xs text-muted-foreground">{t("sleep.sleepDuration")}</p>
                  <p className="text-lg font-medium text-blue-600">
                    {Math.floor(sleepStats.average_duration / 60)}h{" "}
                    {sleepStats.average_duration % 60}m
                  </p>
                </motion.div>
                
                <motion.div 
                  variants={itemVariant} 
                  className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg"
                >
                  <p className="text-xs text-muted-foreground">{t("sleep.consistency")}</p>
                  <p className="text-lg font-medium text-blue-600">
                    {sleepStats.consistency_score}/10
                  </p>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};
