import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const AccountActions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
      return;
    }
    navigate("/signin");
  };

  return (
    <div className="space-y-4">
      <Button
        variant="destructive"
        className="w-full"
        onClick={handleSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Se déconnecter
      </Button>
      <Button
        variant="ghost"
        className="w-full text-destructive hover:text-destructive"
        onClick={() => {
          toast({
            title: "Attention",
            description: "Cette action est irréversible. Contactez le support pour supprimer votre compte.",
            variant: "destructive",
          });
        }}
      >
        Supprimer le compte
      </Button>
    </div>
  );
};