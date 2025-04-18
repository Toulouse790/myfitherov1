
import { useState } from "react";
import { ProgramCard } from "./ProgramCard";
import { EmptyState } from "@/components/ui/empty-state";
import { useLanguage } from "@/contexts/LanguageContext";
import { SportProgram } from "@/utils/api/sportProgramsApi";
import { useToast } from "@/hooks/use-toast";
import { debugLogger } from "@/utils/debug-logger";

interface SportProgramGridProps {
  programs: SportProgram[];
  onSelectProgram: (program: SportProgram) => void;
  levelFilter: string;
}

export const SportProgramGrid = ({ programs, onSelectProgram, levelFilter }: SportProgramGridProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [generatingPrograms, setGeneratingPrograms] = useState<string[]>([]);

  // Fonction pour gérer la génération d'un programme
  const handleGenerateProgram = (program: SportProgram) => {
    debugLogger.log("SportProgramGrid", "Génération du programme:", program.name);
    
    // Ajouter l'ID du programme en cours de génération
    setGeneratingPrograms(prev => [...prev, program.id]);
    
    // Simuler une génération avec un délai pour montrer qu'il se passe quelque chose
    setTimeout(() => {
      // Afficher le toast avec le message approprié traduit
      toast({
        title: t("programs.programGenerated"),
        description: t("programs.programGeneratedDescription", { name: program.name }),
      });
      
      // Retirer l'ID du programme de la liste des programmes en cours de génération
      setGeneratingPrograms(prev => prev.filter(id => id !== program.id));
      
      debugLogger.log("SportProgramGrid", "Programme généré avec succès:", program.name);
    }, 1500);
  };

  // Fonction pour gérer le lancement d'un programme
  const handleStartProgram = (program: SportProgram) => {
    debugLogger.log("SportProgramGrid", "Démarrage du programme:", program.name);
    onSelectProgram(program);
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
          onSelect={() => handleStartProgram(program)}
          onGenerate={() => handleGenerateProgram(program)}
          isGenerating={generatingPrograms.includes(program.id)}
        />
      ))}
      
      {displayPrograms.length === 0 && (
        <div className="col-span-2">
          <EmptyState
            title={t("programs.noPrograms")}
            description={t("programs.noProgramsDescription")}
          />
        </div>
      )}
    </div>
  );
};
