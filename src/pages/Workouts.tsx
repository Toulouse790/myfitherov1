
import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { ActiveSessionCard } from "@/components/Workouts/ActiveSessionCard";
import { WorkoutTabs } from "@/components/Workouts/WorkoutTabs";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dumbbell, Flame } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Workouts() {
  const { activeSession, formatTime, sessionTime } = useWorkoutSession();
  const [activeTab, setActiveTab] = useState("home");
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Header />
      <div className="container max-w-4xl mx-auto px-3 sm:px-4 pt-16 sm:pt-20 pb-20 sm:pb-24 md:pb-16">
        <div className="flex flex-col items-center mb-4 sm:mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2 md:mb-3"
          >
            <Flame className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              {t("workouts.title")}
            </h1>
            <Dumbbell className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xs sm:text-sm md:text-base text-muted-foreground text-center max-w-lg px-2"
          >
            {t("workouts.trackProgressDescription")}
          </motion.p>
        </div>
        
        {activeSession && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-4 sm:mb-6 md:mb-8"
          >
            <ActiveSessionCard 
              activeSession={activeSession} 
              formattedTime={formatTime(sessionTime)} 
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="w-full"
        >
          <WorkoutTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </motion.div>
      </div>
    </div>
  );
}
