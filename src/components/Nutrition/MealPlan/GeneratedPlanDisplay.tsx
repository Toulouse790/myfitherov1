import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DayMeals } from "./DayMeals";
import { defaultMeals } from "@/data/meals/mealPlanGenerator";
import { MealPlan } from "@/types/nutrition";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GeneratedPlanDisplayProps {
  generatedPlan: any[];
  durationDays: string;
}

export const GeneratedPlanDisplay = ({ 
  generatedPlan,
  durationDays,
}: GeneratedPlanDisplayProps) => {
  console.log("GeneratedPlanDisplay - generatedPlan:", generatedPlan);

  // Charger les plans sauvegardés
  const { data: savedPlan } = useQuery({
    queryKey: ['meal-plan'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
          .from('meal_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error loading meal plan:', error);
          return null;
        }

        // Retourner le premier plan s'il existe, sinon null
        return data && data.length > 0 ? data[0] : null;
      } catch (error) {
        console.error('Error in meal plan query:', error);
        return null;
      }
    }
  });

  const { data: workoutSessions } = useQuery({
    queryKey: ['workout-sessions'],
    queryFn: async () => {
      try {
        const { data: sessions, error } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('status', 'completed')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
        
        if (error) throw error;
        return sessions;
      } catch (error) {
        console.error('Error loading workout sessions:', error);
        return [];
      }
    }
  });

  // Utiliser le plan sauvegardé s'il existe, sinon utiliser le plan généré
  const planToDisplay = savedPlan?.plan_data || generatedPlan;

  if (!planToDisplay) return null;

  const getWorkoutTime = (dayIndex: number): 'morning' | 'evening' | undefined => {
    if (!workoutSessions) return undefined;

    const dayWorkouts = workoutSessions.filter(session => {
      const sessionDate = new Date(session.created_at || '');
      return sessionDate.getDay() === dayIndex;
    });

    if (dayWorkouts.length === 0) return undefined;

    const sessionHour = new Date(dayWorkouts[0].created_at || '').getHours();
    return sessionHour < 12 ? 'morning' : 'evening';
  };

  const weekDays = [
    "Lundi", "Mardi", "Mercredi", "Jeudi",
    "Vendredi", "Samedi", "Dimanche"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Votre plan alimentaire</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="1" className="w-full">
          <TabsList className="w-full flex-wrap h-auto">
            {Array.from({ length: parseInt(durationDays) }, (_, i) => (
              <TabsTrigger key={i + 1} value={(i + 1).toString()} className="flex-1">
                {weekDays[i % 7]}
              </TabsTrigger>
            ))}
          </TabsList>
          {planToDisplay.map((day: any, index: number) => {
            const dayIndex = index % 7;
            const workoutTime = getWorkoutTime(dayIndex);
            const isTrainingDay = Boolean(workoutTime);

            const formattedMeals = {
              breakfast: {
                ...day.breakfast,
                preparation: defaultMeals.breakfast.meal.notes
              },
              morning_snack: {
                ...day.snack,
                preparation: defaultMeals.morning_snack.meal.notes
              },
              lunch: {
                ...day.lunch,
                preparation: defaultMeals.lunch.meal.notes
              },
              afternoon_snack: {
                ...day.snack,
                preparation: defaultMeals.afternoon_snack.meal.notes
              },
              dinner: {
                ...day.dinner,
                preparation: defaultMeals.dinner.meal.notes
              }
            };

            return (
              <TabsContent key={index} value={(index + 1).toString()}>
                <DayMeals 
                  meals={formattedMeals}
                  mealTitles={defaultMeals}
                  isTrainingDay={isTrainingDay}
                  workoutTime={workoutTime}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};