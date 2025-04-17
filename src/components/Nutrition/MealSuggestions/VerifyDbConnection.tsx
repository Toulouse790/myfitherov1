
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { useLanguage } from "@/contexts/LanguageContext";

export const VerifyDbConnection = () => {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking");
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const checkConnection = async () => {
    try {
      setStatus("checking");
      debugLogger.log("VerifyDbConnection", "Vérification de la connexion à la base de données...");
      
      const { data, error } = await supabase
        .from("meal_suggestions")
        .select("count()", { count: "exact" })
        .limit(1);
      
      if (error) throw error;
      
      debugLogger.log("VerifyDbConnection", "Connexion réussie", data);
      setStatus("connected");
      setError(null);
    } catch (err: any) {
      debugLogger.error("VerifyDbConnection", "Erreur de connexion", err);
      setStatus("error");
      setError(err?.message || t("nutrition.connectionError", { fallback: "Erreur de connexion à la base de données" }));
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  if (status === "connected") {
    return (
      <Card className="bg-green-500/10 border-green-500 dark:bg-green-500/5">
        <CardContent className="p-4 text-sm flex justify-between items-center">
          <span>✅ {t("nutrition.databaseConnected", { fallback: "Base de données connectée avec succès" })}</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={status === "checking" ? "bg-yellow-500/10" : "bg-red-500/10 border-red-500"}>
      <CardContent className="p-4 text-sm flex justify-between items-center">
        <div>
          {status === "checking" ? (
            <span>{t("nutrition.checkingConnection", { fallback: "Vérification de la connexion..." })}</span>
          ) : (
            <span>❌ {error || t("nutrition.connectionFailed", { fallback: "Échec de la connexion" })}</span>
          )}
        </div>
        
        {status === "error" && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={checkConnection}
          >
            {t("common.retry")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
