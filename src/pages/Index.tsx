
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { debugLogger } from "@/utils/debug-logger";
import Home from "./Home";
import { VerifyConnection } from "@/components/Workouts/VerifyConnection";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthenticationStatus } from "@/components/Home/AuthenticationStatus";

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-2">{t('common.loading', { fallback: 'Chargement...' })}</span>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <AuthenticationStatus />
      {user && (
        <>
          <VerifyConnection />
          <Home />
        </>
      )}
    </div>
  );
}
