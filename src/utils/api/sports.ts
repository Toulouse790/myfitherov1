
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";

export interface Sport {
  id: string;
  name: string;
}

export const fetchSports = async (): Promise<{ data: Sport[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('sports')
      .select('id, name')
      .order('name');
      
    debugLogger.log("sports", "Sports chargés: " + (data?.length || 0));
    
    if (!data || data.length === 0) {
      const demoSports = [
        { id: 'football', name: 'Football' },
        { id: 'basketball', name: 'Basketball' },
        { id: 'volleyball', name: 'Volleyball' },
        { id: 'tennis', name: 'Tennis' },
        { id: 'natation', name: 'Natation' },
        { id: 'running', name: 'Course à pied' }
      ];
      return { data: demoSports, error: null };
    }
    
    return { data, error };
  } catch (error) {
    debugLogger.error("sports", "Erreur lors du chargement des sports:", error);
    return { data: null, error };
  }
};
