interface CardioTimerProps {
  duration: number;
}

export const CardioTimer = ({ duration }: CardioTimerProps) => {
  return (
    <div className="text-center space-y-2">
      <div className="text-4xl font-bold">
        {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
      </div>
      <p className="text-muted-foreground">Durée de la séance</p>
    </div>
  );
};