export type MainObjective = 
  | 'perte_de_poids'
  | 'prise_de_masse' 
  | 'maintenance'
  | 'performance'
  | 'seche_extreme';

export const defaultObjective: MainObjective = 'maintenance';