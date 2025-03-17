
import { useParams } from "react-router-dom";
import { useSessionActions } from "@/hooks/workout/use-session-actions";
import { NoSessionView } from "./NextWorkoutDetail/NoSessionView";
import { UnifiedWorkoutDetail } from "./UnifiedWorkoutDetail";

export const NextWorkoutDetail = () => {
  const { sessionId } = useParams();
  const { createWorkoutSession } = useSessionActions();

  if (!sessionId) {
    return <NoSessionView />;
  }

  return <UnifiedWorkoutDetail />;
};
