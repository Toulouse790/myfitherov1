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

const weekDays = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche"
];

export const GeneratedPlanDisplay = ({ 
  generatedPlan,
  durationDays,
}: GeneratedPlanDisplayProps) => {
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

  // Calculate total carbs for each day's meals
  const calculateDayTotalCarbs = (meals: Record<string, { carbs: number }>) => {
    return Object.values(meals).reduce((total: number, meal) => {
      return total + (meal.carbs || 0);
    }, 0);
  };

  // Determine workout time based on session start time
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
            const totalCarbs = calculateDayTotalCarbs(day.meals);
            const dayIndex = index % 7;
            const workoutTime = getWorkoutTime(dayIndex);
            const isTrainingDay = Boolean(workoutTime);
            const carbsTarget = day.carbsTarget || 250; // Default target if not provided

            return (
              <TabsContent key={index} value={(index + 1).toString()}>
                <DayMeals 
                  meals={day.meals} 
                  mealTitles={defaultMeals}
                  totalCarbs={totalCarbs}
                  carbsTarget={carbsTarget}
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