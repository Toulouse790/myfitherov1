interface UserProfile {
  age: number;
  weight: number;
  height: number;
  goal: string;
  workoutsPerWeek: number;
  dailyCalories: number;
  recoveryCapacity: "low" | "medium" | "high";
}

export const generateWorkoutPlan = (profile: UserProfile) => {
  const bmi = profile.weight / Math.pow(profile.height / 100, 2);
  
  const getIntensity = () => {
    const baseIntensity = profile.recoveryCapacity === "high" ? 0.8 : 
                         profile.recoveryCapacity === "medium" ? 0.7 : 0.6;
    
    const ageAdjustment = profile.age > 50 ? 0.8 :
                         profile.age > 40 ? 0.9 :
                         profile.age > 30 ? 1.0 : 1.1;
    
    const bmiAdjustment = bmi > 30 ? 0.85 :
                         bmi > 25 ? 0.9 :
                         bmi < 18.5 ? 0.9 : 1.0;
    
    return baseIntensity * ageAdjustment * bmiAdjustment;
  };

  const getVolume = () => {
    const baseVolume = Math.floor(profile.dailyCalories / 200);
    const weeklyAdjustment = 1 + (profile.workoutsPerWeek / 10);
    const recoveryAdjustment = profile.recoveryCapacity === "high" ? 1.2 :
                              profile.recoveryCapacity === "medium" ? 1.0 : 0.8;
    
    return Math.floor(baseVolume * weeklyAdjustment * recoveryAdjustment);
  };

  const getExerciseTypes = () => {
    const baseDistribution = {
      weight_loss: { compound: 0.7, isolation: 0.3, cardio: true },
      muscle_gain: { compound: 0.6, isolation: 0.4, cardio: false },
      maintenance: { compound: 0.5, isolation: 0.5, cardio: true }
    };

    const distribution = baseDistribution[profile.goal];

    if (profile.recoveryCapacity === "low") {
      distribution.compound -= 0.1;
      distribution.isolation += 0.1;
    }

    if (profile.age > 50) {
      distribution.compound -= 0.1;
      distribution.isolation += 0.1;
    }

    return distribution;
  };

  const getRestTime = () => {
    const baseRest = profile.recoveryCapacity === "high" ? 60 : 
                    profile.recoveryCapacity === "medium" ? 90 : 120;
    
    const intensity = getIntensity();
    const intensityAdjustment = intensity > 0.8 ? 1.2 :
                               intensity > 0.6 ? 1.0 : 0.8;
    
    return Math.round(baseRest * intensityAdjustment);
  };

  const intensity = getIntensity();
  const volume = getVolume();
  const exerciseTypes = getExerciseTypes();
  const restTime = getRestTime();

  const getSetsAndReps = () => {
    if (profile.goal === "weight_loss") {
      return { sets: 3, reps: 15 };
    } else if (profile.goal === "muscle_gain") {
      return { sets: 4, reps: 8 };
    }
    return { sets: 3, reps: 12 };
  };

  const { sets, reps } = getSetsAndReps();

  return {
    intensity,
    volume,
    exerciseTypes,
    recommendedRest: restTime,
    setsAndReps: { sets, reps },
    weeklySchedule: {
      daysPerWeek: profile.workoutsPerWeek,
      sessionsPerDay: 1,
      recommendedDays: profile.workoutsPerWeek <= 3 ? ["Lundi", "Mercredi", "Vendredi"] :
                      profile.workoutsPerWeek <= 4 ? ["Lundi", "Mardi", "Jeudi", "Vendredi"] :
                      ["Lundi", "Mardi", "Mercredi", "Vendredi", "Samedi"]
    }
  };
};