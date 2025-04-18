
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Dumbbell, Zap } from "lucide-react";
import { SportProgram } from "@/utils/api/sportProgramsApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface ProgramCardProps {
  program: SportProgram;
  onSelect: () => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export const ProgramCard = ({ program, onSelect, onGenerate, isGenerating = false }: ProgramCardProps) => {
  const { t } = useLanguage();
  const [showMore, setShowMore] = useState(false);

  // Obtenir la couleur du badge en fonction de la difficulté
  const getBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'amateur':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'semi-pro':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'pro':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  // Obtenir le texte du badge en fonction de la difficulté
  const getBadgeText = (difficulty: string) => {
    switch (difficulty) {
      case 'amateur':
        return t("programs.levelAmateur");
      case 'semi-pro':
        return t("programs.levelSemiPro");
      case 'pro':
        return t("programs.levelPro");
      default:
        return difficulty;
    }
  };

  // Couper le texte de description s'il est trop long
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-1">
          <CardTitle className="text-base sm:text-lg line-clamp-1">{program.name}</CardTitle>
          <Badge className={`${getBadgeColor(program.difficulty)} text-xs px-2 py-0.5`}>
            {getBadgeText(program.difficulty)}
          </Badge>
        </div>
        <CardDescription className="text-xs sm:text-sm line-clamp-2">
          {showMore ? program.description : truncateText(program.description, 80)}
        </CardDescription>
        {program.description && program.description.length > 80 && (
          <button 
            onClick={() => setShowMore(!showMore)} 
            className="text-xs text-primary hover:underline mt-1"
          >
            {showMore ? t("programs.showLess") : t("programs.showMore")}
          </button>
        )}
      </CardHeader>
      
      <CardContent className="pb-0 flex-grow">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary/70" />
            <span className="text-xs">{program.duration} {t("programs.weeks")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Dumbbell className="h-3.5 w-3.5 text-primary/70" />
            <span className="text-xs">{program.sessionsPerWeek} {t("programs.sessionsPerWeek")}</span>
          </div>
        </div>
        
        <div className="mt-3">
          <h4 className="text-xs font-medium mb-2">{t("programs.programObjectives")}</h4>
          <ul className="space-y-1">
            {program.exercises && program.exercises.slice(0, 3).map((exercise, index) => (
              <li key={index} className="text-xs text-muted-foreground pl-2 border-l-2 border-primary/10">
                {exercise}
              </li>
            ))}
            {program.exercises && program.exercises.length > 3 && (
              <li className="text-xs text-muted-foreground italic">
                {t("programs.andMoreExercises", { count: program.exercises.length - 3 })}
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 h-8 text-xs" 
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
              {t("workouts.generationLoading")}
            </>
          ) : (
            <>
              <Zap className="h-3 w-3 mr-1.5" />
              {t("programs.generateProgram")}
            </>
          )}
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1 h-8 text-xs" 
          onClick={onSelect}
        >
          {t("programs.startProgram")}
        </Button>
      </CardFooter>
    </Card>
  );
};
