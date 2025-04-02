
import { useLanguage } from "@/contexts/LanguageContext";

interface SetProgressProps {
  sets: number;
  completedSets: number[];
}

export const SetProgress = ({ sets, completedSets }: SetProgressProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      {Array.from({ length: sets }, (_, i) => i + 1).map(setNumber => (
        <div 
          key={setNumber}
          className={`p-2 text-center rounded-md ${
            completedSets.includes(setNumber) 
              ? 'bg-primary/10 text-primary font-medium' 
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {t("workouts.set")} {setNumber}
        </div>
      ))}
    </div>
  );
};
