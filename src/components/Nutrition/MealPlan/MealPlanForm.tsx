import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface MealPlanFormProps {
  durationDays: string;
  maxBudget: string;
  isGenerating: boolean;
  onDurationChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
  onGenerate: () => void;
}

export const MealPlanForm = ({
  durationDays,
  maxBudget,
  isGenerating,
  onDurationChange,
  onBudgetChange,
  onGenerate,
}: MealPlanFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Durée du plan</Label>
          <Select value={durationDays} onValueChange={onDurationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner la durée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 jours</SelectItem>
              <SelectItem value="14">14 jours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Budget maximum (€)</Label>
          <Input
            id="budget"
            type="number"
            value={maxBudget}
            onChange={(e) => onBudgetChange(e.target.value)}
            placeholder="Budget en euros"
          />
        </div>
      </div>

      <Button
        onClick={onGenerate}
        className="w-full"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Génération en cours...
          </>
        ) : (
          "Générer un nouveau plan"
        )}
      </Button>
    </div>
  );
};