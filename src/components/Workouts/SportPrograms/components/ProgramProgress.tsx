
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface ProgramProgressProps {
  programId: string;
  programName: string;
  totalDuration: number;
  sessionsPerWeek: number;
}

export const ProgramProgress = ({ programId, programName, totalDuration, sessionsPerWeek }: ProgramProgressProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [weekProgress, setWeekProgress] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchProgramProgress = async () => {
      setLoading(true);
      
      try {
        // Récupérer les informations du programme en cours
        const { data: progressData } = await supabase
          .from('workout_sessions')
          .select('started_at, completed_at, status')
          .eq('user_id', user.id)
          .eq('program_id', programId)
          .order('started_at', { ascending: true });
        
        if (progressData && progressData.length > 0) {
          // Date de début du programme = date de la première session
          const firstSession = progressData[0];
          setStartDate(new Date(firstSession.started_at));
          
          // Compter les sessions terminées
          const completed = progressData.filter(session => session.status === 'completed').length;
          setCompletedSessions(completed);
          
          // Calculer la semaine actuelle du programme
          const startDateObj = new Date(firstSession.started_at);
          const currentDate = new Date();
          const diffTime = Math.abs(currentDate.getTime() - startDateObj.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const currentWeek = Math.min(Math.ceil(diffDays / 7), totalDuration);
          
          setWeekProgress(currentWeek);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la progression:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgramProgress();
  }, [programId, user, totalDuration]);
  
  if (loading) {
    return (
      <Card className="mb-6 animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="h-4 bg-muted rounded w-full mb-4"></div>
          <div className="h-8 bg-muted rounded w-full"></div>
        </CardContent>
      </Card>
    );
  }
  
  // Si l'utilisateur n'a pas encore commencé ce programme
  if (!startDate) {
    return null;
  }
  
  const progressPercentage = (weekProgress / totalDuration) * 100;
  const totalSessions = totalDuration * sessionsPerWeek;
  const sessionProgressPercentage = (completedSessions / totalSessions) * 100;
  
  // Calculer la date estimée de fin
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (totalDuration * 7));
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{t("programs.currentProgress")}</CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {t("programs.weekOf", { current: weekProgress, total: totalDuration })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span>{t("programs.weeklyProgress")}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span>{t("programs.sessionProgress")}</span>
              <span>{completedSessions} / {totalSessions} {t("programs.sessions")}</span>
            </div>
            <Progress value={sessionProgressPercentage} className="h-2" />
          </div>
          
          <div className="flex flex-wrap gap-4 mt-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{t("programs.startDate")}: {startDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{t("programs.estimatedEndDate")}: {endDate.toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="pt-2">
            <Button variant="outline" className="w-full" size="sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              {t("programs.nextSession")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
