
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgramCard } from "./ProgramCard";
import { SportProgram } from "@/utils/api/sportProgramsApi";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SportProgramGridProps {
  programs: SportProgram[];
  onSelectProgram: (program: SportProgram) => void;
  levelFilter: string;
}

export const SportProgramGrid = ({ programs, onSelectProgram, levelFilter }: SportProgramGridProps) => {
  const { t } = useLanguage();
  
  // Filtrer par niveau si un niveau est sélectionné
  const filteredPrograms = levelFilter === 'all' 
    ? programs 
    : programs.filter(p => p.difficulty === levelFilter);
  
  const recommendedPrograms = filteredPrograms.filter(p => p.difficulty === 'moderate');

  const renderProgramsList = (programsList: SportProgram[], emptyMessage: string) => {
    if (programsList.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programsList.map(program => (
            <ProgramCard
              key={program.id}
              program={program}
              onSelect={() => onSelectProgram(program)}
            />
          ))}
        </div>
      );
    }
    
    return (
      <div className="col-span-full text-center py-6">
        <Alert variant="default" className="bg-muted/40 border-muted">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
          <AlertTitle className="text-foreground">{t("programs.noDataAvailable")}</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            {emptyMessage}
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  return (
    <Tabs defaultValue="all">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="all">{t("programs.all")}</TabsTrigger>
        <TabsTrigger value="recommended">{t("programs.recommended")}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="pt-4">
        {renderProgramsList(filteredPrograms, t("programs.noProgramsAvailable"))}
      </TabsContent>
      
      <TabsContent value="recommended" className="pt-4">
        {renderProgramsList(recommendedPrograms, t("programs.noRecommendedPrograms"))}
      </TabsContent>
    </Tabs>
  );
};
