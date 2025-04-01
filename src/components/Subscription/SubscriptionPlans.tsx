
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PricingCard } from "./PricingCard";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, CreditCard, CalendarClock, Gem, ShieldCheck } from "lucide-react";

export const SubscriptionPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const FREE_FEATURES = [
    "3 programmes d'entraînement par mois",
    "Suivi des entraînements basique",
    "Journal alimentaire simple",
    "Bibliothèque d'exercices limitée",
    "Analyse de sommeil basique"
  ];

  const FREE_LIMITATIONS = [
    "Analyse de posture limitée",
    "Pas de plans de repas personnalisés",
    "Pas d'analyse avancée de sommeil",
    "Pas de support prioritaire"
  ];

  const PREMIUM_FEATURES = [
    t("premium.benefits.unlimitedWorkouts"),
    t("premium.benefits.videoAnalysis"),
    t("premium.benefits.aiCoaching"),
    t("premium.benefits.advancedStats"),
    t("premium.benefits.mealPlans"),
    t("premium.benefits.sleepAnalysis"),
    t("premium.benefits.prioritySupport"),
    t("premium.benefits.noAds"),
    t("premium.benefits.exclusiveContent")
  ];

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
        // Simulation d'appel à l'API de paiement
        toast({
          title: "Redirection vers la page de paiement",
          description: "Vous allez être redirigé vers notre page de paiement sécurisée",
        });
        
        // Simulation de souscription premium
        const { error } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: user.id,
            subscription_type: 'premium',
            status: 'active',
            auto_renew: true,
            payment_provider: 'stripe',
            subscription_details: {
              plan: billingPeriod === 'monthly' ? 'premium_monthly' : 'premium_yearly'
            }
          });

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Votre abonnement premium a été activé",
        });

        // Redirection vers la page d'accueil
        setTimeout(() => navigate('/'), 1500);
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

  const getMonthlyPrice = () => billingPeriod === 'monthly' ? '9.99€' : '7.99€';
  const getYearlyPrice = () => billingPeriod === 'yearly' ? '83.88€' : '119.88€';
  const getYearlySavings = () => billingPeriod === 'yearly' ? '30%' : '0%';

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="mb-2 flex justify-center">
            <Badge variant="outline" className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-primary">
              <ShieldCheck className="w-3 h-3 mr-1" /> Offre de lancement
            </Badge>
          </div>
          <h2 className="text-3xl font-bold mb-2">{t("premium.title")}</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            {t("premium.unlock")}
          </p>

          <div className="flex justify-center mb-8">
            <Tabs 
              defaultValue="monthly" 
              className="w-[300px]"
              onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'yearly')}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly" className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  <span>{t("premium.membership.monthly")}</span>
                </TabsTrigger>
                <TabsTrigger value="yearly" className="flex items-center gap-1">
                  <CalendarClock className="w-4 h-4" />
                  <span>{t("premium.membership.yearly")}</span>
                  <Badge variant="outline" className="ml-1 bg-primary/20 text-[10px]">
                    -30%
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <PricingCard
              title="Gratuit"
              price="0€"
              description="Pour débuter votre parcours fitness"
              features={FREE_FEATURES}
              limitations={FREE_LIMITATIONS}
              onSelect={() => handleSubscribe(false)}
              isLoading={isLoading}
            />
            <PricingCard
              title="Premium"
              price={billingPeriod === 'monthly' ? getMonthlyPrice() : getYearlyPrice()}
              description="Pour des résultats optimaux"
              features={PREMIUM_FEATURES}
              priceDetails={billingPeriod === 'monthly' ? 
                "par mois" : 
                `par an (${getYearlySavings()} d'économie)`}
              isPro
              onSelect={() => handleSubscribe(true)}
              isLoading={isLoading}
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">{t("premium.cancelAnytime")}</p>
            <p className="text-sm mt-2">
              <span className="text-green-500 font-medium">{t("premium.freeTrial")}</span> - Essayez Premium gratuitement pendant 7 jours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
