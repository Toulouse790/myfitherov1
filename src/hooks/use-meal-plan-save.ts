import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useMealPlanSave = () => {
  const { toast } = useToast();

  const saveMealPlanToJournal = async (plan: any, durationDays: string) => {
    try {
      console.log("Saving meal plan to journal:", plan);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Supprimer les anciens repas pour aujourd'hui
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { error: deleteError } = await supabase
        .from('food_journal_entries')
        .delete()
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString());

      if (deleteError) {
        console.error('Error deleting old entries:', deleteError);
        throw deleteError;
      }

      // Transformer le plan en entrées de journal
      const entries = [];

      // Ajouter le petit-déjeuner
      if (plan.breakfast) {
        entries.push({
          user_id: user.id,
          name: plan.breakfast.name,
          calories: plan.breakfast.calories,
          proteins: plan.breakfast.proteins,
          meal_type: 'breakfast',
          notes: plan.breakfast.preparation || ''
        });
      }

      // Ajouter le déjeuner
      if (plan.lunch) {
        entries.push({
          user_id: user.id,
          name: plan.lunch.name,
          calories: plan.lunch.calories,
          proteins: plan.lunch.proteins,
          meal_type: 'lunch',
          notes: plan.lunch.preparation || ''
        });
      }

      // Ajouter le dîner
      if (plan.dinner) {
        entries.push({
          user_id: user.id,
          name: plan.dinner.name,
          calories: plan.dinner.calories,
          proteins: plan.dinner.proteins,
          meal_type: 'dinner',
          notes: plan.dinner.preparation || ''
        });
      }

      // Ajouter les collations
      if (plan.snack) {
        // Diviser la collation en deux si nécessaire
        const morningSnack = {
          user_id: user.id,
          name: `${plan.snack.name} (matin)`,
          calories: Math.round(plan.snack.calories / 2),
          proteins: Math.round(plan.snack.proteins / 2),
          meal_type: 'morning_snack',
          notes: plan.snack.preparation || ''
        };

        const afternoonSnack = {
          user_id: user.id,
          name: `${plan.snack.name} (après-midi)`,
          calories: Math.round(plan.snack.calories / 2),
          proteins: Math.round(plan.snack.proteins / 2),
          meal_type: 'afternoon_snack',
          notes: plan.snack.preparation || ''
        };

        entries.push(morningSnack, afternoonSnack);
      }

      console.log("Inserting entries:", entries);
      const { error: insertError } = await supabase
        .from('food_journal_entries')
        .insert(entries);

      if (insertError) {
        console.error('Error inserting entries:', insertError);
        throw insertError;
      }

      // Sauvegarder le plan complet dans la table meal_plans
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(durationDays) - 1);

      const { error: planError } = await supabase
        .from('meal_plans')
        .insert({
          user_id: user.id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          plan_data: Array(parseInt(durationDays)).fill(plan)
        });

      if (planError) {
        console.error('Error saving meal plan:', planError);
        throw planError;
      }

      toast({
        title: "Plan de repas enregistré",
        description: "Les repas ont été ajoutés à votre journal alimentaire",
      });
    } catch (error) {
      console.error('Error saving meal plan:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le plan de repas",
        variant: "destructive",
      });
    }
  };

  return { saveMealPlanToJournal };
};