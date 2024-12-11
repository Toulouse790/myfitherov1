import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AvailableWidget {
  id: string;
  name: string;
  description: string | null;
  category: string;
  icon_name: string;
  chart_type: string;
  is_active: boolean;
}

export const useAvailableWidgets = () => {
  return useQuery({
    queryKey: ['available-widgets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('available_widgets')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as AvailableWidget[];
    }
  });
};