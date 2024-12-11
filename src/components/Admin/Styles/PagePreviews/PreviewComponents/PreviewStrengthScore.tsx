import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export const PreviewStrengthScore = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5" />
        <h3 className="font-semibold">Score de force</h3>
      </div>
      <div className="flex justify-center items-center">
        <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center">
          <span className="text-2xl font-bold">750</span>
        </div>
      </div>
    </Card>
  );
};