
import { Sport, fetchSports } from './sports';
import { SportPosition, fetchPositions } from './positions';
import { SportProgram, fetchPrograms, fetchActivePrograms } from './programs';
import { createWorkoutFromProgram } from './workoutSessions';

// Exporter les interfaces
export { Sport, SportPosition, SportProgram };

// Réexporter les fonctions depuis les modules individuels
export { 
  fetchSports,
  fetchPositions,
  fetchPrograms,
  fetchActivePrograms,
  createWorkoutFromProgram
};
