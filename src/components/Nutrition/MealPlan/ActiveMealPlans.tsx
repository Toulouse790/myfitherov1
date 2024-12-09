import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GeneratedPlanDisplay } from "./GeneratedPlanDisplay";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const ActiveMealPlans = () => {
  const { data: activePlans, isLoading } = useQuery({
    queryKey: ['active-meal-plans'],
    queryFn: async () => {
      const today = new Date();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: plans, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .gte('end_date', today.toISOString())
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching meal plans:', error);
        return [];
      }

      return plans;
    }
  });

  if (isLoading || !activePlans?.length) return null;

  return (
    <div className="space-y-4">
      {activePlans.map((plan) => (
        <Card key={plan.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              Plan du {format(new Date(plan.start_date), 'dd MMMM', { locale: fr })} au{' '}
              {format(new Date(plan.end_date), 'dd MMMM yyyy', { locale: fr })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GeneratedPlanDisplay 
              generatedPlan={plan.plan_data} 
              durationDays={String((new Date(plan.end_date).getTime() - new Date(plan.start_date).getTime()) / (1000 * 60 * 60 * 24) + 1)}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};