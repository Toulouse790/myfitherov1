
import { useState, useEffect } from "react";
import { testSupabaseConnection } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export const ConnexionTest = () => {
  const [testResult, setTestResult] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ status: "idle" });

  const runConnectionTest = async () => {
    setTestResult({ status: "loading" });
    
    try {
      const result = await testSupabaseConnection();
      
      if (result.success) {
        setTestResult({ 
          status: "success", 
          message: "Connexion à Supabase établie avec succès" 
        });
      } else {
        setTestResult({ 
          status: "error", 
          message: `Erreur de connexion: ${result.error?.message || "Raison inconnue"}` 
        });
      }
    } catch (error) {
      setTestResult({ 
        status: "error", 
        message: `Exception: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
      });
    }
  };

  // Exécuter le test automatiquement au chargement
  useEffect(() => {
    runConnectionTest();
  }, []);

  return (
    <Card className="shadow-md bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Test de connexion à Supabase</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            {testResult.status === "loading" && (
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            )}
            {testResult.status === "success" && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {testResult.status === "error" && (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span>
              {testResult.status === "loading" && "Test en cours..."}
              {testResult.status === "success" && testResult.message}
              {testResult.status === "error" && testResult.message}
            </span>
          </div>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={runConnectionTest}
            disabled={testResult.status === "loading"}
          >
            {testResult.status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Test en cours
              </>
            ) : "Tester à nouveau"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
