
// Types partagés entre les différents fichiers de sessions d'entraînement
export interface UpdateResult {
  success: boolean;
  error?: any;
  data?: any;
}

export interface WorkoutCreateResult {
  data: any;
  error: any;
}
