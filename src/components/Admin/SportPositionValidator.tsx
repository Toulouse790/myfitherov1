
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { validateSportPositions, fixInvalidSportPositions } from "@/utils/sports-validator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const SportPositionValidator = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [sports, setSports] = useState<any[]>([]);
  const [selectedSportId, setSelectedSportId] = useState<string>("");
  const { toast } = useToast();

  // Chargement initial automatique
  useEffect(() => {
    handleValidate();
  }, []);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const result = await validateSportPositions();
      setValidationResult(result);
      
      // Si on a trouvé des problèmes, charger les sports pour la correction
      if (!result.valid) {
        fetchSports();
      }
      
      toast({
        title: result.valid ? "Validation réussie" : "Problèmes détectés",
        description: result.message,
        variant: result.valid ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la validation",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const fetchSports = async () => {
    try {
      const { data } = await supabase
        .from('sports')
        .select('id, name')
        .order('name');
      
      if (data && data.length > 0) {
        setSports(data);
        setSelectedSportId(data[0].id);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des sports:", error);
    }
  };

  const handleFix = async () => {
    if (!selectedSportId) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner un sport par défaut",
        variant: "destructive",
      });
      return;
    }

    setIsFixing(true);
    try {
      const result = await fixInvalidSportPositions(selectedSportId);
      
      toast({
        title: result.success ? "Correction réussie" : "Échec de la correction",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
      
      // Revalider après la correction
      if (result.success && result.fixedCount > 0) {
        await handleValidate();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la correction",
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Validation Sport-Postes</CardTitle>
        <CardDescription>
          Vérifiez que tous les postes sont correctement associés à des sports valides
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isValidating && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {validationResult && !isValidating && (
          <div className="mb-6 p-4 rounded-md border bg-card">
            <div className="flex items-center gap-2 mb-2">
              {validationResult.valid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
              <h3 className="font-medium">{validationResult.message}</h3>
            </div>
            
            {!validationResult.valid && validationResult.invalidPositions.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Postes avec problèmes :</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {validationResult.invalidPositions.slice(0, 5).map((pos: any) => (
                    <li key={pos.id} className="text-sm text-muted-foreground">
                      {pos.name} (ID: {pos.id}, Sport ID: {pos.sport_id || "non défini"})
                    </li>
                  ))}
                  {validationResult.invalidPositions.length > 5 && (
                    <li className="text-sm text-muted-foreground italic">
                      Et {validationResult.invalidPositions.length - 5} autres...
                    </li>
                  )}
                </ul>

                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Sport pour la correction :</h4>
                    <Select value={selectedSportId} onValueChange={setSelectedSportId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un sport" />
                      </SelectTrigger>
                      <SelectContent>
                        {sports.map(sport => (
                          <SelectItem key={sport.id} value={sport.id}>
                            {sport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleFix} 
                    disabled={isFixing || !selectedSportId}
                    className="w-full"
                  >
                    {isFixing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Correction en cours...
                      </>
                    ) : (
                      "Corriger les associations"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={handleValidate} 
          disabled={isValidating}
          variant={validationResult?.valid ? "outline" : "default"}
        >
          {isValidating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Validation en cours...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Revérifier les associations
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
