
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTheme } from "@/components/Theme/ThemeProvider"; // Import du hook correctement
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Moon, ActivitySquare, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const SleepScore = () => {
  const { theme } = useTheme();
  const [sleepScore, setSleepScore] = useState(87);
  const [sleepData, setSleepData] = useState({
    duration: "7h 24min",
    quality: "Bon",
    deepSleep: "2h 15min",
    remSleep: "1h 40min",
    lightSleep: "3h 29min",
    awakeTime: "0h 10min",
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const textColor = theme === "dark" ? "#fff" : "#1E3A8A";
  const pathColor = "#3B82F6"; // blue-500
  const trailColor = theme === "dark" ? "#1E293B" : "#EFF6FF"; // slate-800 or blue-50

  return (
    <Card className="overflow-hidden border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white to-blue-50 dark:from-blue-950/20 dark:to-blue-900/10 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <CardTitle className="flex items-center justify-between">
          <span>Score de sommeil</span>
          <Badge variant="secondary" className="bg-white/20 hover:bg-white/30">
            <Clock className="h-3 w-3 mr-1" />
            Nuit dernière
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <motion.div 
          className="grid gap-8 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="flex flex-col items-center justify-center"
            variants={itemVariants}
          >
            <div className="w-36 h-36 md:w-44 md:h-44">
              <CircularProgressbar
                value={sleepScore}
                text={`${sleepScore}`}
                strokeWidth={12}
                styles={buildStyles({
                  textSize: '22px',
                  textColor: textColor,
                  pathColor: pathColor,
                  trailColor: trailColor,
                })}
              />
            </div>
            <p className="mt-2 text-center text-muted-foreground">
              Votre score est <span className="font-medium text-blue-600 dark:text-blue-400">excellent</span>
            </p>
          </motion.div>

          <motion.div 
            className="space-y-3"
            variants={containerVariants}
          >
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-3 border-l-4 border-blue-500 pl-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-r-md"
            >
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Durée totale</p>
                <p className="font-medium">{sleepData.duration}</p>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-3 border-l-4 border-indigo-500 pl-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-r-md"
            >
              <Moon className="h-4 w-4 text-indigo-500" />
              <div>
                <p className="text-sm text-muted-foreground">Sommeil profond</p>
                <p className="font-medium">{sleepData.deepSleep}</p>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-3 border-l-4 border-purple-500 pl-3 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-r-md"
            >
              <ActivitySquare className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Sommeil paradoxal</p>
                <p className="font-medium">{sleepData.remSleep}</p>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-3 border-l-4 border-cyan-500 pl-3 py-1 bg-cyan-50 dark:bg-cyan-900/20 rounded-r-md"
            >
              <Zap className="h-4 w-4 text-cyan-500" />
              <div>
                <p className="text-sm text-muted-foreground">Qualité</p>
                <p className="font-medium">{sleepData.quality}</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
};
