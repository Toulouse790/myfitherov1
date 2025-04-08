
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const VerifyDbConnection = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Vérifier la connexion à la base de données
      const { data: suggData, error: suggError } = await supabase
        .from('meal_suggestions')
        .select('*')
        .limit(5);

      if (suggError) throw suggError;
      
      setSuggestions(suggData || []);
      
      toast({
        title: "Connexion réussie",
        description: `${suggData?.length || 0} suggestions trouvées`,
      });
    } catch (err: any) {
      console.error("Erreur lors de la vérification:", err);
      setError(err.message || "Erreur inconnue");
      toast({
        title: "Erreur de connexion",
        description: err.message || "Erreur lors de la connexion à la base de données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch on component mount
    fetchSuggestions();
  }, []);

  const testAuthStatus = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      toast({
        title: "Statut d'authentification",
        description: data.session ? "Utilisateur authentifié" : "Non authentifié",
      });
      
      console.log("Auth status:", data.session ? "Authenticated" : "Not authenticated");
      console.log("User:", data.session?.user);
    } catch (err: any) {
      console.error("Erreur d'authentification:", err);
      toast({
        title: "Erreur d'authentification",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnostic de connexion à la base de données</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={fetchSuggestions} disabled={loading}>
              {loading ? "Chargement..." : "Tester la connexion aux meal_suggestions"}
            </Button>
            <Button onClick={testAuthStatus} variant="outline">
              Vérifier l'authentification
            </Button>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
              <p className="font-semibold">Erreur détectée:</p>
              <p>{error}</p>
            </div>
          )}
          
          {suggestions.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Suggestions récupérées ({suggestions.length}):</h3>
              <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto max-h-60">
                {JSON.stringify(suggestions, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
