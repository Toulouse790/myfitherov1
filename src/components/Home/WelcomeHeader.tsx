
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const WelcomeHeader = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  
  // Extraire le prénom de l'utilisateur s'il existe
  const firstName = user?.user_metadata?.first_name || user?.user_metadata?.name?.split(' ')[0] || '';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 mb-6"
    >
      <Avatar className="w-12 h-12 border">
        <AvatarImage src={user?.user_metadata?.avatar_url} />
        <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">
          {t('common.welcome', { fallback: 'Bonjour' })}{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t('common.fitnessJourney', { fallback: 'Votre parcours fitness commence ici' })}
        </p>
      </div>
    </motion.div>
  );
};
