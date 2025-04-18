
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

  const handleGenerateProgram = (program: SportProgram) => {
    debugLogger.log("SportProgramGrid", `Génération du programme: ${program.name}`);
    
    setGeneratingPrograms(prev => [...prev, program.id]);
    
    setTimeout(() => {
      try {
        const generatedProgram = {
          ...program,
          generatedAt: new Date().toISOString()
        };

        toast({
          title: t("programs.programGenerated"),
          description: t("programs.programGeneratedDescription", { name: program.name }),
        });
        
        onSelectProgram(generatedProgram);
        
        setGeneratingPrograms(prev => prev.filter(id => id !== program.id));
        
        debugLogger.log("SportProgramGrid", `Programme généré avec succès: ${program.name}`);
      } catch (error) {
        debugLogger.error("SportProgramGrid", "Erreur de génération", error);
        
        toast({
          title: t("workouts.errors.sessionCreationFailed"),
          description: t("workouts.errors.sessionCreationError"),
          variant: "destructive",
        });
        
        setGeneratingPrograms(prev => prev.filter(id => id !== program.id));
      }
    }, 1500);
  };

  const handleStartProgram = (program: SportProgram) => {
    debugLogger.log("SportProgramGrid", "Démarrage du programme:", program.name);
    
    toast({
      title: t("programs.programStarted"),
      description: t("programs.programStartedDescription", { name: program.name }),
    });
    
    onSelectProgram(program);
  };

  const filteredPrograms = levelFilter === "all" 
    ? programs 
    : programs.filter(program => program.difficulty === levelFilter);

  let displayPrograms = filteredPrograms;
  
  if (filteredPrograms.length === 0) {
    if (levelFilter === "all") {
      displayPrograms = generateDemoProgramsForAllLevels();
    } else {
      displayPrograms = [generateDemoProgram(levelFilter)];
    }
  }

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
