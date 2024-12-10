import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";

export const NextWorkoutDetail = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          Session ID: {sessionId}
        </p>
      </Card>
    </div>
  );
};