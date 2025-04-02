
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Timer, Flame, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface ActiveSessionCardProps {
  activeSession: any;
  formattedTime: string;
}

export function ActiveSessionCard({ activeSession, formattedTime }: ActiveSessionCardProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/80 to-primary p-2 sm:p-3 md:p-4 text-primary-foreground">
          <div className="flex justify-between items-center">
            <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-1 sm:gap-2">
              <Flame className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              {t("workouts.activeSession")}
            </h2>
            <div className="flex items-center gap-1 sm:gap-2">
              <Timer className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
              <span className="font-mono text-[10px] sm:text-xs md:text-sm">{formattedTime}</span>
            </div>
          </div>
        </div>
        <CardContent className="p-2 sm:p-3 md:p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 md:gap-4">
            <div>
              <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1">{activeSession.name}</h3>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                {activeSession.exercises.length} {t("workouts.exerciseLibrary").toLowerCase()}
              </p>
            </div>
            <Button
              onClick={() => navigate(`/workouts/${activeSession.id}`)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md flex items-center gap-1 sm:gap-2 w-full sm:w-auto text-[10px] sm:text-xs md:text-sm"
            >
              <Play className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
              {t("workouts.continueSession")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
