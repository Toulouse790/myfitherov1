import { render, screen } from '@testing-library/react';
import { WorkoutSummary } from '../WorkoutSummary';
import { describe, it, expect } from 'vitest';

describe('WorkoutSummary', () => {
  it('renders daily stats correctly', () => {
    render(<WorkoutSummary />);
    
    // Vérifie que les statistiques quotidiennes sont affichées
    expect(screen.getByText('61 min')).toBeInTheDocument();
    expect(screen.getByText('450 kcal')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('displays correct tab labels', () => {
    render(<WorkoutSummary />);
    
    expect(screen.getByText('Aujourd\'hui')).toBeInTheDocument();
    expect(screen.getByText('Semaine')).toBeInTheDocument();
    expect(screen.getByText('Mois')).toBeInTheDocument();
  });
});