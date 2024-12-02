export type SportLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type SeasonPhase = "preseason" | "midseason" | "endseason" | "offseason";
export type SportType = "team" | "individual";

export interface SportProgram {
  id: string;
  name: string;
  sport: string;
  type: SportType;
  level: SportLevel;
  phase: SeasonPhase;
  description: string;
  duration: number; // en semaines
  sessionsPerWeek: number;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    rest: number;
    notes?: string;
  }>;
  goals: string[];
  requirements?: string[];
}