interface WorkoutHeaderProps {
  title: string;
}

export const WorkoutHeader = ({ title }: WorkoutHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
};