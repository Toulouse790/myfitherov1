
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface CountdownProps {
  targetDate: Date;
}

export const SpecialOfferCountdown = ({ targetDate }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState<boolean>(
    localStorage.getItem('special_offer_dismissed') === 'true'
  );

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [targetDate]);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('special_offer_dismissed', 'true');
    toast({
      title: t("premium.offerHidden", { fallback: "Offre masquée" }),
      description: t("premium.stillAccessible", { fallback: "Vous pouvez toujours y accéder depuis la page d'abonnement" }),
    });
  };

  if (dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0, height: 0, y: -20 }}
      >
        <Card className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-200 dark:border-blue-800 my-8 relative overflow-hidden shadow-md">
          {/* Éléments décoratifs */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/10 rounded-full"></div>
          <div className="absolute top-10 right-10 w-16 h-16 bg-purple-500/10 rounded-full"></div>
          <div className="absolute bottom-5 left-1/4 w-12 h-12 bg-pink-500/10 rounded-full"></div>
          
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            aria-label="Fermer"
          >
            ×
          </button>
          
          <div className="text-center relative z-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="h-5 w-5 text-pink-500" />
              <h3 className="text-xl font-bold">{t("premium.specialLaunchOffer", { fallback: "Offre spéciale de lancement" })}</h3>
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </div>
            
            <p className="mb-6 text-muted-foreground max-w-xl mx-auto">
              {t("premium.discountMessage", { fallback: "Profitez de" })} <span className="font-bold text-primary">30% {t("premium.discount", { fallback: "de réduction" })}</span> {t("premium.discountDetails", { fallback: "sur l'abonnement annuel pendant une durée limitée ! Débloquez toutes les fonctionnalités premium et transformez votre expérience fitness." })}
            </p>

            <div className="grid grid-cols-4 gap-2 mb-6 max-w-md mx-auto">
              <div className="flex flex-col items-center p-2 bg-background rounded-lg shadow">
                <span className="text-2xl font-bold">{timeLeft.days}</span>
                <span className="text-xs text-muted-foreground">{t("common.days", { fallback: "Jours" })}</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-background rounded-lg shadow">
                <span className="text-2xl font-bold">{timeLeft.hours}</span>
                <span className="text-xs text-muted-foreground">{t("common.hours", { fallback: "Heures" })}</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-background rounded-lg shadow">
                <span className="text-2xl font-bold">{timeLeft.minutes}</span>
                <span className="text-xs text-muted-foreground">{t("common.minutes", { fallback: "Minutes" })}</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-background rounded-lg shadow">
                <span className="text-2xl font-bold">{timeLeft.seconds}</span>
                <span className="text-xs text-muted-foreground">{t("common.seconds", { fallback: "Secondes" })}</span>
              </div>
            </div>

            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={() => navigate('/subscription-plans')}
            >
              <span className="flex items-center gap-2">
                {t("premium.claimOffer", { fallback: "Profiter de l'offre" })}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
