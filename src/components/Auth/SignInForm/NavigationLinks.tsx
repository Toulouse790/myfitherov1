
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const NavigationLinks = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-2 text-center text-sm">
      <Link 
        to="/reset-password"
        className="text-primary hover:underline"
      >
        {t("auth.forgotPassword")}
      </Link>
      <p className="text-muted-foreground">
        {t("auth.dontHaveAccount")}{" "}
        <Link to="/signup" className="text-primary hover:underline">
          {t("auth.signUp")}
        </Link>
      </p>
    </div>
  );
};
