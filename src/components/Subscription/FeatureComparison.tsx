
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Check, X, HelpCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const FeatureComparison = () => {
  const features = [
    { 
      name: "Nombre d'exercices disponibles", 
      free: "50+", 
      premium: "200+",
      tooltip: "Accédez à une bibliothèque complète d'exercices avec vidéos et descriptions"
    },
    { 
      name: "Programmes d'entraînement", 
      free: "3 par mois", 
      premium: "Illimités",
      tooltip: "Créez et suivez des programmes d'entraînement adaptés à vos objectifs"
    },
    { 
      name: "Suivi de nutrition", 
      free: "Basique", 
      premium: "Avancé",
      tooltip: "Suivez vos apports quotidiens en calories, macronutriments et micronutriments"
    },
    { 
      name: "Plans de repas personnalisés", 
      free: false, 
      premium: true,
      tooltip: "Recevez des plans de repas adaptés à vos objectifs et préférences alimentaires"
    },
    { 
      name: "Analyse de posture vidéo", 
      free: false, 
      premium: true,
      tooltip: "Analysez votre technique d'exercice grâce à notre technologie d'IA"
    },
    { 
      name: "Analyse avancée du sommeil", 
      free: false, 
      premium: true,
      tooltip: "Obtenez des insights détaillés sur la qualité de votre sommeil et des recommandations"
    },
    { 
      name: "Coach IA personnel", 
      free: false, 
      premium: true,
      tooltip: "Bénéficiez de conseils personnalisés en temps réel pour atteindre vos objectifs"
    },
    { 
      name: "Suivi de progression", 
      free: "Limité", 
      premium: "Détaillé",
      tooltip: "Suivez votre progression avec des graphiques et des statistiques détaillées"
    },
    { 
      name: "Export de données", 
      free: false, 
      premium: true,
      tooltip: "Exportez vos données d'entraînement, de nutrition et de sommeil"
    },
    { 
      name: "Mode hors-ligne", 
      free: false, 
      premium: true,
      tooltip: "Accédez à vos programmes d'entraînement et plans de repas même sans connexion internet"
    },
    { 
      name: "Publicités", 
      free: true, 
      premium: false,
      tooltip: "Les utilisateurs premium bénéficient d'une expérience sans publicité",
      reversed: true
    },
    { 
      name: "Support prioritaire", 
      free: false, 
      premium: true,
      tooltip: "Bénéficiez d'un support client prioritaire"
    },
  ];

  return (
    <Card className="bg-background">
      <TooltipProvider>
        <Table>
          <TableCaption>
            Comparaison des fonctionnalités entre les plans Gratuit et Premium
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Fonctionnalité</TableHead>
              <TableHead className="text-center">Gratuit</TableHead>
              <TableHead className="text-center">Premium</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium flex items-center gap-2">
                  {feature.name}
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{feature.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-center">
                  {typeof feature.free === 'boolean' ? (
                    feature.free !== (feature.reversed || false) ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )
                  ) : (
                    <span>{feature.free}</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {typeof feature.premium === 'boolean' ? (
                    feature.premium !== (feature.reversed || false) ? (
                      <Check className="h-5 w-5 text-primary mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )
                  ) : (
                    <span className="text-primary font-medium">{feature.premium}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TooltipProvider>
    </Card>
  );
};
