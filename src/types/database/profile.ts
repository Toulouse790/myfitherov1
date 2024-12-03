export interface Profile {
  created_at: string;
  id: string;
  updated_at: string;
  username: string | null;
}

export interface ProfileInsert {
  created_at?: string;
  id: string;
  updated_at?: string;
  username?: string | null;
}

export interface ProfileUpdate {
  created_at?: string;
  id?: string;
  updated_at?: string;
  username?: string | null;
}