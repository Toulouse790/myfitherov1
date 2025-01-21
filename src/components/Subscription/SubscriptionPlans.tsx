import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PricingCard } from "./PricingCard";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const FREE_FEATURES = [
  "Accès aux exercices de base",
  "Suivi des entraînements",
  "Statistiques basiques",
  "3 programmes d'entraînement",
];

const PRO_FEATURES = [
  "Tous les exercices premium",
  "Programmes illimités",
  "Statistiques avancées",
  "Support prioritaire",
  "Sans publicité",
  "Personnalisation avancée",
  "Suivi nutritionnel détaillé",
];

export const SubscriptionPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (isPro: boolean) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour souscrire à un abonnement",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isPro) {
        // Ici nous simulerons la souscription premium
        const { error } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: user.id,
            subscription_type: 'premium',
            status: 'active',
            auto_renew: true,
            payment_provider: 'stripe',
            subscription_details: {
              plan: 'premium_monthly'
            }
          });

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Votre abonnement premium a été activé",
        });
      } else {
        // Retour au plan gratuit
        const { error } = await supabase
          .from('user_subscriptions')
          .update({ 
            status: 'cancelled',
            auto_renew: false 
          })
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Plan modifié",
          description: "Vous êtes passé au plan gratuit",
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de l'abonnement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Choisissez votre plan</h2>
          <p className="text-muted-foreground">
            Sélectionnez le plan qui correspond le mieux à vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <PricingCard
            title="Gratuit"
            price="Gratuit"
            description="Pour commencer votre parcours fitness"
            features={FREE_FEATURES}
            onSelect={() => handleSubscribe(false)}
          />
          <PricingCard
            title="Premium"
            price="9.99€"
            description="Pour des résultats optimaux"
            features={PRO_FEATURES}
            isPro
            onSelect={() => handleSubscribe(true)}
          />
        </div>
      </div>
    </div>
  );
};