
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-200 dark:border-blue-800 my-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="h-5 w-5 text-pink-500" />
          <h3 className="text-xl font-bold">Offre spéciale de lancement</h3>
          <Sparkles className="h-5 w-5 text-yellow-500" />
        </div>
        
        <p className="mb-6 text-muted-foreground max-w-xl mx-auto">
          Profitez de <span className="font-bold text-primary">30% de réduction</span> sur l'abonnement annuel pendant une durée limitée ! Débloquez toutes les fonctionnalités premium et transformez votre expérience fitness.
        </p>

        <div className="grid grid-cols-4 gap-2 mb-6 max-w-md mx-auto">
          <div className="flex flex-col items-center p-2 bg-background rounded-lg shadow">
            <span className="text-2xl font-bold">{timeLeft.days}</span>
            <span className="text-xs text-muted-foreground">Jours</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-background rounded-lg shadow">
            <span className="text-2xl font-bold">{timeLeft.hours}</span>
            <span className="text-xs text-muted-foreground">Heures</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-background rounded-lg shadow">
            <span className="text-2xl font-bold">{timeLeft.minutes}</span>
            <span className="text-xs text-muted-foreground">Minutes</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-background rounded-lg shadow">
            <span className="text-2xl font-bold">{timeLeft.seconds}</span>
            <span className="text-xs text-muted-foreground">Secondes</span>
          </div>
        </div>

        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          onClick={() => navigate('/subscription-plans')}
        >
          <span className="flex items-center gap-2">
            Profiter de l'offre
            <ArrowRight className="h-4 w-4" />
          </span>
        </Button>
      </div>
    </Card>
  );
};
