import { Card } from "@/components/ui/card";
import { TrainingPreferences as TrainingPreferencesComponent } from "@/components/Profile/Sections/Training/TrainingPreferences";

const TrainingPreferences = () => {
  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <h1 className="text-2xl font-bold mb-6">Préférences d'entraînement</h1>
      <TrainingPreferencesComponent />
    </div>
  );
};

export default TrainingPreferences;