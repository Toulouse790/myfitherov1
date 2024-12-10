import { Trophy } from "lucide-react";

export const CompletionMessage = () => {
  return (
    <div className="text-center space-y-2 my-6">
      <Trophy className="w-12 h-12 text-yellow-500 mx-auto" />
      <h3 className="text-xl font-semibold">Félicitations !</h3>
      <p className="text-muted-foreground">
        Vous avez terminé votre séance d'entraînement. Continuez comme ça !
      </p>
    </div>
  );
};