
import { useEffect, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { testSupabaseConnection } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { useLanguage } from "@/contexts/LanguageContext";

export const VerifyConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useLanguage();

  const checkConnection = async () => {
    try {
      debugLogger.log('VerifyConnection', 'Vérification de la connexion à Supabase...');
      setConnectionStatus('checking');
      
      const { success, error } = await testSupabaseConnection();
      
      if (success) {
        debugLogger.log('VerifyConnection', 'Connexion à Supabase réussie');
        setConnectionStatus('connected');
        setErrorMessage(null);
      } else {
        debugLogger.error('VerifyConnection', 'Erreur de connexion à Supabase', error);
        setConnectionStatus('error');
        setErrorMessage(error?.message || t('workouts.errors.connectionFailed', { fallback: "Échec de connexion à la base de données" }));
      }
    } catch (error) {
      debugLogger.error('VerifyConnection', 'Exception lors de la vérification de connexion', error);
      setConnectionStatus('error');
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : t('workouts.errors.unknownError', { fallback: "Erreur inconnue lors de la connexion" })
      );
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  if (connectionStatus === 'connected') {
    return null;
  }

  return (
    <Alert variant={connectionStatus === 'checking' ? 'default' : 'destructive'} className="mb-4">
      <AlertTitle>
        {connectionStatus === 'checking' 
          ? t('workouts.connectionVerification', { fallback: "Vérification de la connexion..." })
          : t('workouts.connectionError', { fallback: "Problème de connexion" })}
      </AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <div>
          {connectionStatus === 'checking' 
            ? t('workouts.verifyingConnection', { fallback: "Vérification de la connexion à la base de données..." })
            : errorMessage || t('workouts.connectionProblem', { fallback: "Impossible de se connecter à la base de données" })}
        </div>
        {connectionStatus === 'error' && (
          <Button size="sm" variant="outline" onClick={checkConnection} className="self-start mt-2">
            {t('common.retry', { fallback: "Réessayer" })}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
