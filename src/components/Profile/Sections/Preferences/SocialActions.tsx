import { MessageSquareText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const SocialActions = () => {
  const { toast } = useToast();

  const handleFeatureRequest = () => {
    window.location.href = "mailto:support@example.com?subject=Demande%20de%20fonctionnalité";
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:support@example.com";
  };

  const handleShareProgress = () => {
    const shareText = "💪 Je progresse dans mes objectifs fitness ! Rejoignez-moi sur FitApp pour suivre votre progression et atteindre vos objectifs ensemble ! 🎯 #FitProgress #FitnessJourney";
    const instagramUrl = `https://www.instagram.com/share?text=${encodeURIComponent(shareText)}`;
    window.open(instagramUrl, '_blank');
    
    toast({
      title: "Partage sur Instagram",
      description: "Partagez votre progression et inspirez votre communauté !",
    });
  };

  return (
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
  );
};