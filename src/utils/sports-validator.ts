
// Ce fichier est maintenant un point d'entrée qui réexporte les fonctions depuis les modules plus petits

import { validateSportPositions } from './sports/validators';
import { fixInvalidSportPositions, fixRugbyPositions, updateSportName } from './sports/updaters';
import { getSportsAndPositions } from './sports/fetchers';
import { analyzeSportNameDiscrepancies } from './sports/analyzers';

export {
  validateSportPositions,
  fixInvalidSportPositions,
  getSportsAndPositions,
  analyzeSportNameDiscrepancies,
  fixRugbyPositions,
  updateSportName
};
