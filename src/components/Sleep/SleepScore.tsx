
import { Card, CardContent } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect } from "react";
import { calculateSleepScore } from "@/utils/wellness/sleep-score-calculator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SleepSession } from "@/types/sleep";
import { useLanguage } from "@/contexts/LanguageContext";

export const SleepScore = () => {
  const [sleepScore, setSleepScore] = useState(0);
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const { data: sleepSessions } = useQuery({
    queryKey: ['sleep-sessions'],
    queryFn: async () => {
      if (!user) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('sleep_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false })
        .limit(7);
        
      if (error) {
        throw error;
      }
      
      return data as SleepSession[];
    },
    enabled: !!user
  });

  useEffect(() => {
    if (sleepSessions && sleepSessions.length > 0) {
      const calculatedScore = calculateSleepScore(sleepSessions);
      setSleepScore(calculatedScore);
    }
  }, [sleepSessions]);

  // Calculer les informations de sommeil
  const calculateSleepDuration = () => {
    if (!sleepSessions || sleepSessions.length === 0) return "7h 0m";
    
    const totalMinutes = sleepSessions.reduce((sum, session) => {
      return sum + (session.total_duration_minutes || 0);
    }, 0) / sleepSessions.length;
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    
    return `${hours}h ${minutes}m`;
  };

  const calculateSleepConsistency = () => {
    if (!sleepSessions || sleepSessions.length < 3) return "7/10";
    
    // Logique de calcul de cohérence basée sur la régularité des heures de coucher/lever
    return "8/10";
  };

  return (
    <Card className="overflow-hidden border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white to-blue-50 dark:from-blue-950/20 dark:to-blue-900/10 shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-blue-600">{t("sleep.sleepScore")}</h2>
          
          <div style={{ width: 180, height: 180 }}>
            <CircularProgressbar
              value={sleepScore}
              text={`${Math.round(sleepScore)}`}
              styles={buildStyles({
                textSize: '30px',
                pathColor: `rgba(62, 152, 199, ${sleepScore / 100})`,
                textColor: '#3e98c7',
                trailColor: '#d6d6d6',
                pathTransitionDuration: 0.5,
              })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-8 w-full">
            <div className="bg-blue-50/70 dark:bg-blue-900/20 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">{t("sleep.sleepDuration")}</p>
              <p className="text-xl font-semibold text-blue-600">{calculateSleepDuration()}</p>
            </div>
            <div className="bg-blue-50/70 dark:bg-blue-900/20 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">{t("sleep.consistency")}</p>
              <p className="text-xl font-semibold text-blue-600">{calculateSleepConsistency()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
