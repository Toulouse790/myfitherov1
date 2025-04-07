
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseNotesProps {
  notes: string;
  setNotes: (value: string) => void;
}

export const ExerciseNotes = ({ notes, setNotes }: ExerciseNotesProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t("workouts.notes") || "Notes"}</label>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={t("workouts.enterNotes") || "Entrez des notes sur cet exercice..."}
        className="h-20 resize-none"
      />
    </div>
  );
};
