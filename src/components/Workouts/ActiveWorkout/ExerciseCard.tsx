
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExerciseCardProps {
  currentExercise: string;
  currentSet: number;
  totalSets: number;
  restTime: number | null;
  handleCompleteSet: () => void;
  handleSkipRest: () => void;
}

export const ExerciseCard = ({
  currentExercise,
  currentSet,
  totalSets,
  restTime,
  handleCompleteSet,
  handleSkipRest
}: ExerciseCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{currentExercise}</CardTitle>
        <CardDescription>
          Série {currentSet} sur {totalSets}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {restTime !== null ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="text-3xl font-mono">{restTime}s</div>
            <div className="text-muted-foreground">Temps de repos</div>
            <Button variant="outline" onClick={handleSkipRest}>
              Passer le repos
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Répétitions recommandées</span>
                <div className="text-3xl font-bold mt-1">12</div>
              </div>
              <div>
                <span className="font-medium">Poids</span>
                <div className="text-3xl font-bold mt-1">20 kg</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {restTime === null && (
          <Button 
            className="w-full" 
            onClick={handleCompleteSet}
          >
            Valider la série
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
