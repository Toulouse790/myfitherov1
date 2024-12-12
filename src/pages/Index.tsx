import { Header } from "@/components/Layout/Header";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";

export default function Index() {
  return (
    <Header>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="space-y-6">
          <WorkoutSuggestions />
        </div>
      </div>
    </Header>
  );
}