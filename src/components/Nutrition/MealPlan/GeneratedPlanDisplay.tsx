import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DayMeals } from "./DayMeals";
import { defaultMeals } from "@/data/meals/mealPlanGenerator";
import { MealPlan } from "@/data/meals/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GeneratedPlanDisplayProps {
  generatedPlan: MealPlan[];
  durationDays: string;
}

export const GeneratedPlanDisplay = ({ 
  generatedPlan,
  durationDays,
}: GeneratedPlanDisplayProps) => {
  console.log("GeneratedPlanDisplay - generatedPlan:", generatedPlan);

  const { data: workoutSessions } = useQuery({
    queryKey: ['workout-sessions'],
    queryFn: async () => {
      const { data: sessions, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('status', 'completed')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;
      return sessions;
    }
  });

  if (!generatedPlan) return null;

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
          {generatedPlan.map((day, index) => {
            const dayIndex = index % 7;
            const workoutTime = getWorkoutTime(dayIndex);
            const isTrainingDay = Boolean(workoutTime);

            return (
              <TabsContent key={index} value={(index + 1).toString()}>
                <DayMeals 
                  meals={{
                    breakfast: day.breakfast,
                    morning_snack: day.snack,
                    lunch: day.lunch,
                    afternoon_snack: day.snack,
                    dinner: day.dinner
                  }}
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