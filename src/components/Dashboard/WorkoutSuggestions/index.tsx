
import { useState } from "react";
import { GenerateWorkoutDialog } from "./GenerateWorkoutDialog";
import { useWorkoutSuggestions } from "./hooks/useWorkoutSuggestions";
import { SuggestionsGrid } from "./SuggestionsGrid";
import { SportProgramsSection } from "./SportProgramsSection";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { WorkoutSuggestionsProps } from "./types";

export const WorkoutSuggestions = ({ showAllSuggestions = true }: WorkoutSuggestionsProps) => {
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const { t } = useLanguage();
  const { localSuggestions, isLoading } = useWorkoutSuggestions();

  const handleSelectWorkout = (type: string) => {
    setSelectedType(type);
    setIsGenerateOpen(true);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const displayedSuggestions = showAllSuggestions 
    ? localSuggestions 
    : localSuggestions.slice(0, 3);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">{t("workouts.startWorkout")}</h2>
      
      <SuggestionsGrid 
        suggestions={displayedSuggestions} 
        onSelectWorkout={handleSelectWorkout} 
      />
      
      {/* Réduit en importance */}
      {showAllSuggestions && <SportProgramsSection />}
      
      <GenerateWorkoutDialog
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        workoutType={selectedType}
      />
    </div>
  );
};
