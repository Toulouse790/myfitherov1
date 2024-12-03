import { Card } from "@/components/ui/card";
import { Sparkles, Activity, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  age: number;
  weight: number;
  height: number;
  goal: "weight_loss" | "muscle_gain" | "maintenance";
  workoutsPerWeek: number;
  dailyCalories: number;
  recoveryCapacity: "low" | "medium" | "high";
}

interface Exercise {
  name: string;
  type: "compound" | "isolation";
  muscleGroup: string;
  intensity: number;
  sets: number;
  reps: number;
  restTime: number;
}

const generateWorkoutPlan = (profile: UserProfile) => {
  // Calcul du BMI pour adapter l'intensité
  const bmi = profile.weight / Math.pow(profile.height / 100, 2);
  
  // Calcul de l'intensité en fonction de multiples facteurs
  const getIntensity = () => {
    const baseIntensity = profile.recoveryCapacity === "high" ? 0.8 : 
                         profile.recoveryCapacity === "medium" ? 0.7 : 0.6;
    
    // Ajustements basés sur l'âge
    const ageAdjustment = profile.age > 50 ? 0.8 :
                         profile.age > 40 ? 0.9 :
                         profile.age > 30 ? 1.0 : 1.1;
    
    // Ajustements basés sur le BMI
    const bmiAdjustment = bmi > 30 ? 0.85 :
                         bmi > 25 ? 0.9 :
                         bmi < 18.5 ? 0.9 : 1.0;
    
    return baseIntensity * ageAdjustment * bmiAdjustment;
  };

  // Calcul du volume optimal
  const getVolume = () => {
    const baseVolume = Math.floor(profile.dailyCalories / 200);
    const weeklyAdjustment = 1 + (profile.workoutsPerWeek / 10);
    const recoveryAdjustment = profile.recoveryCapacity === "high" ? 1.2 :
                              profile.recoveryCapacity === "medium" ? 1.0 : 0.8;
    
    return Math.floor(baseVolume * weeklyAdjustment * recoveryAdjustment);
  };

  // Sélection intelligente des exercices
  const getExerciseTypes = () => {
    const baseDistribution = {
      weight_loss: { compound: 0.7, isolation: 0.3, cardio: true },
      muscle_gain: { compound: 0.6, isolation: 0.4, cardio: false },
      maintenance: { compound: 0.5, isolation: 0.5, cardio: true }
    };

    const distribution = baseDistribution[profile.goal];

    // Ajustement basé sur la capacité de récupération
    if (profile.recoveryCapacity === "low") {
      distribution.compound -= 0.1;
      distribution.isolation += 0.1;
    }

    // Ajustement basé sur l'âge
    if (profile.age > 50) {
      distribution.compound -= 0.1;
      distribution.isolation += 0.1;
    }

    return distribution;
  };

  // Calcul du temps de repos optimal
  const getRestTime = () => {
    const baseRest = profile.recoveryCapacity === "high" ? 60 : 
                    profile.recoveryCapacity === "medium" ? 90 : 120;
    
    // Ajustements basés sur l'intensité
    const intensity = getIntensity();
    const intensityAdjustment = intensity > 0.8 ? 1.2 :
                               intensity > 0.6 ? 1.0 : 0.8;
    
    return Math.round(baseRest * intensityAdjustment);
  };

  // Génération du programme complet
  const intensity = getIntensity();
  const volume = getVolume();
  const exerciseTypes = getExerciseTypes();
  const restTime = getRestTime();

  // Calcul des séries et répétitions optimales
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

const mockUserProfile: UserProfile = {
  age: 30,
  weight: 75,
  height: 175,
  goal: "muscle_gain",
  workoutsPerWeek: 4,
  dailyCalories: 2500,
  recoveryCapacity: "medium"
};

export const WorkoutSuggestions = () => {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [goal, setGoal] = useState<"weight_loss" | "muscle_gain" | "maintenance">("maintenance");
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(3);
  const [recoveryCapacity, setRecoveryCapacity] = useState<"low" | "medium" | "high">("medium");

  const handleGenerateWorkout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour générer un programme personnalisé",
        variant: "destructive",
      });
      return;
    }

    const { data: profile } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      toast({
        title: "Profil incomplet",
        description: "Veuillez d'abord remplir le questionnaire initial",
        variant: "destructive",
      });
      return;
    }

    const userProfile: UserProfile = {
      age: 30, // À remplacer par les vraies données une fois ajoutées
      weight: 75,
      height: 175,
      goal,
      workoutsPerWeek,
      dailyCalories: 2500,
      recoveryCapacity
    };

    const plan = generateWorkoutPlan(userProfile);
    setShowDialog(false);
    
    toast({
      title: "Programme généré avec succès",
      description: `Programme personnalisé créé avec :
      - ${plan.volume} séries au total
      - Intensité : ${Math.round(plan.intensity * 100)}%
      - ${plan.recommendedRest}s de repos entre les séries
      - ${plan.setsAndReps.sets} séries de ${plan.setsAndReps.reps} répétitions
      - ${plan.weeklySchedule.daysPerWeek} jours par semaine`,
    });
  };

  const suggestions = [
    {
      title: "Personnalisé",
      description: "Laissez notre IA vous aider à créer un entraînement",
      icon: <Sparkles className="w-5 h-5 text-white" />,
      bgColor: "bg-[#2A2F3F]",
      onClick: () => setShowDialog(true)
    },
    {
      title: "Cardio",
      description: "Enregistrer une séance de cardio",
      icon: <Activity className="w-5 h-5 text-white" />,
      bgColor: "bg-[#2A2F3F]"
    },
    {
      title: "Favoris",
      description: "Choisi parmi vos entraînements sauvegardés",
      icon: <Bookmark className="w-5 h-5 text-white" />,
      bgColor: "bg-[#2A2F3F]"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-white">Envie de quelque chose de différent?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {suggestions.map((suggestion, index) => (
          <Card 
            key={index}
            className={`${suggestion.bgColor} p-3 cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]`}
            onClick={suggestion.onClick}
          >
            <div className="space-y-2">
              <div className="rounded-full bg-[#1E2330] w-10 h-10 flex items-center justify-center">
                {suggestion.icon}
              </div>
              <h3 className="text-white font-medium text-sm sm:text-base">{suggestion.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">{suggestion.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Personnaliser votre entraînement</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <Label>Objectif principal</Label>
              <RadioGroup value={goal} onValueChange={(value: any) => setGoal(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weight_loss" id="weight_loss" />
                  <Label htmlFor="weight_loss">Perte de poids</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="muscle_gain" id="muscle_gain" />
                  <Label htmlFor="muscle_gain">Prise de masse</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maintenance" id="maintenance" />
                  <Label htmlFor="maintenance">Maintien</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>Séances par semaine: {workoutsPerWeek}</Label>
              <Slider
                value={[workoutsPerWeek]}
                onValueChange={([value]) => setWorkoutsPerWeek(value)}
                max={6}
                min={1}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <Label>Capacité de récupération</Label>
              <RadioGroup value={recoveryCapacity} onValueChange={(value: any) => setRecoveryCapacity(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">Faible</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Moyenne</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">Élevée</Label>
                </div>
              </RadioGroup>
            </div>

            <Button onClick={handleGenerateWorkout} className="w-full">
              Générer mon programme
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};