
import { Check, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const FeatureComparison = () => {
  const { t } = useLanguage();

  const features = [
    {
      category: "Entraînement",
      items: [
        {
          name: "Programmes d'entraînement",
          free: "3 par mois",
          premium: "Illimités"
        },
        {
          name: "Bibliothèque d'exercices",
          free: "Basique (50+ exercices)",
          premium: "Complète (200+ exercices)"
        },
        {
          name: "Analyse de posture",
          free: "Non",
          premium: "Oui"
        },
        {
          name: "Visualisation 3D des muscles",
          free: "Non",
          premium: "Oui"
        },
        {
          name: "Coach IA personnalisé",
          free: "Non",
          premium: "Oui"
        }
      ]
    },
    {
      category: "Nutrition",
      items: [
        {
          name: "Journal alimentaire",
          free: "Basique",
          premium: "Avancé"
        },
        {
          name: "Plans de repas personnalisés",
          free: "1 par mois",
          premium: "Illimités"
        },
        {
          name: "Scan de code-barres",
          free: "5 par jour",
          premium: "Illimité"
        },
        {
          name: "Reconnaissance d'image des plats",
          free: "Non",
          premium: "Oui"
        },
        {
          name: "Liste de courses automatique",
          free: "Non",
          premium: "Oui"
        }
      ]
    },
    {
      category: "Sommeil",
      items: [
        {
          name: "Suivi du sommeil",
          free: "Basique",
          premium: "Détaillé avec cycles"
        },
        {
          name: "Sons de relaxation",
          free: "3 sons disponibles",
          premium: "Bibliothèque complète"
        },
        {
          name: "Analyse et recommandations",
          free: "Limitée",
          premium: "Avancée et personnalisée"
        },
        {
          name: "Connexion appareils de suivi",
          free: "1 appareil",
          premium: "Multiple"
        },
        {
          name: "Hypnogramme du sommeil",
          free: "Non",
          premium: "Oui"
        }
      ]
    },
    {
      category: "Général",
      items: [
        {
          name: "Publicités",
          free: "Oui",
          premium: "Non"
        },
        {
          name: "Support",
          free: "Email standard",
          premium: "Prioritaire"
        },
        {
          name: "Exportation des données",
          free: "Format basique",
          premium: "Formats multiples et détaillés"
        },
        {
          name: "Fonctionnalités communautaires",
          free: "Limitées",
          premium: "Complètes"
        },
        {
          name: "Intégration avec appareils",
          free: "Limitée",
          premium: "Complète"
        }
      ]
    }
  ];

  return (
    <Card className="w-full overflow-hidden p-1 sm:p-4">
      <h3 className="text-xl font-semibold mb-4 px-4">Comparaison des fonctionnalités</h3>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Fonctionnalité</TableHead>
              <TableHead>Plan Gratuit</TableHead>
              <TableHead>Plan Premium</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((category) => (
              <>
                <TableRow key={category.category} className="bg-muted/40">
                  <TableCell colSpan={3} className="font-medium">{category.category}</TableCell>
                </TableRow>
                {category.items.map((feature, index) => (
                  <TableRow key={`${category.category}-${index}`}>
                    <TableCell className="font-medium">{feature.name}</TableCell>
                    <TableCell>
                      {feature.free === "Non" ? (
                        <X className="h-5 w-5 text-red-500" />
                      ) : (
                        <span className="text-sm">{feature.free}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {feature.premium === "Oui" ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <span className="text-sm font-medium">{feature.premium}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
