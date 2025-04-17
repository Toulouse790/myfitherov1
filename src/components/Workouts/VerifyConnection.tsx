
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { debugLogger } from "@/utils/debug-logger";

export const VerifyConnection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const testDatabaseConnection = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      debugLogger.log("VerifyConnection", "Test de connexion à la base de données");
      
      const { data: connectionTest, error: connectionError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
        
      if (connectionError) {
        throw connectionError;
      }
      
      // Tester la table workout_sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('workout_sessions')
        .select('*')
        .limit(5);
        
      // Tester la table user_exercise_weights
      const { data: weightsData, error: weightsError } = await supabase
        .from('user_exercise_weights')
        .select('*')
        .limit(5);
      
      // Rassembler les résultats
      const results = {
        connection: "Succès",
        profiles: connectionTest,
        sessions: sessionsError ? `Erreur: ${sessionsError.message}` : sessionsData,
        weights: weightsError ? `Erreur: ${weightsError.message}` : weightsData
      };
      
      setResults(results);
      
      toast({
        title: "Connexion réussie",
        description: "Connexion à la base de données Supabase établie avec succès",
      });
    } catch (err: any) {
      debugLogger.error("VerifyConnection", "Erreur de connexion:", err);
      setError(err.message || "Erreur inconnue");
      
      toast({
        title: "Erreur de connexion",
        description: err.message || "Impossible de se connecter à la base de données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testAuthStatus = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Statut d'authentification",
        description: session ? "Utilisateur authentifié" : "Non authentifié",
      });
      
      debugLogger.log("VerifyConnection", "Statut d'authentification:", session ? "Authentifié" : "Non authentifié");
      
      if (session) {
        setResults(prev => ({
          ...prev,
          authStatus: {
            authenticated: true,
            user: session.user
          }
        }));
      } else {
        setResults(prev => ({
          ...prev,
          authStatus: {
            authenticated: false
          }
        }));
      }
    } catch (err: any) {
      debugLogger.error("VerifyConnection", "Erreur d'authentification:", err);
      
      toast({
        title: "Erreur d'authentification",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // Exécuter le test automatiquement au chargement du composant
  useEffect(() => {
    testDatabaseConnection();
  }, []);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Diagnostic de Connexion</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testDatabaseConnection} disabled={loading}>
              {loading ? "Vérification..." : "Tester la Connexion à la Base de Données"}
            </Button>
            
            <Button onClick={testAuthStatus} variant="outline">
              Vérifier l'Authentification
            </Button>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
              <p className="font-semibold">Erreur détectée:</p>
              <p>{error}</p>
            </div>
          )}
          
          {user && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 p-3 rounded-md text-sm mb-3">
              <p className="font-semibold">Utilisateur connecté:</p>
              <p>ID: {user.id}</p>
              <p>Email: {user.email}</p>
            </div>
          )}
          
          {results && (
            <div>
              <h3 className="text-sm font-medium mb-2">Résultats:</h3>
              <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-xs overflow-auto max-h-60">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
