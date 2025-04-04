
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

  if (filteredPrograms.length === 0) {
    return (
      <EmptyState
        title={t("programs.noDataAvailable")}
        description={t("programs.noProgramsAvailable")}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {filteredPrograms.map(program => (
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
