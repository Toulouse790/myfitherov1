export interface Profile {
  id: string;
  username: string | null;
  created_at: string;
  updated_at: string;
  meal_notifications: boolean | null;
  reminder_time: number | null;
}

export interface ProfileInsert {
  id: string;
  username?: string | null;
  meal_notifications?: boolean | null;
  reminder_time?: number | null;
}

export interface ProfileUpdate {
  username?: string | null;
  meal_notifications?: boolean | null;
  reminder_time?: number | null;
}