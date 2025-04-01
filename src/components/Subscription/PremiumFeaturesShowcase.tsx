
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  ActivitySquare, 
  Utensils, 
  Moon, 
  MessageSquareText, 
  Video, 
  Award, 
  ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isPremium: boolean;
  isActive: boolean;
  onClick: () => void;
}

const FeatureCard = ({ icon, title, description, isPremium, isActive, onClick }: FeatureCardProps) => (
  <Card 
    className={cn(
      "p-4 cursor-pointer transition-all duration-300 h-full flex flex-col",
      isActive ? "border-primary shadow-md" : "hover:border-primary/50 hover:shadow-sm",
      isPremium ? "bg-gradient-to-br from-amber-50 to-amber-100/30 dark:from-amber-950/10 dark:to-amber-900/5" : ""
    )}
    onClick={onClick}
  >
    <div className="flex items-start gap-3 mb-2">
      <div className={cn(
        "p-2 rounded-full shrink-0",
        isActive ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold flex items-center">
          {title}
          {isPremium && (
            <span className="ml-2 text-xs bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full">
              Premium
            </span>
          )}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </Card>
);

export const PremiumFeaturesShowcase = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    {
      icon: <ActivitySquare className="h-5 w-5" />,
      title: "Suivi d'activité avancé",
      description: "Analyse détaillée de vos performances et progrès",
      isPremium: true
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      title: "Statistiques personnalisées",
      description: "Visualisez vos progrès avec des graphiques détaillés",
      isPremium: true
    },
    {
      icon: <Utensils className="h-5 w-5" />,
      title: "Plans nutritionnels adaptés",
      description: "Menus personnalisés selon vos objectifs",
      isPremium: true
    },
    {
      icon: <Moon className="h-5 w-5" />,
      title: "Analyse avancée du sommeil",
      description: "Comprenez les cycles de votre sommeil",
      isPremium: true
    },
    {
      icon: <Video className="h-5 w-5" />,
      title: "Analyse vidéo de posture",
      description: "Améliorez votre technique d'exercice",
      isPremium: true
    },
    {
      icon: <MessageSquareText className="h-5 w-5" />,
      title: "Coach IA personnel",
      description: "Conseils personnalisés 24/7",
      isPremium: true
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Card className="p-6 overflow-hidden border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/30 dark:from-amber-950/10 dark:to-amber-900/5">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold mb-1 flex items-center">
            <Award className="mr-2 h-5 w-5 text-amber-500" />
            Fonctionnalités Premium
          </h2>
          <Button 
            variant="link" 
            className="text-amber-600 dark:text-amber-400 p-0 h-auto flex items-center"
            onClick={() => navigate('/subscription-plans')}
          >
            Tout voir
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                isPremium={feature.isPremium}
                isActive={activeFeature === index}
                onClick={() => setActiveFeature(index)}
              />
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-2 flex justify-center">
          <Button 
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
            onClick={() => navigate('/subscription-plans')}
          >
            Passer à Premium
          </Button>
        </div>
      </div>
    </Card>
  );
};
