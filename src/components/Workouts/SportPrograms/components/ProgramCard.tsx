
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Clock, Dumbbell, ChevronDown, ChevronUp } from "lucide-react";
import { SportProgram } from "@/utils/api/sportProgramsApi";
import { cn } from "@/lib/utils";

interface ProgramCardProps {
  program: SportProgram;
  onSelect: () => void;
}

export const ProgramCard = ({ program, onSelect }: ProgramCardProps) => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const difficultyColor = {
    amateur: "bg-green-500/10 text-green-600 border-green-200",
    "semi-pro": "bg-orange-500/10 text-orange-600 border-orange-200",
    pro: "bg-blue-500/10 text-blue-600 border-blue-200",
  };

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{program.name}</CardTitle>
          <Badge 
            variant="outline" 
            className={cn("ml-2", difficultyColor[program.difficulty as keyof typeof difficultyColor])}
          >
            {t(`programs.level${program.difficulty.charAt(0).toUpperCase() + program.difficulty.slice(1)}`)}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {program.description}
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-3 mb-2">
          <div className="flex items-center gap-1.5 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{program.duration} {t("programs.weeks")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{program.sessionsPerWeek} {t("programs.sessionsPerWeek")}</span>
          </div>
        </div>
        
        {expanded && (
          <div className="mt-3 pt-3 border-t">
            <h4 className="font-medium text-sm mb-2">{t("programs.programObjectives")}:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
              {program.exercises?.slice(0, 4).map((exercise, idx) => (
                <li key={idx}>
                  {exercise.name || (typeof exercise === "string" ? exercise : "")}
                </li>
              ))}
              {program.exercises && program.exercises.length > 4 && (
                <li className="list-none font-medium">{t("programs.andMoreExercises", { count: program.exercises.length - 4 })}</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleExpand} 
          className="text-xs gap-1 p-0 h-auto"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              {t("programs.showLess")}
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              {t("programs.showMore")}
            </>
          )}
        </Button>
        
        <Button size="sm" onClick={onSelect} className="gap-1">
          <Dumbbell className="h-4 w-4" />
          {t("programs.startProgram")}
        </Button>
      </CardFooter>
    </Card>
  );
};
