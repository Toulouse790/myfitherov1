import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MealPlanFormProps {
  onSubmit: (dietType: string) => void;
}

export const MealPlanForm = ({ onSubmit }: MealPlanFormProps) => {
  const [dietType, setDietType] = useState("balanced");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(dietType);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Card className="p-2">
        <div>
          <Label>Type de régime</Label>
          <RadioGroup value={dietType} onValueChange={setDietType} className="mt-1">
            <div className={`flex items-center space-x-1 p-1 rounded-lg transition-colors ${dietType === 'balanced' ? 'bg-primary/10 border border-primary' : 'hover:bg-muted/50'}`}>
              <RadioGroupItem value="balanced" id="balanced" />
              <Label htmlFor="balanced" className="flex-grow cursor-pointer">Équilibré</Label>
            </div>
            <div className={`flex items-center space-x-1 p-1 rounded-lg transition-colors ${dietType === 'highProtein' ? 'bg-primary/10 border border-primary' : 'hover:bg-muted/50'}`}>
              <RadioGroupItem value="highProtein" id="highProtein" />
              <Label htmlFor="highProtein" className="flex-grow cursor-pointer">Prise de masse</Label>
            </div>
            <div className={`flex items-center space-x-1 p-1 rounded-lg transition-colors ${dietType === 'lowCarb' ? 'bg-primary/10 border border-primary' : 'hover:bg-muted/50'}`}>
              <RadioGroupItem value="lowCarb" id="lowCarb" />
              <Label htmlFor="lowCarb" className="flex-grow cursor-pointer">Sèche extrême</Label>
            </div>
          </RadioGroup>
        </div>
        <Button type="submit" className="w-full mt-2">
          Générer mon plan
        </Button>
      </Card>
    </form>
  );
};