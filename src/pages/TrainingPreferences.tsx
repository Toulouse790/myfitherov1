import { TrainingPreferences as TrainingPreferencesComponent } from "@/components/Profile/Sections/Training/TrainingPreferences";

const TrainingPreferencesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Préférences d'entraînement</h1>
      <TrainingPreferencesComponent />
    </div>
  );
};

export default TrainingPreferencesPage;