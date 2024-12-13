import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NavigationLinks = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center space-y-2">
      <p className="text-sm text-muted-foreground">
        Vous n'avez pas de compte ?{" "}
        <Button
          variant="link"
          className="p-0 h-auto font-semibold hover:text-primary transition-colors"
          onClick={() => navigate("/signup")}
        >
          Inscrivez-vous
        </Button>
      </p>
      <Button
        variant="link"
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
        onClick={() => navigate("/forgot-password")}
      >
        Mot de passe oublié ?
      </Button>
    </div>
  );
};