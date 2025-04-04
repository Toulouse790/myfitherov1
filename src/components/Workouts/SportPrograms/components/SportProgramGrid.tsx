
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgramCard } from "./ProgramCard";
import { SportProgram } from "@/utils/api/sportProgramsApi";

interface SportProgramGridProps {
  programs: SportProgram[];
  onSelectProgram: (program: SportProgram) => void;
}

export const SportProgramGrid = ({ programs, onSelectProgram }: SportProgramGridProps) => {
  const { t } = useLanguage();
  
  const recommendedPrograms = programs.filter(p => p.difficulty === 'moderate');

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
      <div className="col-span-full text-center py-10">
        <p className="text-muted-foreground">{emptyMessage}</p>
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
        {renderProgramsList(programs, t("programs.noProgramsAvailable"))}
      </TabsContent>
      
      <TabsContent value="recommended" className="pt-4">
        {renderProgramsList(recommendedPrograms, t("programs.noRecommendedPrograms"))}
      </TabsContent>
    </Tabs>
  );
};
