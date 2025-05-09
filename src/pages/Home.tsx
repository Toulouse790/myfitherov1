
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { ActionButtons } from "@/components/Home/ActionButtons";
import { WelcomeHeader } from "@/components/Home/WelcomeHeader";
import { TodaySummary } from "@/components/Home/TodaySummary";
import { TrendingStats } from "@/components/Home/TrendingStats";
import { useAuth } from "@/hooks/use-auth";
import { SpecialOfferCountdown } from "@/components/Subscription/SpecialOfferCountdown";
import { Button } from "@/components/ui/button";
import { Crown, ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Date cible 30 jours à partir de maintenant
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 pb-20">
      <WelcomeHeader />
      
      {/* Actions rapides - Déplacées tout en haut pour un accès immédiat */}
      <ActionButtons />
      
      {/* Programme recommandé */}
      <Card className="p-6 space-y-4 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white to-blue-50 dark:from-blue-950/20 dark:to-blue-900/10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>
          <h2 className="text-xl font-bold">{t('common.recommendations', { fallback: 'Recommandé pour vous' })}</h2>
        </div>
        <WorkoutSuggestions showAllSuggestions={false} />
      </Card>
      
      {/* Résumé et stats - Groupés pour une meilleure organisation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="col-span-1 md:col-span-2">
          <TodaySummary />
        </div>
        {/* Remplacé TrendingStats par un bouton pour rediriger vers Stats */}
        <Card className="flex flex-col justify-center p-4">
          <h3 className="text-lg font-medium mb-2">{t('profile.stats.title', { fallback: 'Vos statistiques' })}</h3>
          <p className="text-sm text-muted-foreground mb-4">{t('profile.stats.description', { fallback: 'Consultez vos performances et progression' })}</p>
          <Button 
            onClick={() => navigate('/stats')} 
            className="mt-auto"
            variant="outline"
          >
            {t('profile.stats.viewAll', { fallback: 'Voir toutes les statistiques' })}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Card>
      </div>
      
      {/* Afficher l'offre spéciale */}
      <SpecialOfferCountdown targetDate={targetDate} />
      
      {/* Bannière Premium */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800 shadow-md hover:shadow-lg transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-3 sm:mb-0">
            <div className="bg-indigo-100 dark:bg-indigo-800 p-2 rounded-full">
              <Crown className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{t('premium.discoverPremium', { fallback: 'Découvrez MyFitHero Premium' })}</h3>
              <p className="text-sm text-muted-foreground">{t('premium.unlockFeatures', { fallback: 'Débloquez toutes les fonctionnalités et atteignez vos objectifs plus rapidement' })}</p>
            </div>
          </div>
          <Button onClick={() => navigate('/subscription-plans')} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
            <span className="flex items-center gap-2">
              {t('premium.viewPlans', { fallback: 'Voir les plans' })}
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
