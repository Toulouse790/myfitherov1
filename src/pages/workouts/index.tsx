
import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { ActiveSessionCard } from "@/components/Workouts/ActiveSessionCard";
import { WorkoutTabs } from "@/components/Workouts/WorkoutTabs";

export default function Workouts() {
  const { activeSession, formatTime, sessionTime } = useWorkoutSession();
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4">
        {activeSession && (
          <ActiveSessionCard 
            activeSession={activeSession} 
            formattedTime={formatTime(sessionTime)} 
          />
        )}

        <WorkoutTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
