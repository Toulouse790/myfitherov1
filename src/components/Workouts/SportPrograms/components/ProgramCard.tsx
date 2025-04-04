
import { useLanguage } from "@/contexts/LanguageContext";
import { WorkoutCard } from "@/components/Dashboard/WorkoutSuggestions/WorkoutCard";
import { SportProgram } from "@/utils/api/sportProgramsApi";

interface ProgramCardProps {
  program: SportProgram;
  onSelect: () => void;
}

export const ProgramCard = ({ program, onSelect }: ProgramCardProps) => {
  return (
    <WorkoutCard
      title={program.name}
      description={program.description}
      programId={program.id}
      duration={program.duration}
      difficulty={program.difficulty}
      onSelect={onSelect}
    />
  );
};
