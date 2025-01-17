import { Header } from "@/components/Layout/Header";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";

export default function Suggestions() {
  return (
    <Header>
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="space-y-8">
          <h1 className="text-2xl font-bold">Suggestions d'entraînement</h1>
          <WorkoutSuggestions showAllSuggestions={true} />
        </div>
      </div>
    </Header>
  );
}