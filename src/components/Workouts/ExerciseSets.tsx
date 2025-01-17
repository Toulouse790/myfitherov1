import React from 'react';
import { ExerciseTypeView } from './ExerciseTypeView';

export interface ExerciseSetsProps {
  exerciseId: string;
  exerciseName: string;
  onComplete: (exerciseId: string, exerciseName: string, difficulty: string, notes: string, calories: number) => Promise<void>;
}

export const ExerciseSets = ({ exerciseId, exerciseName, onComplete }: ExerciseSetsProps) => {
  // Détermine si l'exercice est cardio basé sur son nom
  const isCardio = exerciseName.toLowerCase().includes('cardio') || 
                  exerciseName.toLowerCase().includes('course') ||
                  exerciseName.toLowerCase().includes('vélo') ||
                  exerciseName.toLowerCase().includes('natation');

  return (
    <ExerciseTypeView
      exerciseType={isCardio ? 'cardio' : 'strength'}
      exerciseName={exerciseName}
      onComplete={onComplete}
    />
  );
};