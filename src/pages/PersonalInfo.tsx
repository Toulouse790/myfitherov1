
import { Header } from "@/components/Layout/Header";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserInfo } from "@/components/Profile/Sections/UserInfo";
import { useAuth } from "@/hooks/use-auth";

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

  const handleProfileUpdate = () => {
    console.log("Profile updated");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container max-w-4xl mx-auto px-4 py-6 space-y-6"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {t('profile.personalInfo', { fallback: 'Informations personnelles' })}
          </h1>
        </div>

        <Card className="p-6">
          {user ? (
            <UserInfo profile={{ id: user.id }} onUpdate={handleProfileUpdate} />
          ) : (
            <div className="text-center p-4">
              <p className="text-muted-foreground">{t('common.loading', { fallback: 'Chargement...' })}</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default PersonalInfo;
