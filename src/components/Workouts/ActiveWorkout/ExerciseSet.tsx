
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseSetProps {
  exerciseName: string;
  onComplete: () => void;
}

export const ExerciseSet = ({ exerciseName, onComplete }: ExerciseSetProps) => {
  const { t } = useLanguage();
  const [sets, setSets] = useState([{ reps: 12, weight: 20, completed: false }]);

  const addSet = () => {
    setSets(prev => [...prev, { reps: 12, weight: 20, completed: false }]);
  };

  const removeSet = (index: number) => {
    setSets(prev => prev.filter((_, i) => i !== index));
  };

  const updateSet = (index: number, field: 'reps' | 'weight', value: number) => {
    setSets(prev => prev.map((set, i) => 
      i === index ? { ...set, [field]: value } : set
    ));
  };

  const completeSet = (index: number) => {
    setSets(prev => prev.map((set, i) => 
      i === index ? { ...set, completed: true } : set
    ));

    // Check if all sets are completed
    const allCompleted = sets.every((set, i) => 
      i === index ? true : set.completed
    );

    if (allCompleted) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{exerciseName}</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={addSet}
        >
          {t("workouts.addSet")}
        </Button>
      </div>

      <div className="space-y-4">
        {sets.map((set, index) => (
          <Card key={index} className={`p-4 ${set.completed ? 'bg-muted' : ''}`}>
            <div className="flex items-center gap-4">
              <span className="font-medium">{t("workouts.set")} {index + 1}</span>
              
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={set.reps}
                  onChange={(e) => updateSet(index, 'reps', parseInt(e.target.value))}
                  className="w-20"
                  disabled={set.completed}
                />
                <span>{t("workouts.reps")}</span>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={set.weight}
                  onChange={(e) => updateSet(index, 'weight', parseInt(e.target.value))}
                  className="w-20"
                  disabled={set.completed}
                />
                <span>kg</span>
              </div>

              <div className="flex gap-2 ml-auto">
                {!set.completed && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeSet(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => completeSet(index)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
