import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MealHeader } from "./MealHeader";
import { MealContent } from "./MealContent";
import { Card } from "@/components/ui/card";
import { MealType } from "../MealTypes";

interface MealSectionProps {
  type: MealType;
  title: string;
  timeWindow: string;
}

export const MealSection = ({ type, title, timeWindow }: MealSectionProps) => {
  const { data: preferences } = useQuery({
    queryKey: ['meal-preferences'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_nutrition_preferences')
        .select('meal_validation_times, meal_validation_notifications')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching preferences:', error);
        return null;
      }

      return data;
    }
  });

  return (
    <Card className="overflow-hidden">
      <MealHeader title={title} timeWindow={timeWindow} />
      <MealContent type={type} preferences={preferences} />
    </Card>
  );
};