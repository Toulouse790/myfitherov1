
import { useEffect } from "react";
import { SportProgramFilters } from "./components/SportProgramFilters";
import { SportProgramGrid } from "./components/SportProgramGrid";
import { useSportPrograms } from "./hooks/useSportPrograms";
import { debugLogger } from "@/utils/debug-logger";

export const SportProgramsList = () => {
  const { 
    sports,
    positions,
    programs,
    selectedSport,
    selectedPosition,
    isLoading,
    setSelectedSport,
    setSelectedPosition,
    handleProgramSelect
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
        <p className="mt-4 text-muted-foreground">Chargement...</p>
      </div>
    );
  }
  
  // Si pas de sport disponibles
  if (sports.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Aucun sport disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
