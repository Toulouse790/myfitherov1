
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
        <div className="bg-gradient-to-r from-primary/80 to-primary p-3 sm:p-4 text-primary-foreground">
          <div className="flex justify-between items-center">
            <h2 className="text-base sm:text-xl font-bold flex items-center gap-1 sm:gap-2">
              <Flame className="h-4 w-4 sm:h-5 sm:w-5" />
              {t("workouts.activeSession")}
            </h2>
            <div className="flex items-center gap-1 sm:gap-2">
              <Timer className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-mono text-xs sm:text-base">{formattedTime}</span>
            </div>
          </div>
        </div>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-1">{activeSession.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {activeSession.exercises.length} {t("workouts.exerciseLibrary").toLowerCase()}
              </p>
            </div>
            <Button
              onClick={() => navigate(`/workouts/${activeSession.id}`)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-md flex items-center gap-1 sm:gap-2 w-full sm:w-auto text-xs sm:text-sm"
            >
              <Play className="h-3 w-3 sm:h-4 sm:w-4" />
              {t("workouts.continueSession")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
