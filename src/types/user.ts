import { MainObjective } from './objectives';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  mainObjective?: MainObjective;
  goals: UserGoals;
  preferences: UserPreferences;
  stats: UserStats;
  achievements: Achievement[];
  isPremium: boolean;
}

export interface UserGoals {
  primary: MainObjective;
  targetWeight?: number;
  weeklyWorkouts: number;
  dailyCalories: number;
  sleepHours: number;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: "fr" | "en";
  notifications: boolean;
  useTutorial: boolean;
  equipment: string[];
}

export interface UserStats {
  workoutsCompleted: number;
  totalWorkoutMinutes: number;
  streakDays: number;
  points: number;
  level: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  type: "workout" | "nutrition" | "sleep" | "streak" | "special";
}

// Alias for backward compatibility
export type UserProfileType = UserProfile;