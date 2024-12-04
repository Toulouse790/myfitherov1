import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings2, MessageSquareText, Ruler, Scale, Share2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export const PreferencesSheet = () => {
  const { toast } = useToast();

  const handleUnitChange = (value: string) => {
    toast({
      title: "Unités mises à jour",
      description: "Vos préférences d'unités ont été enregistrées",
    });
  };

  const handleFeatureRequest = () => {
    window.location.href = "mailto:support@example.com?subject=Demande%20de%20fonctionnalité";
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:support@example.com";
  };

  const handleShareProgress = () => {
    // Création d'un message de partage personnalisé
    const shareText = "💪 Je progresse dans mes objectifs fitness ! Rejoignez-moi sur FitApp pour suivre votre progression et atteindre vos objectifs ensemble ! 🎯 #FitProgress #FitnessJourney";
    
    // Ouvrir Instagram avec le message pré-rempli
    const instagramUrl = `https://www.instagram.com/share?text=${encodeURIComponent(shareText)}`;
    window.open(instagramUrl, '_blank');
    
    toast({
      title: "Partage sur Instagram",
      description: "Partagez votre progression et inspirez votre communauté !",
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Préférences</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Unités de mesure
            </h3>
            <Select onValueChange={handleUnitChange} defaultValue="metric">
              <SelectTrigger>
                <SelectValue placeholder="Choisir le système" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Métrique (kg, cm)</SelectItem>
                <SelectItem value="imperial">Impérial (lb, in)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Unités de distance
            </h3>
            <Select onValueChange={handleUnitChange} defaultValue="km">
              <SelectTrigger>
                <SelectValue placeholder="Choisir l'unité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="km">Kilomètres</SelectItem>
                <SelectItem value="mi">Miles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleContactSupport}
            >
              <MessageSquareText className="mr-2 h-4 w-4" />
              Contactez-nous
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleFeatureRequest}
            >
              <MessageSquareText className="mr-2 h-4 w-4" />
              Demande de fonctionnalité
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleShareProgress}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Partager ma progression sur Instagram
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};