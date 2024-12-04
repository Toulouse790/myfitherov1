interface WorkoutHeaderProps {
  title: string;
}

export const WorkoutHeader = ({ title }: WorkoutHeaderProps) => {
  return (
    <h1 className="text-2xl font-bold">{title}</h1>
  );
};