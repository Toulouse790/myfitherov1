export interface ExerciseMedia {
  id: string;
  exercise_name: string;
  media_type: 'image' | 'video';
  media_url: string;
  created_at: string;
}

export interface ExerciseMediaInsert {
  exercise_name: string;
  media_type: 'image' | 'video';
  media_url: string;
}