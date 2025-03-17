
import { Trophy } from "lucide-react";

export const CompletionMessage = () => {
  return (
    <div className="py-4 text-center space-y-4">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
      </div>
      <h3 className="text-xl font-semibold">Félicitations !</h3>
      <p className="text-muted-foreground">
        Vous avez terminé votre séance d'entraînement.
      </p>
      <p className="font-medium">
        Continuez comme ça pour atteindre vos objectifs !
      </p>
    </div>
  );
};
