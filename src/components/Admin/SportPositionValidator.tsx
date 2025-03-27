
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { validateSportPositions, fixInvalidSportPositions, getSportsAndPositions, analyzeSportNameDiscrepancies } from "@/utils/sports-validator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, CheckCircle, RefreshCw, Search, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const SportPositionValidator = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [sports, setSports] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [selectedSportId, setSelectedSportId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("verification");
  const [discrepancies, setDiscrepancies] = useState<any[]>([]);
  const { toast } = useToast();

  // Chargement initial automatique
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Récupérer les sports et les positions
      const { sports, positions, error } = await getSportsAndPositions();
      
      if (error) {
        throw new Error(error);
      }
      
      setSports(sports || []);
      setPositions(positions || []);
      
      // Analyser les divergences de noms
      const { discrepancies } = await analyzeSportNameDiscrepancies();
      setDiscrepancies(discrepancies);
      
      // Exécuter la validation
      await handleValidate();
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données des sports et positions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const result = await validateSportPositions();
      setValidationResult(result);
      
      // Si on a trouvé des problèmes, sélectionner un sport par défaut
      if (!result.valid && sports.length > 0) {
        setSelectedSportId(sports[0].id);
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
        await loadData();
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="verification" className="flex-1">Vérification</TabsTrigger>
            <TabsTrigger value="explorer" className="flex-1">Explorer</TabsTrigger>
            <TabsTrigger value="discrepancies" className="flex-1">Divergences de noms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="verification">
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
                
                {!validationResult.valid && validationResult.invalidPositions?.length > 0 && (
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
          </TabsContent>
          
          <TabsContent value="explorer">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-6">
                <Accordion type="single" collapsible>
                  <AccordionItem value="sports">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <span>Sports ({sports.length})</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Catégorie</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sports.map((sport) => (
                            <TableRow key={sport.id}>
                              <TableCell className="font-mono text-xs">{sport.id}</TableCell>
                              <TableCell>{sport.name}</TableCell>
                              <TableCell>{sport.type}</TableCell>
                              <TableCell>{sport.category}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="positions">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <span>Positions ({positions.length})</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Sport</TableHead>
                            <TableHead>Sport ID</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {positions.map((position) => (
                            <TableRow key={position.id}>
                              <TableCell className="font-mono text-xs">{position.id}</TableCell>
                              <TableCell>{position.name}</TableCell>
                              <TableCell>
                                {position.sports?.name || (
                                  <Badge variant="destructive">Sport non trouvé</Badge>
                                )}
                              </TableCell>
                              <TableCell className="font-mono text-xs">{position.sport_id}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="discrepancies">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-950/50 rounded-md border border-amber-200 dark:border-amber-800">
                  <Info className="h-5 w-5 text-amber-500" />
                  <p className="text-sm">
                    Cette section détecte les sports qui pourraient avoir des noms différents 
                    dans l'interface et la base de données, causant des problèmes d'association.
                  </p>
                </div>

                {discrepancies.length === 0 ? (
                  <div className="p-4 bg-green-50 dark:bg-green-950/50 rounded-md border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <p className="text-sm">Aucune divergence de noms détectée.</p>
                    </div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Forme de base</TableHead>
                        <TableHead>Variations trouvées</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {discrepancies.map((discrepancy, index) => (
                        <TableRow key={index}>
                          <TableCell>{discrepancy.baseForm}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {discrepancy.variations.map((variation: string, i: number) => (
                                <Badge key={i} variant="outline">{variation}</Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Conseils de résolution:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Assurez-vous d'utiliser exactement le même nom de sport dans le code et la base de données</li>
                    <li>Si le nom diffère entre l'interface ("Rugby à XV") et la base ("Rugby"), mettez à jour la base</li>
                    <li>Utilisez l'onglet Explorer pour voir les noms exacts des sports et positions dans la base</li>
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={loadData} 
          disabled={isValidating || isLoading}
          variant={validationResult?.valid ? "outline" : "default"}
        >
          {isValidating || isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement en cours...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Recharger les données
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
