
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

  // Si aucun programme disponible, utilisez les programmes de démonstration
  // qui correspondent au filtre de niveau
  let displayPrograms = filteredPrograms;
  
  if (filteredPrograms.length === 0) {
    // Créer des programmes de démonstration pour le niveau sélectionné
    if (levelFilter === "all") {
      displayPrograms = generateDemoProgramsForAllLevels();
    } else {
      displayPrograms = [generateDemoProgram(levelFilter)];
    }
  }

  // Fonction pour générer un programme de démonstration pour un niveau spécifique
  function generateDemoProgram(difficulty: string): SportProgram {
    const difficultyDetails = {
      "amateur": {
        duration: 8,
        sessionsPerWeek: 3,
        description: "Programme adapté aux débutants avec des exercices fondamentaux"
      },
      "semi-pro": {
        duration: 10,
        sessionsPerWeek: 4,
        description: "Programme intermédiaire avec des exercices plus avancés"
      },
      "pro": {
        duration: 12,
        sessionsPerWeek: 5,
        description: "Programme intensif pour athlètes expérimentés"
      }
    };
    
    const details = difficultyDetails[difficulty as keyof typeof difficultyDetails];
    
    return {
      id: `demo-program-${difficulty}`,
      name: `Programme ${difficulty}`,
      description: details.description,
      sport_id: "demo-sport",
      position_id: "demo-position",
      difficulty: difficulty,
      duration: details.duration,
      sessionsPerWeek: details.sessionsPerWeek,
      exercises: Array(3).fill(0).map((_, i) => `Exercice ${difficulty} ${i+1}`)
    };
  }

  // Fonction pour générer des programmes de démonstration pour tous les niveaux
  function generateDemoProgramsForAllLevels(): SportProgram[] {
    return ["amateur", "semi-pro", "pro"].map(difficulty => generateDemoProgram(difficulty));
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
