
import { Header } from "@/components/Layout/Header";
import { WorkoutSession } from "@/components/Workouts/WorkoutSession";
import { VerifyConnection } from "@/components/Workouts/VerifyConnection";
import { debugLogger } from "@/utils/debug-logger";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WorkoutSessionPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  
  useEffect(() => {
    debugLogger.log("WorkoutSessionPage", "Rendu de la page de session d'entraînement avec ID:", id || "ID manquant");
  }, [id]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4">
        <VerifyConnection />
        <h1 className="text-2xl font-bold mb-4">
          {t("workouts.training_session")}
        </h1>
        <WorkoutSession sessionId={id} />
      </div>
    </div>
  );
}
