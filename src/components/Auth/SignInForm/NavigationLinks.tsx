
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const NavigationLinks = () => {
  const { t } = useLanguage();
  
  return (
    <div className="w-full text-center space-y-2">
      <Link 
        to="/password-reset" 
        className="text-sm text-primary hover:underline"
      >
        {t("auth.forgotPassword")}
      </Link>
      
      <div className="pt-2 border-t border-border mt-2">
        <p className="text-sm text-muted-foreground">
          {t("auth.dontHaveAccount")} {" "}
          <Link 
            to="/signup" 
            className="text-primary font-medium hover:underline"
          >
            {t("auth.signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
};
