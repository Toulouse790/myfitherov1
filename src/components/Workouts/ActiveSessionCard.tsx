
import { useNavigate } from "react-router-dom";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkoutSession } from "@/types/workout-session";
import { useLanguage } from "@/contexts/LanguageContext";

interface ActiveSessionCardProps {
  activeSession: WorkoutSession;
  formattedTime: string;
}

export function ActiveSessionCard({ activeSession, formattedTime }: ActiveSessionCardProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Card className="mb-6 bg-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{t("workouts.activeSession")}</CardTitle>
        <CardDescription>
          {t("workouts.duration")}: {formattedTime}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button 
          onClick={() => navigate(`/workouts/start/${activeSession.program_id || activeSession.id}`)}
          className="w-full"
        >
          {t("workouts.continueSession")}
        </Button>
      </CardFooter>
    </Card>
  );
}
