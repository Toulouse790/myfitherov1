import { TrainingPreferences } from "@/components/Profile/Sections/TrainingPreferences";

const TrainingPreferencesPage = () => {
  return (
    <div className="container mx-auto p-4 space-y-6 pb-24">
      <h1 className="text-2xl font-bold">Préférences d'entraînement</h1>
      <TrainingPreferences />
    </div>
  );
};

export default TrainingPreferencesPage;