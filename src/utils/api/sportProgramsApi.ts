
import { fetchSports, Sport } from './sports';
import { fetchPositions, SportPosition } from './positions';
import { fetchPrograms, fetchActivePrograms, SportProgram } from './programs';
import { createWorkoutFromProgram } from './workout-sessions';

// Exporter les interfaces comme types
export type { Sport, SportPosition, SportProgram };

// Réexporter les fonctions depuis les modules individuels
export { 
  fetchSports,
  fetchPositions,
  fetchPrograms,
  fetchActivePrograms,
  createWorkoutFromProgram
};
