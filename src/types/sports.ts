import { LucideIcon } from "lucide-react";

export type SportType = "team" | "individual";

export interface SportProgram {
  id: string;
  name: string;
  sport: string;
  type: SportType;
  level: string;
  phase: string;
  description: string;
  duration: number;
  sessionsPerWeek: number;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    rest: number;
    notes?: string;
  }>;
  goals: string[];
  requirements: string[];
  icon: LucideIcon;
}