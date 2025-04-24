
import { Header } from "@/components/Layout/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function WeeklyGoals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const { data: goals, isLoading, refetch } = useQuery({
    queryKey: ['weekly-goals'],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('periodic_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('period_type', 'weekly');
      return data;
    },
    enabled: !!user
  });

  const handleAddGoal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const goalType = formData.get('goalType') as string;
    const targetValue = Number(formData.get('targetValue'));
    
    if (!goalType || !targetValue) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const now = new Date();
      const endOfWeek = new Date();
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      
      await supabase.from('periodic_goals').insert({
        user_id: user?.id,
        goal_type: goalType,
        period_type: 'weekly',
        start_date: now.toISOString().split('T')[0],
        end_date: endOfWeek.toISOString().split('T')[0],
        target_value: { value: targetValue, unit: 'count' },
        current_value: { value: 0, unit: 'count' }
      });
      
      toast({
        title: "Objectif créé",
        description: "Votre objectif hebdomadaire a été créé avec succès",
      });
      
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error("Erreur lors de la création de l'objectif", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'objectif",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Header>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Header>
    );
  }

  return (
    <Header>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Objectifs hebdomadaires</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? "Annuler" : "Ajouter un objectif"}
          </Button>
        </div>
        
        {showForm && (
          <Card className="p-6 mb-8">
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type d'objectif</label>
                <select name="goalType" className="w-full border border-gray-300 rounded p-2">
                  <option value="workout_count">Nombre d'entraînements</option>
                  <option value="workout_duration">Durée d'entraînement (minutes)</option>
                  <option value="workout_weight">Poids soulevé (kg)</option>
                  <option value="nutrition_calories">Calories consommées</option>
                  <option value="water_intake">Consommation d'eau (L)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Valeur cible</label>
                <input 
                  type="number" 
                  name="targetValue" 
                  placeholder="Entrez votre objectif" 
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <Button type="submit">Créer l'objectif</Button>
            </form>
          </Card>
        )}
        
        <div className="grid gap-6">
          {goals && goals.length > 0 ? (
            goals.map((goal) => (
              <Card key={goal.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">
                      {goal.goal_type === 'workout_count' && 'Nombre d\'entraînements'}
                      {goal.goal_type === 'workout_duration' && 'Durée d\'entraînement'}
                      {goal.goal_type === 'workout_weight' && 'Poids soulevé'}
                      {goal.goal_type === 'nutrition_calories' && 'Calories consommées'}
                      {goal.goal_type === 'water_intake' && 'Consommation d\'eau'}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(goal.start_date).toLocaleDateString()} - {new Date(goal.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <Progress 
                    value={
                      (goal.current_value?.value / goal.target_value?.value) * 100
                    } 
                  />
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Actuel: {goal.current_value?.value} {goal.current_value?.unit}</span>
                    <span>Objectif: {goal.target_value?.value} {goal.target_value?.unit}</span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground py-4">Aucun objectif hebdomadaire défini</p>
              <p className="text-sm">Ajoutez un objectif pour commencer à suivre votre progression</p>
            </Card>
          )}
        </div>
      </div>
    </Header>
  );
}
