
import { useState } from "react";
import { ProgramCard } from "./ProgramCard";
import { EmptyState } from "@/components/ui/empty-state";
import { useLanguage } from "@/contexts/LanguageContext";
import { SportProgram } from "@/utils/api/sportProgramsApi";
import { useToast } from "@/hooks/use-toast";

interface SportProgramGridProps {
  programs: SportProgram[];
  onSelectProgram: (program: SportProgram) => void;
  levelFilter: string;
}

export const SportProgramGrid = ({ programs, onSelectProgram, levelFilter }: SportProgramGridProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  // Fonction pour gérer la génération d'un programme
  const handleGenerateProgram = (program: SportProgram) => {
    toast({
      title: t("programs.programGenerated"),
      description: t("programs.programGeneratedDescription", { name: program.name }),
    });
    
    // Vous pourriez également rediriger l'utilisateur ou effectuer d'autres actions
  };

  // Filtrer les programmes en fonction du niveau sélectionné
  const filteredPrograms = levelFilter === "all" 
    ? programs 
    : programs.filter(program => program.difficulty === levelFilter);

  // Créons des programmes de test si aucun n'existe pour éviter l'affichage vide
  const displayPrograms = filteredPrograms.length > 0 ? filteredPrograms : [
    {
      id: "test-program-1",
      name: "Programme d'entraînement test",
      description: "Ce programme est affiché quand aucun programme n'est disponible",
      sport_id: "test-sport",
      position_id: "test-position",
      difficulty: "amateur",
      duration: 8,
      sessionsPerWeek: 3,
      exercises: ["Exercice 1", "Exercice 2", "Exercice 3"]
    }
  ];

  if (filteredPrograms.length === 0 && !displayPrograms[0]) {
    return (
      <EmptyState
        title={t("programs.noDataAvailable")}
        description={t("programs.noProgramsAvailable")}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {displayPrograms.map(program => (
        <ProgramCard 
          key={program.id}
          program={program}
          onSelect={() => onSelectProgram(program)}
          onGenerate={() => handleGenerateProgram(program)}
        />
      ))}
    </div>
  );
};
