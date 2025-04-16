
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSportPositionValidator } from "./hooks/useSportPositionValidator";
import { VerificationTab } from "./tabs/VerificationTab";
import { ExplorerTab } from "./tabs/ExplorerTab";
import { DiscrepanciesTab } from "./tabs/DiscrepanciesTab";
import { EditSportTab } from "./tabs/EditSportTab";
import { useNotificationManager } from "@/hooks/use-notification-manager";

export const SportPositionValidator = () => {
  const [activeTab, setActiveTab] = useState("verification");
  const { notify } = useNotificationManager();
  
  const {
    isLoading,
    isValidating,
    validationResult,
    sports,
    positions,
    discrepancies,
    selectedSportId,
    setSelectedSportId,
    handleValidate,
    handleFix,
    handleFixRugby,
    loadData,
  } = useSportPositionValidator();

  useEffect(() => {
    loadData().catch(error => {
      notify(
        "Erreur", 
        "Impossible de charger les données de validation", 
        "error"
      );
    });
  }, []);

  const handleRefresh = () => {
    loadData().then(() => {
      notify(
        "Données rechargées", 
        "Les données de sports et positions ont été actualisées", 
        "success",
        { duration: 2000 }
      );
    }).catch(error => {
      notify(
        "Erreur", 
        "Impossible de recharger les données", 
        "error"
      );
    });
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
            <TabsTrigger value="edit" className="flex-1">Édition</TabsTrigger>
          </TabsList>
          
          <TabsContent value="verification">
            <VerificationTab 
              isValidating={isValidating}
              validationResult={validationResult}
              sports={sports}
              selectedSportId={selectedSportId}
              setSelectedSportId={setSelectedSportId}
              handleFix={handleFix}
              handleFixRugby={handleFixRugby}
            />
          </TabsContent>
          
          <TabsContent value="explorer">
            <ExplorerTab isLoading={isLoading} sports={sports} positions={positions} />
          </TabsContent>
          
          <TabsContent value="discrepancies">
            <DiscrepanciesTab isLoading={isLoading} discrepancies={discrepancies} />
          </TabsContent>

          <TabsContent value="edit">
            <EditSportTab 
              isLoading={isLoading} 
              sports={sports} 
              onSportUpdated={loadData}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={handleRefresh} 
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
