
import { Header } from "@/components/Layout/Header";
import { WorkoutSession } from "@/components/Workouts/WorkoutSession";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function WorkoutSessionPage() {
  const { id } = useParams();
  
  useEffect(() => {
    debugLogger.log("WorkoutSessionPage", "Rendu de la page de session d'entraînement avec ID:", id || "ID manquant");
  }, [id]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4">
        <LanguageProvider>
          <WorkoutSession sessionId={id} />
        </LanguageProvider>
      </div>
    </div>
  );
}
