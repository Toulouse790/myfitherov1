
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const SignInHeader = () => {
  const { t } = useLanguage();

  return (
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-bold text-center">
        {t("auth.signIn")}
      </CardTitle>
      <CardDescription className="text-center">
        {t("auth.enterCredentials", { fallback: "Entrez vos identifiants pour accéder à votre compte" })}
      </CardDescription>
    </CardHeader>
  );
};
