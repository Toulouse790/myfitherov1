import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface TrainingLocationStepProps {
  trainingLocation: string[];
  onTrainingLocationChange: (value: string[]) => void;
}

export const TrainingLocationStep = ({
  trainingLocation,
  onTrainingLocationChange,
}: TrainingLocationStepProps) => {
  const handleLocationChange = (location: string, checked: boolean) => {
    if (checked) {
      // Limit to 2 selections
      if (trainingLocation.length < 2) {
        onTrainingLocationChange([...trainingLocation, location]);
      }
    } else {
      onTrainingLocationChange(trainingLocation.filter(loc => loc !== location));
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Où préférez-vous vous entraîner ? (2 choix maximum)</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="home" 
            checked={trainingLocation.includes('home')}
            onCheckedChange={(checked) => handleLocationChange('home', checked as boolean)}
            disabled={trainingLocation.length >= 2 && !trainingLocation.includes('home')}
          />
          <Label htmlFor="home">À la maison</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="gym" 
            checked={trainingLocation.includes('gym')}
            onCheckedChange={(checked) => handleLocationChange('gym', checked as boolean)}
            disabled={trainingLocation.length >= 2 && !trainingLocation.includes('gym')}
          />
          <Label htmlFor="gym">En salle de sport</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="outdoor" 
            checked={trainingLocation.includes('outdoor')}
            onCheckedChange={(checked) => handleLocationChange('outdoor', checked as boolean)}
            disabled={trainingLocation.length >= 2 && !trainingLocation.includes('outdoor')}
          />
          <Label htmlFor="outdoor">En extérieur</Label>
        </div>
      </div>
    </div>
  );
};