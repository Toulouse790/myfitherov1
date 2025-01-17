import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ShoppingListItem {
  name: string;
  amount: string;
  category: string;
}

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
        .order('start_date', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching meal plans:', error);
        return [];
      }

      return plans;
    }
  });

  const generateShoppingList = (planData: any[]): ShoppingListItem[] => {
    const ingredients: { [key: string]: { amount: number; unit: string; category: string } } = {};
    
    planData.forEach(day => {
      Object.values(day).forEach((meal: any) => {
        if (meal.quantities) {
          meal.quantities.forEach((item: any) => {
            const [amount, unit] = item.amount.split(' ');
            const numAmount = parseFloat(amount);
            
            if (ingredients[item.item]) {
              ingredients[item.item].amount += numAmount;
            } else {
              ingredients[item.item] = {
                amount: numAmount,
                unit: unit || 'g',
                category: getCategoryForIngredient(item.item)
              };
            }
          });
        }
      });
    });

    return Object.entries(ingredients).map(([name, details]) => ({
      name,
      amount: `${details.amount} ${details.unit}`,
      category: details.category
    }));
  };

  const getCategoryForIngredient = (ingredient: string): string => {
    // Logique simplifiée de catégorisation
    const categories = {
      fruits: ['pomme', 'banane', 'orange', 'fraise', 'myrtille'],
      légumes: ['carotte', 'brocoli', 'épinard', 'salade', 'tomate'],
      protéines: ['poulet', 'boeuf', 'poisson', 'oeuf', 'tofu'],
      féculents: ['riz', 'pâtes', 'quinoa', 'pomme de terre'],
      produits_laitiers: ['fromage', 'yaourt', 'lait', 'skyr'],
      épicerie: ['huile', 'sel', 'poivre', 'épices']
    };

    for (const [category, items] of Object.entries(categories)) {
      if (items.some(item => ingredient.toLowerCase().includes(item))) {
        return category;
      }
    }
    
    return 'autres';
  };

  if (isLoading || !activePlans?.length) return null;

  const shoppingList = generateShoppingList(activePlans[0].plan_data);
  const groupedItems = shoppingList.reduce((acc: { [key: string]: ShoppingListItem[] }, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Liste de courses du {format(new Date(activePlans[0].start_date), 'dd MMMM', { locale: fr })} au{' '}
            {format(new Date(activePlans[0].end_date), 'dd MMMM yyyy', { locale: fr })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="space-y-2">
                <h3 className="font-semibold capitalize text-primary">{category}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {items.map((item, index) => (
                    <li key={index} className="text-sm">
                      {item.name} - {item.amount}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};