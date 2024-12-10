interface ExerciseInfoProps {
  name: string;
  muscleGroup: string;
}

export const ExerciseInfo = ({ name, muscleGroup }: ExerciseInfoProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{muscleGroup}</p>
    </div>
  );
};