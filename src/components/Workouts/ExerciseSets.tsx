import React, { useState } from 'react';

interface ExerciseSetsProps {
  exerciseId: string;
  exerciseName: string;
  onComplete: (exerciseId: string, exerciseName: string, difficulty: string, notes: string, calories: number) => Promise<void>;
}

export const ExerciseSets = ({ exerciseId, exerciseName, onComplete }: ExerciseSetsProps) => {
  const [difficulty, setDifficulty] = useState('moderate');
  const [notes, setNotes] = useState('');
  const [calories, setCalories] = useState(0);

  const handleComplete = async () => {
    await onComplete(exerciseId, exerciseName, difficulty, notes, calories);
  };

  return (
    <div>
      <h2>{exerciseName}</h2>
      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option value="easy">Easy</option>
        <option value="moderate">Moderate</option>
        <option value="hard">Hard</option>
      </select>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
      <input type="number" value={calories} onChange={(e) => setCalories(Number(e.target.value))} placeholder="Calories burned" />
      <button onClick={handleComplete}>Complete</button>
    </div>
  );
};
