
import { useEffect, useState } from "react";
import { SportProgramFilters } from "./components/SportProgramFilters";
import { SportProgramGrid } from "./components/SportProgramGrid";
import { useSportPrograms } from "./hooks/useSportPrograms";
import { debugLogger } from "@/utils/debug-logger";
import { Button } from "@/components/ui/button";
import { RefreshCw, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const SportProgramsList = () => {
  const { t } = useLanguage();
  const { 
    sports,
    positions,
    programs,
    selectedSport,
    selectedPosition,
    isLoading,
    setSelectedSport,
    setSelectedPosition,
    handleProgramSelect,
    refreshData
  } = useSportPrograms();
  
  // Logging pour débogage
  useEffect(() => {
    if (selectedSport) {
      debugLogger.log("SportProgramsList", "Sport sélectionné: " + selectedSport + ", positions disponibles: " + (positions?.length || 0));
    }
  }, [selectedSport, positions]);

  // Affichage pendant le chargement
  if (isLoading && sports.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }
  
  // Si pas de sport disponibles
  if (sports.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">{t("sports.noSportsAvailable")}</p>
        <Button 
          onClick={refreshData}
          variant="outline"
          className="mt-4 flex items-center gap-2"
        >
          <RefreshCw size={16} />
          {t("common.refresh")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">{t("sports.availableSports", {count: sports.length})}</h2>
        <Button 
          onClick={refreshData}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          {t("common.refresh")}
        </Button>
      </div>
      
      {selectedSport && positions.length === 0 && (
        <Alert variant="default" className="bg-muted/20 border-muted">
          <Info className="h-4 w-4 text-muted-foreground" />
          <AlertDescription className="text-muted-foreground">
            {t("positions.noPositionsAvailable")}
          </AlertDescription>
        </Alert>
      )}
      
      <SportProgramFilters 
        sports={sports}
        positions={positions}
        selectedSport={selectedSport}
        selectedPosition={selectedPosition}
        setSelectedSport={setSelectedSport}
        setSelectedPosition={setSelectedPosition}
        isLoading={isLoading}
      />
      
      <SportProgramGrid 
        programs={programs} 
        onSelectProgram={handleProgramSelect} 
      />
    </div>
  );
};
