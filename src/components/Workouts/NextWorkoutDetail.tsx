
import { useParams } from "react-router-dom";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { NoSessionView } from "./NextWorkoutDetail/NoSessionView";
import { UnifiedWorkoutDetail } from "./UnifiedWorkoutDetail";

export const NextWorkoutDetail = () => {
  const { sessionId } = useParams();
  const { createWorkoutSession } = useWorkoutSession();

  if (!sessionId) {
    return <NoSessionView />;
  }

  return <UnifiedWorkoutDetail />;
};
