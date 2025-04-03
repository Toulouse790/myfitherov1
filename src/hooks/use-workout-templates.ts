
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function useWorkoutTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Récupérer les modèles publics ET les modèles de l'utilisateur
        const { data, error } = await supabase
          .from('workout_templates')
          .select('*')
          .or(`is_public.eq.true,user_id.eq.${user.id}`);

        if (error) {
          throw error;
        }

        setTemplates(data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des modèles d'entraînement:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les modèles d'entraînement",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [user]);

  return { templates, isLoading };
}
