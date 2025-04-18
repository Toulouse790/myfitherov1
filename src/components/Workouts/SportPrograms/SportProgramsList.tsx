
import { useEffect, useState } from "react";
import { SportProgramFilters } from "./components/SportProgramFilters";
import { SportProgramGrid } from "./components/SportProgramGrid";
import { ProgramProgress } from "./components/ProgramProgress";
import { useSportPrograms } from "./hooks/useSportPrograms";
import { debugLogger } from "@/utils/debug-logger";
import { Button } from "@/components/ui/button";
import { RefreshCw, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SportProgram } from "@/utils/api/sportProgramsApi";

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
    refreshData,
    activePrograms
  } = useSportPrograms();
  
  const [selectedLevel, setSelectedLevel] = useState("all");
  
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
        <Button 
          onClick={refreshData}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 ml-auto"
        >
          <RefreshCw size={16} />
          {t("common.refresh")}
        </Button>
      </div>
      
      {/* Afficher les programmes actifs de l'utilisateur */}
      {activePrograms.map((program: SportProgram) => (
        <ProgramProgress 
          key={program.id}
          programId={program.id}
          programName={program.name}
          totalDuration={program.duration}
          sessionsPerWeek={program.sessionsPerWeek || 3}
        />
      ))}
      
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
        selectedLevel={selectedLevel}
        setSelectedSport={setSelectedSport}
        setSelectedPosition={setSelectedPosition}
        setSelectedLevel={setSelectedLevel}
        isLoading={isLoading}
      />
      
      <SportProgramGrid 
        programs={programs} 
        onSelectProgram={handleProgramSelect} 
        levelFilter={selectedLevel}
      />
    </div>
  );
};
